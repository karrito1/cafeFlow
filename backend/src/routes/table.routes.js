const router = require("express").Router();
const {
  createTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
} = require("../controllers/table.controller");

router.post("/", createTable);
router.get("/", getTables);
router.get("/:id", getTableById);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

module.exports = router;