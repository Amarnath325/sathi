'use client';

import React, { useState } from 'react';
import { useExecutiveStore } from '@/lib/executiveStore';
import { BarChart3, TrendingUp, DollarSign, Lock, Calendar } from 'lucide-react';

type ChartMetric = 'ALL' | 'GMV' | 'NET_REVENUE' | 'ESCROW_CASHFLOW';

export default function ExecutiveRevenueChart() {
  const { getTimeSeries, timeframe } = useExecutiveStore();
  const series = getTimeSeries();
  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>('ALL');

  const maxVal = Math.max(...series.map((s) => s.gmv), 1);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide">Revenue & Escrow Cashflow Trajectory</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              LIVE TIME-SERIES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparative performance across GMV, Platform Margin, and Escrow protected funds ({timeframe})
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setSelectedMetric('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedMetric === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setSelectedMetric('GMV')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedMetric === 'GMV'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GMV Only
          </button>
          <button
            onClick={() => setSelectedMetric('NET_REVENUE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedMetric === 'NET_REVENUE'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Net Revenue
          </button>
          <button
            onClick={() => setSelectedMetric('ESCROW_CASHFLOW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedMetric === 'ESCROW_CASHFLOW'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Escrow Cashflow
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-400 border-b border-slate-800/80 pb-3">
        {(selectedMetric === 'ALL' || selectedMetric === 'GMV') && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block shadow-sm shadow-indigo-500/50" />
            <span className="font-semibold text-slate-300">GMV (Gross Merchandise Value)</span>
          </div>
        )}

        {(selectedMetric === 'ALL' || selectedMetric === 'NET_REVENUE') && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50" />
            <span className="font-semibold text-slate-300">Platform Net Yield (Revenue)</span>
          </div>
        )}

        {(selectedMetric === 'ALL' || selectedMetric === 'ESCROW_CASHFLOW') && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-400 inline-block shadow-sm shadow-blue-400/50" />
            <span className="font-semibold text-slate-300">Escrow Reserve Liquidity</span>
          </div>
        )}
      </div>

      {/* Interactive Bar/Height Visualizer */}
      <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
        {series.map((point, idx) => {
          const gmvHeight = (point.gmv / maxVal) * 100;
          const netHeight = (point.netRevenue / maxVal) * 100;
          const escrowHeight = (point.escrowCashflow / maxVal) * 100;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-20 z-20 bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-[11px] shadow-2xl transition-all whitespace-nowrap min-w-36">
                <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">{point.date}</p>
                <div className="space-y-0.5">
                  <p className="text-indigo-400">GMV: ${point.gmv.toLocaleString()}</p>
                  <p className="text-emerald-400">Net Yield: ${point.netRevenue.toLocaleString()}</p>
                  <p className="text-blue-400">Escrow: ${point.escrowCashflow.toLocaleString()}</p>
                  <p className="text-slate-400 text-[10px]">Bookings: {point.bookingsCount}</p>
                </div>
              </div>

              {/* Bars container */}
              <div className="w-full flex items-end justify-center gap-1 h-52 relative">
                {/* GMV Bar */}
                {(selectedMetric === 'ALL' || selectedMetric === 'GMV') && (
                  <div
                    style={{ height: `${gmvHeight}%` }}
                    className="w-full max-w-[14px] bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-md transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-indigo-500/20"
                  />
                )}

                {/* Net Revenue Bar */}
                {(selectedMetric === 'ALL' || selectedMetric === 'NET_REVENUE') && (
                  <div
                    style={{ height: `${netHeight}%` }}
                    className="w-full max-w-[14px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-emerald-400/20"
                  />
                )}

                {/* Escrow Cashflow Bar */}
                {(selectedMetric === 'ALL' || selectedMetric === 'ESCROW_CASHFLOW') && (
                  <div
                    style={{ height: `${escrowHeight}%` }}
                    className="w-full max-w-[14px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-blue-400/20"
                  />
                )}
              </div>

              {/* Label */}
              <span className="text-[10px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                {point.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
