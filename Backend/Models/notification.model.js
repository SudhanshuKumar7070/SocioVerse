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
        // it should containn what kind of notification it is..
        // chat , tweet , app etc event notification like friendRequestSent or friendRequestAccepted notifications
    },
    friendRequestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FriendRequest"
    },
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    }
    
 },{timestamps:true})
 export const Notification = mongoose.model("Notification", notificationSchema)