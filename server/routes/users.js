const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/roles');

// MEMBER ROUTES
router.get('/me', auth, userCtrl.getProfile);
router.put('/me', auth, userCtrl.updateProfile);

// ADMIN ROUTES
router.get('/', auth, requireRole(['admin','owner']), userCtrl.listUsers);
router.put('/:id/role', auth, requireRole(['admin','owner']), userCtrl.changeRole);
router.delete('/:id', auth, requireRole(['admin','owner']), userCtrl.deleteUser);

module.exports = router;
