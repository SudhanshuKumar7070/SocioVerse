import mongoose from "mongoose";



const commentSchema = new mongoose.Schema({
    owner:{ // kisne comment kiya
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String, // kya comment kiya
        required:true
    },
    tweet:{// kis tweet par comment kiya
        type:mongoose.Schema.Types.ObjectId,  
        ref:"Tweet"
    }
},{timestamps:true})

export const Comment = mongoose.model("Comment",commentSchema)