const mongoose=require("mongoose");


const userSchema=new mongoose.Schema({
  phone:String,
  name:String,
  address:String,
  location:{type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
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
