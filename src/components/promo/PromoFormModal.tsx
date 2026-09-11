'use client';

import React, { useState, useEffect } from 'react';
import { PromoCodeItem, DiscountType } from '@/lib/types';
import {
  X,
  Ticket,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Percent,
  Calendar,
  Layers,
  Tag,
  Info
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  promo: PromoCodeItem | null;
  onClose: () => void;
  onSave: (promoData: any) => void;
}

const CATEGORY_OPTIONS = [
  'All Categories',
  'Dining & Social',
  'VIP Events',
  'Travel & Tour',
  'City Guide',
  'Nightlife & Parties',
  'Red Carpet'
];

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All Categories']);
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
      setSelectedCategories(promo.applicableCategories?.length ? promo.applicableCategories : ['All Categories']);
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
      setSelectedCategories(['All Categories']);
      setIsActive(true);
    }
  }, [promo, isOpen]);

  const handleGenerateCode = () => {
    const prefixes = ['SAVE', 'VIP', 'SATHI', 'BONUS', 'FESTIVE', 'SPECIAL'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setCode(`${prefix}${num}`);
  };

  const handleToggleCategory = (cat: string) => {
    if (cat === 'All Categories') {
      setSelectedCategories(['All Categories']);
      return;
    }
    const filtered = selectedCategories.filter(c => c !== 'All Categories');
    if (filtered.includes(cat)) {
      const next = filtered.filter(c => c !== cat);
      setSelectedCategories(next.length ? next : ['All Categories']);
    } else {
      setSelectedCategories([...filtered, cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onSave({
      ...(promo ? { id: promo.id } : {}),
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      discountType,
      discountValue: Number(discountValue),
      discountPercent: discountType === 'PERCENTAGE' ? Number(discountValue) : 0,
      flatDiscount: discountType === 'FLAT_AMOUNT' ? Number(discountValue) : 0,
      minBookingAmount: Number(minBookingAmount),
      usageLimit: Number(usageLimit),
      expiryDate,
      applicableCategories: selectedCategories,
      isActive
    });
    onClose();
  };

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
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                {promo ? `Edit Promo #${promo.code}` : 'Create Promotion Campaign'}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Configure discount rates, thresholds, redemption caps, and eligibility rules.
              </p>
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

        {/* Compact Form (Zero-Scroll 2-Column Grid) */}
        <form onSubmit={handleSubmit} className="pt-2 space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            {/* Left Column: Code, Type & Titles */}
            <div className="space-y-2">
              {/* Coupon Code & Auto-generator */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Coupon Code *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-[9px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-2.5 h-2.5" /> Auto-Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP2026"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    className="w-full px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none text-xs uppercase"
                  />
                </div>
              </div>

              {/* Discount Type Toggle */}
              <div>
                <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                  Discount Model *
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDiscountType('PERCENTAGE')}
                    className={`py-1 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      discountType === 'PERCENTAGE'
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-400 text-purple-700 dark:text-purple-300'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Percent className="w-3 h-3" /> Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('FLAT_AMOUNT')}
                    className={`py-1 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      discountType === 'FLAT_AMOUNT'
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-400 text-purple-700 dark:text-purple-300'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <DollarSign className="w-3 h-3" /> Flat Dollar ($)
                  </button>
                </div>
              </div>

              {/* Campaign Title */}
              <div>
                <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Event Companion Pass"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none text-xs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                  Public Terms / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15% discount on all verified companion bookings"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Right Column: Values, Limits & Expiry */}
            <div className="space-y-2">
              {/* Discount Value & Min Booking */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                    {discountType === 'PERCENTAGE' ? 'Discount Value (%) *' : 'Flat Value ($) *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={discountType === 'PERCENTAGE' ? 90 : 500}
                    required
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                    Min Booking ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={minBookingAmount}
                    onChange={e => setMinBookingAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Usage Limit Cap & Expiry Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                    Redemption Cap
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={usageLimit}
                    onChange={e => setUsageLimit(Number(e.target.value))}
                    className="w-full px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-2 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Applicable Categories selector */}
              <div>
                <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Eligible Service Categories
                </label>
                <div className="flex flex-wrap gap-1">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleToggleCategory(cat)}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full py-1 px-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    <span>{isActive ? 'Campaign Active & Redeemable' : 'Campaign Paused / Inactive'}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold">
                    {isActive ? 'Live' : 'Off'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                {code ? code : 'COUPON_CODE'}
              </span>
              <span>•</span>
              <span>{discountType === 'PERCENTAGE' ? `${discountValue}% OFF` : `$${discountValue} FLAT`}</span>
              <span>•</span>
              <span>Min ${minBookingAmount}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{promo ? 'Save Changes' : 'Create Coupon'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
