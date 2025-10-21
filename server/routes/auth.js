// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");

// public
router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
// routes/authRoutes.js
router.post("/forgot-password", authCtrl.forgotPassword);
router.post("/reset-password-with-token", authCtrl.resetPasswordWithToken); // new
// keep existing /reset-password/:token for link-based flows

router.get("/verify-email/:token", authCtrl.verifyEmail);

// protected routes should use auth middleware (not included here)

module.exports = router;
