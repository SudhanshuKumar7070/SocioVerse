import mongoose from "mongoose";

const likesModel = new mongoose.Schema({
owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
},
tweets:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Tweet"
},
comments:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Comment"
}

},{timestamps:true})

export const Like = mongoose.model("Like",likesModel)