const express = require("express");
const router = express.Router();
const { verifyToken, onlyRole } = require("../middlewares/auth");

const {
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  getRewardById
} = require("../controllers/reward.controller");

router.get("/", getRewards);
router.get("/:id", getRewardById);
router.post("/", verifyToken, onlyRole("admin"), createReward);
router.put("/:id", verifyToken, onlyRole("admin"), updateReward);
router.delete("/:id", verifyToken, onlyRole("admin"), deleteReward);

module.exports = router;