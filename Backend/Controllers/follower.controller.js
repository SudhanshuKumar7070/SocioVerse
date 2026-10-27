import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import mongoose from "mongoose";
import { Follower } from "../Models/followers.model.js";
import { User } from "../Models/user.model.js";
import { getGlobalNamespace } from "../server/globalNameSpace.js";
import { Notification } from "../Models/notification.model.js";

// Follow a user
const followUser = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "unauthorised access");

  const { followingId } = req.params;
  if (!followingId) throw new ApiError(400, "following id is required");
  if (!mongoose.Types.ObjectId.isValid(followingId))
    throw new ApiError(400, "invalid following id");

  // Cannot follow self
  if (userId.toString() === followingId.toString()) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  // Check if target user exists
  const targetUser = await User.findById(followingId).select("fullName userName isPrivate");
  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  // Check if user is already following
  const isFollowing = await Follower.findOne({
    Follower: userId,
    Following: new mongoose.Types.ObjectId(followingId),
  });

  if (isFollowing) {
    return res
      .status(200)
      .json(new ApiResponse(200, isFollowing, "already following the user"));
  }

  const newFollower = await Follower.create({
    Follower: userId,
    Following: followingId,
  });

  if (!newFollower) {
    throw new ApiError(500, "unable to follow the user at the moment");
  }

  // Sender details for notification
  const senderUser = await User.findById(userId).select(
    "fullName userName profilePicture"
  );

  // Create notification
  const newFollowerNotification = await Notification.create({
    content: `${senderUser?.fullName || senderUser?.userName || "Someone"} started following you`,
    sender: userId,
    receiver: followingId,
    service: "follow",
    sourceId: userId,
    sourceModel: "User",
  });

  // Emit real-time notification via Socket.IO
  const globalNameSpace = getGlobalNamespace();
  if (globalNameSpace) {
    globalNameSpace.to(followingId.toString()).emit("FollowRequest", {
      newFollowerNotification,
      sender: senderUser,
      message: `${senderUser?.fullName || senderUser?.userName || "Someone"} started following you`,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newFollower, "user followed successfully"));
});

// Unfollow a user
const unfollowUser = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "unauthorised access");

  const followingId = req.params.followingId || req.params.userId;
  if (!followingId) throw new ApiError(400, "following id is required");
  if (!mongoose.Types.ObjectId.isValid(followingId))
    throw new ApiError(400, "invalid following id");

  const unfollowedUser = await Follower.findOneAndDelete({
    Follower: userId,
    Following: new mongoose.Types.ObjectId(followingId),
  });

  if (!unfollowedUser) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "you are not following the user"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, unfollowedUser, "user unfollowed successfully"));
});

// Get all followers of any user
const getAllFollowers = AsyncHandler(async (req, res) => {
  const loginId = req.user?._id;
  if (!loginId) throw new ApiError(401, "unauthorised access");

  const userId = req.params.userId ? req.params.userId.trim() : "";
  if (!userId) throw new ApiError(400, "user id is required");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new ApiError(400, "invalid user id");

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "user not found");

  const followers = await Follower.aggregate([
    {
      $match: {
        Following: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "Follower",
        foreignField: "_id",
        as: "followerUser",
      },
    },
    { $unwind: "$followerUser" },
    {
      $project: {
        _id: "$followerUser._id",
        fullName: "$followerUser.fullName",
        userName: "$followerUser.userName",
        profilePicture: "$followerUser.profilePicture",
        createdAt: "$createdAt",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, followers || [], "followers fetched successfully"));
});

// Get all followings of any user
const getAllFollowings = AsyncHandler(async (req, res) => {
  const loginId = req.user?._id;
  if (!loginId) throw new ApiError(401, "unauthorised access");

  const userId = req.params.userId ? req.params.userId.trim() : "";
  if (!userId) throw new ApiError(400, "user id is required");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new ApiError(400, "invalid user id");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "user not found");

  const followings = await Follower.aggregate([
    {
      $match: {
        Follower: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "Following",
        foreignField: "_id",
        as: "followingUser",
      },
    },
    { $unwind: "$followingUser" },
    {
      $project: {
        _id: "$followingUser._id",
        fullName: "$followingUser.fullName",
        userName: "$followingUser.userName",
        profilePicture: "$followingUser.profilePicture",
        createdAt: "$createdAt",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, followings || [], "followings fetched successfully")
    );
});

// Get all followers of logged-in user
const getALlFollowersOfLoggedInUser = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "unauthorised access");

  const followers = await Follower.aggregate([
    {
      $match: {
        Following: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "Follower",
        foreignField: "_id",
        as: "followerUser",
      },
    },
    { $unwind: "$followerUser" },
    {
      $project: {
        _id: "$followerUser._id",
        fullName: "$followerUser.fullName",
        userName: "$followerUser.userName",
        profilePicture: "$followerUser.profilePicture",
        createdAt: "$createdAt",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, followers || [], "followers fetched successfully"));
});

// Get all followings of logged-in user
const getAllFollowingsOfLoggedInUser = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "unauthorised access");

  const followings = await Follower.aggregate([
    {
      $match: {
        Follower: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "Following",
        foreignField: "_id",
        as: "followingUser",
      },
    },
    { $unwind: "$followingUser" },
    {
      $project: {
        _id: "$followingUser._id",
        fullName: "$followingUser.fullName",
        userName: "$followingUser.userName",
        profilePicture: "$followingUser.profilePicture",
        createdAt: "$createdAt",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, followings || [], "followings fetched successfully")
    );
});

// Check if the logged-in user is following another user
const isFolllowingUser = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "unauthorised access");

  const { followingId } = req.params;
  if (!followingId) throw new ApiError(400, "following id is required");
  if (!mongoose.Types.ObjectId.isValid(followingId)) {
    throw new ApiError(400, "invalid following id");
  }

  const isFollowing = await Follower.findOne({
    Follower: userId,
    Following: new mongoose.Types.ObjectId(followingId),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { isFollowing: Boolean(isFollowing) },
      isFollowing ? "following the user" : "not following the user"
    )
  );
});

export {
  followUser,
  unfollowUser,
  getAllFollowers,
  getAllFollowings,
  getALlFollowersOfLoggedInUser,
  getAllFollowingsOfLoggedInUser,
  isFolllowingUser,
};
