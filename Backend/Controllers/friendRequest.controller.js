import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { getGlobalNamespace } from "../server/globalNameSpace.js";
import { FriendRequest } from "../Models/friendRequest.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Friend } from "../Models/friends.model.js";
import { Notification } from "../Models/notification.model.js";
import { User } from "../Models/user.model.js";
import { inAppNotificationQueue } from "../Config/Queue.config.js";
import { pushNotificationQueue } from "../Config/Queue.config.js";
// function for checking the users are already friends or not
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
  if (!areFriends) return false;
  return true;
};

//send friend request
const sendFriendRequest = AsyncHandler(async (req, res) => {
  // const globalNameSpace = getGlobalNamespace();
  const senderId = req.user?._id;
  if (!senderId)
    throw new ApiError(
      402,
      "you need to login first , to send friend request to your friend ",
    );
  const { receiverId } = req.params;
  const convertedReceiverId = new mongoose.Types.ObjectId(receiverId);
  if (!receiverId.trim())
    throw new ApiError(400, "receiver id not available at the moment");
  if (!mongoose.Types.ObjectId.isValid(receiverId))
    throw new ApiError(500, "invalid receiver id");

  // checking if they already are friends or not if are friends , they will not be allowed bo friend
  const areFriends = await checkForFriends(senderId, receiverId);
  if (areFriends) throw new ApiError(500, "you both are already friends");
  const session = await mongoose.startSession();
  try {
    //  session.startTransaction();
    const [friendRequest] = await FriendRequest.create(
      [
        {
          senderId: senderId,
          receiverId: convertedReceiverId,
        },
      ],
      //  { session },
    );
    // const [newNotification] = await Notification.create(
    //   [
    //     {
    //       content: `you have a friend request`,
    //       sender: senderId,
    //       receiver: friendRequest?.receiverId,
    //       service: "friendRequest",
    //       friendRequestId: friendRequest?._id,
    //     },
    //   ],
    //   { session },
    // );
    // await session.commitTransaction();
    // const receiverRoom = friendRequest?.receiverId.toString();
    // globalNameSpace
    //   .to(receiverRoom)
    //   .emit("friend_request_notification", { newNotification, friendRequest });

    // globalNameSpace
    //   .to(friendRequest.receiverId)
    //   .emit("friend_request", { friendRequest });

    /** --- implementing queue system for sending notification */
    inAppNotificationQueue.add("sendNotification", {
      senderId: senderId,
      receiverId: convertedReceiverId,
      content: `you have a friend request`,
      service: "friendRequest",
      sourceId: friendRequest?._id,
      sourceModel: "FriendRequest",
      receiverChannel: friendRequest?.receiverId.toString(),
      eventName: "friend_request_notification",
      payload: friendRequest,
    });
  pushNotificationQueue.add("pushNotificationQueue",{
    senderId:senderId,
    receiverId:convertedReceiverId,
    content: `you have a friend request`,
    service: "friendRequest",
     sourceId: friendRequest?._id,
     sourceModel: "FriendRequest",
     payload: friendRequest,
  })
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          friendRequest: friendRequest,
          // notification: newNotification,
        },
        "request created successfully",
      ),
    );
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

