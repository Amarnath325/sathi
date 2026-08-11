'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/adminStore';
import { CategoryCard } from '@/components/category/CategoryCard';
import { CategoryDetailsModal } from '@/components/category/CategoryDetailsModal';
import { AiCategoryMatchmakerModal } from '@/components/category/AiCategoryMatchmakerModal';
import { CategoryPriceEstimator } from '@/components/category/CategoryPriceEstimator';
import { CategorySafetyBreakdownModal } from '@/components/category/CategorySafetyBreakdownModal';
import { SubcategoryPillFilter } from '@/components/category/SubcategoryPillFilter';
import { ServiceCategory, RiskLevel } from '@/lib/types';
import {
  Search, Filter, Sparkles, Layers, ShieldCheck, Star, ArrowRight, Compass, Calculator, Wand2
} from 'lucide-react';

export default function ServiceCategoriesCatalogPage() {
  const { categories } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [safetyScorecardCategory, setSafetyScorecardCategory] = useState<ServiceCategory | null>(null);
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);

  const activeCategories = useMemo(() => {
    return categories.filter((c: ServiceCategory) => c.isActive);
  }, [categories]);

  const featuredCategories = useMemo(() => {
    return activeCategories.filter((c: ServiceCategory) => c.isFeatured);
  }, [activeCategories]);

  const filteredCategories = useMemo(() => {
    return activeCategories.filter((cat: ServiceCategory) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.subcategories || []).some((s: { name: string }) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRisk = selectedRisk === 'ALL' || cat.riskLevel === selectedRisk;

      const matchesTag =
        selectedTag === 'ALL' ||
        cat.name.toLowerCase().includes(selectedTag.toLowerCase()) ||
        cat.description.toLowerCase().includes(selectedTag.toLowerCase()) ||
        (cat.subcategories || []).some((s: { name: string }) => s.name.toLowerCase().includes(selectedTag.toLowerCase()));

      return matchesSearch && matchesRisk && matchesTag;
    });
  }, [activeCategories, searchQuery, selectedRisk, selectedTag]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden glass-panel border border-slate-800 text-center space-y-6">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Sathi Verified Service Catalog
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
          Explore Safe, Background-Checked <span className="gradient-text">Companionship Services</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          From high-profile corporate galas and city tours to study buddies and elderly care—find verified companions for every occasion under full escrow safety protection.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setIsMatchmakerOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Wand2 className="w-4 h-4" />
            <span>Launch AI Smart Category Matchmaker Wizard</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-3xl mx-auto pt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories (e.g. Event, Travel, Gaming, Workout)..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Risk Chips */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
            {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${selectedRisk === risk ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/25' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
              >
                {risk === 'ALL' ? 'All Risk Levels' : `${risk} Risk`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Section */}
      {featuredCategories.length > 0 && !searchQuery && selectedRisk === 'ALL' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> Featured Categories
            </h2>
            <span className="text-xs text-slate-400">Top Booked & Verified Services</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((cat: ServiceCategory) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onViewDetails={(c) => setSelectedCategory(c)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Catalog Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Service Categories Catalog ({filteredCategories.length})
          </h2>
          <span className="text-xs text-slate-400">Escrow Protected & SOS Enabled</span>
        </div>

        {/* Subcategory Tag Pill Filter Bar */}
        <SubcategoryPillFilter
          selectedTag={selectedTag}
          onSelectTag={(t) => setSelectedTag(t)}
        />

        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat: ServiceCategory) => (

              <CategoryCard
                key={cat.id}
                category={cat}
                onViewDetails={(c) => setSelectedCategory(c)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl glass-panel border border-slate-800 space-y-3">
            <Compass className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Matching Categories Found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search query or risk level filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedRisk('ALL'); }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Category Pricing Estimator */}
      <CategoryPriceEstimator />

      {/* Details Lightbox Modal */}
      <CategoryDetailsModal
        isOpen={!!selectedCategory}
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />

      {/* AI Category Matchmaker Wizard Modal */}
      {isMatchmakerOpen && (
        <AiCategoryMatchmakerModal
          categories={activeCategories}
          onSelectCategory={(c) => setSelectedCategory(c)}
          onClose={() => setIsMatchmakerOpen(false)}
        />
      )}

      {/* Category Safety & Protocol Scorecard Modal */}
      {safetyScorecardCategory && (
        <CategorySafetyBreakdownModal
          category={safetyScorecardCategory}
          onClose={() => setSafetyScorecardCategory(null)}
        />
      )}
    </div>
  );
}
