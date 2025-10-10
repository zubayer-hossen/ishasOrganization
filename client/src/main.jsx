// src/main.jsx (অথবা src/index.js)

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

// আপনার store import করুন (path ঠিক আছে কিনা নিশ্চিত করুন)
import store from "./app/store.js";

// ✅ পরিবর্তন: axios.js থেকে setupInterceptors ফাংশনটি import করুন
import { setupInterceptors } from "./utils/axios.js";

// ✅ পরিবর্তন: store তৈরি হওয়ার পর interceptor সেটআপ করুন
// এই একটি লাইনই store এবং axios-কে সঠিকভাবে সংযুক্ত করবে
setupInterceptors(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  </React.StrictMode>
);
