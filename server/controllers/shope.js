const Shop=require('../Models/shop.model')
const Category=require('../Models/category.model')
const Address=require('../Models/address.model')
const userSchema=require('../Models/user.model')
exports.getShops=async(req,res)=>{
    try {
        const user=req.user
        const shops = await Shop.find({pincode:parseInt(user.pincode)})
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
            path:'category'
        })
        return res.status(200).json({
            status:200,
            success:true,
            shops
        })
      }catch (error) {
        return res.status(500).send({
            status:500,
            success:false,
            message:error.message
        })
    }
}
exports.createShope=async(req,res)=>{
    try {
        const {name,openingTime,closingTime,state,city,location,pincode,minimumOrder,deliveryCharge,contactNumber}=req.body
        console.log(req.body)
        if(!name||!openingTime||!closingTime||!state||!city||!location||!pincode||!minimumOrder||!deliveryCharge||!contactNumber){
            return res.status(400).json({
                status:400,
                success:false,
                message:"please give all the field for a better experience"
            })
        }
        if(pincode.length!=6){
            return res.status(400).send({status:500,success:false,message:"please enter a valid pincode"})
        }
        const {id}=req.params
        const createAdress=await Address.create({
            state,
            city,
            pincode:parseInt(pincode)
        })
        const user=req.user
        let newShop=await Shop.create({
            name,
            address:createAdress._id,
            openingTime,
            closingTime,
            minimumOrder:parseInt(minimumOrder),
            deliveryCharge:parseInt(deliveryCharge),
            owner:user.id,
            location,
            state,
            city,
            pincode:parseInt(pincode),
            category:id,
            contactNumber:contactNumber,
        })
        await Category.updateOne({
            _id:id
        },
        {
         $push:{
            shops:newShop._id
         }
      })
      await userSchema.updateOne({_id:user.id},{
        $set:{
            shop:newShop._id
        }
      }
    )
      newShop=await Shop.findOne({_id:newShop._id})
                                 .populate('address')
                                 .populate({
                                    path:'owner',
                                    select:'username email contactNumber'
                                 })
      return res.status(200).json({
        status:200,
        success:true,
        message:"shop created successfully",
        shop:newShop
      })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}

exports.deleteShop=async(req,res)=>{
    try {
        const {id}=req.params
        await Shop.deleteOne({_id:id})
        const user=req.user
        await userSchema.updateOne({_id:user.id},{
            $set:{
                shop:null
            }
        })
        return res.status(200).json({
            status:200,
            success:true,
            message:"shop deleted successfully"
        })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}

exports.updateShop=async (req,res)=>{
    try {
        const {id}=req.params
        const {name,openingTime,closingTime,state,city,location,pincode,minimumOrder,deliveryCharge}=req.body
        if(!name||!openingTime||!closingTime||!state||!city||!location||!pincode||!minimumOrder||!deliveryCharge){
            return res.status(200).json({
                status:200,
                success:false,
                message:"please give all the field for a better experience"
            })
        }
        if(pincode.length!=6){
            return res.status(500).send({status:500,success:false,message:"please enter a valid pincode"})
        }
        const newAddress=await Address.create({
            state,
            city,
            location,
            pincode:parseInt(pincode)
        })
        await Shop.updateOne({
            _id:id
        },
        {
            name,
            openingTime,
            closingTime,
            minimumOrder:parseInt(minimumOrder),
            deliveryCharge:parseInt(deliveryCharge),
            address:newAddress._id
        })
       const updateShop=await Shop.findOne({_id:id})
        .populate('address')
        .populate({
           path:'owner',
           select:'username email contactNumber'
        })
        return res.status(200).json({
            status:200,
            success:true,
            message:"shop updated successfully",
            shop:updateShop
        })
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:error.message})
    }
}
exports.filterShops=async (req,res)=>{
    try {
        const {state,city,pincode}=req.body
        if(!state&&!city&&!pincode){
            return res.status(500).send({
                status:500,
                success:false,message:"please enter atleast one field"
            })
        }
        const filter={}
        if(state) filter.state=state.trim().toLowerCase()
        if(city) filter.city=city.trim().toLowerCase()
        if(pincode) filter.pincode=parseInt(pincode)
        console.log(filter)
        const shops=await Shop.find(filter)
        return res.status(200).json({
            success:true,
            shops
        })
    } catch (error) {
        return res.status(400).send({
            success:false,message:error.message
        })
    }
}

exports.getShopDetails=async (req,res)=>{
    try {
        const {id}=req.params
        const shop=await Shop.findOne({_id:id})
                             .populate('address')
                             .populate({
                              path:'owner',
                             })
                             .populate({
                                path:'category',
                             })
                             .populate({
                                path: 'products',  
                                populate: {        
                                    path: 'offer'  
                                }
                            })
                             .populate({
                                path:'review',
                             })
                             .populate('state')
                             .populate('city')
            return res.status(200).json({
                status:200,
                success:true,
                shop
            })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,
            message:error.message
        })
    }
}
exports.getMyShop=async (req,res)=>{
    try {
        const user=req.user 
        const shop=await Shop.findOne({owner:user.id})
                             .populate({
                                path:'products',
                                populate:{
                                    path:'offer'
                                }
                             })
                             .populate({
                                path:'orders',
                                populate:{
                                    path:'user',
                                    select:'name email contactNumber'
                                }
                             })
                             .populate('review')
                             .populate('state')
                             .populate('city')
        return res.status(200).json({
            success:true,
            shop
        })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,
            message:error.message
        })
    }
}
exports.getShopOrders=async (req,res)=>{
    try {
        const {id}=req.params
        const shop=await Shop.findOne({_id:id})
                             .populate({
                                path:'orders',
                                populate:{
                                    path:'user',
                                    select:'username email contactNumber'
                                }
                             })
     return res.status(200).json({
        status:200,
         success:true,
         orders:shop.orders
     })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,
            message:error.message
        })
    }
}