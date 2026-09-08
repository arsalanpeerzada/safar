'use client';

import { useStore, VIBE_DETAILS, VibeType } from '@/store';
import { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VibeSwitcher() {
  const { currentVibe, setVibe } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const vibes = Object.entries(VIBE_DETAILS) as [VibeType, typeof VIBE_DETAILS[VibeType]][];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 transition-all text-sm font-medium"
      >
        <MapPin size={16} className="text-yellow-400" />
        <span>{VIBE_DETAILS[currentVibe].name}</span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-0 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-2 flex flex-col space-y-1">
              {vibes.map(([key, detail]) => (
                <button
                  key={key}
                  onClick={() => {
                    setVibe(key);
                    setIsOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-xl transition-all ${
                    currentVibe === key ? 'bg-white/20 font-semibold' : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }`}
                >
                  <div className="text-sm">{detail.name}</div>
                  <div className="text-xs text-white/50 mt-1 line-clamp-1">{detail.description}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
