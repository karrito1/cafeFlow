const router = require("express").Router();
const { verifyToken, onlyRole } = require("../middlewares/auth");
const { handleValidationErrors } = require("../middlewares/validate");
const { validateCreateUser } = require("../validators/user.validator");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

router.post("/", verifyToken, onlyRole("admin"), validateCreateUser, handleValidationErrors, createUser);
router.get("/", verifyToken, onlyRole("admin"), getUsers);
router.get("/:id", verifyToken, onlyRole("admin"), getUserById);
router.put("/:id", verifyToken, onlyRole("admin"), updateUser);
router.delete("/:id", verifyToken, onlyRole("admin"), deleteUser);

module.exports = router;
