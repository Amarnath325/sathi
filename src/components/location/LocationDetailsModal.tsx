'use client';

import React, { useState } from 'react';
import { LocationItem, GeofenceZone, PopularVenue } from '@/lib/types';
import {
  X,
  MapPin,
  ShieldCheck,
  Zap,
  Building,
  Phone,
  Plus,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Star,
  Shield
} from 'lucide-react';

interface Props {
  location: LocationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSurge: (id: string, surge: number) => void;
  onAddZone: (locationId: string, zone: Omit<GeofenceZone, 'id'>) => void;
  onAddVenue: (locationId: string, venue: Omit<PopularVenue, 'id'>) => void;
}

export function LocationDetailsModal({
  location,
  isOpen,
  onClose,
  onUpdateSurge,
  onAddZone,
  onAddVenue
}: Props) {
  if (!isOpen || !location) return null;

  const [surgeInput, setSurgeInput] = useState(location.surgePricingMultiplier || 1.0);
  const [showAddZone, setShowAddZone] = useState(false);
  const [showAddVenue, setShowAddVenue] = useState(false);

  // New Zone form state
  const [zoneName, setZoneName] = useState('');
  const [zoneRadius, setZoneRadius] = useState(3.0);
  const [zoneScore, setZoneScore] = useState(95);

  // New Venue form state
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueCategory, setVenueCategory] = useState('Luxury Hotel & Lounge');

  const handleSurgeSave = () => {
    onUpdateSurge(location.id, Number(surgeInput));
  };

  const handleAddZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim()) return;
    onAddZone(location.id, {
      name: zoneName.trim(),
      radiusKm: Number(zoneRadius),
      safetyScore: Number(zoneScore),
      venueTypes: ['Public Promenade', 'Verified Hub']
    });
    setZoneName('');
    setShowAddZone(false);
  };

  const handleAddVenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueName.trim()) return;
    onAddVenue(location.id, {
      name: venueName.trim(),
      address: venueAddress.trim(),
      category: venueCategory.trim(),
      safetyRating: 4.9,
      isPartnerVenue: true
    });
    setVenueName('');
    setVenueAddress('');
    setShowAddVenue(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 text-slate-900 dark:text-white max-h-[96vh] overflow-hidden flex flex-col my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-600/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm shrink-0">
              {location.countryCode}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                  {location.name}{location.state ? `, ${location.state}` : ''}, {location.country}
                </h2>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                  {location.tier.replace(/_/g, ' ')}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  location.isActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                    : 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/40'
                }`}>
                  {location.isActive ? 'OPERATIONAL HUB' : 'SUSPENDED'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Real-time surge multipliers, safe perimeter geofencing, and verified partner venues.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Surge Controls & Location Stats Bar (Compact Single Row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2.5">
          {/* Surge Multiplier Adjuster */}
          <div className="p-2.5 rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/20 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500" /> Surge Multiplier
              </span>
              <span className="text-xs font-mono font-extrabold text-amber-900 dark:text-white">
                {location.surgePricingMultiplier}x
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="3.0"
                value={surgeInput}
                onChange={e => setSurgeInput(Number(e.target.value))}
                className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-950 border border-amber-300 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                onClick={handleSurgeSave}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-[11px] hover:bg-amber-400 transition-all shadow-sm shrink-0 cursor-pointer"
              >
                Set Surge
              </button>
            </div>
          </div>

          {/* Coordinates & Risk Matrix */}
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-indigo-500" /> GPS Center Point
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {location.riskTier} RISK
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-slate-800 dark:text-white mt-1">
              Lat: {location.coordinates?.lat?.toFixed(4) ?? '37.7749'}, Lng: {location.coordinates?.lng?.toFixed(4) ?? '-122.4194'}
            </p>
          </div>

          {/* Active Companions count */}
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-500" /> Operational Hosts
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-mono font-extrabold text-slate-900 dark:text-white">
                {location.companionCount} Companions
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Active in City Hub</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Safe Zones (Left) & Partner Venues (Right) - Zero Scrollable Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 flex-1 min-h-0">
          {/* LEFT: Geofenced Safe Zones */}
          <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80 mb-2">
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Geofenced Safe Zones ({location.geofencedZones?.length || 0})</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddZone(!showAddZone)}
                className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Zone
              </button>
            </div>

            {/* Inline Add Zone Form */}
            {showAddZone && (
              <form onSubmit={handleAddZoneSubmit} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-500/40 mb-2 space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="col-span-2">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Zone Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marina District"
                      value={zoneName}
                      onChange={e => setZoneName(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Radius (km)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="20"
                      value={zoneRadius}
                      onChange={e => setZoneRadius(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <div className="flex items-center gap-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Safety Score:</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={zoneScore}
                      onChange={e => setZoneScore(Number(e.target.value))}
                      className="w-14 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                    />
                    <span className="text-[10px] font-bold text-emerald-600">%</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowAddZone(false)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-2.5 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* List of Zones (Fitted / internal scroll) */}
            <div className="space-y-1.5 overflow-y-auto max-h-[160px] pr-1">
              {location.geofencedZones?.length ? (
                location.geofencedZones.map((z) => (
                  <div key={z.id} className="p-2 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-[11px]">{z.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[9px] font-extrabold font-mono">
                          {z.safetyScore}% Safe
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                        Radius: {z.radiusKm} km • <span className="text-slate-400">{z.venueTypes?.slice(0, 2).join(', ')}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-[11px] text-slate-400">
                  No geofence zones defined for this city.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Verified Partner Venues */}
          <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80 mb-2">
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                <span>Verified Public Venues ({location.popularVenues?.length || 0})</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddVenue(!showAddVenue)}
                className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Venue
              </button>
            </div>

            {/* Inline Add Venue Form */}
            {showAddVenue && (
              <form onSubmit={handleAddVenueSubmit} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-500/40 mb-2 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Venue Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand Hyatt Lounge"
                      value={venueName}
                      onChange={e => setVenueName(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Luxury Hotel"
                      value={venueCategory}
                      onChange={e => setVenueCategory(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100 Market St, San Francisco, CA"
                    value={venueAddress}
                    onChange={e => setVenueAddress(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddVenue(false)}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px]"
                  >
                    Save Venue
                  </button>
                </div>
              </form>
            )}

            {/* List of Venues (Fitted / internal scroll) */}
            <div className="space-y-1.5 overflow-y-auto max-h-[160px] pr-1">
              {location.popularVenues?.length ? (
                location.popularVenues.map((pv) => (
                  <div key={pv.id} className="p-2 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-[11px] truncate">{pv.name}</span>
                        {pv.isPartnerVenue && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[9px] font-bold shrink-0">
                            Partner Secured
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5 truncate">{pv.address}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-amber-500">★ {pv.safetyRating}</span>
                      <span className="text-[9px] text-slate-400 block">{pv.category}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-[11px] text-slate-400">
                  No verified venues listed yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Footer: Emergency Helplines + Close Button (Single Row, Zero-Scroll) */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2.5 mt-1">
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Phone className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-medium">Sathi Field:</span>
              <strong className="font-mono text-slate-900 dark:text-white">{location.emergencyContactPhone}</strong>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-medium">Police Helpline:</span>
              <strong className="font-mono text-rose-600 dark:text-rose-400">{location.policeHelpline}</strong>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
