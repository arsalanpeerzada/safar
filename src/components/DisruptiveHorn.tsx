'use client';

import { useStore } from '@/store';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function DisruptiveHorn() {
  const { setHorn } = useStore();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onPointerDown={() => setHorn(true)}
      onPointerUp={() => setHorn(false)}
      onPointerLeave={() => setHorn(false)}
      className="group relative w-24 h-24 bg-red-600 rounded-full shadow-[0_10px_0_rgb(153,27,27),_0_15px_20px_rgba(0,0,0,0.5)] border-4 border-red-400 flex flex-col items-center justify-center overflow-hidden transition-transform active:translate-y-2 active:shadow-[0_2px_0_rgb(153,27,27),_0_5px_10px_rgba(0,0,0,0.5)]"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
      <Volume2 size={32} className="text-white mb-1 group-active:scale-110 transition-transform" />
      <span className="text-[10px] font-black text-white uppercase tracking-tighter text-center leading-tight drop-shadow-md">
        Dekh Magar<br/>Pyar Se
      </span>
    </motion.button>
  );
}
