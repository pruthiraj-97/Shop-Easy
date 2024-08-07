const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({ 
      username:{
        type:String
      },
      email:{
        type:String,
        require:true
      },
      password:{
        type:String,
        require:true
      },
      contactNumber:{
        type:Number,
      },
      shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Shop'
      },
      type:{
        type:String,
        enum:['user','admin','owner'],
        default:'user'
      },
      orderHistory:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order'
       }
      ],
    pincode:{
      type:Number
    },
    state: {
      type: String,
      trim: true,
      lowercase: true,
  },
  city:{
    type: String,
    trim: true,
    lowercase: true,
  },
  mycart:[
    {
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
      },
      quantity:{
        type:Number,
        require:true
      }
    }
  ]
 },
 {timestamps:true})

module.exports=mongoose.model('User',userSchema)