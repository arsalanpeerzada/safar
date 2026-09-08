'use client';

import { useStore } from '@/store';
import { useEffect, useRef } from 'react';

export function AmbientAudio() {
  const { ambientWind, ambientVehicle, ambientCrowd, ambientVendor, isHornBlowing, hasStarted } = useStore();

  const windRef = useRef<HTMLAudioElement>(null);
  const vehicleRef = useRef<HTMLAudioElement>(null);
  const crowdRef = useRef<HTMLAudioElement>(null);
  const vendorRef = useRef<HTMLAudioElement>(null);
  const hornRef = useRef<HTMLAudioElement>(null);

  // Sync Audio Playback with State
  useEffect(() => {
    if (!hasStarted) return;
    const playOrPause = (ref: React.RefObject<HTMLAudioElement | null>, isPlaying: boolean, volume: number = 0.5) => {
      if (ref.current) {
        ref.current.volume = volume;
        if (isPlaying) {
          ref.current.play().catch(e => {
            if (e.name !== 'AbortError') console.error('Audio play error:', e);
          });
        } else {
          ref.current.pause();
        }
      }
    };

    playOrPause(windRef, ambientWind, 0.4);
    playOrPause(vehicleRef, ambientVehicle, 0.3);
    playOrPause(crowdRef, ambientCrowd, 0.4);
    playOrPause(vendorRef, ambientVendor, 0.5);
    
    // Horn is special, it should restart if pressed again
    if (hornRef.current) {
      if (isHornBlowing) {
        hornRef.current.currentTime = 0;
        hornRef.current.volume = 1.0;
        hornRef.current.play().catch(e => {
            if (e.name !== 'AbortError') console.error('Horn play error:', e);
        });
      } else {
        // optionally let it ring out, or pause instantly. usually horn pauses instantly or has a short fade out.
        // Let's pause instantly for responsiveness.
        hornRef.current.pause();
      }
    }
  }, [ambientWind, ambientVehicle, ambientCrowd, ambientVendor, isHornBlowing, hasStarted]);

  return (
    <div className="fixed inset-0 z-[-100] opacity-0 pointer-events-none">
      <audio ref={windRef} src="/assets/audio/wind.mp3" loop />
      <audio ref={vehicleRef} src="/assets/audio/engine.mp3" loop />
      <audio ref={crowdRef} src="/assets/audio/crowd.mp3" loop />
      <audio ref={vendorRef} src="/assets/audio/vendor.mp3" loop />
      <audio ref={hornRef} src="/assets/audio/pressure-horn.mp3" />
    </div>
  );
}
