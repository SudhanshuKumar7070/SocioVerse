import mongoose from 'mongoose'
 const notificationSchema = new mongoose.Schema({
    content:{
        type:String,
    }
    , isRead:{
        type:Boolean,
        default:false
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ,
    service:{
        type:String,
        enum:[
          "chatMessage",
          "friendRequest",
          "friendRequestAccept",
          "friendRequestReject",
          "tweetNotification",
          "tweetLike",
          "tweetRetweet",
          "tweetComment",
          "tweetShare",
          "tweetReply",
          "follow"
        ]
        // it should contain what kind of notification it is..
    },
    sourceId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"sourceModel"
    },
     sourceModel: { 
        type: String, 
        enum: ["FriendRequest", "Conversation", "Post", "Comment", "User"] 
    }
    
 },{timestamps:true})
 export const Notification = mongoose.model("Notification", notificationSchema)