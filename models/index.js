require('dotenv').config()
const mongoose=require("mongoose");
mongoose.connect("",{useNewUrlParser:true, useUnifiedTopology: true},function (err) {
  if(err){console.log(err);}else{console.log("success fully connected");}
});




module.exports.Shop=require("./shopModel.js");
module.exports.User=require("./userModel.js");
module.exports.Payment=require("./paymentModel.js");
module.exports.Order=require("./orderModel.js");
