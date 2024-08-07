const mongoose=require('mongoose')
const citySchema=new mongoose.Schema({
    city:{
        type:String,
        trim:true,
        unique:true,
        lowercase:true,
        require:true
    }
})
module.exports=mongoose.model('City',citySchema)