import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import mongoose from "mongoose";
import { Follower } from "../Models/followers.model.js";
import { User } from "../Models/user.model.js";
import { getGlobalNamespace } from "../server/globalNameSpace.js";
import { Notification } from "../Models/notification.model.js";
const followUser = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const globalNameSpace =getGlobalNamespace();
  if (!userId) throw new ApiError(400, "unauthorised access");
  const { followingId } = req.params;
  if (!followingId) throw new ApiError(400, "following id is required");
  if (!mongoose.Types.ObjectId.isValid(followingId))
    throw new ApiError(400, "invalid following id");
  // checking if user is already a follwer or not
  const isFollowing = await Follower.findOne({
    Follower: userId,
    Following:  new mongoose.Types.ObjectId(followingId) ,
  });
  if (isFollowing)
    throw new ApiError(500, "you are already following the user");
  const newFollower = await Follower.create({
    Follower: userId,
    Following: followingId,
  });
  if (!newFollower)
    throw new ApiError(500, "unable to follow the user at the moment");
    const newFollowerNotification = await Notification.create({
      content:"Someone follwed You ..",
      sender:req.user?._id,
      receiver:followingId,
       service:"followRequsetSent"
    })
    if(!newFollowerNotification) throw new ApiError(500, "unable to create notification at moment")
      globalNameSpace.to(followingId).emit("FollowRequest",{newFollowerNotification})
  return res
    .status(200)
    .json(new ApiResponse(200, newFollower, "user followed successfully"));
});

const unfollowUser = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) throw new ApiError(400, "unauthorised access");
  const { followingId } = req.params;
  if (!followingId) throw new ApiError(400, "following id is required");
  if (!mongoose.Types.ObjectId.isValid(followingId))
    throw new ApiError(400, "invalid following id");
  // checking if user is already a follwer or not
  const isFollowing = await Follower.findOne({
    Followers: userId,
    Following: followingId,
  });
  if (!isFollowing) throw new ApiError(500, "you are not following the user");
  const unfollowedUser = await Follower.findByIdAndDelete(isFollowing._id);
  if (!unfollowedUser)
    throw new ApiError(500, "unable to unfollow the user at the moment");
  return res
    .status(200)
    .json(new ApiResponse(200, unfollowedUser, "user unfollowed successfully"));
});

//  get all followers  of any public user

const getAllFollowers = AsyncHandler(async (req, res) => {
  const loginId = req.user._id;
  if (!loginId) throw new ApiError(400, "unauthorised access");
  const { userId } = req.params;
  if (!userId.trim()) throw new ApiError(400, "user id is required");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new ApiError(400, "invalid user id");
  // check if user is available or not and if available then check if user is private or not
  const user = await User.findById(userId);
  if (!user) throw new ApiError(400, "user not found");
  if (user.isPrivate) {
    throw new ApiError(400, "user is private you can't see the followers");
  }
  const followers = await Follower.aggregate([
    {
      $match: {
        Following: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "Followers",
        foreignField: "_id",
        as: "FollowerList",
      },
    },
    {
      $project: {
        FollowersList: 1,
      },
    },
  ]);
  if (!followers || followers.length === 0)
    throw new ApiError(400, "no followers available");
  return res
    .status(200)
    .json(new ApiResponse(200, followers, "followers fetched successfully"));
});
//get all followings of any public user
const getAllFollowings = AsyncHandler(async (req, res) => {
  const loginId = req.user._id;
  if (!loginId) throw new ApiError(400, "unauthorised access");
  const { userId } = req.params;
  if (!userId.trim()) throw new ApiError(400, "user id is required");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new ApiError(400, "invalid user id");
  // check if user is available or not and if available then check if user is private or not
  const user = await User.findById(userId);
  if (!user) throw new ApiError(400, "user not found");
  if (user.isPrivate) {
    throw new ApiError(
      400,
      "user is private you can't see the followings of the user"
    );
  }
  const followings = await Follower.aggregate([
    {
      $match: {
        Followers: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "Following",
        foreignField: "_id",
        as: "FollowingList",
      },
    },
    {
      $project: {
        FollowingList: 1,
      },
    },
  ]);
  if (!followings || followings.length === 0)
    throw new ApiError(400, "no followings available");
  return res
    .status(200)
    .json(new ApiResponse(200, followings, "followings fetched successfully"));
});
// get all followers of logged in user
const getALlFollowersOfLoggedInUser = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) throw new ApiError(400, "unauthorised access");
  const followers = await Follower.aggregate([
    {
      $match: {
        Following: userId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "Followers",
        foreignField: "_id",
        as: "FollowerList",
      },
    },
    {
      $project: {
        FollowerList: 1,
      },
    },
  ]);
  if (!followers || followers.length === 0)
    throw new ApiError(400, "no followers available");
  return res
    .status(200)
    .json(new ApiResponse(200, followers, "followers fetched successfully"));
});

//    get all folllowings of logged in user

const getAllFollowingsOfLoggedInUser = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) throw new ApiError(400, "unauthorised access");
  const followings = await Follower.aggregate([
    {
      $match: {
        Followers: userId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "Following",
        foreignField: "_id",
        as: "FollowingList",
      },
    },
    {
      $project: {
        FollowingList: 1,
      },
    },
  ]);
  if (!followings || followings.length === 0)
    throw new ApiError(400, "no followings available");
  return res
    .status(200)
    .json(new ApiResponse(200, followings, "followings fetched successfully"));
});

//check if the logged in user is following the user or not --> for togelling of follow button

const isFolllowingUser = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) throw new ApiError(400, "unauthorised access");
  const { followingId } = req.params;
  if (!followingId) throw new ApiError(400, "following id is required");
  const isFollowing = await Follower.findOne({
    Followers: userId,
    Following: followingId,
  });
  if (!isFollowing)
    return res
      .status(201)
      .json(new ApiResponse(200, false, "not following the user"));
  return res.status(200).json(new ApiResponse(200, true, "following the user"));
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
