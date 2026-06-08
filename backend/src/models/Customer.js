const { Schema, model } = require('mongoose');

const customerSchema = new Schema({
  nombre:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  telefono: { type: String },
  password: { type: String, required: true },
  puntos:   { type: Number, default: 0 },
  nivel:    { type: String, enum: ['bronze', 'silver', 'gold'], default: 'bronze' },
  status:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = model('Customer', customerSchema);