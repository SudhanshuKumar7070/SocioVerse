import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; 
const reelSchema = new mongoose.Schema({
video:{
    type:String,
    required:true
},
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
duration:{
    type:Number,
    required:true
},
thumbnail:{
    type:String,

},
songUsed:{
    type:String
},
description:{
    type:String,
}
},{ timestamps:true})
reelSchema.plugin(mongooseAggregatePaginate)
export const Reel  = mongoose.model("Reel",reelSchema);