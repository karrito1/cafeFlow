const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find active user
    const user = await User.findOne({ email, active: true });
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    // comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    // generamos token  jtwn
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
};

module.exports = { login };