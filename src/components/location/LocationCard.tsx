'use client';

import React from 'react';
import { LocationItem, LocationRiskTier } from '@/lib/types';
import { MapPin, ShieldCheck, Zap, Users, ShieldAlert, Eye, Settings, Power, CheckCircle2, AlertTriangle, Building } from 'lucide-react';

interface LocationCardProps {
  location: LocationItem;
  onViewDetails: (loc: LocationItem) => void;
  onToggleActive: (id: string) => void;
  onEditLocation?: (loc: LocationItem) => void;
}

export function LocationCard({ location, onViewDetails, onToggleActive, onEditLocation }: LocationCardProps) {
  const getRiskBadge = (risk: LocationRiskTier) => {
    switch (risk) {
      case 'LOW':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Low Risk</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-400" /> Medium Risk</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-rose-400" /> High Risk</span>;
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-purple-400" /> Critical Alert</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">{risk}</span>;
    }
  };

  return (
    <div className={`glass-panel rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl flex flex-col justify-between ${
      location.isActive ? 'border-slate-800 hover:border-indigo-500/40' : 'border-rose-900/40 opacity-70 bg-slate-950/80'
    }`}>
      {/* Cover Image & Header Badges */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        <img
          src={location.coverImageUrl || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80'}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold tracking-wider bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/60 shadow-lg">
            {location.tier.replace(/_/g, ' ')}
          </span>

          <div className="flex items-center gap-1.5">
            {location.surgePricingMultiplier > 1.0 && (
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-amber-500 text-slate-950 shadow-lg flex items-center gap-1 animate-pulse">
                <Zap className="w-3 h-3 fill-slate-950" /> {location.surgePricingMultiplier}x Surge
              </span>
            )}
            {getRiskBadge(location.riskTier)}
          </div>
        </div>

        {/* Bottom Image Overlay Text */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">{location.country} ({location.countryCode})</span>
            <h3 className="text-xl font-extrabold text-white tracking-tight drop-shadow-md">{location.name}{location.state ? `, ${location.state}` : ''}</h3>
          </div>
          <button
            onClick={() => onToggleActive(location.id)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1 ${
              location.isActive
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-600 hover:text-white'
                : 'bg-rose-950/80 text-rose-300 border-rose-700/60 hover:bg-rose-600 hover:text-white'
            }`}
          >
            <Power className="w-3 h-3" /> {location.isActive ? 'OPERATIONAL' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4">
        {/* Metric Badges Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800/80 space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" /> Hosts
            </span>
            <p className="text-sm font-extrabold text-white">{location.companionCount}</p>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800/80 space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Safe Zones
            </span>
            <p className="text-sm font-extrabold text-emerald-400">{location.geofencedZones?.length || 0}</p>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800/80 space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1">
              <Building className="w-3 h-3 text-indigo-400" /> Venues
            </span>
            <p className="text-sm font-extrabold text-indigo-300">{location.popularVenues?.length || 0}</p>
          </div>
        </div>

        {/* Emergency Hotline summary */}
        <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-500">Helpline SOS:</span>
          <span className="font-mono font-bold text-slate-200">{location.policeHelpline}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(location)}
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 font-bold text-xs border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" /> View Geofences & Audit
        </button>

        {onEditLocation && (
          <button
            onClick={() => onEditLocation(location)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="Edit City Configuration"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
