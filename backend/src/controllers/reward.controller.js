const Reward = require("../models/Reward");

const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ active: true });
    res.json({ ok: true, msg: "Recompensas obtenidas correctamente", data: rewards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) return res.status(404).json({ ok: false, msg: "Recompensa no encontrada" });
    res.json({ ok: true, msg: "Recompensa obtenida correctamente", data: reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const createReward = async (req, res) => {
  try {
    const reward = await Reward.create(req.body);
    res.status(201).json({ ok: true, msg: "Recompensa creada correctamente", data: reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const updateReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reward) return res.status(404).json({ ok: false, msg: "Recompensa no encontrada" });
    res.json({ ok: true, msg: "Recompensa actualizada correctamente", data: reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const deleteReward = async (req, res) => {
  try {
    await Reward.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ ok: true, msg: "Recompensa desactivada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const claimReward = async (req, res) => {
  try {
    const { customerId, rewardId } = req.body;
    if (!customerId || !rewardId) {
      return res.status(400).json({ ok: false, msg: "Se requieren customerId y rewardId" });
    }
    const Customer = require("../models/Customer");
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ ok: false, msg: "Cliente no encontrado" });
    const reward = await Reward.findById(rewardId);
    if (!reward) return res.status(404).json({ ok: false, msg: "Recompensa no encontrada" });
    if (!reward.active) return res.status(400).json({ ok: false, msg: "La recompensa no está activa" });
    if (customer.points < reward.pointsRequired) {
      return res.status(400).json({ ok: false, msg: "Puntos insuficientes" });
    }
    customer.points -= reward.pointsRequired;
    await customer.save();
    res.json({ ok: true, msg: "Recompensa reclamada correctamente", data: { customer, reward } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

module.exports = { getRewards, getRewardById, createReward, updateReward, deleteReward, claimReward };
