const mongoose=require('mongoose')
exports.connectDB= async ()=>{
    try {
        await mongoose.connect(process.env.DATA_BASE_URL)
        console.log("database connected")
    } catch (error) {
        console.log("error in db connection")
        process.exit('1')
    }
}