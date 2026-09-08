'use client';

import { useStore } from '@/store';
import { Wind, Car, Users, Megaphone } from 'lucide-react';

export function AmbientToggles() {
  const { ambientWind, ambientVehicle, ambientCrowd, ambientVendor, toggleAmbient } = useStore();

  const toggles = [
    { id: 'wind', icon: Wind, label: 'Wind', state: ambientWind },
    { id: 'vehicle', icon: Car, label: 'Engine', state: ambientVehicle },
    { id: 'crowd', icon: Users, label: 'Crowd', state: ambientCrowd },
    { id: 'vendor', icon: Megaphone, label: 'Vendors', state: ambientVendor },
  ] as const;

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex flex-col space-y-4 shadow-lg">
      <div className="text-xs text-white/50 font-semibold tracking-widest text-center uppercase border-b border-white/10 pb-2 mb-2">
        Ambient Mix
      </div>
      
      {toggles.map((t) => (
        <button
          key={t.id}
          onClick={() => toggleAmbient(t.id as any)}
          className={`flex items-center justify-between p-2 rounded-xl transition-all ${
            t.state ? 'bg-white/10 text-white' : 'bg-transparent text-white/40 hover:text-white/70'
          }`}
          title={t.label}
        >
          <div className="flex items-center space-x-3">
            <t.icon size={18} className={t.state ? 'text-blue-400' : ''} />
            <span className="text-sm font-medium">{t.label}</span>
          </div>
          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${t.state ? 'bg-blue-500' : 'bg-white/20'}`}>
            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${t.state ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>
      ))}
    </div>
  );
}
