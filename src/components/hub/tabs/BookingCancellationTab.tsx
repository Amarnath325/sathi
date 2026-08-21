'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CancellationCalculator } from '@/lib/serviceHubEngines';
import {
  Clock, Calendar, Calculator, Check, Hourglass, RotateCcw, AlertTriangle,
  FileText, Shield, Sparkles, CheckCircle2, Layers, RefreshCw, XCircle
} from 'lucide-react';

export function BookingCancellationTab() {
  const { bookingRules } = useServiceHubStore();
  const rule = bookingRules[0];

  const [subTab, setSubTab] = useState<'overview' | 'booking_rules' | 'cancellation' | 'refund_rules'>('overview');

  // Calculator State
  const [paidAmt, setPaidAmt] = useState(2500);
  const [cancelHoursPrior, setCancelHoursPrior] = useState(18);

  const calc = rule ? CancellationCalculator.calculateRefund(paidAmt, cancelHoursPrior, rule) : null;

  return (
    <div className="space-y-3 w-full">
      {/* Sub-navigation Header */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200/80">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'overview'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setSubTab('booking_rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'booking_rules'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Booking Rules</span>
          </button>

          <button
            onClick={() => setSubTab('cancellation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'cancellation'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancellation Policy</span>
          </button>

          <button
            onClick={() => setSubTab('refund_rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'refund_rules'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Refund Rules & Calculator</span>
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW SUB-TAB */}
      {subTab === 'overview' && (
        <div className="space-y-3">
          {/* Key Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">MIN ADVANCE</span>
              <span className="text-xl font-extrabold text-purple-800 leading-tight block">{rule?.min_advance_hours || 2} Hours</span>
              <span className="text-[10px] text-slate-500 font-medium block">Lead time required</span>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">INSTANT BOOKING</span>
              <span className="text-xl font-extrabold text-emerald-800 leading-tight block">
                {rule?.instant_booking_allowed ? 'Enabled' : 'Disabled'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">Auto-confirm mode</span>
            </div>

            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">DURATION LIMITS</span>
              <span className="text-xl font-extrabold text-indigo-800 leading-tight block">
                {rule?.min_duration_hours || 1}h – {rule?.max_duration_hours || 12}h
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">Per single booking</span>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">REFUND WINDOW</span>
              <span className="text-xl font-extrabold text-amber-800 leading-tight block">Up to 24h Prior</span>
              <span className="text-[10px] text-slate-500 font-medium block">100% refund tier</span>
            </div>
          </div>

          {/* Policy Summary Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs">Standard Booking & Cancellation Policy Summary</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bookings require a minimum advance notice of {rule?.min_advance_hours || 2} hours and can be scheduled up to {rule?.max_advance_days || 30} days ahead.
              Cancellations made more than 24 hours prior receive full refund, while late cancellations incur progressive penalty fees. Emergency companion cancellations are automatically reassigned or fully refunded.
            </p>
          </div>
        </div>
      )}

      {/* 2. BOOKING RULES SUB-TAB */}
      {subTab === 'booking_rules' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <h4 className="font-extrabold text-slate-900 text-xs">Configured Booking Parameters</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {/* Advance Booking */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 block">1. Advance Booking Notice</span>
              <p className="text-[11px] text-slate-600">Min Advance: <strong>{rule?.min_advance_hours} hours</strong></p>
              <p className="text-[11px] text-slate-600">Max Advance: <strong>{rule?.max_advance_days} days</strong></p>
            </div>

            {/* Duration Limits */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 block">2. Session Duration</span>
              <p className="text-[11px] text-slate-600">Min Duration: <strong>{rule?.min_duration_hours} hour</strong></p>
              <p className="text-[11px] text-slate-600">Max Duration: <strong>{rule?.max_duration_hours} hours</strong></p>
            </div>

            {/* Instant Booking */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 block">3. Instant Booking</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                rule?.instant_booking_allowed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {rule?.instant_booking_allowed ? 'Allowed (Auto-Accept)' : 'Manual Acceptance Required'}
              </span>
            </div>

            {/* Booking Extension */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 block">4. Extension Rules</span>
              <p className="text-[11px] text-slate-600">Companions can extend active bookings up to 4 hours with real-time customer consent.</p>
            </div>

            {/* Rescheduling Rules */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 block">5. Rescheduling Rules</span>
              <p className="text-[11px] text-slate-600">Free rescheduling permitted up to 12 hours prior to scheduled start time.</p>
            </div>

            {/* Admin Approval */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 block">6. Admin Approval Trigger</span>
              <p className="text-[11px] text-slate-600">Bookings exceeding ₹5,000 or night shifts require explicit supervisor signoff.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. CANCELLATION SUB-TAB */}
      {subTab === 'cancellation' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Cancellation Policy Rules & Windows</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
              <span className="font-extrabold text-purple-950 block">Customer Cancellation</span>
              <p className="text-[11px] text-purple-900">
                Customers can cancel at any time. Refunds are automatically calculated based on cancellation window rules.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
              <span className="font-extrabold text-rose-950 block">Companion Cancellation</span>
              <p className="text-[11px] text-rose-900">
                Companion cancellations incur a penalty on payout score and trigger automatic replacement dispatch.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <span className="font-extrabold text-amber-950 block">No-Show Policy</span>
              <p className="text-[11px] text-amber-900">
                If customer or companion fails to check-in within 15 minutes of booking start time, 100% penalty applies.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="font-extrabold text-emerald-950 block">Emergency Cancellation</span>
              <p className="text-[11px] text-emerald-900">
                Medical or emergency cancellations bypass fees upon submission of proof and admin review.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. REFUND RULES & CALCULATOR SUB-TAB */}
      {subTab === 'refund_rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
          {/* Tiered Schedule Column */}
          <div className="lg:col-span-2 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs">Tiered Refund Schedule & Fees</h4>

            <div className="space-y-2">
              {rule?.cancellation_rules.tiers.map((tier, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 block">
                      {tier.hoursBeforeBooking > 0 ? `More than ${tier.hoursBeforeBooking} Hours Notice` : 'Less than Minimum Window'}
                    </span>
                    <span className="text-[10px] text-slate-500">Fee Charged: {tier.cancellationFeePercent}% penalty</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-purple-100 text-purple-800">
                    {tier.refundPercentage}% Refund
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator Column */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-2xs">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-purple-600" /> Refund Calculator
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Paid Amount (₹)</label>
                <input
                  type="number"
                  value={paidAmt}
                  onChange={e => setPaidAmt(Number(e.target.value))}
                  className="w-full bg-slate-50 border rounded-xl p-2 font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Hours Before Booking: <span className="text-purple-700 font-bold font-mono">{cancelHoursPrior}h</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={48}
                  value={cancelHoursPrior}
                  onChange={e => setCancelHoursPrior(Number(e.target.value))}
                  className="w-full accent-purple-600 h-1 rounded-full bg-slate-200"
                />
              </div>

              {calc && (
                <div className="p-3 rounded-xl bg-slate-50 border font-mono text-xs space-y-1.5">
                  <div className="flex justify-between"><span>Refund Tier:</span><strong>{calc.refundPercent}%</strong></div>
                  <div className="flex justify-between text-rose-600"><span>Penalty Fee:</span><strong>₹{calc.feeAmount}</strong></div>
                  <div className="pt-1 border-t flex justify-between font-extrabold text-emerald-600 text-sm">
                    <span>Refund:</span><span>₹{calc.refundAmount}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
