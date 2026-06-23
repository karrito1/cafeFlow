const Payment = require("../models/Payment");

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("orderId", "total status");
    res.json({ ok: true, msg: "Payments fetched successfully", data: payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("orderId", "total status");
    if (!payment) return res.status(404).json({ ok: false, msg: "Payment not found" });
    res.json({ ok: true, msg: "Payment fetched successfully", data: payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount, change } = req.body;
    const payment = await Payment.create({ orderId, paymentMethod, amount, change });
    res.status(201).json({ ok: true, msg: "Payment created successfully", data: payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

module.exports = { getPayments, getPaymentById, createPayment };
