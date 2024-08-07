const mongoose=require('mongoose')
const rattingAndreviewSchema=new mongoose.Schema({
    ratting:{
        type:Number,
        require:true
    },
    review:{
        type:String,
        require:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Shop',
        require:true
    }
})

module.exports=mongoose.model('Review',rattingAndreviewSchema)