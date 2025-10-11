// src/utils/axiosInstance.js
import axios from "axios";

// ✅ Backend API Base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://ishasorganizationbackend.onrender.com/api",
  withCredentials: true, // Cookies / Auth credentials পাঠানোর জন্য
});

// ✅ Request Interceptor → প্রতিটি request এ token যোগ করবে
API.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor → Error handle করবে সুন্দরভাবে
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Unauthorized হলে logout করে login page এ পাঠাবে
      if (status === 401) {
        console.warn("⚠️ Unauthorized! Logging out...");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      // Server Error হলে console এ দেখাবে
      else if (status >= 500) {
        console.error("🔥 Server Error:", error.response.data?.message || "Internal Server Error");
      }

      // অন্য error হলে simple alert
      else {
        console.warn("⚠️ API Error:", error.response.data?.message || "Something went wrong!");
      }
    } else {
      console.error("❌ Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
