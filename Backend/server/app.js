// creating express app in app.js
// and listening at index and connect db at index
import express from "express"
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoutes from "../Routes/auth.Routes.js"
import userRoutes from "../Routes/user.Route.js"
import userConversation from '../Routes/conversationRoute.js'
import followRoute  from "../Routes/followers.route.js"
import tweetRoute from "../Routes/tweet.Route.js"
import commentRoute from "../Routes/comment.route.js"
import notificationRoute from "../Routes/notification.routes.js"
import friendRequestRoute from "../Routes/friendRequest.route.js"
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"))
app.use(express.json({limit:"10kb"}));
app.use(cookieParser());
app.use(cors(
     {
         origin:"http://localhost:5173"
         , credentials:true
     }
))
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/conversation",userConversation)
app.use("/api/v1/follow",followRoute)
app.use("/api/v1/tweet",tweetRoute)
app.use("/api/v1/comment", commentRoute)
app.use("/api/v1/notification",notificationRoute)
app.use("/api/v1/friend_request",friendRequestRoute)

// habdling errors for frontend
app.use((req,res)=>{
    
    return res.status(404).json({
        status:404,
        message:"not found"
    })
})
app.use((err,req,res,next)=>{
    return res.status(err.status || 500).json({
        status:err.status || 500,
        message:err.message || "internal server error"
    })
})
export{app}






