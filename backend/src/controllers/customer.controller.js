const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');

// Register customer
const registerCustomer = async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;

    // Check if email already exists
    const exists = await Customer.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already registered' });

    // Encrypt password
    const hash = await bcrypt.hash(password, 12);

    // Create customer
    const customer = await Customer.create({
      nombre,
      email,
      telefono,
      password: hash,
    });

    res.status(201).json({
      msg: 'Customer registered successfully',
      customer: {
        id:     customer._id,
        nombre:   customer.nombre,
        email:  customer.email,
        puntos: customer.points,
        nivel:  customer.level,
      }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
};

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ status: true }).select('-password');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Get customer by ID
const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-password');
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = { registerCustomer, getCustomers, getCustomer };