const express=require('express')
const router=express.Router()
const {signUp,loginByEmail,loginByOtp,getUserDetails,AddToCart,removeFromCart,myCart}=require('../controllers/auth')
const { isAuthenticate } = require('../middleware/middleware')
router.post('/signup',signUp)
router.post('/loginemail',loginByEmail)
router.post('/loginotp',loginByOtp)
router.get('/getuser',isAuthenticate,getUserDetails)
router.post('/addtocart/:id',isAuthenticate,AddToCart)
router.delete('/removefromcart/:id',isAuthenticate,removeFromCart)
router.get('/mycart',isAuthenticate,myCart)

module.exports=router