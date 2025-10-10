import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiLogIn, FiLoader } from "react-icons/fi";

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

      // ✅ Check email verification
      if (!user.isVerified) {
        toast.error("❌ Please verify your email before logging in.");
        return;
      }

      // ✅ Save user and token
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", result.accessToken);

      toast.success(`✅ Welcome back, ${user.name}!`);

      // ✅ Role-based redirection
      if (["admin", "owner", "kosadhokko"].includes(user.role)) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err || "❌ Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <h1 className="text-4xl font-bold mb-3">Welcome Back!</h1>
          <p className="text-lg text-indigo-200">
            Log in to access your account and manage your activities.
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            Member Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-gray-300 border rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                required
              />
            </div>

            <div className="relative">
              <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-gray-300 border rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 flex items-center justify-center disabled:bg-blue-400 transition-all duration-300"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  <span>Login</span>
                </>
              )}
            </button>

            <p className="text-sm text-center text-gray-600 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-semibold"
              >
                Create one now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
