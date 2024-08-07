const mongoose=require('mongoose')
const categorySchema=new mongoose.Schema({
    category:{
        type:String,
        require:true
    },
    shops:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Shop'
        }
    ]
},{timestamps:true})

module.exports=mongoose.model('Category',categorySchema)