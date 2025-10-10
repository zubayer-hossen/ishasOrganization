// server/models/Transaction.js (MUST BE UPDATED)
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    // user non-required, so debit can be saved without a donor/member
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit','debit'], required: true },
    purpose: { type: String },
    // 🟢 নতুন ফিল্ড: মাসিক ডোনেশন ট্র্যাক করার জন্য
    month: { type: String, match: /^\d{4}-\d{2}$/ }, // YYYY-MM format
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // যিনি এন্ট্রি করেছেন
    documents: [{ type: String }]
});

module.exports = mongoose.model('Transaction', TransactionSchema);