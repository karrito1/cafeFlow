const express = require("express");
const router = express.Router();

const {
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  getRewardById
} = require("../controllers/reward.controller");

router.get("/", getRewards);
router.get("/:id", getRewardById);
router.post("/", createReward);
router.put("/:id", updateReward);
router.delete("/:id", deleteReward);

module.exports = router;