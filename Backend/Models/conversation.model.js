import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"
const conversationSchema = new mongoose.Schema({
  isGroup: {
    type: Boolean,
    default: false
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  lastMessage: {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message" 
    },
    message: {
      type: String
    },
    timestamp: {
      type: Date, 
      default: Date.now
    }
  }
},{timestamps:true});
conversationSchema.plugin(aggregatePaginate);
export const Conversation = mongoose.model("conversation", conversationSchema);
