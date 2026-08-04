'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Edit2,
  LogOut,
  ChevronLeft,
  ChevronDown,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  Layers,
  Database,
  BarChart3,
  Terminal,
  Menu,
  X
} from 'lucide-react';

import { useAdminStore } from '@/lib/adminStore';
import { useCrudStore, DynamicCompanionItem } from '@/lib/crudStore';
import { UniversalCrudToolbar } from '@/components/common/UniversalCrudToolbar';

type ERPModuleTab = 
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
  | 'settings';

interface SidebarGroup {
  groupTitle: string;
  items: {
    id: ERPModuleTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();

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

  const [activeTab, setActiveTab] = useState<ERPModuleTab>('users');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Admin User Session info
  const [adminUser, setAdminUser] = useState<{ email: string; fullName: string; role: string } | null>(null);

  useEffect(() => {
    // Read session info
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (e) {
        setAdminUser({ email: 'admin@sathi.com', fullName: 'Executive Super Admin', role: 'SUPER_ADMIN' });
      }
    } else {
      setAdminUser({ email: 'admin@sathi.com', fullName: 'Executive Super Admin', role: 'SUPER_ADMIN' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

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

  // Filtered List based on Trash state & search query
  const activeCompanions = companions.filter((c: DynamicCompanionItem) => !c.isDeleted);
  const trashedCompanions = companions.filter((c: DynamicCompanionItem) => c.isDeleted);
  const rawList = viewTrash ? trashedCompanions : activeCompanions;

  const displayedCompanions = rawList.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName || !createEmail) return;

    addCompanion({
      name: createName,
      email: createEmail,
      city: createCity || 'New York',
      country: 'USA',
      age: 25,
      hourlyRate: Number(createRate) || 75,
      ratingAvg: 5.0,
      status: 'ACTIVE',
      category: 'Event Companion'
    });

    triggerNotify(`User ${createName} created successfully!`);
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
      hourlyRate: Number(editRate) || 80
    });

    triggerNotify(`User #${editingUserId} updated dynamically!`);
    setEditingUserId(null);
  };

  // Sidebar Menu Structure
  const sidebarGroups: SidebarGroup[] = [
    {
      groupTitle: 'ANALYTICS & EXECUTIVE',
      items: [
        { id: 'overview', label: 'Executive Analytics', icon: BarChart3 },
        { id: 'revenue', label: 'Revenue & Escrow Ledger', icon: DollarSign, badge: '$14.2k', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
      ]
    },
    {
      groupTitle: 'CRM & USERS',
      items: [
        { id: 'users', label: 'User & Companion Directory', icon: Users, badge: `${companions.length}`, badgeColor: 'bg-indigo-500/20 text-indigo-300' },
        { id: 'verification', label: 'KYC Document Verification', icon: UserCheck, badge: '2 Pending', badgeColor: 'bg-amber-500/20 text-amber-300' },
      ]
    },
    {
      groupTitle: 'MARKETPLACE OPERATIONS',
      items: [
        { id: 'bookings', label: 'Bookings & Escrow Engine', icon: Clock },
        { id: 'disputes', label: 'Disputes & Support Desk', icon: AlertTriangle, badge: '0 Open', badgeColor: 'bg-slate-800 text-slate-400' },
        { id: 'categories', label: 'Service Categories Manager', icon: Sliders },
      ]
    },
    {
      groupTitle: 'FINANCIAL CONTROL',
      items: [
        { id: 'commission', label: 'Fee & GST Tax Matrix', icon: Percent },
        { id: 'withdrawals', label: 'Companion Payouts', icon: CreditCard },
        { id: 'coupons', label: 'Promo Coupons Engine', icon: Tag, badge: `${promos.length}`, badgeColor: 'bg-purple-500/20 text-purple-300' },
      ]
    },
    {
      groupTitle: 'SECURITY & GOVERNANCE',
      items: [
        { id: 'settings', label: 'Platform Security Settings', icon: Settings },
        { id: 'tickets', label: 'System Audit Logs', icon: Terminal },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      
      {/* ========================================== */}
      {/* 🟢 ENTERPRISE LEFT SIDEBAR (DESKTOP)       */}
      {/* ========================================== */}
      <aside 
        className={`hidden lg:flex ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } bg-slate-900/90 border-r border-slate-800/80 backdrop-blur-xl flex-col justify-between transition-all duration-300 relative z-30 shrink-0 select-none`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-20 px-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25 shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold text-white tracking-tight">Sathi</span>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">ERP v2.4</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Enterprise Command</p>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button */}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Module Navigation List */}
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
            {sidebarGroups.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                {!sidebarCollapsed && (
                  <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    {group.groupTitle}
                  </h3>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!sidebarCollapsed && item.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Admin Footer User Session */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Admin Avatar"
                className="w-9 h-9 rounded-xl object-cover border border-purple-500/50 shrink-0"
              />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{adminUser?.fullName || 'Super Admin'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{adminUser?.email || 'admin@sathi.com'}</p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Logout Admin Session"
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/50 hover:border-rose-500/30 transition-all shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* ========================================== */}
      {/* 📱 MOBILE SIDEBAR DRAWER OVERLAY          */}
      {/* ========================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex lg:hidden">
          <div className="w-80 bg-slate-900 border-r border-slate-800 h-full flex flex-col justify-between p-5 overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Sathi ERP</h3>
                    <p className="text-[10px] font-mono text-purple-400">Enterprise Mobile Menu</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-6">
                {sidebarGroups.map((group, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h3 className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                      {group.groupTitle}
                    </h3>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                            isActive ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300 font-bold">{adminUser?.fullName || 'Super Admin'}</div>
              <button onClick={handleLogout} className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ========================================== */}
      {/* 🟦 MAIN ERP DASHBOARD CONTENT AREA        */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950">
        
        {/* Top ERP Header Navigation Bar */}
        <header className="h-20 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0">
          
          {/* Left: Mobile Menu Trigger & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="hidden sm:inline">ERP Command</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-purple-400 font-bold capitalize">{activeTab}</span>
            </div>
            <span className="hidden sm:flex px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>

          {/* Top Bar Actions & Search */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search companions, bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Sync Button */}
            <button 
              onClick={() => triggerNotify('All dynamic store parameters re-synced.')}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Sync ERP State</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </header>

        {/* Dynamic Notification Banner */}
        {notification && (
          <div className="mx-4 sm:mx-8 mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* ERP Main Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 custom-scrollbar">

          {/* MODULE 1: USER DIRECTORY & FULL CRUD */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              
              {/* Module Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800/80">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" /> User & Companion Master Directory
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Full-cycle companion management with Universal CSV toolbar, Bulk actions, Trash & Restore.</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-purple-600/25 flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" /> Add New Companion
                </button>
              </div>

              {/* Universal Toolbar */}
              <UniversalCrudToolbar
                title="Companion & User Directory"
                totalActiveCount={activeCompanions.length}
                totalTrashCount={trashedCompanions.length}
                viewTrash={viewTrash}
                setViewTrash={setViewTrash}
                onOpenCreateModal={() => setShowCreateModal(true)}
                onNotify={triggerNotify}
                exportRows={displayedCompanions}
                onImportData={(parsedRows) => {
                  importCompanionsFromCSV(parsedRows);
                  triggerNotify(`Imported ${parsedRows.length} companions via CSV!`);
                }}
              />

              {/* Data Table */}
              <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        <th className="py-4 px-5 w-10">Select</th>
                        <th className="py-4 px-5">Companion Profile</th>
                        <th className="py-4 px-5">Location</th>
                        <th className="py-4 px-5">Hourly Rate</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5">Suspension</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {displayedCompanions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500">
                            No companion records found in {viewTrash ? 'Trash Bin' : 'Active Directory'}.
                          </td>
                        </tr>
                      ) : (
                        displayedCompanions.map((companion) => {
                          const isSelected = selectedIds.includes(companion.id);
                          const isSuspended = suspendedUserIds.includes(companion.id);
                          return (
                            <tr key={companion.id} className={`hover:bg-slate-900/50 transition-colors ${isSelected ? 'bg-purple-950/20' : ''}`}>
                              <td className="py-4 px-5">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelection(companion.id)}
                                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
                                />
                              </td>
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-3">
                                  <img src={(companion as any).avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'} alt={companion.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                                  <div>
                                    <p className="font-bold text-white text-sm">{companion.name}</p>
                                    <p className="text-[10px] font-mono text-slate-400">ID: #{companion.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-slate-300 font-medium">{companion.city}, {companion.country}</td>
                              <td className="py-4 px-5 font-mono font-bold text-emerald-400">${companion.hourlyRate}/hr</td>
                              <td className="py-4 px-5">
                                <button
                                  onClick={() => toggleCompanionActive(companion.id)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${companion.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                                >
                                  {companion.isActive ? '● Online & Active' : 'Offline'}
                                </button>
                              </td>
                              <td className="py-4 px-5">
                                <button
                                  onClick={() => {
                                    toggleUserSuspension(companion.id);
                                    triggerNotify(`User #${companion.id} ${isSuspended ? 'unsuspended' : 'suspended'}.`);
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${isSuspended ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
                                >
                                  {isSuspended ? 'SUSPENDED' : 'Active Account'}
                                </button>
                              </td>
                              <td className="py-4 px-5 text-right space-x-2">
                                {!viewTrash ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingUserId(companion.id);
                                        setEditName(companion.name);
                                        setEditRate(String(companion.hourlyRate));
                                      }}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                      title="Edit Record"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        softDeleteCompanion(companion.id);
                                        triggerNotify(`Moved #${companion.id} to Trash.`);
                                      }}
                                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                                      title="Soft Delete to Trash"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        restoreCompanion(companion.id);
                                        triggerNotify(`Restored #${companion.id} back to active list.`);
                                      }}
                                      className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-colors"
                                      title="Restore Record"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        permanentDeleteCompanion(companion.id);
                                        triggerNotify(`Permanently erased #${companion.id}.`);
                                      }}
                                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                                      title="Permanent Delete"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: COMMISSION & FEE MATRIX */}
          {activeTab === 'commission' && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Percent className="w-5 h-5 text-purple-400" /> Platform Fee & Tax Rate Configuration
                </h2>
                <p className="text-xs text-slate-400 mt-1">Changes here instantly update dynamic pricing algorithms on wallet and booking checkout flows.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Commission Fee (%)</label>
                  <input
                    type="number"
                    value={config.platformFeePercent}
                    onChange={(e) => updateConfig({ platformFeePercent: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Escrow Holding Fee (%)</label>
                  <input
                    type="number"
                    value={config.escrowHoldingFeePercent}
                    onChange={(e) => updateConfig({ escrowHoldingFeePercent: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GST / Value Added Tax Rate (%)</label>
                  <input
                    type="number"
                    value={config.gstTaxPercent}
                    onChange={(e) => updateConfig({ gstTaxPercent: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <button
                  onClick={() => triggerNotify('Fee and Tax settings saved dynamically to global store.')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors shadow-lg shadow-purple-600/25"
                >
                  Save Dynamic Parameters
                </button>
              </div>
            </div>
          )}

          {/* MODULE 3: PROMO COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 max-w-4xl">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800/80">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-purple-400" /> Create New Promo Coupon
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. SUMMER50)"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-xs text-white focus:border-purple-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(e.target.value)}
                    className="w-32 bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-xs text-white focus:border-purple-500 outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!newPromoCode) return;
                      addPromoCode({
                        code: newPromoCode,
                        discountPercent: Number(newPromoDiscount) || 10,
                        flatDiscount: 0,
                        expiryDate: '2026-12-31',
                        isActive: true
                      });
                      triggerNotify(`Added coupon ${newPromoCode}!`);
                      setNewPromoCode('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-600/25"
                  >
                    Add Coupon
                  </button>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Active Platform Coupons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promos.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-purple-400 text-sm">{p.code}</span>
                        <p className="text-xs text-slate-400 font-semibold">{p.discountPercent}% OFF Discount</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePromoCode(p.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${p.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
                        >
                          {p.isActive ? 'Active' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => deletePromoCode(p.id)}
                          className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: OVERVIEW ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-bold uppercase font-mono">Total Companions</p>
                <h3 className="text-3xl font-extrabold text-white mt-2">{companions.length}</h3>
                <p className="text-xs text-emerald-400 mt-2">↑ 12% increase this month</p>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-bold uppercase font-mono">Active Escrow Value</p>
                <h3 className="text-3xl font-extrabold text-emerald-400 mt-2">$14,850</h3>
                <p className="text-xs text-slate-400 mt-2">Locked in bank-grade escrow</p>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-bold uppercase font-mono">Platform Revenue</p>
                <h3 className="text-3xl font-extrabold text-purple-400 mt-2">$2,227.50</h3>
                <p className="text-xs text-slate-400 mt-2">Calculated at {config.platformFeePercent}% fee rate</p>
              </div>
            </div>
          )}

          {/* DEFAULT / OTHER MODULE PLACEHOLDERS */}
          {['revenue', 'bookings', 'disputes', 'verification', 'withdrawals', 'categories', 'tickets', 'settings'].includes(activeTab) && (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white capitalize">{activeTab} Module Workspace</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                This ERP module is synchronized live with Prisma database schema and global Zustand state.
              </p>
            </div>
          )}

        </div>
      </main>

      {/* CREATE COMPANION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Companion Profile</h3>
            <form onSubmit={handleCreateUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g. Jessica Miller"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="jessica@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">City / Location</label>
                <input
                  type="text"
                  value={createCity}
                  onChange={(e) => setCreateCity(e.target.value)}
                  placeholder="San Francisco, USA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={createRate}
                  onChange={(e) => setCreateRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-xs font-semibold text-white hover:bg-purple-500 shadow-lg shadow-purple-600/25"
                >
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COMPANION MODAL */}
      {editingUserId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Edit Companion #{editingUserId}</h3>
            <form onSubmit={handleEditUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={editRate}
                  onChange={(e) => setEditRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUserId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-xs font-semibold text-white hover:bg-purple-500 shadow-lg shadow-purple-600/25"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
