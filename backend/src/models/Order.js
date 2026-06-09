const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    mesaId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    clienteId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    meseroId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productos: [
      {
        productoId: { type: Schema.Types.ObjectId, ref: "Product" },
        nombre: String, // snapshot del nombre al momento del pedido
        cantidad: { type: Number, default: 1 },
        precio: Number, // precio unitario al momento
        personalizacion: {
          tamano: { type: String, enum: ["S", "M", "L"] },
          leche: {
            type: String,
            enum: ["entera", "deslactosada", "vegetal", "ninguna"],
          },
          temperatura: { type: String, enum: ["caliente", "frio"] },
        },
        observacion: String,
      },
    ],
    subtotal: { type: Number, required: true },
    impuestos: { type: Number, required: true },
    total: { type: Number, required: true },
    estado: {
      type: String,
      enum: ["activo", "confirmado", "pagado", "cancelado"],
      default: "activo",
    },
  },
  { timestamps: true },
);

module.exports = model("Order", orderSchema);
