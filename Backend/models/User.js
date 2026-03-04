const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ["customer", "seller"] },
  phone: { type: String, default: "" },
  addresses: [{
    label: { type: String, default: "Home" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    isDefault: { type: Boolean, default: false },
  }],
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;