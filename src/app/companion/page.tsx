'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile, CompanionFilter, CompanionStatus } from '@/lib/types';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { CompanionCard } from '@/components/companion/CompanionCard';
import { CompanionFilters } from '@/components/companion/CompanionFilters';
import { CompanionFormModal } from '@/components/companion/CompanionFormModal';
import {
  Users, Plus, LayoutGrid, List, Sparkles, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';

const DEFAULT_FILTERS: CompanionFilter = {
  search: '',
  category: '',
  city: '',
  gender: '',
  minRate: 0,
  maxRate: 9999,
  minRating: 0,
  availableNow: false,
  verifiedOnly: false,
  status: '',
  sortBy: 'rating_desc',
};

export default function CompanionDirectoryPage() {
  const [companions, setCompanions] = useState<UserProfile[]>(MOCK_COMPANIONS);
  const [filters, setFilters] = useState<CompanionFilter>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompanion, setEditingCompanion] = useState<UserProfile | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 8;

  // Client side filtering
  const filtered = companions.filter(c => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q) && !c.bio.toLowerCase().includes(q)) return false;
    }
    if (filters.category && !c.categories.some(cat => cat.toLowerCase().includes(filters.category!.toLowerCase()))) return false;
    if (filters.city && !c.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.gender && c.gender !== filters.gender) return false;
    const minR = filters.minRate ?? 0;
    const maxR = filters.maxRate ?? 9999;
    if (c.hourlyRate < minR || c.hourlyRate > (maxR === 9999 ? Infinity : maxR)) return false;
    if (c.ratingAvg < filters.minRating) return false;
    if (filters.availableNow && !c.isAvailableNow) return false;
    if (filters.verifiedOnly && !c.verificationBadge) return false;
    if (filters.status && c.status !== filters.status) return false;
    return true;
  });


  // Sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'rating_desc': return b.ratingAvg - a.ratingAvg;
      case 'price_asc': return a.hourlyRate - b.hourlyRate;
      case 'price_desc': return b.hourlyRate - a.hourlyRate;
      case 'most_booked': return b.completedBookings - a.completedBookings;
      case 'newest': return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      default: return 0;
    }
  });

  const totalPages = Math.ceil(filtered.length / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSaveCompanion = (data: Partial<UserProfile>) => {
    if (editingCompanion) {
      setCompanions(prev => prev.map(c => c.id === editingCompanion.id ? { ...c, ...data } as UserProfile : c));
    } else {
      const newComp: UserProfile = {
        ...data,
        id: 'comp-' + Date.now(),
        role: 'VERIFIED_COMPANION',
        ratingAvg: 5.0,
        ratingCount: 0,
        completedBookings: 0,
        verificationBadge: true,
        kycStatus: 'APPROVED',
        isAvailableNow: true,
        responseTimeMin: 10,
        riskScore: 0.01,
        riskLevel: 'LOW',
        status: 'ACTIVE',
      } as UserProfile;
      setCompanions(prev => [newComp, ...prev]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Users className="w-4 h-4" /> Companion Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Verified Companions</h1>
          <p className="text-xs text-slate-400 mt-1">Browse, filter, and connect with verified companions worldwide for safe social meetups.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/companion/create"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:text-white hover:border-slate-700 transition-all flex items-center gap-2"
          >
            Multi-step Register
          </Link>
          <button
            onClick={() => { setEditingCompanion(null); setIsModalOpen(true); }}
            className="px-5 py-2.5 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs hover:opacity-90 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Quick Add Companion
          </button>
        </div>
      </div>

      {/* Main Grid + Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CompanionFilters
              filters={filters}
              onChange={f => { setFilters(f); setPage(1); }}
              onReset={() => { setFilters(DEFAULT_FILTERS); setPage(1); }}
              totalResults={filtered.length}
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 glass-panel px-4 py-3 rounded-2xl border border-slate-800">
            <span>Showing <strong className="text-white">{(page - 1) * limit + 1}–{Math.min(page * limit, filtered.length)}</strong> of <strong className="text-white">{filtered.length}</strong> companions</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl border ${viewMode === 'grid' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xl border ${viewMode === 'list' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Directory Cards */}
          {paginated.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {paginated.map(comp => (
                <CompanionCard
                  key={comp.id}
                  companion={comp}
                  onSave={toggleSave}
                  isSaved={savedIds.includes(comp.id)}
                  variant={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No companions found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try adjusting your filters or search query to see available companions.</p>
              <button onClick={() => setFilters(DEFAULT_FILTERS)} className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-bold hover:text-white">
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 pt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-slate-400 font-semibold">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40 flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <CompanionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCompanion}
        initialData={editingCompanion}
      />
    </div>
  );
}
