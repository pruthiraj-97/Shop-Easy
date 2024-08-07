const orderSchema=require('../Models/order.model')
const Shop=require('../Models/shop.model')
const userSchema=require('../Models/user.model')
const twilio=require('twilio')
const otpGenerator = require('otp-generator')
const Product=require('../Models/product.model')
const ReviewSchema=require('../Models/review.model')
const {sendEmail}=require('../helper/sendEmail')
exports.createOrder=async (req,res)=>{
    try {
        const {id}=req.params
        const {contactNumber,address}=req.body
        const user=req.user
        if(!contactNumber||!address){
            return res.status(400).send({
                status:400,
                success:false,
                message: "Please fill out all required fields."
            })
        }
        if(contactNumber.length!=10){
            return res.status(400).json({
                status:400,
                success:false,
                message:"Please enter a valid phone number"
            })
        }
        const myCart=await userSchema.findOne({_id:user.id}).select('mycart')
        const products=myCart.mycart
        if(products.length==0){
            return res.status(400).json({
                status:400,
                success:false,
                message:"please add some products to your cart for sending order"
            })
        }
        const shop=await Shop.findOne({_id:id})
        let totalPrice=0
        let productArray=[]
        const today = new Date().toISOString().slice(0,10);
        for (const Item of products) {
            let orderItem=await Product.findOne({_id:Item.product})
                                .populate('offer')
            if(parseInt(orderItem.quantity)<parseInt(Item.quantity)){
                console.log(`${orderItem.name} is out of stock`)
                return res.status(400).json({
                    status:400,
                    success:false,
                    message:`${orderItem.name} is out of stock`
                })
            }
            if(orderItem.offer&&orderItem.offer.amount<=parseInt(Item.quantity)
            &&orderItem.offer.closingDate>=today){
                let discountPrice=(orderItem.price*parseInt(Item.quantity))
                discountPrice=discountPrice-discountPrice*(orderItem.offer.discount/100)
                console.log(discountPrice)
                totalPrice+=discountPrice
                productArray.push({
                    [orderItem.name]:discountPrice,
                    number:Item.quantity,
                    id:orderItem._id,
                    image:orderItem.image,
                    price:discountPrice,
                    quantity:Item.quantity
                })
            }else{
                let discountPrice=parseFloat(orderItem.price*parseInt(Item.quantity))
                totalPrice+=discountPrice
                productArray.push({
                    [orderItem.name]:discountPrice,
                    number:Item.quantity,
                    id:orderItem._id,
                    image:orderItem.image,
                    price:discountPrice,
                    quantity:Item.quantity
                })
            }
        };
        totalPrice=totalPrice+shop.deliveryCharge
        if(shop.minimumOrder>totalPrice){
            return res.status(400).json({
                status:400,
                success:false,
                message:`Minimum order amount should be ${shop.minimumOrder} your total amount is ${totalPrice}`
            })
        }
        return res.status(200).json({
            status:200,
            success:true,
            productArray:productArray,
            totalPrice:totalPrice,
            address
        })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,
            message:error.message
        })
    }
}

exports.confirmOrder=async (req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        const {contactNumber,address,productArray,totalPrice}=req.body
        if(!contactNumber||!address||!productArray||!id||productArray.length==0){
            return res.status(400).send({
                status:400,
                success:false,
                message:"Please fill out all required fields."
            })
        }
        const newOrder=await orderSchema.create({
            shop:id,
            products:productArray,
            totalPrice:parseFloat(totalPrice),
            user:user.id,
            address:address,
            orderStatus:"pending",
            contactNumber:parseInt(contactNumber),
            confirmOtp:null
        })
        for(const Item of productArray){
            await Product.updateOne({_id:Item.id},{
                $inc:{
                    quantity:-Item.number
                }
            })
        }
        
        await Shop.updateOne({_id:id},{
            $push:{
                orders:newOrder._id
            }
        })
        await userSchema.updateOne({_id:user.id},{
            $push:{
                orderHistory:newOrder._id
            },
            $set:{
                mycart:[]
            }
        })
        const data=await sendEmail(user.email,user.username)
        const shopUser=await userSchema.findOne({shop:id})
        const client=twilio(process.env.TWILLIO_ACCOUNT_SID,process.env.TWILLIO_AUTH_TOKEN)
        await client.messages.create({
            body: `Cheak a new Order from ${user.username} with total amount of ${totalPrice}`,
            to: `+91${shopUser.contactNumber}`,
           from:process.env.TWILLIO_NUM
        })
        return res.status(200).json({
            status:200,
            success:true,
            message:"order confirmed successfully",
            order:newOrder
        })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,
            message:error.message
        })
    }
}
exports.cancelleOrder=async(req,res)=>{
    try {
        const {id}=req.params
        const {productArray}=req.body
        const order=await orderSchema.findOne({_id:id})
        if(order.orderStatus=="cancelled"){
            return res.status(400).json({
                status:400,
                success:false,
                message:"order already cancelled"
            })
        }
        if(order.orderStatus=="delivered"){
            return res.status(400).json({
                status:400,
                success:false,
                message:"order already delivered"
            })
        }
        for(const Item of productArray){
            await Product.updateOne({_id:Item.id},{
                $inc:{
                    quantity:+Item.number
                }
            })
        }
        await orderSchema.updateOne({_id:id},{
            $set:{
                orderStatus:"cancelled"
            }
        })
        const newOrder=await orderSchema.findOne({
            _id:id
        })
        return res.status(200).json({
            status:200,
            success:true,
            message:"order cancelled successfully",
            order:newOrder
        })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,
            message:error.message
        })
    }
}

