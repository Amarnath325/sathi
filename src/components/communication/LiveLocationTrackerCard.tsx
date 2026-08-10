'use client';

import React from 'react';
import { MapPin, Navigation, Clock, CheckCircle } from 'lucide-react';

interface LiveLocationTrackerCardProps {
  companionName: string;
  distanceMeters: number;
  etaMinutes: number;
  venueName: string;
}

export default function LiveLocationTrackerCard({
  companionName,
  distanceMeters,
  etaMinutes,
  venueName,
}: LiveLocationTrackerCardProps) {
  const isArrived = distanceMeters <= 50;

  return (
    <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/80 border border-indigo-500/40 p-4 space-y-3 shadow-xl text-left">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Navigation className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">Live Arrival & Distance Radar</h4>
            <p className="text-[10px] text-indigo-300 font-mono">{companionName} Live Location</p>
          </div>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
          isArrived ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
        }`}>
          {isArrived ? 'ARRIVED AT VENUE' : 'EN ROUTE'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-[9px] text-slate-500 uppercase font-mono">Distance to Venue</span>
          <p className="text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {distanceMeters} Meters
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-[9px] text-slate-500 uppercase font-mono">Estimated Arrival</span>
          <p className="text-sm font-extrabold text-indigo-300 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {isArrived ? 'Now' : `${etaMinutes} Mins`}
          </p>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
        <span className="text-slate-400 font-mono text-[10px]">Venue Meeting Location:</span>
        <span className="font-bold text-white truncate max-w-[170px]">{venueName}</span>
      </div>

      {isArrived && (
        <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-center gap-1.5 font-bold">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> Companion has arrived at hotel lobby!
        </div>
      )}
    </div>
  );
}
