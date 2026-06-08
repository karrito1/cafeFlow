const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  nombre:       { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true },
  rol:          { type: String, enum: ['admin', 'barista', 'cajero'], default: 'barista' },
  codigoAcceso: { type: String },
  estado:       { type: Boolean, default: true },
}, { timestamps: true });

module.exports = model('User', userSchema);