const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isAdmin } = require("../middleware/adminAuth");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const adminRouter = express.Router();

// ─── POST /api/admin/login ───────────────────────────────────────────────────
adminRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (
            email !== process.env.ADMIN_EMAIL ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }
        const token = jwt.sign(
            { adminId: "admin", userType: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );
        res.status(200).json({ token, message: "Admin login successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/admin/stats ────────────────────────────────────────────────────
adminRouter.get("/stats", isAdmin, async (req, res) => {
    try {
        const [totalUsers, totalProducts, totalOrders, allOrders] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.find({}, "totalAmount status paymentMethod createdAt"),
        ]);

        const totalRevenue = allOrders
            .filter((o) => o.status !== "Cancelled")
            .reduce((sum, o) => sum + o.totalAmount, 0);

        const customers = await User.countDocuments({ userType: "customer" });
        const sellers = await User.countDocuments({ userType: "seller" });

        // Revenue by month (last 6 months)
        const now = new Date();
        const monthlyRevenue = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
            const amount = allOrders
                .filter((o) => {
                    const od = new Date(o.createdAt);
                    return od >= d && od < next && o.status !== "Cancelled";
                })
                .reduce((s, o) => s + o.totalAmount, 0);
            monthlyRevenue.push({ label, amount });
        }

        // Orders by status
        const statusCounts = {
            Confirmed: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0,
        };
        allOrders.forEach((o) => {
            const s = o.status || "Confirmed";
            if (statusCounts[s] !== undefined) statusCounts[s]++;
        });

        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            customers,
            sellers,
            monthlyRevenue,
            statusCounts,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/admin/users ────────────────────────────────────────────────────
adminRouter.get("/users", isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || "";
        const filter = search
            ? { $or: [{ firstName: new RegExp(search, "i") }, { lastName: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
            : {};

        const [users, total] = await Promise.all([
            User.find(filter, "-password -cart -wishlist -addresses")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            User.countDocuments(filter),
        ]);
        res.status(200).json({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/admin/users/:id ─────────────────────────────────────────────
adminRouter.delete("/users/:id", isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── PATCH /api/admin/users/:id ──────────────────────────────────────────────
adminRouter.patch("/users/:id", isAdmin, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, userType } = req.body;
        const updates = {};
        if (firstName !== undefined) updates.firstName = firstName.trim();
        if (lastName !== undefined) updates.lastName = lastName.trim();
        if (email !== undefined) updates.email = email.trim().toLowerCase();
        if (phone !== undefined) updates.phone = phone.trim();
        if (userType !== undefined && ["customer", "seller"].includes(userType)) updates.userType = userType;
        updates.updatedAt = new Date();

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, select: "-password -cart -wishlist -addresses" });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/admin/products ─────────────────────────────────────────────────
adminRouter.get("/products", isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || "";
        const filter = search
            ? { $or: [{ name: new RegExp(search, "i") }, { brand: new RegExp(search, "i") }, { category: new RegExp(search, "i") }] }
            : {};

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate("seller", "firstName lastName email")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Product.countDocuments(filter),
        ]);
        res.status(200).json({ products, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/admin/products/:id ──────────────────────────────────────────
adminRouter.delete("/products/:id", isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/admin/orders ───────────────────────────────────────────────────
adminRouter.get("/orders", isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status || "";
        const filter = status ? { status } : {};

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate("customer", "firstName lastName email")
                .populate("products", "name price imageUrl")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Order.countDocuments(filter),
        ]);
        res.status(200).json({ orders, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── PATCH /api/admin/orders/:id/status ──────────────────────────────────────
adminRouter.patch("/orders/:id/status", isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true }
        );
        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = adminRouter;
