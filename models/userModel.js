import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    userName:{
        type:String,
        trim:true,
    },
    password:{
        type:String,
    },
    gmail:{
        type:String,
        trim:true,
    },
    token:{
        type:String
    },
    bookmarks:[{
        type:String,
        default:[]
    }],
    done:[{
        type:String,
        default:[]
    }],
    pic:{
        type:String,
    }

},{
    timestamps:true
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    return next();
})

userSchema.methods.generateToken = async function(){

    return await jwt.sign(
        {
            _id:this._id,
            userName:this.userName
        },
        "secret",
        {
            expiresIn:"1d"
        })
    
}

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}



export const User = mongoose.model("User",userSchema);