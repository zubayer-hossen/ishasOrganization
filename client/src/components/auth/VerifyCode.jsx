// এই কম্পোনেন্টটিকে একক ফাইলে চালানোর জন্য, Redux, react-router-dom, react-icons, এবং framer-motion-এর মতো বাহ্যিক নির্ভরতা (external dependencies) সরানো হয়েছে।
// API কলগুলি এখন Mocked Asynchronous Functions দ্বারা প্রতিস্থাপিত হয়েছে।
import React, { useState, useEffect, useRef } from "react";

// Lucide/Feather Icons-এর পরিবর্তে ইনলাইন SVG ব্যবহার করা হয়েছে
const FiMail = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const FiCheckCircle = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.05-8.94" />
    <path d="M22 4 12 14.01l-3-3.01" />
  </svg>
);
const FiSend = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4 20-7z" />
  </svg>
);
const FiLoader = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="m4.93 4.93 2.83 2.83" />
    <path d="m16.24 16.24 2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="m4.93 19.07 2.83-2.83" />
    <path d="m16.24 7.76 2.83-2.83" />
  </svg>
);

// ===============================================
// Mock API Functions (Backend Simulation)
// ===============================================

/**
 * Mocking the verifyCode API call.
 * কোড '123456' দিলে সফল হবে, অন্যথায় ব্যর্থ হবে।
 */
const mockVerifyCode = async ({ email, code }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (code !== "123456") {
    throw new Error("Invalid verification code. Please try again.");
  }
  return {
    msg: "Email verified successfully. Redirecting to login...",
    success: true,
  };
};

/**
 * Mocking the resendCode API call.
 * ✅ FIX: এই লজিকটি এখন ফ্রন্টএন্ডে resend-এর সফলতাকে সিমুলেট করবে।
 */
const mockResendCode = async (email) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    msg: `A new 6-digit code has been successfully sent to ${email}.`,
    success: true,
  };
};

export default function VerifyCode() {
  // Redux/Router state replaced by component state
  const [email] = useState("user@example.com"); // ডেমো হিসেবে হার্ডকোড করা হলো
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const inputRefs = useRef([]);

  // Timer Effect for Resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle OTP input and auto-focus
  const handleCodeChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Auto-focus next input on non-empty input
    if (value !== "" && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace key press
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      code[index] === "" &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
      const newCode = [...code];
      newCode[index - 1] = ""; // Clear previous field
      setCode(newCode);
    }
  };

  // Handle full submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    const fullCode = code.join("");

    if (!email) {
      setError("❌ ইমেল অনুপস্থিত। অনুগ্রহ করে লগইন করুন।");
      return;
    }
    if (fullCode.length !== 6) {
      setError("❌ সম্পূর্ণ ৬-সংখ্যার কোডটি লিখুন।");
      return;
    }

    setIsLoading(true);
    try {
      const res = await mockVerifyCode({ email, code: fullCode });
      setSuccessMessage(res.msg);
      // সফল হলে, /login-এ নেভিগেট করার মক
      console.log(res.msg + " (Redirecting mock)");
    } catch (err) {
      setError(err.message || "ভেরিফিকেশন ব্যর্থ হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resend Code
  const handleResend = async () => {
    // resendTimer > 0, isResending, বা email না থাকলে বন্ধ
    if (resendTimer > 0 || isResending || !email) return;

    setError(null);
    setSuccessMessage(null);
    setIsResending(true);

    try {
      const res = await mockResendCode(email);
      setSuccessMessage(res.msg);
      setResendTimer(60); // ✅ FIX: টাইমার রিসেট করা হলো
      setCode(["", "", "", "", "", ""]); // কোড ফিল্ড ক্লিয়ার করা হলো
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err) {
      setError(err.message || "পুনরায় পাঠানো ব্যর্থ হয়েছে");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 font-sans">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center border-t-8 border-indigo-500 transform transition-all duration-300 hover:shadow-indigo-300/50">
        <FiMail className="w-12 h-12 text-indigo-600 mx-auto mb-4" />   
        <h2 className="text-3xl font-extrabold mb-3 text-gray-800">
          আপনার ইমেল যাচাই করুন
        </h2>
        <p className="text-gray-500 mb-6">
          আমরা একটি ৬-সংখ্যার কোড পাঠিয়েছি{" "}
          <strong className="text-indigo-600 font-bold break-all">
            {email}
          </strong>
          -এ।
        </p>
        {/* Status Messages */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-sm font-medium border border-green-300 shadow-sm">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm font-medium border border-red-300 shadow-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition duration-200 shadow-inner hover:border-indigo-400"
                onFocus={(e) => e.target.select()}
                disabled={isLoading || isResending}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || isResending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center disabled:opacity-50 mb-4 transition duration-300 ease-in-out transform hover:scale-[1.01] shadow-lg shadow-indigo-500/50"
          >
            {isLoading ? (
              <FiLoader className="animate-spin w-5 h-5 mr-2" />
            ) : (
              <FiCheckCircle className="w-5 h-5 mr-2" />
            )}
            {isLoading ? "যাচাই করা হচ্ছে..." : "কোড যাচাই করুন"}
          </button>
        </form>
        <div className="mt-4 text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-500">
              কোড পুনরায় পাঠান{" "}
              <strong className="text-indigo-600 font-bold">
                {resendTimer}s
              </strong>{" "}
              পর
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-blue-600 hover:text-blue-700 font-bold disabled:opacity-50 flex items-center justify-center w-full transition duration-150"
            >
              {isResending ? (
                <FiLoader className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <FiSend className="w-4 h-4 mr-2" />
              )}
              {isResending ? "পাঠানো হচ্ছে..." : "কোড পুনরায় পাঠান"}
            </button>
          )}
        </div>
        <div
          onClick={() => console.log("Mock navigation to /login")}
          className="block mt-5 text-indigo-600 hover:underline text-sm font-semibold cursor-pointer"
        >
          লগইন-এ ফিরে যান
        </div>
      </div>
    </div>
  );
}
