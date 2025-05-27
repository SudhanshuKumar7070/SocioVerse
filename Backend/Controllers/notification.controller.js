import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";
import { Notification } from "../Models/notification.model.js";
import mongoose from "mongoose";




// change the status from read false to true
   const updateIsRead = AsyncHandler(async(req,res)=>{
    const {notificationId} = req.params;
    if (!notificationId.trim()) throw new ApiError(400,"missing notificatin id");
    if (!mongoose.Types.ObjectId.isValid(notificationId) ) throw new ApiError(500,"invalid mongoose id");
     const isLoggedIn = req.user?._id;
     if(!isLoggedIn) throw new ApiError(402,"authentication required");
         const notification = await Notification.findByIdAndUpdate(new mongoose.Types.ObjectId(notificationId),{
            $set:{
                isRead:true
            }
         },{
            new:true
         })
         if (!notification)throw new ApiError(400,"unable to update isRead notification");
         return res.status(200).json(new ApiResponse(200,notification,"updated success fully"));
   })
   // get all friend Request notificatin of the user
     const getFriendRequestNotification =  AsyncHandler(
      async(req,res)=>{
         const userId = req.user?._id;
     //   planning of the controller
     // get loggedd in user id
     //   2 approaceh , 1 , aggregation and find, , better is match state
     // match staus with pending,
     // this can be a good approach because, when the user get connectd or at time of loadig all notifications willl be seen at once
     if(!userId) throw new ApiError (402, "you need to login first")
         const notifications = await Notification.aggregate([
        {
           $match:{
            isRead:false,
            receiver:userId,
            service: { $in: ["friendRequest", "friendRequestAccept"] } // for multiple stages of friend request notification
           }
        },
      {
         $sort:{
            createdAt:-1
         }
      }])
   if (!notifications || notifications.length === 0) throw new ApiError(500,"something went wrong in fetching notifications at the moment");
   return res.status(200).json(new ApiResponse(200,notifications,"chat notification  fetched successfully"))
      }  
     ) 
//  get all notification text messages -> get messages while oppenig the app
  const getChatNotification  = AsyncHandler((async(req,res)=>{
      const userId = req.user?._id;
      if(!userId)throw new ApiError(402,"you need to login first");
        const chatNotifications = await Notification.aggregate([{
$match:{
   isRead:false,
   receiver:userId,
   service:"chatMessage"
},
        },
        {
$lookup:{
   from:"users",
   localField:"sender",
   foreignField:"_id",
   as:"userDetails"
},
        },
        {
         $project: {
           userName: { $arrayElemAt: ["$userDetails.userName", 0] },
           profilePicture: { $arrayElemAt: ["$userDetails.profilePicture", 0] },
           content: 1,
           receiver: 1,
           createdAt: 1,
           updatedAt: 1,
           conversationId:1
         }
       },

       {
         $sort:{
            createdAt:-1
         }
       }
      ])
   if (!chatNotifications || chatNotifications.length===0) return res.status(204).json({message:" you doesn't have any messages right now"
   }) 
   return res.status(200).json(new ApiResponse(200,chatNotifications,"notitifications fetched successfully"));
    
  }))
   const getTweetNotification = AsyncHandler(async(req,res)=>{
      const userId = req.user?._id
      if(!userId) throw new ApiError(402, "you need to login first");
    const tweetNotifications = await Notification.aggregate([{
      isRead:false,
      // todo - creating notifications for tweets
      service:"tweetNotification"
    }])

   })


   
 export {
updateIsRead,getFriendRequestNotification,getChatNotification
 }