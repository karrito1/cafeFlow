const { body } = require("express-validator");

const validateCreateCustomer = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("El correo no es válido"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

module.exports = { validateCreateCustomer };
