const userSchema=require('../Models/user.model')
const Product=require('../Models/product.model')
const Otp=require('../Models/otp.model')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
exports.signupAdmin=async (req,res)=>{
    try {
        const {email,password}=req.body
        if(!email,!password){
            return res.status(400).send({status:400,message:"All fields are required"})
        }
        const isAdminExist=await userSchema.findOne({
            type:"admin"
        })
        if(isAdminExist){
            return res.status(400).send({status:400,message:"admin already exist"})
        }
        const isEmailExist=await userSchema.findOne({
            email
        })
        if(isEmailExist){
            return res.status(400).send({status:400,message:"email already exist"})
        }
        const hashPassword=await bcrypt.hashSync(password,10)
        const admin=await userSchema.create({
            email,
            password:hashPassword,
            type:"admin"
        })
        return res.status(200).send({status:200,success:true,message:"admin created"})
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}
exports.signUp=async (req,res)=>{ 
    try {
    const {username,email,password,contactNumber,type,userotp,state,city,pincode}=req.body
    if(!username || !email || !password || !contactNumber || !type||!userotp||!state||!city||!pincode){
        return res.status(400).send({status:400,message:"All fields are required"})
    }
    const isUserExist=await userSchema.findOne({
        $or:[{email}]
    })
    if(isUserExist){
        return res.status(400).send({status:400,success:false,message:"please enter a differnet email and contact number, user exist"})
    }
    const otp=await Otp.findOne({
        contactNumber:parseInt(contactNumber)
    }).sort({createAt:-1}).limit(1)
    if(!otp){
        return res.status(400).send({success:false,message:"No otp found"})
    }
    if(parseInt(otp.otp)!=parseInt(userotp)){
        return res.status(400).send({success:false,message:"Invalid otp"})
    }
    const hashPassword=bcrypt.hashSync(password,10)
    const registerUser=await userSchema.create({
        username,
        email,
        password:hashPassword,
        contactNumber,
        type:type.trim().toLowerCase(),
        state:state.trim().toLowerCase(),
        city:city.trim().toLowerCase(),
        pincode:parseInt(pincode)
    })
    return res.status(200).send({status:200,success:true,message:"user created"})
   }
   catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}

exports.loginAdmin=async (req,res)=>{
   try {
     const {email,password}=req.body
     if(!email,!password){
        return res.status(400).send({status:400,success:false,message:"All fields are required"})
     }
     const userExist=await userSchema.findOne({
         email
     })
     if(!userExist){
         return res.status(400).send({status:400,success:false,message:"please enter a correct email"})
     }
     const passwordMatch=bcrypt.compareSync(password,userExist.password)
     if(!passwordMatch){
         return res.status(400).send({status:400,success:false,message:"please enter a correct password"})
     }
     if(userExist.type!=="admin"){
         return res.status(400).send({status:400,success:false,message:"you are not an admin"})
     }
     const payload={
         email:userExist.email,
         type:userExist.type,
         id:userExist._id
     }
     const token=jwt.sign(payload,process.env.JWT_SECRET,{
         expiresIn:"24h"
     })
     userExist.password=null
     return res.status(200).send({
         status:200,
         success:true,
         token,
         user:userExist
     })
   } catch (error) {
     return res.status(500).json({
         status:500,
         success:false,
         message:error.message
     })
   }
}


exports.loginByEmail=async (req,res)=>{
    try {
        const {email,password}=req.body
        if(!email||!password){
            return res.status(400).send({status:400,success:false,message:"All fields are required"})
        }
        const userExist=await userSchema.findOne({
            email
        })
        if(!userExist){
            return res.status(400).send({status:400,success:false,message:"please enter a correct email"})
        }
        const passwordMatch=bcrypt.compareSync(password,userExist.password)
        if(!passwordMatch){
            return res.status(400).send({status:400,success:false,message:"please enter a correct password"})
        }
        const payload={
            username:userExist.username,
            email:userExist.email,
            type:userExist.type,
            contactNumber:userExist.contactNumber,
            id:userExist._id,
            pincode:parseInt(userExist.pincode)
        }
        console.log(payload)
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"24h"
        })
        userExist.password=null
        return res.status(200).send({
            status:200,
            success:true,
            token,
            user:userExist
        })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}

