import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import memberReducer from "../redux/slices/memberSlice";
import adminReducer from "../redux/slices/adminSlice";
import noticeReducer from "../redux/slices/noticeSlice";
import blogReducer from "../redux/slices/blogSlice";
import transactionReducer from "../redux/slices/transactionSlice";

// ✅ Correct: axios instance import করা হচ্ছে যা Interceptor-সহ কনফিগার করা
import API from "../utils/axiosInstance"; 

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
        extraArgument: API, // ✅ thunk এর ভিতর API instance ব্যবহার করা যাবে
      },
      // serializableCheck disabled রাখা হলো যদি state-এ non-serializable data থাকে
      serializableCheck: false,
    }),
});

export default store;
