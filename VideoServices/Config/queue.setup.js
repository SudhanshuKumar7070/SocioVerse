import { exec } from "child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync } from "fs";
import { supabase, uploadContent } from "./supabase.setup.js";
import path from "path";
// import { bucket } from './firebaseDb.setup.js';
import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { ReelVideo } from "../Db/Schema/videoSchema.js";
import { videoTrancodingDLQ } from "./DLQ.setup.js";
import ffmpegPath from "ffmpeg-static";

export const QueueConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
  retryStrategy(times) {
    if (times > 10) {
      console.log('❌ Redis (Queue): max reconnection attempts reached, stopping retries');
      return null;
    }
    return Math.min(times * 200, 5000);
  },
});

let hasQueueConnected = false;
QueueConnection.on("ready", () => {
  if (!hasQueueConnected) {
    console.log('✅ Connected to Redis (Queue) successfully');
    hasQueueConnected = true;
  }
});
QueueConnection.on("error", (err) => console.log('❌ Redis (Queue) error:', err.message));

export const videoQueue = new Queue("videoQueue", {
  connection: QueueConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: true,
    removeOnFail: true,
  },
});
export const queueEvents = new QueueEvents("videoQueue", {
  connection: QueueConnection,
});

queueEvents.on("progress", ({ jobId, data }) =>
  console.log(` Job ${jobId} progress:`, data),
);

// Helper: promisify exec so the worker can properly await FFmpeg
const execAsync = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout, stderr });
    });
  });

export const videoTranscoder = new Worker(
  "videoQueue",
  async (job) => {
    const { localVideoPath, lessonId, title } = job.data;
    const hlsLocalDir = `Public/temp/output/${lessonId}`;
    const remoteFolder = `videos/${lessonId}`;

    // 1. Ensure local HLS directory exists
    if (!existsSync(hlsLocalDir)) mkdirSync(hlsLocalDir, { recursive: true });

    // 2. Run FFmpeg (using ffmpeg-static so it works on Render too)
    const playlistLocal = path.join(hlsLocalDir, "index.m3u8");
    const ffmpegBin = ffmpegPath || "ffmpeg";
    const ffmpegCmd = `"${ffmpegBin}" -i "${localVideoPath}" -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${hlsLocalDir}/segment%03d.ts" -start_number 0 "${playlistLocal}"`;

    // Await FFmpeg — this ensures BullMQ knows if the job succeeds or fails
    await execAsync(ffmpegCmd);
    console.log("FFmpeg completed successfully");

    // 3. Upload segments to Supabase
    const segmentFiles = readdirSync(hlsLocalDir).filter((f) =>
      f.endsWith(".ts"),
    );

    for (const segmentName of segmentFiles) {
      const localSegmentPath = path.join(hlsLocalDir, segmentName);
      const segmentData = readFileSync(localSegmentPath);
      const supaBaseResponse = await uploadContent(
        segmentData,
        `${remoteFolder}/${segmentName}`,
      );

      if (!supaBaseResponse)
        throw new Error(
          "Something went wrong uploading segment to Supabase",
        );
    }

    // 4. Upload playlist to Supabase
    const playlistData = readFileSync(playlistLocal);
    const remotePlaylistResponse = await uploadContent(
      playlistData,
      `${remoteFolder}/stream.m3u8`,
    );

    if (!remotePlaylistResponse)
      throw new Error("Playlist file not uploaded accurately");
    console.log("Remote playlist uploaded:", remotePlaylistResponse);

    // 5. Get public URL and save metadata
    const { data } = supabase.storage
      .from("socioVerse_videoStreaming")
      .getPublicUrl(`${remoteFolder}/stream.m3u8`);

    const videoUrl = data.publicUrl;
    console.log(
      "this will be the public url for video playing ::",
      videoUrl,
    );

    const newVideo = await ReelVideo.create({
      title,
      originalFileName: localVideoPath,
      hlsPath: videoUrl,
    });

    console.log("Video uploaded with HLS URL:", videoUrl);

    unlinkSync(localVideoPath);
    console.log("Local video deleted");
    console.log("Database record created:", newVideo._id);
  },
  { connection: QueueConnection },
);

videoTranscoder.on("failed", async (job, error) => {
  if (job.attemptsMade === job.opts.attempts) {
    console.log(
      "job retries exhausted, moving to DLQ. Job id:",
      job.id,
      "Error:",
      error,
    );
    await videoTrancodingDLQ.add("failed-video", {
      originalJobId: job.id,
      data: job.data,
      error: error.message,
      failedAt: new Date(),
    });
  }
});
