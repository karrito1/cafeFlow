const Category = require("../models/Category");

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description, order, active } = req.body;

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({
        ok: false,
        msg: "La categoría ya existe",
      });
    }

    const category = await Category.create({
      name,
      description,
      order,
      active,
    });

    res.status(201).json({
      ok: true,
      msg: "Categoría creada correctamente",
      data: category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};

// Get Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });

    res.status(200).json({
      ok: true,
      msg: "Categorías obtenidas correctamente",
      data: categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
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
        msg: "Categoría no encontrada",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Categoría obtenida correctamente",
      data: category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
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
        msg: "Categoría no encontrada",
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
      msg: "Categoría actualizada correctamente",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
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
        msg: "Categoría no encontrada",
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: "Categoría eliminada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };