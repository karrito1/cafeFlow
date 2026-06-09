const Payment = require('../models/Payment');
require('../models/Order');
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('orderId', 'total estado');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('orderId', 'total estado');
    if (!payment) return res.status(404).json({ msg: 'Pago no encontrado' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { orderId, metodoPago, monto, cambio } = req.body;
    const payment = await Payment.create({
      orderId,
      metodoPago,
      monto,
      cambio,
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports = { getPayments, getPaymentById, createPayment };