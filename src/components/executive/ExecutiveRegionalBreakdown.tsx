'use client';

import React from 'react';
import { useExecutiveStore } from '@/lib/executiveStore';
import { Globe, Layers, ArrowUpRight, ShieldCheck, Crown } from 'lucide-react';

export default function ExecutiveRegionalBreakdown() {
  const { getRegionalData, getTierShares, getKpis } = useExecutiveStore();
  const regionalData = getRegionalData();
  const tierShares = getTierShares();
  const kpis = getKpis();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Regional Revenue Distribution Matrix */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Regional Market Penetration</h3>
              <p className="text-xs text-slate-400">GMV share and companion active density by territory</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
            4 GLOBAL ZONES
          </span>
        </div>

        <div className="space-y-4">
          {regionalData.map((reg) => (
            <div key={reg.regionCode} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{reg.regionName}</span>
                  <span className="text-[10px] font-mono text-slate-400">({reg.regionCode})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{reg.activeCompanions} Companions</span>
                  <span className="font-bold text-indigo-400">{formatCurrency(reg.revenue)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${reg.gmvSharePct}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{reg.gmvSharePct}% GMV Contribution</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +{reg.growthPct}% YoY
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Companion Tier & Revenue Contribution */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Companion Category Mix</h3>
              <p className="text-xs text-slate-400">Revenue contribution per marketplace tier</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
            PREMIUM TIERS
          </span>
        </div>

        <div className="space-y-3.5">
          {tierShares.map((t) => (
            <div key={t.tierKey} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="font-bold text-white">{t.tierLabel}</span>
                </div>
                <span className="font-bold text-slate-200">{formatCurrency(t.gmvContribution)}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${t.percentage}%`, backgroundColor: t.color }}
                  className="h-full rounded-full transition-all duration-700"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{t.percentage}% Total Platform Volume</span>
                <span className="font-mono text-slate-300">High Yield</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Summary */}
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Escrow guarantee enforced across all companion tier bookings.</span>
          </div>
          <span className="font-bold text-white shrink-0 ml-2">100% Insured</span>
        </div>
      </div>
    </div>
  );
}
