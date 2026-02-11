import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import mongoose from "mongoose";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Like } from "../Models/likes.model.js";
import { Tweet } from "../Models/tweet.model.js";
import { Comment } from "../Models/comment.model.js";

const isTweetLiked =  async(req,tweetId)=>{
  const loginId = req.user?._id;
  const currentLike = await Like.findOne({
    owner:loginId,
    tweets: new mongoose.Types.ObjectId(tweetId)
  })
  if(!currentLike) return false
  return true;
}

// utility function check is comment like
const isCommentLiked =  async(req,commentId)=>{
    const loginId = req.user._id;
    const currentLike = await Like.findOne({
      owner:loginId,
      comments: new mongoose.Types.ObjectId(commentId)
    })
    if(!currentLike) return false
    return true;
  }

//  method to add like and remove like from the tweet

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
        return res.status(200).json({data:like, message:"tweet like successfully" , status:"likeAdded"});
     }
     else if(isContentLiked) {
        // delete existing like 
        const deleteLike = await Like.findOneAndDelete({
            owner:userId,
            tweets:tweetId
        });
        if(!deleteLike) throw new ApiError(500,"sosmething went wrong in remove like from video");
         return res.status(200).json({data:deleteLike, message:"tweet like removed  successfully" , status:"likeRemoved"});
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
const IsCurrentTweetOrCommentLiked = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(400, "Unauthorized user");

  const commentId = req.params.commentId?.trim();
  const tweetId = req.params.tweetId?.trim();
  const id = commentId || tweetId;

  if (!id) throw new ApiError(400, "Either commentId or tweetId is required");
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid ID format");

  const queryKey = commentId ? "comments" : "tweets";

  const likeStatus = await Like.findOne({
    owner: userId,
    [queryKey]: new mongoose.Types.ObjectId(id),
  });
  return res.status(200).json({ liked: Boolean(likeStatus) });
});
 //TODO: get lists of all liked comments
 // TODO: get list of all liked Tweets
export {
    toggleTweetLike ,toggleCommentLike, IsCurrentTweetOrCommentLiked
}