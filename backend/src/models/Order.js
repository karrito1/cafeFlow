const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    tableId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", default: null },
    waiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: { type: String },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
        customization: {
          size: { type: String, enum: ["S", "M", "L"] },
          milk: {
            type: String,
            enum: ["whole", "lactose-free", "plant-based", "none"],
          },
          temperature: { type: String, enum: ["hot", "cold"] },
        },
        note: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    taxes: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "confirmed", "paid", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = model("Order", orderSchema);
