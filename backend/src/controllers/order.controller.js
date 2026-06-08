const Order = require('../models/Order');
const Table = require('../models/Table');

// Create order
const createOrder = async (req, res) => {
  try {
    const { tableId, customerId, waiterId, products } = req.body;

    const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const taxes = subtotal * 0.10;
    const total = subtotal + taxes;

    const order = await Order.create({
      tableId, customerId, waiterId, products, subtotal, taxes, total,
    });

    await Table.findByIdAndUpdate(tableId, {
      status: 'occupied',
      openedAt: new Date(),
    });

    res.status(201).json({ msg: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('tableId', 'name number')
      .populate('waiterId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('tableId', 'name number')
      .populate('waiterId', 'name');
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json({ msg: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
};

// Confirm order
const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    );
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    await Table.findByIdAndUpdate(order.tableId, { status: 'pendingPayment' });
    res.json({ msg: 'Order confirmed successfully', order });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrder, updateOrder, confirmOrder };