import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
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
        controlBar: {
          volumePanel: { inline: true },
          pictureInPictureToggle: false,
        },
        sources: [{
          src: src,
          type: 'application/x-mpegURL',
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

  useEffect(() => {
    if (playerRef.current && src && src.trim()) {
      playerRef.current.src([{
        src: src,
        type: 'application/x-mpegURL'
      }]);
    }
  }, [src]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black reel-video-container">
      <video
        ref={videoRef}
        className="video-js vjs-default-skin w-full h-full object-cover"
        playsInline
      />
      <style>{`
        .reel-video-container .video-js {
          background-color: #000;
          border-radius: 1rem;
          overflow: hidden;
        }
        .reel-video-container .video-js .vjs-big-play-button {
          display: none !important;
        }
        .reel-video-container .video-js .vjs-control-bar {
          background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent);
          border-radius: 0 0 1rem 1rem;
          height: 3.5em;
          padding: 0 0.5em;
        }
        .reel-video-container .video-js .vjs-play-progress,
        .reel-video-container .video-js .vjs-volume-level {
          background-color: #38bdf8;
        }
        .reel-video-container .video-js .vjs-slider {
          background-color: rgba(148, 163, 184, 0.25);
        }
        .reel-video-container .video-js .vjs-load-progress {
          background-color: rgba(56, 189, 248, 0.2);
        }
        .reel-video-container .video-js .vjs-load-progress div {
          background-color: rgba(56, 189, 248, 0.3);
        }
        .reel-video-container .video-js .vjs-time-control {
          font-size: 0.75em;
          color: #94a3b8;
        }
        .reel-video-container .video-js button.vjs-play-control,
        .reel-video-container .video-js .vjs-mute-control,
        .reel-video-container .video-js .vjs-fullscreen-control {
          color: #e2e8f0;
        }
        .reel-video-container .video-js button.vjs-play-control:hover,
        .reel-video-container .video-js .vjs-mute-control:hover,
        .reel-video-container .video-js .vjs-fullscreen-control:hover {
          color: #38bdf8;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
