const mongoose=require('mongoose')
const statesSchema=new mongoose.Schema({
    state:{
        type:String,
        trim:true,
        unique:true,
        lowercase:true,
        require:true
    }
})
module.exports=mongoose.model('State',statesSchema)