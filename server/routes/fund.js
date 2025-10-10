// server/routes/fund.js (Updated & Clarified)
const express = require('express');
const router = express.Router();
const fundCtrl = require('../controllers/fundController');
const auth = require('../middlewares/auth'); // User authentication (req.user set)
const requireRole = require('../middlewares/roles'); // Role-based authorization

// ----------------------
// AUTHORIZATION LEVELS
// ----------------------

// Only Admin, Owner, Treasurer can create/update/delete transactions
const FUND_MANAGER_ROLES = ['admin', 'owner', 'treasurer'];

// Admin, Owner, Treasurer, Committee can view overall totals/balance
const FUND_VIEWER_ROLES = ['admin', 'owner', 'treasurer', 'committee'];


// ----------------------
// FUND MANAGEMENT ROUTES
// ----------------------

// 1. Create Transaction (Credit/Debit Entry)
// POST /api/funds
// Required: Login, Roles (admin, owner, treasurer)
router.post(
    '/', 
    auth, 
    requireRole(FUND_MANAGER_ROLES), 
    fundCtrl.createTransaction
);


// 2. Get All Transactions (Admin View & User's Own View)
// GET /api/funds
// Required: Login (Authorization logic inside controller)
// The fundCtrl.getAllTransactions handles role-based filtering (Admin sees all, User sees own).
router.get(
    '/', 
    auth, 
    fundCtrl.getAllTransactions
);


// 3. Get Current Totals/Balance
// GET /api/funds/totals
// Required: Login, Roles (admin, owner, treasurer, committee)
router.get(
    '/totals', 
    auth, 
    requireRole(FUND_VIEWER_ROLES), 
    fundCtrl.getTotals
);


// 4. Update a Transaction
// PUT /api/funds/:id
// Required: Login, Roles (admin, owner, treasurer)
router.put(
    '/:id', 
    auth, 
    requireRole(FUND_MANAGER_ROLES), 
    fundCtrl.updateTransaction
);


// 5. Delete a Transaction
// DELETE /api/funds/:id
// Required: Login, Roles (admin, owner, treasurer)
router.delete(
    '/:id', 
    auth, 
    requireRole(FUND_MANAGER_ROLES), 
    fundCtrl.deleteTransaction
);

module.exports = router;