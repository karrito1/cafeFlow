const { Schema, model } = require("mongoose");

const tableSchema = new Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    name: { type: String },
    capacity: { type: Number, default: 4 },
    status: {
      type: String,
      enum: ["free", "occupied", "pendingPayment"],
      default: "free",
    },
    assignedWaiter: { type: Schema.Types.ObjectId, ref: "User", default: null },
    openedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = model("Table", tableSchema);
