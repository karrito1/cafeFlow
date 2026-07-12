const Order = require("../models/Order");
const Customer = require("../models/Customer");

function getDiscountPercent(lifetimePoints) {
  if (lifetimePoints >= 600) return 0.15;
  if (lifetimePoints >= 300) return 0.10;
  if (lifetimePoints >= 100) return 0.05;
  return 0;
}

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("tableId", "tableNumber name")
      .populate("customerId", "name email points lifetimePoints level")
      .populate("waiterId", "name")
      .populate("products.productId", "name price");
    res.json({ ok: true, msg: "Pedidos obtenidos", data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("tableId", "tableNumber name")
      .populate("customerId", "name email points lifetimePoints level")
      .populate("waiterId", "name")
      .populate("products.productId", "name price");
    if (!order) return res.status(404).json({ ok: false, msg: "Pedido no encontrado" });
    res.json({ ok: true, msg: "Pedido obtenido", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const createOrder = async (req, res) => {
  try {
    const { subtotal: rawSubtotal, customerId, discount: clientDiscount } = req.body;

    let serverDiscount = 0;
    if (customerId) {
      const customer = await Customer.findById(customerId).select("lifetimePoints").lean();
      if (customer) {
        const pct = getDiscountPercent(customer.lifetimePoints || 0);
        serverDiscount = Math.round(rawSubtotal * pct);
      }
    }

    const orderData = { ...req.body, discount: serverDiscount };
    orderData.total = rawSubtotal - serverDiscount;
    orderData.taxes = Math.round((rawSubtotal - serverDiscount) * 0.19 / 1.19);
    orderData.total = Math.round(orderData.total || 0);
    orderData.taxes = Math.round(orderData.taxes || 0);

    const order = await Order.create(orderData);
    res.status(201).json({ ok: true, msg: "Pedido creado correctamente", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { status: newStatus, ...rest } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ ok: false, msg: "Pedido no encontrado" });

    const wasAlreadyPaid = order.status === "paid";

    Object.assign(order, rest);
    if (newStatus) order.status = newStatus;
    await order.save();

    let earnedPoints = 0;

    if (order.status === "paid" && !wasAlreadyPaid && order.customerId) {
      const Payment = require("../models/Payment");
      const existingPayment = await Payment.findOne({ orderId: order._id });
      if (!existingPayment) {
        await Payment.create({
          orderId: order._id,
          paymentMethod: "cash",
          amount: order.total,
          change: 0,
          status: "completed",
        });
      }

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

    res.json({
      ok: true,
      msg: earnedPoints > 0
        ? `Pedido pagado. ${earnedPoints} punto(s) agregado(s)`
        : "Pedido actualizado correctamente",
      data: { ...order.toObject(), earnedPoints },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder };
