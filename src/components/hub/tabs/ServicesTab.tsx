'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { ServiceItem } from '@/lib/types/serviceHub';
import { ServiceConfigDrawer } from './ServiceConfigDrawer';
import { ImageLightboxModal } from '@/components/common/ImageLightboxModal';
import {
  Sparkles, Plus, Edit2, Trash2, Copy, ShieldAlert, CheckCircle2, Layers, Sliders,
  AlertTriangle, Download, Upload, Search, ChevronLeft, ChevronRight, SlidersHorizontal,
  User, Folder, Star, Settings, X, LayoutGrid, Table, Archive, RotateCcw, Info, Trash,
  Maximize2, Power, Globe, MapPin, Clock, Shield
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
const STATUS_TABS = ['ALL', 'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED'] as const;

export function ServicesTab() {
  const {
    services,
    categories,
    addService,
    updateService,
    deleteService,
    softDeleteService,
    restoreService,
    duplicateService,
    suspendService,
    publishService,
    setSelectedServiceForConfig,
    selectedServiceForConfig,
    searchQuery: globalSearch,
    selectedCategoryFilter,
    isServiceWizardOpen,
    setServiceWizardOpen,
    syncFromNeonDB
  } = useServiceHubStore();

  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [subStatusFilter, setSubStatusFilter] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<typeof PAGE_SIZE_OPTIONS[number]>(25);
  
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [softDeleteConfirmSrv, setSoftDeleteConfirmSrv] = useState<ServiceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; title: string; text: string } | null>(null);

  const isWizardOpen = isServiceWizardOpen;
  const setIsWizardOpen = setServiceWizardOpen;

  // Form fields for Service Add/Edit
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [status, setStatus] = useState<any>('DRAFT');
  const [isFeatured, setIsFeatured] = useState(false);
  const [minimumAge, setMinimumAge] = useState(18);
  const [maximumAge, setMaximumAge] = useState(75);
  const [onlineAllowed, setOnlineAllowed] = useState(false);
  const [offlineAllowed, setOfflineAllowed] = useState(true);
  const [locationRequired, setLocationRequired] = useState(true);
  const [durationRequired, setDurationRequired] = useState(true);

  const showToast = (type: 'success' | 'error' | 'info', title: string, text: string) => {
    setToastMessage({ type, title, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSwitchViewMode = (mode: 'GRID' | 'TABLE') => {
    setViewMode(mode);
    showToast('info', 'Layout View Switched', `Switched layout view to ${mode === 'GRID' ? 'Grid Cards' : 'Enterprise Datatable'} mode.`);
  };

  React.useEffect(() => {
    syncFromNeonDB();
  }, [syncFromNeonDB]);

  const activeCategoryFilter = categoryFilter !== 'ALL' ? categoryFilter : selectedCategoryFilter;

  const filteredServices = useMemo(() => {
    return services.filter(srv => {
      const cat = categories.find(c => c.id === srv.category_id);
      if (activeCategoryFilter !== 'ALL' && srv.category_id !== activeCategoryFilter) return false;
      if (subStatusFilter !== 'ALL' && srv.status !== subStatusFilter) return false;
      if (!localSearch && !globalSearch) return true;
      const q = (localSearch || globalSearch).toLowerCase();
      return (
        srv.name.toLowerCase().includes(q) ||
        (srv.short_description && srv.short_description.toLowerCase().includes(q)) ||
        (srv.description && srv.description.toLowerCase().includes(q)) ||
        (cat && cat.name.toLowerCase().includes(q)) ||
        (srv.category_name && srv.category_name.toLowerCase().includes(q)) ||
        srv.status.toLowerCase().includes(q)
      );
    });
  }, [services, categories, activeCategoryFilter, subStatusFilter, localSearch, globalSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedServices = filteredServices.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleFilterChange = (fn: () => void) => { fn(); setCurrentPage(1); };

  const handleOpenCreate = () => {
    setEditingService(null);
    setCode(`SRV-EVT-${Date.now().toString().slice(-4)}`);
    setName('VIP Gala & Event Companion');
    setCategoryId(categories[0]?.id || 'cat-1');
    setShortDescription('Escort for corporate galas, award nights, and private banquets');
    setDescription('High-profile companion service with formal dress code, protocol training, and VIP escort privileges.');
    setIcon('Sparkles');
    setImage('https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80');
    setDisplayOrder(services.length + 1);
    setStatus('DRAFT');
    setIsFeatured(true);
    setMinimumAge(21);
    setMaximumAge(65);
    setOnlineAllowed(false);
    setOfflineAllowed(true);
    setLocationRequired(true);
    setDurationRequired(true);
    setIsWizardOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingService(srv);
    setCode(srv.id);
    setName(srv.name);
    setCategoryId(srv.category_id);
    setShortDescription(srv.short_description || '');
    setDescription(srv.description || '');
    setIcon(srv.icon || 'Sparkles');
    setImage(srv.image || '');
    setDisplayOrder(srv.display_order || 1);
    setStatus(srv.status || 'DRAFT');
    setIsFeatured(srv.is_featured || false);
    setMinimumAge(srv.minimum_age || 18);
    setMaximumAge(srv.maximum_age || 75);
    setOnlineAllowed(srv.online_allowed || false);
    setOfflineAllowed(srv.offline_allowed !== false);
    setLocationRequired(srv.location_required !== false);
    setDurationRequired(srv.duration_required !== false);
    setIsWizardOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    const category = categories.find(c => c.id === categoryId);

    if (editingService) {
      const res = await updateService(editingService.id, {
        category_id: categoryId,
        category_name: category?.name || 'Unassigned',
        name: name.trim(),
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        short_description: shortDescription.trim(),
        description: description.trim(),
        icon,
        image: image.trim(),
        display_order: Number(displayOrder),
        status,
        is_featured: isFeatured,
        minimum_age: Number(minimumAge),
        maximum_age: Number(maximumAge),
        online_allowed: onlineAllowed,
        offline_allowed: offlineAllowed,
        location_required: locationRequired,
        duration_required: durationRequired
      });
      if (res.success) {
        showToast('success', 'Saved in Neon DB', `Service "${name.trim()}" updated live in database.`);
      } else {
        showToast('error', 'DB Write Failed', res.error || 'Failed to update service in DB');
      }
    } else {
      const res = await addService({
        category_id: categoryId,
        category_name: category?.name || 'Unassigned',
        name: name.trim(),
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        short_description: shortDescription.trim(),
        description: description.trim(),
        icon,
        image: image.trim(),
        display_order: Number(displayOrder),
        status,
        is_featured: isFeatured,
        minimum_age: Number(minimumAge),
        maximum_age: Number(maximumAge),
        online_allowed: onlineAllowed,
        offline_allowed: offlineAllowed,
        location_required: locationRequired,
        duration_required: durationRequired
      });
      if (res.success) {
        showToast('success', 'Created in Neon DB', `Service "${name.trim()}" created live in database.`);
      } else {
        showToast('error', 'DB Write Failed', res.error || 'Failed to create service in DB');
      }
    }
    setIsWizardOpen(false);
  };

  const handleSoftDelete = async (srv: ServiceItem) => {
    const res = await softDeleteService(srv.id);
    if (res.success) {
      showToast('info', 'Archived in Neon DB', `Service "${srv.name}" moved to Archive in database.`);
    } else {
      showToast('error', 'Archive Failed', res.error || res.message || 'Could not archive service.');
    }
    setSoftDeleteConfirmSrv(null);
  };

  const handleHardDelete = async (srv: ServiceItem) => {
    const res = await deleteService(srv.id);
    if (res.success) {
      showToast('success', 'Deleted from Neon DB', `Service "${srv.name}" deleted from database.`);
    } else {
      showToast('error', 'Deletion Failed', res.error || 'Could not delete service.');
    }
    setSoftDeleteConfirmSrv(null);
  };

  const handleRestore = async (srv: ServiceItem) => {
    const res = await restoreService(srv.id);
    if (res.success) {
      showToast('success', 'Restored in Neon DB', `Service "${srv.name}" restored in database.`);
    } else {
      showToast('error', 'Restore Failed', res.error || res.message || 'Could not restore service.');
    }
  };

  const handleDuplicate = async (srv: ServiceItem) => {
    const res = await duplicateService(srv.id);
    if (res.success) {
      showToast('success', 'Duplicated in Neon DB', `Duplicated as "${res.data?.name || srv.name + ' (Copy)'}" in database.`);
    } else {
      showToast('error', 'Duplicate Failed', res.error || 'Could not duplicate service.');
    }
  };

  return (
    <div className="space-y-4 w-full relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`p-3.5 rounded-2xl border shadow-xl flex items-center justify-between transition-all font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-300 ${
          toastMessage.type === 'success' ? 'bg-emerald-950 text-emerald-200 border-emerald-500/50 shadow-emerald-950/20' :
          toastMessage.type === 'error' ? 'bg-rose-950 text-rose-200 border-rose-500/50 shadow-rose-950/20' : 'bg-slate-900 text-purple-200 border-purple-500/50 shadow-purple-950/20'
        }`}>
          <div className="flex items-center gap-2.5">
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-5 h-5 text-purple-400 shrink-0" />}
            <div>
              <strong className="block text-white font-bold text-xs">{toastMessage.title}</strong>
              <p className="text-[11px] text-slate-300 leading-snug">{toastMessage.text}</p>
            </div>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Controls & Status Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={e => handleFilterChange(() => setLocalSearch(e.target.value))}
              placeholder="Search service name, description, status..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-colors"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => handleFilterChange(() => setCategoryFilter(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={subStatusFilter}
            onChange={e => handleFilterChange(() => setSubStatusFilter(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-purple-500 cursor-pointer"
          >
            {STATUS_TABS.map(st => (
              <option key={st} value={st}>{st === 'ALL' ? 'All Statuses' : st}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid vs Table View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => handleSwitchViewMode('GRID')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'GRID' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View Mode"
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => handleSwitchViewMode('TABLE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'TABLE' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View Mode"
            >
              <Table className="w-3.5 h-3.5" /> Table
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
      </div>

      {/* Main Content Area: GRID VIEW or TABLE VIEW */}
      {paginatedServices.length > 0 ? (
        viewMode === 'GRID' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedServices.map(srv => {
              const cat = categories.find(c => c.id === srv.category_id);
              const srvImg = srv.image || cat?.banner_image || cat?.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';
              const isArchived = srv.status === 'ARCHIVED';

              return (
                <div key={srv.id} className={`rounded-2xl bg-white border shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between ${
                  isArchived ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200/90'
                }`}>
                  {/* Banner Image */}
                  <div className="relative h-32 w-full bg-slate-900 group">
                    <img src={srvImg} alt={srv.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                    {/* Category Name Pill */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900/90 text-purple-300 font-mono font-bold text-[10px] backdrop-blur-md border border-slate-700">
                        {srv.category_name || cat?.name || 'Unassigned'}
                      </span>
                      {srv.is_featured && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/90 text-slate-950 font-extrabold text-[10px] flex items-center gap-1 backdrop-blur-md">
                          <Star className="w-3 h-3 fill-slate-950" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Status Pill & Expand */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-lg font-bold text-[10px] backdrop-blur-md ${
                        srv.status === 'PUBLISHED' ? 'bg-emerald-500/90 text-white' :
                        srv.status === 'SUSPENDED' ? 'bg-rose-500/90 text-white' :
                        srv.status === 'APPROVED' ? 'bg-cyan-500/90 text-white' : 'bg-slate-700/90 text-slate-300'
                      }`}>
                        {srv.status}
                      </span>
                      <button onClick={() => setLightboxImage(srvImg)} className="p-1 rounded-lg bg-black/60 hover:bg-black/90 text-white">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <h5 className="font-extrabold text-sm text-white drop-shadow-md">{srv.name}</h5>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 text-xs">
                      {srv.short_description && (
                        <p className="text-[11px] font-bold text-purple-700 line-clamp-1">{srv.short_description}</p>
                      )}
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">{srv.description}</p>

                      {/* Badges for Specs */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          Age: {srv.minimum_age || 18}-{srv.maximum_age || 75}
                        </span>
                        {srv.offline_allowed && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-purple-600" /> Offline
                          </span>
                        )}
                        {srv.online_allowed && (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-100 text-[10px] font-bold flex items-center gap-1">
                            <Globe className="w-3 h-3 text-cyan-600" /> Online
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Controls Footer */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedServiceForConfig(srv)}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[10px] flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" /> Config Profiles
                      </button>

                      <div className="flex items-center gap-1">
                        {isArchived ? (
                          <button
                            onClick={() => handleRestore(srv)}
                            className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-bold text-[10px] flex items-center gap-1"
                            title="Restore Service"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Restore
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleDuplicate(srv)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100"
                              title="Duplicate Service"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(srv)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100"
                              title="Edit Service"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setSoftDeleteConfirmSrv(srv)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                              title="Soft Delete (Archive) Service"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
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
                    <th className="py-3 px-3.5">Category</th>
                    <th className="py-3 px-3.5">Service Name</th>
                    <th className="py-3 px-3.5">Description</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center">Delivery Modes</th>
                    <th className="py-3 px-3.5 text-center">Age Limit</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {paginatedServices.map(srv => {
                    const cat = categories.find(c => c.id === srv.category_id);
                    const srvImg = srv.image || cat?.banner_image || cat?.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';
                    const isArchived = srv.status === 'ARCHIVED';

                    return (
                      <tr key={srv.id} className={`hover:bg-slate-50/70 transition-colors ${isArchived ? 'bg-amber-50/20' : ''}`}>
                        {/* Category */}
                        <td className="py-3 px-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-mono font-bold text-[10px] border border-purple-100">
                            {srv.category_name || cat?.name || 'Unassigned'}
                          </span>
                        </td>

                        {/* Name & Image */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 group">
                              <img src={srvImg} alt={srv.name} className="w-full h-full object-cover" />
                              <button onClick={() => setLightboxImage(srvImg)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                                <Maximize2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div>
                              <h6 className="font-extrabold text-slate-900 text-xs">{srv.name}</h6>
                              <span className="text-[10px] text-slate-400">{srv.slug}</span>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="py-3 px-3.5 max-w-xs text-slate-600 leading-snug">
                          <p className="line-clamp-2">{srv.short_description || srv.description}</p>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            srv.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            srv.status === 'SUSPENDED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            srv.status === 'APPROVED' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {srv.status}
                          </span>
                        </td>

                        {/* Delivery Modes */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {srv.offline_allowed && <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px]">Offline</span>}
                            {srv.online_allowed && <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 font-bold text-[10px]">Online</span>}
                          </div>
                        </td>

                        {/* Age Limit */}
                        <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-700">
                          {srv.minimum_age || 18} - {srv.maximum_age || 75}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedServiceForConfig(srv)}
                              className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[10px] flex items-center gap-1"
                              title="Configure Profiles"
                            >
                              <Settings className="w-3.5 h-3.5" /> Config
                            </button>

                            {isArchived ? (
                              <button
                                onClick={() => handleRestore(srv)}
                                className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] flex items-center gap-1"
                                title="Restore Service"
                              >
                                <RotateCcw className="w-3.5 h-3.5" /> Restore
                              </button>
                            ) : (
                              <>
                                <button onClick={() => handleDuplicate(srv)} className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100" title="Duplicate Service">
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleOpenEdit(srv)} className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100" title="Edit Service">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setSoftDeleteConfirmSrv(srv)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100" title="Archive Service">
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
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
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-900 text-sm">No Services Found</h4>
          <p className="text-xs text-slate-500">Try adjusting your filters or search query, or create a new service.</p>
          <button onClick={handleOpenCreate} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Service
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredServices.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3.5 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs shadow-2xs">
          <span className="text-slate-500 font-medium text-center sm:text-left">
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

      {/* Soft Delete (Archive) & Hard Delete Option Confirmation Modal */}
      {softDeleteConfirmSrv && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Archive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Service Action Confirmation</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Select action for <strong className="text-white">{softDeleteConfirmSrv.name}</strong>:</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleSoftDelete(softDeleteConfirmSrv)}
                className="w-full p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-left flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="block font-bold">1. Soft Delete (Archive)</span>
                  <span className="text-[10px] text-amber-200 font-normal">Hides service but preserves config data for future restore.</span>
                </div>
                <Archive className="w-4 h-4 shrink-0" />
              </button>

              <button
                onClick={() => handleHardDelete(softDeleteConfirmSrv)}
                className="w-full p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-left flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="block font-bold">2. Permanent Delete</span>
                  <span className="text-[10px] text-rose-200 font-normal">Completely erases service from Neon PostgreSQL DB.</span>
                </div>
                <Trash className="w-4 h-4 shrink-0" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button onClick={() => setSoftDeleteConfirmSrv(null)} className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Service Create / Edit Form Modal with All Fields */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl my-auto text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-white text-base">
                  {editingService ? `Edit Service: ${editingService.name}` : 'Configure New Service Offering'}
                </h4>
                <p className="text-[11px] text-slate-400">Category Assignment, Descriptions, Age Limits & Delivery Modes</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              {/* Category & Service Name */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-purple-400 font-bold outline-none focus:border-purple-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. VIP Gala Companion"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={e => setShortDescription(e.target.value)}
                  placeholder="e.g. Formal event escort for banquets and award shows"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Description *</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detailed service overview..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Icon & Display Order & Status */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Icon</label>
                  <select
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-purple-400 font-bold"
                  >
                    <option value="Sparkles">Sparkles</option>
                    <option value="Users">Users</option>
                    <option value="Compass">Compass</option>
                    <option value="Calendar">Calendar</option>
                    <option value="Heart">Heart</option>
                    <option value="Shield">Shield</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={e => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white font-bold"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              {/* Image Banner URL */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">Service Banner Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                />
              </div>

              {/* Age Limits */}
              <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Minimum Age Limit</label>
                  <input
                    type="number"
                    value={minimumAge}
                    onChange={e => setMinimumAge(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Maximum Age Limit</label>
                  <input
                    type="number"
                    value={maximumAge}
                    onChange={e => setMaximumAge(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Delivery Modes & Flags */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={offlineAllowed} onChange={e => setOfflineAllowed(e.target.checked)} className="accent-purple-600 rounded w-4 h-4" />
                  Offline In-Person
                </label>
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={onlineAllowed} onChange={e => setOnlineAllowed(e.target.checked)} className="accent-purple-600 rounded w-4 h-4" />
                  Online Virtual
                </label>
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={locationRequired} onChange={e => setLocationRequired(e.target.checked)} className="accent-purple-600 rounded w-4 h-4" />
                  GPS Location Required
                </label>
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-amber-500 rounded w-4 h-4" />
                  Mark as Featured
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsWizardOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold">
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Config Profiles Drawer */}
      {selectedServiceForConfig && (
        <ServiceConfigDrawer
          service={selectedServiceForConfig}
          onClose={() => setSelectedServiceForConfig(null)}
        />
      )}

      {lightboxImage && (
        <ImageLightboxModal isOpen={!!lightboxImage} imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
    </div>
  );
}
