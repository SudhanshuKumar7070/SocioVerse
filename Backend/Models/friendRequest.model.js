
import  mongoose from "mongoose"

const friendRequestSchema = new mongoose.Schema({
    senderId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
    },
    receiverId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
    },
    status: { type: String, default: 'pending' }
    // friend request can be acccepetd , pending or denied
},{timestamps:true})
 export const FriendRequest = mongoose.model("FriendRequest",friendRequestSchema)