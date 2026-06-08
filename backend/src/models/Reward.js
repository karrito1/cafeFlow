const { Schema, model } = require('mongoose');

const rewardSchema = new Schema({
  nombre:           { type: String, required: true },
  descripcion:      { type: String },
  puntosNecesarios: { type: Number, required: true },
  tipo:             { type: String, enum: ['descuento', 'producto'], required: true },
  valor:            { type: Number, required: true },
  activa:           { type: Boolean, default: true },
}, { timestamps: true });

module.exports = model('Reward', rewardSchema);