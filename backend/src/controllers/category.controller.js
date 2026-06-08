const Category = require("../models/Category");

// Create Category
const createCategory = async (req, res) => {
  try {
    const { nombre, descripcion, orden, activa } = req.body;

    const exists = await Category.findOne({ nombre });

    if (exists) {
      return res.status(400).json({
        ok: false,
        msg: "Category already exists",
      });
    }

    const category = await Category.create({
      nombre,
      descripcion,
      orden,
      activa,
    });

    res.status(201).json({
      ok: true,
      msg: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

// Get Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ orden: 1 });

    res.status(200).json({
      ok: true,
      categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

// Get Category By Id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        ok: false,
        msg: "Category not found",
      });
    }

    res.status(200).json({
      ok: true,
      category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        ok: false,
        msg: "Category not found",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      ok: true,
      msg: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        ok: false,
        msg: "Category not found",
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};