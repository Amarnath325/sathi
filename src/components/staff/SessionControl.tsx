'use client';

import React from 'react';
import { Lock, LogOut, ShieldCheck, Key, Laptop, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStaffAccessStore } from '@/lib/staffAccessStore';

export function SessionControl() {
  const { activeSessions, terminateSession, global2faPolicyEnforced, toggleGlobal2FA } = useStaffAccessStore();

  return (
    <div className="space-y-6">
      {/* Global Security Policy Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Global 2FA / MFA Enforcement Policy</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mandate multi-factor TOTP authentication for all staff members accessing ERP modules
              </p>
            </div>
          </div>

          <button
            onClick={toggleGlobal2FA}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              global2faPolicyEnforced
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            {global2faPolicyEnforced ? '🛡️ Mandatory 2FA Active' : '⚪ Optional 2FA Mode'}
          </button>
        </div>
      </div>

      {/* Active Staff Sessions List */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Laptop className="w-4 h-4 text-indigo-400" /> Active Staff Sessions ({activeSessions.length})
        </h3>

        <div className="divide-y divide-slate-800/60">
          {activeSessions.map((session) => (
            <div key={session.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                  {session.device.includes('PC') || session.device.includes('Mac') ? (
                    <Laptop className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Smartphone className="w-4 h-4 text-purple-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">{session.staffName}</span>
                    {session.isCurrentSession && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{session.device}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {session.ipAddress} — {session.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-[10px] text-slate-500 font-mono hidden sm:block">
                  <div>Login: {new Date(session.loginAt).toLocaleTimeString()}</div>
                  <div>Active: {new Date(session.lastActiveAt).toLocaleTimeString()}</div>
                </div>

                {!session.isCurrentSession && (
                  <button
                    onClick={() => terminateSession(session.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Terminate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
