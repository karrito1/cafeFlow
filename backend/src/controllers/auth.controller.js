const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Customer = require("../models/Customer");
const { sendResetEmail } = require("../utils/mailer");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, active: true });
    if (!user) return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      ok: true,
      msg: "Inicio de sesión exitoso",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email, active: true });
    if (!customer) return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    const token = jwt.sign(
      { id: customer._id, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      ok: true,
      msg: "Inicio de sesión exitoso",
      data: {
        token,
        user: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          role: "customer",
          points: customer.points,
          lifetimePoints: customer.lifetimePoints,
          level: customer.level,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ ok: false, msg: "El correo ya está registrado" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "waiter",
      active: true,
    });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(201).json({
      ok: true,
      msg: "Usuario registrado exitosamente",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ ok: false, msg: "El correo es obligatorio" });

    const user = await User.findOne({ email, active: true });
    const customer = !user ? await Customer.findOne({ email, active: true }) : null;
    const account = user || customer;

    if (!account) return res.json({ ok: true, msg: "Si el correo está registrado, recibirás un enlace" });

    const token = crypto.randomBytes(32).toString("hex");

    account.resetPasswordToken = token;
    account.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await account.save();

    await sendResetEmail(email, token);

    res.json({ ok: true, msg: "Si el correo está registrado, recibirás un enlace" });
  } catch (error) {
    console.error("Error en forgotPassword:", error.message);
    res.status(500).json({ ok: false, msg: "Error al enviar el correo" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ ok: false, msg: "La contraseña debe tener al menos 6 caracteres" });
    }

    let account = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!account) {
      account = await Customer.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      });
    }

    if (!account) return res.status(400).json({ ok: false, msg: "Token inválido o expirado" });

    account.password = await bcrypt.hash(password, 12);
    account.resetPasswordToken = null;
    account.resetPasswordExpires = null;
    await account.save();

    res.json({ ok: true, msg: "Contraseña restablecida exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

const getMe = async (req, res) => {
  try {
    if (req.user.role === "customer") {
      const customer = await Customer.findById(req.user.id).select("-password").lean();
      if (!customer || !customer.active) {
        return res.status(404).json({ ok: false, msg: "Cliente no encontrado" });
      }
      return res.json({
        ok: true,
        data: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          role: "customer",
          points: customer.points,
          lifetimePoints: customer.lifetimePoints,
          level: customer.level,
        },
      });
    }

    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user || !user.active) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }
    res.json({
      ok: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
};

module.exports = { login, loginCustomer, register, forgotPassword, resetPassword, getMe };
