'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, QrCode, X, Copy, Check } from 'lucide-react';

interface E2EFingerprintModalProps {
  companionName: string;
  onClose: () => void;
}

export default function E2EFingerprintModal({ companionName, onClose }: E2EFingerprintModalProps) {
  const [copied, setCopied] = useState(false);

  // Simulated 64-character cryptographic safety key fingerprint
  const fingerprintKey = "4A9F-88B1-C03E-7D92-11A0-3E4F-99B2-C11D-5E2A-7F89-0012-3456-789A-BCDE";

  const handleCopy = () => {
    navigator.clipboard.writeText(fingerprintKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel border border-emerald-500/40 rounded-3xl p-6 relative space-y-6 shadow-2xl overflow-hidden text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center justify-center gap-1.5">
            E2E Encryption Safety Key Verification
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Compare this 64-bit cryptographic fingerprint with {companionName} to verify end-to-end signal safety.
          </p>
        </div>

        {/* QR Code Placeholder */}
        <div className="w-40 h-40 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-slate-700">
          <QrCode className="w-32 h-32 text-slate-950" />
        </div>

        {/* Cryptographic Key Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-left">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>SIGNAL SAFETY KEY FINGERPRINT</span>
            <button onClick={handleCopy} className="text-indigo-400 hover:underline flex items-center gap-1">
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs font-mono text-emerald-400 font-bold break-all leading-relaxed">
            {fingerprintKey}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl gradient-bg-primary text-xs font-bold text-white hover:opacity-90"
        >
          Verify Safety Key
        </button>
      </div>
    </div>
  );
}
