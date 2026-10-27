import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { getGlobalNamespace } from "../server/globalNameSpace.js";
import { FriendRequest } from "../Models/friendRequest.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Friend } from "../Models/friends.model.js";
import { Notification } from "../Models/notification.model.js";
import { User } from "../Models/user.model.js";
import { inAppNotificationQueue, pushNotificationQueue } from "../Config/Queue.config.js";

// function for checking if the users are already friends
const checkForFriends = async (sender, receiver) => {
  const areFriends = await Friend.findOne({
    $or: [
      {
        initialUser: new mongoose.Types.ObjectId(sender),
        addedUser: new mongoose.Types.ObjectId(receiver),
      },
      {
        initialUser: new mongoose.Types.ObjectId(receiver),
        addedUser: new mongoose.Types.ObjectId(sender),
      },
    ],
  });
  return Boolean(areFriends);
};

// send friend request
const sendFriendRequest = AsyncHandler(async (req, res) => {
  const senderId = req.user?._id;
  if (!senderId) {
    throw new ApiError(401, "You need to login first to send a friend request");
  }

  const { receiverId } = req.params;
  if (!receiverId || !receiverId.trim()) {
    throw new ApiError(400, "Receiver ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new ApiError(400, "Invalid receiver ID format");
  }

  if (senderId.toString() === receiverId.toString()) {
    throw new ApiError(400, "You cannot send a friend request to yourself");
  }

  const receiverUser = await User.findById(receiverId).select("fullName userName profilePicture");
  if (!receiverUser) {
    throw new ApiError(404, "Receiver user not found");
  }

  // checking if they are already friends
  const areFriends = await checkForFriends(senderId, receiverId);
  if (areFriends) {
    throw new ApiError(400, "You both are already friends");
  }

  // Check if a friend request is already pending between them
  const existingPendingRequest = await FriendRequest.findOne({
    $or: [
      { senderId: senderId, receiverId: receiverId, status: "pending" },
      { senderId: receiverId, receiverId: senderId, status: "pending" },
    ],
  });

  if (existingPendingRequest) {
    if (existingPendingRequest.senderId.toString() === senderId.toString()) {
      throw new ApiError(400, "Friend request is already pending for this user");
    } else {
      throw new ApiError(400, "This user has already sent you a friend request. Check your notifications to accept it.");
    }
  }

  // If there was an old denied request from sender to receiver, reset it to pending; otherwise create new
  let friendRequest = await FriendRequest.findOne({
    senderId: senderId,
    receiverId: receiverId,
  });

  if (friendRequest) {
    friendRequest.status = "pending";
    await friendRequest.save();
  } else {
    friendRequest = await FriendRequest.create({
      senderId: senderId,
      receiverId: new mongoose.Types.ObjectId(receiverId),
      status: "pending",
    });
  }

  // Prepare sender info for notifications
  const senderUser = await User.findById(senderId).select("fullName userName profilePicture");
  const senderName = senderUser?.fullName || senderUser?.userName || "Someone";
  const notificationContent = `${senderName} sent you a friend request`;

  // Queue system for in-app and push notification
  const jobPayload = {
    senderId: senderId.toString(),
    receiverId: receiverId.toString(),
    content: notificationContent,
    service: "friendRequest",
    sourceId: friendRequest._id.toString(),
    sourceModel: "FriendRequest",
    receiverChannel: receiverId.toString(),
    eventName: "friend_request_notification",
    payload: friendRequest,
  };

  try {
    await inAppNotificationQueue.add("sendNotification", jobPayload);
  } catch (queueErr) {
    console.warn("inAppNotificationQueue error, using direct DB and socket emission fallback:", queueErr.message);
    try {
      const fallbackNotification = await Notification.create({
        content: notificationContent,
        sender: senderId,
        receiver: receiverId,
        service: "friendRequest",
        sourceId: friendRequest._id,
        sourceModel: "FriendRequest",
      });
      await fallbackNotification.populate("sender", "fullName userName profilePicture");

      const globalNameSpace = getGlobalNamespace();
      if (globalNameSpace) {
        globalNameSpace.to(receiverId.toString()).emit("friend_request_notification", {
          notification: fallbackNotification,
          friendRequest,
          sender: senderUser,
          content: notificationContent,
        });
      }
    } catch (fallbackErr) {
      console.error("Direct notification fallback failed:", fallbackErr);
    }
  }

  try {
    await pushNotificationQueue.add("pushNotificationQueue", {
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
      content: notificationContent,
      service: "friendRequest",
      sourceId: friendRequest._id.toString(),
      sourceModel: "FriendRequest",
      payload: friendRequest,
    });
  } catch (pushErr) {
    console.warn("pushNotificationQueue error (ignored):", pushErr.message);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { friendRequest },
      "Friend request sent successfully",
    ),
  );
});

