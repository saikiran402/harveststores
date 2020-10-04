const express=require("express");
const router=express.Router({mergeParams: true});
const {
sendOTP,
verifyOTP,
getcategories,
within


}=require("../controllers/userController.js")




router.route('/')
    .get();

router.route('/sendotp')
        .post(sendOTP);
router.route('/verifyotp')
        .post(verifyOTP);
router.route('/getcategories')
            .get(within,getcategories);
module.exports=router
