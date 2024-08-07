const express=require('express')
const router=express.Router()
const {sendOtp}=require('../controllers/otp')
router.post('/sendotp',sendOtp)
module.exports=router