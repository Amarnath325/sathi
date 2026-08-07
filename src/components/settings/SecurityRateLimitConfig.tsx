'use client';

import React, { useState } from 'react';
import { Shield, Lock, Globe, Zap, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useSystemSettingsStore } from '@/lib/systemSettingsStore';

export function SecurityRateLimitConfig() {
  const { security, updateSecuritySettings } = useSystemSettingsStore();
  const [newOrigin, setNewOrigin] = useState('');

  const handleAddOrigin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrigin.trim()) return;
    updateSecuritySettings({
      corsOrigins: [...new Set([...security.corsOrigins, newOrigin.trim()])],
    });
    setNewOrigin('');
  };

  const handleRemoveOrigin = (origin: string) => {
    updateSecuritySettings({
      corsOrigins: security.corsOrigins.filter((o) => o !== origin),
    });
  };

  return (
    <div className="space-y-6">
      {/* Rate Limits & Expiry */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Zap className="w-4 h-4 text-cyan-400" /> REST API Throttling & Rate Limits
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-slate-300">Max Global REST Requests Per Minute</label>
            <span className="font-mono font-extrabold text-cyan-400">{security.rateLimitRequestsPerMin} req/min</span>
          </div>
          <input
            type="range"
            min={100}
            max={3000}
            step={100}
            value={security.rateLimitRequestsPerMin}
            onChange={(e) => updateSecuritySettings({ rateLimitRequestsPerMin: Number(e.target.value) })}
            className="w-full accent-cyan-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
          />
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-slate-300">JWT Token Expiration Window (Hours)</label>
            <span className="font-mono font-extrabold text-indigo-400">{security.jwtExpiryHours} Hours</span>
          </div>
          <input
            type="range"
            min={1}
            max={72}
            step={1}
            value={security.jwtExpiryHours}
            onChange={(e) => updateSecuritySettings({ jwtExpiryHours: Number(e.target.value) })}
            className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* CORS Whitelist */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Globe className="w-4 h-4 text-emerald-400" /> CORS Allowed Domain Origins
        </h3>

        <form onSubmit={handleAddOrigin} className="flex gap-2">
          <input
            type="text"
            value={newOrigin}
            onChange={(e) => setNewOrigin(e.target.value)}
            placeholder="e.g. https://mobile-app.sathi.io"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold flex items-center gap-1 hover:opacity-90 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Origin
          </button>
        </form>

        <div className="space-y-2">
          {security.corsOrigins.map((origin) => (
            <div key={origin} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
              <span className="text-emerald-400 font-bold">{origin}</span>
              <button
                onClick={() => handleRemoveOrigin(origin)}
                className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
