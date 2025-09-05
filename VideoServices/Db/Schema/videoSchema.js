import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default:"",
    },
    originalFileName: {
      type:String,
      required: true,
    },
    hlsPath: {
      type: String, // e.g. "/static/hls/abc123/playlist.m3u8"
      required: true,
    },
    thumbnail: {
      type: String, // optional thumbnail path
      default: "",
    },
    duration: {
      type: String, // e.g. "00:15" or store as Number (seconds)
      // required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

export const ReelVideo = mongoose.model("ReelVideo", videoSchema);
