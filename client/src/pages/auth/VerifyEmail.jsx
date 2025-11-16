import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast"; // Using react-hot-toast for consistency

// IMPORTANT: Replace this with your actual backend base URL
const BACKEND_BASE_URL = "https://ishasorganizationbackend.onrender.com";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  // Get the token from the query string (e.g., ?token=...)
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    if (!token) {
      setMessage("Error: Verification token missing from the URL.");
      setLoading(false);
      toast.error("Verification token missing!");
      return;
    }

    const verifyUserEmail = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_BASE_URL}/api/auth/verify-email/${token}`
        );

        // Successful verification
        setMessage(
          res.data.msg || "Your email has been successfully verified!"
        );
        setSuccess(true);
        toast.success("✅ Email verified successfully!");
      } catch (err) {
        // Failed verification (e.g., invalid or expired token)
        const errorMsg =
          err.response?.data?.msg ||
          "Email verification failed due to a server error.";
        setMessage(`Error: ${errorMsg}`);
        setSuccess(false);
        toast.error(`❌ ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, [token]);

  // Determine the state-based content and styling
  let icon = null;
  let colorClass = "text-gray-600";

  if (loading) {
    icon = (
      <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
    colorClass = "text-blue-500";
  } else if (success) {
    icon = (
      <svg
        className="h-8 w-8 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
    colorClass = "text-green-600";
  } else {
    icon = (
      <svg
        className="h-8 w-8 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
    colorClass = "text-red-600";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md text-center border border-gray-100">
        <div className="mb-6 flex justify-center">{icon}</div>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Email Verification Status
        </h2>

        <p className={`text-lg font-medium mb-8 ${colorClass}`}>{message}</p>

        {!loading && (
          <Link
            to="/login"
            className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg font-semibold"
          >
            Proceed to Login
          </Link>
        )}
      </div>
    </div>
  );
}
