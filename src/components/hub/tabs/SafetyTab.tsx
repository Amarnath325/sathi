'use client';

import React from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { ShieldCheck, Eye, Activity, CheckCircle2 } from 'lucide-react';

export function SafetyTab() {
  const { safetyProfiles, auditLogs } = useServiceHubStore();
  const profile = safetyProfiles[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Module 8: Safety & Trust Controls Suite
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            14 safety controls linked to services. Configured as Enabled, Disabled, Required, or Optional.
          </p>
        </div>
      </div>

      {profile && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 className="font-extrabold text-white text-base">{profile.name}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {Object.entries(profile.controls).map(([ctrlKey, state]) => (
              <div key={ctrlKey} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-300 capitalize">{ctrlKey.replace(/_/g, ' ')}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  state === 'Required' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {state}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Audit Event Log */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="font-bold text-white text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" /> Safety Event & Configuration Audit Trail Log
        </h4>
        <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs text-slate-400">
          {auditLogs.length === 0 ? (
            <p className="text-slate-500 italic">No audit records logged yet in current session.</p>
          ) : (
            auditLogs.map(log => (
              <div key={log.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">[{log.module}]</span> Action: <span className="text-emerald-400">{log.action}</span> (ID: {log.entity_id})
                </div>
                <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
