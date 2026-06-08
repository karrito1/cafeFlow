const { Schema, model } = require('mongoose');

const mesaSchema = new Schema({
  numeroMesa:     { type: Number, required: true, unique: true },
  nombre:         { type: String },
  capacidad:      { type: Number, default: 4 },
  estado:         { type: String, enum: ['libre', 'ocupada', 'pendientePago'], default: 'libre' },
  meseroAsignado: { type: Schema.Types.ObjectId, ref: 'Usuario', default: null },
  horaApertura:   { type: Date, default: null },
}, { timestamps: true });

module.exports = model('Mesa', mesaSchema);