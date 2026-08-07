'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Search, Filter, Terminal, Globe, Lock } from 'lucide-react';
import { useStaffAccessStore, SecurityAuditRecord } from '@/lib/staffAccessStore';

const RISK_BADGES: Record<string, string> = {
  LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  MEDIUM: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  CRITICAL: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
};

export function SecurityAuditLogs() {
  const { auditLogs } = useStaffAccessStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const rMatch = filterRisk === 'ALL' || log.riskLevel === filterRisk;
    const qMatch =
      !searchQuery.trim() ||
      log.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    return rMatch && qMatch;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by staff name, action, resource, or IP..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 font-bold focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="LOW">LOW Risk</option>
          <option value="MEDIUM">MEDIUM Risk</option>
          <option value="HIGH">HIGH Risk</option>
          <option value="CRITICAL">CRITICAL Risk</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Action Performed</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">IP Address & Agent</th>
                <th className="p-4">Authorization</th>
                <th className="p-4">Risk Severity</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-sans">
                    No security audit logs match the query filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-white font-sans">{log.staffName}</div>
                      <div className="text-[10px] text-slate-500">{log.staffEmail}</div>
                    </td>

                    <td className="p-4 font-bold text-indigo-400 text-[11px]">{log.action}</td>

                    <td className="p-4 text-slate-300 font-bold text-[10px]">{log.resource}</td>

                    <td className="p-4">
                      <div className="text-slate-300 flex items-center gap-1 text-[10px]">
                        <Globe className="w-3 h-3 text-cyan-400" /> {log.ipAddress}
                      </div>
                      <div className="text-[9px] text-slate-500 line-clamp-1">{log.userAgent}</div>
                    </td>

                    <td className="p-4">
                      {log.isAuthorized ? (
                        <span className="text-emerald-400 font-bold text-[10px]">AUTHORIZED</span>
                      ) : (
                        <span className="text-rose-400 font-bold text-[10px]">DENIED 🚫</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${RISK_BADGES[log.riskLevel] || 'bg-slate-800 text-slate-400'}`}>
                        {log.riskLevel}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500 text-[10px]" suppressHydrationWarning>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
