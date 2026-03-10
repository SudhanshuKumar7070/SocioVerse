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
        enum:["chatMessage","friendRequest","friendRequestAccept","friendRequestReject","tweetNotification","tweetLike","tweetRetweet","tweetComment","tweetShare","tweetReply"]
        // it should containn what kind of notification it is..
        // chat , tweet , app etc event notification like friendRequestSent or friendRequestAccepted notifications
    },
    sourceId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"sourceModel"
    },
     sourceModel: { 
        type: String, 
        enum: ["FriendRequest", "Conversation", "Post", "Comment"] 
    }
    
 },{timestamps:true})
 export const Notification = mongoose.model("Notification", notificationSchema)