import mongoose, { Schema } from "mongoose";
const groupSchema = new mongoose.Schema({
    groupName:{
        type:String,
        requred:true
    },
    groupIcon:{
        type:String,
        
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    Participants:[{
        type:Schema.types.ObjectId,
         ref:"User"
    }],


},{
    timestamps:true
})
export const Group = mongoose.model("Group",groupSchema)