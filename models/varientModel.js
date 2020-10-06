const mongoose = require("mongoose");

const varientSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: String,
    price: Number,

});

const Varient = mongoose.model("Varient", varientSchema);

module.exports = Varient;
