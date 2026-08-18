'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CancellationCalculator } from '@/lib/serviceHubEngines';
import { Clock, Calculator, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

export function BookingCancellationTab() {
  const { bookingRules } = useServiceHubStore();
  const rule = bookingRules[0];

  const [paidAmt, setPaidAmt] = useState(2000);
  const [cancelHoursPrior, setCancelHoursPrior] = useState(18);

  const calc = rule ? CancellationCalculator.calculateRefund(paidAmt, cancelHoursPrior, rule) : null;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(bookingRules, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `booking_rules_export_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Rules Overview */}
        {rule && (
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="font-extrabold text-white text-base">{rule.name}</h4>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                {[
                  { label: 'Min Advance', value: `${rule.min_advance_hours}h`, color: 'text-indigo-400' },
                  { label: 'Max Advance', value: `${rule.max_advance_days} days`, color: 'text-blue-400' },
                  { label: 'Instant Book', value: rule.instant_booking_allowed ? 'Allowed' : 'Requires Approval', color: rule.instant_booking_allowed ? 'text-emerald-400' : 'text-amber-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase block">{label}</span>
                    <span className={`font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Duration Limits */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase block">Min Duration</span>
                  <span className="font-bold text-white">{rule.min_duration_hours}h</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase block">Max Duration</span>
                  <span className="font-bold text-white">{rule.max_duration_hours}h</span>
                </div>
              </div>
            </div>

            {/* Tiered Cancellation Schedule */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h5 className="font-bold text-indigo-400 text-sm">Tiered Cancellation Refund Schedule</h5>
              <div className="space-y-2">
                {rule.cancellation_rules.tiers.map((tier, idx) => {
                  const isHighRefund = tier.refundPercentage >= 80;
                  const isMidRefund = tier.refundPercentage >= 50;
                  return (
                    <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border gap-2 ${
                      isHighRefund ? 'bg-emerald-500/5 border-emerald-500/20' : isMidRefund ? 'bg-amber-500/5 border-amber-500/20' : 'bg-rose-500/5 border-rose-500/20'
                    }`}>
                      <div className="flex items-center gap-2">
                        {isHighRefund ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        <span className="text-xs text-slate-300 font-mono">Cancelled <strong className="text-white">&gt;{tier.hoursBeforeBooking}h</strong> prior to booking</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
                        <span className={`font-extrabold ${isHighRefund ? 'text-emerald-400' : isMidRefund ? 'text-amber-400' : 'text-rose-400'}`}>
                          {tier.refundPercentage}% Refund
                        </span>
                        <span className="text-slate-500">|</span>
                        <span className="text-rose-400">{tier.cancellationFeePercent}% Fee</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Live Refund Calculator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 h-fit shadow-2xl sticky top-4">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" /> Tiered Refund Calculator
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Total Paid Amount (₹)</label>
              <input
                type="number"
                value={paidAmt}
                onChange={e => setPaidAmt(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold outline-none focus:border-indigo-500 transition-colors"
                min={100}
                step={100}
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Cancellation Time: <span className="text-white font-mono">{cancelHoursPrior}h prior</span></label>
              <input
                type="range" min={0} max={48} value={cancelHoursPrior}
                onChange={e => setCancelHoursPrior(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 rounded-full"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>0h (Booking Time)</span><span>48h+ Prior</span></div>
            </div>
          </div>

          {calc && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <p className="text-indigo-300 text-[11px] leading-snug font-sans">{calc.policyTierMessage}</p>
              <div className="space-y-2 pt-2 border-t border-slate-800 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="font-bold text-white">₹{paidAmt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Refund:</span>
                  <span className="font-bold text-emerald-400">₹{calc.refundAmount} ({calc.refundPercent}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fee Charged:</span>
                  <span className="text-rose-400">₹{calc.feeAmount} ({calc.feePercent}%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
