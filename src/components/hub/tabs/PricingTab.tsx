'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { PricingProfile } from '@/lib/types/serviceHub';
import { PricingEngine } from '@/lib/serviceHubEngines';
import { DollarSign, Calculator, Plus, Edit2, Search, X } from 'lucide-react';

export function PricingTab() {
  const { pricingProfiles, addPricingProfile, updatePricingProfile, searchQuery } = useServiceHubStore();

  const [calcProfileId, setCalcProfileId] = useState(pricingProfiles[0]?.id || '');
  const [calcDuration, setCalcDuration] = useState(3);
  const [calcTravelKm, setCalcTravelKm] = useState(15);
  const [isWeekend, setIsWeekend] = useState(true);
  const [localSearch, setLocalSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<PricingProfile | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [pricingType, setPricingType] = useState<'Hourly' | 'Fixed Price' | 'Per Event'>('Hourly');
  const [basePrice, setBasePrice] = useState(500);
  const [extraHourPrice, setExtraHourPrice] = useState(450);
  const [platformFee, setPlatformFee] = useState(15);
  const [tax, setTax] = useState(18);
  const [weekendMultiplier, setWeekendMultiplier] = useState(1.15);
  const [holidayMultiplier, setHolidayMultiplier] = useState(1.25);
  const [surgeEnabled, setSurgeEnabled] = useState(true);

  const searchTerm = localSearch || searchQuery;
  const filteredProfiles = useMemo(() => {
    if (!searchTerm) return pricingProfiles;
    const q = searchTerm.toLowerCase();
    return pricingProfiles.filter(p => p.name.toLowerCase().includes(q) || p.pricing_type.toLowerCase().includes(q));
  }, [pricingProfiles, searchTerm]);

  const activeProfile = pricingProfiles.find(p => p.id === calcProfileId) || pricingProfiles[0];
  const breakdown = activeProfile ? PricingEngine.calculatePrice(activeProfile, calcDuration, calcTravelKm, { isWeekend, promoDiscount: 0 }) : null;

  const handleOpenCreate = () => {
    setEditingProfile(null);
    setName('');
    setPricingType('Hourly');
    setBasePrice(500);
    setExtraHourPrice(450);
    setPlatformFee(15);
    setTax(18);
    setWeekendMultiplier(1.15);
    setHolidayMultiplier(1.25);
    setSurgeEnabled(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prof: PricingProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProfile(prof);
    setName(prof.name);
    setPricingType(prof.pricing_type as any);
    setBasePrice(prof.base_price);
    setExtraHourPrice(prof.extra_hour_price || 0);
    setPlatformFee(prof.platform_fee);
    setTax(prof.tax);
    setWeekendMultiplier(prof.weekend_multiplier || 1.0);
    setHolidayMultiplier(prof.holiday_multiplier || 1.0);
    setSurgeEnabled(prof.surge_enabled || false);
    setIsModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProfile) {
      updatePricingProfile(editingProfile.id, {
        name: name.trim(),
        pricing_type: pricingType,
        base_price: Number(basePrice),
        extra_hour_price: Number(extraHourPrice),
        platform_fee: Number(platformFee),
        tax: Number(tax),
        weekend_multiplier: Number(weekendMultiplier),
        holiday_multiplier: Number(holidayMultiplier),
        surge_enabled: surgeEnabled
      });
    } else {
      addPricingProfile({
        name: name.trim(),
        pricing_type: pricingType,
        base_price: Number(basePrice),
        currency: 'INR',
        minimum_duration: 1,
        maximum_duration: 12,
        extra_hour_price: Number(extraHourPrice),
        travel_charge: 100,
        platform_fee: Number(platformFee),
        companion_commission: 100 - Number(platformFee),
        tax: Number(tax),
        weekend_multiplier: Number(weekendMultiplier),
        holiday_multiplier: Number(holidayMultiplier),
        surge_enabled: surgeEnabled,
        cancellation_fee: 100,
        no_show_fee: 500,
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search pricing profiles..."
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-2xs flex items-center justify-center gap-1 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add Pricing Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Pricing Profiles List */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Configured Pricing Profiles
              <span className="ml-1.5 text-slate-500 text-[10px] font-normal">({filteredProfiles.length} shown)</span>
            </h4>
          </div>

          {filteredProfiles.length > 0 ? (
            <div className="space-y-2.5">
              {filteredProfiles.map((prof) => {
                const isSelected = calcProfileId === prof.id;

                return (
                  <div
                    key={prof.id}
                    className={`p-3 rounded-2xl transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-white border-2 border-purple-500 shadow-2xs ring-1 ring-purple-500/20'
                        : 'bg-white border border-slate-200/90 shadow-2xs hover:border-purple-200'
                    }`}
                    onClick={() => setCalcProfileId(prof.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-extrabold text-slate-900 text-xs">{prof.name}</h5>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[9px] font-extrabold">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold">
                          {prof.pricing_type}
                        </span>
                        <button
                          onClick={(e) => handleOpenEdit(prof, e)}
                          className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Edit Pricing Profile"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Base Rate</p>
                        <p className="font-extrabold text-slate-900 text-xs">₹{prof.base_price}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Extra /hr</p>
                        <p className="font-extrabold text-slate-900 text-xs">₹{prof.extra_hour_price}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Platform Fee</p>
                        <p className="font-extrabold text-blue-600 text-xs">{prof.platform_fee}%</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">GST Tax</p>
                        <p className="font-extrabold text-amber-600 text-xs">{prof.tax}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-0.5 border-t border-slate-100">
                      <span className="text-slate-600 font-medium">Weekend: <strong className="text-slate-900">{prof.weekend_multiplier}x</strong></span>
                      <span className="text-slate-600 font-medium">Holiday: <strong className="text-slate-900">{prof.holiday_multiplier}x</strong></span>
                      <span className={`font-bold px-2 py-0.2 rounded-full text-[9px] ${
                        prof.surge_enabled ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        Surge: {prof.surge_enabled ? 'Active' : 'Off'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-[11px] bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              No pricing profiles match your search.
            </div>
          )}
        </div>

        {/* Dynamic Price Calculator */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-purple-600" /> Dynamic Price Calculator
          </h4>

          <div className="space-y-3 text-[11px]">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Pricing Profile</label>
              <select
                value={calcProfileId}
                onChange={e => setCalcProfileId(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-xl p-2 text-[11px] text-slate-900 font-bold outline-none focus:border-purple-500 shadow-2xs"
              >
                {pricingProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Duration: <span className="text-slate-900 font-mono font-bold">{calcDuration} hours</span></label>
              <input type="range" min={1} max={12} value={calcDuration} onChange={e => setCalcDuration(Number(e.target.value))} className="w-full accent-purple-600 h-1 rounded-full bg-slate-200" />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 font-medium"><span>1h</span><span>12h</span></div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Travel Distance: <span className="text-slate-900 font-mono font-bold">{calcTravelKm} KM</span></label>
              <input type="range" min={0} max={50} value={calcTravelKm} onChange={e => setCalcTravelKm(Number(e.target.value))} className="w-full accent-purple-600 h-1 rounded-full bg-slate-200" />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 font-medium"><span>0 KM</span><span>50 KM</span></div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-purple-300 transition-colors">
              <input type="checkbox" checked={isWeekend} onChange={e => setIsWeekend(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
              <span className="text-slate-900 font-bold text-[11px]">Weekend / Holiday Booking</span>
            </label>
          </div>

          {/* Breakdown Box */}
          {breakdown && (
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/90 font-mono text-[11px] space-y-1.5">
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
              <div className="pt-1.5 mt-1 border-t border-slate-200/90 flex justify-between items-center font-sans font-extrabold text-xs">
                <span className="text-slate-900">Total Price:</span>
                <span className="text-emerald-600 text-sm font-mono">₹{breakdown.finalPrice}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Pricing Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-5 space-y-3.5 shadow-2xl my-auto text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-white text-sm">
                {editingProfile ? `Edit: ${editingProfile.name}` : 'Create Pricing Profile'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-2.5 text-[11px]">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Profile Name *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Festival Surge Profile"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 transition-colors text-[11px]" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Pricing Type</label>
                  <select value={pricingType} onChange={e => setPricingType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                    <option value="Hourly">Hourly</option>
                    <option value="Fixed Price">Fixed Price</option>
                    <option value="Per Event">Per Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Base Price (₹) *</label>
                  <input type="number" required value={basePrice} onChange={e => setBasePrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Extra/hr (₹)</label>
                  <input type="number" value={extraHourPrice} onChange={e => setExtraHourPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Platform Fee %</label>
                  <input type="number" value={platformFee} onChange={e => setPlatformFee(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">GST Tax %</label>
                  <input type="number" value={tax} onChange={e => setTax(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Weekend Multiplier</label>
                  <input type="number" step="0.05" value={weekendMultiplier} onChange={e => setWeekendMultiplier(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Holiday Multiplier</label>
                  <input type="number" step="0.05" value={holidayMultiplier} onChange={e => setHolidayMultiplier(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                </div>
              </div>
              <div className="pt-2.5 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]">
                  {editingProfile ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
