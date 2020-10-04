const mongoose=require("mongoose");


const shopSchema=new mongoose.Schema({
  category:{type:String},
  image:String,
  items:[{
    name:String,
    description:String,
    haveQaunt:Boolean,
    quantity:Number,
    count:Number,
    cost:Number,
    image:String
  }]
});



const Shop=mongoose.model("Shop",shopSchema);




module.exports=Shop
