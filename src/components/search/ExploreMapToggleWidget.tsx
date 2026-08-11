'use client';

import React from 'react';
import { MapPin, Navigation, Radio, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CandidateMarker {
  id: string;
  name: string;
  avatar: string;
  city: string;
  distanceKm: number;
  hourlyRate: number;
  ratingAvg: number;
  isIdentityVerified: boolean;
}

interface ExploreMapToggleWidgetProps {
  candidates: CandidateMarker[];
}

export function ExploreMapToggleWidget({ candidates }: ExploreMapToggleWidgetProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
          <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" /> Live Geofence Satellite Radar Map
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
          Showing {candidates.length} Companions in Radius
        </span>
      </div>

      {/* Simulated Satellite Radar Map Area */}
      <div className="h-96 rounded-2xl bg-slate-950 border border-cyan-500/30 relative overflow-hidden flex items-center justify-center p-6">
        
        {/* Radar Concentric Circles */}
        <div className="w-80 h-80 rounded-full border border-cyan-500/20 absolute" />
        <div className="w-60 h-60 rounded-full border border-cyan-500/25 absolute" />
        <div className="w-40 h-40 rounded-full border border-cyan-500/30 absolute" />
        <div className="w-20 h-20 rounded-full border border-cyan-500/40 absolute animate-ping" />

        {/* Center User Pin */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white animate-bounce shadow-lg shadow-cyan-400/50" />
          <span className="text-[9px] font-mono font-bold bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">
            Your Location (Raipur Center)
          </span>
        </div>

        {/* Companion Markers on Radar */}
        {candidates.slice(0, 4).map((comp, idx) => {
          const positions = [
            'top-10 left-16',
            'top-16 right-20',
            'bottom-12 left-24',
            'bottom-16 right-16'
          ];
          const posClass = positions[idx % positions.length];

          return (
            <div key={comp.id} className={`absolute ${posClass} flex items-center gap-2 group cursor-pointer z-20`}>
              <div className="relative">
                <img
                  src={comp.avatar}
                  alt={comp.name}
                  className="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover shadow-lg group-hover:scale-110 transition-transform"
                />
                <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 absolute -bottom-0.5 -right-0.5" />
              </div>

              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-left font-mono text-[10px] space-y-0.5 shadow-xl">
                <strong className="text-white block">{comp.name}</strong>
                <span className="text-emerald-400 block font-bold">${comp.hourlyRate}/hr • {comp.distanceKm} km</span>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}
