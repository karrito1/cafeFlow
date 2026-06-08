const Product = require('../models/Product');

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, categoryId, featured, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      image,
      categoryId,
      featured,
      stock,
    });

    res.status(201).json({ msg: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ active: true })
      .populate('categoryId', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get product by ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product disabled successfully', product });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };