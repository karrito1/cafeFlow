const { body } = require("express-validator");

const validateCreateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").isIn(["admin", "barista", "cashier"]).withMessage("Role must be admin, barista, or cashier"),
];

module.exports = { validateCreateUser };
