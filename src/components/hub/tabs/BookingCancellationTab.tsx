'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CancellationCalculator } from '@/lib/serviceHubEngines';
import { Clock, Calendar, Calculator, Check, Hourglass, RotateCcw } from 'lucide-react';

export function BookingCancellationTab() {
  const { bookingRules } = useServiceHubStore();
  const rule = bookingRules[0];

  const [paidAmt, setPaidAmt] = useState(2000);
  const [cancelHoursPrior, setCancelHoursPrior] = useState(18);

  const calc = rule ? CancellationCalculator.calculateRefund(paidAmt, cancelHoursPrior, rule) : null;

  return (
    <div className="space-y-3 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        
        {/* Left Main Column: Standard Booking & Cancellation Policy */}
        {rule && (
          <div className="lg:col-span-2 space-y-3">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5">
              <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">
                Standard Booking & Cancellation Policy
              </h4>

              {/* Top Parameter Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Min Advance */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-full border border-purple-400 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">MIN ADVANCE</span>
                    <span className="text-sm font-extrabold text-slate-900 block">{rule.min_advance_hours}h</span>
                  </div>
                </div>

                {/* Max Advance */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-full border border-purple-400 text-purple-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">MAX ADVANCE</span>
                    <span className="text-sm font-extrabold text-slate-900 block">{rule.max_advance_days} days</span>
                  </div>
                </div>

                {/* Instant Book */}
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-full border border-emerald-400 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">INSTANT BOOK</span>
                    <span className="text-sm font-extrabold text-emerald-700 block">
                      {rule.instant_booking_allowed ? 'Allowed' : 'Requires Approval'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle 2 Parameter Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-full border border-purple-300 text-purple-600 flex items-center justify-center shrink-0">
                    <Hourglass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">MIN DURATION</span>
                    <span className="text-sm font-extrabold text-slate-900 block">{rule.min_duration_hours}h</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-full border border-purple-300 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">MAX DURATION</span>
                    <span className="text-sm font-extrabold text-slate-900 block">{rule.max_duration_hours}h</span>
                  </div>
                </div>
              </div>

              {/* Tiered Cancellation Refund Schedule */}
              <div className="space-y-2 pt-1">
                <h5 className="font-extrabold text-slate-900 text-xs">Tiered Cancellation Refund Schedule</h5>
                
                <div className="space-y-2">
                  {rule.cancellation_rules.tiers.map((tier, idx) => {
                    const isHighRefund = tier.refundPercentage >= 80;
                    const isMidRefund = tier.refundPercentage >= 50;

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/90 text-[11px] flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div>
                          <p className="font-extrabold text-slate-900 text-[11px]">
                            {tier.hoursBeforeBooking > 0 ? `More than ${tier.hoursBeforeBooking} Hours Prior` : 'Less than Minimum Window'}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">Fee: {tier.cancellationFeePercent}% penalty</p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono border ${
                            isHighRefund
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isMidRefund
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {tier.refundPercentage}% Refund
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Simulator Column */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-purple-600" /> Cancellation Refund Calculator
          </h4>

          <div className="space-y-3 text-[11px]">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Paid Amount (₹)</label>
              <input
                type="number"
                value={paidAmt}
                onChange={e => setPaidAmt(Number(e.target.value))}
                className="w-full bg-white border border-slate-200/90 rounded-xl p-2 text-[11px] text-slate-900 font-bold outline-none focus:border-purple-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Hours Before Booking: <span className="text-purple-700 font-bold font-mono">{cancelHoursPrior} hours</span>
              </label>
              <input
                type="range"
                min={0}
                max={48}
                value={cancelHoursPrior}
                onChange={e => setCancelHoursPrior(Number(e.target.value))}
                className="w-full accent-purple-600 h-1 rounded-full bg-slate-200"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 font-medium"><span>0h (No Show)</span><span>48h</span></div>
            </div>
          </div>

          {/* Breakdown Box */}
          {calc && (
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/90 font-mono text-[11px] space-y-1.5">
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-sans">Refund Percentage:</span>
                <span className="font-extrabold text-slate-900">{calc.refundPercent}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-sans">Cancellation Fee:</span>
                <span className="font-bold text-rose-600">₹{calc.feeAmount}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-200/90 flex justify-between items-center font-sans font-extrabold text-xs">
                <span className="text-slate-900">Refund Amount:</span>
                <span className="text-emerald-600 text-sm font-mono">₹{calc.refundAmount}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
