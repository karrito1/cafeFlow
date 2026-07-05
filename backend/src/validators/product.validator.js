const { body } = require("express-validator");

const validateCreateProduct = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  body("price.M").notEmpty().withMessage("El precio mediano (M) es obligatorio"),
  body("categoryId").isMongoId().withMessage("La categoría no es válida"),
];

module.exports = { validateCreateProduct };
