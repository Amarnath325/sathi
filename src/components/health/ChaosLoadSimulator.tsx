'use client';

import React from 'react';
import { Flame, ShieldAlert, Cpu, Database, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { useSystemHealthStore } from '@/lib/systemHealthStore';

export function ChaosLoadSimulator() {
  const { isChaosTesting, triggerChaosLoad, stopChaosLoad } = useSystemHealthStore();

  return (
    <div className="space-y-6">
      {/* Chaos Simulator Card */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isChaosTesting
          ? 'bg-rose-950/40 border-rose-500 shadow-2xl shadow-rose-900/50 animate-pulse'
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3.5 rounded-2xl border ${
              isChaosTesting ? 'bg-rose-500 text-slate-950 border-rose-400' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">Chaos Load & Stress Testing Engine</h3>
                {isChaosTesting ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-slate-950">
                    CHAOS TEST ACTIVE 🔥
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    SYSTEM STANDBY 🟢
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate synthetic load spikes, DB pool exhaustion, and high API latency to test system alert triggers
              </p>
            </div>
          </div>

          {isChaosTesting && (
            <button
              onClick={stopChaosLoad}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xl"
            >
              Stop Chaos Load Test
            </button>
          )}
        </div>

        {/* Trigger Chaos Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-800">
          <button
            onClick={() => triggerChaosLoad('CPU')}
            className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left space-y-2 group transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-rose-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" /> CPU Core Spike Test
              </span>
              <span className="text-[10px] font-mono text-rose-400 font-bold">95% Load</span>
            </div>
            <p className="text-[10px] text-slate-500">Inject synthetic infinite thread loop to trigger CPU alert</p>
          </button>

          <button
            onClick={() => triggerChaosLoad('DB_POOL')}
            className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left space-y-2 group transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" /> DB Connection Flood
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">48/50 Pool</span>
            </div>
            <p className="text-[10px] text-slate-500">Saturate PostgreSQL connection pool to 96% capacity</p>
          </button>

          <button
            onClick={() => triggerChaosLoad('LATENCY')}
            className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left space-y-2 group transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-purple-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" /> Latency Spike Injection
              </span>
              <span className="text-[10px] font-mono text-purple-400 font-bold">840 ms</span>
            </div>
            <p className="text-[10px] text-slate-500">Simulate network carrier delay exceeding 800ms SLA limit</p>
          </button>
        </div>
      </div>
    </div>
  );
}
