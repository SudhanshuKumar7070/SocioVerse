 import mongoose from "mongoose";

 const friendsSchema = new mongoose.Schema({
     initialUser:{ // jisne friend request bheja
        type: mongoose.Types.ObjectId,
        ref:"User"
     },
     addedUser:{  // jisko requset bheja
        type:mongoose.Types.ObjectId,
        ref:"User"
     }
 },{
    timestamps:true
 })

 export const Friend = mongoose.model("Friend",friendsSchema);
