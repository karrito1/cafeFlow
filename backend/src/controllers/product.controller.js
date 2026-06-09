const Product = require('../models/Product');

// Create product
const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, categoriaId, destacado, stock } = req.body;

    const product = await Product.create({
      nombre,
      descripcion,
      precio,
      imagen,
      categoriaId,
      destacado,
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
    const products = await Product.find({ activo: true })
      .populate('categoriaId', 'nombre');
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get product by ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoriaId', 'nombre');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
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
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product disabled successfully', product });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };