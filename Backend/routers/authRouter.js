const express = require("express");

const authController = require("../controllers/authController.js");
const authRouter = express.Router();

// Signup (2-step)
authRouter.post("/signup/send-otp", authController.signupSendOtp);
authRouter.post("/signup/verify", authController.signupVerify);

// Login (2-step)
authRouter.post("/login/send-otp", authController.loginSendOtp);
authRouter.post("/login/verify", authController.loginVerify);

// Forgot password
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/reset-password", authController.resetPassword);

module.exports = authRouter;