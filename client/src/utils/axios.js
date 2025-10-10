// src/utils/axios.js

import axios from 'axios';
// ❌ Redux বা store থেকে কোনো কিছু import করা হবে না

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // আপনার API URL
  withCredentials: true,
});

/**
 * এই ফাংশনটি store কে প্যারামিটার হিসেবে নেয় এবং interceptor সেটআপ করে।
 * এটি circular dependency সমস্যার সমাধান করে।
 * @param {Store} store - The Redux store instance.
 */
export const setupInterceptors = (store) => {
  // Request Interceptor: প্রতিটি API call-এর আগে টোকেন যোগ করার জন্য
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: 401 error পেলে টোকেন রিফ্রেশ করার জন্য
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      // যদি 401 error হয় এবং এটি প্রথমবার retry করা হয়
      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // নতুন access token-এর জন্য API call
          const res = await axiosInstance.post('/auth/refresh_token');
          const newAccessToken = res.data.accessToken;

          // ✅ পরিবর্তন: সরাসরি state পরিবর্তন না করে action dispatch করা হচ্ছে
          // dynamic import ব্যবহার করে circular dependency এড়ানো হয়েছে
          const { setAccessToken } = await import('../redux/slices/authSlice');
          store.dispatch(setAccessToken(newAccessToken));

          // মূল রিকোয়েস্টের header-এ নতুন টোকেন সেট করা
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // নতুন টোকেন দিয়ে মূল রিকোয়েস্টটি আবার পাঠানো
          return axiosInstance(originalRequest);
        } catch (e) {
          // যদি refresh token call ব্যর্থ হয়, তাহলে ব্যবহারকারীকে logout করা হবে
          const { logout } = await import('../redux/slices/authSlice');
          store.dispatch(logout());
          // প্রয়োজনে ব্যবহারকারীকে লগইন পেজে redirect করা যেতে পারে
          // window.location.href = '/login';
        }
      }
      return Promise.reject(err);
    }
  );
};

export default axiosInstance;