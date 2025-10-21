import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css"; // Custom CSS file

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    nid: "",
    occupation: "",
    bloodGroup: "Unknown",
    avatar: "",
    bio: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Input Change Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Basic Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required!";
    if (!formData.fatherName.trim())
      newErrors.fatherName = "Father’s name is required!";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email required!";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters!";
    if (!formData.phone.match(/^[0-9]{10,15}$/))
      newErrors.phone = "Valid phone number required!";
    if (!formData.nid.trim()) newErrors.nid = "NID is required!";
    if (!formData.address.trim()) newErrors.address = "Address is required!";
    return newErrors;
  };

  // ✅ Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please correct the highlighted errors!");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await axios.post(
        "https://ishasorganizationbackend.onrender.com/api/auth/register",
        formData
      );
      toast.success(res.data.msg || "Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-bg min-h-screen flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="register-card w-full max-w-4xl p-10 rounded-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-lg">
          ✨ Create Your ISHAS Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                className={`input ${errors.name ? "input-error" : ""}`}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
            <div>
              <input
                type="text"
                name="fatherName"
                placeholder="Father’s Name *"
                value={formData.fatherName}
                onChange={handleChange}
                className={`input ${errors.fatherName ? "input-error" : ""}`}
              />
              {errors.fatherName && (
                <p className="error-text">{errors.fatherName}</p>
              )}
            </div>
          </div>

          {/* Email & Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                className={`input ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
                className={`input ${errors.password ? "input-error" : ""}`}
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Phone & NID */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone *"
                value={formData.phone}
                onChange={handleChange}
                className={`input ${errors.phone ? "input-error" : ""}`}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>
            <div>
              <input
                type="text"
                name="nid"
                placeholder="NID *"
                value={formData.nid}
                onChange={handleChange}
                className={`input ${errors.nid ? "input-error" : ""}`}
              />
              {errors.nid && <p className="error-text">{errors.nid}</p>}
            </div>
          </div>

          {/* Address & Occupation */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="address"
                placeholder="Address *"
                value={formData.address}
                onChange={handleChange}
                className={`input ${errors.address ? "input-error" : ""}`}
              />
              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>
            <input
              type="text"
              name="occupation"
              placeholder="Occupation (Optional)"
              value={formData.occupation}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Blood Group & Avatar */}
          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="input"
            >
              <option value="Unknown">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <input
              type="text"
              name="avatar"
              placeholder="Profile Image URL (Optional)"
              value={formData.avatar}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Bio */}
          <textarea
            name="bio"
            placeholder="Short Bio (Optional)"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="input"
          ></textarea>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            type="submit"
            className={`submit-btn ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Register Now"}
          </motion.button>
        </form>

        <p className="text-center text-white/80 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-300 hover:underline cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
