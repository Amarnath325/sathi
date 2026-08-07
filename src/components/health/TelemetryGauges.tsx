'use client';

import React from 'react';
import { Cpu, HardDrive, Database, Zap, Radio, Clock, Activity } from 'lucide-react';
import { useSystemHealthStore } from '@/lib/systemHealthStore';

export function TelemetryGauges() {
  const { currentMetric } = useSystemHealthStore();

  const getGaugeColor = (val: number, highIsBad = true) => {
    if (highIsBad) {
      if (val > 85) return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
      if (val > 70) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    } else {
      if (val < 90) return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
      if (val < 98) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* CPU Gauge */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Cpu className="w-4 h-4 text-cyan-400" /> CPU Core Load
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${getGaugeColor(currentMetric.cpuUsagePercent)}`}>
            {currentMetric.cpuUsagePercent}%
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 ${
              currentMetric.cpuUsagePercent > 85 ? 'bg-rose-500' : currentMetric.cpuUsagePercent > 70 ? 'bg-amber-500' : 'bg-cyan-500'
            }`}
            style={{ width: `${currentMetric.cpuUsagePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Node: {currentMetric.nodeName}</span>
          <span>8 vCPUs Active</span>
        </div>
      </div>

      {/* RAM Gauge */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Activity className="w-4 h-4 text-purple-400" /> System RAM Memory
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${getGaugeColor(currentMetric.memoryUsagePercent)}`}>
            {currentMetric.memoryUsagePercent}%
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 ${
              currentMetric.memoryUsagePercent > 85 ? 'bg-rose-500' : currentMetric.memoryUsagePercent > 70 ? 'bg-amber-500' : 'bg-purple-500'
            }`}
            style={{ width: `${currentMetric.memoryUsagePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Used: 18.7 GB / 32 GB</span>
          <span>Buffer: 4.2 GB</span>
        </div>
      </div>

      {/* DB Pool Connections */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Database className="w-4 h-4 text-emerald-400" /> DB Connection Pool
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {currentMetric.dbPoolActive} / 50 Active
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(currentMetric.dbPoolActive / 50) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Idle: {currentMetric.dbPoolIdle} Connections</span>
          <span>Max Pool Limit: 50</span>
        </div>
      </div>

      {/* Redis Hit Rate */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" /> Redis Cache Hit Ratio
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {currentMetric.redisHitRatePercent}% Hit
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${currentMetric.redisHitRatePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>In-Memory Key Evictions: 0</span>
          <span>TTL: 3600s</span>
        </div>
      </div>

      {/* Active WebSockets */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Radio className="w-4 h-4 text-indigo-400" /> Live WebSocket Sockets
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            {currentMetric.activeWebsockets} Connections
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: '65%' }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Concurrent Sockets: 1.4K</span>
          <span>Keep-Alive: 30s</span>
        </div>
      </div>

      {/* Response Latency */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400" /> Average API Response Latency
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {currentMetric.responseLatencyMs} ms
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-emerald-400 transition-all duration-300"
            style={{ width: `${Math.min(100, (currentMetric.responseLatencyMs / 200) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>p95 Latency: {currentMetric.responseLatencyMs + 12}ms</span>
          <span>Target SLA: &lt;100ms</span>
        </div>
      </div>
    </div>
  );
}
