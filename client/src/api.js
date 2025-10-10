// src/api.js (Fully Updated with Token Refresh)
import axios from "axios";

// ✅ Base URL Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ 1. Main axios instance তৈরি
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Refresh token cookie পাঠানোর জন্য
});

// ✅ 2. Separate instance for Refresh Token (No interceptors needed here)
const refreshApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// A flag to prevent multiple refresh calls simultaneously
let isRefreshing = false;
let failedQueue = [];

// A function to process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ----------------------------------------------------------------------
// 3. Request Interceptor (Access Token Attach)
// ----------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------------------------------------
// 4. Response Interceptor (Token Refresh & Retry Logic)
// ----------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // ⚠️ Check if error is 401 AND it hasn't been retried yet (to prevent infinite loops)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark as retried
      originalRequest._retry = true;

      // If we are already refreshing, push the failed request to the queue
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        // 🚀 Call the refresh endpoint to get a new access token (using separate instance)
        // Ensure you have a working /api/auth/refresh endpoint in your backend
        const refreshResponse = await refreshApi.post('/auth/refresh'); 
        const newAccessToken = refreshResponse.data.accessToken;

        // 1. Save new token
        localStorage.setItem("accessToken", newAccessToken);

        // 2. Update Authorization header for the failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 3. Process the queue of failed requests
        processQueue(null, newAccessToken);

        // 4. Reset flag
        isRefreshing = false; 

        // 5. Re-run the original request
        return api(originalRequest);
        
      } catch (refreshError) {
        // If refresh fails (e.g., refresh token expired/invalid)
        isRefreshing = false;
        processQueue(refreshError);
        
        // 🚨 Logout the user (Example logic)
        localStorage.removeItem("accessToken");
        // Optionally redirect to login page (window.location = '/login')
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;