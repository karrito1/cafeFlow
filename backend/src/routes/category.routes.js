const express = require("express");
const router = express.Router();
const { verifyToken, onlyRole } = require("../middlewares/auth");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post("/", verifyToken, onlyRole("admin"), createCategory);
router.put("/:id", verifyToken, onlyRole("admin"), updateCategory);
router.delete("/:id", verifyToken, onlyRole("admin"), deleteCategory);

module.exports = router;