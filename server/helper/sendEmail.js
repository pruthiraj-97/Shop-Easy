const resend=require('../utils/resendEmail')
exports.sendEmail=async (email,username)=>{
  try {
    const data=await resend.emails.send({
        from:process.env.EMAIL,
        to:email,
        subject:"Shop Easy",
        html:`<h1>Hello ${username}</h1>
              <p>Thank you for using Shop Easy</p>
             `
     })
     return data
  } catch (error) {
     console.log("error in sending email")
  }
}