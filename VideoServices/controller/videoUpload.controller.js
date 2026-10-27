import { videoQueue } from "../Config/queue.setup.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { ReelVideo } from "../Db/Schema/videoSchema.js";
import { User } from "../Db/Schema/userSchema.js"; // Ensure User model is registered for populate

// Converting video to HLS via job queue
export const processVideo = (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }

    const { title, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const localVideoPath = req.file?.path;
    if (!localVideoPath) {
      return res.status(400).json({ success: false, message: "Video file is required" });
    }

    const lessonId = uuidv4();
    const outputPath = `./Public/temp/output/${lessonId}`;
    const hlsPath = `${outputPath}/index.m3u8`;

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    videoQueue.add(
      "videoFile",
      {
        userId,
        localVideoPath,
        outputPath,
        hlsPath,
        lessonId,
        title: title.trim(),
        description: description ? description.trim() : "",
      },
      {
        delay: 2000,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Video uploaded and queued for processing",
      lessonId,
    });
  } catch (error) {
    return next(error);
  }
};

// Fetch created video URLs (public feed with pagination & populated owner metadata)
export const fetchReelVideo = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 5));
    const skip = (page - 1) * limit;

    const totalVideos = await ReelVideo.countDocuments();
    const videos = await ReelVideo.find()
      .populate("userId", "userName fullName profilePicture email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedVideos = videos.map((v) => {
      const obj = v.toObject ? v.toObject() : v;
      const user = obj.userId;
      const rawUsername = user?.userName || "creator";
      const cleanUsername = rawUsername.replace(/^@+/, "");
      return {
        ...obj,
        owner: {
          _id: user?._id || null,
          username: cleanUsername,
          fullName: user?.fullName || cleanUsername,
          profilePic: user?.profilePicture || "/default-avatar.png",
          followers: 0,
        },
        likesCount: Array.isArray(obj.likes) ? obj.likes.length : 0,
        dislikesCount: Array.isArray(obj.dislikes) ? obj.dislikes.length : 0,
        commentsCount: Array.isArray(obj.comments) ? obj.comments.length : 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      data: formattedVideos,
      pagination: {
        page,
        limit,
        total: totalVideos,
        hasMore: skip + videos.length < totalVideos,
      },
    });
  } catch (error) {
    return next(error);
  }
};
