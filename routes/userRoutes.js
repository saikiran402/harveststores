const express=require("express");
const router=express.Router({mergeParams: true});
const {
sendOTP,
verifyOTP


}=require("../controllers/userController.js")




router.route('/')
    .get();

router.route('/sendotp')
        .post(sendOTP);
router.route('/verifyotp')
        .post(verifyOTP);
module.exports=router
