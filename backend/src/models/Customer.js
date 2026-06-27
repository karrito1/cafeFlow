const { Schema, model } = require("mongoose");

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, required: true },
    points: { type: Number, default: 0 },
    level: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = model("Customer", customerSchema);
