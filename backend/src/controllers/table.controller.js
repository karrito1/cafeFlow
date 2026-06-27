const Table = require("../models/Table");

// Create Table
const createTable = async (req, res) => {
  try {
    const { tableNumber, name, capacity, status, assignedWaiter, openedAt } =
      req.body;

    const exists = await Table.findOne({ tableNumber });

    if (exists) {
      return res.status(400).json({
        ok: false,
        msg: "Table number already exists",
      });
    }

    const table = await Table.create({
      tableNumber,
      name,
      capacity,
      status,
      assignedWaiter,
      openedAt,
    });

    res.status(201).json({
      ok: true,
      msg: "Table created successfully",
      data: table,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

// Get Tables
const getTables = async (req, res) => {
  try {
    const tables = await Table.find().populate(
      "assignedWaiter",
      "name email role",
    );

    res.status(200).json({
      ok: true,
      msg: "Tables fetched successfully",
      data: tables,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

// Get Table By Id
const getTableById = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id).populate(
      "assignedWaiter",
      "name email role",
    );

    if (!table) {
      return res.status(404).json({
        ok: false,
        msg: "Table not found",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Table fetched successfully",
      data: table,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
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
        msg: "Table not found",
      });
    }

    const updatedTable = await Table.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("assignedWaiter", "name email role");

    res.status(200).json({
      ok: true,
      msg: "Table updated successfully",
      data: updatedTable,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
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
        msg: "Table not found",
      });
    }

    await Table.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: "Table deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
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
