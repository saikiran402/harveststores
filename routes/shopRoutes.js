const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  home,
  addCategories,
  getProduct,
  addproduct, addvarients, updatevarient,
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
module.exports = router;
