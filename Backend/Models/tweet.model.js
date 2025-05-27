import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
 const tweetSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
    TextContent:{
    type:String,
    required:true
   },

   imageUrl:{
    type:String,
    // will be taken from cloudinary
   },
   videoContent:{
    type:String,
// will be taken from cloudinary
   }

 },{timestamps:true})
 tweetSchema.plugin(mongooseAggregatePaginate);
   export const Tweet = mongoose.model("Tweet", tweetSchema);