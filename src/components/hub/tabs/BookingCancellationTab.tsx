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
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Main Column: Standard Booking & Cancellation Policy */}
        {rule && (
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
              <h4 className="font-extrabold text-slate-900 text-xl tracking-tight">
                Standard Booking & Cancellation Policy
              </h4>

              {/* Top 3 Parameter Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Min Advance */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-purple-400 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase block">MIN ADVANCE</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-0.5">{rule.min_advance_hours}h</span>
                  </div>
                </div>

                {/* Max Advance */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-purple-400 text-purple-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase block">MAX ADVANCE</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-0.5">{rule.max_advance_days} days</span>
                  </div>
                </div>

                {/* Instant Book */}
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-400 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase block">INSTANT BOOK</span>
                    <span className="text-xl font-extrabold text-emerald-700 block mt-0.5">
                      {rule.instant_booking_allowed ? 'Allowed' : 'Requires Approval'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle 2 Parameter Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-purple-300 text-purple-600 flex items-center justify-center shrink-0">
                    <Hourglass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase block">MIN DURATION</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-0.5">{rule.min_duration_hours}h</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-purple-300 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase block">MAX DURATION</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-0.5">{rule.max_duration_hours}h</span>
                  </div>
                </div>
              </div>

              {/* Tiered Cancellation Refund Schedule */}
              <div className="space-y-3 pt-2">
                <h5 className="font-extrabold text-slate-900 text-sm">Tiered Cancellation Refund Schedule</h5>
                
                <div className="space-y-2.5">
                  {rule.cancellation_rules.tiers.map((tier, idx) => {
                    const isHighRefund = tier.refundPercentage >= 80;
                    const isMidRefund = tier.refundPercentage >= 50;

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border gap-3 shadow-2xs ${
                          isHighRefund
                            ? 'bg-emerald-50/70 border-emerald-200/80'
                            : isMidRefund
                            ? 'bg-amber-50/70 border-amber-200/80'
                            : 'bg-orange-50/70 border-orange-200/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className={`w-5 h-5 ${isHighRefund ? 'text-emerald-600' : isMidRefund ? 'text-amber-600' : 'text-orange-600'}`} />
                          <span className="text-xs font-extrabold text-slate-900">
                            Cancelled &gt;{tier.hoursBeforeBooking}h prior to booking
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs shrink-0">
                          <span className={`px-3 py-1 rounded-lg font-extrabold ${
                            isHighRefund ? 'bg-emerald-100/90 text-emerald-800' : isMidRefund ? 'bg-amber-100/90 text-amber-800' : 'bg-orange-100/90 text-orange-800'
                          }`}>
                            {tier.refundPercentage}% Refund
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="font-extrabold text-slate-800">{tier.cancellationFeePercent}% Fee</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Right Column: Live Refund Calculator */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-md sticky top-4 h-fit">
          <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" /> Tiered Refund Calculator
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Total Paid Amount (₹):</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 font-extrabold text-base">₹</span>
                <input
                  type="number"
                  value={paidAmt}
                  onChange={e => setPaidAmt(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 font-extrabold text-base outline-none focus:border-purple-500 shadow-2xs"
                  min={100}
                  step={100}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-bold">Cancellation Time</label>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                  {cancelHoursPrior}h prior
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={48}
                value={cancelHoursPrior}
                onChange={e => setCancelHoursPrior(Number(e.target.value))}
                className="w-full accent-purple-600 h-1.5 rounded-full bg-slate-200"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                <span>0h</span>
                <span>48h+</span>
              </div>
            </div>
          </div>

          {/* Calculated Output Result */}
          {calc && (
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-purple-700 text-base leading-tight block">
                    {calc.refundPercent}% Refund Applicable
                  </span>
                  <span className="text-xs text-slate-500 font-medium block mt-0.5">
                    ({cancelHoursPrior}.0h prior to session start)
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200/70 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">Total Paid:</span>
                  <span className="font-extrabold text-slate-900">₹{paidAmt}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">Refund:</span>
                  <span className="font-extrabold text-emerald-600">₹{calc.refundAmount} ({calc.refundPercent}%)</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">Fee Charged:</span>
                  <span className="font-extrabold text-rose-600">₹{calc.feeAmount} ({calc.feePercent}%)</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
