const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");

// ✅ Register
router.post("/register", authCtrl.register);

// ✅ Login
router.post("/login", authCtrl.login);

// ✅ Logout
router.post("/logout", authCtrl.logout);

// ✅ Forgot Password
router.post("/forgot-password", authCtrl.forgotPassword);

// ✅ Reset Password
router.put("/reset-password/:token", authCtrl.resetPassword);

module.exports = router;
