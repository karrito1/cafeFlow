const Payment = require("../models/Payment");

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("orderId", "total status");
    res.json({ ok: true, msg: "Pagos obtenidos correctamente", data: payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("orderId", "total status");
    if (!payment) return res.status(404).json({ ok: false, msg: "Pago no encontrado" });
    res.json({ ok: true, msg: "Pago obtenido correctamente", data: payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const Order = require("../models/Order");
const Customer = require("../models/Customer");

const createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount, change } = req.body;

    const payment = await Payment.create({ orderId, paymentMethod, amount, change });

    // Mark order as paid
    const order = await Order.findById(orderId);

    if (order) {
      order.status = "paid";
      await order.save();
    }

    // Loyalty System logic: Award points
    let earnedPoints = 0;
    if (order && order.customerId) {
      const customer = await Customer.findById(order.customerId);

      if (customer) {
        earnedPoints = Math.floor(order.total / 500);

        customer.points = (customer.points || 0) + earnedPoints;
        customer.lifetimePoints = (customer.lifetimePoints || 0) + earnedPoints;

        if (customer.lifetimePoints >= 2000) {
          customer.level = "gold";
        } else if (customer.lifetimePoints >= 500) {
          customer.level = "silver";
        } else {
          customer.level = "bronze";
        }

        await customer.save();
      }
    }

    res.status(201).json({
      ok: true,
      msg: earnedPoints > 0
        ? `Pago registrado. ${earnedPoints} punto(s) agregado(s)`
        : "Pago registrado correctamente",
      data: { ...payment.toObject(), earnedPoints },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

module.exports = { getPayments, getPaymentById, createPayment };
