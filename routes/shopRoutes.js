const express = require("express");
const router = express.Router({ mergeParams: true });
const { protectweb } = require("../middleware/auth.js");
const {
  home,
  addCategories, createadmin, admin, deleteadmin,
  getProduct, getpending, setmytaken, getmytaken,
  addproduct, addvarients, updatevarient, delivered, validate,
  update, Updateproduct, deleteproduct, updatevarientNew, getpendingforadmin, adminpacked
} = require("../controllers/shopController.js");


router.route("/validate").post(validate);
router.route("/home").get(home);
router.route("/update/:id").get(protectweb, update);
// Admin add Category
router.route("/addcategories").post(protectweb, addCategories);
router.route("/getproduct").get(protectweb, getProduct);
router.route("/addproduct").post(protectweb, addproduct);
router.route("/addvarients").post(protectweb, addvarients);
router.route("/updatevarient").post(protectweb, updatevarient);
router.route("/updatevarientNew").post(protectweb, updatevarientNew);
router.route("/deleteproduct/:id/:category").get(protectweb, deleteproduct);
// Edit Or See Product
router.route("/updateproduct").post(protectweb, Updateproduct);
//routes to get orders
router.route("/getpending").get(protectweb, getpending);
router.route("/settaken/:id").get(protectweb, setmytaken);
router.route("/getmytaken").get(protectweb, getmytaken);
router.route("/delivered/:id").get(protectweb, delivered);

// For Web Portal
router.route("/orders").get(protectweb, getpendingforadmin);
router.route("/packed/:id").get(protectweb, adminpacked);

//create admin
router.route("/createadmin").post(protectweb, createadmin);
router.route("/admin").get(protectweb, admin);
router.route("/deleteadmin/:id").get(protectweb, deleteadmin);

module.exports = router;
