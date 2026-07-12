const { body } = require("express-validator");

const validateCreateOrder = [
  body("tableId").isMongoId().withMessage("La mesa no es válida"),
  body("waiterId").isMongoId().withMessage("El mesero no es válido"),
  body("products").isArray({ min: 1 }).withMessage("Debe incluir al menos un producto"),
  body("products.*.productId").isMongoId().withMessage("El producto no es válido"),
  body("products.*.quantity").isInt({ min: 1 }).withMessage("La cantidad debe ser al menos 1"),
  body("subtotal").isNumeric().withMessage("El subtotal es obligatorio"),
  body("total").isNumeric().withMessage("El total es obligatorio"),
];

module.exports = { validateCreateOrder };
