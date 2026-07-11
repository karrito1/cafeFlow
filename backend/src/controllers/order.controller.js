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
      .populate("customerId", "name email points level")
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
      .populate("customerId", "name email points level")
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
    if (customerId) {
      orderData.total = rawSubtotal - serverDiscount + (rawSubtotal - serverDiscount) * 0.19;
      orderData.taxes = (rawSubtotal - serverDiscount) * 0.19;
    }
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
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ ok: false, msg: "Pedido no encontrado" });
    res.json({ ok: true, msg: "Pedido actualizado correctamente", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder };
