'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { ShieldCheck, Activity, CheckCircle2, Eye, Zap, Clock, ShieldAlert, Download } from 'lucide-react';

const CONTROL_STYLES: Record<string, string> = {
  Required: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
  Enabled:  'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  Optional: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  Disabled: 'bg-slate-800 border-slate-700 text-slate-500',
};

export function SafetyTab() {
  const { safetyProfiles, auditLogs } = useServiceHubStore();
  const profile = safetyProfiles[0];
  const [auditFilter, setAuditFilter] = useState<'ALL' | string>('ALL');

  const modules = [...new Set(auditLogs.map(l => l.module))];
  const filteredLogs = auditFilter === 'ALL' ? auditLogs : auditLogs.filter(l => l.module === auditFilter);

  const handleExportLogs = () => {
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `safety_audit_logs_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Module 8: Safety & Trust Controls Suite
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Safety controls linked to services. Configured as Required, Enabled, Optional, or Disabled.</p>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'SOS Dispatch', value: '100% Operational', Icon: Zap, color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
          { label: 'Check-in Frequency', value: 'Every 45 Minutes', Icon: Clock, color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' },
          { label: 'Active Incidents', value: '0 Flagged', Icon: ShieldAlert, color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className={`p-4 rounded-2xl border flex items-center justify-between ${color}`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">{label}</span>
              <span className="text-sm font-black font-mono text-white mt-0.5 block">{value}</span>
            </div>
            <Icon className="w-6 h-6 opacity-80" />
          </div>
        ))}
      </div>

      {/* Safety Controls Grid */}
      {profile && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 className="font-extrabold text-white text-base">{profile.name}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            {Object.entries(profile.controls).map(([ctrlKey, state]) => {
              const style = CONTROL_STYLES[state as string] || CONTROL_STYLES.Disabled;
              return (
                <div key={ctrlKey} className={`p-3.5 rounded-2xl border transition-all space-y-1.5 ${style}`}>
                  <span className="font-bold capitalize block text-[11px] leading-snug">{ctrlKey.replace(/_/g, ' ')}</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide ${style}`}>
                    {state as string}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safety Audit Event Log */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" /> Safety Configuration Audit Trail
          </h4>
          <div className="flex items-center gap-2">
            {/* Module Filter */}
            <select
              value={auditFilter}
              onChange={e => setAuditFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none font-semibold"
            >
              <option value="ALL" className="bg-slate-900">All Modules</option>
              {modules.map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
            </select>
            <button onClick={handleExportLogs} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto font-mono text-xs custom-scrollbar">
          {filteredLogs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 italic">
              {auditLogs.length === 0 ? 'No audit records logged in current session.' : 'No logs match selected filter.'}
            </div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold shrink-0">{log.module}</span>
                  <span className="text-slate-400 truncate">Action: <span className="text-emerald-400 font-bold">{log.action}</span></span>
                  <span className="text-slate-500 truncate text-[10px]">ID: {log.entity_id}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
