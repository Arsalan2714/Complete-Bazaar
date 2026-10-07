const express = require("express");
const customerController = require("../controllers/customerController.js");
const accountRouter = express.Router();

accountRouter.get("/profile", customerController.getProfile);
accountRouter.put("/profile", customerController.updateProfile);
accountRouter.post("/address", customerController.addAddress);
accountRouter.put("/address/:id", customerController.updateAddress);
accountRouter.delete("/address/:id", customerController.deleteAddress);
accountRouter.put("/change-password", customerController.changePassword);
accountRouter.delete("/delete-account", customerController.deleteAccount);

module.exports = accountRouter;