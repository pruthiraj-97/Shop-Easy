const Otp=require('../Models/otp.model')
const twilio=require('twilio')
const otpGenerator = require('otp-generator')
exports.sendOtp=async (req,res)=>{
    try {
        const {contactNumber}=req.body
        if(!contactNumber){
            return res.status(400).send({status:400,message:"Enter number"})
        }
        if(contactNumber.length!=10){
            return res.status(400).send({status:400,message:"Invalid Number"})
        }
        const number=parseInt(contactNumber)
        const otp=otpGenerator.generate(6,{
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
        const otpCreate = await Otp.create({
            contactNumber:number,
            otp:parseInt(otp)
        })
        console.log(otpCreate)
        const client=twilio(process.env.TWILLIO_ACCOUNT_SID,process.env.TWILLIO_AUTH_TOKEN)
        client.messages.create({
        body: `Thanks for connecting shopEasy your otp is ${otp}`,
        to: `+91${number}`,
        from:process.env.TWILLIO_NUM
    })
    .then((message) => console.log("message", message.sid));
        return res.status(200).send({
            status:200,
            success:true,
            message:"otp send"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status:500,
            success:false,
            message:error
        })
    }
}