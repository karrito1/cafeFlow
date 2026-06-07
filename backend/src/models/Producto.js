const { Schema, model } = require('mongoose');

const productoSchema = new Schema({
  nombre:      { type: String, required: true },
  descripcion: { type: String },
  precio: {
    S: { type: Number },
    M: { type: Number, required: true },
    L: { type: Number },
  },
  imagen:      { type: String },
  categoriaId: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
  destacado:   { type: Boolean, default: false },
  stock:       { type: Number, default: 0, min: 0 },
  activo:      { type: Boolean, default: true },
}, { timestamps: true });

module.exports = model('Producto', productoSchema);