import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(res.data.msg);
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
