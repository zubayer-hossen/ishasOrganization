const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const AuditLog = require('../models/AuditLog');

// JWT tokens
const createAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

// REGISTER
// =====================================


exports.register = async (req, res) => {
  try {
    const { name, fatherName, email, password, phone, address, nid, occupation, avatar, bio } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Name, email, password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, fatherName, email, password: hashed, phone, address, nid, occupation, avatar, bio });

    // ✅ ইমেইল পাঠানোর কাজটি এখন main thread ব্লক করবে না
    try {
        const token = crypto.randomBytes(32).toString('hex');
        await VerificationToken.create({ userId: user._id, token });
        const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        await sendEmail({ 
            to: email, 
            subject: 'ISHAS - Email Verification', 
            html: `<p>Please click <a href="${link}">this link</a> to verify your email.</p>` 
        });
    } catch (emailError) {
        // যদি ইমেইল পাঠাতে কোনো সমস্যা হয়, শুধু সার্ভার console-এ লগ হবে
        console.error("❌ Failed to send verification email:", emailError.message);
        // কিন্তু ইউজারকে error দেখানো হবে না, কারণ রেজিস্ট্রেশন সফল হয়েছে
    }

    await AuditLog.create({ action: 'register', actor: user._id, detail: { email } });

    // ✅ এই রেসপন্সটি এখন ইমেইল পাঠানোর জন্য অপেক্ষা করবে না
    return res.status(201).json({ msg: 'Registered successfully! Please verify your email.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};


// =====================================



// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ msg: 'Invalid token' });

    const record = await VerificationToken.findOne({ token });
    if (!record) return res.status(400).json({ msg: 'Token expired or invalid' });

    const user = await User.findById(record.userId);
    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (user.isVerified) return res.status(400).json({ msg: 'Email already verified' });

    user.isVerified = true;
    await user.save();
    await VerificationToken.deleteOne({ _id: record._id });

    await AuditLog.create({ action: 'verify-email', actor: user._id, detail: { email: user.email } });

    return res.json({ msg: '✅ Email verified successfully. You may now login.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified) return res.status(403).json({ msg: "Please verify your email first" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie("jid", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await AuditLog.create({ action: "login", actor: user._id, detail: {} });

    return res.json({
      accessToken,
      user: { ...user._doc, password: undefined } // exclude password
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (!token) return res.status(401).json({ ok: false });

    let payload;
    try { payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET); } 
    catch (e) { return res.status(401).json({ ok: false }); }

    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ ok: false });

    const newAccess = createAccessToken(user);
    return res.json({ accessToken: newAccess });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    res.clearCookie('jid', { path: '/api/auth/refresh_token' });
    if (req.user) await AuditLog.create({ action: 'logout', actor: req.user._id, detail: {} });
    return res.json({ msg: 'Logged out' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};
