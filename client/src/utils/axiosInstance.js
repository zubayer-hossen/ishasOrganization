// src/utils/axiosInstance.js (The centralized and fixed API client)

import axios from 'axios';

// 1. Axios Instance Creation
const axiosInstance = axios.create({
  // ✅ Environment variable ব্যবহার করা ভালো, fallback হিসেবে হার্ডকোড করা হলো।
  baseURL:'https://ishasorganizationbackend.onrender.com/api',
  withCredentials: true, // Refresh token cookie পাঠানোর জন্য অপরিহার্য
});

/**
 * এই ফাংশনটি Redux store কে প্যারামিটার হিসেবে নেয় এবং interceptor সেটআপ করে।
 * এটি circular dependency সমস্যার সমাধান করে (এক্ষেত্রে dynamic import এর মাধ্যমে)।
 * আপনার main.jsx/App.jsx ফাইলে এটি কল করতে হবে।
 * @param {Store} store - The Redux store instance.
 */
export const setupInterceptors = (store) => {

  // 2. Request Interceptor: প্রতিটি API call-এর আগে Redux State থেকে টোকেন যোগ করার জন্য
  axiosInstance.interceptors.request.use(
    (config) => {
      // ✅ FIX: localStorage এর বদলে সরাসরি Redux state থেকে টোকেন নেওয়া হচ্ছে
      const token = store.getState().auth.accessToken; 
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 3. Response Interceptor: 401 error পেলে টোকেন রিফ্রেশ করার জন্য
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      // যদি 401 error হয়, এবং এটি Refresh Token Endpoint না হয়, এবং প্রথমবার retry করা হয়
      if (
        err.response?.status === 401 && 
        !originalRequest._retry &&
        originalRequest.url !== '/auth/refresh_token'
      ) {
        originalRequest._retry = true;

        try {
          // নতুন access token-এর জন্য API call (এই রিকোয়েস্টে withCredentials: true প্রয়োজন)
          // 💡 এখানে axiosInstance ব্যবহার করা হচ্ছে কারণ এতে withCredentials: true আছে 
          const res = await axiosInstance.post('/auth/refresh_token');
          const newAccessToken = res.data.accessToken;

          // ✅ FIX: dynamic import ব্যবহার করে circular dependency এড়ানো হয়েছে
          const { setAccessToken } = await import('../redux/slices/authSlice');
          store.dispatch(setAccessToken(newAccessToken)); // Redux state আপডেট

          // মূল রিকোয়েস্টের header-এ নতুন টোকেন সেট করা
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // নতুন টোকেন দিয়ে মূল রিকোয়েস্টটি আবার পাঠানো
          return axiosInstance(originalRequest);
          
        } catch (e) {
          console.error("Refresh Token Failed. User is being logged out.", e);
          // যদি refresh token call ব্যর্থ হয়, তাহলে ব্যবহারকারীকে logout করা হবে
          const { logout } = await import('../redux/slices/authSlice');
          store.dispatch(logout());
          // window.location.href = '/login'; // প্রয়োজনে রিডাইরেক্ট 
          return Promise.reject(e);
        }
      }
      
      // অন্য 401 error বা অন্য কোনো error হলে, সরাসরি Reject করা
      return Promise.reject(err);
    }
  );
};

// 4. Export the instance for use in Redux Thunks
export default axiosInstance;