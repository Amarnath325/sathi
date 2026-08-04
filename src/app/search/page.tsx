'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  SlidersHorizontal, 
  MapPin, 
  Sparkles,
  ArrowUpDown,
  UserCheck
} from 'lucide-react';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { recommendCompanions } from '@/lib/aiEngine';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [availableNowOnly, setAvailableNowOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'AI' | 'RATING' | 'PRICE_LOW' | 'PRICE_HIGH'>('AI');

  const categoriesList = ["ALL", "Event Companion", "Elderly Support & Care", "Travel & City Buddy", "Fitness & Outdoor", "Shopping & Styling", "Study & Co-Working"];

  const filteredCompanions = useMemo(() => {
    let result = recommendCompanions(MOCK_COMPANIONS, {
      category: selectedCategory === 'ALL' ? undefined : selectedCategory,
      maxPrice: maxPrice,
      verifiedOnly: verifiedOnly,
      searchQuery: searchQuery
    });

    if (availableNowOnly) {
      result = result.filter(c => c.isAvailableNow);
    }

    if (sortBy === 'RATING') {
      result.sort((a, b) => b.ratingAvg - a.ratingAvg);
    } else if (sortBy === 'PRICE_LOW') {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sortBy === 'PRICE_HIGH') {
      result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    }

    return result;
  }, [searchQuery, selectedCategory, maxPrice, verifiedOnly, availableNowOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Quick Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Explore Verified Companions <Sparkles className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">Search, compare rates, and instantly reserve background-checked partners.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skills, or city..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sort:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white border-none focus:outline-none font-medium cursor-pointer"
            >
              <option value="AI" className="bg-slate-900">AI Rank</option>
              <option value="RATING" className="bg-slate-900">Best Rating</option>
              <option value="PRICE_LOW" className="bg-slate-900">Price: Low to High</option>
              <option value="PRICE_HIGH" className="bg-slate-900">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Companion Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filter Sidebar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Advanced Filters
            </h3>
            <button 
              onClick={() => {
                setSelectedCategory('ALL');
                setMaxPrice(150);
                setVerifiedOnly(false);
                setAvailableNowOnly(false);
                setSearchQuery('');
              }}
              className="text-[11px] text-indigo-400 hover:underline font-medium"
            >
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Service Category</label>
            <div className="space-y-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                    selectedCategory === cat 
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Max Hourly Rate</span>
              <span className="font-mono text-emerald-400 font-bold">${maxPrice}/hr</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="200" 
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Verification & Availability Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> KYC Verified Only
              </span>
              <input 
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> Available Right Now
              </span>
              <input 
                type="checkbox"
                checked={availableNowOnly}
                onChange={(e) => setAvailableNowOnly(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Companion Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing <strong className="text-white">{filteredCompanions.length}</strong> verified companions</span>
            <span className="font-mono text-indigo-400">AI Risk Score Verified: &lt; 0.05</span>
          </div>

          {filteredCompanions.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
              <p className="text-sm text-slate-400">No companions match your exact filter parameters.</p>
              <button 
                onClick={() => { setSelectedCategory('ALL'); setMaxPrice(200); }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCompanions.map((comp) => (
                <div key={comp.id} className="rounded-3xl glass-card border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group">
                  
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={comp.avatar} 
                      alt={comp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                    {comp.verificationBadge && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    )}

                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> {comp.ratingAvg}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-base font-bold text-white">{comp.name}, {comp.age}</h3>
                      <p className="text-[11px] text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-400" /> {comp.city}, {comp.country}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-400 line-clamp-2">{comp.bio}</p>

                    <div className="flex flex-wrap gap-1">
                      {comp.skills.slice(0, 2).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-slate-300 border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500">Hourly Rate</span>
                        <p className="text-base font-extrabold text-white">${comp.hourlyRate}<span className="text-xs font-normal text-slate-400">/hr</span></p>
                      </div>
                      
                      <Link 
                        href={`/companion/${comp.id}`}
                        className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
