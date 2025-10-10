const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.post('/register', authCtrl.register);
router.get('/verify-email', authCtrl.verifyEmail);
router.post('/login', authCtrl.login);
router.post('/refresh_token', authCtrl.refreshToken);
router.post('/logout', authCtrl.logout);

module.exports = router;
