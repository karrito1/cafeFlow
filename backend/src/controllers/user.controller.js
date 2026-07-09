const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create User
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, accessCode, active } = req.body;

    // Check if email exists
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Create user
    const createdUser = await User.create({
      name,
      email,
      password: hash,
      role,
      accessCode,
      active,
    });

    res.status(201).json({
      ok: true,
      msg: "User created successfully",
      data: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        accessCode: createdUser.accessCode,
        active: createdUser.active,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -accessCode");

    res.status(200).json({
      ok: true,
      msg: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -accessCode");

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }
    const data = { ...req.body };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    }).select("-password -accessCode");

    res.status(200).json({
      ok: true,
      msg: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: "User deleted successfully",
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
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
