const Order = require("../models/Order");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("tableId", "tableNumber name")
      .populate("customerId", "name email")
      .populate("waiterId", "name")
      .populate("products.productId", "name price");
    res.json({ ok: true, msg: "Orders fetched successfully", data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("tableId", "tableNumber name")
      .populate("customerId", "name email")
      .populate("waiterId", "name")
      .populate("products.productId", "name price");
    if (!order) return res.status(404).json({ ok: false, msg: "Order not found" });
    res.json({ ok: true, msg: "Order fetched successfully", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ ok: true, msg: "Order created successfully", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ ok: false, msg: "Order not found" });
    res.json({ ok: true, msg: "Order updated successfully", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder };
