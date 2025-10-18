// src/pages/auth/Login.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiLogIn, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      const user = result.user;

      if (!user.isVerified) {
        toast.error("❌ Please verify your email before logging in.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", result.accessToken);

      toast.success(`✅ Welcome back, ${user.name}!`);

      if (["admin", "owner", "kosadhokko"].includes(user.role)) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err || "❌ Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Side: Gradient Card */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center items-center text-center bg-gradient-to-tr from-blue-700 to-indigo-800 text-white relative">
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-extrabold mb-4"
          >
            ISHAS
          </motion.h1>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg font-light mb-6"
          >
            "Together We Build a Better Future"
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-5 border-2 border-white rounded-full shadow-lg"
          >
            <FiLogIn className="w-12 h-12" />
          </motion.div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6 border-b pb-3">
            Member Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              icon={<FiMail />}
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              icon={<FiLock />}
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 font-semibold text-white rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-center items-center ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Login
                </>
              )}
            </motion.button>

            <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline">
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ====================
// InputField Component
// ====================
const InputField = ({
  icon,
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
}) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <label className="block text-gray-700 mb-1 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-xl px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
      required
    />
  </div>
);
