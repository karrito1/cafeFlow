const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, categoryId, featured, stock } = req.body;
    const product = await Product.create({ name, description, price, image, categoryId, featured, stock });
    res.status(201).json({ ok: true, msg: "Product created successfully", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ active: true }).populate("categoryId", "name");
    res.json({ ok: true, msg: "Products fetched successfully", data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name");
    if (!product) return res.status(404).json({ ok: false, msg: "Product not found" });
    res.json({ ok: true, msg: "Product fetched successfully", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ ok: false, msg: "Product not found" });
    res.json({ ok: true, msg: "Product updated successfully", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!product) return res.status(404).json({ ok: false, msg: "Product not found" });
    res.json({ ok: true, msg: "Product disabled successfully", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const uploadImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ ok: false, msg: "Product not found" });
    product.image = req.file.path;
    await product.save();
    res.json({ ok: true, msg: "Image uploaded successfully", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct, uploadImage };
