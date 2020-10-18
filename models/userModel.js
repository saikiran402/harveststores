const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, default: "" },
  name: { type: String, default: "" },
  registrationToken:{type:String},
  address: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
  paid: { type: Boolean },
  isAdmin: { type: Boolean, default: false },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  myorders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  token: { type: String, default: "" },
  mycart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      price: Number,
      count: Number,
    }
  ],
  amountDue:{type:Number,default:0},
  credits:{type:Number,default:0}
  
});

const User = mongoose.model("User", userSchema);

module.exports = User;
