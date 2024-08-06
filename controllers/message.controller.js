const User=require("../models/user.model.js")
const Message=require("../models/message.model.js")
const dotenv=require("dotenv")

const {ApiError}=require('../Errorhandler/ApiError.js')
const {Asynchandler}=require('../Errorhandler/asynchandler.js');
const { ApiResponse } = require('../Errorhandler/Apiresponse.js');
const postMessage=Asynchandler(async (req, res, next) => {
    const { userid, message } = req.body;
  
    // Find the current user
    const currentUser = await User.findById(userid);
    if (!currentUser) {
      return next(new ApiError(400, "Cannot find user"));
    }
  
    // Create the message
    const currentMessage = await Message.create({
      user: userid,
      message,
      
    });
  
    // Update the user with the new message
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { $push: { Message: currentMessage._id } }, // Assuming 'messages' is the array field in the user schema
      { new: true, runValidators: true }
    );
  
    console.log(updatedUser);
  
    // Return the response
    return res.status(201).json({
      success: true,
      message: "Message posted successfully",
      data: currentMessage
    });
  })
  const likeMessage=Asynchandler(async(req,res,next)=>{
    const {userid,messageid}= req.body;
    const likeduser=await User.findById(userid);
    const likedmessage=await Message.findById(messageid);
    if(!likeduser||!likedmessage){return next(new ApiError(400,"Cannot find user or message"))}
    if (likedmessage.likes.includes(userid)) {
      return res.status(200).json({
        success: true,
        message: "User has already liked this message"
      });
    }
    const updatemessage=await Message.findByIdAndUpdate(
      messageid,
      { $push: { likes:likeduser._id
        }},
        
        { new: true, runValidators: true }  // Assuming 'likes' is the array field in the message schema
    )
    if (!updatemessage) {
    throw new ApiError(400, "Unable to update message");
    }
  
    // Return success response
    return res.status(201).json({
      success: true,
      message: "Post liked successfully",
      data: updatemessage
    });
  
  })

  const getMessage=Asynchandler(async(req,res)=>{
    const {userid}=req.body
    const user=await User.findById(userid).populate('followers')
    console.log(user)
    const followersid=user.followers.map(follower=>follower._id)
    if(!followersid){return next (new ApiError(400,"Cannot find user"))}
    const messages=await Message.find({
      user: { $in: followersid }}
    ).sort({ createdAt:-1 }).populate('user')
    const texts=messages
   
    const response={
      "text":texts,
      

    }
    console.log(texts)
    res.status(200).json(
      response
    )
  
  })
  module.exports={postMessage,likeMessage,getMessage}