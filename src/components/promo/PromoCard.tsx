'use client';

import React, { useState } from 'react';
import { PromoCodeItem } from '@/lib/types';
import { Ticket, Copy, Check, Calendar, Users, DollarSign, Edit3, Trash2, Power, Eye, Sparkles } from 'lucide-react';

interface Props {
  promo: PromoCodeItem;
  onEdit: (promo: PromoCodeItem) => void;
  onAudit: (promo: PromoCodeItem) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PromoCard({ promo, onEdit, onAudit, onToggleActive, onDelete }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = promo.expiryDate && promo.expiryDate < new Date().toISOString().split('T')[0];
  const usageLimit = promo.usageLimit || 1000;
  const usagePercentage = Math.min(100, Math.round((promo.usageCount / usageLimit) * 100));

  return (
    <div className={`relative p-6 rounded-3xl glass-panel border shadow-xl flex flex-col justify-between space-y-4 transition-all duration-300 hover:scale-[1.01] ${
      !promo.isActive ? 'border-slate-800/60 opacity-75' :
      isExpired ? 'border-rose-900/60 bg-rose-950/10' :
      'border-slate-800 hover:border-purple-500/40'
    }`}>
      {/* Top Header & Discount Badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-purple-950/80 text-purple-400 border border-purple-800/60">
              <Ticket className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-white tracking-wider">{promo.code}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                  title="Copy Promo Code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5 line-clamp-1">{promo.title}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="px-3 py-1 rounded-2xl text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30">
              {promo.discountType === 'PERCENTAGE' || promo.discountPercent ? (
                `${promo.discountValue || promo.discountPercent}% OFF`
              ) : (
                `$${promo.discountValue || promo.flatDiscount} FLAT`
              )}
            </span>
          </div>
        </div>

        {promo.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {promo.description}
          </p>
        )}
      </div>

      {/* Campaign Metadata & Usage Progress */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-sans block">Min Order Value</span>
            <span className="font-extrabold text-amber-400">${promo.minBookingAmount}.00</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-sans block">Expiry Date</span>
            <span className={`font-bold ${isExpired ? 'text-rose-400' : 'text-slate-300'}`}>
              {promo.expiryDate}
            </span>
          </div>
        </div>

        {/* Usage Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Redemptions Used</span>
            <span className="font-bold text-white">{promo.usageCount} / {promo.usageLimit ? promo.usageLimit : '∞'}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercentage > 85 ? 'bg-rose-500' : 'gradient-bg-primary'
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer & Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => onToggleActive(promo.id)}
          className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border flex items-center gap-1 transition-all ${
            !promo.isActive ? 'bg-slate-900 text-slate-500 border-slate-800' :
            isExpired ? 'bg-rose-950 text-rose-300 border-rose-800' :
            'bg-emerald-950 text-emerald-300 border-emerald-800'
          }`}
        >
          <Power className="w-3 h-3" />
          {!promo.isActive ? 'PAUSED' : isExpired ? 'EXPIRED' : 'ACTIVE'}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAudit(promo)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 transition-colors"
            title="Audit Campaign Analytics"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(promo)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Edit Promo Campaign"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(promo.id)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-800 transition-colors"
            title="Delete Promo Campaign"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
