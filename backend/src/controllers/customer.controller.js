const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");
const Table = require("../models/Table");

const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existing = await Customer.findOne({ email });
    if (existing && existing.active) {
      return res.status(400).json({ ok: false, msg: "El correo ya está registrado" });
    }
    const hash = await bcrypt.hash(password, 12);
    let customer;
    if (existing && !existing.active) {
      existing.name = name;
      existing.phone = phone || "";
      existing.password = hash;
      existing.active = true;
      existing.points = 0;
      existing.lifetimePoints = 0;
      existing.level = "bronze";
      await existing.save();
      customer = existing;
    } else {
      customer = await Customer.create({ name, email, phone, password: hash });
    }
    res.status(201).json({
      ok: true,
      msg: "Cliente registrado correctamente",
      data: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        points: customer.points,
        level: customer.level,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ active: true }).select("-password").sort({ points: -1 }).lean();

    // For each customer, find if they have an assigned table
    const customerIds = customers.map((c) => c._id);
    const tables = await Table.find({ currentCustomer: { $in: customerIds } })
      .select("tableNumber name currentCustomer")
      .lean();

    // Build a map: customerId -> table
    const tableMap = {};
    tables.forEach((t) => {
      if (t.currentCustomer) {
        tableMap[t.currentCustomer.toString()] = t;
      }
    });

    const result = customers.map((c) => ({
      ...c,
      assignedTable: tableMap[c._id.toString()] || null,
    }));

    res.json({ ok: true, msg: "Clientes obtenidos correctamente", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select("-password").lean();
    if (!customer) return res.status(404).json({ ok: false, msg: "Cliente no encontrado" });

    const table = await Table.findOne({ currentCustomer: customer._id })
      .select("tableNumber name")
      .lean();

    res.json({
      ok: true,
      msg: "Cliente obtenido correctamente",
      data: { ...customer, assignedTable: table || null },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ ok: false, msg: "Cliente no encontrado" });

    // Remove from any table that has this customer assigned
    await Table.updateMany({ currentCustomer: id }, { $set: { currentCustomer: null } });

    // Soft delete: mark as inactive
    await Customer.findByIdAndUpdate(id, { active: false });

    res.json({ ok: true, msg: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

module.exports = { registerCustomer, getCustomers, getCustomer, deleteCustomer };
