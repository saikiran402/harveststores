const express=require("express");
const router=express.Router({mergeParams: true});
const {

home,
addCategories,
getProduct,
addproduct

}=require("../controllers/shopController.js")




router.route('/').get(home);

router.route('/addcategories').post(addCategories)
router.route('/getproduct').get(getProduct);
router.route('/addproduct').post(addproduct)
module.exports=router
