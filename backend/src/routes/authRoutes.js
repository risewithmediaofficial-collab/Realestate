const express = require("express");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const ctrl = require("../controllers/authController");

const router = express.Router();

router.post("/signup", ctrl.signupValidators, validate, ctrl.signup);
router.post("/login", ctrl.loginValidators, validate, ctrl.login);
router.post("/verify-otp", ctrl.verifyOtpValidators, validate, ctrl.verifyOtp);
router.post("/resend-otp", ctrl.resendOtpValidators, validate, ctrl.resendOtpCode);
router.post("/social", ctrl.socialLoginValidators, validate, ctrl.socialLogin);
router.post("/verify-widget-token", ctrl.verifyWidgetToken);
router.post("/forgot-password", ctrl.forgotPasswordValidators, validate, ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPasswordValidators, validate, ctrl.resetPassword);
router.get("/me", auth, ctrl.me);

module.exports = router;
