import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { getGlobalNamespace } from "../server/globalNameSpace.js";
import { FriendRequest } from "../Models/friendRequest.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Friend } from "../Models/friends.model.js";
import { Notification } from "../Models/notification.model.js";
import { User } from "../Models/user.model.js";

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
  const globalNameSpace = getGlobalNamespace();
  const senderId = req.user?._id;
  if (!senderId)
    throw new ApiError(
      "you need to login first , to send friend request to your friend "
    );
  const { receiverId } = req.params;
  if (!receiverId.trim())
    throw new ApiError(400, "receiver id not available at the moment");
  if (!mongoose.Types.ObjectId.isValid(receiverId))
    throw new ApiError(500, "invalid receiver id");

  // checking if they already are friends or not if are friends , they will not be allowed bo friend
  const areFriends = await checkForFriends(senderId, receiverId);
  if (areFriends) throw new ApiError(500, "you both are already friends");
  const friendRequest = await FriendRequest.create({
    senderId: senderId,
    receiverId: new mongoose.Types.ObjectId(receiverId),
  });
  if (!friendRequest)
    throw new ApiError(500, "somethong went wrong in creating friend request");
  const newNotification = await Notification.create({
    content: `you have a friend request`,
    sender: senderId,
    receiver: friendRequest?.receiverId,
    service: "friendRequest",
    friendRequestId: friendRequest?._id,
  });
  if (!newNotification)
    throw new ApiError(
      400,
      "something went wrong in generating  friend request notification"
    );

  const receiverRoom = friendRequest?.receiverId.toString();
  globalNameSpace
    .to(receiverRoom)
    .emit("friend_request_notification", { newNotification, friendRequest });

  globalNameSpace
    .to(friendRequest.receiverId)
    .emit("friend_request", { friendRequest });

  // publisher.publish(
  //   "friend_request_channel",
  //   JSON.stringify({ data: friendRequest })
  // );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        friendRequest: friendRequest,
        notification: newNotification,
      },
      "request created successfully"
    )
  );
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
  const acceptedRequest = await FriendRequest.findByIdAndUpdate(
    new mongoose.Types.ObjectId(friendRequestId),
    {
      $set: {
        status: "accepted",
      },
    },
    {
      new: true,
    }
  );
  if (!acceptedRequest)
    throw new ApiError(500, "something went wrong in accept friend request");
  // // along with it marking is read of friendRequest user true after accepting the request as dono saath me ho raha hai
  // const markIsReadTrue = await Notification.findOneAndUpdate(
  //   {
  //     friendRequestId: friendRequestId,
  //   },
  //   {
  //     $set: {
  //       isRead: true,
  //     },
  //   },
  //   { new: true }
  // );
  // if (!markIsReadTrue)
  //   throw new ApiError("Unable to mark the notification readStatus");
  // create or update a friends document , ye kaam request accept hone par hogi
  const newFriends = await Friend.create({
    initialUser: acceptedRequest?.senderId, // jisne requsets bheja
    addedUser: userId, // jisko request bheja
  });
  if (!newFriends)
    throw new ApiError(500, "something went wrong in creating friends ");
  // add each other in each others contact;;
  const addUser1contact = await User.findByIdAndUpdate(userId, {
    $push: {
      contacts: acceptedRequest?.senderId,
    },
  });
  if (!addUser1contact)
    throw new ApiError(
      500,
      "something went wrong in adding  sender in your contact"
    );
  const addUser2contact = await User.findByIdAndUpdate(
    acceptedRequest?.senderId,
    {
      $push: {
        contacts: userId,
      },
    }
  );
  if (!addUser2contact)
    throw new ApiError(
      500,
      "something went wrong in adding you in sender's contact"
    );
  const friendRequestAcceptedNotification = await Notification.create({
    sender: userId,
    receiver: acceptedRequest?.senderId,
    content: "friend requested accepted  ...!",
    service: "friendRequestAccept",
  });
  if (!friendRequestAcceptedNotification)
    throw new ApiError(500, "unable to generate accepted requsest");
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
      "friend request accepted successFully"
    )
  );
});
// check if the request is accepted or not
const checkIsFriendRequestAccepted = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(402, "unauthorised action");
  const friendRequestId = req.params;
  if (!friendRequestId.trim() || mongoose.Types.ObjectId(friendRequestId))
    throw new ApiError(500, "invalid friendRequest id");
  const currentRequestStatus = await FriendRequest.findById(
    new mongoose.Types.ObjectId(friendRequestId)
  )?.status;
  if (!currentRequestStatus)
    throw new ApiError(500, "problem in checking status at the moment");
  return res
    .status(200)
    .json(
      new ApiResponse(200, currentRequestStatus, "status fetched succssfully!")
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
      new ApiResponse(200, requests, "friend requests fetched successfully")
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
    }
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
    res.status(200).json(new ApiResponse(200,rejectFriendRequest,"request rejected successfuly"))
});

export {
  sendFriendRequest,
  acceptFriendRequest,
  checkIsFriendRequestAccepted,
  getAllFriendRequest,
  rejectFriendRequest
};