// ******accept friend request **** */
const acceptFriendRequest = AsyncHandler(async (req, res) => {
  const globalNameSpace = getGlobalNamespace();
  const userId = req.user?._id;
  if (!userId) throw new ApiError(402, "unauthorised action");

  const { friendRequestId } = req.params;
  if (!friendRequestId.trim())
    throw new ApiError(400, "request id not available at the moment");
  if (!mongoose.Types.ObjectId.isValid(friendRequestId))
    throw new ApiError(500, "invalid request id");
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const acceptedRequest = await FriendRequest.findByIdAndUpdate(
      new mongoose.Types.ObjectId(friendRequestId),
      {
        $set: {
          status: "accepted",
        },
      },
      {
        new: true,
        session,
      },
    );
    if (acceptedRequest.receiverId.toString() === userId.toString()) {
      const [newFriends] = await Friend.create(
        [
          {
            initialUser: acceptedRequest?.senderId,
            addedUser: userId,
          },
        ],
        { session },
      );
      const addUser1contact = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            contacts: acceptedRequest?.senderId,
          },
        },
        { session },
      );
      const addUser2contact = await User.findByIdAndUpdate(
        acceptedRequest?.senderId,
        {
          $push: {
            contacts: userId,
          },
        },
        { session },
      );
      const [friendRequestAcceptedNotification] = await Notification.create(
        [
          {
            sender: userId,
            receiver: acceptedRequest?.senderId,
            content: "friend requested accepted  ...!",
            service: "friendRequestAccept",
          },
        ],
        { session },
      );
      await session.commitTransaction();
      const acceptFriensRequestChannel = acceptedRequest?.senderId.toString();
      globalNameSpace
        .to(acceptFriensRequestChannel)
        .emit("friend_request_acceptd_notofication", {
          friendRequestAcceptedNotification,
        });
      globalNameSpace
        .to(acceptedRequest?.senderId)
        .emit("friend_request_acceptd", { friendRequestData: acceptedRequest });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            requestStatus: acceptedRequest
              ? "accepted"
              : "not-accepted or rejected",
            friendRequestData: acceptedRequest,
            friend: newFriends,
          },
          "friend request accepted successFully",
        ),
      );
    } else {
      throw new ApiError(400, "you are not authorised to accept this request");
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
  }
});
// check if the request is accepted or not
const checkIsFriendRequestAccepted = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(402, "unauthorised action");
  const friendRequestId = req.params;
  if (!friendRequestId.trim() || mongoose.Types.ObjectId(friendRequestId))
    throw new ApiError(500, "invalid friendRequest id");
  const currentRequestStatus = await FriendRequest.findById(
    new mongoose.Types.ObjectId(friendRequestId),
  )?.status;
  if (!currentRequestStatus)
    throw new ApiError(500, "problem in checking status at the moment");
  return res
    .status(200)
    .json(
      new ApiResponse(200, currentRequestStatus, "status fetched succssfully!"),
    );
});

// get all friend requests
const getAllFriendRequest = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(402, "you need to login first");
  // we have to fetch friend requests to only loggedin user
  const requests = await FriendRequest.aggregate([
    {
      $match: {
        receiverId: userId,
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
        userName: { $arrayElemAt: ["$senderData.userName", 0] },
        profilePicture: { $arrayElemAt: ["$senderData.profilePicture", 0] },
        userId: { $arrayElemAt: ["$senderData._id", 0] },
      },
    },
    {
      $sort: {
        createsAt: -1,
      },
    },
  ]);
  if (!requests || requests.length <= 0)
    throw new ApiError(400, "friend requests are not avilabe ");
  return res
    .status(200)
    .json(
      new ApiResponse(200, requests, "friend requests fetched successfully"),
    );
});

// reject friend request ..
const rejectFriendRequest = AsyncHandler(async (req, res) => {
  const globalNameSpace = getGlobalNamespace();
  const userId = req.user?._id;
  if (!userId) throw new ApiError(402, "user is not logged in");
  const { friendRequestId } = req.params;
  if (
    !friendRequestId.trim() ||
    !mongoose.Types.ObjectId.isValid(friendRequestId)
  )
    throw new ApiError(400, "invalid friendRequetId");
  const usableId = new mongoose.Types.ObjectId(friendRequestId);
  const rejectectedFriendrequest = await FriendRequest.findByIdAndUpdate(
    usableId,
    {
      $set: {
        status: "denied",
      },
    },
    {
      new: true,
    },
  );
  if (!rejectectedFriendrequest)
    throw new ApiError(500, "error in rejecting friendRequest");
  const rejectionNotification = await Notification.create({
    content: " user rejected your friend Request",
    sender: userId,
    receiver: rejectectedFriendrequest?.senderId,
    service: "friendRequestReject",
    friendRequestId: rejectectedFriendrequest?._id,
  });
  if (!rejectionNotification)
    throw new ApiError(500, "unable to send reject notification at the moment");
  const notificationChannel = rejectionNotification?.receiver.toString();
  globalNameSpace
    .to(notificationChannel)
    .emit("rejected_friend_request", { rejectionNotification });
  res
    .status(200)
    .json(
      new ApiResponse(200, rejectFriendRequest, "request rejected successfuly"),
    );
});

export {
  sendFriendRequest,
  acceptFriendRequest,
  checkIsFriendRequestAccepted,
  getAllFriendRequest,
  rejectFriendRequest,
};
