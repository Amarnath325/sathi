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
  Calendar,
  Clock,
  Award,
  AlertTriangle,
  Zap,
  Check
} from 'lucide-react';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { MarketplaceMatchingEngine, SearchCriteria } from '@/lib/matchingAlgorithm';
import { SearchAndLimitBar, PaginationFooter, PageSizeOption } from '@/components/common/PaginationBar';

export default function SearchPage() {
  const [locationQuery, setLocationQuery] = useState('Raipur');
  const [selectedCategory, setSelectedCategory] = useState<string>('Travel Companion');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-15');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM - 04:00 PM');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [availableNowOnly, setAvailableNowOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'MATCH_SCORE' | 'RATING' | 'PRICE_LOW' | 'PRICE_HIGH'>('MATCH_SCORE');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);

  const categoriesList = [
    "ALL", 
    "Conversation", 
    "Event Companion", 
    "Travel Companion", 
    "Shopping Companion", 
    "Study Partner", 
    "Gaming Partner", 
    "Fitness Partner", 
    "Elderly Support", 
    "Local Assistance"
  ];

  // Map MOCK_COMPANIONS into candidate model for 9-Factor Match Score engine
  const candidatePool = useMemo(() => {
    return MOCK_COMPANIONS.map(comp => ({
      id: comp.id,
      name: comp.name,
      avatar: comp.avatar,
      city: comp.city || 'Raipur',
      distanceKm: comp.city === 'Raipur' ? 3.5 : 12.0,
      hourlyRate: comp.hourlyRate,
      ratingAvg: comp.ratingAvg,
      ratingCount: comp.ratingCount,
      completedBookings: comp.completedBookings || 40,
      cancellationRatePercent: 1.5,
      responseTimeMin: comp.responseTimeMin || 15,
      categories: comp.categories || ['Travel Companion', 'Conversation'],
      languages: comp.languages || ['English', 'Hindi'],
      skills: comp.skills || ['City Guide', 'Event Protocol'],
      verificationStatus: (comp.verificationBadge ? 'VERIFIED' : 'PENDING') as any,
      isIdentityVerified: comp.verificationBadge,
      safetyRiskScore: comp.verificationBadge ? 0.02 : 0.40,
      isAvailableForDate: true,
      isAvailableForTime: true,
      rawComp: comp
    }));
  }, []);

  const searchCriteria: SearchCriteria = useMemo(() => ({
    location: locationQuery,
    serviceCategory: selectedCategory === 'ALL' ? '' : selectedCategory,
    date: selectedDate,
    timeSlot: selectedTime,
    maxHourlyRate: maxPrice,
  }), [locationQuery, selectedCategory, selectedDate, selectedTime, maxPrice]);

  // Execute 9-Factor Matching & Safety Gate Engine
  const rankedResults = useMemo(() => {
    let list = MarketplaceMatchingEngine.rankCandidates(candidatePool, searchCriteria);

    if (verifiedOnly) {
      list = list.filter(item => item.candidate.isIdentityVerified);
    }
    if (availableNowOnly) {
      list = list.filter(item => item.candidate.rawComp.isAvailableNow);
    }

    if (sortBy === 'RATING') {
      list.sort((a, b) => b.candidate.ratingAvg - a.candidate.ratingAvg);
    } else if (sortBy === 'PRICE_LOW') {
      list.sort((a, b) => a.candidate.hourlyRate - b.candidate.hourlyRate);
    } else if (sortBy === 'PRICE_HIGH') {
      list.sort((a, b) => b.candidate.hourlyRate - a.candidate.hourlyRate);
    }

    return list;
  }, [candidatePool, searchCriteria, verifiedOnly, availableNowOnly, sortBy]);

  const paginatedCandidates = useMemo(() => {
    if (pageSize === 'All') return rankedResults;
    const start = (currentPage - 1) * pageSize;
    return rankedResults.slice(start, start + pageSize);
  }, [rankedResults, currentPage, pageSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Search Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 w-fit mb-2">
                <Sparkles className="w-3.5 h-3.5" /> 9-FACTOR COMPOSITE MATCH ENGINE
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Marketplace Search & Companion Discovery</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> SAFETY GATE: ACTIVE
              </span>
            </div>
          </div>

          {/* Quick Search Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            
            {/* Location */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-400" /> Location
              </label>
              <input 
                type="text" 
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="City e.g. Raipur"
                className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none"
              />
            </div>

            {/* Service Category */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" /> Service Category
              </label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Date
              </label>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none"
              />
            </div>

            {/* Time Slot */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-rose-400" /> Time Window
              </label>
              <input 
                type="text"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                placeholder="10:00 AM - 04:00 PM"
                className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Filter Sidebar & Search Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filter Controls Sidebar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Refine Search
            </h3>
            <button 
              onClick={() => {
                setLocationQuery('Raipur');
                setSelectedCategory('ALL');
                setMaxPrice(150);
                setVerifiedOnly(true);
              }}
              className="text-[11px] text-indigo-400 hover:underline font-medium"
            >
              Reset
            </button>
          </div>

          {/* Max Hourly Rate */}
          <div className="space-y-2">
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

          {/* Sort By Option */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Ranking Strategy</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-semibold"
            >
              <option value="MATCH_SCORE">9-Factor Match Score (Default)</option>
              <option value="RATING">Highest Customer Rating</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
            </select>
          </div>

          {/* Safety & Verification Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Mandatory Identity Verified
              </span>
              <input 
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </label>
          </div>

        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing <strong className="text-white">{rankedResults.length}</strong> companions matched by location & score</span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Safety Gate Active
            </span>
          </div>

          {paginatedCandidates.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
              <p className="text-sm text-slate-400">No companions match your search parameters.</p>
              <button 
                onClick={() => { setSelectedCategory('ALL'); setMaxPrice(200); setLocationQuery(''); }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedCandidates.map(({ candidate, matchResult }) => (
                  <div 
                    key={candidate.id} 
                    className={`rounded-3xl glass-card border overflow-hidden transition-all flex flex-col justify-between group ${matchResult.passedSafetyGate ? 'border-slate-800 hover:border-indigo-500/50' : 'border-rose-500/40 bg-rose-500/5'}`}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={candidate.avatar} 
                        alt={candidate.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                      {/* Top Match Score Pill */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-indigo-500/40 text-indigo-300 text-[10px] font-mono font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" /> MATCH: {matchResult.totalMatchScore}%
                      </div>

                      {/* Safety Gate Status Pill */}
                      {matchResult.passedSafetyGate ? (
                        <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> PASSED GATE
                        </span>
                      ) : (
                        <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-rose-950/90 backdrop-blur-md border border-rose-500/40 text-rose-400 text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" /> GATE FAILED
                        </span>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-base font-bold text-white">{candidate.name}</h3>
                        <p className="text-[11px] text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-indigo-400" /> {candidate.city} ({candidate.distanceKm} km away)
                        </p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      
                      {/* Match Factor Mini Matrix */}
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[10px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Service Match:</span>
                          <strong className="text-white">{matchResult.breakdown.serviceScore}/20</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Location Compatibility:</span>
                          <strong className="text-white">{matchResult.breakdown.locationScore}/20</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Safety & Verification:</span>
                          <strong className="text-emerald-400">{matchResult.breakdown.safetyScore}/10</strong>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Hourly Rate</span>
                          <p className="text-base font-extrabold text-white">${candidate.hourlyRate}<span className="text-xs font-normal text-slate-400">/hr</span></p>
                        </div>
                        
                        <Link 
                          href={`/companion/${candidate.id}`}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${matchResult.passedSafetyGate ? 'gradient-bg-primary text-white hover:opacity-95 shadow-md shadow-indigo-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                          {matchResult.passedSafetyGate ? 'Book Companion' : 'Restricted'}
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              <PaginationFooter
                currentPage={currentPage}
                totalItems={rankedResults.length}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                labelSingular="companion"
                labelPlural="companions"
              />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
