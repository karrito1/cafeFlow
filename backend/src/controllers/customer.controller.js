const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");

const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const exists = await Customer.findOne({ email });
    if (exists) return res.status(400).json({ ok: false, msg: "El correo ya está registrado" });
    const hash = await bcrypt.hash(password, 12);
    const customer = await Customer.create({ name, email, phone, password: hash });
    res.status(201).json({
      ok: true,
      msg: "Customer registered successfully",
      data: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        points: customer.points,
        level: customer.level,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ active: true }).select("-password");
    res.json({ ok: true, msg: "Customers fetched successfully", data: customers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select("-password");
    if (!customer) return res.status(404).json({ ok: false, msg: "Customer not found" });
    res.json({ ok: true, msg: "Customer fetched successfully", data: customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

module.exports = { registerCustomer, getCustomers, getCustomer };
