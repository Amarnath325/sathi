'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Lock, Search, Filter, Terminal, Globe, CheckCircle2 } from 'lucide-react';
import { useSecurityControlsStore, ThreatCategory } from '@/lib/securityControlsStore';

const THREAT_BADGES: Record<ThreatCategory, { label: string; color: string }> = {
  BRUTE_FORCE: { label: '🔥 Brute-Force Attack', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  SQL_INJECTION: { label: '💉 Injection Attempt', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  RATE_LIMIT_BREACH: { label: '⚡ Rate Limit Spike', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  GEO_MISMATCH: { label: '🌐 Country Mismatch', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  COMPROMISED_TOKEN: { label: '🔑 Token Theft Alert', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  SUSPICIOUS_IP: { label: '🕵️ Proxy / VPN Node', color: 'bg-slate-800 text-slate-300 border-slate-700' },
};

export function ThreatMonitor() {
  const { threats, blockIpAddress, unblockIpAddress } = useSecurityControlsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredThreats = threats.filter((threat) => {
    const catMatch = filterCategory === 'ALL' || threat.category === filterCategory;
    const qMatch =
      !searchQuery.trim() ||
      threat.ipAddress.includes(searchQuery) ||
      threat.targetResource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.details.toLowerCase().includes(searchQuery.toLowerCase());

    return catMatch && qMatch;
  });

  return (
    <div className="space-y-4">
      {/* Top Search & Filter */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threats by IP, resource, or details..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 font-bold focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Threat Categories</option>
          <option value="BRUTE_FORCE">Brute Force</option>
          <option value="SQL_INJECTION">SQL Injection</option>
          <option value="RATE_LIMIT_BREACH">Rate Limit Breach</option>
          <option value="GEO_MISMATCH">Geo Mismatch</option>
          <option value="COMPROMISED_TOKEN">Compromised Token</option>
          <option value="SUSPICIOUS_IP">Suspicious Proxy/VPN</option>
        </select>
      </div>

      {/* Threats Feed Table */}
      <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">IP Address</th>
                <th className="p-4">Threat Type</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Incident Details</th>
                <th className="p-4">Risk Severity</th>
                <th className="p-4">Block Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredThreats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-sans">
                    No active SIEM security threats detected matching filters.
                  </td>
                </tr>
              ) : (
                filteredThreats.map((threat) => {
                  const categoryBadge = THREAT_BADGES[threat.category];
                  return (
                    <tr key={threat.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> {threat.ipAddress}
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${categoryBadge.color}`}>
                          {categoryBadge.label}
                        </span>
                      </td>

                      <td className="p-4 text-indigo-300 font-bold text-[10px]">{threat.targetResource}</td>

                      <td className="p-4 text-[10px] text-slate-400 font-sans max-w-xs truncate">
                        {threat.details}
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                          threat.riskLevel === 'CRITICAL' ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {threat.riskLevel}
                        </span>
                      </td>

                      <td className="p-4">
                        {threat.isBlocked ? (
                          <span className="text-rose-400 font-bold text-[10px]">BLOCKED 🚫</span>
                        ) : (
                          <span className="text-amber-400 font-bold text-[10px]">FLAGGED ⚠️</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {threat.isBlocked ? (
                          <button
                            onClick={() => unblockIpAddress(threat.ipAddress)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => blockIpAddress(threat.ipAddress, threat.category, threat.details)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-extrabold"
                          >
                            Ban IP
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
