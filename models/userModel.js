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
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default:'Point'
    },
    coordinates: {
      type: [Number]
    }
  }
});


userSchema.createIndex({location:'2dsphere'})
const User=mongoose.model("User",userSchema);




module.exports=User
