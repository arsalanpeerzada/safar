'use client';

import { useStore, VIBE_DETAILS } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export function BackgroundManager() {
  const { currentVibe } = useStore();
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== 'AbortError') console.error('Video play error:', error);
        });
      }
    }
  }, [currentVibe]);

  if (!mounted) return <div className="absolute inset-0 bg-neutral-900" />;

  const bgSrc = VIBE_DETAILS[currentVibe].background;

  return (
    <div className="absolute inset-0 z-0 bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVibe}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* We programmatically play this via useEffect to safely catch AbortErrors during hot-reloads */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={(e) => e.currentTarget.play()}
            poster={bgSrc.replace('.mp4', '.jpg')}
            className="w-full h-full object-cover opacity-60"
          >
            <source src={bgSrc} type="video/mp4" />
          </video>
          {/* Fallback gradient if video is missing */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 mix-blend-multiply" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
