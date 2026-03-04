const express = require("express");
const customerController = require("../controllers/customerController.js");
const customerRouter = express.Router();

customerRouter.get("/data", customerController.getData);
customerRouter.post("/cart/:id", customerController.addToCart);
customerRouter.delete("/cart/:id", customerController.removeFromCart);
customerRouter.post("/order", customerController.createOrder);
customerRouter.delete("/order/:id", customerController.cancelOrder);
customerRouter.patch("/order/:id", customerController.removeOrder);
customerRouter.post("/wishlist/:id", customerController.toggleWishlist);
customerRouter.post("/review/:id", customerController.addReview);
customerRouter.get("/profile", customerController.getProfile);
customerRouter.put("/profile", customerController.updateProfile);
customerRouter.post("/address", customerController.addAddress);
customerRouter.put("/address/:id", customerController.updateAddress);
customerRouter.delete("/address/:id", customerController.deleteAddress);
customerRouter.put("/change-password", customerController.changePassword);
customerRouter.delete("/delete-account", customerController.deleteAccount);



module.exports = customerRouter;