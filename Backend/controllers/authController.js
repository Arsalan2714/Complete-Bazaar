const User = require("../models/User");
const bcrypt = require("bcrypt");
const { firstNameValidator, lastNameValidator, emailValidator, passwordValidator, confirmPasswordValidator, userTypeValidator } = require("./validation");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// In-memory OTP store: key -> { otp, expiresAt, data? }
const otpStore = new Map();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Generate and send OTP email
const generateAndSendOtp = async (email, firstName, purpose) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const subjects = {
    signup: "Verify Your Email - Complete Bazaar",
    login: "Login Verification - Complete Bazaar",
    reset: "Password Reset OTP - Complete Bazaar",
  };
  const headings = {
    signup: "📧 Email Verification",
    login: "🔐 Login Verification",
    reset: "🔐 Password Reset",
  };
  const messages = {
    signup: "Complete your registration by entering this OTP:",
    login: "Verify your login with this OTP:",
    reset: "Use the OTP below to reset your password:",
  };

  await transporter.sendMail({
    from: `"Complete Bazaar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subjects[purpose],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px; background: #1e293b; border-radius: 16px; color: #e2e8f0;">
        <h2 style="color: #818cf8; margin-bottom: 20px;">${headings[purpose]}</h2>
        <p>Hi <strong>${firstName}</strong>,</p>
        <p>${messages[purpose]}</p>
        <div style="text-align: center; margin: 25px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #818cf8; background: #334155; padding: 15px 30px; border-radius: 12px; border: 1px solid #475569;">
            ${otp}
          </span>
        </div>
        <p style="color: #94a3b8; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>. If you didn't request this, please ignore this email.</p>
        <hr style="border-color: #334155; margin: 20px 0;" />
        <p style="color: #64748b; font-size: 12px;">— Complete Bazaar Team</p>
      </div>
    `,
  });

  return otp;
};

// ==================== SIGNUP ====================

// Step 1: Validate fields + send email OTP
exports.signupSendOtp = [
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  userTypeValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessages: errors.array().map(err => err.msg),
      });
    }

    const { firstName, lastName, email, password, userType } = req.body;

    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ errorMessages: "An account with this email already exists" });
      }

      // Generate and send OTP
      const otp = await generateAndSendOtp(email, firstName, "signup");

      // Store OTP + signup data temporarily
      otpStore.set(`signup:${email}`, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        data: { firstName, lastName, email, password, userType },
      });

      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessages: "Failed to send OTP. Please try again." });
    }
  },
];

// Step 2: Verify OTP + create account
exports.signupVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const key = `signup:${email}`;
    const stored = otpStore.get(key);

    if (!stored) {
      return res.status(400).json({ errorMessages: "OTP expired or not found. Please try again." });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({ errorMessages: "OTP has expired. Please request a new one." });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ errorMessages: "Invalid OTP. Please try again." });
    }

    // Create user
    const { firstName, lastName, password, userType } = stored.data;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ firstName, lastName, email, password: hashedPassword, userType });
    await user.save();

    // Clean up
    otpStore.delete(key);

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessages: "Failed to create account. Please try again." });
  }
};

// ==================== LOGIN ====================

// Step 1: Validate credentials + send email OTP
exports.loginSendOtp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ errorMessages: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ errorMessages: "Invalid email or password" });
    }

    // Generate and send OTP
    const otp = await generateAndSendOtp(email, user.firstName, "login");

    // Store OTP with user info
    otpStore.set(`login:${email}`, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      userId: user._id,
      userType: user.userType,
      firstName: user.firstName,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessages: error.message });
  }
};

// Step 2: Verify OTP + return JWT
exports.loginVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const key = `login:${email}`;
    const stored = otpStore.get(key);

    if (!stored) {
      return res.status(400).json({ errorMessages: "OTP expired or not found. Please try again." });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({ errorMessages: "OTP has expired. Please request a new one." });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ errorMessages: "Invalid OTP. Please try again." });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: stored.userId, userType: stored.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Clean up
    otpStore.delete(key);

    res.status(200).json({ token, userType: stored.userType, firstName: stored.firstName });
  } catch (error) {
    res.status(500).json({ errorMessages: "Verification failed. Please try again." });
  }
};

// ==================== FORGOT PASSWORD ====================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ errorMessages: "No account found with this email" });
    }

    const otp = await generateAndSendOtp(email, user.firstName, "reset");
    otpStore.set(`reset:${email}`, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessages: "Failed to send OTP. Please try again." });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore.get(`reset:${email}`);

    if (!stored) {
      return res.status(400).json({ errorMessages: "OTP expired or not found. Please request a new one." });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(`reset:${email}`);
      return res.status(400).json({ errorMessages: "OTP has expired. Please request a new one." });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ errorMessages: "Invalid OTP. Please try again." });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ errorMessages: "Verification failed. Please try again." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const key = `reset:${email}`;
    const stored = otpStore.get(key);

    if (!stored || Date.now() > stored.expiresAt || stored.otp !== otp) {
      return res.status(400).json({ errorMessages: "Invalid or expired OTP. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    otpStore.delete(key);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ errorMessages: "Failed to reset password. Please try again." });
  }
};