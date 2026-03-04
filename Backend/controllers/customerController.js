const Product = require("../models/Product.js");
const User = require("../models/User.js");
const Order = require("../models/Order.js");
const Review = require("../models/Review.js");
const bcrypt = require("bcrypt");

exports.getData = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId).populate({
        path: "orders",
        populate: { path: "products" }
    });
    const products = await Product.find();
    res.status(200).json({ products, cart: user.cart, wishlist: user.wishlist, orders: user.orders, firstName: user.firstName });
}

exports.addToCart = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId = req.userId;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });
        if (product.stock <= 0) return res.status(400).json({ error: "This product is out of stock" });
        const user = await User.findById(userId);
        // Check if cart quantity already equals available stock
        const cartCount = user.cart.filter(id => id.toString() === productId).length;
        if (cartCount >= product.stock) return res.status(400).json({ error: `Only ${product.stock} left in stock` });
        user.cart.push(productId);
        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.removeFromCart = async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.userId;
    const user = await User.findById(userId);
    const index = user.cart.indexOf(productId);
    if (index !== -1) {
        user.cart.splice(index, 1);
    }
    await user.save();
    res.status(200).json(user.cart);
}

exports.createOrder = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { paymentMethod, shippingAddress, totalAmount: bodyTotal } = req.body;
        const user = await User.findById(userId).populate("cart");

        // Check stock for all cart items before placing order
        const stockCount = {};
        for (const product of user.cart) {
            const pid = product._id.toString();
            stockCount[pid] = (stockCount[pid] || 0) + 1;
        }
        for (const [pid, qty] of Object.entries(stockCount)) {
            const product = user.cart.find(p => p._id.toString() === pid);
            if (product.stock < qty) {
                return res.status(400).json({ error: `"${product.name}" only has ${product.stock} left in stock` });
            }
        }

        // Use the amount passed from Razorpay verify (includes shipping+GST), or fall back to cart sum for COD
        const cartSum = user.cart.reduce((sum, product) => sum + product.price, 0);
        const totalAmount = bodyTotal ? parseFloat(bodyTotal) : cartSum;

        const order = new Order({
            customer: userId,
            products: user.cart,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod || "Cash on Delivery",
            shippingAddress: shippingAddress,
        });
        await order.save();

        // Decrement stock for each product
        for (const [pid, qty] of Object.entries(stockCount)) {
            await Product.findByIdAndUpdate(pid, { $inc: { stock: -qty } });
        }

        user.orders.push(order._id);
        user.cart = [];
        await user.save();
        res.status(200).json(user.orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.cancelOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate("products");
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        if (order.status === "Cancelled") {
            return res.status(400).json({ error: "Order is already cancelled" });
        }

        // Restore stock for each product
        const stockRestore = {};
        for (const product of order.products) {
            const pid = product._id.toString();
            stockRestore[pid] = (stockRestore[pid] || 0) + 1;
        }
        for (const [pid, qty] of Object.entries(stockRestore)) {
            await Product.findByIdAndUpdate(pid, { $inc: { stock: qty } });
        }

        order.status = "Cancelled";
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.removeOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const userId = req.userId;
        await Order.findByIdAndDelete(orderId);
        const user = await User.findById(userId);
        user.orders = user.orders.filter((id) => id.toString() !== orderId);
        await user.save();
        res.status(200).json({ message: "Order removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.toggleWishlist = async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.userId;
    const user = await User.findById(userId);
    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
        user.wishlist.push(productId);
    } else {
        user.wishlist.splice(index, 1);
    }
    await user.save();
    res.status(200).json(user.wishlist);
}

exports.addReview = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId = req.userId;
        const { rating, comment } = req.body;

        const review = new Review({
            product: productId,
            customer: userId,
            rating,
            comment,
        });
        await review.save();

        // Recalculate product rating
        const allReviews = await Review.find({ product: productId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await Product.findByIdAndUpdate(productId, {
            rating: Math.round(avgRating * 10) / 10,
            numReviews: allReviews.length,
        });

        const populated = await review.populate("customer", "firstName lastName");
        res.status(201).json(populated);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "You have already reviewed this product" });
        }
        res.status(500).json({ error: error.message });
    }
}

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("firstName lastName email phone addresses createdAt");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { firstName, lastName, phone, updatedAt: Date.now() },
            { new: true }
        ).select("firstName lastName email phone addresses");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.addAddress = async (req, res) => {
    try {
        const { label, street, city, state, pincode, isDefault } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        // If setting as default or first address, unset other defaults
        if (isDefault || user.addresses.length === 0) {
            user.addresses.forEach(a => a.isDefault = false);
        }
        user.addresses.push({ label: label || "Home", street, city, state, pincode, isDefault: isDefault || user.addresses.length === 0 });
        await user.save();
        res.status(201).json(user.addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
        // If deleted address was default, make the first one default
        if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
            user.addresses[0].isDefault = true;
        }
        await user.save();
        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        const addr = user.addresses.id(req.params.id);
        if (!addr) return res.status(404).json({ error: "Address not found" });
        const { label, street, city, state, pincode, isDefault } = req.body;
        if (label) addr.label = label;
        if (street !== undefined) addr.street = street;
        if (city !== undefined) addr.city = city;
        if (state !== undefined) addr.state = state;
        if (pincode !== undefined) addr.pincode = pincode;
        if (isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
            addr.isDefault = true;
        }
        await user.save();
        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both current and new password are required" });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ error: "New password must be at least 8 characters" });
        }
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });
        user.password = await bcrypt.hash(newPassword, 10);
        user.updatedAt = Date.now();
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ error: "Password is required to delete account" });
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });
        // Clean up user data
        await Order.deleteMany({ _id: { $in: user.orders } });

        // Find user's reviews to update affected products
        const userReviews = await Review.find({ customer: user._id });
        const affectedProductIds = [...new Set(userReviews.map(r => r.product.toString()))];

        // Delete user's reviews
        await Review.deleteMany({ customer: user._id });

        // Recalculate rating & numReviews for each affected product
        for (const productId of affectedProductIds) {
            const remaining = await Review.find({ product: productId });
            const numReviews = remaining.length;
            const rating = numReviews > 0
                ? (remaining.reduce((sum, r) => sum + r.rating, 0) / numReviews).toFixed(1)
                : 0;
            await Product.findByIdAndUpdate(productId, { rating: Number(rating), numReviews });
        }

        await User.findByIdAndDelete(req.userId);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