// accept friend request
const acceptFriendRequest = AsyncHandler(async (req, res) => {
  const globalNameSpace = getGlobalNamespace();
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized action");

  const { friendRequestId } = req.params;
  if (!friendRequestId || !friendRequestId.trim())
    throw new ApiError(400, "Friend request ID is required");
  if (!mongoose.Types.ObjectId.isValid(friendRequestId))
    throw new ApiError(400, "Invalid friend request ID format");

  const existingRequest = await FriendRequest.findById(friendRequestId);
  if (!existingRequest) {
    throw new ApiError(404, "Friend request not found");
  }

  if (existingRequest.receiverId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to accept this friend request");
  }

  if (existingRequest.status === "accepted") {
    return res.status(200).json(
      new ApiResponse(
        200,
        { requestStatus: "accepted", friendRequestData: existingRequest },
        "Friend request is already accepted",
      ),
    );
  }

  // Update status to accepted
  existingRequest.status = "accepted";
  const acceptedRequest = await existingRequest.save();

  // Create friend relationship if not already exists
  let friendDoc = await Friend.findOne({
    $or: [
      { initialUser: acceptedRequest.senderId, addedUser: userId },
      { initialUser: userId, addedUser: acceptedRequest.senderId },
    ],
  });

  if (!friendDoc) {
    friendDoc = await Friend.create({
      initialUser: acceptedRequest.senderId,
      addedUser: userId,
    });
  }

  // Add each other to contacts without duplicates ($addToSet)
  await User.findByIdAndUpdate(userId, {
    $addToSet: { contacts: acceptedRequest.senderId },
  });
  await User.findByIdAndUpdate(acceptedRequest.senderId, {
    $addToSet: { contacts: userId },
  });

  // Get accepting user details for notification
  const currentUser = await User.findById(userId).select("fullName userName profilePicture");
  const senderName = currentUser?.fullName || currentUser?.userName || "Someone";
  const notificationContent = `${senderName} accepted your friend request`;

  // Create acceptance notification
  const friendRequestAcceptedNotification = await Notification.create({
    sender: userId,
    receiver: acceptedRequest.senderId,
    content: notificationContent,
    service: "friendRequestAccept",
    sourceId: acceptedRequest._id,
    sourceModel: "FriendRequest",
  });

  await friendRequestAcceptedNotification.populate("sender", "fullName userName profilePicture");

  // Emit real-time events to the request sender
  const senderChannel = acceptedRequest.senderId.toString();
  if (globalNameSpace) {
    const notifPayload = {
      notification: friendRequestAcceptedNotification,
      friendRequestAcceptedNotification,
      friendRequestData: acceptedRequest,
      sender: currentUser,
    };
    // Emit both standard and legacy event names (legacy has typo for backwards compatibility)
    globalNameSpace.to(senderChannel).emit("friend_request_acceptd_notofication", notifPayload);
    globalNameSpace.to(senderChannel).emit("friend_request_accepted_notification", notifPayload);
    globalNameSpace.to(senderChannel).emit("friend_request_acceptd", { friendRequestData: acceptedRequest });
    globalNameSpace.to(senderChannel).emit("friend_request_accepted", { friendRequestData: acceptedRequest });
  }

  // Send push notification if configured
  try {
    await pushNotificationQueue.add("pushNotificationQueue", {
      senderId: userId.toString(),
      receiverId: acceptedRequest.senderId.toString(),
      content: notificationContent,
      service: "friendRequestAccept",
      sourceId: acceptedRequest._id.toString(),
      sourceModel: "FriendRequest",
      payload: acceptedRequest,
    });
  } catch (pushErr) {
    console.warn("pushNotificationQueue error on accept (ignored):", pushErr.message);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        requestStatus: "accepted",
        friendRequestData: acceptedRequest,
        friend: friendDoc,
      },
      "Friend request accepted successfully",
    ),
  );
});

