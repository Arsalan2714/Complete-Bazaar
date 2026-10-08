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




module.exports = customerRouter;