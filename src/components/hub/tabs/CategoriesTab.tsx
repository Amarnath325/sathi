'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CategoryItem } from '@/lib/types/serviceHub';
import { ImageLightboxModal } from '@/components/common/ImageLightboxModal';
import {
  Users, Plus, Edit2, Trash2, Copy, Star, Layers, ShieldAlert, Maximize2,
  Search, ChevronLeft, ChevronRight, SlidersHorizontal, X, Power, Calendar, Sparkles, Compass, Heart, LayoutGrid, Table
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48] as const;

export function CategoriesTab() {
  const {
    categories,
    services,
    addCategory,
    updateCategory,
    deleteCategory,
    duplicateCategory,
    toggleCategoryActive,
    toggleCategoryFeatured,
    searchQuery: globalSearch,
    isCategoryFormOpen,
    setCategoryFormOpen
  } = useServiceHubStore();

  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [deleteWarningModalCat, setDeleteWarningModalCat] = useState<{ cat: CategoryItem; serviceCount: number } | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const isFormOpen = isCategoryFormOpen;
  const setIsFormOpen = setCategoryFormOpen;

  // Local search & filter
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'STANDARD'>('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<typeof PAGE_SIZE_OPTIONS[number]>(12);

  // Form State (All 9 requested category fields)
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Users');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'ARCHIVED'>('ACTIVE');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isFeatured, setIsFeatured] = useState(false);
  const [minAge, setMinAge] = useState(18);

  // Filtered & paginated
  const searchTerm = localSearch || globalSearch;
  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const matchesSearch = !searchTerm ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.short_description && c.short_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && c.status === 'ACTIVE') ||
        (statusFilter === 'INACTIVE' && c.status !== 'ACTIVE');
      const matchesFeatured = featuredFilter === 'ALL' ||
        (featuredFilter === 'FEATURED' && c.is_featured) ||
        (featuredFilter === 'STANDARD' && !c.is_featured);
      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [categories, searchTerm, statusFilter, featuredFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedCategories = filteredCategories.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleFilterChange = (fn: () => void) => { fn(); setCurrentPage(1); };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setCode(`CAT-EVT-${Date.now().toString().slice(-4)}`);
    setName('Events & Social');
    setShortDescription('Corporate galas, weddings, networking expos & social gatherings');
    setDescription('Professional companion support for formal events, award ceremonies, and family celebrations.');
    setIcon('Users');
    setImage('https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80');
    setStatus('ACTIVE');
    setDisplayOrder(categories.length + 1);
    setIsFeatured(true);
    setMinAge(21);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCode(cat.code || `CAT-${cat.id.slice(-4)}`);
    setName(cat.name);
    setShortDescription(cat.short_description || '');
    setDescription(cat.description);
    setIcon(cat.icon || 'Users');
    setImage(cat.banner_image || cat.image || '');
    setStatus(cat.status || 'ACTIVE');
    setDisplayOrder(cat.display_order || 1);
    setIsFeatured(cat.is_featured || false);
    setMinAge(cat.minimum_age || 18);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        code: code.trim(),
        name: name.trim(),
        short_description: shortDescription.trim(),
        description: description.trim(),
        icon,
        image: image.trim(),
        banner_image: image.trim(),
        status,
        display_order: Number(displayOrder),
        is_featured: isFeatured,
        minimum_age: Number(minAge)
      });
    } else {
      addCategory({
        code: code.trim(),
        name: name.trim(),
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        short_description: shortDescription.trim(),
        description: description.trim(),
        icon,
        image: image.trim(),
        banner_image: image.trim(),
        display_order: Number(displayOrder),
        status,
        is_featured: isFeatured,
        minimum_age: Number(minAge)
      });
    }
    setIsFormOpen(false);
  };

  const handleDeleteAttempt = (cat: CategoryItem) => {
    const activeSubServices = services.filter(s => s.category_id === cat.id && s.status !== 'ARCHIVED');
    if (activeSubServices.length > 0) {
      setDeleteWarningModalCat({ cat, serviceCount: activeSubServices.length });
    } else {
      deleteCategory(cat.id);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={e => handleFilterChange(() => setLocalSearch(e.target.value))}
              placeholder="Search category name, code, description..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => handleFilterChange(() => setStatusFilter(e.target.value as any))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          <select
            value={featuredFilter}
            onChange={e => handleFilterChange(() => setFeaturedFilter(e.target.value as any))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">All Featured</option>
            <option value="FEATURED">Featured Only</option>
            <option value="STANDARD">Standard Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid vs Table View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'GRID' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'TABLE' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <Table className="w-3.5 h-3.5" /> Table
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Main Content Area: GRID VIEW or TABLE VIEW */}
      {paginatedCategories.length > 0 ? (
        viewMode === 'GRID' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCategories.map(cat => {
              const catImg = cat.banner_image || cat.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';
              const linkedSubServices = services.filter(s => s.category_id === cat.id);

              return (
                <div key={cat.id} className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                  {/* Category Image Banner with Lightbox & Featured Badge */}
                  <div className="relative h-32 w-full bg-slate-900 group">
                    <img src={catImg} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                    {/* Icon & Code Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900/90 text-purple-300 font-mono font-bold text-[10px] backdrop-blur-md border border-slate-700">
                        {cat.code || `CAT-${cat.id.slice(-4)}`}
                      </span>
                      {cat.is_featured && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/90 text-slate-950 font-extrabold text-[10px] flex items-center gap-1 shadow-xs backdrop-blur-md">
                          <Star className="w-3 h-3 fill-slate-950" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Status & Display Order */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 text-white font-mono text-[10px] font-bold">
                        Order #{cat.display_order || 1}
                      </span>
                      <button
                        onClick={() => toggleCategoryActive(cat.id)}
                        className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all backdrop-blur-md ${
                          cat.status === 'ACTIVE' ? 'bg-emerald-500/90 text-white' : 'bg-slate-700/90 text-slate-300'
                        }`}
                      >
                        {cat.status || 'ACTIVE'}
                      </button>
                      <button
                        onClick={() => setLightboxImage(catImg)}
                        className="p-1 rounded-lg bg-black/60 hover:bg-black/90 text-white transition-colors"
                        title="Expand Banner Image"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                      <h5 className="font-extrabold text-sm text-white drop-shadow-md">{cat.name}</h5>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Short Description */}
                      {cat.short_description && (
                        <p className="text-[11px] font-bold text-purple-700 leading-snug line-clamp-1">
                          {cat.short_description}
                        </p>
                      )}

                      {/* Full Description */}
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                        {cat.description}
                      </p>

                      {/* Sub-Services Pill Badges */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-purple-600" /> Linked Services ({linkedSubServices.length}):
                        </span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {linkedSubServices.length > 0 ? (
                            linkedSubServices.map(srv => (
                              <span key={srv.id} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 font-bold text-[10px]">
                                {srv.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No linked services</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => toggleCategoryFeatured(cat.id)}
                        className={`text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
                          cat.is_featured
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${cat.is_featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                        {cat.is_featured ? 'Featured' : 'Mark Featured'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => duplicateCategory(cat.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Duplicate Category"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAttempt(cat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3.5">Code</th>
                    <th className="py-3 px-3.5">Category Name</th>
                    <th className="py-3 px-3.5">Short Description</th>
                    <th className="py-3 px-3.5 text-center">Order #</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center">Featured</th>
                    <th className="py-3 px-3.5 text-center">Linked Services</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {paginatedCategories.map(cat => {
                    const catImg = cat.banner_image || cat.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';
                    const linkedSubServices = services.filter(s => s.category_id === cat.id);

                    return (
                      <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Code */}
                        <td className="py-3 px-3.5 font-mono font-bold text-purple-700 text-[11px]">
                          {cat.code || `CAT-${cat.id.slice(-4)}`}
                        </td>

                        {/* Image & Name */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 group">
                              <img src={catImg} alt={cat.name} className="w-full h-full object-cover" />
                              <button
                                onClick={() => setLightboxImage(catImg)}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                              >
                                <Maximize2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div>
                              <h6 className="font-extrabold text-slate-900 text-xs">{cat.name}</h6>
                              <span className="text-[10px] text-slate-400">{cat.slug}</span>
                            </div>
                          </div>
                        </td>

                        {/* Short Description */}
                        <td className="py-3 px-3.5 max-w-xs text-slate-600 leading-snug">
                          <p className="line-clamp-2">{cat.short_description || cat.description}</p>
                        </td>

                        {/* Order */}
                        <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-700">
                          #{cat.display_order || 1}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={() => toggleCategoryActive(cat.id)}
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border transition-all ${
                              cat.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {cat.status || 'ACTIVE'}
                          </button>
                        </td>

                        {/* Featured */}
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={() => toggleCategoryFeatured(cat.id)}
                            className={`p-1.5 rounded-lg border transition-all inline-flex items-center gap-1 font-bold text-[10px] ${
                              cat.is_featured
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                            }`}
                            title="Toggle Featured Status"
                          >
                            <Star className={`w-3.5 h-3.5 ${cat.is_featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                            {cat.is_featured ? 'Yes' : 'No'}
                          </button>
                        </td>

                        {/* Linked Services */}
                        <td className="py-3 px-3.5 text-center">
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-100">
                            {linkedSubServices.length} Services
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => duplicateCategory(cat.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                              title="Duplicate Category"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(cat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAttempt(cat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="p-8 text-center rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
          <Layers className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-900 text-sm">No Categories Found</h4>
          <p className="text-xs text-slate-500">Try adjusting your search or filter, or add a new category.</p>
          <button onClick={handleOpenCreate} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredCategories.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3.5 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs shadow-2xs">
          <span className="text-slate-500 font-medium text-center sm:text-left">
            Page <span className="text-slate-900 font-bold">{safePage}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
            <span className="ml-2 text-slate-400">({filteredCategories.length} total)</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(safePage - 2, totalPages - 4)) + i;
              return (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-colors ${
                    pg === safePage ? 'bg-purple-600 text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Unsafe Delete Prevention Modal */}
      {deleteWarningModalCat && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-white text-base">Unsafe Category Deletion Blocked</h4>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono text-left space-y-1">
              <p className="font-bold text-rose-400">Category "{deleteWarningModalCat.cat.name}" has:</p>
              <p>• {deleteWarningModalCat.serviceCount} Active Sub-Services</p>
            </div>
            <button onClick={() => setDeleteWarningModalCat(null)} className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 w-full">
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* Complete Create / Edit Form Modal with All 9 Fields */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl my-auto text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-white text-base">
                  {editingCategory ? `Edit Category: ${editingCategory.code || editingCategory.name}` : 'Configure New Category'}
                </h4>
                <p className="text-[11px] text-slate-400">Category Name, Code, Descriptions, Icon, Banner Image, Order & Featured Status</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              {/* Field 1 & 2: Category Name & Category Code */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category Code *</label>
                  <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="CAT-EVT-01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-purple-400 font-mono font-bold outline-none focus:border-purple-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Category Name *</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Events & Social"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-purple-500" />
                </div>
              </div>

              {/* Field 3: Short Description */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">Short Description *</label>
                <input type="text" required value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder="e.g. Corporate galas, weddings & social gatherings"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500" />
              </div>

              {/* Field 4: Full Description */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Description *</label>
                <textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed category overview..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-purple-500 resize-none" />
              </div>

              {/* Field 5 & 8: Category Icon & Category Display Order */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category Icon *</label>
                  <select value={icon} onChange={e => setIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-purple-400 font-bold outline-none focus:border-purple-500">
                    <option value="Users">Users (Social & Events)</option>
                    <option value="Calendar">Calendar (Scheduled Events)</option>
                    <option value="Sparkles">Sparkles (VIP & Premium)</option>
                    <option value="Compass">Compass (Travel & Guides)</option>
                    <option value="Heart">Heart (Emotional Companion)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Display Order #</label>
                  <input type="number" value={displayOrder} onChange={e => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-purple-500" />
                </div>
              </div>

              {/* Field 6: Category Banner Image URL */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">Category Image Banner URL</label>
                <input type="url" value={image} onChange={e => setImage(e.target.value)} placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px] outline-none focus:border-purple-500" />
              </div>

              {/* Field 7 & 9: Status & Featured Toggle */}
              <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input type="checkbox" id="feat-cat-input" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                  <label htmlFor="feat-cat-input" className="text-white font-bold cursor-pointer flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Mark as Featured
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {lightboxImage && (
        <ImageLightboxModal isOpen={!!lightboxImage} imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
    </div>
  );
}
