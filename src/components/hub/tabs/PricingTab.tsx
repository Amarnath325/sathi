'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { PricingProfile } from '@/lib/types/serviceHub';
import { PricingEngine } from '@/lib/serviceHubEngines';
import { DollarSign, Calculator, Plus, CheckCircle2, Zap, Download, Upload, Search, Edit2, Trash2 } from 'lucide-react';

export function PricingTab() {
  const { pricingProfiles, addPricingProfile, updatePricingProfile, searchQuery } = useServiceHubStore();

  const [calcProfileId, setCalcProfileId] = useState(pricingProfiles[0]?.id || '');
  const [calcDuration, setCalcDuration] = useState(3);
  const [calcTravelKm, setCalcTravelKm] = useState(15);
  const [isWeekend, setIsWeekend] = useState(true);
  const [localSearch, setLocalSearch] = useState('');

  const searchTerm = localSearch || searchQuery;
  const filteredProfiles = useMemo(() => {
    if (!searchTerm) return pricingProfiles;
    const q = searchTerm.toLowerCase();
    return pricingProfiles.filter(p => p.name.toLowerCase().includes(q) || p.pricing_type.toLowerCase().includes(q));
  }, [pricingProfiles, searchTerm]);

  const activeProfile = pricingProfiles.find(p => p.id === calcProfileId) || pricingProfiles[0];
  const breakdown = activeProfile ? PricingEngine.calculatePrice(activeProfile, calcDuration, calcTravelKm, { isWeekend, promoDiscount: 0 }) : null;

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          placeholder="Search pricing profiles..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pricing Profiles List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Configured Pricing Profiles
              <span className="ml-2 text-slate-500 text-xs font-normal">({filteredProfiles.length} shown)</span>
            </h4>
          </div>

          {filteredProfiles.length > 0 ? (
            <div className="space-y-3">
              {filteredProfiles.map((prof) => {
                const isSelected = calcProfileId === prof.id;

                return (
                  <div
                    key={prof.id}
                    className={`p-4 rounded-2xl transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-white border-2 border-purple-500 shadow-md ring-2 ring-purple-500/10'
                        : 'bg-white border border-slate-200/90 shadow-xs hover:border-purple-200 hover:shadow-sm'
                    }`}
                    onClick={() => setCalcProfileId(prof.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h5 className="font-extrabold text-slate-900 text-sm">{prof.name}</h5>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold tracking-wide">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                        {prof.pricing_type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Base Rate</p>
                        <p className="font-extrabold text-slate-900 text-sm">₹{prof.base_price}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Extra /hr</p>
                        <p className="font-extrabold text-slate-900 text-sm">₹{prof.extra_hour_price}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Platform Fee</p>
                        <p className="font-extrabold text-blue-600 text-sm">{prof.platform_fee}%</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">GST Tax</p>
                        <p className="font-extrabold text-amber-600 text-sm">{prof.tax}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-600 font-medium">Weekend: <span className="text-slate-900 font-bold">{prof.weekend_multiplier}x</span></span>
                      <span className="text-slate-600 font-medium">Holiday: <span className="text-slate-900 font-bold">{prof.holiday_multiplier}x</span></span>
                      <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                        prof.surge_enabled
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        Surge: {prof.surge_enabled ? 'Active' : 'Off'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs bg-white border border-slate-200/90 rounded-2xl shadow-xs">
              No pricing profiles match your search.
            </div>
          )}
        </div>

        {/* Dynamic Price Calculator */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 h-fit shadow-md sticky top-4">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-purple-600" /> Dynamic Price Calculator
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Pricing Profile</label>
              <select
                value={calcProfileId}
                onChange={e => setCalcProfileId(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-xl p-2.5 text-xs text-slate-900 font-bold outline-none focus:border-purple-500 shadow-xs"
              >
                {pricingProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Duration: <span className="text-slate-900 font-mono font-bold">{calcDuration} hours</span></label>
              <input type="range" min={1} max={12} value={calcDuration} onChange={e => setCalcDuration(Number(e.target.value))} className="w-full accent-purple-600 h-1.5 rounded-full bg-slate-200" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium"><span>1h</span><span>12h</span></div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Travel Distance: <span className="text-slate-900 font-mono font-bold">{calcTravelKm} KM</span></label>
              <input type="range" min={0} max={50} value={calcTravelKm} onChange={e => setCalcTravelKm(Number(e.target.value))} className="w-full accent-purple-600 h-1.5 rounded-full bg-slate-200" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium"><span>0 KM</span><span>50 KM</span></div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-purple-300 transition-colors">
              <input type="checkbox" checked={isWeekend} onChange={e => setIsWeekend(e.target.checked)} className="accent-purple-600 w-4 h-4 rounded" />
              <span className="text-slate-900 font-bold">Weekend / Holiday Booking</span>
            </label>
          </div>

          {/* Breakdown Box */}
          {breakdown && (
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 font-mono text-xs space-y-2">
              {[
                { label: 'Base Price', value: `₹${breakdown.basePrice}`, color: 'text-slate-700 font-medium' },
                { label: `Duration (${breakdown.durationHours}h)`, value: `₹${breakdown.durationCharge}`, color: 'text-slate-700 font-medium' },
                { label: `Travel (${calcTravelKm}km)`, value: `₹${breakdown.travelCharge}`, color: 'text-slate-700 font-medium' },
                { label: 'Platform Fee', value: `₹${breakdown.platformFee}`, color: 'text-blue-600 font-bold' },
                { label: 'GST Tax', value: `₹${breakdown.taxAmount}`, color: 'text-amber-600 font-bold' },
                { label: 'Discount', value: `-₹${breakdown.discountAmount}`, color: 'text-emerald-600 font-bold' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">{row.label}:</span>
                  <span className={row.color}>{row.value}</span>
                </div>
              ))}
              <div className="pt-2 mt-1 border-t border-slate-200/90 flex justify-between items-center font-sans font-extrabold text-sm">
                <span className="text-slate-900">Total Price:</span>
                <span className="text-emerald-600 text-base sm:text-lg font-mono">₹{breakdown.finalPrice}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
