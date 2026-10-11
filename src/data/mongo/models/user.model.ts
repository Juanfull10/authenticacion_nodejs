import mongoose, { mongo } from "mongoose";


const userSchema =  new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Name us required']
    },

    email:{
        type:String,
        required:[true,'email us required'],
        unique:true
    },
    emailValidate:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    img:{
        type:String
    },
    role:{
        type:[String],
        default:['USER_ROLE'],
        enum:['ADMIN_ROLE','USER_ROLE']
    }


})

export const UserModer= mongoose.model('User',userSchema);