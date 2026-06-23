const Reward = require("../models/Reward");

const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ active: true });
    res.json({ ok: true, msg: "Rewards fetched successfully", data: rewards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) return res.status(404).json({ ok: false, msg: "Reward not found" });
    res.json({ ok: true, msg: "Reward fetched successfully", data: reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const createReward = async (req, res) => {
  try {
    const reward = await Reward.create(req.body);
    res.status(201).json({ ok: true, msg: "Reward created successfully", data: reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const updateReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reward) return res.status(404).json({ ok: false, msg: "Reward not found" });
    res.json({ ok: true, msg: "Reward updated successfully", data: reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const deleteReward = async (req, res) => {
  try {
    await Reward.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ ok: true, msg: "Reward deactivated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

module.exports = { getRewards, getRewardById, createReward, updateReward, deleteReward };
