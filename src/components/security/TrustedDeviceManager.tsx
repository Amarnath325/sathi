'use client';

import React from 'react';
import { Laptop, Smartphone, Globe, ShieldCheck, LogOut, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSecurityControlsStore } from '@/lib/securityControlsStore';

export function TrustedDeviceManager() {
  const { trustedDevices, revokeDeviceSession, trustDeviceSession } = useSecurityControlsStore();

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Laptop className="w-4 h-4 text-purple-400" /> Trusted Devices & Active Sessions ({trustedDevices.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor registered user device fingerprints, IP locations, and perform immediate session token revocations
          </p>
        </div>
      </div>

      {/* Devices List */}
      <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">User & Device</th>
                <th className="p-4">Device Fingerprint</th>
                <th className="p-4">IP & Location</th>
                <th className="p-4">Trust Status</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4 text-right">Revocation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {trustedDevices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                    No active trusted device sessions registered.
                  </td>
                </tr>
              ) : (
                trustedDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4 font-sans">
                      <div className="font-extrabold text-white">{device.userName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{device.browserName}</div>
                    </td>

                    <td className="p-4 text-indigo-400 font-bold text-[10px]">{device.deviceFingerprint}</td>

                    <td className="p-4">
                      <div className="text-slate-200 text-[10px] flex items-center gap-1">
                        <Globe className="w-3 h-3 text-cyan-400" /> {device.ipAddress}
                      </div>
                      <div className="text-[9px] text-slate-500">{device.city}, {device.country}</div>
                    </td>

                    <td className="p-4 font-sans">
                      {device.isTrusted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Trusted Device
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                          <AlertTriangle className="w-3 h-3" /> Untrusted
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-slate-500 text-[10px]" suppressHydrationWarning>
                      {new Date(device.lastActiveAt).toLocaleString()}
                    </td>

                    <td className="p-4 text-right font-sans">
                      <button
                        onClick={() => revokeDeviceSession(device.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1 ml-auto transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Revoke Token
                      </button>
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
