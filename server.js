
const express = require('express');
const ConnectDB=require("./db.js");
const cookieParser=require("cookie-parser")
const {verifyjwt}=require('./middleware/auth.js')
const dotenv=require("dotenv")
const cors= require("cors")
const app = express();
const {createUser,addFollower,getFollowers,removeFollower,Login,logout,getUsers}=require('./controllers/user.controller.js')
const {postMessage,likeMessage,getMessage}= require('./controllers/message.controller.js')
const port = 3000;
app.use(express.json());
app.use(cookieParser())
dotenv.config({
    path:"./.env"
})
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow both origins
  credentials: true, // Allow credentials (cookies) to be sent
}));




ConnectDB().then(
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  
}))
app.use('/reg', createUser);
 app.use('/postmsg',verifyjwt,postMessage);
app.use('/likemsg',verifyjwt,likeMessage)
app.use('/addFollower',verifyjwt,addFollower)
app.use('/messages',verifyjwt,getMessage)
app.use('/followers',verifyjwt,getFollowers)
app.use('/removeFollower',verifyjwt,removeFollower)
app.use('/login',Login)
app.use('/getusers',getUsers)
app.use('/logout',verifyjwt,logout)

