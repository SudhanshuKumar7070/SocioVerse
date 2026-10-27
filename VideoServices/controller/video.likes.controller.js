import mongoose from "mongoose";
import { ReelVideo } from "../Db/Schema/videoSchema.js";
import { User } from "../Db/Schema/userSchema.js"; // Ensure User model registered for population

// Like controller
const addLike = async (req, res, next) => {
  try {
    const userID = req.user?._id;
    if (!userID) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }

    const videoId = req.params?.videoId || req.params?.videoID;
    if (!videoId || !videoId.trim() || !mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ success: false, message: "Invalid video id!" });
    }

    // Remove dislike if exists and add like atomically
    const isLikeCreated = await ReelVideo.findByIdAndUpdate(
      videoId,
      {
        $pull: { dislikes: userID },
        $addToSet: { likes: userID },
      },
      { new: true }
    );

    if (!isLikeCreated) {
      return res.status(404).json({ success: false, message: "Unable to find video or create like" });
    }

    return res.status(200).json({
      success: true,
      message: "Video liked successfully",
      data: {
        likeCount: isLikeCreated.likes ? isLikeCreated.likes.length : 0,
        dislikeCount: isLikeCreated.dislikes ? isLikeCreated.dislikes.length : 0,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Method to show number of likes (public)
const showNumberOfLike = async (req, res, next) => {
  try {
    const videoId = req.params?.videoId || req.params?.videoID;
    if (!videoId || !videoId.trim() || !mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ success: false, message: "Invalid video id" });
    }

    const video = await ReelVideo.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found for current video id" });
    }

    const likeCount = video.likes ? video.likes.length : 0;
    return res.status(200).json({
      success: true,
      message: "Likes fetched successfully",
      likeCount,
    });
  } catch (error) {
    return next(error);
  }
};

// Dislike controller
const createDislike = async (req, res, next) => {
  try {
    const userID = req.user?._id;
    if (!userID) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }

    const videoId = req.params?.videoId || req.params?.videoID;
    if (!videoId || !videoId.trim() || !mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ success: false, message: "Invalid video id!" });
    }

    // Remove like if exists and add dislike atomically
    const isDislikeCreated = await ReelVideo.findByIdAndUpdate(
      videoId,
      {
        $pull: { likes: userID },
        $addToSet: { dislikes: userID },
      },
      { new: true }
    );

    if (!isDislikeCreated) {
      return res.status(404).json({ success: false, message: "Unable to find video or dislike video" });
    }

    return res.status(200).json({
      success: true,
      message: "Video disliked successfully",
      data: {
        likeCount: isDislikeCreated.likes ? isDislikeCreated.likes.length : 0,
        dislikeCount: isDislikeCreated.dislikes ? isDislikeCreated.dislikes.length : 0,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Method to show number of dislikes (public)
const showNumberOfDislikes = async (req, res, next) => {
  try {
    const videoId = req.params?.videoId || req.params?.videoID;
    if (!videoId || !videoId.trim() || !mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ success: false, message: "Invalid video id" });
    }

    const video = await ReelVideo.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found for current video id" });
    }

    const dislikeCount = video.dislikes ? video.dislikes.length : 0;
    return res.status(200).json({
      success: true,
      message: "Dislikes fetched successfully",
      dislikeCount,
    });
  } catch (error) {
    return next(error);
  }
};

// Add comment to video (requires auth)
const addVideoComment = async (req, res, next) => {
  try {
    const userID = req.user?._id;
    if (!userID) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }

    const videoId = req.params?.videoId || req.params?.videoID;
    if (!videoId || !videoId.trim() || !mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ success: false, message: "Invalid video id!" });
    }

    const { comment } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    const newComment = {
      userId: userID,
      comment: comment.trim(),
      timestamp: new Date(),
    };

    const updatedVideo = await ReelVideo.findByIdAndUpdate(
      videoId,
      { $push: { comments: newComment } },
      { new: true }
    ).populate("comments.userId", "userName fullName profilePicture");

    if (!updatedVideo) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    const createdComment = updatedVideo.comments[updatedVideo.comments.length - 1];

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        comment: createdComment,
        commentCount: updatedVideo.comments.length,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Get all comments for video (public)
const getVideoComments = async (req, res, next) => {
  try {
    const videoId = req.params?.videoId || req.params?.videoID;
    if (!videoId || !videoId.trim() || !mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ success: false, message: "Invalid video id" });
    }

    const video = await ReelVideo.findById(videoId)
      .select("comments")
      .populate("comments.userId", "userName fullName profilePicture");

    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: video.comments || [],
      count: video.comments ? video.comments.length : 0,
    });
  } catch (error) {
    return next(error);
  }
};

export {
  addLike,
  showNumberOfLike,
  createDislike,
  showNumberOfDislikes,
  addVideoComment,
  getVideoComments,
};
