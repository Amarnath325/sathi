'use client';

import React from 'react';
import { useAnalyticsStore } from '@/lib/analyticsStore';
import { TrendingUp, PieChart, Users, Grid, ArrowUpRight } from 'lucide-react';

export default function AnalyticsChartsSuite() {
  const { getTimeSeriesData, getCategoryBreakdown, getCohortData, domain, timeframe, compareMode } = useAnalyticsStore();

  const series = getTimeSeriesData();
  const categories = getCategoryBreakdown();
  const cohorts = getCohortData();

  const maxVal = Math.max(...series.map((s) => Math.max(s.primaryValue, s.comparisonValue)), 1);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  return (
    <div className="space-y-6">
      {/* Primary Comparative Time Series Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Comparative Trend Analytics ({domain})
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {timeframe} RANGE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Performance metrics vs {compareMode === 'PREVIOUS_YEAR' ? 'Previous Year' : 'Previous Period'}
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block shadow-sm shadow-purple-500/50" />
              <span className="text-slate-300">Current Period</span>
            </div>
            {compareMode !== 'NONE' && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-600 inline-block shadow-sm" />
                <span className="text-slate-400">Comparison Period</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Bars Container */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
          {series.map((point, idx) => {
            const primHeight = (point.primaryValue / maxVal) * 100;
            const compHeight = (point.comparisonValue / maxVal) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-16 z-20 bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-[11px] shadow-2xl transition-all whitespace-nowrap">
                  <p className="font-bold text-purple-400">{point.label}</p>
                  <p className="text-slate-200">Current: ${point.primaryValue.toLocaleString()}</p>
                  {compareMode !== 'NONE' && (
                    <p className="text-slate-400">Previous: ${point.comparisonValue.toLocaleString()}</p>
                  )}
                </div>

                <div className="w-full flex items-end justify-center gap-1 h-52 relative">
                  {/* Current Period Bar */}
                  <div
                    style={{ height: `${primHeight}%` }}
                    className="w-full max-w-[16px] bg-gradient-to-t from-purple-700 to-indigo-500 rounded-t-md transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-purple-500/20"
                  />

                  {/* Comparison Bar */}
                  {compareMode !== 'NONE' && (
                    <div
                      style={{ height: `${compHeight}%` }}
                      className="w-full max-w-[16px] bg-gradient-to-t from-slate-700 to-slate-600 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                    />
                  )}
                </div>

                <span className="text-[10px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Category Mix & Retention Cohorts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">Category Revenue Split</h3>
                <p className="text-xs text-slate-400">Revenue generation by companion service category</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {categories.map((c) => (
              <div key={c.category} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="font-bold text-white">{c.category}</span>
                  </div>
                  <span className="font-bold text-indigo-400">${c.revenue.toLocaleString()}</span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${c.percentage}%`, backgroundColor: c.color }}
                    className="h-full rounded-full transition-all duration-700"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{c.bookings} Bookings</span>
                  <span className="font-mono text-slate-300">{c.percentage}% of Volume</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Cohort Retention Matrix */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">User Retention Cohorts</h3>
                <p className="text-xs text-slate-400">Repeat booking retention rate over 1-6 months</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                  <th className="py-2 px-2">COHORT</th>
                  <th className="py-2 px-2">USERS</th>
                  <th className="py-2 px-2 text-center">M1</th>
                  <th className="py-2 px-2 text-center">M2</th>
                  <th className="py-2 px-2 text-center">M3</th>
                  <th className="py-2 px-2 text-center">M6</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {cohorts.map((row) => (
                  <tr key={row.cohortMonth} className="hover:bg-slate-900/60">
                    <td className="py-3 px-2 font-bold text-white whitespace-nowrap">{row.cohortMonth}</td>
                    <td className="py-3 px-2 text-slate-400">{row.userCount}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        {row.m1}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                        {row.m2}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        {row.m3}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {row.m6}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
