const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");

// =========================
// AUTH ROUTES
// =========================
router.post("/register", authCtrl.register);              // Student register
router.post("/register-parent", authCtrl.registerParent); // ✅ Parent register (NEW)

router.post("/verify-otp", authCtrl.verifyOtp);
router.post("/login", authCtrl.login);

router.post("/forgot-password", authCtrl.forgotPassword);
router.post("/verifyfp-otp", authCtrl.verifyForgotOtp);
router.post("/reset-password", authCtrl.resetPassword);

module.exports = router;
