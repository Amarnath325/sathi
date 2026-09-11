'use client';

import React, { useState } from 'react';
import { PromoCodeItem } from '@/lib/types';
import {
  Ticket,
  Copy,
  Check,
  Calendar,
  Users,
  DollarSign,
  Edit3,
  Trash2,
  Power,
  Eye,
  Sparkles,
  Percent,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  promo: PromoCodeItem;
  onEdit: (promo: PromoCodeItem) => void;
  onAudit: (promo: PromoCodeItem) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PromoCard({ promo, onEdit, onAudit, onToggleActive, onDelete }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const isExpired = promo.expiryDate && promo.expiryDate < new Date().toISOString().split('T')[0];
  const usageLimit = promo.usageLimit || 1000;
  const usagePercentage = Math.min(100, Math.round((promo.usageCount / usageLimit) * 100));
  const isPercentage = promo.discountType === 'PERCENTAGE' || !!promo.discountPercent;
  const discountVal = promo.discountValue || promo.discountPercent || promo.flatDiscount || 10;

  return (
    <div
      className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl glass-panel border shadow-lg flex flex-col justify-between space-y-3.5 transition-all duration-300 hover:shadow-xl ${
        !promo.isActive
          ? 'border-slate-300 dark:border-slate-800/60 opacity-80'
          : isExpired
          ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500/40'
      }`}
    >
      {/* Top Header: Code, Title & Discount Tag */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-wider truncate">
                  {promo.code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`p-1 rounded-lg border text-xs transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800'
                  }`}
                  title="Copy Coupon Code"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
                {copied && (
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                    Copied!
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate mt-0.5">
                {promo.title}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-600/20 inline-flex items-center gap-1">
              {isPercentage ? `${discountVal}% OFF` : `$${discountVal} FLAT`}
            </span>
          </div>
        </div>

        {promo.description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {promo.description}
          </p>
        )}
      </div>

      {/* Metadata Tiles & Progress */}
      <div className="space-y-2.5 pt-1">
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] font-bold text-slate-500 font-sans block uppercase tracking-wider">
              Min Order Value
            </span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">
              ${promo.minBookingAmount}.00
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] font-bold text-slate-500 font-sans block uppercase tracking-wider">
              Expiry Date
            </span>
            <span className={`font-bold ${isExpired ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {promo.expiryDate || 'No Expiry'}
            </span>
          </div>
        </div>

        {/* Usage Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <span className="font-sans font-medium">Redemptions Claimed</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {promo.usageCount.toLocaleString()} / {promo.usageLimit ? promo.usageLimit.toLocaleString() : '∞'} ({usagePercentage}%)
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercentage >= 90
                  ? 'bg-rose-500'
                  : usagePercentage >= 70
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600'
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer: Status Switch + Action Icons */}
      <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onToggleActive(promo.id)}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border flex items-center gap-1 transition-all cursor-pointer ${
            !promo.isActive
              ? 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
              : isExpired
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          }`}
          title="Click to Toggle Campaign Status"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${promo.isActive && !isExpired ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <span>{!promo.isActive ? 'PAUSED' : isExpired ? 'EXPIRED' : 'ACTIVE'}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAudit(promo)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="View Campaign Analytics"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(promo)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="Edit Campaign Parameters"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(promo.id)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-800 hover:border-rose-300 transition-colors cursor-pointer"
            title="Delete Coupon"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
