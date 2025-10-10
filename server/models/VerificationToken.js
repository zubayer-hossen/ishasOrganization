// server/models/VerificationToken.js
const mongoose = require('mongoose');

const VerificationTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60*60*24 } // expires after 24 hours
});

module.exports = mongoose.model('VerificationToken', VerificationTokenSchema);
