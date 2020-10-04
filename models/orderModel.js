const mongoose=require("mongoose");


const orderSchema=new mongoose.Schema({

    status:{type:String,enum:['pending','packed','delivered']},
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    orderid:String,
    items:[{
      category:String,
      name:String,
      count:String
    }],
    delivery:{
      by:String,
      delivered:{type:Boolean,default:false},
      deliveredAt:Date
    },
    createdAt:Date

});



const Order=mongoose.model("Order",orderSchema);




module.exports=Order
