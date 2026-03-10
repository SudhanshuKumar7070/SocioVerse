import mongoose, { Schema } from "mongoose";

const tokenUserSchema = new mongoose.Schema(
  {
    fcmToken: {
      type: String,
      required: true,
      unique: true,
    },
    device: {
      type: String,
      required: true,
    },
    deviceName: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lastActive: Date,
  },
  { timestamps: true },
);

export const TokenUser = mongoose.model("tokenUser", tokenUserSchema);
