// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCreditCard,
} from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    nid: "",
    address: "",
    occupation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      fatherName,
      email,
      password,
      confirmPassword,
      phone,
      address,
      nid,
    } = formData;

    // ✅ Required field validation
    if (
      !name ||
      !fatherName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address ||
      !nid
    ) {
      toast.error("সব আবশ্যক ঘর পূরণ করুন!");
      return;
    }

    // ✅ Password match validation
    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না!");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/register", formData);
      toast.success(res.data.msg);
      navigate("/login");
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.msg || "Server error. Try again later.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Gradient Card */}
        <div className="md:w-1/2 bg-gradient-to-tr from-purple-700 to-pink-600 text-white p-10 flex flex-col justify-center items-center text-center relative">
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
            className="p-5 border-2 border-white rounded-full"
          >
            <FiUser className="w-12 h-12" />
          </motion.div>
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6 border-b pb-3">
            নতুন সদস্য নিবন্ধন
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              icon={<FiUser />}
              label="পুরো নাম *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="আপনার নাম লিখুন"
            />
            <InputField
              icon={<FiUser />}
              label="পিতার নাম *"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              placeholder="পিতার নাম লিখুন"
            />
            <InputField
              icon={<FiMail />}
              label="ইমেইল *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
            />
            <InputField
              icon={<FiPhone />}
              label="মোবাইল নাম্বার *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
            />
            <InputField
              icon={<FiCreditCard />}
              label="এনআইডি (ঐচ্ছিক)"
              name="nid"
              value={formData.nid}
              onChange={handleChange}
              placeholder="NID নম্বর"
            />
            <InputField
              icon={<FiMapPin />}
              label="ঠিকানা *"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="বর্তমান ঠিকানা লিখুন"
            />
            <InputField
              icon={<FiBriefcase />}
              label="পেশা"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="পেশার নাম লিখুন"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                icon={<FiLock />}
                label="পাসওয়ার্ড *"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="******"
              />
              <InputField
                icon={<FiLock />}
                label="পাসওয়ার্ড নিশ্চিত করুন *"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="******"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-bold text-white rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex justify-center items-center ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "রেজিস্টার করুন"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-5">
            ইতিমধ্যেই একাউন্ট আছে?{" "}
            <Link
              to="/login"
              className="text-purple-700 font-medium hover:underline"
            >
              লগইন করুন
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ====================
// Reusable InputField Component
// ====================
const InputField = ({
  icon,
  label,
  name,
  type = "text",
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
      className={`w-full border border-gray-300 rounded-xl px-4 py-2 pl-10 focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-300`}
    />
  </div>
);
