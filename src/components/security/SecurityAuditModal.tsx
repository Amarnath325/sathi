'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Activity, Lock, Search, RefreshCw } from 'lucide-react';
import { ZeroTrustSecurityEngine, SecurityEventLog } from '@/lib/zeroTrustSecurityEngine';

interface SecurityAuditModalProps {
  onClose: () => void;
}

export function SecurityAuditModal({ onClose }: SecurityAuditModalProps) {
  const [logs] = useState<SecurityEventLog[]>(ZeroTrustSecurityEngine.getMockSecurityLogs());
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredLogs = logs.filter(l => filterSeverity === 'ALL' || l.severity === filterSeverity);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Security Event & Vulnerability Audit Log</h3>
              <p className="text-xs text-slate-400 font-mono">Zero-Trust Real-time Audit Trail</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Severity Filter */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-bold font-mono uppercase text-[10px]">Filter Severity:</span>
          <div className="flex gap-1.5 overflow-x-auto">
            {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold transition-all ${
                  filterSeverity === sev
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Event Logs List */}
        <div className="p-6 max-h-[420px] overflow-y-auto space-y-3 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Activity className="w-8 h-8 text-slate-700 mx-auto" />
              <p>No audit logs matching severity filter.</p>
            </div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    {log.severity === 'LOW' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {log.severity === 'MEDIUM' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    {log.severity === 'HIGH' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                    {log.eventType}
                  </span>
                  <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                </div>

                <p className="text-slate-300 font-sans text-xs leading-relaxed">{log.details}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                  <span>Source IP: {log.ipAddress}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    log.severity === 'LOW' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    {log.severity} SEVERITY
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close Security Audit Log
          </button>
        </div>

      </div>
    </div>
  );
}
