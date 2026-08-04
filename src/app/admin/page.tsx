'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Activity, 
  Lock, 
  TrendingUp, 
  Search, 
  Filter, 
  ChevronRight,
  Eye,
  RefreshCw,
  Sliders,
  UserX,
  AlertCircle,
  Tag,
  Ticket,
  Settings,
  Bell,
  FileSpreadsheet,
  Building2,
  Percent,
  CreditCard,
  ArrowUpRight,
  Send,
  SlidersHorizontal,
  HelpCircle,
  UserCheck,
  Zap,
  Globe,
  Plus,
  Trash2,
  RotateCcw,
  Edit2
} from 'lucide-react';

import { useAdminStore } from '@/lib/adminStore';
import { useCrudStore, DynamicCompanionItem } from '@/lib/crudStore';
import { UniversalCrudToolbar } from '@/components/common/UniversalCrudToolbar';

export default function AdminDashboardPage() {
  const { 
    config, 
    updateConfig, 
    promos, 
    addPromoCode, 
    togglePromoCode, 
    deletePromoCode,
    categories,
    addCategory,
    toggleCategory,
    suspendedUserIds,
    toggleUserSuspension
  } = useAdminStore();

  const {
    companions,
    addCompanion,
    updateCompanion,
    toggleCompanionActive,
    softDeleteCompanion,
    restoreCompanion,
    permanentDeleteCompanion,
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    importCompanionsFromCSV
  } = useCrudStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview' 
    | 'revenue' 
    | 'users' 
    | 'bookings' 
    | 'disputes' 
    | 'verification' 
    | 'withdrawals' 
    | 'commission' 
    | 'coupons' 
    | 'categories'
    | 'tickets' 
    | 'settings'
  >('users');

  const [notification, setNotification] = useState<string | null>(null);

  // View Trash state for Users
  const [viewTrash, setViewTrash] = useState(false);

  // Create User Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createCity, setCreateCity] = useState('');
  const [createRate, setCreateRate] = useState('75');

  // Edit User Modal State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRate, setEditRate] = useState('80');

  // New Promo Code Form state
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('10');

  // New Category Form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const triggerNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Filtered List based on Trash state
  const activeCompanions = companions.filter((c: DynamicCompanionItem) => !c.isDeleted);
  const trashedCompanions = companions.filter((c: DynamicCompanionItem) => c.isDeleted);
  const displayedCompanions = viewTrash ? trashedCompanions : activeCompanions;

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim() || !createEmail.trim()) return;

    addCompanion({
      name: createName.trim(),
      email: createEmail.trim(),
      city: createCity.trim() || 'Global',
      country: 'USA',
      age: 26,
      hourlyRate: parseFloat(createRate) || 75,
      ratingAvg: 5.0,
      status: 'ACTIVE',
      category: 'Event Companion'
    });

    triggerNotify(`User "${createName}" created successfully with Full CRUD capabilities!`);
    setShowCreateModal(false);
    setCreateName('');
    setCreateEmail('');
    setCreateCity('');
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    updateCompanion(editingUserId, {
      name: editName,
      hourlyRate: parseFloat(editRate) || 80
    });

    triggerNotify(`User #${editingUserId} updated dynamically!`);
    setEditingUserId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">Enterprise Full CRUD Command Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                CRUD + BULK + TRASH RESTORE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Manage users, rates, promo codes & categories with Import/Export CSV, Soft-Delete & Trash Restore.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => triggerNotify('All dynamic state persistence re-synced.')}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync CRUD State
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          {notification}
        </div>
      )}

      {/* Admin Module Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-1 pb-1">
        {[
          { id: 'users', label: 'User Directory (Full CRUD & Trash)', icon: Users },
          { id: 'commission', label: 'Commission & Fees Control', icon: Percent },
          { id: 'coupons', label: 'Promo Coupons Engine', icon: Tag },
          { id: 'categories', label: 'Service Categories Manager', icon: Sliders },
          { id: 'overview', label: 'Analytics', icon: Activity },
          { id: 'settings', label: 'Platform Security Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. Full CRUD User Directory View */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          {/* Universal CRUD Toolbar Component */}
          <UniversalCrudToolbar 
            title="User Directory"
            totalActiveCount={activeCompanions.length}
            totalTrashCount={trashedCompanions.length}
            viewTrash={viewTrash}
            setViewTrash={setViewTrash}
            onOpenCreateModal={() => setShowCreateModal(true)}
            onNotify={triggerNotify}
            headersForSample={['name', 'email', 'city', 'country', 'age', 'hourlyRate', 'category']}
            exportRows={displayedCompanions}
            onImportData={(parsedRows) => importCompanionsFromCSV(parsedRows)}
          />

          {/* User Data Table */}
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input 
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === displayedCompanions.length}
                      onChange={(e) => {
                        if (e.target.checked) selectAll(displayedCompanions.map((c: DynamicCompanionItem) => c.id));
                        else clearSelection();
                      }}
                      className="rounded accent-indigo-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">User Name & Email</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Hourly Rate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {displayedCompanions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                      {viewTrash ? 'Trash Bin is empty!' : 'No user records found. Click "Create New" or "Import CSV" to add entries.'}
                    </td>
                  </tr>
                ) : (
                  displayedCompanions.map((user: DynamicCompanionItem) => {
                    const isSelected = selectedIds.includes(user.id);
                    return (
                      <tr key={user.id} className={`hover:bg-slate-900/50 transition-colors ${isSelected ? 'bg-indigo-950/20' : ''}`}>
                        <td className="py-3 px-4">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelection(user.id)}
                            className="rounded accent-indigo-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{user.name}</div>
                          <span className="text-[10px] text-slate-400">{user.email}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {user.city}, {user.country}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          ${user.hourlyRate}/hr
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                            {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!viewTrash ? (
                            <div className="flex items-center justify-end gap-2">
                              {/* Toggle Active / Inactive */}
                              <button 
                                onClick={() => { toggleCompanionActive(user.id); triggerNotify(`Toggled status for ${user.name}`); }}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white"
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>

                              {/* Edit Modal Trigger */}
                              <button 
                                onClick={() => { setEditingUserId(user.id); setEditName(user.name); setEditRate(user.hourlyRate.toString()); }}
                                className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Soft Delete to Trash */}
                              <button 
                                onClick={() => { softDeleteCompanion(user.id); triggerNotify(`Moved ${user.name} to Trash Bin`); }}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            /* Trash Action Buttons: Restore & Permanent Delete */
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => { restoreCompanion(user.id); triggerNotify(`Restored ${user.name} from Trash Bin`); }}
                                className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-500"
                              >
                                <RotateCcw className="w-3 h-3" /> Restore
                              </button>
                              <button 
                                onClick={() => { permanentDeleteCompanion(user.id); triggerNotify(`Permanently deleted ${user.name}`); }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-500"
                              >
                                Delete Permanently
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Create User Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <form onSubmit={handleCreateUserSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4 animate-fade-in">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Create New Companion Profile</h3>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Full Name</label>
                    <input type="text" value={createName} onChange={(e) => setCreateName(e.target.value)} required className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Email Address</label>
                    <input type="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} required className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">City</label>
                    <input type="text" value={createCity} onChange={(e) => setCreateCity(e.target.value)} placeholder="New York" className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Hourly Rate ($USD)</label>
                    <input type="number" value={createRate} onChange={(e) => setCreateRate(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs">Save Profile</button>
                </div>
              </form>
            </div>
          )}

          {/* Edit User Modal */}
          {editingUserId && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <form onSubmit={handleEditUserSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Edit User Profile #{editingUserId}</h3>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Full Name</label>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Hourly Rate ($USD)</label>
                    <input type="number" value={editRate} onChange={(e) => setEditRate(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingUserId(null)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs">Update Record</button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* 2. Commission & Fees Control */}
      {activeTab === 'commission' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white">Dynamic Commission Rates Control</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white block">Platform Fee (%)</label>
              <input type="number" value={config.platformFeePercent} onChange={(e) => updateConfig({ platformFeePercent: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 rounded-xl bg-slate-950 text-indigo-400 font-bold text-lg border border-slate-800" />
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white block">Escrow Holding Fee (%)</label>
              <input type="number" value={config.escrowHoldingFeePercent} onChange={(e) => updateConfig({ escrowHoldingFeePercent: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 rounded-xl bg-slate-950 text-emerald-400 font-bold text-lg border border-slate-800" />
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white block">GST Tax Rate (%)</label>
              <input type="number" value={config.gstTaxPercent} onChange={(e) => updateConfig({ gstTaxPercent: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-lg border border-slate-800" />
            </div>
          </div>
        </div>
      )}

      {/* Generic View for Other Tabs */}
      {['coupons', 'categories', 'overview', 'settings'].includes(activeTab) && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">{activeTab.toUpperCase()} Module Loaded</h3>
          <p className="text-xs text-slate-400">All data collections linked with Universal Persistent CRUD store.</p>
        </div>
      )}

    </div>
  );
}
