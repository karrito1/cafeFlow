const { Schema, model } = require('mongoose');

const pedidoSchema = new Schema({
  mesaId:    { type: Schema.Types.ObjectId, ref: 'Mesa', required: true },
  clienteId: { type: Schema.Types.ObjectId, ref: 'Cliente', default: null },
  meseroId:  { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productos: [{
    productoId:      { type: Schema.Types.ObjectId, ref: 'Producto' },
    nombre:          { type: String },
    cantidad:        { type: Number, default: 1 },
    precio:          { type: Number },
    personalizacion: {
      tamano:      { type: String, enum: ['S', 'M', 'L'] },
      leche:       { type: String, enum: ['entera', 'deslactosada', 'vegetal', 'ninguna'] },
      temperatura: { type: String, enum: ['caliente', 'frio'] },
    },
    observacion: { type: String },
  }],
  subtotal:  { type: Number, required: true },
  impuestos: { type: Number, required: true },
  total:     { type: Number, required: true },
  estado:    { type: String, enum: ['activo', 'confirmado', 'pagado', 'cancelado'], default: 'activo' },
}, { timestamps: true });

module.exports = model('Pedido', pedidoSchema);