exports.loginByOtp=async(req,res)=>{ 
    try {
        const {contactNumber,userotp}=req.body
        if(!contactNumber||contactNumber.length!=10||!userotp){
            return res.status(400).send({
                success:false,
                message:"please enter a valid number"
            })
        }
        const userExist=await userSchema.findOne({
            contactNumber:parseInt(contactNumber)
        })
        if(!userExist){
            return res.status(400).send({
                status:400,
                success:false,
                message:"user not find please signup"
            })
        }
        const sendOtp=await Otp.findOne({
            contactNumber:parseInt(contactNumber)
        }).sort({createAt:-1}).limit(1)
        console.log("send otp",sendOtp.otp)
        if(!sendOtp){
            return res.status(400).json({
                success:false,
                message:"No otp found"
            })
        }
        if(sendOtp.otp!=parseInt(userotp)){
            console.log("otp match ",parseInt(sendOtp.otp),parseInt(userotp))
            return res.status(400).send({
                status:400,
                success:false,
                message:"Invalid otp"
            })
        }
        const payload={
            username:userExist.username,
            email:userExist.email,
            type:userExist.type,
            contactNumber:parseInt(contactNumber),
            id:userExist._id,
            pincode:parseInt(userExist.pincode)
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"24h"
        })
        userExist.password=null
        return res.status(200).send({
            status:200,
            success:true,
            token,
            user:userExist
        })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}
exports.getUserDetails=async (req,res)=>{
    console.log("request come")
    try {
        const user=req.user
        const userDetails=await userSchema.findOne({_id:user.id})
                                          .populate({
                                            path:'orderHistory',
                                            populate:{
                                                path:'shop',
                                                populate:{
                                                    path:'city'
                                                },
                                                select:'city location name'
                                            }
                                          })
        return res.status(200).json({
            status:200,
            success:true,
            user:userDetails
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            message:error
        })
    }
}
exports.AddToCart=async (req,res)=>{ 
    try {
        const {id}=req.params
        const user=req.user
        const {quantity,shopId}=req.body
        if(!id||!quantity){
            return res.status(400).send({
                status:400,
                success:false,
                message:"please enter a valid id and quantity"
            })
        }
        if(parseInt(quantity)<=0){
          return res.status(400).send({
            status:400,
            success:false,
            message:"please enter a valid quantity"
          })
        }
        let userExist=await userSchema.findOne({_id:user.id})
        const cart=userExist.mycart
        for (const item of cart) {
            if (item.product.toString() === id.toString()) {
                return res.status(400).send({
                    success: false,
                    message: "Product already in cart"
                });
            }
        }
        if(cart.length>0){
            const findProduct=await Product.findOne({
                _id:cart[0].product
            })
            console.log(findProduct)
            console.log(shopId)
            if(findProduct.shop.toString()!=shopId.toString()){
                console.log("not match")
                await userSchema.updateOne({
                    _id:user.id
                },{
                    $set:{
                        mycart:[]
                    }
                })
            }
        }
       userExist= await userSchema.updateOne({
            _id:user.id
        },{
           $push:{
            mycart:{
                 product:id,
                 quantity:parseInt(quantity)
               }
        }
        })
        return res.status(200).send({
            status:200,
            success:true,
            message:"product added to cart",
        })
    } catch (error) {
        return res.status(400).send({status:400,
            success:false,message:error.message})
    }
}

exports.removeFromCart=async (req,res)=>{ 
    try {
        const {id}=req.params
        const user=req.user
        await userSchema.updateOne({
            _id:user.id
        },{
           $pull:{
            mycart:{
                product:id
            }
           }
        })
        const userExist=await userSchema.findOne({_id:user.id})
        .populate({
            path: 'mycart.product',
            model: 'Product',
            populate: {
                path: 'shop',
                model: 'Shop'
            }
        })
        return res.status(200).send({
            status:200,
            success:true,
            message:"product removed from cart",
            mycart:userExist.mycart
        })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}
exports.myCart=async (req,res)=>{
    try {
        const user=req.user
        const userExist=await userSchema.findOne({_id:user.id})
        .populate({
            path: 'mycart.product',
            model: 'Product',
            populate: {
                path: 'shop',
                model: 'Shop'
            }
        })
        return res.status(200).json({
            status:200,
            success:true,
            mycart:userExist.mycart
        })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}

exports.verifyAdmin=async (req,res)=>{
    try {
        const {email,password}=req.body
        if(!email,!password){
            return res.status(400).send({status:400,success:false,message:"All fields are required"})
        }
        const isAdminExist=await userSchema.findOne({email})
        if(!isAdminExist){
            return res.status(400).json({
                status:400,
                success:false,
                message:'Email and password is not valid'
            })
        }
        const isPasswordMatch=bcrypt.compareSync(password,isAdminExist.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                status:400,
                success:false,
                message:'Email id and password is not valid'
            })
        }
        if(isAdminExist.type!=="admin"){
            return res.status(400).json({
                status:400,
                success:false,
                message:'you are not an admin'
            })
        }
        isAdminExist.password=null
        return res.status(200).json({
            status:200,
            success:true,
            isAdminExist
        })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}