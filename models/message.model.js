const mongoose=require("mongoose");
const { Schema } = mongoose;
const messageSchema=new Schema(
    {
        user: {  // Renamed from 'User' to 'user' for clarity
            type: Schema.Types.ObjectId,
            ref: "User",  // Reference to the User model
            required: true
          },
        message:{
            type:String,

        },
        likes:[{
            type: Schema.Types.ObjectId,
            ref: "User",  // Reference to the User model
            required: true,
            default:[]
        }]
        
    }, 
    {
        timestamps:true
    }
)
const Message=mongoose.model("Message",messageSchema)
module.exports= Message