'use client';

import React, { useState } from 'react';
import { PromoCodeItem } from '@/lib/types';
import {
  X,
  Ticket,
  Sparkles,
  DollarSign,
  Users,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Copy,
  Check,
  Percent,
  Clock,
  Activity,
  Layers
} from 'lucide-react';

interface Props {
  promo: PromoCodeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromoDetailsModal({ promo, isOpen, onClose }: Props) {
  if (!isOpen || !promo) return null;

  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const discountVal = promo.discountValue || promo.discountPercent || promo.flatDiscount || 15;
  const isPercentage = promo.discountType === 'PERCENTAGE' || !!promo.discountPercent;
  const estimatedSavings = Math.round(promo.usageCount * (isPercentage ? 38 : discountVal));
  const estimatedRevenue = Math.round(promo.usageCount * 280);
  const usageLimit = promo.usageLimit || 1000;
  const utilization = Math.min(100, Math.round((promo.usageCount / usageLimit) * 100));
  const isExpired = promo.expiryDate && promo.expiryDate < new Date().toISOString().split('T')[0];

  // Mock recent redemptions log
  const recentRedemptions = [
    { client: 'Eleanor Vance', booking: '#BK-8841', amount: '$320', saved: isPercentage ? `$${Math.round(320 * discountVal / 100)}` : `$${discountVal}`, time: '2 hours ago' },
    { client: 'Marcus Sterling', booking: '#BK-8819', amount: '$450', saved: isPercentage ? `$${Math.round(450 * discountVal / 100)}` : `$${discountVal}`, time: '5 hours ago' },
    { client: 'Sophia Dupont', booking: '#BK-8794', amount: '$200', saved: isPercentage ? `$${Math.round(200 * discountVal / 100)}` : `$${discountVal}`, time: '1 day ago' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-3.5 sm:p-4 text-slate-900 dark:text-white max-h-[96vh] overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-950/80 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800">
                  {promo.code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
                <span className={`text-[9px] font-extrabold px-2 py-0.2 rounded-full border ${
                  !promo.isActive
                    ? 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
                    : isExpired
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                }`}>
                  {!promo.isActive ? 'PAUSED' : isExpired ? 'EXPIRED' : 'ACTIVE'}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5 truncate">
                {promo.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Metric KPI Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 font-sans block uppercase tracking-wider">Redemptions</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">{promo.usageCount.toLocaleString()}</p>
            <span className="text-[9px] text-purple-600 dark:text-purple-400 font-sans">Cap: {usageLimit}</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 font-sans block uppercase tracking-wider">Savings Granted</span>
            <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">${estimatedSavings.toLocaleString()}.00</p>
            <span className="text-[9px] text-slate-400 font-sans">Total saved</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 font-sans block uppercase tracking-wider">Driven Volume</span>
            <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">${estimatedRevenue.toLocaleString()}.00</p>
            <span className="text-[9px] text-slate-400 font-sans">Gross revenue</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 font-sans block uppercase tracking-wider">Utilization</span>
            <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400">{utilization}%</p>
            <span className="text-[9px] text-slate-400 font-sans">Quota used</span>
          </div>
        </div>

        {/* 2-Column Details: Rules (Left) & Recent Redemptions (Right) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 flex-1 min-h-0">
          {/* Rules & Policy */}
          <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-500" />
              Campaign Rules
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">Discount Model:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {isPercentage ? `${discountVal}% Percentage Off` : `$${discountVal} Flat Off`}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">Min Order Requirement:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">${promo.minBookingAmount}.00</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">Expiry Date:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{promo.expiryDate || 'No Expiry'}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Applicable Scope:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                  {promo.applicableCategories?.join(', ') || 'All Categories'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Redemptions Log */}
          <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-500" />
              Recent Redemptions
            </span>
            <div className="space-y-1 overflow-y-auto max-h-[110px] pr-1">
              {recentRedemptions.map((r, idx) => (
                <div key={idx} className="p-1.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{r.client}</span>
                    <span className="text-slate-400 ml-1">({r.booking})</span>
                    <p className="text-slate-400 text-[9px]">{r.time}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">-{r.saved}</span>
                    <span className="text-slate-400 block text-[9px]">Total: {r.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2 mt-1">
          <div className="text-[10px] text-slate-400">
            Campaign ID: <span className="font-mono">{promo.id}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
