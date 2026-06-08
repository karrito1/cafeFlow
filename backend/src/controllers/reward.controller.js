const Reward = require('../models/Reward');

const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ activa: true });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const createReward = async (req, res) => {
  try {
    const reward = await Reward.create(req.body);
    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor', error: error.message });
  }
};

const updateReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!reward) return res.status(404).json({ msg: 'Reward no encontrada' });
    res.json(reward);
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const deleteReward = async (req, res) => {
  try {
    await Reward.findByIdAndUpdate(req.params.id, { activa: false });
    res.json({ msg: 'Reward desactivada' });
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};
const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) return res.status(404).json({ msg: 'Reward no encontrada' });
    res.json(reward);
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

module.exports = { getRewards, createReward, updateReward, deleteReward, getRewardById };