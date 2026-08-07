'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, Clock, Search, Filter } from 'lucide-react';
import { useNotificationEngineStore, DeliveryAuditLog } from '@/lib/notificationEngineStore';

export function DeliveryLogs() {
  const { deliveryLogs, retryDeliveryLog } = useNotificationEngineStore();
  const [filterChannel, setFilterChannel] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = deliveryLogs.filter((log) => {
    const chMatch = filterChannel === 'ALL' || log.channel === filterChannel;
    const stMatch = filterStatus === 'ALL' || log.status === filterStatus;
    const qMatch =
      !searchQuery.trim() ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.providerRef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    return chMatch && stMatch && qMatch;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user or provider ref..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
          >
            <option value="ALL">All Channels</option>
            <option value="IN_APP">IN_APP</option>
            <option value="EMAIL">EMAIL</option>
            <option value="PUSH">PUSH</option>
            <option value="SMS">SMS</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="FAILED">FAILED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Log ID</th>
                <th className="p-4">Recipient</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Status</th>
                <th className="p-4">Provider Ref</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Time</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-sans">
                    No delivery audit logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4 text-indigo-400 font-bold">{log.id}</td>
                    <td className="p-4 font-sans font-bold text-white">{log.userName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-300">
                        {log.channel}
                      </span>
                    </td>
                    <td className="p-4">
                      {log.status === 'DELIVERED' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                          <CheckCircle className="w-3 h-3" /> DELIVERED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[10px]">
                          <AlertTriangle className="w-3 h-3" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 text-[10px]">{log.providerRef || 'N/A'}</td>
                    <td className="p-4 text-slate-400 text-[10px]">{log.latencyMs}ms</td>
                    <td className="p-4 text-slate-500 text-[10px]" suppressHydrationWarning>
                      {new Date(log.sentAt).toLocaleTimeString()}
                    </td>
                    <td className="p-4 text-right font-sans">
                      {log.status === 'FAILED' && (
                        <button
                          onClick={() => retryDeliveryLog(log.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 text-[10px] font-bold inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Retry
                        </button>
                      )}
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
