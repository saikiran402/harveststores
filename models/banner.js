const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  image: { type: String, default: "http://google.com" }
});

const Banner= mongoose.model("Banner", BannerSchema);

module.exports = Banner;
