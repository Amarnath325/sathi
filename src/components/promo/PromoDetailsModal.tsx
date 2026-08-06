'use client';

import React from 'react';
import { PromoCodeItem } from '@/lib/types';
import { X, Ticket, Sparkles, DollarSign, Users, Calendar, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

interface Props {
  promo: PromoCodeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromoDetailsModal({ promo, isOpen, onClose }: Props) {
  if (!isOpen || !promo) return null;

  const discountVal = promo.discountValue || promo.discountPercent || promo.flatDiscount || 15;
  const estimatedSavings = Math.round(promo.usageCount * (promo.discountType === 'PERCENTAGE' ? 45 : discountVal));
  const estimatedRevenue = Math.round(promo.usageCount * 280);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded-lg border border-purple-800">
                {promo.code}
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                promo.isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {promo.isActive ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">{promo.title}</h2>
          </div>

          <button onClick={onClose} className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-sans block">Total Redemptions</span>
            <p className="text-xl font-black text-white">{promo.usageCount}</p>
            <span className="text-[10px] text-purple-400">Cap: {promo.usageLimit || '∞'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-sans block">Savings Provided</span>
            <p className="text-xl font-black text-emerald-400">${estimatedSavings.toLocaleString()}.00</p>
            <span className="text-[10px] text-slate-400">Client discount</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-sans block">Gross Revenue Generated</span>
            <p className="text-xl font-black text-indigo-400">${estimatedRevenue.toLocaleString()}.00</p>
            <span className="text-[10px] text-slate-400">From bookings</span>
          </div>
        </div>

        {/* Audit Details */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-mono text-[10px]">Discount Model:</span>
            <span className="font-bold text-white">
              {promo.discountType === 'PERCENTAGE' ? `${discountVal}% Percentage Off` : `$${discountVal} Flat Amount Off`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-mono text-[10px]">Min Booking Threshold:</span>
            <span className="font-mono font-bold text-amber-400">${promo.minBookingAmount}.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-mono text-[10px]">Campaign Expiry Date:</span>
            <span className="font-mono text-slate-300">{promo.expiryDate}</span>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            Close Audit Summary
          </button>
        </div>
      </div>
    </div>
  );
}
