'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Clock, RefreshCw, XCircle } from 'lucide-react';
import { useSystemHealthStore, SystemHealthAlertRecord } from '@/lib/systemHealthStore';

export function SystemAlertsFeed() {
  const { alerts, resolveAlert } = useSystemHealthStore();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ACTIVE');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'ACTIVE') return !a.isResolved;
    if (filter === 'RESOLVED') return a.isResolved;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Active System Telemetry Incidents & Alerts
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated alerts triggered when CPU, Memory, DB Pool, or API response latency breaches SLA thresholds
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['ACTIVE', 'RESOLVED', 'ALL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filter === f ? 'gradient-bg-primary text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f === 'ACTIVE' ? '⚠️ Active Alerts' : f === 'RESOLVED' ? '✅ Resolved' : 'All Alerts'}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-extrabold text-white">Zero Active Health Incidents</h4>
            <p className="text-xs text-slate-500">All server nodes, DB pools, and microservices are operating within SLA limits.</p>
          </div>
        ) : (
          filteredAlerts.map((alt) => {
            const isCritical = alt.severity === 'CRITICAL';

            return (
              <div
                key={alt.id}
                className={`p-6 rounded-3xl border transition-all ${
                  alt.isResolved
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                    : isCritical
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                    : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border ${
                      alt.isResolved
                        ? 'bg-slate-950 text-slate-500 border-slate-800'
                        : isCritical
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-white font-mono">{alt.serviceName}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          alt.isResolved
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : isCritical
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {alt.alertType} ({alt.severity})
                        </span>
                      </div>
                      <p className="text-xs mt-1 text-slate-300 font-medium">{alt.message}</p>
                    </div>
                  </div>

                  {!alt.isResolved ? (
                    <button
                      onClick={() => resolveAlert(alt.id)}
                      className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 text-xs font-extrabold flex items-center gap-1.5 border border-slate-800 shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved at {new Date(alt.resolvedAt!).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono flex items-center justify-between" suppressHydrationWarning>
                  <span>Alert ID: #{alt.id}</span>
                  <span>Triggered at: {new Date(alt.triggeredAt).toLocaleString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
