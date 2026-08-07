'use client';

import React from 'react';
import { useExecutiveStore, TimeframeFilter, RegionFilter, CompanionTierFilter } from '@/lib/executiveStore';
import { 
  Calendar, 
  Globe, 
  SlidersHorizontal, 
  RefreshCw, 
  FileText, 
  ShieldAlert, 
  TrendingUp, 
  Layers 
} from 'lucide-react';

interface Props {
  onOpenActionModal: (type: 'COMMISSION' | 'AUDIT' | 'REPORT') => void;
}

export default function ExecutiveHeaderControls({ onOpenActionModal }: Props) {
  const { 
    timeframe, 
    region, 
    tier, 
    setTimeframe, 
    setRegion, 
    setTier, 
    refreshData, 
    lastRefreshedAt,
    escrowCommissionRate 
  } = useExecutiveStore();

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const timeframeOptions: { key: TimeframeFilter; label: string }[] = [
    { key: 'TODAY', label: 'Today' },
    { key: '7D', label: '7 Days' },
    { key: '30D', label: '30 Days' },
    { key: '90D', label: 'Quarter' },
    { key: 'YTD', label: 'YTD' },
  ];

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden bg-slate-950/70 backdrop-blur-xl">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        {/* Title & Status */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">C-Suite Executive Dashboard</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  REAL-TIME ERP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Strategic financial KPIs, platform escrow reserves, and companion marketplace analytics
              </p>
            </div>
          </div>
        </div>

        {/* Executive Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenActionModal('COMMISSION')}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-md hover:border-indigo-500/50"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            Escrow Margin ({escrowCommissionRate}%)
          </button>

          <button
            onClick={() => onOpenActionModal('AUDIT')}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-md hover:border-amber-500/50"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Security Threat Audit
          </button>

          <button
            onClick={() => onOpenActionModal('REPORT')}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Export Board Deck
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 relative z-10">
        {/* Timeframe Selector Pills */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-slate-800/90 gap-1 overflow-x-auto">
          <span className="text-[10px] text-slate-400 font-semibold px-2 uppercase tracking-wider hidden sm:inline">
            Period:
          </span>
          {timeframeOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTimeframe(opt.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                timeframe === opt.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Dropdowns & Refresh */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Region Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionFilter)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">Global (All Regions)</option>
              <option value="NORTH_AMERICA" className="bg-slate-900 text-slate-200">North America</option>
              <option value="EUROPE" className="bg-slate-900 text-slate-200">Europe & UK</option>
              <option value="ASIA_PACIFIC" className="bg-slate-900 text-slate-200">Asia Pacific</option>
              <option value="LATIN_AMERICA" className="bg-slate-900 text-slate-200">Latin America</option>
            </select>
          </div>

          {/* Tier Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as CompanionTierFilter)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All Companion Tiers</option>
              <option value="VIP_ESCORT" className="bg-slate-900 text-slate-200">VIP High-End Escort</option>
              <option value="CONCIERGE" className="bg-slate-900 text-slate-200">Executive Concierge</option>
              <option value="EVENT_COMPANION" className="bg-slate-900 text-slate-200">Event Escort</option>
              <option value="LUXURY_TRAVEL" className="bg-slate-900 text-slate-200">Luxury Travel</option>
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            title="Refresh Live Metrics"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-100 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
