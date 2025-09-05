import mongoose from "mongoose";
import { ReelVideo } from "../Db/Schema/videoSchema.js";

// like controller
const addLike = async (req, res) => {
  try {
    const userID = req.user?._id;
    if (!userID) return res.status(401).json({ message: "User authentication required" });

    const videoId = req.params?.videoID;
    if (!videoId || !videoId.trim() || !mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ message: "Invalid video id!" });
    }

    const usableId = mongoose.Types.ObjectId(videoId);

    // Remove dislike if exists and add like atomically
    const isLikeCreated = await ReelVideo.findByIdAndUpdate(
      usableId,
      {
        $pull: { dislikes: userID },
        $addToSet: { likes: userID },
      },
      { new: true }
    );

    if (!isLikeCreated) return res.status(404).json({ message: "Unable to create like for the video at the moment" });

    return res.status(200).json({
      message: "Video liked successfully",
      data: {
        likeCount: isLikeCreated.likes.length,
        dislikeCount: isLikeCreated.dislikes.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// method to show number of likes
const showNumberOfLike = async (req, res) => {
  try {
    // const userId = req.user?._id;---> not that necessary , to authorise the user for showing likes and dislikes 
    // if (!userId) return res.status(401).json({ message: "Authentication required to get likes count" });

    const videoId = req.params?.videoId;
    if (!videoId || !videoId.trim() || !mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ message: "Invalid video id" });
    }

    const usableId = mongoose.Types.ObjectId(videoId);
    const video = await ReelVideo.findById(usableId);
    if (!video) return res.status(404).json({ message: "Video not found for current video id" });

    const likeCount = video.likes.length;
    return res.status(200).json({ message: "Likes fetched successfully", likeCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// dislike controller
const createDislike = async (req, res) => {
  try {
    const userID = req.user?._id;
    if (!userID) return res.status(401).json({ message: "User authentication required" });

    const videoId = req.params.videoID;
    if (!videoId || !videoId.trim() || !mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ message: "Invalid video id!" });
    }

    const usableId = mongoose.Types.ObjectId(videoId);

    // Remove like if exists and add dislike atomically
    const isDislikeCreated = await ReelVideo.findByIdAndUpdate(
      usableId,
      {
        $pull: { likes: userID },
        $addToSet: { dislikes: userID },
      },
      { new: true }
    );

    if (!isDislikeCreated) return res.status(404).json({ message: "Unable to dislike the video, something went wrong" });

    return res.status(200).json({
      message: "Video disliked successfully",
      data: {
        likeCount: isDislikeCreated.likes.length,
        dislikeCount: isDislikeCreated.dislikes.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// method to show number of dislikes
const showNumberOfDislikes = async (req, res) => {
  try {
    // const userId = req.user?._id;
    // if (!userId) return res.status(401).json({ message: "Authentication required to get dislikes count" });

    const videoId = req.params?.videoId;
    if (!videoId || !videoId.trim() || !mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ message: "Invalid video id" });
    }

    const usableId = mongoose.Types.ObjectId(videoId);
    const video = await ReelVideo.findById(usableId);
    if (!video) return res.status(404).json({ message: "Video not found for current video id" });

    const dislikeCount = video.dislikes.length;
    return res.status(200).json({ message: "Dislikes fetched successfully", dislikeCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { addLike, showNumberOfLike, createDislike, showNumberOfDislikes };
