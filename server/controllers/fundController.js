// server/controllers/fundController.js (Fully Updated and Completed)
const Transaction = require('../models/Transaction');
const AuditLog = require('../models/AuditLog');

// 1. Create New Transaction (Credit or Debit)
exports.createTransaction = async (req, res) => {
    try {
        // month ফিল্ড যোগ করা হলো
        const { userId, amount, type, purpose, documents, month } = req.body;

        // Validation Logic:
        // Credit-এর জন্য userId লাগবে, কিন্তু Debit-এর জন্য নয়।
        if (!amount || !type) {
            return res.status(400).json({ msg: 'Amount and type are required' });
        }
        if (type === 'credit' && !userId) {
             return res.status(400).json({ msg: 'userId is required for credit transactions (donations)' });
        }
        
        // Debit (Expense) এন্ট্রির সময় userId null করে দেওয়া যেতে পারে, 
        // যদি আপনার মডেল user ফিল্ডটি required না করে।
        const finalUserId = (type === 'credit') ? userId : null; 
        
        const tx = await Transaction.create({
            user: finalUserId, // Credit হলে দাতার ID, Debit হলে null
            amount,
            type,
            purpose,
            // 🟢 শুধু Credit (ডোনেশন)-এর জন্য মাস সেভ হবে
            month: (type === 'credit' && month) ? month : undefined, 
            createdBy: req.user._id, // যিনি এন্ট্রি করলেন
            documents: documents || []
        });

        await AuditLog.create({ action: 'create-transaction', actor: req.user._id, detail: tx });
        res.status(201).json(tx);
    } catch (err) { 
        console.error(err); 
        res.status(500).json({ msg: 'Server error' }); 
    }
};

// 2. Get All Transactions (FIXED with .populate())
exports.getAllTransactions = async (req, res) => {
    try {
        // Base query to sort by newest first
        let query = Transaction.find().sort({ date: -1 });
        
        // Check if the user has admin/management roles
        const isAdmin = ['admin','owner','treasurer','committee'].includes(req.user.role);

        if (isAdmin) {
            // 🟢 FIX APPLIED: Admin/Manager can see all, with names populated.
            query = query
                .populate("user", "name")       // Populate Donor Name
                .populate("createdBy", "name"); // Populate Recorder Name
        } else {
            // If user is a regular member, find only their transactions
            // Note: Even members need the donor name (which is their own) to show up.
            query = query.where({ user: req.user._id })
                .populate("user", "name"); 
        }

        const txs = await query.exec();
        return res.json(txs);

    } catch (err) {  
        console.error(err); 
        res.status(500).json({ msg: 'Server error' }); 
    }
};

// 3. Update a Transaction
exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const tx = await Transaction.findById(id);
        
        if (!tx) return res.status(404).json({ msg: 'Transaction not found' });
        if (!['admin','owner','treasurer'].includes(req.user.role)) return res.status(403).json({ msg: 'Forbidden' });
        
        Object.assign(tx, req.body);
        
        // Ensure userId is null for debit if it's being updated 
        if (tx.type === 'debit') {
            tx.user = null;
        }

        await tx.save();
        
        await AuditLog.create({ action: 'update-transaction', actor: req.user._id, detail: tx });
        res.json(tx);
    } catch (err) { 
        console.error(err);
        res.status(500).json({ msg: 'Server error' }); 
    }
};

// 4. Delete a Transaction
exports.deleteTransaction = async (req, res) => {
    try {
        if (!['admin','owner','treasurer'].includes(req.user.role)) return res.status(403).json({ msg: 'Forbidden' });
        
        const deletedTx = await Transaction.findByIdAndDelete(req.params.id);
        
        if (!deletedTx) return res.status(404).json({ msg: 'Transaction not found' });

        await AuditLog.create({ action: 'delete-transaction', actor: req.user._id, detail: { id: req.params.id } });
        res.json({ msg: 'Deleted' });
    } catch (err) { 
        console.error(err);
        res.status(500).json({ msg: 'Server error' }); 
    }
};

// 5. Get Total Fund Balance (Admin/Viewer Level)
exports.getTotals = async (req, res) => {
    try {
        // total credit - total debit (admin-level)
        if (!['admin','owner','treasurer','committee'].includes(req.user.role)) return res.status(403).json({ msg: 'Forbidden' });
        
        const pipeline = [
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ];
        
        const resAgg = await Transaction.aggregate(pipeline);
        
        let credit = 0, debit = 0;
        resAgg.forEach(r => { 
            if (r._id === 'credit') credit = r.total; 
            if (r._id === 'debit') debit = r.total; 
        });

        res.json({ credit, debit, balance: credit - debit });
    } catch (err) { 
        console.error(err);
        res.status(500).json({ msg: 'Server error' }); 
    }
};