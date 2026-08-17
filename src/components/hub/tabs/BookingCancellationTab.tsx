'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CancellationCalculator } from '@/lib/serviceHubEngines';
import { Clock, Calculator, CheckCircle2 } from 'lucide-react';

export function BookingCancellationTab() {
  const { bookingRules } = useServiceHubStore();
  const rule = bookingRules[0];

  const [paidAmt, setPaidAmt] = useState(2000);
  const [cancelHoursPrior, setCancelHoursPrior] = useState(18);

  const calc = rule ? CancellationCalculator.calculateRefund(paidAmt, cancelHoursPrior, rule) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Module 9: Booking Rules & Tiered Cancellation Policy
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configurable advance booking windows, duration limits, instant booking, and tiered cancellation refund percentages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Rules Overview */}
        {rule && (
          <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="font-extrabold text-white text-base">{rule.name}</h4>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Min Advance:</span>
                <span className="font-bold text-white">{rule.min_advance_hours} hours</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Max Advance:</span>
                <span className="font-bold text-white">{rule.max_advance_days} days</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Instant Booking:</span>
                <span className="font-bold text-emerald-400">{rule.instant_booking_allowed ? 'Allowed' : 'Requires Approval'}</span>
              </div>
            </div>

            {/* Tiered Cancellation Window */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <h5 className="font-bold text-indigo-400">Tiered Cancellation Refund Schedule:</h5>
              {rule.cancellation_rules.tiers.map((tier, idx) => (
                <div key={idx} className="flex justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-300">
                  <span>Cancelled &gt; {tier.hoursBeforeBooking} hours prior:</span>
                  <span className="font-bold text-emerald-400">{tier.refundPercentage}% Refund ({tier.cancellationFeePercent}% Fee)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Cancellation Refund Calculator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 h-fit shadow-2xl">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" /> Tiered Refund Calculator
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Total Paid Amount (₹)</label>
              <input
                type="number"
                value={paidAmt}
                onChange={(e) => setPaidAmt(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Cancellation Time ({cancelHoursPrior}h prior)</label>
              <input
                type="range"
                min={0}
                max={48}
                value={cancelHoursPrior}
                onChange={(e) => setCancelHoursPrior(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {calc && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <p className="text-indigo-300 text-[11px] leading-tight font-sans">{calc.policyTierMessage}</p>
              <div className="flex justify-between text-emerald-400 font-bold pt-1">
                <span>Refund Issued:</span>
                <span>₹{calc.refundAmount} ({calc.refundPercent}%)</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Cancellation Fee:</span>
                <span>₹{calc.feeAmount} ({calc.feePercent}%)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
