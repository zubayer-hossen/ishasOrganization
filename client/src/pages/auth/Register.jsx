// src/pages/auth/Register.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    occupation: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        toast.success("✅ Registration successful! Please verify your email.");
        navigate("/login");
      })
      .catch((err) => toast.error(`❌ ${err}`));
  };

  useEffect(() => {
    if (error) toast.error(`❌ ${error}`);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 p-6 relative overflow-hidden">
      {/* Background Floating Circles */}
      <div className="absolute w-72 h-72 bg-pink-300 opacity-30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-indigo-400 opacity-25 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl p-8 w-full max-w-lg text-white"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-3">
            <UserPlus className="w-12 h-12 text-white drop-shadow-md" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-wide">
            Join <span className="text-yellow-300">ISHAS 🕊️</span>
          </h2>
          <p className="text-sm mt-2 text-indigo-100">
            Become part of our growing family of change makers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "name", type: "text", required: true },
            { label: "Father's Name", name: "fatherName", type: "text" },
            {
              label: "Email Address",
              name: "email",
              type: "email",
              required: true,
            },
            { label: "Phone Number", name: "phone", type: "text" },
            { label: "Address", name: "address", type: "text" },
            { label: "Occupation", name: "occupation", type: "text" },
          ].map((input) => (
            <div key={input.name}>
              <label className="block text-sm font-semibold text-indigo-100 mb-1">
                {input.label}
              </label>
              <input
                type={input.type}
                name={input.name}
                value={formData[input.name]}
                onChange={handleChange}
                required={input.required}
                className="w-full bg-white/20 border border-white/40 text-white placeholder-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 outline-none transition-all"
                placeholder={`Enter ${input.label}`}
              />
            </div>
          ))}

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-indigo-100 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white/20 border border-white/40 text-white placeholder-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 outline-none pr-10"
              placeholder="Enter your password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 cursor-pointer text-gray-200 hover:text-yellow-300 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-xl font-semibold text-indigo-900 bg-yellow-300 shadow-lg hover:bg-yellow-400 transition ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
          >
            {loading ? "Registering..." : "Register Now"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-sm mt-6 text-center text-indigo-100">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-300 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
