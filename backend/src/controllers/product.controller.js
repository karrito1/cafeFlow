const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, categoryId, featured, stock } = req.body;
    const product = await Product.create({ name, description, price, image, categoryId, featured, stock });
    res.status(201).json({ ok: true, msg: "Producto creado correctamente", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ active: true }).populate("categoryId", "name");
    res.json({ ok: true, msg: "Productos obtenidos correctamente", data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name");
    if (!product) return res.status(404).json({ ok: false, msg: "Producto no encontrado" });
    res.json({ ok: true, msg: "Producto obtenido correctamente", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ ok: false, msg: "Producto no encontrado" });
    res.json({ ok: true, msg: "Producto actualizado correctamente", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!product) return res.status(404).json({ ok: false, msg: "Producto no encontrado" });
    res.json({ ok: true, msg: "Producto desactivado correctamente", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const uploadImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ ok: false, msg: "Producto no encontrado" });
    product.image = req.file.path;
    await product.save();
    res.json({ ok: true, msg: "Imagen subida correctamente", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct, uploadImage };
