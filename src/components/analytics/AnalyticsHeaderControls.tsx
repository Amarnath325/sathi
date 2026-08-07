'use client';

import React from 'react';
import { useAnalyticsStore, AnalyticsDomainTab, AnalyticsTimeframe, CompareMode } from '@/lib/analyticsStore';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  GitCompare, 
  Plus, 
  Download, 
  Search 
} from 'lucide-react';

interface Props {
  onOpenReportBuilder: () => void;
  onOpenExportModal: () => void;
}

export default function AnalyticsHeaderControls({ onOpenReportBuilder, onOpenExportModal }: Props) {
  const { 
    domain, 
    timeframe, 
    compareMode, 
    searchFilter,
    setDomain, 
    setTimeframe, 
    setCompareMode,
    setSearchFilter 
  } = useAnalyticsStore();

  const domainTabs: { key: AnalyticsDomainTab; label: string; icon: React.ElementType }[] = [
    { key: 'OVERVIEW', label: 'Executive Overview', icon: BarChart3 },
    { key: 'FINANCIAL', label: 'Financial & Revenue', icon: DollarSign },
    { key: 'USER_GROWTH', label: 'User Growth & Retention', icon: Users },
    { key: 'OPERATIONS', label: 'Booking Operations', icon: Clock },
    { key: 'SAFETY', label: 'Trust, Safety & Risk', icon: ShieldCheck },
  ];

  const timeframeOptions: { key: AnalyticsTimeframe; label: string }[] = [
    { key: '7D', label: '7 Days' },
    { key: '30D', label: '30 Days' },
    { key: '90D', label: 'Quarter' },
    { key: '1Y', label: '1 Year' },
  ];

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden bg-slate-950/80 backdrop-blur-xl">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">Analytics & Intelligence Hub</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  ADVANCED REPORTING
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-domain metrics, cohort analysis, automated report builder & audit data exports
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenExportModal}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 shadow-md hover:border-slate-600 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            Export Data
          </button>

          <button
            onClick={onOpenReportBuilder}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Build Custom Report
          </button>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800/80 relative z-10 custom-scrollbar">
        {domainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = domain === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setDomain(tab.key)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Row: Timeframe, Compare Mode, Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 relative z-10">
        {/* Timeframe selector */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800/90 gap-1 overflow-x-auto">
          <span className="text-[10px] text-slate-400 font-semibold px-2 uppercase tracking-wider hidden sm:inline">
            Range:
          </span>
          {timeframeOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTimeframe(opt.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                timeframe === opt.key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Comparison & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Comparison Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <GitCompare className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={compareMode}
              onChange={(e) => setCompareMode(e.target.value as CompareMode)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="PREVIOUS_PERIOD" className="bg-slate-900 text-slate-200">vs Previous Period</option>
              <option value="PREVIOUS_YEAR" className="bg-slate-900 text-slate-200">vs Previous Year</option>
              <option value="NONE" className="bg-slate-900 text-slate-200">No Comparison</option>
            </select>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-36 sm:w-48"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
