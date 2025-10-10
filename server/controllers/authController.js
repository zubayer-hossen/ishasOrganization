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


// server/controllers/authController.js (Updated)

// ⚠️ এখানে bcryptjs ব্যবহার করা হয়েছে, যা আপনার ইম্পোর্টে ছিল
const bcrypt = require('bcryptjs'); 
// const bcrypt = require('bcrypt'); // যদি আপনার প্যাকেজে 'bcrypt' থাকে তবে এটি ব্যবহার করুন

const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const AuditLog = require('../models/AuditLog');

// ... (createAccessToken, createRefreshToken, createOwnerNotificationHtml ফাংশনগুলো অপরিবর্তিত থাকবে)

// REGISTER
// =====================================

// ⚠️ আপনার মালিকের ইমেইল অ্যাড্রেস এবং ব্যানার URL এখানে দিন
const OWNER_EMAIL = process.env.OWNER_EMAIL || "alexandyfor2day11@gmail.com"; 
const ORGANIZATION_NAME = "ISHAS ORGANIZATION";


const createOwnerNotificationHtml = ({ name, email, phone, address, chadarPoriman }) => {
    // ... (আপনার প্রদত্ত HTML টেমপ্লেট কোডটি এখানে থাকবে, যা অপরিবর্তিত)
    const BANNER_URL = process.env.EMAIL_BANNER_URL || "https://i.ibb.co.com/Lz2PFvXz/472336431-122098466192716914-7147800908504199836-n.png";
    const ADMIN_PANEL_URL = `${process.env.CLIENT_URL}/admin/login`;

    return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px; border-radius: 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            
            <tr>
                <td align="center" style="background-color: #4f46e5; padding: 20px 0; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <img src="${BANNER_URL}" alt="${ORGANIZATION_NAME} Banner" style="max-width: 90%; height: auto; display: block; margin: 0 auto; border-radius: 4px;" width="540">
                    <h1 style="color: #ffffff; font-size: 24px; margin-top: 15px;">New Member Alert! 🔔</h1>
                </td>
            </tr>

            <tr>
                <td style="padding: 30px;">
                    <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px;">Registration Successful! 🎉</h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                        Owner, a **new member** has completed the initial registration for **${ORGANIZATION_NAME}**. Please review their details for verification.
                    </p>
                    
                    <div style="background-color: #eef2ff; border-left: 5px solid #4f46e5; padding: 15px; margin: 25px 0; border-radius: 4px;">
                        <p style="color: #1f2937; margin: 0; font-weight: bold; font-size: 16px;">
                            👤 New Member Details:
                        </p>
                        <ul style="list-style: none; padding: 0; margin: 10px 0 0 0; font-size: 15px;">
                            <li style="color: #4f46e5; margin-bottom: 5px;"><strong>Name:</strong> ${name}</li>
                            <li style="color: #4f46e5; margin-bottom: 5px;"><strong>Email:</strong> ${email}</li>
                            <li style="color: #4f46e5; margin-bottom: 5px;"><strong>Phone:</strong> ${phone || 'N/A'}</li>
                            <li style="color: #4f46e5; margin-bottom: 5px;"><strong>Address:</strong> ${address || 'N/A'}</li>
                            <li style="color: #4f46e5; margin-bottom: 5px; border-top: 1px dashed #c7d2fe; padding-top: 5px; margin-top: 5px;">
                                <strong>Initial Chadar:</strong> ৳${chadarPoriman} (Monthly)
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>

            <tr>
                <td style="padding: 10px 30px 20px 30px;">
                    <h3 style="color: #4f46e5; font-size: 18px; border-bottom: 2px solid #eef2ff; padding-bottom: 10px; margin-top: 0;">
                        💡 Next Steps & System Status
                    </h3>
                    
                    <p style="color: #374151; font-size: 15px; margin: 15px 0;">
                        The user is currently **UNVERIFIED**. Please verify the new member through the admin panel.
                    </p>
                    
                    <a href="${ADMIN_PANEL_URL}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px; box-shadow: 0 2px 5px rgba(16, 185, 129, 0.5);">
                        Go to Admin Panel for Verification
                    </a>
                </td>
            </tr>
            
            <tr>
                <td align="center" style="background-color: #eef2ff; padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                        This is an automated notification from the ${ORGANIZATION_NAME} system.
                    </p>
                </td>
            </tr>
        </table>
    </div>
    `;
};


exports.register = async (req, res) => {
    try {
        const { name, fatherName, email, password, phone, address, nid, occupation, avatar, bio } = req.body;
        if (!name || !email || !password) return res.status(400).json({ msg: 'Name, email, password required' });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ msg: 'Email already registered' });

        // User creation
        // ⚠️ আপনার ইম্পোর্ট অনুযায়ী bcrypt.hash() ব্যবহার করা হয়েছে
        const hashed = await bcrypt.hash(password, 10); // 12 এর পরিবর্তে 10 ব্যবহার করা হলো, যা bcryptjs-এ স্ট্যান্ডার্ড
        const user = await User.create({ name, fatherName, email, password: hashed, phone, address, nid, occupation, avatar, bio });
        
        // Use user's default 'chadarPoriman'
        const chadarPoriman = user.chadarPoriman || 50; 

        // 1. New User Email Verification Process
        const token = crypto.randomBytes(32).toString('hex');
        await VerificationToken.create({ userId: user._id, token });
        const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        
        // Send verification email to the new user
        await sendEmail({ 
            to: email, 
            subject: 'ISHAS - Email Verification', 
            html: `<p>Welcome to ${ORGANIZATION_NAME}! Click <a href="${link}">this link</a> to verify your email and complete your registration.</p>` 
        });


        // 2. Owner Notification Process
        try {
            await sendEmail({
                to: OWNER_EMAIL,
                subject: `🎉 New Member Registered: ${name}`,
                html: createOwnerNotificationHtml({
                    name, 
                    email, 
                    phone, 
                    address, 
                    chadarPoriman
                })
            });
        } catch (notificationError) {
            // If notification fails, log it but don't stop the registration success
            console.error("Owner notification failed to send:", notificationError);
        }

        // Audit Log and Final Response
        await AuditLog.create({ action: 'register', actor: user._id, detail: { email, name } });

        // 💡 এই লাইনটি নিশ্চিত করবে যে সার্ভার সফলভাবে সাড়া দিয়েছে
        return res.status(201).json({ msg: '✅ Registered successfully! Please verify your email.' });
    } catch (err) {
        // 🚨 সবচেয়ে গুরুত্বপূর্ণ পরিবর্তন: ত্রুটিটি বিস্তারিতভাবে কনসোলে প্রিন্ট হবে
        console.error("🔴 Registration Error Details:", err.message, err.stack);
        // ফ্রন্টএন্ডকে একটি সাধারণ এরর মেসেজ পাঠানো হলো
        return res.status(500).json({ msg: 'Server error during registration. Check server logs.' });
    }
};

// ... (বাকি কন্ট্রোলার ফাংশনগুলো অপরিবর্তিত থাকবে)

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

    res.json({ msg: '✅ Email verified successfully. You may now login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
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

    res.json({
      accessToken,
      user: { ...user._doc, password: undefined } // exclude password
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
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
    res.json({ accessToken: newAccess });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    res.clearCookie('jid', { path: '/api/auth/refresh_token' });
    if (req.user) await AuditLog.create({ action: 'logout', actor: req.user._id, detail: {} });
    res.json({ msg: 'Logged out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
