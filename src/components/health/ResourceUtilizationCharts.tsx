'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Activity, Cpu, Database, Clock } from 'lucide-react';
import { useSystemHealthStore } from '@/lib/systemHealthStore';

export function ResourceUtilizationCharts() {
  const { currentMetric } = useSystemHealthStore();
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D'>('24H');

  const hourlyData = [
    { hour: '00:00', cpu: 22, memory: 45, dbPool: 8, latency: 28 },
    { hour: '04:00', cpu: 18, memory: 42, dbPool: 6, latency: 24 },
    { hour: '08:00', cpu: 48, memory: 65, dbPool: 22, latency: 45 },
    { hour: '12:00', cpu: 74, memory: 78, dbPool: 38, latency: 68 },
    { hour: '16:00', cpu: 62, memory: 71, dbPool: 28, latency: 52 },
    { hour: '20:00', cpu: 38, memory: 58, dbPool: 16, latency: 34 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Historical Resource Utilization & SLA Trends
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            CPU/Memory spikes, Database connection pool saturation, and API response latency over time
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['1H', '24H', '7D'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                timeframe === tf ? 'gradient-bg-primary text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tf} Window
            </button>
          ))}
        </div>
      </div>

      {/* Utilization Bar Graph Visualization */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" /> 24-Hour CPU & Memory Load Timeline
        </h4>

        <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6 border-b border-slate-800 font-mono text-center">
          {hourlyData.map((d) => (
            <div key={d.hour} className="space-y-2 flex flex-col items-center h-full justify-end">
              <div className="w-full max-w-[40px] bg-slate-950 rounded-xl overflow-hidden flex flex-col justify-end h-36 p-1 gap-1 border border-slate-800">
                {/* CPU bar */}
                <div
                  className="w-full bg-cyan-500 rounded-md transition-all duration-300"
                  style={{ height: `${d.cpu}%` }}
                  title={`CPU: ${d.cpu}%`}
                />
                {/* Memory bar */}
                <div
                  className="w-full bg-purple-500 rounded-md transition-all duration-300"
                  style={{ height: `${d.memory / 2}%` }}
                  title={`Memory: ${d.memory}%`}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{d.hour}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 text-xs font-bold font-mono">
          <span className="flex items-center gap-2 text-cyan-400">
            <span className="w-3 h-3 rounded-sm bg-cyan-500 inline-block" /> CPU Core Usage %
          </span>
          <span className="flex items-center gap-2 text-purple-400">
            <span className="w-3 h-3 rounded-sm bg-purple-500 inline-block" /> RAM Memory Usage %
          </span>
        </div>
      </div>
    </div>
  );
}
