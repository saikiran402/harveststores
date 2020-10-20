const db = require("../models");
require("dotenv").config();
//const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const e = require("express");
var cloudinary = require('cloudinary').v2;
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
      res.render('Login_v1/index', { msg: "This Incident will be reported" });
    }
  } else {
    res.render('Login_v1/index', { msg: "invalid credentials" });
  }
}


exports.home = async function (req, res) {
  const cat = await db.Category.find({});
  res.render("product-list", { categories: cat });
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
    res.redirect("/shop");
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
};

exports.getProduct = async function (req, res) {
  try {

    const cat = await db.Product.find({ category: req.query.cat, type: 'product' }).populate('varient');
    console.log(cat);
    res.render("products", { categories: cat, categoryId: req.query.cat });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
};

exports.addproduct = async function (req, res) {
  //console.log(req.body);

  req.body.type = "product"
  req.body.varient = []
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
  const cat = await db.Product.findOneAndUpdate({ _id: req.body.id }, { product_name: req.body.product_name, product_description: req.body.product_description, product_price: req.body.product_price,image:req.body.image });
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
    const data = await db.Product.findOneAndUpdate({ _id: item.id }, { quantity: item.quantity, price: item.price });
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
    res.render('addAdmin', { data: data, msg: "Phone number already exist" })
  } else {
    const data = await db.User.create({ phone: req.body.phone, name: req.body.name, isAdmin: true, mycart: [], myorders: [], verified: true });
    // const data1 = await db.User.find({ isAdmin: true })
    // console.log(data1);

    res.redirect('/shop/admin')
  }

};
exports.admin = async function (req, res) {
  const data = await db.User.find({ isAdmin: true })
  res.render('addAdmin', { data: data, msg: "" })


};
exports.deleteadmin = async function (req, res) {
  await db.User.findOneAndDelete({ _id: req.params.id })
  res.redirect('/shop/admin')


};
exports.getpending = async function (req, res) {
  const data = await db.Order.find({ status: "pending" });
  return res.status(200).json({ data: data });
};


exports.getpendingforadmin = async function (req, res) {
  const data = await db.Order.find({ status: "pending" });
  console.log(data)
  res.render('showOrders', { data: data, msg: "" })
};


exports.setmytaken = async function (req, res) {
  const data = await db.Order.findOneAndUpdate({ _id: req.params.id }, { delivered_by: req.user._id, status: "Packed", delivered_contact: req.user.phone }).populate('userId');
  sendFcm(data.userId.registrationToken,"Harvest Stores","Order Packed Successfully");
  return res.status(200).json({ message: "done" })
};
exports.getmytaken = async function (req, res) {
  const data = await db.Order.find({ status: "Packed", delivered_by: req.user._id });
  return res.status(200).json({ data: data });


};
exports.delivered = async function (req, res) {
  const data = await db.Order.findOne({ _id: req.params.id });
  data.status = "Delivered";
  var token
  if(Number(data.order_total) - req.body.amount_paid > 0){
    data.amountDue = Number(data.order_total) - req.body.amount_paid
    const user=await db.User.findOne({_id:data.userId})
    user.amountDue = req.user.amountDue + data.amountDue;
    token=user.registrationToken;
    user.save();
  }else{
    data.credits = req.body.amount_paid - Number(data.order_total)
    const user=await db.User.findOne({_id:data.userId})
    user.credits =  req.user.credits + data.credits
    token=user.registrationToken;
    user.save()
  }
  data.save()
  
  sendFcm(token,"Harvest Stores","Order Delivered Successfully");
  return res.status(200).json({ message: "done" })
};




// For Admin GUI

exports.getpendingforadmin = async function (req, res) {
  const data = await db.Order.find({ status: { $ne: "Delivered" } }).populate('products.product');
  console.log(data[11].products[0])
  res.render('showOrders', { data: data, msg: "" })
};


exports.adminpacked = async function (req, res) {
  const datas = await db.Order.findOneAndUpdate({ _id: req.params.id }, { delivered_by: "5f7f456a0c49aa0736557a5a", status: "Packed", delivered_contact: "9949944524", }).populate('userId');
  sendFcm(datas.userId.registrationToken,"Harvest Stores","Order Placed Successfully");
  res.redirect('/shop/orders')
};

async function sendFcm(token,title,body){
  const payload_from={
    notification:{
      title:title,
      body:body,
      icon:'ic_notification',
      sound:'default',
      priority:'normal'
    },
    data:{
      title:title,
      body:body,
      icon:'ic_notification',
      sound:'default',
      priority:'normal'
    }
  };
  const options={
    priority:'normal',
    timeToLive:60*60*24
  };
  await admin.messaging().sendToDevice(token,payload_from,options)
}