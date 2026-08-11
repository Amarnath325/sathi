'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  Smartphone, 
  Globe, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Laptop, 
  Zap,
  Activity
} from 'lucide-react';
import { ZeroTrustSecurityEngine, ActiveSession } from '@/lib/zeroTrustSecurityEngine';

interface SecurityControlCenterWidgetProps {
  onOpenAuditModal?: () => void;
}

export function SecurityControlCenterWidget({ onOpenAuditModal }: SecurityControlCenterWidgetProps) {
  const [sessions, setSessions] = useState<ActiveSession[]>(ZeroTrustSecurityEngine.getMockSessions());
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [keyRotationDate, setKeyRotationDate] = useState('2026-08-11 12:00:00 UTC');
  const [notification, setNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRevokeSession = (sessionId: string, deviceName: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    triggerToast(`Session revoked for "${deviceName}". Token invalidated.`);
  };

  const handleRotateEncryptionKey = () => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    setKeyRotationDate(now);
    triggerToast('AES-256 Escrow Vault encryption key rotated successfully!');
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-4 right-4 z-20 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header & Threat Gauge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              Zero-Trust Security Operations Center (SOC)
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                PROTECTED
              </span>
            </h3>
            <p className="text-xs text-slate-400">Real-Time Threat Detection, PII Privacy Shield & Active Session Isolation</p>
          </div>
        </div>

        {/* Threat Level Status Gauge */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 shrink-0">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <span className="text-[10px] text-slate-500 font-mono block uppercase font-bold">Current Threat Level</span>
            <span className="text-xs font-black text-emerald-400 font-mono tracking-wider">LEVEL 0 (SAFE / NOMINAL)</span>
          </div>
        </div>
      </div>

      {/* Top 3 Security Controls Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        
        {/* Card 1: Stealth Privacy Mode */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold flex items-center gap-1.5 text-[11px]">
              {isStealthMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-indigo-400" />}
              Stealth PII Shield:
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${isStealthMode ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-400'}`}>
              {isStealthMode ? 'ACTIVE' : 'STANDARD'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
            Auto-masks phone numbers, emails & Govt IDs across all public queries.
          </p>
          <button
            onClick={() => {
              setIsStealthMode(!isStealthMode);
              triggerToast(`Stealth PII Shield ${!isStealthMode ? 'ENABLED' : 'DISABLED'}.`);
            }}
            className={`w-full py-2 rounded-xl border text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 ${
              isStealthMode 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30' 
                : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
            }`}
          >
            {isStealthMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isStealthMode ? 'Disable Stealth Mode' : 'Enable Stealth Mode'}
          </button>
        </div>

        {/* Card 2: 256-Bit Vault Key Rotation */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold flex items-center gap-1.5 text-[11px]">
              <Key className="w-4 h-4 text-emerald-400" /> AES-256 Vault Key:
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">VALID</span>
          </div>
          <p className="text-[10px] text-slate-500 font-sans truncate" title={keyRotationDate}>
            Last rotated: {keyRotationDate}
          </p>
          <button
            onClick={handleRotateEncryptionKey}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Rotate Encryption Keys
          </button>
        </div>

        {/* Card 3: Security Audit & Logs */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold flex items-center gap-1.5 text-[11px]">
              <Activity className="w-4 h-4 text-purple-400" /> Threat Log Audit:
            </span>
            <span className="text-[10px] text-purple-300 font-bold">4 EVENTS</span>
          </div>
          <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
            Biometric WebAuthn & Zero-Trust rate limiting logs active.
          </p>
          <button
            onClick={onOpenAuditModal}
            className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Open Security Audit Log
          </button>
        </div>

      </div>

      {/* Active Session Isolation List */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-indigo-400" /> Active Logged-In Sessions ({sessions.length})
            </h4>
            <p className="text-[11px] text-slate-400">Revoke untrusted devices instantly to invalidate session tokens.</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          {sessions.map(sess => (
            <div key={sess.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-white font-bold text-xs">{sess.deviceName}</strong>
                  {sess.isCurrentDevice && (
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-[9px] font-bold">
                      THIS DEVICE
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-500" /> IP: {sess.ipAddress}</span>
                  <span>•</span>
                  <span>{sess.location}</span>
                  <span>•</span>
                  <span className="text-slate-500">{sess.lastActive}</span>
                </div>
              </div>

              {!sess.isCurrentDevice && (
                <button
                  onClick={() => handleRevokeSession(sess.id, sess.deviceName)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                >
                  <XCircle className="w-3.5 h-3.5" /> Revoke & Lock
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
