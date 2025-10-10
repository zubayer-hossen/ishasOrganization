const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: true },
    phone: {
      type: String,
      default: "",
      match: [/^\d{10,15}$/, 'Please provide a valid phone number'],
    },
    nid: { type: String },
    address: { type: String, default: "" },
    occupation: { type: String, default: "" },

    // 🔹 Role
    role: {
      type: String,
      enum: ['member', 'committee', 'treasurer', 'admin', 'owner', 'kosadhokko'],
      default: 'member',
    },

    // 🔹 Profile
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },

    // 🔹 Financial Info (Default Values)
    chadarPoriman: { type: Number, default: 50 }, // মাসিক চাঁদা
    due: { type: Number, default: 0 }, // মোট বকেয়া
    paidMonths: { type: [String], default: [] }, // ["Jan 2025", "Feb 2025"]
    upcomingDue: { type: String, default: "Next Month" }, // ডিফল্ট ভ্যালু
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
