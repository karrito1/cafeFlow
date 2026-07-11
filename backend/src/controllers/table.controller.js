const Table = require("../models/Table");

// Create Table
const createTable = async (req, res) => {
  try {
    const { tableNumber, name, capacity, status, assignedWaiter, openedAt, currentCustomer } =
      req.body;

    const exists = await Table.findOne({ tableNumber });

    if (exists) {
      return res.status(400).json({
        ok: false,
        msg: "El número de mesa ya existe",
      });
    }

    const table = await Table.create({
      tableNumber,
      name,
      capacity,
      status,
      assignedWaiter,
      openedAt,
      currentCustomer: currentCustomer || null,
    });

    const populated = await Table.findById(table._id)
      .populate("assignedWaiter", "name email role")
      .populate("currentCustomer", "name email phone level points");

    res.status(201).json({
      ok: true,
      msg: "Mesa creada correctamente",
      data: populated,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};

// Get Tables
const getTables = async (req, res) => {
  try {
    const tables = await Table.find()
      .populate("assignedWaiter", "name email role")
      .populate("currentCustomer", "name email phone level points");

    res.status(200).json({
      ok: true,
      msg: "Mesas obtenidas correctamente",
      data: tables,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};

// Get Table By Id
const getTableById = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id)
      .populate("assignedWaiter", "name email role")
      .populate("currentCustomer", "name email phone level points");

    if (!table) {
      return res.status(404).json({
        ok: false,
        msg: "Mesa no encontrada",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Mesa obtenida correctamente",
      data: table,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};

// Update Table
const updateTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({
        ok: false,
        msg: "Mesa no encontrada",
      });
    }

    const updatedTable = await Table.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("assignedWaiter", "name email role")
      .populate("currentCustomer", "name email phone level points");

    res.status(200).json({
      ok: true,
      msg: "Mesa actualizada correctamente",
      data: updatedTable,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};

// Delete Table
const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({
        ok: false,
        msg: "Mesa no encontrada",
      });
    }

    await Table.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: "Mesa eliminada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};

module.exports = {
  createTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
};
