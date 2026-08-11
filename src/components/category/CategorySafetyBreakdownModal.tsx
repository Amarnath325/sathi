'use client';

import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, AlertTriangle, Radio, Activity } from 'lucide-react';
import { ServiceCategory } from '@/lib/types';

interface CategorySafetyBreakdownModalProps {
  category: ServiceCategory | null;
  onClose: () => void;
}

export function CategorySafetyBreakdownModal({ category, onClose }: CategorySafetyBreakdownModalProps) {
  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Category Safety & Protocol Scorecard</h3>
              <p className="text-[10px] text-emerald-400 font-mono">{category.name}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="font-mono text-xs text-emerald-300 font-bold block">VERIFIED SAFETY GRADE: A+ (99.8%)</span>
              <p className="text-[11px] text-slate-300">All companions listed under {category.name} undergo mandatory background checks and live telemetry verification.</p>
            </div>
          </div>

          <div className="space-y-3 font-mono">
            
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-white text-[11px]">12-Step KYC & Govt ID Verified</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">MANDATORY</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span className="text-white text-[11px]">Live GPS Geofence Patrol</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">ACTIVE 24/7</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span className="text-white text-[11px]">Bank-Grade Escrow Protection</span>
              </div>
              <span className="text-[10px] text-indigo-300 font-bold">HELD SECURELY</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-white text-[11px]">Zero-Contact Safety Policy</span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold">ENFORCED</span>
            </div>

          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
          >
            Close Scorecard
          </button>

        </div>

      </div>
    </div>
  );
}
