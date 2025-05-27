import { ApiError } from "../Utils/ApiError.js";

import mongoose from "mongoose";
import { Conversation } from "../Models/conversation.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponse } from "../Utils/ApiResponse.js";


// fetch conversation 
const getConversation = AsyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  if (
    !conversationId.trim() ||
    !mongoose.Types.ObjectId.isValid(conversationId)
  )
    throw new ApiError(400, "invalid conversation id");

  const conversation = await Conversation.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(conversationId),
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "_id",
        foreignField: "conversationId",
        as: "conversationMessages",
      },
    },

    {
      $project: {
        conversationMessages: 1,
      },
    },
  ]);
  console.log("conversation resultant message::", conversation);

  if (conversation.length === 0)
    return res.status(404).json({ messages: "messages are not available" });
  return res
    .status(200)
    .json(
      new ApiResponse(200, conversation, "conversation fetched successfylly")
    );
});

export { getConversation };
