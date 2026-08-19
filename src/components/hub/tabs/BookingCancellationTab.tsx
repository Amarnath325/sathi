'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CancellationCalculator } from '@/lib/serviceHubEngines';
import { Clock, Calendar, Calculator, Check, Hourglass, RotateCcw, Plus, Edit2, Trash2, X } from 'lucide-react';
import { BookingRuleItem } from '@/lib/types/serviceHub';

export function BookingCancellationTab() {
  const {
    bookingRules,
    addBookingRule,
    updateBookingRule,
    deleteBookingRule
  } = useServiceHubStore();

  const [selRuleId, setSelRuleId] = useState(bookingRules[0]?.id || '');
  const [paidAmt, setPaidAmt] = useState(2000);
  const [cancelHoursPrior, setCancelHoursPrior] = useState(18);

  // CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<BookingRuleItem | null>(null);

  const [name, setName] = useState('');
  const [minAdvanceHours, setMinAdvanceHours] = useState(2);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState(30);
  const [minDurationHours, setMinDurationHours] = useState(1);
  const [maxDurationHours, setMaxDurationHours] = useState(12);
  const [sameDayAllowed, setSameDayAllowed] = useState(true);
  const [instantBookingAllowed, setInstantBookingAllowed] = useState(true);
  const [companionApprovalRequired, setCompanionApprovalRequired] = useState(false);

  // Refund Tiers state
  const [tier1Hours, setTier1Hours] = useState(24);
  const [tier1Refund, setTier1Refund] = useState(100);
  const [tier2Hours, setTier2Hours] = useState(12);
  const [tier2Refund, setTier2Refund] = useState(50);
  const [tier3Hours, setTier3Hours] = useState(0);
  const [tier3Refund, setTier3Refund] = useState(0);

  const activeRule = bookingRules.find(b => b.id === selRuleId) || bookingRules[0];
  const calc = activeRule ? CancellationCalculator.calculateRefund(paidAmt, cancelHoursPrior, activeRule) : null;

  const handleOpenAddModal = () => {
    setEditingRule(null);
    setName('');
    setMinAdvanceHours(2);
    setMaxAdvanceDays(30);
    setMinDurationHours(1);
    setMaxDurationHours(12);
    setSameDayAllowed(true);
    setInstantBookingAllowed(true);
    setCompanionApprovalRequired(false);
    setTier1Hours(24);
    setTier1Refund(100);
    setTier2Hours(12);
    setTier2Refund(50);
    setTier3Hours(0);
    setTier3Refund(0);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ruleItem: BookingRuleItem) => {
    setEditingRule(ruleItem);
    setName(ruleItem.name);
    setMinAdvanceHours(ruleItem.min_advance_hours);
    setMaxAdvanceDays(ruleItem.max_advance_days);
    setMinDurationHours(ruleItem.min_duration_hours);
    setMaxDurationHours(ruleItem.max_duration_hours);
    setSameDayAllowed(ruleItem.same_day_allowed);
    setInstantBookingAllowed(ruleItem.instant_booking_allowed);
    setCompanionApprovalRequired(ruleItem.companion_approval_required);

    const t1 = ruleItem.cancellation_rules.tiers[0] || { hoursBeforeBooking: 24, refundPercentage: 100 };
    const t2 = ruleItem.cancellation_rules.tiers[1] || { hoursBeforeBooking: 12, refundPercentage: 50 };
    const t3 = ruleItem.cancellation_rules.tiers[2] || { hoursBeforeBooking: 0, refundPercentage: 0 };

    setTier1Hours(t1.hoursBeforeBooking);
    setTier1Refund(t1.refundPercentage);
    setTier2Hours(t2.hoursBeforeBooking);
    setTier2Refund(t2.refundPercentage);
    setTier3Hours(t3.hoursBeforeBooking);
    setTier3Refund(t3.refundPercentage);

    setIsModalOpen(true);
  };

  const handleDeleteRule = (id: string) => {
    if (confirm('Are you sure you want to delete this booking & cancellation policy?')) {
      deleteBookingRule(id);
      if (selRuleId === id && bookingRules.length > 1) {
        const remaining = bookingRules.filter(b => b.id !== id);
        setSelRuleId(remaining[0]?.id || '');
      }
    }
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const cancellation_rules = {
      free_cancellation_window_hours: Number(tier1Hours),
      no_show_refund_percent: 0,
      tiers: [
        { hoursBeforeBooking: Number(tier1Hours), refundPercentage: Number(tier1Refund), cancellationFeePercent: 100 - Number(tier1Refund) },
        { hoursBeforeBooking: Number(tier2Hours), refundPercentage: Number(tier2Refund), cancellationFeePercent: 100 - Number(tier2Refund) },
        { hoursBeforeBooking: Number(tier3Hours), refundPercentage: Number(tier3Refund), cancellationFeePercent: 100 - Number(tier3Refund) },
      ]
    };

    if (editingRule) {
      updateBookingRule(editingRule.id, {
        name,
        min_advance_hours: Number(minAdvanceHours),
        max_advance_days: Number(maxAdvanceDays),
        min_duration_hours: Number(minDurationHours),
        max_duration_hours: Number(maxDurationHours),
        same_day_allowed: sameDayAllowed,
        instant_booking_allowed: instantBookingAllowed,
        companion_approval_required: companionApprovalRequired,
        cancellation_rules,
      });
    } else {
      const newRule = addBookingRule({
        name,
        min_advance_hours: Number(minAdvanceHours),
        max_advance_days: Number(maxAdvanceDays),
        min_duration_hours: Number(minDurationHours),
        max_duration_hours: Number(maxDurationHours),
        same_day_allowed: sameDayAllowed,
        instant_booking_allowed: instantBookingAllowed,
        companion_approval_required: companionApprovalRequired,
        user_approval_required: false,
        cancellation_rules,
        status: 'ACTIVE'
      });
      setSelRuleId(newRule.id);
    }

    setIsModalOpen(false);
  };

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

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingRule ? 'Edit Booking Policy' : 'Create Booking Policy'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Policy Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Standard Booking & Cancellation Rules"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Advance (hrs)</label>
                  <input
                    type="number"
                    value={minAdvanceHours}
                    onChange={e => setMinAdvanceHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Advance (days)</label>
                  <input
                    type="number"
                    value={maxAdvanceDays}
                    onChange={e => setMaxAdvanceDays(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Duration (hrs)</label>
                  <input
                    type="number"
                    value={minDurationHours}
                    onChange={e => setMinDurationHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Duration (hrs)</label>
                  <input
                    type="number"
                    value={maxDurationHours}
                    onChange={e => setMaxDurationHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameDayAllowed}
                    onChange={e => setSameDayAllowed(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Allow Same Day Bookings</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={instantBookingAllowed}
                    onChange={e => setInstantBookingAllowed(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Allow Instant Booking</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={companionApprovalRequired}
                    onChange={e => setCompanionApprovalRequired(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Require Companion Explicit Approval</span>
                </label>
              </div>

              {/* Tiered Cancellation Refund Setup */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="block text-slate-700 font-bold">Cancellation Refund Tiers</label>
                
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="col-span-2 text-[11px] font-bold text-slate-500 uppercase">Tier 1 (High Refund Window)</div>
                  <div>
                    <label className="text-[10px] text-slate-600 font-bold">Hours Before Booking</label>
                    <input
                      type="number"
                      value={tier1Hours}
                      onChange={e => setTier1Hours(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 font-bold">Refund %</label>
                    <input
                      type="number"
                      value={tier1Refund}
                      onChange={e => setTier1Refund(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-emerald-600"
                    />
                  </div>

                  <div className="col-span-2 text-[11px] font-bold text-slate-500 uppercase pt-2">Tier 2 (Mid Refund Window)</div>
                  <div>
                    <label className="text-[10px] text-slate-600 font-bold">Hours Before Booking</label>
                    <input
                      type="number"
                      value={tier2Hours}
                      onChange={e => setTier2Hours(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 font-bold">Refund %</label>
                    <input
                      type="number"
                      value={tier2Refund}
                      onChange={e => setTier2Refund(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-amber-600"
                    />
                  </div>

                  <div className="col-span-2 text-[11px] font-bold text-slate-500 uppercase pt-2">Tier 3 (Late Cancellation)</div>
                  <div>
                    <label className="text-[10px] text-slate-600 font-bold">Hours Before Booking</label>
                    <input
                      type="number"
                      value={tier3Hours}
                      onChange={e => setTier3Hours(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 font-bold">Refund %</label>
                    <input
                      type="number"
                      value={tier3Refund}
                      onChange={e => setTier3Refund(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-rose-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm shadow-purple-200"
                >
                  {editingRule ? 'Update Policy' : 'Save Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
