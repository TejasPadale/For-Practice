const Product = require("../models/Product");

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, stock, taxRate } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.taxRate = taxRate ?? product.taxRate;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