exports.sendOrderOtp=async (req,res)=>{
    try {
        const {id}=req.params
        const order=await orderSchema.findOne({_id:id})
                                     .populate({
                                        path:'shop'
                                     })
         if(order.orderStatus=="delivered"||order.orderStatus=="cancelled"){
             return res.status(400).json({
                 status:400,
                 success:false,
                 message:`can not send otp on order having ${order.orderStatus}`
             })
         }
        const otp=otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
        await orderSchema.updateOne({_id:id},{
            $set:{
                confirmOtp:parseInt(otp)
            }
        })
        const client=twilio(process.env.TWILLIO_ACCOUNT_SID,process.env.TWILLIO_AUTH_TOKEN)
        client.messages.create({
        body: `Thanks for connecting shopEasy your otp is ${otp}`,
        to: `+91${order.contactNumber}`,
        from:process.env.TWILLIO_NUM
        })
        .then((message) => console.log("message", message.sid));
        await orderSchema.updateOne({_id:id},{
            $set:{
                confirmOtp:parseInt(otp)
            }
        })
        return res.status(200).json({
            success:true,
            message:'confirmation otp send successfully'
        })
    } catch (error) {
        return res.status(500).send({
            status:500,
            success:false,
            message:error.message
        })
    }
}

exports.deliveredOrder=async(req,res)=>{
    try {
        const {id}=req.params
        const {otp}=req.body
        if(!otp){
            return res.status(400).json({
                status:400,
                success:false,
                message:'enter a correct otp'
            })
        }
        let order=await orderSchema.findOne({_id:id})
                                     .populate({
                                        path:'shop'
                                     })
                                     .populate({
                                        path:'user',
                                        select:'username email contactNumber'
                                     })
        if(order.orderStatus=="delivered"||order.orderStatus=="cancelled"){
            return res.status(400).json({
                status:400,
                success:false,
                message:`can not send otp on order having ${order.orderStatus}`
            })
        }
        
        if(parseInt(order.confirmOtp)!=parseInt(otp)){
            return res.status(400).json({
                status:400,
                success:false,
                message:"invalid otp"
            })
        }
        await orderSchema.updateOne({_id:id},{
            $set:{
                orderStatus:"delivered"
            }
        })
        
        order=await orderSchema.findOne({_id:id})
                               .populate({
                                path:'user',
                                select:'username contactNumber email'
                               })
        client=twilio(process.env.TWILLIO_ACCOUNT_SID,process.env.TWILLIO_AUTH_TOKEN)
        await client.messages.create({
            body:`order ${order.orderStatus} successfully
                  Thanks for connecting shopEasy`,
            to:`+91${order.contactNumber}`,
            from:process.env.TWILLIO_NUM
        })
        return res.status(200).json({
            status:200,
            success:true,
            message:"order delivered successfully",
            order
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            message:error.message
        })
    }
}

exports.rejectOrder=async(req,res)=>{
    try {
        const {id}=req.params
        const order=await orderSchema.findOne({_id:id})
        if(order.orderStatus!="pending"){
            return res.status(400).json({
                status:400,
                success:false,
                message:`only pending order can reject this order is in ${order.orderStatus} mode`
            })
        }
        for(const Item of order.products){
            await Product.updateOne({_id:Item.id},{
                $inc:{
                    quantity:+parseInt(Item.number)
                }
            })
        }
        
        const ans=await order.updateOne({_id:id},{
            $set:{
                orderStatus:"rejected"
            }
        })
        return res.status(200).json({
            status:200,
            success:true,
            message:"order rejected successfully"
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            message:error.message
        })
    }
}
exports.giveReview=async (req,res)=>{
    try {
        const {id}=req.params
        const {ratting,review}=req.body
        if(!ratting||!review){
            return res.status(400).json({
                status:400,
                success:false,
                message:"Please give some ratting"
            })
        }
        const order=await orderSchema.findOne({_id:id})
        if(order.orderStatus!="delivered"){
            return res.status(400).json({
                success:false,
                message:"order not delivered yet"
            })
        }
        const newReview=await ReviewSchema.create({
            ratting:parseFloat(ratting),
            review:review,
            user:order.user,
            shop:order.shop
        })
        await Shop.updateOne({
            $push:{
                reviews:newReview._id
            }
        })
        return res.status(200).json({
            status:200,
            success:true,
            message:"review given successfully"
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            message:error.message
        })
    }
}
exports.pendingOrders=async (req,res)=>{
    try {
        const {id}=req.body
        const shops=await Shop.findOne({_id:id})
                              .populate({
                                path:'orders',
                              })
        let pendingOrders=[]
        shops.forEach((Item)=>{
           if(Item.orders.orderStatus=="pending"){
               pendingOrders.push(Item.orders)
           }
        })
        return res.status(200).json({
            status:200,
            success:true,
            message:"order fetched successfully",
            pendingOrders
        })
    } catch (error) {
        return res.status(400).json({
            status:400,
            success:false,
            message:error.message
        })
    }
}
