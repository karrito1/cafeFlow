const { body } = require("express-validator");

const validateCreateProduct = [
  body("name").notEmpty().withMessage("Name is required"),
  body("price").isObject().withMessage("Price must be an object with S, M, L values"),
  body("price.M").notEmpty().withMessage("Medium price (M) is required"),
  body("categoryId").isMongoId().withMessage("Valid categoryId is required"),
];

module.exports = { validateCreateProduct };
