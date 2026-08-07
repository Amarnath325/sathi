'use client';

import React, { useState } from 'react';
import { Radio, CheckCircle2, Eye, AlertTriangle, Clock, RefreshCw, XCircle } from 'lucide-react';
import { useCommunicationStore, CommDeliveryStatus } from '@/lib/communicationStore';

export function DeliveryLogStreamTable() {
  const { deliveryLogs } = useCommunicationStore();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredLogs = deliveryLogs.filter(
    (log) => filterStatus === 'ALL' || log.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" /> Live Provider Delivery Stream & Gateway Webhooks
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time receipt logs, open tracking pixels, and bounce failure diagnostics from Twilio and SendGrid
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'DELIVERED', 'OPENED', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterStatus === st ? 'gradient-bg-primary text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Recipient</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Status</th>
                <th className="p-4">Provider Message ID</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => {
                const isFailed = log.status === 'FAILED' || log.status === 'BOUNCED';
                const isOpened = log.status === 'OPENED' || log.status === 'CLICKED';

                return (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-white font-bold">
                      {log.recipientEmail || log.recipientPhone || 'Anonymous Recipient'}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        {log.channel}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        isFailed
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : isOpened
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400 text-[11px] font-mono">
                      {log.providerMessageId}
                      {log.errorMessage && <span className="block text-[10px] text-rose-400 mt-0.5">{log.errorMessage}</span>}
                    </td>

                    <td className="p-4 text-slate-500 text-[10px]" suppressHydrationWarning>
                      {new Date(log.deliveredAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
