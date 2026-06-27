const router = require("express").Router();
const { verifyToken, onlyRole } = require("../middlewares/auth");
const {
  createTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
} = require("../controllers/table.controller");

router.post("/", verifyToken, onlyRole("admin"), createTable);
router.get("/", verifyToken, onlyRole("admin", "barista"), getTables);
router.get("/:id", verifyToken, onlyRole("admin", "barista"), getTableById);
router.put("/:id", verifyToken, onlyRole("admin"), updateTable);
router.delete("/:id", verifyToken, onlyRole("admin"), deleteTable);

module.exports = router;
