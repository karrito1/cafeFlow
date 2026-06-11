const Order = require('../models/Order');
require('../models/Table');
require('../models/User');
require('../models/Product');

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('tableId', 'tableNumber name')
      .populate('customerId', 'name email')
      .populate('waiterId', 'name')
      .populate('products.productId', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('tableId', 'tableNumber name')
      .populate('customerId', 'name email')
      .populate('waiterId', 'name')
      .populate('products.productId', 'name price');
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder };