import { create } from 'zustand';

export type VibeType = 'w11' | 'gt-road' | 'karakoram' | 'makran' | 'sehwan';

export const VIBE_DETAILS: Record<VibeType, { name: string; background: string; description: string }> = {
  'w11': {
    name: 'W-11',
    background: '/assets/vibes/w11-bg.mp4',
    description: 'Vibrant neon lights, chamak patti, sea breeze, and bustling traffic.'
  },
  'gt-road': {
    name: 'GT Road Lari Adda',
    background: '/assets/vibes/gt-road-bg.mp4',
    description: 'Heavy truck art, dusty highway dhaba, and the roar of passing trucks.'
  },
  'karakoram': {
    name: 'Karakoram Truck',
    background: '/assets/vibes/karakoram-bg.mp4',
    description: 'Mountainous terrain, dangerous curves, and high altitude breeze.'
  },
  'makran': {
    name: 'Makran Coastal Cruiser',
    background: '/assets/vibes/makran-bg.mp4',
    description: 'Rugged jeep driving where the desert meets the ocean.'
  },
  'sehwan': {
    name: 'Sehwan Wagon',
    background: '/assets/vibes/sehwan-bg.mp4',
    description: 'Sufi mystique, journey to the shrine, desert dusk, and Ajrak motifs.'
  }
};

interface AppState {
  currentVibe: VibeType;
  setVibe: (vibe: VibeType) => void;
  
  // Ambient Sound Toggles
  ambientWind: boolean;
  ambientVehicle: boolean;
  ambientCrowd: boolean;
  ambientVendor: boolean;
  toggleAmbient: (type: 'wind' | 'vehicle' | 'crowd' | 'vendor') => void;

  // Radio Presets
  currentPreset: 1 | 2 | 3 | 4;
  setPreset: (preset: 1 | 2 | 3 | 4) => void;

  // Disruption
  isHornBlowing: boolean;
  setHorn: (blowing: boolean) => void;

  hasStarted: boolean;
  setStarted: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Default vibe, will be overridden by geolocation later
  currentVibe: 'w11', 
  setVibe: (vibe) => set({ currentVibe: vibe }),

  ambientWind: true, // Wind usually starts on
  ambientVehicle: true, // Vehicle engine on by default
  ambientCrowd: false,
  ambientVendor: false,
  toggleAmbient: (type) => set((state) => {
    switch(type) {
      case 'wind': return { ambientWind: !state.ambientWind };
      case 'vehicle': return { ambientVehicle: !state.ambientVehicle };
      case 'crowd': return { ambientCrowd: !state.ambientCrowd };
      case 'vendor': return { ambientVendor: !state.ambientVendor };
    }
  }),

  currentPreset: 1,
  setPreset: (preset) => set({ currentPreset: preset }),

  isHornBlowing: false,
  setHorn: (blowing) => set({ isHornBlowing: blowing }),

  hasStarted: false,
  setStarted: () => set({ hasStarted: true }),
}));
