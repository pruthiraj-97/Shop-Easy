const Product=require('../Models/product.model')
const Offer=require('../Models/offer.model')
const Shop=require('../Models/shop.model')
exports.createProduct=async (req,res)=>{ 
    try {
        const {name,price,quantity,image}=req.body
        console.log(req.body)
        const {id}=req.params
        if(!name||!price||!quantity||!image){
            return res.status(400).send({
                status:400,
                success:false,message:"All fields are mendatory"
            })
        }
        const newProduct=await Product.create({
            name,
            price,
            quantity,
            image,
            shop:id,
            offer:null
        })
        await Shop.updateOne({
            _id:id
        },{
            $push:{
                products:newProduct._id
            }
        }
    )
        return res.status(200).send({
            status:200,
            success:true,
            message:"product created successfully", 
            product:newProduct
        })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,message:error.message
        })
    }
}

exports.deleteProduct=async (req,res)=>{ // complete
    try {
        const {id}=req.params
        await Product.deleteOne({_id:id})
        return res.status(200).send({
            status:200,
            success:true,
            message:"product deleted successfully"
        })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,message:error.message
        })
    }
}

exports.createOffer=async (req,res)=>{ 
    try {
        const {id}=req.params
        let {name,discount,amount,openingDate,closingDate}=req.body
        if(!name||!discount||!amount||!openingDate||!closingDate||!id){
            return res.status(400).send({
                status:400,
                success:false,message:"All fields are mendatory"
            })
        }
        if(parseInt(discount)>100){
            return res.status(400).send({
                status:400,
                success:false,
                message:"discount cannot be greater than 100"
            })
        }
        if(closingDate<openingDate){
            return res.status(400).send({
                status:400,
                success:false,
                message:"closing date cannot be less than opening date"
            })
        }
         await Product.updateOne({_id:id},{
            $set:{
                offer:null
            }
         })
        const newOffer=await Offer.create({
            name,
            discount:parseInt(discount),
            amount:parseInt(amount),
            openingDate,
            closingDate,
            product:id
        })
        await Product.updateOne({
            _id:id
        },{
            $set:{
                offer:newOffer._id
            }
        })
        const newProduct=await Product.findOne({_id:id})
                                              .populate('offer')
        return res.status(200).json({
            status:200,
            success:true,
            message:"offer created successfully",
            product:newProduct
        })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,
            message:error.message
        })
    }
}

exports.deleteOffer=async(req,res)=>{ // complete
   try {
     const {id}=req.params
     await Product.updateOne({_id:id},{
         $set:{
             offer:null
         }
     })
     const newProduct=await Product.findOne({_id:id})
     return res.status(200).json({
         status:200,
         success:true,
         message:"offer deleted successfully",
         product:newProduct
     })
   } catch (error) {
     return res.status(500).send({
        status:500,
        success:false,message:error.message
    })
   }
}

exports.updateProduct=async (req,res)=>{
    try {
        const {id}=req.params
        let {name,price,description,quantity,image}=req.body
        if(!name||!price||!description||!quantity||!image){
            return res.status(400).send({
                success:false,message:"All fields are mendatory"
            })
        }
        if(parseInt(quantity)<0||parseInt(price)<0){
            return res.status(400).send({
                status:400,
                success:false,
                message:"quantity and price cannot be negative"
            })
        }
        let updateProduct=await Product.updateOne({_id:id},{
            $set:{
                name,
                price:parseInt(price),
                description,
                quantity:parseInt(quantity),
                image
            }
        })
        return res.status(200).json({
            status:200,
            success:true,
            message:"product updated successfully",
            product:updateProduct
    })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}
exports.getProduct=async (req,res)=>{
    try {
        const {id}=req.params
        const product=await Product.findOne({_id:id})
                                   .populate('offer')
        console.log(product)
        return res.status(200).json({
            status:200,
            success:true,
            product
        })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}

exports.deleteProduct=async (req,res)=>{
    try {
        const {id}=req.params
        const product=await Product.findOne({_id:id})
        await Shop.updateOne({_id:product.shop},{
            $pull:{
                products:product._id
            }
        })
        Product.deleteOne({_id:id})
        return res.status(200).json({
            status:200,
            success:true,
            message:"product deleted successfully"
        })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}