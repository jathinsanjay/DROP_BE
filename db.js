
const mongoose=require("mongoose")
const {DB}=require("./constants.js")
const connectDB=async()=>{
    try{
        console.log(process.env.MONGO_URI)
        const connectionInstance=await mongoose.connect(`mongodb://localhost:27017/${DB}`)
        console.log("DB connected to Connection",connectionInstance.connection.host)

    }
    catch(err){
        console.log("Error in connecting to the database");
        throw err
    }
}


module.exports = connectDB;