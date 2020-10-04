const mongoose=require("mongoose");


const locationSchema=new mongoose.Schema({
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default:'Point'
    },
    coordinates: {
      type: [Number],
      default:[]
    }
  }
});


locationSchema.index({location:'2dsphere'})
const Location=mongoose.model("Location",locationSchema);




module.exports=Location
