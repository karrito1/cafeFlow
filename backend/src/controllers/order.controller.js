const Order = require('../models/Order');
require('../models/Table');
require('../models/User');
require('../models/Product');

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('mesaId', 'numeroMesa nombre')
      .populate('clienteId', 'nombre email')
      .populate('meseroId', 'nombre')
      .populate('productos.productoId', 'nombre precio');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('mesaId', 'numeroMesa nombre')
      .populate('clienteId', 'nombre email')
      .populate('meseroId', 'nombre')
      .populate('productos.productoId', 'nombre precio');
    if (!order) return res.status(404).json({ msg: 'Pedido no encontrado' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor', error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!order) return res.status(404).json({ msg: 'Pedido no encontrado' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// const confirmOrder = async (req, res) => {
//   try {
//     const { estado } = req.body;
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { estado },
//       { new: true }
//     );
//     if (!order) return res.status(404).json({ msg: 'Pedido no encontrado' });
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ msg: 'Error del servidor' });
//   }
// };

module.exports = { getOrders, getOrderById, createOrder, updateOrder };