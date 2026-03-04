const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { isLoggedIn, isCustomer } = require("../middleware/auth.js");
const customerController = require("../controllers/customerController.js");

const paymentRouter = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.TEST_API_KEY,
    key_secret: process.env.TEST_SECRET_KEY,
});

// POST /api/payment/create-order
// Creates a Razorpay order and returns orderId + keyId to the frontend
paymentRouter.post("/create-order", isLoggedIn, isCustomer, async (req, res) => {
    try {
        const { amount } = req.body; // amount in ₹ (we convert to paise)
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.TEST_API_KEY,
        });
    } catch (error) {
        console.error("Razorpay create-order error:", error);
        res.status(500).json({ error: "Failed to create Razorpay order" });
    }
});

// POST /api/payment/verify
// Verifies Razorpay signature then saves the order to DB
paymentRouter.post("/verify", isLoggedIn, isCustomer, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shippingAddress,
            grandTotal,
        } = req.body;

        // Verify HMAC-SHA256 signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.TEST_SECRET_KEY)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Payment verification failed. Invalid signature." });
        }

        // Payment verified — delegate to existing createOrder logic
        req.body.paymentMethod = "Online";
        req.body.shippingAddress = shippingAddress;
        req.body.razorpayPaymentId = razorpay_payment_id;
        req.body.totalAmount = grandTotal; // save the exact amount the user paid

        // Call the shared order creation function
        return customerController.createOrder(req, res);
    } catch (error) {
        console.error("Razorpay verify error:", error);
        res.status(500).json({ error: "Payment verification failed" });
    }
});

module.exports = paymentRouter;
