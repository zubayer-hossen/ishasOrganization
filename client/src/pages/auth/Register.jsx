import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        toast.success("Registration successful! Please verify your email.");
        navigate("/login");
      })
      .catch((err) => toast.error(`❌ ${err}`));
  };

  useEffect(() => {
    if (error) toast.error(`❌ ${error}`);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 w-96 md:w-[28rem]"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Join ISHAS 🕊️
        </h2>

        {/* Input Fields */}
        {[
          { label: "Full Name", name: "name", type: "text" },
          { label: "Father's Name", name: "fatherName", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          { label: "Phone (optional)", name: "phone", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "Occupation", name: "occupation", type: "text" },
        ].map((input) => (
          <div key={input.name} className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              {input.label}
            </label>
            <input
              type={input.type}
              name={input.name}
              value={formData[input.name]}
              onChange={handleChange}
              required={["name", "email", "password"].includes(input.name)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 mt-4 rounded-lg font-semibold transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
