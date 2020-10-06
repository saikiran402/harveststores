const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, default: "" },
  name: { type: String, default: "" },
  address: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  paid: { type: Boolean },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  myorders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
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
});

const User = mongoose.model("User", userSchema);

module.exports = User;
