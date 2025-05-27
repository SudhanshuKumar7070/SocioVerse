import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import mongoose from "mongoose";
import { getGlobalNamespace } from "../server/globalNameSpace.js";
// import { Follower } from "../Models/followers.model.js";
// import { User } from "../Models/user.model.js";
import { Comment } from "../Models/comment.model.js";
import { Tweet } from "../Models/tweet.model.js";
import { Notification } from "../Models/notification.model.js";

const globalNameSpace = getGlobalNamespace();
const createComment = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) throw new ApiError(400, "unauthorised access");
  const { tweetId } = req.params;
  if (!tweetId) throw new ApiError(400, "tweet id is required");
  if (!mongoose.Types.ObjectId.isValid(tweetId))
    throw new ApiError(400, "invalid tweet id");
  const { content } = req.body;
  if (!content) throw new ApiError(400, "content is required");
  // check if tweet is present or not
  const isTweetPresent = await Tweet.findById(tweetId);
  if (!isTweetPresent) throw new ApiError(400, "tweet not found");
  // comment karne ke liye owner hone ki koi need nahi hai
  
  const comment = await Comment.create({
    owner: userId,
    content: content,
    tweet: tweetId,
  });

  if (!comment) throw new ApiError(400, "unable to create comment");
  const commmentNotification = await Notification.create(
    {
      content:"someone commented in your tweet",
      sender:userId,
      receiver:isTweetPresent?.owner,
      service:"tweet"
    }
  )
  if(!commmentNotification) throw new ApiError(500,"something went wrong in creating tweet message  ")
    globalNameSpace.emit("addedComment",{commmentNotification})
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment created successfully"));
});
// delete comment
const deleteTheComment = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) throw new ApiError(400, "unauthorised access");
  const { commentId } = req.params;
  if (!commentId) throw new ApiError(400, "comment id is required");
  if (!mongoose.Types.ObjectId.isValid(commentId))
    throw new ApiError(400, "invalid comment id");
  // check for availabliry and ownership of comment
  const isAvailable = await Comment.findById(commentId);
  if (!isAvailable) throw new ApiError(400, "comment not found");
  if (isAvailable.owner.toString() !== userId.toString())
    throw new ApiError(400, "you are not owner of the comment");

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment)
    throw new ApiError(400, "unable to delete comment at the moment");
  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "comment deleted successfully"));
});
const editComment = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) throw new ApiError(400, "unauthorised access");
  const { commentId } = req.params;
  if (!commentId) throw new ApiError(400, "comment id is required");
  if (!mongoose.Types.ObjectId.isValid(commentId))
    throw new ApiError(400, "invalid comment id");

  const { content } = req.body;
  if (!content) throw new ApiError(400, "content required");
  // check if comment is present or not
  const isCommentAvailabel = await Comment.findById(commentId);
  if (!isCommentAvailabel)
    throw new ApiError(400, "comment not found at moment");
  // checking if the user is owner or not
  if (isCommentAvailabel.owner.toString() !== userId.toString())
    throw new ApiError(400, "only owners can delete the comment");
  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: content,
      },
    },
    {
      new: true,
    }
  );
  if (!updateComment)
    throw new ApiError((400, "unable to update comment at the moment"));
  return res
    .status(200)
    .json(new ApiError(200, updateComment, "comment update at the moment"));
});
//  get all comments of tweet
 const getAllCommentsofTweets = AsyncHandler(async (req,res)=>{
     const userId = req.user._id;
     if(!userId) throw new ApiError(400,"unauthorised access")
    
        const {tweetId} = req.params;
        if(!tweetId) throw new ApiError(400,"tweet id is required")
        if(!mongoose.Types.ObjectId.isValid(tweetId)) throw new ApiError(400,"invalid tweet id")
            
        // check if tweet is present or not
          const  comments = await Comment.aggregate([{
           $match:{
               tweet:new mongoose.Types.ObjectId(tweetId)
           }
          },{
            $sort:{
              createdAt:-1
            }
          }])
          // const comments = await Comment.findOne({tweet:new mongoose.Types.ObjectId(tweetId)});
            if(!comments || comments.length === 0) throw new ApiError(400," no comments available");
            return res.status(200).json(new ApiResponse(200,comments,"comments fetched successfully"));
         })
  

export { createComment, deleteTheComment , editComment , getAllCommentsofTweets };
