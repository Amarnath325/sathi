'use client';

import React, { useState } from 'react';
import { Globe, Plus, Trash2, Shield, Lock, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useSecurityControlsStore } from '@/lib/securityControlsStore';

export function IpWhitelistManager() {
  const { policy, addWhitelistedIp, removeWhitelistedIp, blockIpAddress, unblockIpAddress } = useSecurityControlsStore();

  const [newIpRange, setNewIpRange] = useState('');
  const [newBlockIp, setNewBlockIp] = useState('');

  const handleAddWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpRange.trim()) return;
    addWhitelistedIp(newIpRange);
    setNewIpRange('');
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockIp.trim()) return;
    blockIpAddress(newBlockIp.trim(), 'SUSPICIOUS_IP', 'Manual administrator IP ban');
    setNewBlockIp('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" /> Network Security & IP Access Rules
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure allowed CIDR subnet ranges and restrict malicious IP addresses from accessing ERP endpoints
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Whitelisted IP Subnets */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Whitelisted IP Subnets (CIDR)
          </h4>

          <form onSubmit={handleAddWhitelist} className="flex gap-2">
            <input
              value={newIpRange}
              onChange={(e) => setNewIpRange(e.target.value)}
              placeholder="e.g. 192.168.10.0/24"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold flex items-center gap-1 hover:opacity-90 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add CIDR
            </button>
          </form>

          <div className="space-y-2">
            {policy.whitelistedIpRanges.map((ip) => (
              <div key={ip} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-emerald-400 font-bold">{ip}</span>
                <button
                  onClick={() => removeWhitelistedIp(ip)}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Blacklisted IP Addresses */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" /> Blacklisted IP Addresses
          </h4>

          <form onSubmit={handleAddBlock} className="flex gap-2">
            <input
              value={newBlockIp}
              onChange={(e) => setNewBlockIp(e.target.value)}
              placeholder="e.g. 185.220.101.4"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <Lock className="w-4 h-4" /> Ban IP
            </button>
          </form>

          <div className="space-y-2">
            {policy.blacklistedIps.map((ip) => (
              <div key={ip} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-rose-400 font-bold">{ip}</span>
                <button
                  onClick={() => unblockIpAddress(ip)}
                  className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
