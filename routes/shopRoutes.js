const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  home,
  addCategories, createadmin, admin, deleteadmin,
  getProduct, getpending, setmytaken, getmytaken,
  addproduct, addvarients, updatevarient, delivered,
  update, Updateproduct, deleteproduct, updatevarientNew
} = require("../controllers/shopController.js");

router.route("/").get(home);
router.route("/update/:id").get(update);
// Admin add Category
router.route("/addcategories").post(addCategories);
router.route("/getproduct").get(getProduct);
router.route("/addproduct").post(addproduct);
router.route("/addvarients").post(addvarients);
router.route("/updatevarient").post(updatevarient);
router.route("/updatevarientNew").post(updatevarientNew);
router.route("/deleteproduct/:id/:category").get(deleteproduct);
// Edit Or See Product
router.route("/updateproduct").post(Updateproduct);
//routes to get orders
router.route("/getpending").get(getpending);
router.route("/settaken/:id").get(setmytaken);
router.route("/getmytaken").get(getmytaken);
router.route("/delivered/:id").get(delivered);

//create admin
router.route("/createadmin").post(createadmin);
router.route("/admin").get(admin);
router.route("/deleteadmin/:id").get(deleteadmin);

module.exports = router;
