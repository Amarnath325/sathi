'use client';

import React, { useState } from 'react';
import { Calculator, ShieldCheck, DollarSign, Clock, Zap, Info } from 'lucide-react';

export function CategoryPriceEstimator() {
  const [hours, setHours] = useState(4);
  const [baseHourlyRate, setBaseHourlyRate] = useState(50);
  const [tierMultiplier, setTierMultiplier] = useState(1.35); // VIP default
  const [tierName, setTierName] = useState('VIP VERIFIED');

  const subtotal = Math.round(baseHourlyRate * hours * tierMultiplier);
  const platformEscrowFee = Math.round(subtotal * 0.05);
  const safetyGuaranteeFee = 5;
  const totalEscrowHold = subtotal + platformEscrowFee + safetyGuaranteeFee;

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm sm:text-base">Dynamic Escrow Pricing & Hourly Rate Estimator</h3>
            <p className="text-xs text-slate-400">Transparent Bank-Grade Calculation & Fee Breakdown</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold">
          100% Escrow Protected
        </span>
      </div>

      {/* Calculator Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        
        {/* Slider 1: Booking Hours */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Booking Duration:
            </span>
            <strong className="text-white text-sm">{hours} Hours</strong>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1 Hr</span>
            <span>6 Hrs</span>
            <span>12 Hrs</span>
          </div>
        </div>

        {/* Base Rate Selection */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Category Base Rate:
            </span>
            <strong className="text-emerald-400 text-sm">${baseHourlyRate}/hr</strong>
          </div>
          <div className="flex gap-1.5">
            {[35, 50, 75, 100].map((rate) => (
              <button
                key={rate}
                onClick={() => setBaseHourlyRate(rate)}
                className={`flex-1 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition-all ${
                  baseHourlyRate === rate
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ${rate}
              </button>
            ))}
          </div>
        </div>

        {/* Tier Selector */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Companion Tier:
            </span>
            <strong className="text-amber-400 text-xs">{tierName}</strong>
          </div>
          <div className="flex gap-1.5">
            {[
              { name: 'STANDARD', mult: 1.0, label: '1.0x' },
              { name: 'VIP VERIFIED', mult: 1.35, label: '1.35x' },
              { name: 'PLATINUM', mult: 1.8, label: '1.8x' }
            ].map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setTierMultiplier(t.mult);
                  setTierName(t.name);
                }}
                className={`flex-1 py-1.5 rounded-xl border text-[10px] font-mono font-bold transition-all ${
                  tierMultiplier === t.mult
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Calculated Breakdown Display */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-1">
          <span className="text-slate-400 block text-[11px]">Companion Fee ({hours} hrs @ ${baseHourlyRate}/hr × {tierMultiplier}x): <strong className="text-white">${subtotal}</strong></span>
          <span className="text-slate-400 block text-[11px]">Platform Escrow Protection Fee (5%): <strong className="text-indigo-300">${platformEscrowFee}</strong></span>
          <span className="text-slate-400 block text-[11px]">SOS Safety Guarantee & Insurance: <strong className="text-emerald-300">${safetyGuaranteeFee}.00</strong></span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-right">
          <span className="text-[10px] text-emerald-300 uppercase font-bold block">Total Escrow Hold Amount</span>
          <span className="text-2xl font-black text-white">${totalEscrowHold}.00</span>
        </div>
      </div>

    </div>
  );
}
