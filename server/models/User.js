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

    // 🔹 Password Reset
    passwordResetToken: String,
    passwordResetExpires: Date,

    // 🔹 Financial Info
    chadarPoriman: { type: Number, default: 25 },
    due: { type: Number, default: 0 },
    paidMonths: { type: [String], default: [] },
    upcomingDue: { type: String, default: "Next Month" },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
