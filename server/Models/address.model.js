const mongoose=require('mongoose')
const AddressSchema=new mongoose.Schema({
    state:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    pincode:{
        type:Number,
        require:true
    }
},{timestamps:true})

module.exports=mongoose.model('Address',AddressSchema)