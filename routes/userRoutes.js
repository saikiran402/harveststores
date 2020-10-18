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
  placeOrders,
  ongoingOrder,
  myPayments,
  logout,
  addToCart,
  getCartProducts,
  updateCart, updateLocation,getproducts,removeCart
} = require("../controllers/userController.js");

//Authentication

router.route("/updateLocation").post(multipartMiddleware, protect, updateLocation);
router.route("/sendOTP").post(multipartMiddleware, sendOTP);
router.route("/resendOTP").post(sendOTP);
router.route("/verifyOTP").post(multipartMiddleware, verifyOTP);

router.get("/onstart", protect, within);
// Get all categories for home page
router.get("/getcategories", protect, within, getAllcategories);
// get Home screen Products
router.get("/getproducts", protect, within, getproducts);
// Get Category Specific products for ctegory sepecified
router.get("/getcategory/:category", protect, getCategorySpecificProducts);
// Get product Details
router.get("/product/:product", protect, showProduct);
// Get My Orders Sidebar
router.post("/placeorder/:payment_method", protect, placeOrders);
// Get Current Ongoing Order Details
router.get("/order/:orderId", protect, ongoingOrder);
// Get My Payment Details
router.get("/mypayments", protect, myPayments);
// Add to cart
router.route("/cart").get(protect, getCartProducts).post(protect, addToCart).put(protect, updateCart).delete(protect,removeCart);
// Logout
router.get("/logout", protect, logout);

module.exports = router;
