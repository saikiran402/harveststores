const db = require("../models");

exports.home = async function (req, res) {
  const cat = await db.Category.find({});
  res.render("product-list", { categories: cat });
};

exports.addCategories = async function (req, res) {
  try {
    const obj = {
      category: req.body.category,
      category_description: req.body.description,
      image: req.body.photo,
    };
    const cat = await db.Category.create(obj);
    res.redirect("/shop");
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
};

exports.getProduct = async function (req, res) {
  try {
    const cat = await db.Product.find({ category: req.query.cat });
    //console.log(cat);
    res.render("products", { categories: cat, categoryId: req.query.cat });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
};

exports.addproduct = async function (req, res) {
  //console.log(req.body);

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
};

exports.Updateproduct = async function (req, res) {
  //console.log("innnnnnn");
  const cat = await db.Product.findOneAndUpdate({ _id: req.body.id }, { product_name: req.body.product_name, product_description: req.body.product_description, product_price: req.body.product_price });
  res.redirect(`/shop/getproduct?cat=${req.body.category}`)

};
exports.deleteproduct = async function (req, res) {
  //console.log("innnnnnn");
  const cat = await db.Product.findOneAndDelete({ _id: req.params.id });
  res.redirect(`/shop/getproduct?cat=${req.params.category}`)

};