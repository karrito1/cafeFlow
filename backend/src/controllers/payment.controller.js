const Payment = require("../models/Payment");
require("../models/Order");

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("orderId", "total status");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate(
      "orderId",
      "total status",
    );
    if (!payment) return res.status(404).json({ msg: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount, change } = req.body;
    const payment = await Payment.create({
      orderId,
      paymentMethod,
      amount,
      change,
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { getPayments, getPaymentById, createPayment };
