import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:Schema.Types.ObjectId,
        ref:"Conversation"
    },
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },  
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
    },
    media:{
        type:String // any media such as images , photos , videos
    },
    satus:{
        type:String // delivered or not 
    }
},{
    timestamps:true
})
export const Message = mongoose.model("Message",messageSchema)