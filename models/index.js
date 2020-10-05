require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://admin:admin123@cluster0.6mzho.mongodb.net/harvest?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("success fully connected");
    }
  },
);

module.exports.Product = require("./ProductModel.js");
module.exports.User = require("./userModel.js");
module.exports.Payment = require("./paymentModel.js");
module.exports.Order = require("./orderModel.js");
module.exports.Location = require("./locationModel.js");
module.exports.Category = require("./categoryModel.js");
