import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS import করতে ভুলবেন না

// ✅ FIXED: axios setup-এর জন্য setupInterceptors ফাংশনটি axiosInstance থেকে import করা হলো
import { setupInterceptors } from "./utils/axiosInstance.js";
import store from "./app/store.js";

// ✅ CRITICAL STEP: Store তৈরি হওয়ার সাথে সাথেই interceptor সেটআপ করুন
// এটিই circular dependency এড়িয়ে API call-এ token এবং refresh logic নিশ্চিত করে।
setupInterceptors(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
               {" "}
    <Provider store={store}>
                  <App />      {/* ToastContainer: নোটিফিকেশন দেখানোর জন্য */} 
               {" "}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
                   {" "}
    </Provider>
           {" "}
  </React.StrictMode>
);
