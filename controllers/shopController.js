const db = require("../models");
var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'sample',
  api_key: '874837483274837',
  api_secret: 'a676b67565c6767a6767d6767f676fe1'
});
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
    // console.log(cat[0].varient);
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
  const cat = await db.Product.findOneAndUpdate({ _id: req.body.id }, { product_name: req.body.product_name, product_description: req.body.product_description, product_price: req.body.product_price });
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