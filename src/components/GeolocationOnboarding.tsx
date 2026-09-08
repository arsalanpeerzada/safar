'use client';

import { useEffect, useState } from 'react';
import { useStore, VibeType } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

function mapCoordinatesToVibe(lat: number, lng: number): VibeType {
  // Rough bounding boxes for Pakistani vibes
  if (lat > 32) return 'karakoram'; // North (KPK, Gilgit)
  if (lat > 29 && lat <= 32) return 'gt-road'; // Punjab
  if (lng < 67 && lat < 26) return 'makran'; // Balochistan coast
  if (lat > 25.5 && lat <= 29) return 'sehwan'; // Interior Sindh
  return 'w11'; // Karachi / Default South
}

export function GeolocationOnboarding() {
  const { setVibe, setStarted } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [status, setStatus] = useState<'idle' | 'locating' | 'done'>('idle');

  const startJourney = () => {
    setStatus('locating');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const vibe = mapCoordinatesToVibe(position.coords.latitude, position.coords.longitude);
          setVibe(vibe);
          finish();
        },
        (error) => {
          console.warn('Geolocation denied or failed:', error);
          setVibe('w11'); // Default fallback
          finish();
        },
        { timeout: 5000 }
      );
    } else {
      setVibe('w11');
      finish();
    }
  };

  const finish = () => {
    setStarted();
    setStatus('done');
    setTimeout(() => setIsVisible(false), 800);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <div className="text-center max-w-md p-6">
            <div className="flex justify-center mb-6">
              <img 
                src="/assets/vibes/logo_transparent.png" 
                alt="Safar Logo" 
                className="w-32 h-32 object-contain drop-shadow-2xl"
              />
            </div>
            <p className="text-white/70 mb-8 text-sm">
              Experience the distinct transport cultures of Pakistan. 
              Share your location so we can drop you into the right vibe, or jump straight into the journey.
            </p>
            
            <button
              onClick={startJourney}
              disabled={status !== 'idle'}
              className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center justify-center w-full space-x-2 hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              <MapPin size={18} />
              <span>{status === 'idle' ? 'Find My Vibe' : 'Locating...'}</span>
            </button>

            <button
              onClick={() => {
                setVibe('w11');
                finish();
              }}
              className="mt-4 text-xs text-white/50 hover:text-white transition-colors underline"
            >
              Skip and start in Karachi
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
