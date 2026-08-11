'use client';

import React, { useState, useEffect } from 'react';
import { X, Navigation, Radio, Phone, ShieldCheck, Clock, MapPin } from 'lucide-react';

interface SosDispatchRadarModalProps {
  userLocationName: string;
  alertRef: string;
  onClose: () => void;
}

export function SosDispatchRadarModal({ userLocationName, alertRef, onClose }: SosDispatchRadarModalProps) {
  const [etaSeconds, setEtaSeconds] = useState(105); // 1m 45s

  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds(prev => (prev > 10 ? prev - 1 : 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatEta = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Live Patrol Dispatch Radar</h3>
              <p className="text-[10px] text-rose-400 font-mono">REF: {alertRef}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Live ETA Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Patrol Unit Arrival ETA</span>
              <strong className="text-xl sm:text-2xl font-black text-rose-400">{formatEta(etaSeconds)}</strong>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block">Distance: <strong className="text-emerald-400">850m</strong></span>
              <span className="text-[10px] text-slate-400 block">Vehicle Speed: <strong className="text-cyan-400">42 km/h</strong></span>
            </div>
          </div>

          {/* Simulated Satellite Screen */}
          <div className="h-52 rounded-2xl bg-slate-950 border border-rose-500/30 relative overflow-hidden flex items-center justify-center p-4">
            <div className="w-40 h-40 rounded-full border border-rose-500/30 absolute animate-ping" />
            
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white animate-bounce" />
              <span className="text-[9px] font-mono font-bold bg-slate-900 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">
                You ({userLocationName})
              </span>
            </div>

            <div className="absolute top-8 right-12 flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[9px] font-mono text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/40">
                Patrol SUV #402 (Approaching)
              </span>
            </div>
          </div>

          {/* Officer Details */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between text-slate-300">
              <span>Assigned Commander:</span>
              <strong className="text-white">Officer Rajesh Kumar (ID: SEC-881)</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Security Unit:</span>
              <strong className="text-indigo-400">Rapid Intervention Squad 4</strong>
            </div>
          </div>

          <a
            href="tel:+911800SATHISAFE"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
          >
            <Phone className="w-4 h-4" />
            <span>Direct Call Officer (Patrol Vehicle #402)</span>
          </a>

        </div>

      </div>
    </div>
  );
}
