const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  product: String,
  type: String,
  image: { type: String, default: "http://google.com" }, // Deafault image to be replaced
  product_name: {type:String,unique:true},
  product_description: String,
  inStock: { type: Boolean, default: true },
  quantity: String,
  isveg: {type:Boolean,default:true},
  product_price: { type: Number },
  varient: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
