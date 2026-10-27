import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";
import { Notification } from "../Models/notification.model.js";
import mongoose from "mongoose";

// Change status from read false to true
const updateIsRead = AsyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  if (!notificationId?.trim()) throw new ApiError(400, "missing notification id");
  if (!mongoose.Types.ObjectId.isValid(notificationId))
    throw new ApiError(400, "invalid mongoose id");

  const isLoggedIn = req.user?._id;
  if (!isLoggedIn) throw new ApiError(401, "authentication required");

  const notification = await Notification.findByIdAndUpdate(
    new mongoose.Types.ObjectId(notificationId),
    {
      $set: {
        isRead: true,
      },
    },
    {
      new: true,
    }
  );

  if (!notification)
    throw new ApiError(404, "unable to find or update notification");

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "updated successfully"));
});

// Get all notifications for current user
const getAllUserNotifications = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "you need to login first");

  const notifications = await Notification.find({ receiver: userId , isRead:false })
    .populate("sender", "fullName userName profilePicture")
    .sort({ createdAt: -1 })
    .limit(60);

  return res.status(200).json(
    new ApiResponse(
      200,
      notifications || [],
      "all notifications fetched successfully"
    )
  );
});

// Get friend request notifications
const getFriendRequestNotification = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "you need to login first");

  const notifications = await Notification.find({
    receiver: userId,
    service: {
      $in: ["friendRequest", "friendRequestAccept", "friendRequestReject"],
    },
  })
    .populate("sender", "fullName userName profilePicture")
    .sort({ createdAt: -1 })
    .limit(50);

  return res.status(200).json(
    new ApiResponse(
      200,
      notifications || [],
      "friend request notifications fetched successfully"
    )
  );
});

// Get chat notifications
const getChatNotification = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "you need to login first");

  const chatNotifications = await Notification.aggregate([
    {
      $match: {
        isRead: false,
        receiver: userId,
        service: "chatMessage",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $project: {
        userName: { $arrayElemAt: ["$userDetails.userName", 0] },
        fullName: { $arrayElemAt: ["$userDetails.fullName", 0] },
        profilePicture: { $arrayElemAt: ["$userDetails.profilePicture", 0] },
        content: 1,
        receiver: 1,
        createdAt: 1,
        updatedAt: 1,
        conversationId: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      chatNotifications || [],
      "chat notifications fetched successfully"
    )
  );
});

// Get tweet notifications
const getTweetNotification = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "you need to login first");

  const tweetNotifications = await Notification.find({
    receiver: userId,
    service: { $in: ["tweetNotification", "tweetLike", "tweetComment", "tweetRetweet"] },
  })
    .populate("sender", "fullName userName profilePicture")
    .sort({ createdAt: -1 })
    .limit(50);

  return res.status(200).json(
    new ApiResponse(
      200,
      tweetNotifications || [],
      "tweet notifications fetched successfully"
    )
  );
});

export {
  updateIsRead,
  getAllUserNotifications,
  getFriendRequestNotification,
  getChatNotification,
  getTweetNotification,
};
