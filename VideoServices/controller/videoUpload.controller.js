import { videoQueue } from "../Config/queue.setup.js"
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { ReelVideo } from "../Db/Schema/videoSchema.js";

// converting video to hls

export const processVideo = (req, res) => {
  const { title, description } = req.body;
  if (!title.trim()) throw new Error("title is required");


  const localVideoPath = req.file.path;
  if (!localVideoPath) throw new Error("file not uploaded");

  const lessonId = uuidv4();
  const outputPath = `./Public/temp/output/${lessonId}`;
  const hlsPath = `${outputPath}/index.m3u8`;
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  videoQueue.add(
    "videoFile",
    {
      localVideoPath: localVideoPath,
      outputPath,
      hlsPath,
      lessonId,
      title: title,
      description,
    },
    {
      delay: 2000,
    }
  );
  //  const ffmpegCommand = ffmpeg -i ${videoPath} -codec:v
  // libx264 -codec:a aac -hls_time 10 -hls_playlist_type
  // vod -hls_segment_filename "${outputPath}/segment%03d.
  // ts" -start_number 0 ${hlsPath}
  //  these commands are very difficult to execute at main serever itself  ,for executing such commands queue systems are setup ,where
  // video uploaded by user get stored at queue and video gets processed and stored at given url itself

  res.status(200).json({ message: "success", lessonId: lessonId });
};
//  fetch created video url
export const fetchReelVideo = async (req, res) => {
  const video = await ReelVideo.find();
  if (!video) throw new Error("something went wrong in fetching video");
  return res.status(200).json({
    message: "video found",
    data: video,
  });
};
