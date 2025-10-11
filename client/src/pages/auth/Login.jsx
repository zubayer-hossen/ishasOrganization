import { useState } from "react";
// NOTE: Assuming useDispatch, useSelector, loginUser, Link, useNavigate, and toast are available in the runtime environment
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../redux/slices/authSlice";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import { motion } from "framer-motion";
// import { FiMail, FiLock, FiLogIn, FiLoader } from "react-icons/fi";

// Mock imports for a self-contained, runnable example. In a real project, you would use the actual imports.
const useDispatch = () => (fn) =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          unwrap: () =>
            Promise.resolve({
              user: { name: "User", isVerified: true, role: "member" },
              accessToken: "token",
            }),
        }),
      1000
    )
  ); // Mock dispatch
const useSelector = (selector) => selector({ auth: { loading: false } }); // Mock selector
const useNavigate = () => (path) => console.log(`Navigating to ${path}`); // Mock navigate
const Link = ({ to, children, className }) => (
  <a href={to} className={className}>
    {children}
  </a>
); // Mock Link
const toast = {
  success: (msg) => console.log(`SUCCESS: ${msg}`),
  error: (msg) => console.error(`ERROR: ${msg}`),
}; // Mock toast
const FiMail = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const FiLock = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0110 0v4"></path>
  </svg>
);
const FiLogIn = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);
const FiLoader = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v4"></path>
    <path d="M12 18v4"></path>
    <path d="M4.93 4.93l2.83 2.83"></path>
    <path d="M16.24 16.24l2.83 2.83"></path>
    <path d="M2 12h4"></path>
    <path d="M18 12h4"></path>
    <path d="M4.93 19.07l2.83-2.83"></path>
    <path d="M16.24 7.76l2.83-2.83"></path>
  </svg>
);

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Mocking the auth state for self-contained example
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
    // Logic remains the same, but using mock dispatch/navigation
    try {
      const result = await dispatch({
        type: "MOCK_LOGIN",
        payload: formData,
      }).unwrap();

      const user = result.user;

      // NOTE: Using a mock for localStorage for the self-contained environment
      console.log("Mocking login success and token storage...");

      if (!user.isVerified) {
        toast.error("❌ Please verify your email before logging in.");
        return;
      }

      // ✅ Role-based redirection
      if (["admin", "owner", "kosadhokko"].includes(user.role)) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      toast.success(`✅ Welcome back, ${user.name}!`);
    } catch (err) {
      toast.error(err || "❌ Invalid credentials. Please try again.");
    }
  };

  return (
    // Outer Container: Deep, galaxy-like gradient background
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 font-inter">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
        // Overall Container: Large size, rounded edges
        className="w-full max-w-5xl mx-auto rounded-[2.5rem] flex flex-col md:flex-row overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
      >
        {/* Left Side: The Gorgeous Marketing Panel */}
        <div
          className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center items-center text-center 
                        bg-gradient-to-br from-fuchsia-600/70 to-indigo-700/70 
                        backdrop-blur-sm text-white border-r border-white/10"
        >
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "tween" }}
          >
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              ISHAS ✨
            </h1>
            <h1 className="text-2xl font-semibold mb-3 tracking-wide">
              Welcome Back!
            </h1>
            <p className="text-lg text-indigo-100/90 font-light max-w-sm mx-auto">
              Securely access your cosmic dashboard and manage organization
              activities.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Glassmorphism Login Form */}
        <div
          className="w-full md:w-1/2 p-8 md:p-14 
                        bg-white/10 backdrop-blur-xl border border-white/20
                        flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold mb-10 text-white text-center drop-shadow-md">
            Member Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <FiMail
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white/60 z-10"
                size={20}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                // Glassy Input Styling
                className="w-full bg-white/15 border border-white/30 text-white placeholder-white/70 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 outline-none transition-all duration-300 shadow-inner"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FiLock
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white/60 z-10"
                size={20}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                // Glassy Input Styling
                className="w-full bg-white/15 border border-white/30 text-white placeholder-white/70 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 outline-none transition-all duration-300 shadow-inner"
                required
              />
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 25px rgba(244, 114, 182, 0.6)",
              }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              // Button Style: Intense gradient with bold typography
              className={`w-full py-4 mt-6 rounded-xl font-extrabold text-white text-lg shadow-2xl transition-all duration-300 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700"
              } flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-3" size={20} />
                  <span>Entering Orbit...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="mr-3" size={20} />
                  <span>Login to Dashboard</span>
                </>
              )}
            </motion.button>

            {/* Footer Link */}
            <p className="text-sm text-center text-white/80 pt-4">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-fuchsia-300 hover:text-fuchsia-400 font-bold transition-colors underline-offset-4 hover:underline"
              >
                Create one now
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
