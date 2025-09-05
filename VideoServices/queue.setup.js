import { exec } from 'child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs'; // Added readFileSync
import { supabase, uploadContent } from './supabase.setup.js';
import path from 'path';
// import { bucket } from './firebaseDb.setup.js';
import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { ReelVideo } from './Db/Schema/videoSchema.js';

export const QueueConnection = new IORedis({ maxRetriesPerRequest: null });
export const videoQueue = new Queue('videoQueue', { connection: QueueConnection });
export const queueEvents = new QueueEvents('videoQueue', { connection: QueueConnection });

queueEvents.on('progress', ({ jobId, data }) =>
  console.log(`📊 Job ${jobId} progress:`, data)
);

export const videoTranscoder = new Worker(
  'videoQueue',
  async job => {
    const { localVideoPath, lessonId, title } = job.data;
    const hlsLocalDir = `Public/temp/output/${lessonId}`;
    const remoteFolder = `videos/${lessonId}`;
   
    // 1. Ensure local HLS directory exists
    if (!existsSync(hlsLocalDir)) mkdirSync(hlsLocalDir, { recursive: true });

    // 2. Run FFmpeg
    const playlistLocal = path.join(hlsLocalDir, 'index.m3u8');
    const ffmpegCmd = `ffmpeg -i "${localVideoPath}" -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${hlsLocalDir}/segment%03d.ts" -start_number 0 "${playlistLocal}"`;

    exec(ffmpegCmd, async (err, stdout, stderr) => {
      if (err) return console.error('FFmpeg error:', err);

      console.log('FFmpeg completed successfully');

      try {
        // 3. Upload segments to Supabase
        const segmentFiles = readdirSync(hlsLocalDir).filter(f => f.endsWith('.ts'));
        
        for (const segmentName of segmentFiles) {
          const localSegmentPath = path.join(hlsLocalDir, segmentName);
          
          // ✅ FIXED: Read file data and pass correct parameters
          const segmentData = readFileSync(localSegmentPath);
          const supaBaseResponse = await uploadContent(segmentData, `${remoteFolder}/${segmentName}`);
          
          if (!supaBaseResponse) throw new Error('Something went wrong uploading segment to Supabase');
          console.log('Video segment uploaded:', segmentName);
        }

        // 4. Upload playlist to Supabase
        // ✅ FIXED: Use the correct local playlist path
        const playlistData = readFileSync(playlistLocal);
        const remotePlaylistResponse = await uploadContent(playlistData, `${remoteFolder}/stream.m3u8`);
        
        if (!remotePlaylistResponse) throw new Error('Playlist file not uploaded accurately');
        console.log('Remote playlist uploaded:', remotePlaylistResponse);

        // 5. Get public URL and save metadata
        const { data } = supabase.storage
          .from('socioverse-videostreaming')
          .getPublicUrl(`${remoteFolder}/stream.m3u8`);
         
        const videoUrl = data.publicUrl;
        console.log('this will be the public url for video playing ::',videoUrl);
        
        const newVideo = await ReelVideo.create({ 
          title, 
          originalFileName: localVideoPath, 
          hlsPath: videoUrl 
        });
        
        console.log('Video uploaded with HLS URL:', videoUrl);
        console.log('Database record created:', newVideo._id);
        
      } catch (uploadError) {
        console.error('Upload or database error:', uploadError);
        throw uploadError;
      }
    });
  },
  { connection: QueueConnection }
);
