// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AuditLog = require("../models/AuditLog");
const sendEmail = require("../utils/sendEmail"); // Make sure you have an email sender util

// ===============================
// JWT Token Creation
// ===============================
const createAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

// ===============================
// Register Controller
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, fatherName, email, password, phone, address, nid, occupation, avatar, bio } = req.body;

    if (!name || !email || !password || !fatherName || !phone || !address || !nid)
      return res.status(400).json({ msg: "All required fields must be provided." });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      fatherName,
      email,
      password: hashed,
      phone,
      address,
      nid,
      occupation,
      avatar,
      bio,
      isVerified: true, // Directly verified
    });

    await AuditLog.create({ action: "register", actor: user._id, detail: { email } });

    res.status(201).json({
      msg: "✅ Registered successfully!",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// ===============================
// Login Controller
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const accessToken = createAccessToken(user);

    await AuditLog.create({ action: "login", actor: user._id, detail: {} });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        fatherName: user.fatherName,
        email: user.email,
        phone: user.phone,
        nid: user.nid,
        address: user.address,
        occupation: user.occupation,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// ===============================
// Logout Controller
// ===============================
exports.logout = async (req, res) => {
  try {
    await AuditLog.create({ action: "logout", actor: req.user?._id, detail: {} });
    res.json({ msg: "✅ Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during logout" });
  }
};

// ===============================
// Forgot Password Controller
// ===============================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "No user found with this email" });

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `Hi ${user.name},\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 30 minutes.`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    res.json({ msg: "✅ Password reset email sent successfully" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ msg: "Server error during password reset request" });
  }
};

// ===============================
// Reset Password Controller
// ===============================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) return res.status(400).json({ msg: "Both password fields are required" });
    if (password !== confirmPassword) return res.status(400).json({ msg: "Passwords do not match" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await AuditLog.create({ action: "resetPassword", actor: user._id, detail: {} });

    res.json({ msg: "✅ Password has been reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ msg: "Server error during password reset" });
  }
};
