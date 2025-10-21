// models/User.js
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs"); // pre-save hashing

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, default: "", trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: true, select: false }, // hidden by default
    phone: {
      type: String,
      default: "",
      trim: true,
      match: [/^\d{10,15}$/, 'Please provide a valid phone number'],
    },
    nid: { type: String, trim: true },
    address: { type: String, default: "", trim: true },
    occupation: { type: String, default: "", trim: true },

    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
      trim: true,
    },

    role: {
      type: String,
      enum: ['member', 'committee', 'treasurer', 'admin', 'owner', 'kosadhokko'],
      default: 'member',
    },

    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },

    emailVerificationToken: String,
    emailVerificationExpires: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,

    chadarPoriman: { 
        type: Number, 
        default: 25,
        min: [0, 'Chada amount cannot be negative']
    },
    due: { 
        type: Number, 
        default: 0,
        min: [0, 'Due amount cannot be negative']
    },
    paidMonths: { 
        type: [String], 
        default: [] 
    },
    upcomingDue: { 
        type: String, 
        default: "Next Month" 
    },
  },
  { timestamps: true }
);

// Hash password before saving (only when modified or new)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    // clear any transient reset tokens if desired (optional)
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
