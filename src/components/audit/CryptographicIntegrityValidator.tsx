'use client';

import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, Lock, AlertTriangle, Link, Zap } from 'lucide-react';
import { useAuditLogsStore } from '@/lib/auditLogsStore';

export function CryptographicIntegrityValidator() {
  const { auditLogs, isChainVerified, lastVerificationResult, verifyChainIntegrity } = useAuditLogsStore();

  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleRunVerification = () => {
    setIsVerifying(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVerifying(false);
          verifyChainIntegrity();
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Verification Hero Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">SHA-256 Cryptographic Hash Chain Verifier</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  IMMUTABLE LEDGER ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Recalculates sequential SHA-256 checksums from Genesis block to verify zero database record alteration
              </p>
            </div>
          </div>

          <button
            disabled={isVerifying}
            onClick={handleRunVerification}
            className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            {isVerifying ? 'Verifying Hashes...' : 'Run Ledger Hash Verification'}
          </button>
        </div>

        {/* Progress Bar */}
        {isVerifying && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono font-bold text-indigo-400">
              <span>Recalculating SHA-256 Checksums ({progress}%)</span>
              <span>Scanning Block #{Math.ceil((progress / 100) * auditLogs.length)} / {auditLogs.length}</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-500 h-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Verification Summary Metrics */}
        {lastVerificationResult && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-bold block">Total Audit Entries Checked</span>
              <span className="text-xl font-extrabold text-white font-mono">{lastVerificationResult.totalChecked} Records</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-bold block">Valid Cryptographic Hashes</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> {lastVerificationResult.validCount} Valid
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-bold block">Tampered / Corrupted Records</span>
              <span className="text-xl font-extrabold text-slate-400 font-mono">
                {lastVerificationResult.corruptedCount === 0 ? '0 Tampered' : `${lastVerificationResult.corruptedCount} Tampered ⚠️`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
