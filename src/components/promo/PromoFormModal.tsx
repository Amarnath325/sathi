'use client';

import React, { useState, useEffect } from 'react';
import { PromoCodeItem, DiscountType } from '@/lib/types';
import { X, Ticket, Sparkles, CheckCircle2, DollarSign, Percent } from 'lucide-react';

interface Props {
  isOpen: boolean;
  promo: PromoCodeItem | null;
  onClose: () => void;
  onSave: (promoData: any) => void;
}

export function PromoFormModal({ isOpen, promo, onClose, onSave }: Props) {
  if (!isOpen) return null;

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minBookingAmount, setMinBookingAmount] = useState<number>(100);
  const [usageLimit, setUsageLimit] = useState<number>(1000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (promo) {
      setCode(promo.code);
      setTitle(promo.title || '');
      setDescription(promo.description || '');
      setDiscountType(promo.discountType || (promo.discountPercent ? 'PERCENTAGE' : 'FLAT_AMOUNT'));
      setDiscountValue(promo.discountValue || promo.discountPercent || promo.flatDiscount || 15);
      setMinBookingAmount(promo.minBookingAmount || 0);
      setUsageLimit(promo.usageLimit || 1000);
      setExpiryDate(promo.expiryDate || '2026-12-31');
      setIsActive(promo.isActive);
    } else {
      setCode('');
      setTitle('');
      setDescription('');
      setDiscountType('PERCENTAGE');
      setDiscountValue(15);
      setMinBookingAmount(100);
      setUsageLimit(1000);
      setExpiryDate('2026-12-31');
      setIsActive(true);
    }
  }, [promo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(promo ? { id: promo.id } : {}),
      code: code.trim().toUpperCase(),
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      discountPercent: discountType === 'PERCENTAGE' ? Number(discountValue) : 0,
      flatDiscount: discountType === 'FLAT_AMOUNT' ? Number(discountValue) : 0,
      minBookingAmount: Number(minBookingAmount),
      usageLimit: Number(usageLimit),
      expiryDate,
      isActive
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-purple-400" />
              {promo ? `Edit Promo #${promo.code}` : 'Create Promotion Campaign'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Configure discount parameters, min booking values, and usage caps.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. VIP2026"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-black focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={e => setDiscountType(e.target.value as DiscountType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold focus:border-purple-500 focus:outline-none"
              >
                <option value="PERCENTAGE">Percentage Discount (%)</option>
                <option value="FLAT_AMOUNT">Flat Dollar Discount ($)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Campaign Title</label>
            <input
              type="text"
              required
              placeholder="e.g. VIP Event Companion Pass"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Public Description</label>
            <textarea
              rows={2}
              placeholder="Describe the promo campaign terms..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {discountType === 'PERCENTAGE' ? 'Discount Value (%)' : 'Discount Value ($)'}
              </label>
              <input
                type="number"
                min="1"
                required
                value={discountValue}
                onChange={e => setDiscountValue(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Min Booking ($)</label>
              <input
                type="number"
                min="0"
                required
                value={minBookingAmount}
                onChange={e => setMinBookingAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Redemption Cap</label>
              <input
                type="number"
                min="1"
                required
                value={usageLimit}
                onChange={e => setUsageLimit(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="promoActiveCheck"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500 bg-slate-900 border-slate-800 cursor-pointer"
              />
              <label htmlFor="promoActiveCheck" className="text-xs font-bold text-slate-300 cursor-pointer">
                Campaign Currently Active & Redeemable
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white font-extrabold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {promo ? 'Save Campaign Changes' : 'Create Promo Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
