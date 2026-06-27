const { Schema, model } = require("mongoose");

const rewardSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    pointsRequired: { type: Number, required: true },
    type: { type: String, enum: ["discount", "product"], required: true },
    value: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = model("Reward", rewardSchema);
