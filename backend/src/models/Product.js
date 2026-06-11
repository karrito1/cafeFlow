const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: {
      S: { type: Number },
      M: { type: Number, required: true },
      L: { type: Number },
    },
    image: { type: String },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    featured: { type: Boolean, default: false },
    stock: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = model("Product", productSchema);
