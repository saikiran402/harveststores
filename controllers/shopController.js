const db = require("../models");
require("dotenv").config();
//const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const e = require("express");
var cloudinary = require('cloudinary').v2;


var admin = require("firebase-admin");


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function relDiff(a, b) {
  return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
 }

cloudinary.config({
  cloud_name: 'sample',
  api_key: '874837483274837',
  api_secret: 'a676b67565c6767a6767d6767f676fe1'
});
exports.validate = async function (req, res) {
  console.log(req.body);
  const cat = await db.User.findOne({ phone: req.body.Phone, isAdmin: true });
  if (cat) {
    if (req.body.password == "123@789") {
      var id = req.body.password;
      const token = await jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });




      await res.cookie('jwt', token, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
      });
      res.redirect('/shop/home')
    } else {
      res.render('Login_v1/index', { msg: "This Incident will be reported",cansearch:false });
    }
  } else {
    res.render('Login_v1/index', { msg: "invalid credentials",cansearch:false });
  }
}


exports.home = async function (req, res) {
  const cat = await db.Category.find({});
  res.render("product-list", { categories: cat,cansearch:false });
};



exports.updateorder = async function (req, res) {
  try {
 
    const cat = await db.Category.findOne({_id:req.body.catId});
    cat.order = req.body.orderId;
    cat.save()
    res.redirect("/shop/home");
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
};
exports.addCategories = async function (req, res) {
  try {
    //const data = await cloudinary.uploader.upload(req.body.photo);
    const obj = {
      category: req.body.category,
      category_description: req.body.description,
      image: req.body.image,
    };
    const cat = await db.Category.create(obj);
    res.redirect("/shop/home");
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
};

exports.getProduct = async function (req, res) {
  try {

    const cat = await db.Product.find({ category: req.query.cat, type: 'product' }).populate('varient');
    console.log(cat);
    res.render("products", { categories: cat, categoryId: req.query.cat,cansearch:false });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
};

exports.addproduct = async function (req, res) {
  //console.log(req.body);

  req.body.type = "product"
  req.body.varient = [],
  req.body.you_save=(req.body.original_price - req.body.product_price).toFixed();
  var diff =  relDiff(Number(req.body.original_price),Number(req.body.product_price))
  req.body.percent_off = diff.toFixed();
  // const data = await cloudinary.uploader.upload(req.body.photo);
  // req.body.image = data.url;
  const cat = await db.Product.create(req.body);
  cat.varient.push(cat._id);
  cat.save()

  res.redirect(`/shop/getproduct?cat=${req.body.category}`);
};

exports.update = async function (req, res) {
  console.log("innnnnnn");

  const cat = await db.Product.findOne({ _id: req.params.id });
  if (cat.inStock) {
    cat.inStock = false;
  } else {
    cat.inStock = true;
  }
  cat.save();
  res.status(200).json('done')
};

exports.Updateproduct = async function (req, res) {
  //console.log("innnnnnn");
  const cat = await db.Product.findOne({ _id: req.body.id }); 
  cat.product_name = req.body.product_name;
  cat.product_description= req.body.product_description;
  cat.product_price=req.body.product_price;
  cat.quantity=req.body.quantity;
  cat.image=req.body.image;
  cat.original_price=req.body.original_price;
  cat.you_save=(req.body.original_price - req.body.product_price).toFixed(2);
  var diff =  relDiff(cat.original_price,cat.product_price)
  cat.percent_off = diff.toFixed();
  cat.save();
  res.redirect(`/shop/getproduct?cat=${req.body.category}`)

};


exports.Updatecategory = async function (req, res) {
  //console.log("innnnnnn");
  const cat = await db.Product.findOne({ _id: req.body.id }); 
  cat.product_name = req.body.product_name;
  cat.product_description= req.body.product_description;
  cat.product_price=req.body.product_price;
  cat.image=req.body.image;
  cat.original_price=req.body.original_price;
  cat.you_save=(req.body.original_price - req.body.product_price).toFixed(2);
  var diff =  relDiff(cat.original_price,cat.product_price)
  cat.percent_off = diff.toFixed();
  cat.save();
  res.redirect(`/shop/getproduct?cat=${req.body.category}`)

};


exports.deleteproduct = async function (req, res) {
  //console.log("innnnnnn");
  const cat = await db.Product.findOne({ _id: req.params.id });
  for (var i of cat.varient) {
    await db.Product.findOneAndDelete({ _id: i });
  }
  await db.Product.findOneAndDelete({ _id: req.params.id });
  res.redirect(`/shop/getproduct?cat=${req.params.category}`)

};

exports.addvarients = async function (req, res) {
  //console.log("innnnnnn");
  //console.log(req.body)
  req.body.type = "varient"
  //console.log(req.body)

  const cat = await db.Product.create(req.body);
  await db.Product.updateOne({ _id: req.body.product }, { $addToSet: { varient: cat._id } })
  // // res.redirect(`/shop/getproduct?cat=${req.body.category}`)
  var cat1 = await db.Product.findOne({ _id: req.body.product }).populate('varient');
  return res.status(200).json({ Status: "success", data: cat1 });
};

exports.updatevarient = async function (req, res) {
  console.log(req.body);
  var category
  var product
  for (var item of req.body.data) {
    category = item.category
    const data = await db.Product.findOneAndUpdate({ _id: item.id },{ quantity: item.quantity, product_price: item.product_price });
    product = data.product
  }
  if (!category) {
    const vi = await db.Product.findOne({ _id: product })
    category = vi.category
  }
  res.redirect(`/shop/getproduct?cat=${category}`)

};

exports.updatevarientNew = async function (req, res) {
  console.log(req.body);


};

exports.createadmin = async function (req, res) {
  const user = await db.User.find({ phone: req.body.phone, isAdmin: true });
  //console.log(user);

  if (user.length) {
    const data = await db.User.find({ isAdmin: true })
    res.render('addAdmin', { data: data, msg: "Phone number already exist",cansearch:false })
  } else {
    const data = await db.User.create({ phone: req.body.phone, name: req.body.name, isAdmin: true, mycart: [], myorders: [], verified: true });
    // const data1 = await db.User.find({ isAdmin: true })
    // console.log(data1);

    res.redirect('/shop/admin')
  }

};
exports.admin = async function (req, res) {
  const data = await db.User.find({ isAdmin: true })
  res.render('addAdmin', { data: data, msg: "",cansearch:false })


};
exports.deleteadmin = async function (req, res) {
  await db.User.findOneAndDelete({ _id: req.params.id })
  res.redirect('/shop/admin')


};
exports.getpending = async function (req, res) {
  const data = await db.Order.find({ $or: [ { status: "pending" }, { status: "Packed" } ] });
  return res.status(200).json({ data: data.reverse() });
};


// exports.getpendingforadmin = async function (req, res) {
//   const data = await db.Order.find({ status: "pending" }).populate('delivery_location');
//   console.log(data)
//   res.render('showOrders', { data: data, msg: "" })
// };


exports.setmytaken = async function (req, res) {
  const data = await db.Order.findOneAndUpdate({ _id: req.params.id }, { delivered_by: req.user._id, status: "Packed", delivered_contact: req.user.phone }).populate('userId');
  sendFcm(data.userId.registrationToken,"Harvest Stores","Order Packed and out for Delivery");
  return res.status(200).json({ message: "done" })
};
exports.getmytaken = async function (req, res) {
  const data = await db.Order.find({ status: "Packed", delivered_by: req.user._id });
  return res.status(200).json({ data: data });
};

exports.deliveredApp = async function (req, res) {
  console.log(req.body)
  const data = await db.Order.findOne({ _id: req.params.id });
  data.status = "Delivered";
  var token
  if(Number(data.order_total) > Number(req.body.amount_paid)){
    data.amountDue = Number(data.order_total) - req.body.amount_paid
    const user=await db.User.findOne({_id:data.userId})
    user.amountDue = req.user.amountDue + data.amountDue;
    token=user.registrationToken;
    user.save();
  }else{
    data.credits = req.body.amount_paid - Number(data.order_total);
    const user=await db.User.findOne({_id:data.userId})
    user.credits =  user.credits + data.credits
    token=user.registrationToken;
    user.save()
  }
  data.save()
  
  sendFcm(token,"Harvest Stores","Order Delivered Successfully please leave feedbacl");
  return res.status(200).json({ message: "Updated Succefuly" })
};



exports.delivered = async function (req, res) {
  const data = await db.Order.findOne({ _id: req.params.id });
  data.status = "Delivered";
  var token
  // if(Number(data.order_total) - req.body.amount_paid > 0){
  //   data.amountDue = Number(data.order_total) - req.body.amount_paid
    const user=await db.User.findOne({_id:data.userId})
    // user.amountDue = req.user.amountDue + data.amountDue;
    token=user.registrationToken;
    user.save();
  // }else{
  //   data.credits = req.body.amount_paid - Number(data.order_total)
  //   const user=await db.User.findOne({_id:data.userId})
  //   user.credits =  req.user.credits + data.credits
  //   token=user.registrationToken;
  //   user.save()
  // }
  data.save()
  
  sendFcm(token,"Harvest Stores","Order Delivered Successfully please leave feedbacl");
  res.redirect('/shop/orders')
};




// For Admin GUI

exports.getpendingforadmin = async function (req, res) {
  const data = await db.Order.find({ status: { $ne: "Delivered" } }).populate('products.product').populate('delivery_location');
console.log(data);
  res.render('showOrders', { data: data, msg: "",cansearch:false })
};


exports.adminpacked = async function (req, res) {
  const datas = await db.Order.findOneAndUpdate({ _id: req.params.id }, { delivered_by: "5f7f456a0c49aa0736557a5a", status: "Packed", delivered_contact: "9949944524", }).populate('userId');
  console.log(datas)
  sendFcm(datas.userId.registrationToken,"Harvest Stores","Order Packed and out for Delivery");
  res.redirect('/shop/orders')
};

async function sendFcm(token,title,body){
  const payload_from={
    notification:{
      title:title,
      body:body,
      icon:'ic_notification',
      sound:'default',
      priority:'normal',
      image:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png'
    },
    data:{
      title:title,
      body:body,
      icon:'ic_notification',
      sound:'default',
      priority:'normal',
      image:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png'
    }
  };
  const options={
    priority:'normal',
    timeToLive:60*60*24
  };
 var a = await admin.messaging().sendToDevice(token,payload_from,options)
 console.log(a)
}

exports.searchProducts = async function (req, res) {
  var search = req.query.query;
  const regex = new RegExp(escapeRegex(search), 'gi');
  var newItem = {  name: search }
  var product = await db.Product.find({product_name: regex});
  res.render("searched", {categories:product,cansearch:true});

};

exports.searchAPI = async function (req, res) {
  var search = req.query.query;
  const regex = new RegExp(escapeRegex(search), 'gi');
  var newItem = {  name: search }
  var product = await db.Product.find({product_name: regex}).populate('varient');
  return res.status(200).json(product);

};

exports.searchProductss = async function (req, res) {
  console.log("hh")
    var product = await db.Product.find({}).populate('varient').limit(50);
  res.render("searched", {categories:product,res:product,cansearch:true});

  };

  exports.searchProductsss = async function (req, res) {
    console.log("asas")
    var product = await db.Product.find({}).populate('varient').limit(50);
 return res.status(200).json(product);

  };


  exports.getOutStock = async function (req, res) {
var product = await db.Product.find({inStock:false}).populate('varient');
if(product.length>0){

    res.render("outofstock", { categories: product, categoryId: product[0].category,cansearch:false });
}else{
    res.render("outofstock", { categories: product, categoryId: "product[0].category",cansearch:false });
}
  };

exports.showDues = async function (req, res) {
  const dues = await db.Order.find({amountDue:{ $gt:0}}).populate('products.product').populate('delivery_location').populate('userId');
  res.render("dues", { dues:dues,cansearch:false });
};

exports.banner = async function (req, res) {
  const banner = await db.Banner.find({});
  console.log(banner.length);
  res.render("banner", { banner:banner,cansearch:false });
};

exports.bannerUpdate = async function (req, res) {
  await db.Banner.findOneAndUpdate({_id:req.params.bid},{$set:{image:req.body.image}});
  res.redirect("/shop/banner");
};



exports.sendFCM = async function (req, res) {
 var a =  await db.User.find({});
  res.render("fcm", { fcm:a,cansearch:false });
};



exports.sendFCMs = async function (req, res) {
 
  res.render("fcmtest", {cansearch:false });
};




exports.sendOnPost = async function (req, res) {


  if(req.body.secretcode == '9051'){
 var a =  await db.User.find({});
var token = [];
 a.forEach(list=>{
    if(list.registrationToken){
      token.push(list.registrationToken)
    }
 })
// var token  = 'dF5SqNwaSr6ZpPGAxodNfe:APA91bGWJpAMjjG0KOX1sjbcUlRM7wv9a5Ej4eatVEP8kDSnNwOv4iFpEbOcvGBPwTuJOYkNrb7f82Jmg6HAHkFkApZrtnKRl__V0r1SefPX0ATatKrOR8oJYMEOcjtS4c529xNHbqxL';
//  // var title = 'Get 50/- off on first order';
//  // var body = 'Order Now on harvest and get 50 Rs off';
  var title = req.body.title;
 var body = req.body.body;
 token.forEach(list=>{
  sendFcm(list,title,body);
})
  sendFcm(token,title,body);
console.log(token)
console.log(token.length)

}else{
    return res.redirect("/shop/notify");
}

 


};


exports.sendOnPostTest = async function (req, res) {


  if(req.body.secretcode == '9051'){
      var a = await db.User.findOne({phone:"9949944524"});
    // var tokensadmin = [];
    // a.forEach(list=>{
      // tokensadmin.push(list.registrationToken);
    // })
    // tokensadmin.forEach(list=>{
     //  console.log(a)
     // var s=await sendFcm(a.registrationToken,"Harvest Stores","New Order Received");
var token  = a.registrationToken;
  var title = req.body.title;
 var body = req.body.body;
 // token.forEach(list=>{
  sendFcm(token,title,body);
// })

console.log(token)
console.log(token.length)
   return res.redirect("/shop/notifyTest");
}else{
    return res.redirect("/shop/notifyTest");
}

 


};










