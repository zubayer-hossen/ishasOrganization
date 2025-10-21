// frontend/src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [returnedToken, setReturnedToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://ishasorganizationbackend.onrender.com/api/auth/forgot-password",
        { email }
      );
      toast.success(res.data.msg || "If email exists, reset sent.");
      if (res.data.resetToken) {
        setReturnedToken(res.data.resetToken);
      }
      // Optionally navigate to a page that allows manual paste
      // navigate("/reset-password-manual");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Server error");
      if (err.response?.data?.resetToken) {
        setReturnedToken(err.response.data.resetToken);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button
            className="w-full bg-blue-600 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {returnedToken && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              Debug mode: Your reset token (copy it):
            </p>
            <pre className="mt-2 text-sm break-words">{returnedToken}</pre>
            <p className="text-xs text-gray-500 mt-2">
              Use it on the manual reset page.
            </p>
            <button
              onClick={() => navigate("/reset-password-manual")}
              className="mt-2 text-sm text-blue-600 underline"
            >
              Go to manual reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
