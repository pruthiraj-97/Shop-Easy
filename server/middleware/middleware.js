const jwt=require('jsonwebtoken')
exports.isAuthenticate=async (req,res,next)=>{
    try {
        const token=req.headers['x-access-token']
        if(!token){
          return res.status(401).json({
            status:401,
            success:false,
            message:'token not found'
        })
        }
       const payload=await jwt.verify(token,process.env.JWT_SECRET)
       if(!payload){
        return res.status(401).json({
            status:401,
            success:false,
            message:'token not found'
        })
       } 
       req.user=payload      
       next()
      } catch (error) {
          return res.status(401).json({status:401,success:false,message:"user not found"})
      }
}

exports.isAdmin=(req,res,next)=>{
    try {
        const user=req.user
        if(user.type.toLowerCase()=='admin'){
            next()
        }else{
            return res.status(400).send({status:400,success:false,message:"you are not admin"})
        }
    } catch (error) {
        return res.status(500).send({status:500,success:false,message:"error in cheak admin"})
    }
}

exports.isOwner=async(req,res,next)=>{
    console.log("control in owner ")
    try {
        const user=req.user
        if(user.type=='owner'||user.type=='admin'){
            next()
        }else{
            return res.status(400).send({status:401,success:false,message:"you are not owner"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({status:500,success:false,message:"error in cheak owner"})
    }
}