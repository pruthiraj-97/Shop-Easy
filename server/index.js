const express=require('express')
const cors=require('cors')
require('dotenv').config()
const {connectDB}=require('./config/database')
const otpRouter=require('./routers/opt.router')
const authRouter=require('./routers/auth.router')
const shopRouter=require('./routers/shop.router')
const orderRouter=require('./routers/order.router')
const productRouter=require('./routers/product.router')
const adminRouter=require('./routers/adminPannel')
const app=express()
app.use(express.json())

app.use(cors({
     origin:'*',
     credentials:true
}))


app.use('/api/auth',authRouter)
app.use('/api/shop',shopRouter)
app.use('/api/order',orderRouter)
app.use('/api/otp',otpRouter)
app.use('/api/product',productRouter)
app.use('/api/adminpannel',adminRouter)

app.get('/',(req,res)=>{
     res.status(200).send({
          message:'wellcome to shopEasy server'
     })
})

app.listen(process.env.PORT,()=>{
     console.log('server is running on port ', process.env.PORT)
})
connectDB()