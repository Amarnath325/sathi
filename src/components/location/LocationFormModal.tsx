'use client';

import React, { useState, useEffect } from 'react';
import { LocationItem, LocationRiskTier, LocationMetroTier } from '@/lib/types';
import {
  X,
  MapPin,
  Globe,
  ShieldCheck,
  Zap,
  Phone,
  Plus,
  Edit2,
  Navigation,
  Compass,
  CheckCircle2,
  AlertCircle,
  Building2,
  Camera
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  location?: LocationItem | null;
  onClose: () => void;
  onSave: (data: Omit<LocationItem, 'id' | 'createdAt' | 'updatedAt'> | LocationItem) => void;
}

export function LocationFormModal({ isOpen, location, onClose, onSave }: Props) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [tier, setTier] = useState<LocationMetroTier>('TIER_1_METRO');
  const [riskTier, setRiskTier] = useState<LocationRiskTier>('LOW');
  const [surgePricingMultiplier, setSurgePricingMultiplier] = useState(1.0);
  const [isActive, setIsActive] = useState(true);
  const [lat, setLat] = useState(37.7749);
  const [lng, setLng] = useState(-122.4194);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [policeHelpline, setPoliceHelpline] = useState('');
  const [safetyProtocolNotes, setSafetyProtocolNotes] = useState('');

  useEffect(() => {
    if (location) {
      setName(location.name);
      setState(location.state || '');
      setCountry(location.country);
      setCountryCode(location.countryCode);
      setTier(location.tier);
      setRiskTier(location.riskTier);
      setSurgePricingMultiplier(location.surgePricingMultiplier);
      setIsActive(location.isActive);
      setLat(location.coordinates?.lat ?? 37.7749);
      setLng(location.coordinates?.lng ?? -122.4194);
      setCoverImageUrl(location.coverImageUrl || '');
      setEmergencyContactPhone(location.emergencyContactPhone || '');
      setPoliceHelpline(location.policeHelpline || '');
      setSafetyProtocolNotes(location.safetyProtocolNotes || '');
    } else {
      setName('');
      setState('');
      setCountry('United States');
      setCountryCode('US');
      setTier('TIER_1_METRO');
      setRiskTier('LOW');
      setSurgePricingMultiplier(1.0);
      setIsActive(true);
      setLat(37.7749);
      setLng(-122.4194);
      setCoverImageUrl('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80');
      setEmergencyContactPhone('+1 (800) 555-SATHI');
      setPoliceHelpline('911 / Local Emergency');
      setSafetyProtocolNotes('Public venue policy enabled with 24/7 GPS tracking.');
    }
  }, [location, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...(location ? { id: location.id } : {}),
      name: name.trim(),
      state: state.trim(),
      country: country.trim(),
      countryCode: countryCode.trim().toUpperCase(),
      tier,
      riskTier,
      surgePricingMultiplier: Number(surgePricingMultiplier),
      isActive,
      companionCount: location ? location.companionCount : 0,
      coordinates: { lat: Number(lat), lng: Number(lng) },
      coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
      geofencedZones: location ? location.geofencedZones : [],
      popularVenues: location ? location.popularVenues : [],
      emergencyContactPhone: emergencyContactPhone.trim(),
      policeHelpline: policeHelpline.trim(),
      safetyProtocolNotes: safetyProtocolNotes.trim()
    };

    onSave(payload as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 text-slate-900 dark:text-white my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              {location ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 leading-tight">
                {location ? `Edit Operational City: ${location.name}` : 'Add New Operational Hub'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Configure city boundaries, risk tier ratings, and surge multipliers.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form - 2 Column Compact Grid (No Scroll) */}
        <form onSubmit={handleSubmit} className="pt-3 space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
            {/* Column 1: Regional & Operational Profile */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800/80 pb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Regional & Geographic Details</span>
              </div>

              {/* City Name & State */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    City Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. San Francisco"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CA"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Country & Country Code */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United States"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    ISO Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="US"
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs font-mono uppercase text-center font-bold"
                  />
                </div>
              </div>

              {/* Metro Tier & Risk Tier */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Metro Tier
                  </label>
                  <select
                    value={tier}
                    onChange={e => setTier(e.target.value as LocationMetroTier)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs"
                  >
                    <option value="TIER_1_METRO">TIER 1 (Metro)</option>
                    <option value="TIER_2_REGIONAL">TIER 2 (Regional)</option>
                    <option value="TIER_3_LOCAL">TIER 3 (Local)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Risk Tier
                  </label>
                  <select
                    value={riskTier}
                    onChange={e => setRiskTier(e.target.value as LocationRiskTier)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs"
                  >
                    <option value="LOW">LOW Risk</option>
                    <option value="MEDIUM">MEDIUM Risk</option>
                    <option value="HIGH">HIGH Risk</option>
                    <option value="CRITICAL">CRITICAL Risk</option>
                  </select>
                </div>
              </div>

              {/* Surge Pricing Multiplier & Status */}
              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Surge Multiplier ({surgePricingMultiplier}x)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="3.0"
                    value={surgePricingMultiplier}
                    onChange={e => setSurgePricingMultiplier(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-full py-1.5 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    <span>{isActive ? 'Hub Active' : 'Suspended'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: Telemetry & Safety Helplines */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800/80 pb-1">
                <Navigation className="w-3.5 h-3.5" />
                <span>Telemetry & Emergency Helplines</span>
              </div>

              {/* GPS Coordinates */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    GPS Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={e => setLat(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    GPS Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={e => setLng(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={coverImageUrl}
                  onChange={e => setCoverImageUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs"
                />
              </div>

              {/* Emergency Contacts */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Emergency Sathi Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (800) 555-SATHI"
                    value={emergencyContactPhone}
                    onChange={e => setEmergencyContactPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Police / SOS Helpline
                  </label>
                  <input
                    type="text"
                    placeholder="911 / Local Emergency"
                    value={policeHelpline}
                    onChange={e => setPoliceHelpline(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Safety Protocol Notes */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Safety Protocol Policy Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified safe zone policy with 24/7 GPS dispatch"
                  value={safetyProtocolNotes}
                  onChange={e => setSafetyProtocolNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Footer with Summary Pill and Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className={`inline-block w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="font-medium text-[11px]">
                {name ? `${name} (${countryCode.toUpperCase()})` : 'New Operational Hub'} • {tier.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                {location ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{location ? 'Save Changes' : 'Create Operational Hub'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
