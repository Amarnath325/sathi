'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin, Globe, ShieldCheck, Zap, Users, ShieldAlert, Eye,
  Settings, Power, CheckCircle2, AlertTriangle, Building,
  Plus, Search, X, Download, LayoutGrid, List,
  ChevronLeft, ChevronRight, Sparkles, Navigation
} from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import { LocationItem, LocationRiskTier } from '@/lib/types';
import { LocationDetailsModal } from '@/components/location/LocationDetailsModal';
import { LocationFormModal } from '@/components/location/LocationFormModal';
import { CascadingLocationSelector } from '@/components/location/CascadingLocationSelector';

export function LocationManagementModule() {
  const {
    locations,
    addLocation,
    updateLocation,
    toggleLocationActive,
    updateLocationSurge,
    addGeofenceZone,
    addPopularVenue,
  } = useAdminStore();

  const [activeSubFilter, setActiveSubFilter] = useState('all-cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [notification, setNotification] = useState<string | null>(null);
  const [viewingLocation, setViewingLocation] = useState<LocationItem | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showCascadePanel, setShowCascadePanel] = useState(false);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const metrics = useMemo(() => ({
    total: locations.length,
    active: locations.filter(l => l.isActive).length,
    safeZones: locations.reduce((acc, l) => acc + (l.geofencedZones?.length || 0), 0),
    surgeCities: locations.filter(l => l.surgePricingMultiplier > 1.0).length,
  }), [locations]);

  const tabCounts = useMemo(() => ({
    all: locations.length,
    active: locations.filter(l => l.isActive).length,
    surge: locations.filter(l => l.surgePricingMultiplier > 1.0).length,
    tier1: locations.filter(l => l.tier === 'TIER_1_METRO').length,
    riskLow: locations.filter(l => l.riskTier === 'LOW').length,
    riskMed: locations.filter(l => l.riskTier === 'MEDIUM').length,
    riskHigh: locations.filter(l => l.riskTier === 'HIGH' || l.riskTier === 'CRITICAL').length,
  }), [locations]);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = loc.name.toLowerCase().includes(q)
          || loc.country.toLowerCase().includes(q)
          || (loc.state && loc.state.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (activeSubFilter === 'active-hubs') return loc.isActive;
      if (activeSubFilter === 'high-surge') return loc.surgePricingMultiplier > 1.0;
      if (activeSubFilter === 'tier-1') return loc.tier === 'TIER_1_METRO';
      if (activeSubFilter === 'risk-low') return loc.riskTier === 'LOW';
      if (activeSubFilter === 'risk-medium') return loc.riskTier === 'MEDIUM';
      if (activeSubFilter === 'risk-high') return loc.riskTier === 'HIGH' || loc.riskTier === 'CRITICAL';
      return true;
    });
  }, [locations, activeSubFilter, searchQuery]);

  const totalPages = Math.ceil(filteredLocations.length / pageSize) || 1;
  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const getRiskBadge = (risk: LocationRiskTier) => {
    switch (risk) {
      case 'LOW': return (
        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
          <ShieldCheck className="w-2.5 h-2.5" /> Low Risk
        </span>
      );
      case 'MEDIUM': return (
        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
          <AlertTriangle className="w-2.5 h-2.5" /> Medium Risk
        </span>
      );
      case 'HIGH': return (
        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
          <ShieldAlert className="w-2.5 h-2.5" /> High Risk
        </span>
      );
      case 'CRITICAL': return (
        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
          <ShieldAlert className="w-2.5 h-2.5" /> Critical
        </span>
      );
      default: return <span className="text-[9px] text-slate-400">{risk}</span>;
    }
  };

  const handleExportCSV = () => {
    if (filteredLocations.length === 0) return;
    const headers = ['City', 'State', 'Country', 'Tier', 'Risk', 'Surge', 'Companions', 'Safe Zones', 'Status'];
    const rows = filteredLocations.map(l => [
      `"${l.name}"`, `"${l.state || ''}"`, `"${l.country}"`,
      l.tier, l.riskTier, `${l.surgePricingMultiplier}x`,
      l.companionCount, l.geofencedZones?.length || 0,
      l.isActive ? 'ACTIVE' : 'PAUSED',
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `Sathi_Locations_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported ${filteredLocations.length} locations!`);
  };

  const SUB_FILTERS = [
    { id: 'all-cities',   label: 'All Cities',   count: tabCounts.all },
    { id: 'active-hubs',  label: 'Active Hubs',  count: tabCounts.active },
    { id: 'high-surge',   label: '⚡ Surge',      count: tabCounts.surge },
    { id: 'tier-1',       label: 'Tier 1',        count: tabCounts.tier1 },
    { id: 'risk-low',     label: '🟢 Low Risk',   count: tabCounts.riskLow },
    { id: 'risk-medium',  label: '🟡 Med Risk',   count: tabCounts.riskMed },
    { id: 'risk-high',    label: '🔴 High Risk',  count: tabCounts.riskHigh },
  ];

  return (
    <div className="space-y-4 animate-fade-in text-xs">

      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Operational Hubs',   value: metrics.total,                 sub: 'Coverage hubs',          color: 'text-white',       icon: <Globe className="w-4 h-4 text-indigo-400" /> },
          { label: 'Active Operations',  value: `${metrics.active} Hubs`,      sub: '100% Geofenced',         color: 'text-emerald-400', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
          { label: 'Safe Zones',         value: metrics.safeZones,             sub: 'Meeting perimeters',     color: 'text-indigo-300',  icon: <ShieldCheck className="w-4 h-4 text-indigo-400" /> },
          { label: 'Surge Pricing',      value: `${metrics.surgeCities} Cities`, sub: 'Peak surge active',   color: 'text-amber-400',   icon: <Zap className="w-4 h-4 text-amber-400" /> },
        ].map((m, i) => (
          <div key={i} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 hover:border-slate-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold">{m.label}</span>
              {m.icon}
            </div>
            <div className={`text-xl font-black font-mono ${m.color}`}>{m.value}</div>
            <p className="text-[10px] text-slate-500">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Sub-Filter Tabs + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          {SUB_FILTERS.map(tab => {
            const isActive = activeSubFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveSubFilter(tab.id); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Grid / Table */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            <button
              onClick={() => { setViewMode('grid'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1.5 ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => { setViewMode('table'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1.5 ${viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-3.5 h-3.5" /> Table
            </button>
          </div>

          {/* Cascade Toggle */}
          <button
            onClick={() => setShowCascadePanel(prev => !prev)}
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              showCascadePanel
                ? 'bg-purple-600/30 border-purple-500/50 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" /> Location Engine
          </button>

          {/* Add City */}
          <button
            onClick={() => { setEditingLocation(null); setIsFormOpen(true); }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-extrabold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add City
          </button>
        </div>
      </div>

      {/* Cascading Location Panel */}
      {showCascadePanel && (
        <div className="rounded-3xl border border-purple-500/20 bg-slate-900/80 overflow-hidden">
          <CascadingLocationSelector />
        </div>
      )}

      {/* Search + Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search city, state, country..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
            <span className="text-white font-bold">{filteredLocations.length}</span> of {locations.length} cities
          </span>
          <button
            onClick={handleExportCSV}
            className="h-8 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3 h-3 text-emerald-400" /> Export CSV
          </button>
        </div>
      </div>

      {/* Empty State */}
      {paginatedLocations.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
          <h4 className="text-base font-bold text-white">No Operational Cities Found</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No locations match the selected filter. Try "All Cities" or add a new hub.
          </p>
          <button
            onClick={() => { setEditingLocation(null); setIsFormOpen(true); }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md"
          >
            + Add First City
          </button>
        </div>

      ) : viewMode === 'grid' ? (

        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedLocations.map((loc) => {
            const coverImg = loc.coverImageUrl || 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop&q=80';
            return (
              <div
                key={loc.id}
                className={`rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl flex flex-col group ${
                  loc.isActive
                    ? 'border-slate-800 hover:border-indigo-500/40 bg-slate-900/90'
                    : 'border-rose-900/40 opacity-70 bg-slate-950/80'
                }`}
              >
                {/* Cover Image */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={coverImg}
                    alt={loc.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-xl text-[9.5px] font-extrabold tracking-wider bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/60 shadow">
                      {loc.tier.replace(/_/g, ' ')}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      {loc.surgePricingMultiplier > 1.0 && (
                        <span className="px-2.5 py-1 rounded-xl text-[9.5px] font-black bg-amber-500 text-slate-950 shadow flex items-center gap-1 animate-pulse">
                          <Zap className="w-2.5 h-2.5 fill-slate-950" /> {loc.surgePricingMultiplier}x Surge
                        </span>
                      )}
                      {getRiskBadge(loc.riskTier)}
                    </div>
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                        {loc.country} ({loc.countryCode})
                      </span>
                      <h3 className="text-lg font-extrabold text-white drop-shadow-md">
                        {loc.name}{loc.state ? `, ${loc.state}` : ''}
                      </h3>
                    </div>
                    <button
                      onClick={() => { toggleLocationActive(loc.id); triggerToast(`${loc.name} status toggled!`); }}
                      className={`px-2.5 py-1 rounded-xl text-[9.5px] font-bold border transition-all flex items-center gap-1 ${
                        loc.isActive
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-600 hover:text-white'
                          : 'bg-rose-950/80 text-rose-300 border-rose-700/60 hover:bg-rose-600 hover:text-white'
                      }`}
                    >
                      <Power className="w-2.5 h-2.5" /> {loc.isActive ? 'LIVE' : 'PAUSED'}
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  {/* Metric chips */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800/80 space-y-0.5">
                      <span className="text-[9.5px] font-semibold text-slate-400 flex items-center justify-center gap-1">
                        <Users className="w-2.5 h-2.5 text-indigo-400" /> Hosts
                      </span>
                      <p className="text-sm font-extrabold text-white">{loc.companionCount}</p>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800/80 space-y-0.5">
                      <span className="text-[9.5px] font-semibold text-slate-400 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Zones
                      </span>
                      <p className="text-sm font-extrabold text-emerald-400">{loc.geofencedZones?.length || 0}</p>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800/80 space-y-0.5">
                      <span className="text-[9.5px] font-semibold text-slate-400 flex items-center justify-center gap-1">
                        <Building className="w-2.5 h-2.5 text-indigo-400" /> Venues
                      </span>
                      <p className="text-sm font-extrabold text-indigo-300">{loc.popularVenues?.length || 0}</p>
                    </div>
                  </div>

                  {/* Helpline */}
                  <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/60 flex items-center justify-between">
                    <span className="font-mono text-slate-500 text-[9.5px]">Helpline SOS:</span>
                    <span className="font-mono font-bold text-slate-200 text-[10.5px]">{loc.policeHelpline}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto pt-1">
                    <button
                      onClick={() => setViewingLocation(loc)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-300 font-bold text-xs border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Geofences
                    </button>
                    <button
                      onClick={() => { setEditingLocation(loc); setIsFormOpen(true); }}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
                      title="Edit City"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      ) : (

        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-md">
          <table className="w-full text-left text-[11.5px] text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[9.5px] font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold">City / Region</th>
                <th className="py-3 px-4 font-bold">Country</th>
                <th className="py-3 px-4 font-bold">Tier</th>
                <th className="py-3 px-4 font-bold">Risk</th>
                <th className="py-3 px-4 font-bold">Surge</th>
                <th className="py-3 px-4 font-bold">Hosts</th>
                <th className="py-3 px-4 font-bold">Zones</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedLocations.map(loc => (
                <tr key={loc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4">
                    <span className="font-bold text-white block">{loc.name}</span>
                    {loc.state && <span className="text-[9px] text-slate-400 font-mono">{loc.state}</span>}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-[10.5px] text-indigo-300 font-mono font-bold">{loc.countryCode}</span>
                    <span className="text-[9px] text-slate-500 block">{loc.country}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[9.5px] font-mono font-bold">
                      {loc.tier.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">{getRiskBadge(loc.riskTier)}</td>
                  <td className="py-2.5 px-4">
                    {loc.surgePricingMultiplier > 1.0 ? (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[9.5px] font-bold border border-amber-500/30 flex items-center gap-1 w-fit">
                        <Zap className="w-2.5 h-2.5" /> {loc.surgePricingMultiplier}x
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[9.5px]">1.0x Normal</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-white">{loc.companionCount}</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-400">{loc.geofencedZones?.length || 0}</td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      loc.isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      {loc.isActive ? 'OPERATIONAL' : 'PAUSED'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingLocation(loc)}
                        className="h-7 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-indigo-400" /> Details
                      </button>
                      <button
                        onClick={() => { toggleLocationActive(loc.id); triggerToast(`${loc.name} status toggled!`); }}
                        className={`h-7 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                          loc.isActive
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        <Power className="w-3 h-3" /> {loc.isActive ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => { setEditingLocation(loc); setIsFormOpen(true); }}
                        className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                      >
                        <Settings className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredLocations.length > pageSize && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono">
            Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
            {' · '}{filteredLocations.length} total
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 w-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 flex items-center justify-center disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-7 w-7 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 w-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 flex items-center justify-center disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Location Details Modal */}
      {viewingLocation && (
        <LocationDetailsModal
          location={viewingLocation}
          isOpen={!!viewingLocation}
          onClose={() => setViewingLocation(null)}
          onUpdateSurge={(id, mult) => { updateLocationSurge(id, mult); triggerToast(`Surge updated to ${mult}x!`); }}
          onAddZone={(id, zone) => { addGeofenceZone(id, zone); triggerToast('Geofence zone added!'); }}
          onAddVenue={(id, venue) => { addPopularVenue(id, venue); triggerToast('Popular venue added!'); }}
        />
      )}

      {/* Add / Edit Modal */}
      {isFormOpen && (
        <LocationFormModal
          isOpen={isFormOpen}
          location={editingLocation}
          onClose={() => { setIsFormOpen(false); setEditingLocation(null); }}
          onSave={(data) => {
            if (editingLocation) {
              updateLocation(editingLocation.id, data);
              triggerToast(`"${data.name}" updated successfully!`);
            } else {
              addLocation(data);
              triggerToast(`City "${data.name}" added to hubs!`);
            }
            setIsFormOpen(false);
            setEditingLocation(null);
          }}
        />
      )}

    </div>
  );
}
