'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CategoryItem } from '@/lib/types/serviceHub';
import { ImageLightboxModal } from '@/components/common/ImageLightboxModal';
import {
  Users, Plus, Edit2, Trash2, Copy, Eye, Star, Layers, ShieldAlert, CheckCircle2, Maximize2,
  Download, Upload, Search, ChevronLeft, ChevronRight, SlidersHorizontal
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
    searchQuery: globalSearch
  } = useServiceHubStore();

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [deleteWarningModalCat, setDeleteWarningModalCat] = useState<{ cat: CategoryItem; serviceCount: number } | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Local search & filter
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'STANDARD'>('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<typeof PAGE_SIZE_OPTIONS[number]>(12);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Users');
  const [minAge, setMinAge] = useState(18);
  const [isFeatured, setIsFeatured] = useState(false);

  // Filtered & paginated
  const searchTerm = localSearch || globalSearch;
  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const matchesSearch = !searchTerm ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Reset to page 1 on filter change
  const handleFilterChange = (fn: () => void) => { fn(); setCurrentPage(1); };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName(''); setDescription(''); setIcon('Users'); setMinAge(18); setIsFeatured(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name); setDescription(cat.description); setIcon(cat.icon || 'Users');
    setMinAge(cat.minimum_age || 18); setIsFeatured(cat.is_featured || false);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingCategory) {
      updateCategory(editingCategory.id, { name: name.trim(), description: description.trim(), icon, minimum_age: Number(minAge), is_featured: isFeatured });
    } else {
      addCategory({
        name: name.trim(),
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: description.trim(),
        icon,
        display_order: categories.length + 1,
        status: 'ACTIVE',
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
      if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) deleteCategory(cat.id);
    }
  };

  // Export categories as JSON
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(filteredCategories, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `categories_export_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  // Import categories from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        const items = Array.isArray(data) ? data : [data];
        items.forEach((cat: any) => {
          addCategory({ name: cat.name, slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'), description: cat.description || '', icon: cat.icon || 'Users', display_order: categories.length + 1, status: 'ACTIVE', is_featured: cat.is_featured || false, minimum_age: cat.minimum_age || 18 });
        });
      } catch { alert('Invalid JSON format.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Module 1: Category Management
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">{categories.length} Total</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Organize service offerings. Category profiles apply inheritance rules to sub-services.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Import */}
          <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" /> Import
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          {/* Export */}
          <button onClick={handleExport} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          {/* Add */}
          <button onClick={handleOpenCreate} className="px-4 py-1.5 rounded-xl gradient-bg-primary text-white font-bold text-xs hover:opacity-90 shadow-lg flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
        {/* Local Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={e => handleFilterChange(() => setLocalSearch(e.target.value))}
            placeholder="Search categories by name or description..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => handleFilterChange(() => setStatusFilter(e.target.value as any))}
            className="bg-transparent text-slate-200 outline-none font-semibold cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Status</option>
            <option value="ACTIVE" className="bg-slate-900">Active Only</option>
            <option value="INACTIVE" className="bg-slate-900">Inactive Only</option>
          </select>
        </div>
        {/* Featured Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs shrink-0">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <select
            value={featuredFilter}
            onChange={e => handleFilterChange(() => setFeaturedFilter(e.target.value as any))}
            className="bg-transparent text-slate-200 outline-none font-semibold cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Types</option>
            <option value="FEATURED" className="bg-slate-900">Featured Only</option>
            <option value="STANDARD" className="bg-slate-900">Standard Only</option>
          </select>
        </div>
        {/* Page Size */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs shrink-0">
          <span className="text-slate-400 font-medium">Show</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value) as any); setCurrentPage(1); }}
            className="bg-transparent text-slate-200 outline-none font-bold cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>Showing <span className="text-white font-bold">{paginatedCategories.length}</span> of <span className="text-white font-bold">{filteredCategories.length}</span> categories</span>
        {(localSearch || globalSearch || statusFilter !== 'ALL' || featuredFilter !== 'ALL') && (
          <button
            onClick={() => { setLocalSearch(''); setStatusFilter('ALL'); setFeaturedFilter('ALL'); setCurrentPage(1); }}
            className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Grid of Categories */}
      {paginatedCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedCategories.map((cat) => {
            const serviceCount = services.filter(s => s.category_id === cat.id && s.status !== 'ARCHIVED').length;
            const banner = cat.banner_image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';
            return (
              <div
                key={cat.id}
                className={`rounded-2xl border transition-all flex flex-col overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 ${
                  cat.status === 'ACTIVE' ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' : 'bg-slate-950/80 border-slate-900 opacity-60'
                }`}
              >
                {/* Banner */}
                <div
                  className="relative h-44 overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => setLightboxImage(banner)}
                  title="Click to preview image"
                >
                  <img src={banner} alt={cat.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                    <span className="px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-xl">
                      <Maximize2 className="w-3.5 h-3.5 text-indigo-400" /> Click to Preview
                    </span>
                  </div>
                  {/* Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-bold border border-slate-700">
                      Min Age: {cat.minimum_age}+
                    </span>
                    {cat.is_featured && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 backdrop-blur-md text-[10px] font-extrabold border border-amber-500/40 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <h4 className="font-extrabold text-white text-sm leading-tight truncate">{cat.name}</h4>
                    <p className="text-[11px] text-slate-300 font-medium">{serviceCount} Active Services</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{cat.description}</p>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleCategoryActive(cat.id)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                          cat.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {cat.status === 'ACTIVE' ? '● Active' : '○ Disabled'}
                      </button>
                      <button
                        onClick={() => toggleCategoryFeatured(cat.id)}
                        className={`p-1.5 rounded-xl border text-xs transition-all ${
                          cat.is_featured ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-3.5 h-3.5 ${cat.is_featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => duplicateCategory(cat.id)} className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs transition-colors" title="Duplicate">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleOpenEdit(cat)} className="p-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-xs transition-colors" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteAttempt(cat)} className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs transition-colors" title="Delete">
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
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Layers className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="font-bold text-white text-sm">No Categories Found</h4>
          <p className="text-xs text-slate-400">Try adjusting your search or filter, or add a new category.</p>
          <button onClick={handleOpenCreate} className="px-4 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs inline-flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add First Category
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredCategories.length > pageSize && (
        <div className="flex items-center justify-between px-2 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs">
          <span className="text-slate-400">
            Page <span className="text-white font-bold">{safePage}</span> of <span className="text-white font-bold">{totalPages}</span>
            <span className="ml-2 text-slate-500">({filteredCategories.length} total)</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                    pg === safePage ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Protection Modal */}
      {deleteWarningModalCat && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-white text-base">Unsafe Category Deletion Blocked</h4>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono text-left space-y-1">
              <p className="font-bold text-rose-400">Category "{deleteWarningModalCat.cat.name}" has:</p>
              <p>• {deleteWarningModalCat.serviceCount} Active Services</p>
              <p>• Associated Pricing Profiles & Policies</p>
            </div>
            <p className="text-xs text-slate-400">Archive or reassign all sub-services before deleting a category.</p>
            <button onClick={() => setDeleteWarningModalCat(null)} className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700">
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-white text-lg">
              {editingCategory ? `Edit: ${editingCategory.name}` : 'Create New Service Category'}
            </h4>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Category Name *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Events & Social"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description *</label>
                <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the category scope..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 resize-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Minimum Age Limit</label>
                  <input type="number" value={minAge} min={16} max={60} onChange={e => setMinAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" id="feat-cat" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-indigo-600 rounded cursor-pointer" />
                  <label htmlFor="feat-cat" className="text-white font-bold cursor-pointer">Mark as Featured</label>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl gradient-bg-primary text-white font-bold">
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
