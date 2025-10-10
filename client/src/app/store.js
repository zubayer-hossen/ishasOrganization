// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import memberReducer from "../redux/slices/memberSlice";
import adminReducer from "../redux/slices/adminSlice";
import noticeReducer from "../redux/slices/noticeSlice";
import blogReducer from "../redux/slices/blogSlice";
import transactionReducer from "../redux/slices/transactionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    member: memberReducer,
    admin: adminReducer,
    notice: noticeReducer,
    blog: blogReducer,
    transactions: transactionReducer,
  },
});

export default store;
