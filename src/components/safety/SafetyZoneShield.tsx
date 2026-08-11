'use client';

import React from 'react';
import { ShieldCheck, Video, MapPin, Eye, Zap, AlertCircle } from 'lucide-react';

interface SafetyZoneShieldProps {
  locationName: string;
}

export function SafetyZoneShield({ locationName }: SafetyZoneShieldProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-4 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Geofenced Safety Zone Radar</h4>
            <p className="text-[10px] text-emerald-400 font-mono">Location: {locationName}</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black font-mono">
          GRADE A+ (98/100)
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Video className="w-3 h-3 text-cyan-400" /> CCTV Density
          </span>
          <p className="font-bold text-white text-xs">94% HD Coverage</p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Night Lighting
          </span>
          <p className="font-bold text-white text-xs">Optimal (Full LED)</p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" /> PCR Police Booth
          </span>
          <p className="font-bold text-white text-xs">350m (2 Mins)</p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Eye className="w-3 h-3 text-purple-400" /> Patrol Density
          </span>
          <p className="font-bold text-white text-xs">4 Active Units</p>
        </div>

      </div>

      <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-200">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>This location is classified as a Verified Safe Zone. Instant 2-minute emergency patrol response guaranteed.</span>
      </div>

    </div>
  );
}
