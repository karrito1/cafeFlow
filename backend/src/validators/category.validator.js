const { body } = require("express-validator");

const validateCreateCategory = [
  body("name").notEmpty().withMessage("Name is required"),
];

module.exports = { validateCreateCategory };
