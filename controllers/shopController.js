const db=require("../models");


exports.home= async function (req,res) {
  const cat=await db.Shop.find({});
  res.render('product-list',{categories:cat})
}


exports.addCategories= async function (req,res) {
  const obj={
    category:req.body.cat,
    items:[]
  }
  const cat=await db.Shop.create(obj);
  res.redirect('/shop')
}

exports.getProduct= async function (req,res) {
  const cat=await db.Shop.findOne({category:req.query.cat});
  console.log(cat);
  res.render('products',{categories:cat})
}

exports.addproduct= async function (req,res) {
  const obj={
    name:req.body.name,
    description:req.body.description,
    haveQaunt:false,
    quantity:req.body.quantity,
    count:Number(req.body.count),
    cost:Number(req.body.cost),
    image:""
  }
  const cat=await db.Shop.findOne({category:req.body.cat});
  cat.items.push(obj)
  cat.save();
res.redirect(`/shop/getproduct?cat=${req.body.cat}`)
}
