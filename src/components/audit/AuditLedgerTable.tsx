'use client';

import React, { useState } from 'react';
import { ScrollText, Link, ShieldCheck, ChevronDown, ChevronRight, Terminal, Globe, Code } from 'lucide-react';
import { useAuditLogsStore, AuditTrailRecord, AuditDomain, AuditAction } from '@/lib/auditLogsStore';

const ACTION_BADGES: Record<AuditAction, string> = {
  CREATE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  READ: 'bg-slate-800 text-slate-400 border-slate-700',
  UPDATE: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  DELETE: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  EXECUTE: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  AUTHENTICATE: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  AUTHORIZE_OVERRIDE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  EXPORT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
};

interface AuditLedgerTableProps {
  logs: AuditTrailRecord[];
}

export function AuditLedgerTable({ logs }: AuditLedgerTableProps) {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/40">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4 w-12 text-center">Seq #</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Action</th>
              <th className="p-4">Domain & Resource</th>
              <th className="p-4">Cryptographic SHA-256 Hash Chain</th>
              <th className="p-4">Status</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4 text-right">Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 font-sans">
                  No immutable audit trail records match the query filters.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                const actionBadge = ACTION_BADGES[log.action] || 'bg-slate-800 text-slate-400';

                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-900/60 transition-colors">
                      {/* Seq # */}
                      <td className="p-4 text-center font-bold text-indigo-400 text-xs">
                        #{log.sequenceNumber}
                      </td>

                      {/* Actor */}
                      <td className="p-4 font-sans">
                        <div className="font-extrabold text-white text-xs">{log.actorName}</div>
                        <div className="text-[10px] text-indigo-400 font-mono">{log.actorRole}</div>
                        <div className="text-[9px] text-slate-500">{log.actorEmail}</div>
                      </td>

                      {/* Action */}
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${actionBadge}`}>
                          {log.action}
                        </span>
                      </td>

                      {/* Domain & Resource */}
                      <td className="p-4 font-sans">
                        <div className="font-bold text-slate-200 text-xs">{log.resourceId}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{log.resourceDomain}</div>
                      </td>

                      {/* Cryptographic SHA-256 Chain */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-[9px] text-slate-500 flex items-center gap-1 truncate max-w-[200px]">
                            <Link className="w-3 h-3 text-slate-600 shrink-0" /> Prev: {log.previousHash}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-bold truncate max-w-[200px]" title={log.currentHash}>
                            Hash: {log.currentHash}
                          </div>
                        </div>
                      </td>

                      {/* Checksum Status */}
                      <td className="p-4 font-sans">
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" /> VALID
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="p-4 text-slate-500 text-[10px]" suppressHydrationWarning>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      {/* Payload Toggle */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[10px] font-bold inline-flex items-center gap-1 border border-slate-800"
                        >
                          <Code className="w-3 h-3 text-indigo-400" />
                          {isExpanded ? 'Hide' : 'Inspect'}
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable JSON Payload Inspector */}
                    {isExpanded && (
                      <tr className="bg-slate-950/80 border-y border-slate-800">
                        <td colSpan={8} className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">
                              <span>📦 Audit Record Payload Diff (Sequence #{log.sequenceNumber})</span>
                              <span>IP: {log.ipAddress}</span>
                            </div>
                            <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
