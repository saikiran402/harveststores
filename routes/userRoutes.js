const express = require("express");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const { protect } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });
const {
  sendOTP,
  verifyOTP,
  getAllcategories,
  within,
  getCategorySpecificProducts,
  showProduct,
  myOrders,
  ongoingOrder,
  myPayments,
  logout,
  addToCart,
  getCartProducts,
  updateCart, updateLocation
} = require("../controllers/userController.js");

//Authentication

router.route("/updateLocation").post(multipartMiddleware, protect, updateLocation);
router.route("/sendOTP").post(multipartMiddleware, sendOTP);
router.route("/resendOTP").post(sendOTP);
router.route("/verifyOTP").post(multipartMiddleware, verifyOTP);

//router.get("/onstart", protect, within);
// Get all categories for home page
router.get("/getcategories", protect, within, getAllcategories);
// Get Category Specific products for ctegory sepecified
router.get("/getcategory/:category", protect, getCategorySpecificProducts);
// Get product Details
router.get("/product/:product", protect, showProduct);
// Get My Orders Sidebar
router.get("/myorders", myOrders);
// Get Current Ongoing Order Details
router.get("/order/:orderId", ongoingOrder);
// Get My Payment Details
router.get("/mypayments", myPayments);
// Add to cart
router.route("/cart").get(getCartProducts).post(addToCart).put(updateCart);
// Logout
router.get("/logout", logout);
module.exports = router;
