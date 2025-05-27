import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
  Follower:{ // who is following 
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  Following : {  // whom to follow 
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true})

export const Follower = mongoose.model("Follower",followerSchema)