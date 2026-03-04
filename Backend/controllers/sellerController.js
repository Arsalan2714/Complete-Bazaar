const Product = require("../models/Product");

exports.createProduct = async (req, res, next) => {
  const { name, description, price, category, brand, rating, numReviews, stock } = req.body;
  const sellerId = req.userId;

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const imageUrl = req.file.path;

  try {
    const product = new Product({ name, description, price, category, brand, rating, numReviews, stock, imageUrl, seller: sellerId });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const sellerId = req.userId;
    const products = await Product.find({ seller: sellerId });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

