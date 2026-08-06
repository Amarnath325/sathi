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
  FileText,
  Lock,
  Globe
} from 'lucide-react';

interface Props {
  location: LocationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSurge: (id: string, surge: number) => void;
  onAddZone: (locationId: string, zone: Omit<GeofenceZone, 'id'>) => void;
  onAddVenue: (locationId: string, venue: Omit<PopularVenue, 'id'>) => void;
}

export function LocationDetailsModal({ location, isOpen, onClose, onUpdateSurge, onAddZone, onAddVenue }: Props) {
  if (!isOpen || !location) return null;

  const [surgeInput, setSurgeInput] = useState(location.surgePricingMultiplier || 1.0);
  const [showAddZone, setShowAddZone] = useState(false);
  const [showAddVenue, setShowAddVenue] = useState(false);

  // New Zone state
  const [zoneName, setZoneName] = useState('');
  const [zoneRadius, setZoneRadius] = useState(3.0);
  const [zoneScore, setZoneScore] = useState(95);

  // New Venue state
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
      name: zoneName,
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
      name: venueName,
      address: venueAddress,
      category: venueCategory,
      safetyRating: 4.9,
      isPartnerVenue: true
    });
    setVenueName('');
    setVenueAddress('');
    setShowAddVenue(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-xl">
              {location.countryCode}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-800">
                  {location.tier.replace(/_/g, ' ')}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  location.isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {location.isActive ? 'OPERATIONAL HUB' : 'SUSPENDED'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {location.name}{location.state ? `, ${location.state}` : ''}, {location.country}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Surge Controls & Location Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Surge Multiplier Adjuster */}
          <div className="glass-panel p-4 rounded-2xl border border-amber-500/40 space-y-2 bg-amber-950/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-4 h-4 fill-amber-400" /> Surge Multiplier
              </span>
              <span className="text-xs font-mono font-extrabold text-white">{location.surgePricingMultiplier}x</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="3.0"
                value={surgeInput}
                onChange={e => setSurgeInput(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSurgeSave}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-md shrink-0"
              >
                Set Surge
              </button>
            </div>
          </div>

          {/* Coordinates & Risk Matrix */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1 bg-slate-900/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-4 h-4 text-indigo-400" /> GPS Center Coordinates
            </span>
            <p className="text-xs font-mono font-bold text-white mt-1">
              Lat: {location.coordinates.lat.toFixed(4)}, Lng: {location.coordinates.lng.toFixed(4)}
            </p>
            <span className="text-[10px] text-slate-400 block font-semibold">Risk Classification: <strong className="text-emerald-400">{location.riskTier} RISK</strong></span>
          </div>

          {/* Active Companions count */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1 bg-slate-900/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-4 h-4 text-indigo-400" /> Operational Hosts
            </span>
            <p className="text-xl font-mono font-extrabold text-white mt-0.5">{location.companionCount} Companions</p>
            <span className="text-[10px] text-slate-400 block font-semibold">Active in City Hub</span>
          </div>
        </div>

        {/* Geofenced Safe Zones Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Geofenced Safe Meeting Zones ({location.geofencedZones?.length || 0})
            </h3>
            <button
              onClick={() => setShowAddZone(!showAddZone)}
              className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-400 text-xs font-bold transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Safe Zone
            </button>
          </div>

          {showAddZone && (
            <form onSubmit={handleAddZoneSubmit} className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Zone Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marina District Walkway"
                    value={zoneName}
                    onChange={e => setZoneName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Radius (Km)</label>
                  <input
                    type="number" step="0.5" min="0.5" max="20"
                    value={zoneRadius}
                    onChange={e => setZoneRadius(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Safety Index (0-100%)</label>
                  <input
                    type="number" min="50" max="100"
                    value={zoneScore}
                    onChange={e => setZoneScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddZone(false)} className="px-3 py-1 rounded-xl bg-slate-800 text-xs text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-1 rounded-xl bg-indigo-600 text-white font-bold text-xs">Save Zone</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {location.geofencedZones?.map((z) => (
              <div key={z.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{z.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-extrabold font-mono">
                    {z.safetyScore}% Safe
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Radius: {z.radiusKm} km</span>
                  <span className="truncate max-w-[150px]">{z.venueTypes?.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Public Meeting Venues Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
              <Building className="w-4 h-4 text-indigo-400" /> Verified Safe Public Venues ({location.popularVenues?.length || 0})
            </h3>
            <button
              onClick={() => setShowAddVenue(!showAddVenue)}
              className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-400 text-xs font-bold transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Partner Venue
            </button>
          </div>

          {showAddVenue && (
            <form onSubmit={handleAddVenueSubmit} className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Venue Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand Hyatt Lounge"
                    value={venueName}
                    onChange={e => setVenueName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury Hotel"
                    value={venueCategory}
                    onChange={e => setVenueCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Market St, San Francisco, CA"
                  value={venueAddress}
                  onChange={e => setVenueAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddVenue(false)} className="px-3 py-1 rounded-xl bg-slate-800 text-xs text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-1 rounded-xl bg-indigo-600 text-white font-bold text-xs">Save Venue</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {location.popularVenues?.map((pv) => (
              <div key={pv.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white">{pv.name}</span>
                    {pv.isPartnerVenue && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">
                        Partner Secured
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{pv.address}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-amber-400">★ {pv.safetyRating}</span>
                  <span className="text-[10px] text-slate-500 block">{pv.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Hotline Footer */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-rose-400" /> Emergency SOS Dispatch Contacts
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Sathi Field Response Phone</span>
              <span className="font-mono font-bold text-white">{location.emergencyContactPhone}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Metropolitan Police Helpline</span>
              <span className="font-mono font-bold text-rose-400">{location.policeHelpline}</span>
            </div>
          </div>
          {location.safetyProtocolNotes && (
            <p className="text-[11px] text-slate-400 italic pt-1">"{location.safetyProtocolNotes}"</p>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            Close Audit Modal
          </button>
        </div>
      </div>
    </div>
  );
}
