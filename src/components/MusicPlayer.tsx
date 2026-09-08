'use client';

import { useStore } from '@/store';
import { useEffect, useState, useRef } from 'react';
import { YouTubePlayer, YouTubePlayerRef } from './YouTubePlayer';
import { Play, Pause, SkipForward, SkipBack, ListMusic, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import tracklistData from '@/data/safar_tracks.json';

const TRACKLISTS = tracklistData as Record<string, { id: string, title: string, station: string }[]>;

const extractVideoId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export function MusicPlayer() {
  const { currentVibe, hasStarted, isHornBlowing } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  
  // Progress tracking
  const [played, setPlayed] = useState(0); 
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef<YouTubePlayerRef>(null);

  const currentTracks = TRACKLISTS[currentVibe] || [];
  const currentTrack = currentTracks[trackIndex];
  
  const isPlayable = currentTrack ? (currentTrack.id.includes('watch?v=') || currentTrack.id.includes('youtu.be/')) : false;
  const videoId = isPlayable && currentTrack ? extractVideoId(currentTrack.id) : null;

  useEffect(() => {
    const setHasStarted = useStore.getState().setStarted;
    const handleFirstInteraction = () => setHasStarted();
    window.addEventListener('click', handleFirstInteraction, { once: true });
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  useEffect(() => {
    if (hasStarted && currentTracks.length > 0) {
      setIsPlaying(true);
      setTrackIndex(0);
    }
  }, [currentVibe, hasStarted]);

  useEffect(() => {
    if (!hasStarted || currentTracks.length === 0) return;
    if (currentTrack && !isPlayable) {
      setTrackIndex((prev) => (prev + 1) % currentTracks.length);
    }
  }, [trackIndex, currentVibe, hasStarted, currentTracks]);

  const handleNextTrack = () => {
    if (currentTracks.length === 0) return;
    setTrackIndex((prev) => (prev + 1) % currentTracks.length);
  };

  const handlePrevTrack = () => {
    if (currentTracks.length === 0) return;
    setTrackIndex((prev) => (prev - 1 + currentTracks.length) % currentTracks.length);
  };

  const handleProgress = (state: { playedSeconds: number, duration: number }) => {
    if (!seeking && state.duration > 0) {
      setPlayed(state.playedSeconds / state.duration);
      setDuration(state.duration);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current && playerRef.current.getDuration) {
      const dur = playerRef.current.getDuration();
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value) * dur);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  // Split title for sleeker display (e.g. "Artist - Song" -> Artist, Song)
  const artistName = currentTrack?.title?.split('-')[0]?.trim() || currentTrack?.station || 'Unknown Artist';
  const songName = currentTrack?.title?.split('-')[1]?.trim() || currentTrack?.title || 'Selecting Frequency...';

  return (
    <>
      <div className="fixed inset-0 z-[-50] opacity-0 pointer-events-none">
        {videoId && (
          <YouTubePlayer
            ref={playerRef}
            videoId={videoId}
            playing={isPlaying && hasStarted}
            volume={isHornBlowing ? 0.2 : 1}
            onEnded={handleNextTrack}
            onError={handleNextTrack}
            onProgress={handleProgress}
          />
        )}
      </div>

      {hasStarted && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 max-w-[95vw] w-[640px]"
        >
          <AnimatePresence>
            {isPlaylistOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                className="w-full max-h-[380px] overflow-y-auto bg-[#2b1f1a]/90 backdrop-blur-3xl border border-white/10 rounded-[28px] p-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="flex flex-col gap-1 p-2">
                  {currentTracks.map((track, idx) => {
                    const tArtist = track.title.split('-')[0]?.trim() || track.station;
                    const tSong = track.title.split('-')[1]?.trim() || track.title;
                    const isActive = trackIndex === idx;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setTrackIndex(idx);
                          setIsPlaying(true);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                          isActive
                            ? 'bg-white/20 border border-white/20 shadow-inner'
                            : 'hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-mono w-4 text-left ${isActive ? 'text-white font-bold' : 'text-white/50'}`}>
                            {idx + 1}
                          </span>
                          <div className="flex flex-col items-start overflow-hidden text-left">
                            <span className={`text-sm font-medium truncate w-full ${isActive ? 'text-white' : 'text-white/80'}`}>
                              {tSong}
                            </span>
                            <span className={`text-xs truncate w-full ${isActive ? 'text-white/70' : 'text-white/50'}`}>{tArtist}</span>
                          </div>
                        </div>
                        {isActive && isPlaying && (
                          <div className="flex gap-1 shrink-0">
                            <div className="w-1 h-3 bg-white animate-pulse delay-75"></div>
                            <div className="w-1 h-4 bg-white animate-pulse delay-150"></div>
                            <div className="w-1 h-2 bg-white animate-pulse delay-300"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full h-[90px] bg-[#2b1f1a]/80 backdrop-blur-3xl border border-white/10 rounded-[45px] flex items-center pr-6 pl-3 py-3 gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
            {/* Very thin progress background strip at bottom edge */}
            <div 
              className="absolute bottom-0 left-0 h-[2px] bg-white/20 transition-all duration-300 ease-linear"
              style={{ width: `${played * 100}%` }}
            />

            <div className="relative group shrink-0">
              <div 
                className="w-[66px] h-[66px] rounded-full overflow-hidden border border-white/20 relative cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105 transition-all bg-black/50" 
                onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
              >
                {videoId ? (
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/default.jpg`}
                    className={`w-[140%] h-[140%] -ml-[20%] -mt-[20%] object-cover ${isPlaying ? 'animate-[spin_12s_linear_infinite]' : ''}`}
                    alt="Album Art"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5"><Radio className="text-white/20" /></div>
                )}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <ListMusic size={18} className="text-white mb-0.5" />
                   <span className="text-[8px] font-bold text-white uppercase tracking-wider">Playlist</span>
                </div>
              </div>
              
              {/* Suggestive bouncing cue on mobile/desktop */}
              {!isPlaylistOpen && (
                <div className="absolute -bottom-1 -right-1 bg-black/80 border border-white/20 shadow-lg rounded-full p-1.5 animate-bounce pointer-events-none">
                   <ListMusic size={12} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center overflow-hidden h-full pt-1">
               <h3 className="text-white font-medium truncate text-[15px] leading-tight">{songName}</h3>
               <p className="text-white/60 text-xs truncate mt-1 font-medium">{artistName}</p>
               
               <div className="flex items-center gap-3 mt-3 w-full">
                 <span className="text-[10px] font-mono text-white/50 w-8 text-right">{formatTime(played * duration)}</span>
                 <div className="flex-1 relative h-1 group flex items-center cursor-pointer">
                    <input 
                       type="range" min={0} max={0.999999} step="any" value={played || 0}
                       onMouseDown={() => setSeeking(true)} onChange={handleSeekChange} onMouseUp={handleSeekMouseUp}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden flex items-center">
                       <div className="h-full bg-white group-hover:bg-gray-300 transition-colors" style={{ width: `${played * 100}%` }} />
                    </div>
                 </div>
                 <span className="text-[10px] font-mono text-white/50 w-8 text-left">{formatTime(duration)}</span>
               </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 pl-2">
              <button onClick={handlePrevTrack} className="text-white/70 hover:text-white transition-colors active:scale-90">
                <SkipBack size={20} className="fill-current" />
              </button>
              <button 
                onClick={togglePlay} 
                className="w-[52px] h-[52px] bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                {isPlaying ? <Pause size={22} className="fill-black" /> : <Play size={22} className="fill-black ml-1" />}
              </button>
              <button onClick={handleNextTrack} className="text-white/70 hover:text-white transition-colors active:scale-90">
                <SkipForward size={20} className="fill-current" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
