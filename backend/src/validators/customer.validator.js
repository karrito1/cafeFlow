const { body } = require("express-validator");

const validateCreateCustomer = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("El correo no es válido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

module.exports = { validateCreateCustomer };
