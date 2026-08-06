'use client';

import React, { useState, useEffect } from 'react';
import { LocationItem, LocationRiskTier, LocationMetroTier } from '@/lib/types';
import { X, MapPin, Globe, ShieldCheck, Zap, Phone, Plus, Edit2 } from 'lucide-react';

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
      setLat(location.coordinates.lat);
      setLng(location.coordinates.lng);
      setCoverImageUrl(location.coverImageUrl || '');
      setEmergencyContactPhone(location.emergencyContactPhone);
      setPoliceHelpline(location.policeHelpline);
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
      name,
      state,
      country,
      countryCode: countryCode.toUpperCase(),
      tier,
      riskTier,
      surgePricingMultiplier: Number(surgePricingMultiplier),
      isActive,
      companionCount: location ? location.companionCount : 0,
      coordinates: { lat: Number(lat), lng: Number(lng) },
      coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
      geofencedZones: location ? location.geofencedZones : [],
      popularVenues: location ? location.popularVenues : [],
      emergencyContactPhone,
      policeHelpline,
      safetyProtocolNotes
    };

    onSave(payload as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              {location ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
              {location ? `Edit Operational City: ${location.name}` : 'Add New Operational Hub'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Configure city boundaries, risk tier ratings, and surge multipliers.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">City Name</label>
              <input
                type="text"
                required
                placeholder="e.g. San Francisco"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">State / Province</label>
              <input
                type="text"
                placeholder="e.g. CA"
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Country</label>
              <input
                type="text"
                required
                placeholder="e.g. United States"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Country Code (ISO)</label>
              <input
                type="text"
                required
                maxLength={3}
                placeholder="US"
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Metro Tier</label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value as LocationMetroTier)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="TIER_1_METRO">TIER_1_METRO</option>
                <option value="TIER_2_REGIONAL">TIER_2_REGIONAL</option>
                <option value="TIER_3_LOCAL">TIER_3_LOCAL</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Tier Rating</label>
              <select
                value={riskTier}
                onChange={e => setRiskTier(e.target.value as LocationRiskTier)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Surge Multiplier</label>
              <input
                type="number" step="0.05" min="1.0" max="3.0"
                value={surgePricingMultiplier}
                onChange={e => setSurgePricingMultiplier(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">GPS Latitude</label>
              <input
                type="number" step="0.0001"
                value={lat}
                onChange={e => setLat(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">GPS Longitude</label>
              <input
                type="number" step="0.0001"
                value={lng}
                onChange={e => setLng(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cover Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={coverImageUrl}
              onChange={e => setCoverImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency Sathi Phone</label>
              <input
                type="text"
                placeholder="+1 (800) 555-SATHI"
                value={emergencyContactPhone}
                onChange={e => setEmergencyContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Police / SOS Helpline</label>
              <input
                type="text"
                placeholder="911 / Local Emergency"
                value={policeHelpline}
                onChange={e => setPoliceHelpline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="locActiveCheck"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-500 bg-slate-900 border-slate-800 cursor-pointer"
            />
            <label htmlFor="locActiveCheck" className="text-xs font-bold text-slate-300 cursor-pointer">
              Set Location Hub to Operational ACTIVE Mode
            </label>
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
              className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white font-extrabold hover:opacity-90 shadow-lg shadow-indigo-600/30"
            >
              {location ? 'Save Location Changes' : 'Create Operational Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
