'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  playing: boolean;
  volume: number;
  onEnded: () => void;
  onError: () => void;
  onProgress: (progress: { playedSeconds: number, duration: number }) => void;
}

export interface YouTubePlayerRef {
  seekTo: (seconds: number) => void;
  getDuration: () => number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(({ 
  videoId, playing, volume, onEnded, onError, onProgress 
}, ref) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (playerRef.current && isReady) {
        playerRef.current.seekTo(seconds, true);
      }
    },
    getDuration: () => {
      return (playerRef.current && isReady) ? playerRef.current.getDuration() : 0;
    }
  }));

  // Initialize YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const initPlayer = () => {
    if (!containerRef.current) return;
    
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        autoplay: playing ? 1 : 0,
        controls: 0,
        disablekb: 1,
        origin: window.location.origin,
        playsinline: 1
      },
      events: {
        onReady: (e: any) => {
          setIsReady(true);
          e.target.setVolume(volume * 100);
          if (playing) e.target.playVideo();
        },
        onStateChange: (e: any) => {
          // YT.PlayerState: 0 = ended, 1 = playing
          if (e.data === 0) onEnded();
          if (e.data === 1) {
            if (progressInterval.current) clearInterval(progressInterval.current);
            progressInterval.current = setInterval(() => {
              if (playerRef.current?.getCurrentTime && playerRef.current?.getDuration) {
                onProgress({ 
                  playedSeconds: playerRef.current.getCurrentTime(),
                  duration: playerRef.current.getDuration() 
                });
              }
            }, 1000);
          } else {
            if (progressInterval.current) clearInterval(progressInterval.current);
          }
        },
        onError: (e: any) => {
          // Error 150/101 means the music label blocked embedding.
          // We use console.warn instead of console.error to prevent the Next.js dev overlay from popping up.
          console.warn("YouTube Player blocked this video (Error code):", e.data);
          onError();
        }
      }
    });
  };

  // Watch for play/pause toggle
  useEffect(() => {
    if (!playerRef.current || !isReady) return;
    if (playing) {
      playerRef.current.playVideo?.();
    } else {
      playerRef.current.pauseVideo?.();
    }
  }, [playing, isReady]);

  // Watch for track change
  useEffect(() => {
    if (!playerRef.current || !isReady) return;
    if (videoId) {
       playerRef.current.loadVideoById?.(videoId);
       if (playing) playerRef.current.playVideo?.();
    }
  }, [videoId, isReady]);

  // Watch for volume change (e.g. horn ducking)
  useEffect(() => {
    if (!playerRef.current || !isReady) return;
    playerRef.current.setVolume?.(volume * 100);
  }, [volume, isReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Wrap in a parent div to prevent React "removeChild" errors 
  // when YouTube API replaces the inner div with an iframe.
  return (
    <div className="w-full h-full pointer-events-none">
      <div ref={containerRef} />
    </div>
  );
});
