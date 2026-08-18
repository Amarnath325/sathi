'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { ServiceItem } from '@/lib/types/serviceHub';
import { ServiceConfigDrawer } from './ServiceConfigDrawer';
import {
  Sparkles, Plus, Edit2, Trash2, Copy, ShieldAlert, CheckCircle2, Layers, Sliders,
  AlertTriangle, Download, Upload, Search, ChevronLeft, ChevronRight, SlidersHorizontal,
  User, Folder, Star, Settings, X
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
const STATUS_TABS = ['ALL', 'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED'] as const;

export function ServicesTab() {
  const {
    services,
    categories,
    addService,
    deleteService,
    duplicateService,
    suspendService,
    setSelectedServiceForConfig,
    selectedServiceForConfig,
    searchQuery: globalSearch,
    selectedCategoryFilter,
    isServiceWizardOpen,
    setServiceWizardOpen,
    syncFromNeonDB
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

  React.useEffect(() => {
    syncFromNeonDB();
  }, [syncFromNeonDB]);

  const activeCategoryFilter = categoryFilter !== 'ALL' ? categoryFilter : selectedCategoryFilter;

  const filteredServices = useMemo(() => {
    return services.filter(srv => {
      if (activeCategoryFilter !== 'ALL' && srv.category_id !== activeCategoryFilter) return false;
      if (subStatusFilter !== 'ALL' && srv.status !== subStatusFilter) return false;
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return srv.name.toLowerCase().includes(q) || srv.description.toLowerCase().includes(q);
    });
  }, [services, activeCategoryFilter, subStatusFilter, searchTerm]);

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

  return (
    <div className="space-y-3 w-full">
      {/* Status Filter Sub-Tabs without Scrollbars */}
      <div
        className="flex items-center gap-1 overflow-x-auto pb-0.5 w-full select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {STATUS_TABS.map(st => {
          if (!st) return null;
          const count = st === 'ALL' ? services.length : services.filter(s => s.status === st).length;
          const isSelected = subStatusFilter === st;

          let badgeStyle = "bg-white border-slate-200/90 text-slate-600 font-medium hover:bg-slate-50";
          if (isSelected) {
            if (st === 'PUBLISHED') {
              badgeStyle = "bg-emerald-50 border-emerald-300 text-emerald-700 font-extrabold shadow-2xs";
            } else if (st === 'ALL') {
              badgeStyle = "bg-slate-900 text-white font-extrabold border-slate-900 shadow-2xs";
            } else {
              badgeStyle = "bg-purple-600 text-white font-extrabold border-purple-600 shadow-2xs";
            }
          }

          const labelText = st === 'ALL' ? 'ALL SERVICES' : st.replace(/_/g, ' ');

          return (
            <button
              key={st}
              onClick={() => handleFilterChange(() => setSubStatusFilter(st))}
              className={`px-2.5 py-1 rounded-full text-[11px] transition-all shrink-0 border whitespace-nowrap ${badgeStyle}`}
            >
              {labelText} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={e => handleFilterChange(() => setLocalSearch(e.target.value))}
            placeholder="Search services..."
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3 py-2 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 md:flex items-center gap-2 w-full md:w-auto">
          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[11px] shadow-2xs">
            <Folder className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={categoryFilter}
              onChange={e => handleFilterChange(() => setCategoryFilter(e.target.value))}
              className="bg-transparent text-slate-700 font-medium outline-none cursor-pointer text-[11px] w-full"
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Page Size Dropdown */}
          <div className="flex items-center justify-between gap-1 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[11px] shadow-2xs">
            <span className="text-slate-500 font-medium text-[11px]">Show</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value) as any); setCurrentPage(1); }}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer text-[11px]"
            >
              {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop/Laptop Table View (sm:block) */}
      <div className="hidden sm:block rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3.5">Service Name</th>
                <th className="py-2.5 px-3.5">Category</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5">Age Bounds</th>
                <th className="py-2.5 px-3.5">Config</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedServices.length > 0 ? paginatedServices.map(srv => {
                const category = categories.find(c => c.id === srv.category_id);
                return (
                  <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-600/70 shrink-0" />
                        <span>{srv.name}</span>
                        {srv.is_featured && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100/80 text-amber-800 text-[9px] font-bold flex items-center gap-0.5 border border-amber-200/60">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> FEATURED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-purple-600 font-semibold">{category?.name || srv.category_name || 'Unassigned'}</td>
                    <td className="py-2.5 px-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {srv.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 font-medium">{srv.minimum_age}–{srv.maximum_age} yrs</td>
                    <td className="py-2.5 px-3.5">
                      <button
                        onClick={() => setSelectedServiceForConfig(srv)}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200/90 text-purple-700 font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Settings className="w-3 h-3 text-purple-600" /> Config Engine
                      </button>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {srv.status === 'PUBLISHED' && (
                          <button
                            onClick={() => suspendService(srv.id)}
                            className="p-1 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors"
                            title="Suspend"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => duplicateService(srv.id)}
                          className="p-1 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete "${srv.name}"?`)) deleteService(srv.id); }}
                          className="p-1 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors"
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
                  <td colSpan={6} className="py-10 text-center text-slate-500 text-xs">
                    No services match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (< sm) */}
      <div className="block sm:hidden space-y-2.5">
        {paginatedServices.length > 0 ? paginatedServices.map(srv => {
          const category = categories.find(c => c.id === srv.category_id);
          return (
            <div key={srv.id} className="p-3 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <h4 className="font-bold text-slate-900 text-xs">{srv.name}</h4>
                  </div>
                  <p className="text-[11px] text-purple-600 font-semibold mt-0.5">{category?.name || srv.category_name || 'Unassigned'}</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[9px] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {srv.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                <span className="text-slate-500">Age: <strong className="text-slate-800">{srv.minimum_age}–{srv.maximum_age} yrs</strong></span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateService(srv.id)}
                    className="p-1 rounded-md border border-slate-200 bg-white text-slate-600"
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete "${srv.name}"?`)) deleteService(srv.id); }}
                    className="p-1 rounded-md border border-slate-200 bg-white text-slate-600"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setSelectedServiceForConfig(srv)}
                className="w-full py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors shadow-2xs"
              >
                <Settings className="w-3 h-3 text-purple-600" /> Open Config Engine
              </button>
            </div>
          );
        }) : (
          <div className="p-6 text-center rounded-2xl bg-white border border-slate-200/90 text-slate-500 text-xs">
            No services match your filters.
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {filteredServices.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-3 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-[11px] shadow-2xs">
          <span className="text-slate-500 font-medium text-center sm:text-left">
            Page <span className="text-slate-900 font-bold">{safePage}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
            <span className="ml-2 text-slate-400">({filteredServices.length} total)</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(safePage - 2, totalPages - 4)) + i;
              return (
                <button key={pg} onClick={() => setCurrentPage(pg)}
                  className={`w-6 h-6 rounded-md text-[10px] font-bold ${pg === safePage ? 'bg-purple-600 text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                >{pg}</button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Create Service Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl my-auto text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-white text-base">Create New Service Offering</h4>
              <button onClick={() => setIsWizardOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Service Name *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Multilingual Translator"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500 transition-colors text-xs" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Parent Category *</label>
                <select required value={categoryId} onChange={e => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500 text-xs">
                  <option value="" className="bg-slate-900">-- Select Category --</option>
                  {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Service summary..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 resize-none text-xs" />
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsWizardOpen(false)} className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold">Create & Configure</button>
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
