const { Schema, model } = require('mongoose');

const categoriaSchema = new Schema({
  nombre:      { type: String, required: true, unique: true },
  descripcion: { type: String },
  orden:       { type: Number, default: 0 },
  activa:      { type: Boolean, default: true },
}, { timestamps: true });

module.exports = model('Categoria', categoriaSchema);