// check if the request is accepted or not
const checkIsFriendRequestAccepted = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized action");

  const { friendRequestId } = req.params;
  if (!friendRequestId || !friendRequestId.trim() || !mongoose.Types.ObjectId.isValid(friendRequestId)) {
    throw new ApiError(400, "Invalid friend request ID format");
  }

  const friendRequest = await FriendRequest.findById(friendRequestId);
  if (!friendRequest) {
    throw new ApiError(404, "Friend request not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { status: friendRequest.status, friendRequest },
      "Status fetched successfully",
    ),
  );
});

// get all friend requests for logged-in user
const getAllFriendRequest = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "You need to login first");

  const requests = await FriendRequest.aggregate([
    {
      $match: {
        receiverId: new mongoose.Types.ObjectId(userId),
        status: "pending",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "senderId",
        foreignField: "_id",
        as: "senderData",
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        createdAt: 1,
        senderId: 1,
        receiverId: 1,
        userName: { $arrayElemAt: ["$senderData.userName", 0] },
        fullName: { $arrayElemAt: ["$senderData.fullName", 0] },
        profilePicture: { $arrayElemAt: ["$senderData.profilePicture", 0] },
        userId: { $arrayElemAt: ["$senderData._id", 0] },
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
      requests || [],
      "Friend requests fetched successfully",
    ),
  );
});

// reject friend request
const rejectFriendRequest = AsyncHandler(async (req, res) => {
  const globalNameSpace = getGlobalNamespace();
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "User is not logged in");

  const { friendRequestId } = req.params;
  if (!friendRequestId || !friendRequestId.trim() || !mongoose.Types.ObjectId.isValid(friendRequestId)) {
    throw new ApiError(400, "Invalid friend request ID format");
  }

  const existingRequest = await FriendRequest.findById(friendRequestId);
  if (!existingRequest) {
    throw new ApiError(404, "Friend request not found");
  }

  if (existingRequest.receiverId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to reject this friend request");
  }

  if (existingRequest.status === "denied") {
    return res.status(200).json(
      new ApiResponse(200, existingRequest, "Friend request already rejected"),
    );
  }

  existingRequest.status = "denied";
  const rejectedFriendRequest = await existingRequest.save();

  // Get rejecting user details for notification
  const currentUser = await User.findById(userId).select("fullName userName profilePicture");
  const senderName = currentUser?.fullName || currentUser?.userName || "Someone";
  const notificationContent = `${senderName} declined your friend request`;

  const rejectionNotification = await Notification.create({
    content: notificationContent,
    sender: userId,
    receiver: rejectedFriendRequest.senderId,
    service: "friendRequestReject",
    sourceId: rejectedFriendRequest._id,
    sourceModel: "FriendRequest",
  });

  await rejectionNotification.populate("sender", "fullName userName profilePicture");

  if (globalNameSpace) {
    const notifPayload = {
      notification: rejectionNotification,
      rejectionNotification,
      friendRequest: rejectedFriendRequest,
      sender: currentUser,
    };
    const targetChannel = rejectedFriendRequest.senderId.toString();
    globalNameSpace.to(targetChannel).emit("rejected_friend_request", notifPayload);
    globalNameSpace.to(targetChannel).emit("friend_request_rejected", notifPayload);
  }

  return res.status(200).json(
    new ApiResponse(200, rejectedFriendRequest, "Request rejected successfully"),
  );
});

export {
  sendFriendRequest,
  acceptFriendRequest,
  checkIsFriendRequestAccepted,
  getAllFriendRequest,
  rejectFriendRequest,
};
