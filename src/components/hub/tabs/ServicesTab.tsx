'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { ServiceItem, ServicePublishStatus } from '@/lib/types/serviceHub';
import { ServiceConfigDrawer } from './ServiceConfigDrawer';
import {
  Sparkles, Plus, Edit2, Trash2, Copy, ShieldAlert, CheckCircle2, Layers, Sliders, Play,
  AlertTriangle, Download, Upload, Search, ChevronLeft, ChevronRight, SlidersHorizontal,
  User, Folder, Star, Settings
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
    isServiceWizardOpen,
    setServiceWizardOpen
  } = useServiceHubStore();

  const [subStatusFilter, setSubStatusFilter] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<typeof PAGE_SIZE_OPTIONS[number]>(25);
  const isWizardOpen = isServiceWizardOpen;
  const setIsWizardOpen = setServiceWizardOpen;
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
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map(st => {
          const count = st === 'ALL' ? services.length : services.filter(s => s.status === st).length;
          const isSelected = subStatusFilter === st;

          let badgeStyle = "bg-white border-slate-200/90 text-slate-600 font-medium hover:bg-slate-50";
          if (isSelected) {
            if (st === 'PUBLISHED') {
              badgeStyle = "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-xs";
            } else if (st === 'ALL') {
              badgeStyle = "bg-slate-900 text-white font-bold border-slate-900 shadow-xs";
            } else {
              badgeStyle = "bg-purple-600 text-white font-bold border-purple-600 shadow-xs";
            }
          }

          return (
            <button
              key={st}
              onClick={() => handleFilterChange(() => setSubStatusFilter(st))}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all shrink-0 border ${badgeStyle}`}
            >
              {st.replace(/_/g, ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={e => handleFilterChange(() => setLocalSearch(e.target.value))}
            placeholder="Search services by name or description..."
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs shrink-0 shadow-xs">
          <Folder className="w-4 h-4 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={e => handleFilterChange(() => setCategoryFilter(e.target.value))}
            className="bg-transparent text-slate-700 font-medium outline-none cursor-pointer text-xs"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Page Size Dropdown */}
        <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs shrink-0 shadow-xs">
          <span className="text-slate-700 font-medium">Show</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value) as any); setCurrentPage(1); }}
            className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer text-xs"
          >
            {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Service Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Age Bounds</th>
                <th className="py-3.5 px-4">Config</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedServices.length > 0 ? paginatedServices.map(srv => {
                const category = categories.find(c => c.id === srv.category_id);
                return (
                  <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-600/70 shrink-0" />
                        <span>{srv.name}</span>
                        {srv.is_featured && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 text-[10px] font-bold flex items-center gap-1 border border-amber-200/60">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> FEATURED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-purple-600 font-semibold">{category?.name || srv.category_name || 'Unassigned'}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {srv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{srv.minimum_age}–{srv.maximum_age} yrs</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedServiceForConfig(srv)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/90 text-purple-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Settings className="w-3.5 h-3.5 text-purple-600" /> Config Engine
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {srv.status === 'PUBLISHED' && (
                          <button
                            onClick={() => suspendService(srv.id)}
                            className="p-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors"
                            title="Suspend"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => duplicateService(srv.id)}
                          className="p-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete "${srv.name}"?`)) deleteService(srv.id); }}
                          className="p-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors"
                          title="Delete"
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
        <div className="flex items-center justify-between px-3 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs shadow-2xs">
          <span className="text-slate-500 font-medium">
            Page <span className="text-slate-900 font-bold">{safePage}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
            <span className="ml-2 text-slate-400">({filteredServices.length} total)</span>
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
                <button key={pg} onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-bold ${pg === safePage ? 'bg-purple-600 text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                >{pg}</button>
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
