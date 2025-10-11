// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import memberReducer from "../redux/slices/memberSlice";
import adminReducer from "../redux/slices/adminSlice";
import noticeReducer from "../redux/slices/noticeSlice";
import blogReducer from "../redux/slices/blogSlice";
import transactionReducer from "../redux/slices/transactionSlice";

import API from "../utils/axiosInstance"; // 🔹 axios instance import

// Optional: axios instance কে store এ inject করা (useful for thunks)
const store = configureStore({
  reducer: {
    auth: authReducer,
    member: memberReducer,
    admin: adminReducer,
    notice: noticeReducer,
    blog: blogReducer,
    transactions: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: API, // 🔹 thunk এর ভিতর axios instance ব্যবহার করা যাবে
      },
      serializableCheck: false,
    }),
});

export default store;
