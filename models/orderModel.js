const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  status: { type: String, enum: ["pending", "Packed", "Delivered"] },
  payment_method: { type: String, enum: ["COD", "ONLINE"] },
  Instructions: { type: String, default: "Please collect Cash" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: String,
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Varient",
      },
      price: Number,
      count: Number,
    },
  ],
  order_total: { type: String },
  delivered_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  delivered_contact: { type: String },
  delivery_location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  order_created: { type: Date, default: Date.now() },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
