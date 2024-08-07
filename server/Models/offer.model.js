const mongoose=require('mongoose')
const offerSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    discount:{
        type:Number,
        require:true
    },
    amount:{
       type:Number,
       require:true
    },
    openingDate:{
        type:String,
        require:true
    },
    closingDate:{
        type:String,
        require:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
},{timestamps:true})

module.exports=mongoose.model('Offer',offerSchema)