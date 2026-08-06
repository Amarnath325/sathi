'use client';

import React from 'react';
import { CompanionFilter, SortOption } from '@/lib/types';
import { ALL_CATEGORIES } from '@/lib/mockData';
import { Search, SlidersHorizontal, X, TrendingUp, Star, DollarSign, Clock, Shield } from 'lucide-react';

interface Props {
  filters: CompanionFilter;
  onChange: (f: CompanionFilter) => void;
  onReset: () => void;
  totalResults: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'rating_desc', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'most_booked', label: 'Most Booked' },
  { value: 'newest', label: 'Newest' },
];

const CITIES = ['New York', 'San Francisco', 'London', 'Paris', 'Mumbai', 'Tokyo', 'Sydney', 'Chicago'];
const GENDERS = ['Female', 'Male', 'Non-binary'];
const RATINGS = [4.9, 4.8, 4.5, 4.0];

export function CompanionFilters({ filters, onChange, onReset, totalResults }: Props) {
  const set = (key: keyof CompanionFilter, value: any) => onChange({ ...filters, [key]: value });

  const hasActiveFilters = filters.search || filters.category || filters.city || filters.gender ||
    filters.minRate > 0 || filters.maxRate < 500 || filters.minRating > 0 ||
    filters.availableNow || filters.verifiedOnly || filters.status;

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          Filters
        </div>
        {hasActiveFilters && (
          <button onClick={onReset} className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold">
            <X className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search companions..."
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
        />
      </div>

      {/* Sort */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={e => set('sortBy', e.target.value as SortOption)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm text-white transition-colors"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => set('category', filters.category === cat ? '' : cat)}
              className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold transition-all
                ${filters.category === cat
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">City</label>
        <select
          value={filters.city}
          onChange={e => set('city', e.target.value)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm text-white transition-colors"
        >
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
        <div className="flex gap-2">
          {GENDERS.map(g => (
            <button
              key={g}
              onClick={() => set('gender', filters.gender === g ? '' : g)}
              className={`flex-1 py-1.5 rounded-xl border text-[11px] font-semibold transition-all
                ${filters.gender === g
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <DollarSign className="w-3 h-3" /> Hourly Rate
          <span className="ml-auto text-indigo-400 font-bold">${filters.minRate} – ${filters.maxRate === 9999 ? '500+' : filters.maxRate}</span>
        </label>
        <div className="space-y-2">
          <input
            type="range" min={0} max={500} step={5}
            value={filters.maxRate === 9999 ? 500 : filters.maxRate}
            onChange={e => set('maxRate', Number(e.target.value) === 500 ? 9999 : Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>$0</span><span>$500+</span>
          </div>
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Star className="w-3 h-3" /> Min Rating
        </label>
        <div className="flex gap-1.5">
          {RATINGS.map(r => (
            <button
              key={r}
              onClick={() => set('minRating', filters.minRating === r ? 0 : r)}
              className={`flex-1 py-1.5 rounded-xl border text-[11px] font-semibold transition-all
                ${filters.minRating === r
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              {r}+
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 border-t border-slate-800 pt-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm text-slate-300 group-hover:text-white transition-colors flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Available Now
          </span>
          <button
            onClick={() => set('availableNow', !filters.availableNow)}
            className={`relative w-10 h-5 rounded-full transition-colors ${filters.availableNow ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${filters.availableNow ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </label>

        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm text-slate-300 group-hover:text-white transition-colors flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" /> Verified Only
          </span>
          <button
            onClick={() => set('verifiedOnly', !filters.verifiedOnly)}
            className={`relative w-10 h-5 rounded-full transition-colors ${filters.verifiedOnly ? 'bg-indigo-500' : 'bg-slate-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${filters.verifiedOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </label>
      </div>

      {/* Result count */}
      <div className="text-center text-xs text-slate-500 border-t border-slate-800 pt-3">
        <span className="text-white font-bold">{totalResults}</span> companion{totalResults !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
