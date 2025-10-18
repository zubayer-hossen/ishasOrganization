import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiMail, FiSend } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
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
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(res.data.msg);
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Enter your registered email address and we’ll send you a password
          reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-blue-500" />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-10 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                <FiSend /> Send Reset Link
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
