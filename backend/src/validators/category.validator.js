const { body } = require("express-validator");

const validateCreateCategory = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
];

module.exports = { validateCreateCategory };
