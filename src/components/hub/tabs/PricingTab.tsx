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

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(pricingProfiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `pricing_export_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          placeholder="Search pricing profiles..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pricing Profiles List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">
              Configured Pricing Profiles
              <span className="ml-2 text-slate-400 text-xs font-normal">({filteredProfiles.length} shown)</span>
            </h4>
          </div>

          {filteredProfiles.length > 0 ? (
            <div className="space-y-3">
              {filteredProfiles.map((prof) => (
                <div
                  key={prof.id}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    calcProfileId === prof.id ? 'bg-slate-800 border-indigo-500/60 shadow-lg' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setCalcProfileId(prof.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h5 className="font-extrabold text-white text-sm">{prof.name}</h5>
                      {calcProfileId === prof.id && (
                        <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">SELECTED</span>
                      )}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold">
                      {prof.pricing_type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-500 uppercase">Base Rate</p>
                      <p className="font-bold text-white">₹{prof.base_price}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-500 uppercase">Extra /hr</p>
                      <p className="font-bold text-white">₹{prof.extra_hour_price}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-500 uppercase">Platform Fee</p>
                      <p className="font-bold text-indigo-400">{prof.platform_fee}%</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-500 uppercase">GST Tax</p>
                      <p className="font-bold text-amber-400">{prof.tax}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Weekend: <span className="text-white font-bold">{prof.weekend_multiplier}x</span></span>
                    <span className="text-slate-400">Holiday: <span className="text-white font-bold">{prof.holiday_multiplier}x</span></span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${prof.surge_enabled ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'}`}>
                      Surge: {prof.surge_enabled ? 'Active' : 'Off'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
              No pricing profiles match your search.
            </div>
          )}
        </div>

        {/* Live Price Calculator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 h-fit shadow-2xl sticky top-4">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" /> Dynamic Price Calculator
          </h4>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Pricing Profile</label>
              <select
                value={calcProfileId}
                onChange={e => setCalcProfileId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold outline-none focus:border-indigo-500"
              >
                {pricingProfiles.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Duration: <span className="text-white font-mono">{calcDuration} hours</span></label>
              <input type="range" min={1} max={12} value={calcDuration} onChange={e => setCalcDuration(Number(e.target.value))} className="w-full accent-indigo-600 h-1.5 rounded-full" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>1h</span><span>12h</span></div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Travel Distance: <span className="text-white font-mono">{calcTravelKm} KM</span></label>
              <input type="range" min={0} max={50} value={calcTravelKm} onChange={e => setCalcTravelKm(Number(e.target.value))} className="w-full accent-indigo-600 h-1.5 rounded-full" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>0 KM</span><span>50 KM</span></div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <input type="checkbox" checked={isWeekend} onChange={e => setIsWeekend(e.target.checked)} className="accent-indigo-600 w-4 h-4 rounded" />
              <span className="text-white font-bold">Weekend / Holiday Booking</span>
            </label>
          </div>

          {/* Breakdown */}
          {breakdown && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              {[
                { label: 'Base Price', value: `₹${breakdown.basePrice}`, color: 'text-slate-300' },
                { label: `Duration (${breakdown.durationHours}h)`, value: `₹${breakdown.durationCharge}`, color: 'text-slate-300' },
                { label: `Travel (${calcTravelKm}km)`, value: `₹${breakdown.travelCharge}`, color: 'text-slate-300' },
                { label: 'Platform Fee', value: `₹${breakdown.platformFee}`, color: 'text-indigo-400' },
                { label: 'GST Tax', value: `₹${breakdown.taxAmount}`, color: 'text-amber-400' },
                { label: 'Discount', value: `-₹${breakdown.discountAmount}`, color: 'text-emerald-400' },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-slate-500">{row.label}:</span>
                  <span className={row.color}>{row.value}</span>
                </div>
              ))}
              <div className="pt-2 mt-1 border-t border-slate-800 flex justify-between font-bold text-sm">
                <span className="text-slate-300">Total Price:</span>
                <span className="text-emerald-400 text-base">₹{breakdown.finalPrice}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
