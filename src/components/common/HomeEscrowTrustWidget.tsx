'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Radio, Scale, Check, ChevronRight } from 'lucide-react';

export function HomeEscrowTrustWidget() {
  const [activeTab, setActiveTab] = useState<'kyc' | 'escrow' | 'sos' | 'arbitration'>('escrow');

  const tabs = [
    {
      id: 'kyc' as const,
      title: '12-Step Identity Verification',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      desc: 'Government ID verification, biometrics selfie match, police clearance check, and continuous AI monitoring.'
    },
    {
      id: 'escrow' as const,
      title: 'Bank-Grade Escrow Vault',
      icon: Lock,
      color: 'text-indigo-400',
      desc: 'Your payment is held safely in escrow. Funds are never released to the companion until both parties confirm completion.'
    },
    {
      id: 'sos' as const,
      title: '24/7 Panic SOS & Mic Telemetry',
      icon: Radio,
      color: 'text-rose-400',
      desc: 'Hands-free AI voice safe-words, 1-tap rapid dispatch, live encrypted microphone audio streaming, and police integration.'
    },
    {
      id: 'arbitration' as const,
      title: 'Neutral AI Dispute Verdicts',
      icon: Scale,
      color: 'text-amber-400',
      desc: 'Instant automated dispute verdicts powered by encrypted chat logs and 3-member peer community appeal panels.'
    }
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 shadow-2xl">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-bold uppercase tracking-wider">
          ZERO RISK MARKETPLACE GUARANTEE
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Built on Uncompromising <span className="bg-gradient-to-r from-emerald-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Safety Standards</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Every booking is protected under triple-layer security guarantees. Click any safety module to learn more.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-950 border-indigo-500/60 shadow-lg shadow-indigo-600/15'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${tab.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xs text-white">{tab.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Tab Detail Box */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left max-w-xl">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-bold uppercase ${currentTab.color}`}>
              {currentTab.title} Active Protection
            </span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{currentTab.desc}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-right shrink-0">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Guarantee Status</span>
          <strong className="text-emerald-400 font-bold flex items-center gap-1 mt-1">
            <Check className="w-4 h-4" /> 100% COVERED & ACTIVE
          </strong>
        </div>
      </div>

    </div>
  );
}
