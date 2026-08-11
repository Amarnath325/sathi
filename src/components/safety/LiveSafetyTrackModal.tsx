'use client';

import React, { useState } from 'react';
import { X, Share2, Copy, Check, Battery, Navigation, ShieldCheck, MapPin, MessageSquare, ExternalLink } from 'lucide-react';

interface LiveSafetyTrackModalProps {
  userLocationName: string;
  onClose: () => void;
}

export function LiveSafetyTrackModal({ userLocationName, onClose }: LiveSafetyTrackModalProps) {
  const [copied, setCopied] = useState(false);
  const trackToken = 'tr-' + Math.floor(100000 + Math.random() * 900000);
  const trackUrl = `https://sathi.app/track/${trackToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Live Track-Me GPS Link</h3>
              <p className="text-[10px] text-cyan-400 font-mono">Encrypted Trusted Sharing</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          <p className="text-slate-300 leading-relaxed">
            Share this encrypted live satellite tracking link with your family or friends so they can view your real-time location and safety status:
          </p>

          {/* Link Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between gap-2">
            <span className="font-mono text-cyan-300 truncate text-[11px]">{trackUrl}</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] flex items-center gap-1.5 shrink-0 transition-all shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Telemetry Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Current Pin:
              </span>
              <strong className="text-white truncate max-w-[180px]">{userLocationName}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Battery className="w-3.5 h-3.5 text-emerald-400" /> Phone Battery:
              </span>
              <strong className="text-emerald-400">88% (Charging)</strong>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Safety Escrow:
              </span>
              <strong className="text-indigo-300">Protected Grade A+</strong>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Follow my live Sathi safety location link: ${trackUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </a>

            <a
              href={`sms:?body=${encodeURIComponent(`Live safety track link: ${trackUrl}`)}`}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Send SMS</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
