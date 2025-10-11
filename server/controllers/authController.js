const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const AuditLog = require('../models/AuditLog');

// ===============================
// JWT Token Creation
// ===============================
const createAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

// ===============================
// Register Controller
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, fatherName, email, password, phone, address, nid, occupation, avatar, bio } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: 'Name, email and password are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already registered' });

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
    });

    // Email verification
    const token = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({ userId: user._id, token });

    const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await sendEmail({
      to: email,
      subject: 'ISHAS - Email Verification',
      html: `<p>Click <a href="${link}">this link</a> to verify your email. Link valid for 24 hours.</p>`,
    });

    await AuditLog.create({ action: 'register', actor: user._id, detail: { email } });

    res.status(201).json({ msg: '✅ Registered successfully! Please check your email for verification.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ===============================
// Email Verification
// ===============================
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
    res.status(500).json({ msg: 'Server error' });
  }
};

// ===============================
// Login Controller
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });

    if (!user.isVerified)
      return res.status(403).json({ msg: 'Please verify your email first' });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // ✅ FIXED COOKIE CONFIG (cross-site compatible)
    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: true, // Required for cross-site cookies
      sameSite: 'None', // ✅ Cross-site must be None
      path: '/', // ✅ Important: must be root
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await AuditLog.create({ action: 'login', actor: user._id, detail: {} });

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
        chadarPoriman: user.chadarPoriman,
        due: user.due,
        paidMonths: user.paidMonths,
        upcomingDue: user.upcomingDue,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ===============================
// Refresh Token
// ===============================
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (!token) return res.status(401).json({ ok: false });

    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (e) {
      return res.status(401).json({ ok: false });
    }

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ ok: false });

    const newAccess = createAccessToken(user);
    return res.json({ accessToken: newAccess });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ===============================
// Logout Controller
// ===============================
exports.logout = async (req, res) => {
  try {
    res.clearCookie('jid', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
    });

    if (req.user)
      await AuditLog.create({ action: 'logout', actor: req.user._id, detail: {} });

    res.json({ msg: '✅ Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
