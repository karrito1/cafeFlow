const { Schema, model } = require("mongoose");

const paymentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "transfer", "mixed"],
    required: true,
  },
  amount: { type: Number, required: true },
  change: { type: Number, default: 0 },
  status: { type: String, enum: ["completed", "failed"], default: "completed" },
  paymentDate: { type: Date, default: Date.now },
});

module.exports = model("Payment", paymentSchema);
