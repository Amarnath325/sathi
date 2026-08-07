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
  Check,
  Heart,
  Globe,
  Sliders,
  DollarSign
} from 'lucide-react';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { MarketplaceMatchingEngine, SearchCriteria } from '@/lib/matchingAlgorithm';
import { SearchAndLimitBar, PaginationFooter, PageSizeOption } from '@/components/common/PaginationBar';
import { useToast } from '@/components/ui/Toast';

export default function SearchPage() {
  const { showToast } = useToast();

  // 10 Search Criteria Filters (Section 27)
  const [locationQuery, setLocationQuery] = useState('Raipur');
  const [selectedCategory, setSelectedCategory] = useState<string>('Travel Companion');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-15');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM - 04:00 PM');
  const [durationHours, setDurationHours] = useState<number>(4);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(25);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [availableNowOnly, setAvailableNowOnly] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<'MATCH_SCORE' | 'RATING' | 'PRICE_LOW' | 'PRICE_HIGH'>('MATCH_SCORE');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);

  // Favorites state (Section 30)
  const [savedFavorites, setSavedFavorites] = useState<string[]>(['1', '3']);

  const toggleFavorite = (id: string, name: string) => {
    setSavedFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('info', 'Removed from Favorites', `${name} removed from your saved list.`);
        return prev.filter(item => item !== id);
      } else {
        showToast('success', 'Saved to Favorites ♡', `${name} added to your saved list.`);
        return [...prev, id];
      }
    });
  };

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

  const languagesList = ["ALL", "English", "Hindi", "Spanish", "French", "German"];

  // Candidate Pool Transformation
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

  // Filtering & Ranking Engine
  const rankedResults = useMemo(() => {
    let list = MarketplaceMatchingEngine.rankCandidates(candidatePool, searchCriteria);

    if (verifiedOnly) {
      list = list.filter(item => item.candidate.isIdentityVerified);
    }
    if (availableNowOnly) {
      list = list.filter(item => item.candidate.rawComp.isAvailableNow);
    }
    if (selectedLanguage !== 'ALL') {
      list = list.filter(item => item.candidate.languages.includes(selectedLanguage));
    }
    if (minRating > 0) {
      list = list.filter(item => item.candidate.ratingAvg >= minRating);
    }
    if (maxDistanceKm > 0) {
      list = list.filter(item => item.candidate.distanceKm <= maxDistanceKm);
    }

    if (sortBy === 'RATING') {
      list.sort((a, b) => b.candidate.ratingAvg - a.candidate.ratingAvg);
    } else if (sortBy === 'PRICE_LOW') {
      list.sort((a, b) => a.candidate.hourlyRate - b.candidate.hourlyRate);
    } else if (sortBy === 'PRICE_HIGH') {
      list.sort((a, b) => b.candidate.hourlyRate - a.candidate.hourlyRate);
    }

    return list;
  }, [candidatePool, searchCriteria, verifiedOnly, availableNowOnly, selectedLanguage, minRating, maxDistanceKm, sortBy]);

  const paginatedCandidates = useMemo(() => {
    if (pageSize === 'All') return rankedResults;
    const start = (currentPage - 1) * pageSize;
    return rankedResults.slice(start, start + pageSize);
  }, [rankedResults, currentPage, pageSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Search Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 w-fit mb-2">
                <Sparkles className="w-3.5 h-3.5" /> 9-FACTOR COMPOSITE MATCH ENGINE
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Marketplace Search & Companion Discovery</h1>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href="/favorites"
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-400" /> My Favorites ({savedFavorites.length})
              </Link>
            </div>
          </div>

          {/* 10-Field Search Bar (Section 27) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            
            {/* 1. Location */}
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

            {/* 2. Service Category */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3 text-indigo-400" /> Service Category
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

            {/* 3. Date */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-400" /> Date
              </label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              />
            </div>

            {/* 4. Time Window */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" /> Time Window
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="10:00 AM - 04:00 PM" className="bg-slate-900 text-white">10:00 AM - 04:00 PM (Daytime)</option>
                <option value="04:00 PM - 10:00 PM" className="bg-slate-900 text-white">04:00 PM - 10:00 PM (Evening)</option>
                <option value="09:00 AM - 09:00 PM" className="bg-slate-900 text-white">09:00 AM - 09:00 PM (Full Day)</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Filter Sidebar & Candidates Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Refine Filters Panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Refine Search
              </h3>
              <button 
                onClick={() => {
                  setMaxPrice(100);
                  setVerifiedOnly(true);
                  setAvailableNowOnly(false);
                  setMinRating(4.0);
                  setSelectedLanguage('ALL');
                  setMaxDistanceKm(25);
                }}
                className="text-[11px] text-indigo-400 hover:underline font-semibold"
              >
                Reset
              </button>
            </div>

            {/* 5. Duration (Hours) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Duration: {durationHours} Hours</label>
              <input 
                type="range"
                min={1}
                max={12}
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* 6. Max Hourly Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Max Hourly Rate</span>
                <span className="text-indigo-400 font-mono font-bold">${maxPrice}/hr</span>
              </div>
              <input 
                type="range"
                min={20}
                max={300}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* 7. Preferred Language */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              >
                {languagesList.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* 8. Distance Radius */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Distance Radius</span>
                <span className="text-indigo-400 font-mono">{maxDistanceKm} km</span>
              </div>
              <input 
                type="range"
                min={5}
                max={100}
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* 9. Minimum Rating */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Min Rating: {minRating} ★</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>4.0 Stars & Above</option>
                <option value={4.5}>4.5 Stars & Above</option>
                <option value={4.8}>4.8 Stars & Above</option>
              </select>
            </div>

            {/* 10. Verification Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-800 text-indigo-500 focus:ring-indigo-500"
                />
                <span>Mandatory Identity Verified</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={availableNowOnly}
                  onChange={(e) => setAvailableNowOnly(e.target.checked)}
                  className="rounded border-slate-800 text-indigo-500 focus:ring-indigo-500"
                />
                <span>Available Now Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Candidates Results Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          <SearchAndLimitBar 
            searchQuery={locationQuery}
            onSearchChange={setLocationQuery}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            placeholder="Search by companion name or city..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCandidates.map(({ candidate, matchResult }) => {
              const comp = candidate.rawComp;
              const isSaved = savedFavorites.includes(comp.id);

              return (
                <div key={comp.id} className="glass-panel rounded-3xl border border-slate-800 overflow-hidden space-y-4 hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
                  
                  <div className="space-y-3">
                    {/* Card Photo & Badges */}
                    <div className="relative h-56 overflow-hidden">
                      <img src={comp.avatar} alt={comp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Favorite Button (Section 30) */}
                      <button
                        onClick={() => toggleFavorite(comp.id, comp.name)}
                        className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all ${
                          isSaved ? 'bg-rose-500 text-white border-rose-400' : 'bg-slate-950/70 text-slate-300 border-white/20 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                      </button>

                      {/* Separate Verification Badges (Section 29) */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[9px] font-bold">
                          Identity Verified ✓
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/90 text-white text-[9px] font-bold">
                          KYC Verified ✓
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">{comp.name}, {comp.age}</h3>
                          <p className="text-[11px] text-slate-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-indigo-400" /> {comp.city} ({candidate.distanceKm} km away)
                          </p>
                        </div>

                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {comp.ratingAvg} ({comp.ratingCount})
                        </div>
                      </div>
                    </div>

                    {/* Service Badges */}
                    <div className="px-4 space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.categories.map((cat, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Booking Button */}
                  <div className="p-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Rate</span>
                      <span className="text-lg font-extrabold text-white font-mono">${comp.hourlyRate}/hr</span>
                    </div>

                    <Link
                      href={`/companion/${comp.id}`}
                      className="px-4 py-2.5 rounded-2xl gradient-bg-primary text-white text-xs font-bold hover:opacity-95 shadow-md shadow-indigo-600/30"
                    >
                      Book Companion
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>

          <PaginationFooter 
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={rankedResults.length}
            onPageChange={(page) => setCurrentPage(page)}
            labelPlural="companions"
          />

        </div>
      </div>

    </div>
  );
}
