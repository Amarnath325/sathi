'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { ServiceItem, ServicePublishStatus } from '@/lib/types/serviceHub';
import { ServiceConfigDrawer } from './ServiceConfigDrawer';
import {
  Sparkles, Plus, Edit2, Trash2, Copy, ShieldAlert, CheckCircle2, Layers, Sliders, Play, AlertTriangle
} from 'lucide-react';

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
    searchQuery,
    selectedCategoryFilter,
    selectedStatusFilter
  } = useServiceHubStore();

  const [subStatusFilter, setSubStatusFilter] = useState<string>('ALL');

  // Form Modal for New Service
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  const filteredServices = services.filter(srv => {
    if (selectedCategoryFilter !== 'ALL' && srv.category_id !== selectedCategoryFilter) return false;
    if (subStatusFilter !== 'ALL' && srv.status !== subStatusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return srv.name.toLowerCase().includes(q) || srv.description.toLowerCase().includes(q);
  });

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
    setName('');
    setDescription('');
    // Open Configuration Drawer immediately for the new service
    setSelectedServiceForConfig(created);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Module 2: Service Catalog & Centralized Configuration ({services.length} Total)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every service is linked to the 10 core configuration profiles. Only <span className="text-emerald-400 font-bold">PUBLISHED</span> services are bookable.
          </p>
        </div>

        <button
          onClick={() => {
            setCategoryId(categories[0]?.id || '');
            setIsWizardOpen(true);
          }}
          className="px-4 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs hover:opacity-90 shadow-lg flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Service
        </button>
      </div>

      {/* Sub-Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED'].map((st) => (
          <button
            key={st}
            onClick={() => setSubStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              subStatusFilter === st ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {st.replace(/_/g, ' ')} ({st === 'ALL' ? services.length : services.filter(s => s.status === st).length})
          </button>
        ))}
      </div>

      {/* Services Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-mono text-slate-400 uppercase">
              <th className="py-3.5 px-4">Service Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Publish Status</th>
              <th className="py-3.5 px-4">Age Bounds</th>
              <th className="py-3.5 px-4">Readiness & Config</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredServices.map(srv => {
              const category = categories.find(c => c.id === srv.category_id);

              return (
                <tr key={srv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span>{srv.name}</span>
                      {srv.is_featured && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-extrabold">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-indigo-400 font-semibold">{category?.name || srv.category_name || 'Unassigned'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      srv.status === 'PUBLISHED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      srv.status === 'SUSPENDED' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                      'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {srv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono">{srv.minimum_age} - {srv.maximum_age} yrs</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedServiceForConfig(srv)}
                      className="px-3 py-1 rounded-lg bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 font-bold text-[11px] flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" /> Centralized Config Engine
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {srv.status !== 'PUBLISHED' && (
                        <button
                          onClick={() => {
                            const res = publishService(srv.id);
                            if (!res.success) alert(`Cannot publish: Missing ${res.readinessMissing?.join(', ')}`);
                          }}
                          className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs"
                          title="Publish Service"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {srv.status === 'PUBLISHED' && (
                        <button
                          onClick={() => suspendService(srv.id)}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs"
                          title="Suspend Service"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => duplicateService(srv.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
                        title="Duplicate Service"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete service "${srv.name}"?`)) deleteService(srv.id);
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs"
                        title="Delete Service"
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

      {/* Service Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-white text-base">Create New Service Offering</h4>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Multilingual Translator Escort"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Assign Parent Category *</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Service summary..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs"
                >
                  Create & Configure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Centralized Service Config Drawer */}
      <ServiceConfigDrawer
        service={selectedServiceForConfig}
        onClose={() => setSelectedServiceForConfig(null)}
      />
    </div>
  );
}
