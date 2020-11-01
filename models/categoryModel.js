const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  category: { type: String, default: "" },
  order:{type:Number},
  category_description: { type: String, default: "" },
  image: { type: String, default: "http://google.com" },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
