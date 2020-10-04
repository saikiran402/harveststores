const mongoose=require("mongoose");


const paymentSchema=new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status:{type:String,enum:['Paid','Received']},
    orderid:String,
    items:[{
      category:String,
      name:String,
      count:String
    }],
    createdAt:Date,
    receivedAt:Date

});



const Payment=mongoose.model("Payment",paymentSchema);




module.exports=Payment
