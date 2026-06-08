const { Schema, model } = require('mongoose');

const paymentSchema = new Schema({
  orderId:    { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  metodoPago:  { type: String, enum: ['efectivo', 'tarjeta', 'transferencia', 'mixto'], required: true },
  monto:       { type: Number, required: true },
  cambio:      { type: Number, default: 0 },
  estado:      { type: String, enum: ['completado', 'fallido'], default: 'completado' },
  fechaPago:   { type: Date, default: Date.now },
});

module.exports = model('Payment', paymentSchema);