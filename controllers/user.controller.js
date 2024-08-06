const User=require("../models/user.model.js")
const Message=require("../models/message.model.js")
const dotenv=require("dotenv")

const {ApiError}=require('../Errorhandler/ApiError.js')
const {Asynchandler}=require('../Errorhandler/asynchandler.js');
const { ApiResponse } = require('../Errorhandler/Apiresponse.js');


const createUser=Asynchandler(async(req, res) => {
    
    const {fullName,userName,email,password}=req.body;
    if(!fullName||!userName||!email||!password){
     throw new ApiError(200,"All fields required")
    }
 
    const user=await User.create(
        {
            fullName,
            email,
            password,
            userName
    
        }
       )
       console.log(user)
       
       return res.status(201).json(
        new ApiResponse(user,"Registered Successfully")
       )
    
 

 })
 const addFollower=Asynchandler(async(req,res)=>{
    const {userid,followerid}= req.body;
    const user=await User.findById(userid);
    const follower=await User.findById(followerid);
    if(!user||!follower){return next(new ApiError(400,"Cannot find user or follower"))
      }
    if(user.followers.includes (followerid)){
      throw new ApiError(400,"You are already following user")
    }
  
      const updateUser=await User.findByIdAndUpdate(
        userid,
        { $push: { followers: followerid } },
        { new: true, runValidators: true }
      )
      console.log(updateUser)
      if(!updateUser){
        throw new ApiError(400,"Something went wrong")
      }
      
        res.status(201).json(
          
            new ApiResponse(201,"started following")
          
        )
      
  })
  const getFollowers=Asynchandler(async(req,res)=>{
    const {userid}=req.body;
    const user=await User.findById(userid).populate('followers');
    const followerNames= user.followers.map(f=>f.userName);
    res.status(200).json(
      new ApiResponse(200,user.followers)
    )
  
  
  })
  const removeFollower=Asynchandler(async(req,res)=>{
    const {userid,followerid}= req.body;
    const user=await User.findById(userid);
    const follower=await User.findById(followerid);
    if(!user||!follower){return next(new ApiError(400,"Cannot find user or follower"))
      }
    if(!user.followers.includes (followerid)){
      throw new ApiError(400,"You are already following user")
    }
  
      const updateUser=await User.findByIdAndUpdate(
        userid,
        { $pull: { followers: followerid } },
        { new: true, runValidators: true }
      )
      console.log(updateUser)
      if(!updateUser){
        throw new ApiError(400,"Something went wrong")
      }
      
        res.status(201).json(
          
            new ApiResponse(201,"stopped following")
          
        )
      
  
  })
  const Login=Asynchandler(async(req,res)=>{
    const {userName,password}=req.body;
    if(!userName||!password){return next (new ApiError(400,"All fields required"))}
    const user=await User.findOne({userName})
    if(!user){return next(new ApiError(400,"Invalid username or password"))}
    const passwordCorrect=await user.verifypassword(password)
   
    if(!passwordCorrect){
        throw new ApiError(400,"Incorrect password")
    }
    const refreshToken=await user.generateRefreshToken()
    const accessToken=await user.generateAccessToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    const options = {
      httpOnly: true, // Cookie cannot be accessed via JavaScript
      secure: true, // Set to true if using HTTPS
      sameSite: 'None', // Adjust based on your requirements
    };
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    res.status(200)
    .cookie("RefreshToken",refreshToken,options)
    .cookie("AccessToken",accessToken,options)
    .json(new ApiResponse(200,{
        user:loggedInUser,accessToken,refreshToken

    },"User Logged in Successfully"))
  })
  const logout= Asynchandler(async(req, res) => {
    try{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("RefreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))}
    catch(error)
    {
        throw new ApiError(400,error)

    }
})
const getUsers=Asynchandler(async(req,res)=>{
  const users=await User.find({})
  res.status(200).json(
     new ApiResponse(200,users,"users fetched")
  )
  
})
 module.exports={createUser,addFollower,getFollowers,removeFollower,Login,logout,getUsers}