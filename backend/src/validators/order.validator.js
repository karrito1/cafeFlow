const { body } = require("express-validator");

const validateCreateOrder = [
  body("tableId").isMongoId().withMessage("Valid tableId is required"),
  body("waiterId").isMongoId().withMessage("Valid waiterId is required"),
  body("products").isArray({ min: 1 }).withMessage("At least one product is required"),
  body("products.*.productId").isMongoId().withMessage("Valid productId is required"),
  body("products.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("subtotal").isNumeric().withMessage("Subtotal is required"),
  body("taxes").isNumeric().withMessage("Taxes are required"),
  body("total").isNumeric().withMessage("Total is required"),
];

module.exports = { validateCreateOrder };
