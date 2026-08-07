'use client';

import React from 'react';
import { Sliders, ShieldAlert, Lock, Clock, Key, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { useSecurityControlsStore } from '@/lib/securityControlsStore';

export function SecurityPolicyConfig() {
  const { policy, updatePolicy, toggleEmergencyLockdown } = useSecurityControlsStore();

  return (
    <div className="space-y-6">
      {/* Panic Switch Card */}
      <div className={`p-6 rounded-3xl border transition-all ${
        policy.isEmergencyLockdown
          ? 'bg-rose-950/40 border-rose-500 shadow-2xl shadow-rose-900/50 animate-pulse'
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              policy.isEmergencyLockdown ? 'bg-rose-500 text-white border-rose-400' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                Emergency Platform Lockdown Switch
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Immediately block all non-admin customer API requests, freeze session tokens, and trigger security isolation
              </p>
            </div>
          </div>

          <button
            onClick={toggleEmergencyLockdown}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl ${
              policy.isEmergencyLockdown
                ? 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-400'
                : 'bg-slate-950 hover:bg-rose-950 text-rose-400 border border-rose-500/40'
            }`}
          >
            {policy.isEmergencyLockdown ? '⚠️ LOCKDOWN ACTIVE (CLICK TO RELEASE)' : '🚨 TRIGGER EMERGENCY LOCKDOWN'}
          </button>
        </div>
      </div>

      {/* Security Parameters Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session & Retry Thresholds */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h4 className="text-xs font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-indigo-400" /> Session & Authentication Timers
          </h4>

          {/* Max Failed Logins */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-bold text-slate-300">Max Failed Login Retries before Lockout</label>
              <span className="font-mono font-extrabold text-indigo-400">{policy.maxFailedLogins} Attempts</span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              value={policy.maxFailedLogins}
              onChange={(e) => updatePolicy({ maxFailedLogins: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Session Timeout */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-bold text-slate-300">Session Inactivity Timeout</label>
              <span className="font-mono font-extrabold text-indigo-400">{policy.sessionTimeoutMinutes} Minutes</span>
            </div>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={policy.sessionTimeoutMinutes}
              onChange={(e) => updatePolicy({ sessionTimeoutMinutes: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Password & Credentials Policy */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h4 className="text-xs font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Key className="w-4 h-4 text-emerald-400" /> Credential Hardening Rules
          </h4>

          {/* Password Expiry Days */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-bold text-slate-300">Mandatory Password Rotation Interval</label>
              <span className="font-mono font-extrabold text-emerald-400">{policy.passwordExpiryDays} Days</span>
            </div>
            <input
              type="range"
              min={30}
              max={180}
              step={15}
              value={policy.passwordExpiryDays}
              onChange={(e) => updatePolicy({ passwordExpiryDays: Number(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Special Character Switch */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Require Special Characters & Numbers</span>
              <span className="text-[10px] text-slate-400">Enforce minimum 12 chars with symbol requirement</span>
            </div>
            <input
              type="checkbox"
              checked={policy.requireSpecialChars}
              onChange={(e) => updatePolicy({ requireSpecialChars: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
