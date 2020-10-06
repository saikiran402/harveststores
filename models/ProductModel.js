const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  product: String,
  type: String,
  image: { type: String, default: "http://google.com" }, // Deafault image to be replaced
  product_name: String,
  product_description: String,
  unit: { type: String, enum: ["grams", "kilo", "liter", "dozen"] },
  inStock: { type: Boolean, default: true },
  quantity: String,
  isveg: Boolean,
  product_price: { type: Number },
  varient: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
