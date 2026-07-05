const { body } = require("express-validator");

const validateCreateUser = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("El correo no es válido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("role").isIn(["admin", "barista", "cashier"]).withMessage("El rol debe ser admin, barista o cajero"),
];

module.exports = { validateCreateUser };
