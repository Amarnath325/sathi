'use client';

import React from 'react';
import { DollarSign, Percent, ShieldCheck, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useSystemSettingsStore } from '@/lib/systemSettingsStore';

export function FinanceCommissionForm() {
  const { finance, updateFinanceSettings, resetCategoryDefaults } = useSystemSettingsStore();
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Finance, Escrow & Commission Rate Rules
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure platform take-rate %, escrow retention hold periods, minimum payout limits, and Tax EIN
          </p>
        </div>

        <button
          type="button"
          onClick={() => resetCategoryDefaults('FINANCE')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commission Rate % */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-slate-300">Platform Escrow Commission Take-Rate</label>
            <span className="font-mono font-extrabold text-emerald-400">{finance.commissionRatePercent}% Fee</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={0.5}
            value={finance.commissionRatePercent}
            onChange={(e) => updateFinanceSettings({ commissionRatePercent: Number(e.target.value) })}
            className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-500">Deducted automatically from companion payout on escrow release</p>
        </div>

        {/* Cancellation Fee % */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-slate-300">Late Cancellation Penalty Rate</label>
            <span className="font-mono font-extrabold text-amber-400">{finance.cancellationFeePercent}% Penalty</span>
          </div>
          <input
            type="range"
            min={0}
            max={25}
            step={1}
            value={finance.cancellationFeePercent}
            onChange={(e) => updateFinanceSettings({ cancellationFeePercent: Number(e.target.value) })}
            className="w-full accent-amber-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-500">Applied when user cancels booking within 2 hours of dispatch</p>
        </div>

        {/* Min Payout Threshold */}
        <div>
          <label className="text-xs font-bold text-slate-300">Minimum Companion Payout Threshold ($)</label>
          <input
            type="number"
            value={finance.minPayoutThresholdUsd}
            onChange={(e) => updateFinanceSettings({ minPayoutThresholdUsd: Number(e.target.value) })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Escrow Hold Days */}
        <div>
          <label className="text-xs font-bold text-slate-300">Escrow Retention Hold Period (Days)</label>
          <input
            type="number"
            value={finance.escrowHoldDays}
            onChange={(e) => updateFinanceSettings({ escrowHoldDays: Number(e.target.value) })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Tax EIN */}
        <div>
          <label className="text-xs font-bold text-slate-300">Corporate Tax EIN / GST Number</label>
          <input
            type="text"
            value={finance.taxRegistrationNumber}
            onChange={(e) => updateFinanceSettings({ taxRegistrationNumber: e.target.value })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Auto Payout Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <span className="text-xs font-bold text-white block">Automated Companion Payout Dispatches</span>
            <span className="text-[10px] text-slate-400">Trigger payout transfers automatically on escrow maturity</span>
          </div>
          <input
            type="checkbox"
            checked={finance.autoPayoutEnabled}
            onChange={(e) => updateFinanceSettings({ autoPayoutEnabled: e.target.checked })}
            className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {saved ? (
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Finance & escrow rules saved!
          </span>
        ) : (
          <span className="text-[11px] text-slate-500">Escrow rates take effect immediately on new bookings</span>
        )}

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30"
        >
          <Save className="w-4 h-4" /> Save Financial Parameters
        </button>
      </div>
    </form>
  );
}
