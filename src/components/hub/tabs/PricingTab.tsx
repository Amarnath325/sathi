'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { PricingProfile } from '@/lib/types/serviceHub';
import { PricingEngine } from '@/lib/serviceHubEngines';
import { DollarSign, Calculator, Plus, CheckCircle2, Zap } from 'lucide-react';

export function PricingTab() {
  const { pricingProfiles, addPricingProfile, updatePricingProfile } = useServiceHubStore();

  // Price Calculator Tester State
  const [calcProfileId, setCalcProfileId] = useState(pricingProfiles[0]?.id || '');
  const [calcDuration, setCalcDuration] = useState(3);
  const [calcTravelKm, setCalcTravelKm] = useState(15);
  const [isWeekend, setIsWeekend] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState(100);

  const activeProfile = pricingProfiles.find(p => p.id === calcProfileId) || pricingProfiles[0];
  const breakdown = activeProfile ? PricingEngine.calculatePrice(
    activeProfile, calcDuration, calcTravelKm, { isWeekend, promoDiscount }
  ) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Module 3: Pricing Profiles & Priority Override Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Priority Hierarchy: <span className="text-white font-bold">Service Pricing</span> → <span className="text-indigo-400 font-bold">Category Default</span> → <span className="text-slate-400 font-bold">Global Default</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pricing Profiles List */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-white text-sm">Configured Pricing Profiles ({pricingProfiles.length})</h4>
          <div className="space-y-3">
            {pricingProfiles.map((prof) => (
              <div key={prof.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-white text-sm">{prof.name}</h5>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold">
                    {prof.pricing_type}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div>Base: ₹{prof.base_price}</div>
                  <div>Extra Hr: ₹{prof.extra_hour_price}</div>
                  <div>Platform Fee: {prof.platform_fee}%</div>
                  <div>Tax: {prof.tax}%</div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Weekend Multiplier: {prof.weekend_multiplier}x</span>
                  <span>Holiday Multiplier: {prof.holiday_multiplier}x</span>
                  <span className="text-amber-400">Surge Enabled: {prof.surge_enabled ? 'Yes' : 'No'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Price Calculator Widget */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 h-fit shadow-2xl">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" /> Dynamic Price Breakdown Calculator
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Pricing Profile</label>
              <select
                value={calcProfileId}
                onChange={(e) => setCalcProfileId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
              >
                {pricingProfiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Booking Duration ({calcDuration} hours)</label>
              <input
                type="range"
                min={1}
                max={12}
                value={calcDuration}
                onChange={(e) => setCalcDuration(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Travel Distance ({calcTravelKm} KM)</label>
              <input
                type="range"
                min={0}
                max={50}
                value={calcTravelKm}
                onChange={(e) => setCalcTravelKm(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWeekend}
                  onChange={(e) => setIsWeekend(e.target.checked)}
                  className="accent-indigo-600"
                />
                <span className="text-white font-bold">Weekend</span>
              </label>
            </div>
          </div>

          {/* Breakdown Output */}
          {breakdown && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400"><span>Base Price:</span><span>₹{breakdown.basePrice}</span></div>
              <div className="flex justify-between text-slate-400"><span>Duration Charge ({breakdown.durationHours}h):</span><span>₹{breakdown.durationCharge}</span></div>
              <div className="flex justify-between text-slate-400"><span>Travel Charge ({calcTravelKm}km):</span><span>₹{breakdown.travelCharge}</span></div>
              <div className="flex justify-between text-slate-400"><span>Platform Fee:</span><span>₹{breakdown.platformFee}</span></div>
              <div className="flex justify-between text-slate-400"><span>GST Tax:</span><span>₹{breakdown.taxAmount}</span></div>
              <div className="flex justify-between text-emerald-400"><span>Discount:</span><span>-₹{breakdown.discountAmount}</span></div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                <span>Final Booking Price:</span>
                <span className="text-emerald-400">₹{breakdown.finalPrice}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
