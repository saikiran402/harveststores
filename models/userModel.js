const mongoose=require("mongoose");


const userSchema=new mongoose.Schema({
  phone:String,
  myorders:[{
    type: mongoose.Schema.Types.ObjectId, ref: 'Payment'
  }],
  mycart:[{
    category:String,
    name:String,
    count:String
  }]
});



const User=mongoose.model("User",userSchema);




module.exports=User
