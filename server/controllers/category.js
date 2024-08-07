const Category=require('../Models/category.model')
const Shop=require('../Models/shop.model')
const State=require('../Models/states')
const City=require('../Models/city')
exports.createCategory=async (req,res)=>{
    try {
        const {category}=req.body
        if(!category||category.length==0){
            return res.status(400).send({
                status:400,
                message:"category is required"
            })
        }
        const newCategory=await Category.create({
            category
        })
        return res.status(200).json({
            status:200,
            success:true,
            newCategory,
            message:'category created successfully'
        })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,
            message:error.message
        })
    }
}
exports.getcategoryShop=async (req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        const shops=await Shop.find({
           category:id,
           pincode:parseInt(user.pincode)
        })
        .populate({
            path:'address'
        })
        .populate({
            path: 'products',
            populate: {
                path: 'offer'
            }
        })
        .populate({
            path:'review'
        })
        .populate({
            path:'category'
        })
        return res.status(200).json({
            status:200,
            success:true,
            shops:shops
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            message:error
        })
    }
}

exports.getAllCategory=async (req,res)=>{
    try {
        const categories=await Category.find()
        return res.status(200).json({
            status:200,
            success:true,
            categories
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            message:error
        })
    }
}

exports.addState=async (req,res)=>{
    try {
        const {state}=req.body
        const newState=await State.create({
            state
        })
        return res.status(200).json({
            status:200,
            success:true,
            newState
        })
    } catch (error) {
        return res.state(500).json({
            status:500,
            success:false,
            message:error
        })
    }
}

exports.addCity=async(req,res)=>{
    try {
        const {city}=req.body
        const newCity=await City.create({
            city
        })
        return res.status(200).json({
            status:200,
            success:true,
            newCity
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            message:error
        })
    }
}

exports.getCityAndState=async (req,res)=>{
    try {
        const city=await City.find()
        const state=await State.find()
        return res.status(200).json({
            status:200,
            success:true,
            city,
            state
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            message:error
        })
    }
}