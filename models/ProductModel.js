const mongoose = require("mongoose");
const mongoosastic = require('mongoosastic');
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
  original_price:{ type: Number },
  product_price: { type: Number },
  percent_off: { type: Number },
  you_save: { type: Number },
  count:{type:Number,default:0},
  varient: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }]
});
productSchema.plugin(mongoosastic, {
    "host": "localhost",
    "port": 9200
});

const Product = mongoose.model("Product", productSchema);

Product.createMapping((err, mapping) => {
    console.log('mapping created');
});
productSchema.index({ type: 1});
module.exports = Product;
