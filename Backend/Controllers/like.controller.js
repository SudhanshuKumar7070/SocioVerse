import { AsyncHandler } from "../Utils/AsyncHandler";
import { ApiError } from "../Utils/ApiError";
import mongoose from "mongoose";
import { ApiResponse } from "../Utils/ApiResponse";
import { Like } from "../Models/likes.model";
import { Tweet } from "../Models/tweet.model";
import { Comment } from "../Models/comment.model";

const isTweetLiked =  async(req,tweetId)=>{
  const loginId = req.user?._id;
  const currentLike = await Like.findOne({
    owner:loginId,
    tweets: new mongoose.Types.ObjectId(tweetId)
  })
  if(!currentLike) return false
  return true;
}

// check is comment like
const isCommentLiked =  async(req,commentId)=>{
    const loginId = req.user._id;
    const currentLike = await Like.findOne({
      owner:loginId,
      comments: new mongoose.Types.ObjectId(commentId)
    })
    if(!currentLike) return false
    return true;
  }



const toggleTweetLike = AsyncHandler(async(req,res)=>{
     const userId = req.user?._id;
     if(!userId) throw new ApiError(400, " unauthorised user ");
      const {tweetId} = req.params;
      if(!tweetId.trim()) throw new ApiError(404,"tweetId is not available at the moment");
      if(!mongoose.Types.ObjectId.isValid(tweetId)) throw new ApiError(500,"invalid tweet Id");
    // check for current status
    const isContentLiked = await isTweetLiked (req,tweetId);
     if(!isContentLiked){
        const like = await Like.create({
            tweets:tweetId,
            owner:userId
        })
        if(!like) throw new ApiError(500,"something went wrong in Like tweet");
        return res.status(200).json( new ApiResponse(200, like ,"tweet liked successfully"));
     }
     else if(isContentLiked) {
        // delete existing like 
        const deleteLike = await Like.findOneAndDelete({
            owner:userId,
            tweets:tweetId
        });
        if(!deleteLike) throw new ApiError(500,"sosmething went wrong in remove like from video");
        return res.status(200).json(new ApiResponse(200,deleteLike,"like removed successFully"));
     }
       
})

// toggle comment Like
const toggleCommentLike = AsyncHandler(async(req,res)=>{

    const userId = req.user?._id;
    if(!userId) throw new ApiError(400, " unauthorised user ");
     const {commentId} = req.params;
     if(!commentId.trim()) throw new ApiError(404,"commentId is not available at the moment");
     if(!mongoose.Types.ObjectId.isValid(commentId)) throw new ApiError(500,"invalid tweet Id");
   // check for current status
   const isContentLiked = await isCommentLiked (req,commentId);
    if(!isContentLiked){
       const like = await Like.create({
        comments:commentId,
           owner:userId
       })
       if(!like) throw new ApiError(500,"something went wrong in Like tweet");
       return res.status(200).json( new ApiResponse(200, like ,"comment liked successfully"));
    }
    else if(isContentLiked) {
       // delete existing like 
       const deleteLike = await Like.findOneAndDelete({
           owner:userId,
           comments:commentId
       });
       if(!deleteLike) throw new ApiError(500,"sosmething went wrong in remove like from video");
       return res.status(200).json(new ApiResponse(200,deleteLike,"like removed successFully"));
    }

})
 //TODO: get lists of all liked comments
 // TODO: get list of all liked Tweets
export {
    toggleTweetLike ,toggleCommentLike
}