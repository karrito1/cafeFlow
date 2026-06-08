const bcrypt = require('bcryptjs');
const Cliente = require('../models/Cliente');

// Registrar cliente
const registrarCliente = async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;

    // Verificar si ya existe
    const existe = await Cliente.findOne({ email });
    if (existe) return res.status(400).json({ msg: 'El email ya está registrado' });

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 12);

    // Crear cliente
    const cliente = await Cliente.create({
      nombre,
      email,
      telefono,
      password: hash,
    });

    res.status(201).json({
      msg: 'Cliente registrado exitosamente',
      cliente: {
        id:     cliente._id,
        nombre: cliente.nombre,
        email:  cliente.email,
        puntos: cliente.puntos,
        nivel:  cliente.nivel,
      }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor', error: error.message });
  }
};

// Obtener todos los clientes
const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find({ estado: true }).select('-password');
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Obtener un cliente por ID
const getCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).select('-password');
    if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

module.exports = { registrarCliente, getClientes, getCliente };