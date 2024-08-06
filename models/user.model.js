const mongoose=require("mongoose")
const { Schema } = mongoose;
const jwt=require("jsonwebtoken")
const userSchema=new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true},
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required: [true,"password is required"],


    },
    fullName:{
        type:String,
        required:true,
        lowercase:true,
        index:true,
        trim:true
    },
    followers:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    Message:[
        {
        type:Schema.Types.ObjectId,
        ref:"Message"

        }
    ],
    refreshToken:{
        type:String

    }
   

}, 
{
    timestamps:true
})
userSchema.methods.verifypassword=async function(password){
    if(password===this.password){
        return true;
    }
    return false;
}
userSchema.methods.generateRefreshToken=async function(){
   return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY

        }
    )
}
userSchema.methods.generateAccessToken=async function(){
   
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY

        }
    )
}
const User=mongoose.model("User",userSchema)
module.exports =User;