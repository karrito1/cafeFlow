const Order = require("../models/Order");

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
    const order = await Order.create(req.body);
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
