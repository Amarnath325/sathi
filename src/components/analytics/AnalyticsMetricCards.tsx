'use client';

import React from 'react';
import { useAnalyticsStore } from '@/lib/analyticsStore';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function AnalyticsMetricCards() {
  const { getDomainKpis, compareMode } = useAnalyticsStore();
  const kpiList = getDomainKpis();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiList.map((kpi) => {
        const isUp = kpi.changePct >= 0;
        const isGood = kpi.isPositiveGood ? isUp : !isUp;

        return (
          <div
            key={kpi.key}
            className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] shadow-xl group space-y-3"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />

            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {kpi.label}
              </span>

              {/* Comparison badge */}
              {compareMode !== 'NONE' && (
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${
                    isGood
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {isUp ? `+${kpi.changePct}%` : `${kpi.changePct}%`}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">{kpi.value}</h2>
              <p className="text-[11px] text-slate-400 mt-1">{kpi.subtitle}</p>
            </div>

            {/* Mini visual trend sparkline simulation */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" />
                Live Feed
              </span>
              <span>
                {compareMode === 'PREVIOUS_YEAR' ? 'vs PY' : compareMode === 'PREVIOUS_PERIOD' ? 'vs Prior' : 'Current'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
