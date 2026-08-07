'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, ShieldAlert, Globe, Sliders, Laptop, AlertOctagon, Key, CheckCircle2 } from 'lucide-react';
import { TwoFactorSetupWizard } from '@/components/security/TwoFactorSetupWizard';
import { IpWhitelistManager } from '@/components/security/IpWhitelistManager';
import { ThreatMonitor } from '@/components/security/ThreatMonitor';
import { SecurityPolicyConfig } from '@/components/security/SecurityPolicyConfig';
import { TrustedDeviceManager } from '@/components/security/TrustedDeviceManager';
import { useSecurityControlsStore } from '@/lib/securityControlsStore';

export default function AdminSecurityControlsPage() {
  const [activeTab, setActiveTab] = useState<'2fa' | 'ip' | 'threats' | 'policy' | 'devices'>('2fa');
  const { user2FA, policy, threats, trustedDevices, toggleEmergencyLockdown } = useSecurityControlsStore();

  const blockedCount = policy.blacklistedIps.length;
  const activeThreatsCount = threats.filter((t) => t.isBlocked).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Emergency Lockdown Panic Banner */}
        {policy.isEmergencyLockdown && (
          <div className="p-4 rounded-3xl bg-rose-600 text-white font-extrabold flex items-center justify-between shadow-2xl shadow-rose-900/80 animate-pulse border border-rose-400">
            <div className="flex items-center gap-3">
              <AlertOctagon className="w-6 h-6 shrink-0" />
              <div>
                <div className="text-sm uppercase tracking-widest">⚠️ EMERGENCY PLATFORM LOCKDOWN IS CURRENTLY ACTIVE</div>
                <div className="text-xs font-medium text-rose-150">All non-admin API authentication requests are frozen across all nodes.</div>
              </div>
            </div>
            <button
              onClick={toggleEmergencyLockdown}
              className="px-4 py-2 rounded-xl bg-white text-rose-900 text-xs font-black hover:bg-slate-100 shrink-0"
            >
              Release Lockdown
            </button>
          </div>
        )}

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Lock className="w-6 h-6 text-indigo-400" /> Security Controls & 2FA Enforcement
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                SIEM Shield Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-Factor Authentication (2FA/MFA) enforcement, IP whitelisting, SIEM threat monitoring, and emergency lockdown controls
            </p>
          </div>

          <button
            onClick={toggleEmergencyLockdown}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-xl ${
              policy.isEmergencyLockdown
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {policy.isEmergencyLockdown ? 'Release Lockdown' : 'Emergency Lockdown Panic'}
          </button>
        </div>

        {/* Quick Security Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>2FA Authenticator Status</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">
              {user2FA.isEnabled ? 'ACTIVE (TOTP)' : 'UNPROTECTED'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Primary auth method</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Whitelisted CIDR Ranges</span>
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{policy.whitelistedIpRanges.length} Subnets</div>
            <div className="text-[10px] text-slate-500 font-mono">Trusted corporate IPs</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Blocked Malicious IPs</span>
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold text-rose-400">{blockedCount} Banned</div>
            <div className="text-[10px] text-slate-500 font-mono">{activeThreatsCount} active threat alerts</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Session Inactivity Limit</span>
              <Sliders className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{policy.sessionTimeoutMinutes} Mins</div>
            <div className="text-[10px] text-slate-500 font-mono">Max failed retries: {policy.maxFailedLogins}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800">
          {[
            { id: '2fa', label: '🛡️ 2FA & MFA Enforcement', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'ip', label: '🌐 IP Whitelist & Geo-Lock', icon: <Globe className="w-4 h-4" /> },
            { id: 'threats', label: '🚨 SIEM Threat Monitor', icon: <ShieldAlert className="w-4 h-4" /> },
            { id: 'policy', label: '⚙️ Security Policies & Lockdown', icon: <Sliders className="w-4 h-4" /> },
            { id: 'devices', label: '📱 Trusted Devices & Tokens', icon: <Laptop className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'gradient-bg-primary text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === '2fa' && <TwoFactorSetupWizard />}
          {activeTab === 'ip' && <IpWhitelistManager />}
          {activeTab === 'threats' && <ThreatMonitor />}
          {activeTab === 'policy' && <SecurityPolicyConfig />}
          {activeTab === 'devices' && <TrustedDeviceManager />}
        </div>
      </div>
    </div>
  );
}
