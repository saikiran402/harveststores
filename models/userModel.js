const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, default: "" },
  name: { type: String, default: "" },
  address: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  myorders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
  mycart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
      },

      count: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
