const dotenv = require("dotenv");
dotenv.config();

// External modules
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Local modules
const errorController = require("./controllers/errorController.js");
const sellerRouter = require("./routers/sellerRouter.js");
const customerRouter = require("./routers/customerRouter.js");
const authRouter = require("./routers/authRouter.js");
const { isLoggedIn, isSeller, isCustomer } = require("./middleware/auth.js");
const paymentRouter = require("./routers/paymentRouter.js");
const adminRouter = require("./routers/adminRouter.js");

const MONGO_DB_URL = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@airbnb.zr7xw53.mongodb.net/${process.env.MONGO_DB_DATABASE}`;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Public routes (no auth required)
app.get("/api/products", async (req, res) => {
  const Product = require("./models/Product.js");
  const products = await Product.find();
  res.status(200).json({ products });
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const Product = require("./models/Product.js");
    const product = await Product.findById(req.params.id).populate("seller", "firstName");
    if (!product) {
      return res.status(404).json({ errorMessages: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ errorMessages: "Failed to load product" });
  }
});

// Get reviews for a product (public)
app.get("/api/reviews/:productId", async (req, res) => {
  try {
    const Review = require("./models/Review.js");
    const reviews = await Review.find({ product: req.params.productId })
      .populate("customer", "firstName lastName")
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: "Failed to load reviews" });
  }
});

// Protected API routes
app.use("/api/seller", isLoggedIn,
  isSeller, sellerRouter);
app.use("/api/customer", isLoggedIn,
  isCustomer, customerRouter);
app.use("/api/auth", authRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);

// 404 handler
app.use(errorController.get404);

const PORT = process.env.PORT || 3001;

mongoose.connect(MONGO_DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
})