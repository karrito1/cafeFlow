const router = require("express").Router();
const { login, loginCustomer, register, forgotPassword, resetPassword } = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/login-customer", loginCustomer);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
