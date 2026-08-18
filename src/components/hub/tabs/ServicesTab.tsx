'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { ServiceItem, ServicePublishStatus } from '@/lib/types/serviceHub';
import { ServiceConfigDrawer } from './ServiceConfigDrawer';
import {
  Sparkles, Plus, Edit2, Trash2, Copy, ShieldAlert, CheckCircle2, Layers, Sliders, Play,
  AlertTriangle, Download, Upload, Search, ChevronLeft, ChevronRight, SlidersHorizontal
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
const STATUS_TABS = ['ALL', 'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED'] as const;

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED:      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  DRAFT:          'bg-slate-500/10 border-slate-500/30 text-slate-400',
  PENDING_REVIEW: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  APPROVED:       'bg-blue-500/10 border-blue-500/30 text-blue-400',
  SUSPENDED:      'bg-rose-500/10 border-rose-500/30 text-rose-400',
  ARCHIVED:       'bg-slate-800/60 border-slate-700 text-slate-500',
};

export function ServicesTab() {
  const {
    services,
    categories,
    addService,
    deleteService,
    duplicateService,
    suspendService,
    publishService,
    setSelectedServiceForConfig,
    selectedServiceForConfig,
    searchQuery: globalSearch,
    selectedCategoryFilter,
  } = useServiceHubStore();

  const [subStatusFilter, setSubStatusFilter] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<typeof PAGE_SIZE_OPTIONS[number]>(25);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  const searchTerm = localSearch || globalSearch;

  const filteredServices = useMemo(() => {
    return services.filter(srv => {
      if ((categoryFilter !== 'ALL' && srv.category_id !== categoryFilter) &&
          (selectedCategoryFilter !== 'ALL' && srv.category_id !== selectedCategoryFilter)) return false;
      if (categoryFilter !== 'ALL' && srv.category_id !== categoryFilter) return false;
      if (subStatusFilter !== 'ALL' && srv.status !== subStatusFilter) return false;
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return srv.name.toLowerCase().includes(q) || srv.description.toLowerCase().includes(q);
    });
  }, [services, categoryFilter, subStatusFilter, searchTerm, selectedCategoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedServices = filteredServices.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleFilterChange = (fn: () => void) => { fn(); setCurrentPage(1); };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    const category = categories.find(c => c.id === categoryId);
    const created = addService({
      category_id: categoryId,
      category_name: category?.name || 'Unassigned',
      name: name.trim(),
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: description.trim() || 'Custom service offering.',
      icon: 'Sparkles',
      display_order: services.length + 1,
      status: 'DRAFT',
      is_featured: false,
      minimum_age: 18,
      maximum_age: 75,
      online_allowed: false,
      offline_allowed: true,
      location_required: true,
      duration_required: true
    });
    setIsWizardOpen(false);
    setName(''); setDescription('');
    setSelectedServiceForConfig(created);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(filteredServices, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `services_export_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        const items = Array.isArray(data) ? data : [data];
        items.forEach((srv: any) => {
          const cat = categories.find(c => c.id === srv.category_id || c.name === srv.category_name);
          if (cat) addService({ ...srv, category_id: cat.id, category_name: cat.name, status: 'DRAFT', display_order: services.length + 1 });
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
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Module 2: Service Catalog
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">{services.length} Total</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every service links to 10 core configuration profiles. Only <span className="text-emerald-400 font-bold">PUBLISHED</span> services are bookable.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" /> Import
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={handleExport} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            onClick={() => { setCategoryId(categories[0]?.id || ''); setIsWizardOpen(true); }}
            className="px-4 py-1.5 rounded-xl gradient-bg-primary text-white font-bold text-xs hover:opacity-90 shadow-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create New Service
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {STATUS_TABS.map(st => (
          <button
            key={st}
            onClick={() => handleFilterChange(() => setSubStatusFilter(st))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              subStatusFilter === st ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {st.replace(/_/g, ' ')}
            <span className={`ml-1 text-[10px] font-mono ${subStatusFilter === st ? 'text-white/70' : 'text-slate-500'}`}>
              ({st === 'ALL' ? services.length : services.filter(s => s.status === st).length})
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={e => handleFilterChange(() => setLocalSearch(e.target.value))}
            placeholder="Search services by name or description..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        {/* Category Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => handleFilterChange(() => setCategoryFilter(e.target.value))}
            className="bg-transparent text-slate-200 outline-none font-semibold cursor-pointer max-w-[160px]"
          >
            <option value="ALL" className="bg-slate-900">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
          </select>
        </div>
        {/* Page Size */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs shrink-0">
          <span className="text-slate-400">Show</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value) as any); setCurrentPage(1); }}
            className="bg-transparent text-slate-200 outline-none font-bold cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>Showing <span className="text-white font-bold">{paginatedServices.length}</span> of <span className="text-white font-bold">{filteredServices.length}</span> services</span>
        {(localSearch || categoryFilter !== 'ALL' || subStatusFilter !== 'ALL') && (
          <button onClick={() => { setLocalSearch(''); setCategoryFilter('ALL'); setSubStatusFilter('ALL'); setCurrentPage(1); }}
            className="text-indigo-400 hover:text-indigo-300 font-bold">✕ Clear Filters</button>
        )}
      </div>

      {/* Services Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Service Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Age Bounds</th>
                <th className="py-3 px-4">Config</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedServices.length > 0 ? paginatedServices.map(srv => {
                const category = categories.find(c => c.id === srv.category_id);
                return (
                  <tr key={srv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span>{srv.name}</span>
                        {srv.is_featured && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-extrabold">FEATURED</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-indigo-400 font-semibold">{category?.name || srv.category_name || 'Unassigned'}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${STATUS_COLORS[srv.status] || STATUS_COLORS.DRAFT}`}>
                        {srv.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 font-mono">{srv.minimum_age}–{srv.maximum_age} yrs</td>
                    <td className="py-2.5 px-4">
                      <button
                        onClick={() => setSelectedServiceForConfig(srv)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 font-bold text-[11px] flex items-center gap-1.5 transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Config Engine
                      </button>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {srv.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => { const res = publishService(srv.id); if (!res.success) alert(`Cannot publish: Missing ${res.readinessMissing?.join(', ')}`); }}
                            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors" title="Publish"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {srv.status === 'PUBLISHED' && (
                          <button onClick={() => suspendService(srv.id)} className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors" title="Suspend">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => duplicateService(srv.id)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors" title="Duplicate">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete "${srv.name}"?`)) deleteService(srv.id); }}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors" title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    No services match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {filteredServices.length > pageSize && (
        <div className="flex items-center justify-between px-2 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs">
          <span className="text-slate-400">
            Page <span className="text-white font-bold">{safePage}</span> of <span className="text-white font-bold">{totalPages}</span>
            <span className="ml-2 text-slate-500">({filteredServices.length} total)</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(safePage - 2, totalPages - 4)) + i;
              return (
                <button key={pg} onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-bold ${pg === safePage ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
                >{pg}</button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Service Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-white text-base">Create New Service Offering</h4>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Service Name *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Multilingual Translator"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Parent Category *</label>
                <select required value={categoryId} onChange={e => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500">
                  <option value="" className="bg-slate-900">-- Select Category --</option>
                  {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Service summary..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 resize-none" />
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsWizardOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl gradient-bg-primary text-white font-bold">Create & Configure</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Config Drawer */}
      <ServiceConfigDrawer service={selectedServiceForConfig} onClose={() => setSelectedServiceForConfig(null)} />
    </div>
  );
}
