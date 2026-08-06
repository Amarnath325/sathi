'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAdminStore } from '@/lib/adminStore';
import { LocationItem } from '@/lib/types';
import { MapPin, Search, ChevronDown, Zap, ShieldCheck } from 'lucide-react';

interface LocationPickerProps {
  selectedCity?: string;
  onSelectCity: (city: string, location?: LocationItem) => void;
  className?: string;
}

export function LocationPicker({ selectedCity, onSelectCity, className = '' }: LocationPickerProps) {
  const { locations } = useAdminStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLocations = locations.filter((l: LocationItem) => l.isActive);
  const filtered = activeLocations.filter((l: LocationItem) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.country.toLowerCase().includes(search.toLowerCase())
  );

  const currentLoc = activeLocations.find((l: LocationItem) => l.name.toLowerCase() === selectedCity?.toLowerCase()) || activeLocations[0];


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-white font-semibold text-xs flex items-center justify-between gap-2 shadow-inner transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="truncate font-extrabold">{currentLoc ? `${currentLoc.name}, ${currentLoc.country}` : 'Select City Hub'}</span>
          {currentLoc?.surgePricingMultiplier > 1.0 && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black shrink-0 flex items-center gap-0.5">
              <Zap className="w-3 h-3 fill-amber-300" /> {currentLoc.surgePricingMultiplier}x
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 glass-panel rounded-2xl border border-slate-800 shadow-2xl p-2 space-y-2 bg-slate-950/95 backdrop-blur-xl max-h-64 overflow-y-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search operational city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            {filtered.length === 0 ? (
              <p className="text-[11px] text-slate-500 p-2 text-center">No operational cities found.</p>
            ) : (
              filtered.map((loc: LocationItem) => (

                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    onSelectCity(loc.name, loc);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                    loc.name.toLowerCase() === selectedCity?.toLowerCase()
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold'
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] font-extrabold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{loc.countryCode}</span>
                    <span className="truncate">{loc.name}, {loc.country}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {loc.surgePricingMultiplier > 1.0 && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black">
                        ⚡ {loc.surgePricingMultiplier}x
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">({loc.companionCount})</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
