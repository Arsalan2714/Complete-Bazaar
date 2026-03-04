const express = require("express");
const multer = require ("multer"); // used for image storing and converting them into a  string file



const sellerController = require("../controllers/sellerController.js");
const sellerRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Math.random().toString(36).substring(2,8) + '-' + file.originalname);
  },
});


sellerRouter.post(
  "/products",
  
  multer({storage: storage}).single("image"),sellerController.createProduct
)

sellerRouter.get(
  "/products",
  sellerController.getProducts
)

sellerRouter.delete(
  "/products/:id",
  sellerController.deleteProduct
)

sellerRouter.put(
  "/products/:id",
  multer({storage: storage}).single("image"),sellerController.updateProduct
)

module.exports = sellerRouter;