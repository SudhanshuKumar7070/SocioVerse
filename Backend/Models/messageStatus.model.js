import mongoose from "mongoose";

const messageStatusSchema = new mongoose.Schema({
    messageId:{
        type:Schema.Types.ObjectId,
         ref:"Message"
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String, // read ,sent , delivered
    }
},{
    timestamps:true
});
 export  const  MessageStatus = mongoose.model("MessageStatus",messageStatusSchema)