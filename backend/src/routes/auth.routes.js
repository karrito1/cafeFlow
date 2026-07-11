const router = require("express").Router();
const { login, loginCustomer, register, forgotPassword, resetPassword, getMe } = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth");

router.post("/login", login);
router.post("/login-customer", loginCustomer);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", verifyToken, getMe);

module.exports = router;
