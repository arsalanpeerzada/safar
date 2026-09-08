'use client';

import { useStore } from '@/store';
import { motion } from 'framer-motion';

const PRESETS = [
  { id: 1, label: 'TAPE A' },
  { id: 2, label: 'TAPE B' },
  { id: 3, label: 'FM 100' },
  { id: 4, label: 'FM 89' },
] as const;

export function RadioPresets() {
  const { currentPreset, setPreset } = useStore();

  return (
    <div className="bg-black/30 backdrop-blur-md border border-white/20 p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4">
      <div className="flex-1 flex justify-between space-x-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setPreset(preset.id as any)}
            className="relative flex flex-col items-center justify-center w-full h-16 rounded-xl border border-white/10 overflow-hidden group transition-all"
          >
            {/* 3D button effect */}
            <div className={`absolute inset-0 transition-colors ${
              currentPreset === preset.id 
                ? 'bg-gradient-to-b from-orange-500/80 to-red-600/80' 
                : 'bg-gradient-to-b from-white/10 to-white/5 hover:from-white/20 hover:to-white/10'
            }`} />
            
            {/* Active Indicator Light */}
            <div className={`absolute top-2 w-2 h-2 rounded-full ${
              currentPreset === preset.id ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-neutral-600'
            }`} />

            <span className="relative z-10 text-xs font-bold tracking-wider uppercase mt-3 text-white/90">
              {preset.label}
            </span>
            <span className="absolute bottom-1 left-2 text-[10px] text-white/30 font-mono">
              0{preset.id}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
