const mongoose = require("mongoose");

const SampleSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  product: String,
  type: String,
  image: { type: String, default: "http://google.com" }, // Deafault image to be replaced
  product_name: String,
  product_description: String,
  unit: { type: String, enum: ["grams", "kilo", "liter", "dozen","Piece"] },
  inStock: { type: Boolean, default: true },
  quantity: String,
  isveg: {type:Boolean,default:true},
  product_price: { type: Number },
  varient: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }]
});

const Sample = mongoose.model("Sample", SampleSchema);

module.exports = Sample;