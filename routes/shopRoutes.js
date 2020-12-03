const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth.js");
const {
  home,
  addCategories, createadmin, admin, deleteadmin,bannerUpdate,banner,
  getProduct, getpending, setmytaken, getmytaken,
  addproduct, addvarients, updatevarient, delivered, validate,
  update, Updateproduct, deleteproduct, updatevarientNew, getpendingforadmin, adminpacked,deliveredApp,showDues,searchProducts,searchProductss,searchAPI,searchProductsss,getOutStock
} = require("../controllers/shopController.js");


router.route("/banner").get(banner);
router.route("/bannerupdate/:bid").post(bannerUpdate);
router.route("/validate").post(validate);
router.route("/home").get(home);
router.route("/update/:id").get(protect, update);
// Admin add Category
router.route("/addcategories").post(protect, addCategories);
router.route("/getproduct").get(protect, getProduct);
router.route("/addproduct").post(protect, addproduct);
router.route("/addvarients").post(protect, addvarients);
router.route("/updatevarient").post(protect, updatevarient);
router.route("/updatevarientNew").post(protect, updatevarientNew);
router.route("/deleteproduct/:id/:category").get(protect, deleteproduct);
// Edit Or See Product
router.route("/updateproduct").post(protect, Updateproduct);
//routes to get orders
router.route("/getpending").get(protect, getpending);
router.route("/packedapp/:id").get(protect, setmytaken);
// router.route("/getmytaken").get(protect, getmytaken);
router.route("/delivered/:id").get(protect, delivered);
router.route("/deliveredapp/:id").post(protect, deliveredApp);



// For Web Portal
router.route("/orders").get(protect, getpendingforadmin);
router.route("/packed/:id").get(protect, adminpacked);
router.route("/dues").get(protect, showDues);

//create admin
router.route("/createadmin").post(protect, createadmin);
router.route("/admin").get(protect, admin);
router.route("/deleteadmin/:id").get(protect, deleteadmin);

router.get('/search',searchProductss)
router.get('/searched',searchProducts)
router.get('/search/api',searchAPI);
router.get('/search/apidef',searchProductsss);

router.get('/outofstock',getOutStock);

module.exports = router;
