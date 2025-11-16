// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AuditLog = require("../models/AuditLog");
const sendEmail = require("../utils/sendEmail");

const createAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

exports.register = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      email,
      password,
      phone,
      address,
      nid,
      occupation,
      bloodGroup,
      avatar,
      bio,
    } = req.body;

    // Required fields
    if (!name || !email || !password || !fatherName || !phone || !address) {
      return res.status(400).json({ msg: "All required fields must be provided." });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already registered" });

    // Generate verification tokens
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");

    // Create user (note: we pass raw password, model pre-save will hash it)
    const user = await User.create({
      name,
      fatherName,
      email,
      password, // raw — model will hash
      phone,
      address,
      nid,
      occupation,
      bloodGroup,
      avatar,
      bio,
      isVerified: false,
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verificationUrl = `https://ishasorganization.netlify.app/verify-email/${verificationToken}`;
    const emailHtml = `
      <div style="font-family: Inter, sans-serif; padding: 20px;">
        <h2 style="color: #4b0082;">Welcome to ISHAS Organization!</h2>
        <p>Dear ${user.name},</p>
        <p>Please activate your account by clicking the link below or using the secret code.</p>
        <div style="margin:20px 0; text-align:center;">
          <a href="${verificationUrl}" style="background:#4b0082;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Verify My Account</a>
        </div>
        <p style="text-align:center;">--- OR ---</p>
        <p style="background:#f0f8ff;padding:12px;border-radius:8px;text-align:center;">Secret Code: ${verificationToken}</p>
        <p style="font-size:12px;color:#666;">This link/code expires in 24 hours.</p>
      </div>
    `;

    // try sending email but DON'T fail registration entirely if email sending fails
    let emailSent = true;
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome! Verify Your ISHAS Account",
        text: `Please verify: ${verificationUrl}  Secret Code: ${verificationToken}`,
        html: emailHtml,
      });
    } catch (emailErr) {
      emailSent = false;
      console.error("Email send failed after creating user:", emailErr);
      // don't throw — we will inform client
    }

    await AuditLog.create({ action: "register_pending_verification", actor: user._id, detail: { email, bloodGroup } });

    const message = emailSent
      ? "✅ Registration successful! Please check your email for verification link/code."
      : "✅ Registered, but verification email could not be sent. Contact admin or request resend.";

    return res.status(201).json({
      msg: message,
      user: { id: user._id, name: user.name, email: user.email },
      emailSent,
    });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ msg: "Server error during registration. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

    // include password explicitly
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified) return res.status(401).json({ msg: "Account not verified. Check your email." });

    const bcrypt = require("bcryptjs");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    await AuditLog.create({ action: "login", actor: user._id, detail: {} });

    // remove password from object before sending
    user.password = undefined;

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
        bloodGroup: user.bloodGroup,
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

exports.logout = async (req, res) => {
  try {
    await AuditLog.create({ action: "logout", actor: req.user?._id, detail: {} });
    res.json({ msg: "✅ Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during logout" });
  }
};



// FORGOT PASSWORD: return raw token in response ONLY for debugging/dev (controlled by env flag)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "No user found with this email" });

    // Create reset token (raw + hashed)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `Hi ${user.name},\n\nYou requested a password reset. Use the link below or paste the token in the app:\n\n${resetUrl}\n\nOr use token: ${resetToken}\n\nThis link expires in 30 minutes.`;

    // Try send email
    let emailSent = true;
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
        html: `<p>Hi ${user.name},</p><p>Reset link: <a href="${resetUrl}">${resetUrl}</a></p><p>Or use this token: <strong>${resetToken}</strong></p>`,
      });
    } catch (emailErr) {
      console.error("Password reset email failed:", emailErr.message || emailErr);
      emailSent = false;
    }

    // Audit
    await AuditLog.create({ action: "forgotPassword_requested", actor: user._id, detail: { emailSent } });

    // IMPORTANT: Only include raw token in response when explicitly allowed (dev / debug)
    const allowReturnRaw = process.env.ALLOW_RAW_TOKEN === "true" || process.env.NODE_ENV !== "production";
    if (!emailSent && allowReturnRaw) {
      // Return raw token in response for debugging (DO NOT enable in production)
      return res.json({
        msg: "Password reset token generated (email failed). Use token to reset password (dev mode).",
        resetToken,
        emailSent: false,
      });
    }

    if (!emailSent) {
      return res.status(500).json({ msg: "Password reset requested but email sending failed." });
    }

    return res.json({ msg: "✅ Password reset email sent successfully", emailSent: true });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ msg: "Server error during password reset request" });
  }
};

// NEW: reset using token provided in request body (manual token entry)
exports.resetPasswordWithToken = async (req, res) => {
  try {
    const { email, token, password, confirmPassword } = req.body;
    if (!email || !token || !password || !confirmPassword) {
      return res.status(400).json({ msg: "Email, token, and both passwords are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token/email combination" });

    user.password = password; // model pre-save will hash
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await AuditLog.create({ action: "resetPassword_manual", actor: user._id, detail: {} });

    return res.json({ msg: "✅ Password has been reset successfully (manual token)" });
  } catch (err) {
    console.error("Reset Password (manual) Error:", err);
    return res.status(500).json({ msg: "Server error during password reset" });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired verification token." });

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    await AuditLog.create({ action: "emailVerified", actor: user._id, detail: {} });

    res.json({ msg: "✅ Email successfully verified! You can now log in." });
  } catch (err) {
    console.error("Email Verification Error:", err);
    res.status(500).json({ msg: "Server error during email verification." });
  }
};