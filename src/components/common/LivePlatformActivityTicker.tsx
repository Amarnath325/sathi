'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, CheckCircle2, Lock, Zap } from 'lucide-react';

const LIVE_ACTIVITIES = [
  { id: 1, text: "Ananya S. accepted an Event Companion booking in Raipur", time: "2 mins ago", icon: Zap, color: "text-amber-400" },
  { id: 2, text: "Rahul V. completed 12-Step Identity & Govt ID Verification", time: "5 mins ago", icon: ShieldCheck, color: "text-emerald-400" },
  { id: 3, text: "Escrow deposit $250 locked securely for SF Travel Companion service", time: "8 mins ago", icon: Lock, color: "text-indigo-400" },
  { id: 4, text: "Priya M. received 5.0 ★ rating for Corporate Gala companionship", time: "12 mins ago", icon: CheckCircle2, color: "text-cyan-400" },
];

export function LivePlatformActivityTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const current = LIVE_ACTIVITIES[index];
  const Icon = current.icon;

  return (
    <div className="bg-slate-950/90 border-y border-slate-800 py-2.5 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Activity className="w-3 h-3 animate-pulse" /> LIVE PLATFORM PULSE
          </span>

          <div className="flex items-center gap-2 truncate animate-fade-in key={current.id}">
            <Icon className={`w-4 h-4 shrink-0 ${current.color}`} />
            <span className="text-slate-200 truncate">{current.text}</span>
            <span className="text-slate-500 text-[10px] font-bold shrink-0">({current.time})</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-slate-400 text-[11px] shrink-0">
          <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Candidates</span>
          <span className="flex items-center gap-1 text-indigo-300"><Lock className="w-3.5 h-3.5" /> Bank-Grade Escrow</span>
        </div>
      </div>
    </div>
  );
}
