'use client';

import { VibeSwitcher } from '@/components/VibeSwitcher';
import { LiveCounter } from '@/components/LiveCounter';
import { BackgroundManager } from '@/components/BackgroundManager';
import { AmbientToggles } from '@/components/AmbientToggles';
import { DisruptiveHorn } from '@/components/DisruptiveHorn';
import { MusicPlayer } from '@/components/MusicPlayer';
import { GeolocationOnboarding } from '@/components/GeolocationOnboarding';

import { useEffect } from 'react';

import { AmbientAudio } from '@/components/AmbientAudio';

export default function Home() {
  // God-tier fix: Globally patch the native play() method to silently swallow all AbortErrors at the source.
  // This physically prevents Next.js Turbopack from ever detecting an "Unhandled Promise Rejection" for media tags.
  useEffect(() => {
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      const playPromise = originalPlay.apply(this, arguments as any);
      if (playPromise !== undefined) {
        playPromise.catch((e: any) => {
          if (e.name !== 'AbortError') {
            console.error('Unhandled Media Error:', e);
          }
        });
      }
      return playPromise;
    };
    
    return () => {
      HTMLMediaElement.prototype.play = originalPlay;
    };
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* 1. Location-based onboarding (invisible logic or intro screen) */}
      <GeolocationOnboarding />

      {/* 2. Scenic Full-Screen Immersion */}
      <BackgroundManager />

      {/* Music and Audio Management */}
      <MusicPlayer />
      <AmbientAudio />

      {/* 3. Vibe Switcher (Left Side) */}
      <div className="absolute top-12 left-6 z-10 flex flex-col space-y-4 shadow-2xl">
        <div className="mb-2">
          <img 
            src="/assets/vibes/logo_transparent.png" 
            alt="Safar Logo" 
            className="w-24 h-24 object-contain drop-shadow-lg opacity-90"
          />
        </div>
        <LiveCounter />
        <VibeSwitcher />
      </div>

      {/* Right Side UI (Toggles and Horn) */}
      <div className="absolute top-12 right-6 z-10 flex flex-col items-end space-y-6">
        {/* 5. Ambient Sound Toggles */}
        <AmbientToggles />
        
        {/* 6. The Disruptive Horn Button */}
        <DisruptiveHorn />
      </div>

    </main>
  );
}
