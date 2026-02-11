import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
// import { use } from 'video.js/dist/types/tech/middleware';
 import 'video.js/dist/video-js.css';

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = videoRef.current;

      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: true,
        muted: true,
        loop: true,
        fluid: true,
        preload: 'auto',
        sources: [{
          src: src,
          type: 'application/x-mpegURL', // for .m3u8
        }],
      });

      playerRef.current.on('error', () => {
        console.error('Video.js error:', playerRef.current.error());
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

   useEffect(()=>{
      if( videoRef.current || src.trim()){
        
      // Update the source
      playerRef.current.src([{
        src: src,
        type: 'application/x-mpegURL'
      }]);
     videoRef.current.load();
      }
 },[src])
  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <video
      
        ref={videoRef}
        className="video-js vjs-default-skin w-full h-full object-cover"
        playsInline

      />
    </div>
  );
};

export default VideoPlayer;
