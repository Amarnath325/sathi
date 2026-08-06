'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Sliders, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  ShieldAlert, 
  Scale, 
  Star, 
  MapPin, 
  Bell, 
  Tag, 
  TrendingUp, 
  UserCog, 
  Lock, 
  FileText, 
  Settings, 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  XCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Menu, 
  X, 
  ChevronLeft, 
  LogOut, 
  RefreshCw, 
  Percent, 
  CreditCard, 
  Send, 
  Zap, 
  Eye, 
  Server, 
  Database, 
  HardDrive, 
  Wifi, 
  Radio, 
  Shield, 
  Smartphone, 
  Globe, 
  UserX, 
  AlertCircle, 
  HelpCircle,
  FileSpreadsheet,
  Building2,
  SlidersHorizontal,
  Terminal,
  Sparkles,
  Layers,
  ArrowUpRight,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

import { useAdminStore } from '@/lib/adminStore';
import { useCrudStore, DynamicCompanionItem } from '@/lib/crudStore';
import { UniversalCrudToolbar } from '@/components/common/UniversalCrudToolbar';
import { MOCK_BOOKINGS, MOCK_KYC_QUEUE, MOCK_PANIC_ALERTS, MOCK_REVIEWS, MOCK_MESSAGES, MOCK_COMPANIONS } from '@/lib/mockData';
import { UserManagementModule } from '@/components/admin/UserManagementModule';
import { KycVerificationModule } from '@/components/admin/KycVerificationModule';
import { CompanionStatusBadge } from '@/components/companion/CompanionStatusBadge';
import { CompanionFormModal } from '@/components/companion/CompanionFormModal';
import { ImageLightboxModal } from '@/components/common/ImageLightboxModal';
import { CategoryCard } from '@/components/category/CategoryCard';
import { CategoryFormModal } from '@/components/category/CategoryFormModal';
import { CategoryDetailsModal } from '@/components/category/CategoryDetailsModal';
import { ServiceCategory } from '@/lib/types';
import Link from 'next/link';


export type ERPModuleTab = 
  | 'overview' 
  | 'users' 
  | 'verification' 
  | 'companions' 
  | 'categories' 
  | 'bookings' 
  | 'payments' 
  | 'communication' 
  | 'safety' 
  | 'disputes' 
  | 'reviews' 
  | 'location' 
  | 'notifications' 
  | 'promotions' 
  | 'analytics' 
  | 'staff' 
  | 'security' 
  | 'audit' 
  | 'settings' 
  | 'health';

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
    updateCategory,
    deleteCategory,
    toggleCategory,
    toggleCategoryFeatured,
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

  const [activeTab, setActiveTab] = useState<ERPModuleTab>('overview');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Category Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [viewingCategory, setViewingCategory] = useState<ServiceCategory | null>(null);

  // Admin User Session info
  const [adminUser, setAdminUser] = useState<{ email: string; fullName: string; role: string } | null>(null);

  useEffect(() => {
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

  // Reset sub-filter when active main module tab changes
  useEffect(() => {
    setSubFilter('all');
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  // View Trash state for Directory
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

  // Broadcast Notification Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastChannel, setBroadcastChannel] = useState<'PUSH' | 'EMAIL' | 'SMS'>('PUSH');

  const triggerNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Filtered Companion Directory based on Trash state & search query
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

  // 20 Core Admin ERP Modules Grouped Logically in Sidebar
  const sidebarGroups: SidebarGroup[] = [
    {
      groupTitle: '📊 DASHBOARD & CORE',
      items: [
        { id: 'overview', label: '📊 Executive Dashboard', icon: BarChart3 },
        { id: 'analytics', label: '📈 Analytics & Reports', icon: TrendingUp },
      ]
    },
    {
      groupTitle: '👥 USER & COMPANION MANAGEMENT',
      items: [
        { id: 'users', label: '👥 User Management', icon: Users, badge: `${companions.length}`, badgeColor: 'bg-indigo-500/20 text-indigo-300' },
        { id: 'verification', label: '🪪 Verification & KYC', icon: UserCheck, badge: `${MOCK_KYC_QUEUE.length} Pending`, badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'companions', label: '🤝 Companion Management', icon: ShieldCheck },
      ]
    },
    {
      groupTitle: '🛎️ CATALOG & BOOKINGS',
      items: [
        { id: 'categories', label: '🛎️ Services & Categories', icon: Sliders },
        { id: 'bookings', label: '📅 Booking Management', icon: Clock, badge: `${MOCK_BOOKINGS.length}`, badgeColor: 'bg-blue-500/20 text-blue-300' },
        { id: 'location', label: '📍 Location Management', icon: MapPin },
      ]
    },
    {
      groupTitle: '💰 FINANCE & REVENUE',
      items: [
        { id: 'payments', label: '💰 Payments & Finance', icon: DollarSign, badge: '$14.8k', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
        { id: 'promotions', label: '🎁 Promotions & Coupons', icon: Tag, badge: `${promos.length}`, badgeColor: 'bg-purple-500/20 text-purple-300' },
      ]
    },
    {
      groupTitle: '🛡️ TRUST, SAFETY & MODERATION',
      items: [
        { id: 'safety', label: '🛡️ Trust & Safety', icon: ShieldAlert, badge: `${MOCK_PANIC_ALERTS.length} Alerts`, badgeColor: 'bg-rose-500/20 text-rose-300 animate-pulse' },
        { id: 'disputes', label: '⚖️ Disputes & Resolution', icon: Scale },
        { id: 'reviews', label: '⭐ Reviews & Moderation', icon: Star },
        { id: 'communication', label: '💬 Communication', icon: MessageSquare },
      ]
    },
    {
      groupTitle: '⚙️ ADMINISTRATION & GOVERNANCE',
      items: [
        { id: 'notifications', label: '🔔 Notifications Engine', icon: Bell },
        { id: 'staff', label: '👨‍💼 Staff & Access Control', icon: UserCog },
        { id: 'security', label: '🔐 Security Center', icon: Lock },
        { id: 'audit', label: '📝 Audit Logs', icon: FileText },
        { id: 'settings', label: '⚙️ System Settings', icon: Settings },
        { id: 'health', label: '🔧 System Health', icon: Activity, badge: 'Operational', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
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
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">ERP v3.0</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Enterprise Admin Hub</p>
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
      <main className="flex-1 flex flex-col min-h-screen bg-slate-950">
        
        {/* Top ERP Header Navigation Bar */}
        <header className="h-20 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          
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
              <span className="text-purple-400 font-bold uppercase tracking-wider">{activeTab}</span>
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
                placeholder="Search across all modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Sync Button */}
            <button 
              onClick={() => triggerNotify('All 20 module parameters re-synced.')}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Sync State</span>
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

        {/* ERP Main Content Workspace */}
        <div className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8">

          {/* ==================================================== */}
          {/* MODULE 1: 📊 DASHBOARD                               */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs text-slate-400 font-bold uppercase font-mono">Total Companions</p>
                  <h3 className="text-3xl font-extrabold text-white mt-2">{companions.length}</h3>
                  <p className="text-xs text-emerald-400 mt-2">↑ 14% growth this month</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs text-slate-400 font-bold uppercase font-mono">Escrow Vault Held</p>
                  <h3 className="text-3xl font-extrabold text-emerald-400 mt-2">$14,850.00</h3>
                  <p className="text-xs text-slate-400 mt-2">Locked in bank-grade escrow</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs text-slate-400 font-bold uppercase font-mono">Platform Revenue</p>
                  <h3 className="text-3xl font-extrabold text-purple-400 mt-2">$2,970.00</h3>
                  <p className="text-xs text-slate-400 mt-2">At {config.platformFeePercent}% fee rate</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs text-slate-400 font-bold uppercase font-mono">System Risk Score</p>
                  <h3 className="text-3xl font-extrabold text-blue-400 mt-2">0.02 (Low)</h3>
                  <p className="text-xs text-emerald-400 mt-2">✓ AI Guard Active</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" /> Recent Booking Requests
                  </h3>
                  <div className="space-y-3">
                    {MOCK_BOOKINGS.map(b => (
                      <div key={b.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{b.bookingNumber} • {b.category}</p>
                          <p className="text-slate-400">{b.userName} ➔ {b.companionName}</p>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">${b.totalAmount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" /> Live Trust & Safety Alerts
                  </h3>
                  <div className="space-y-3">
                    {MOCK_PANIC_ALERTS.map(a => (
                      <div key={a.id} className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-rose-300">SOS Triggered: {a.userName}</p>
                          <p className="text-rose-400/80">{a.address}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px]">CRITICAL</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 2: 👥 USER MANAGEMENT                        */}
          {/* ==================================================== */}
          {activeTab === 'users' && <UserManagementModule />}


          {/* ==================================================== */}
          {/* MODULE 3: 🪪 VERIFICATION & KYC                      */}
          {/* ==================================================== */}
          {activeTab === 'verification' && <KycVerificationModule />}

          {/* ==================================================== */}
          {/* MODULE 4: 🤝 COMPANION MANAGEMENT                    */}
          {/* ==================================================== */}
          {activeTab === 'companions' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" /> Companion Management Hub
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage companion profiles, status toggles, rate caps, and verify KYC credentials.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/companion"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Globe className="w-4 h-4 text-indigo-400" /> View Public Directory
                  </Link>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-extrabold hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Companion Profile
                  </button>
                </div>
              </div>

              {/* Sub-Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
                {[
                  { id: 'all', label: 'All Companions', count: MOCK_COMPANIONS.length },
                  { id: 'companion-profiles', label: 'Profiles', count: MOCK_COMPANIONS.length },
                  { id: 'pending-approval', label: 'Pending Approval', count: MOCK_COMPANIONS.filter(c => c.status === 'PENDING_VERIFICATION').length },
                  { id: 'active-companions', label: 'Active Companions', count: MOCK_COMPANIONS.filter(c => c.status === 'ACTIVE').length },
                  { id: 'inactive', label: 'Inactive', count: MOCK_COMPANIONS.filter(c => c.status === 'INACTIVE').length },
                  { id: 'restricted', label: 'Restricted / Suspended', count: MOCK_COMPANIONS.filter(c => c.status === 'SUSPENDED').length },
                  { id: 'performance', label: 'Top Rated', count: MOCK_COMPANIONS.filter(c => c.ratingAvg >= 4.9).length },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSubFilter(s.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      subFilter === s.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${subFilter === s.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {s.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Filtered Companion Cards Grid */}
              {(() => {
                const list = MOCK_COMPANIONS.filter(c => {
                  if (subFilter === 'pending-approval') return c.status === 'PENDING_VERIFICATION';
                  if (subFilter === 'active-companions') return c.status === 'ACTIVE';
                  if (subFilter === 'inactive') return c.status === 'INACTIVE';
                  if (subFilter === 'restricted') return c.status === 'SUSPENDED';
                  if (subFilter === 'performance') return c.ratingAvg >= 4.9;
                  return true;
                }).filter(c => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.categories.some(cat => cat.toLowerCase().includes(q));
                });

                if (list.length === 0) {
                  return (
                    <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                      <Users className="w-10 h-10 text-slate-600 mx-auto" />
                      <h4 className="font-bold text-white text-base">No companion profiles in this filter</h4>
                      <p className="text-xs text-slate-400">Select another filter tab or add a new companion profile.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((comp) => (
                      <div key={comp.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all space-y-4 flex flex-col">
                        <div className="flex items-center gap-4">
                          <img
                            src={comp.avatar}
                            alt={comp.name}
                            onClick={() => setLightboxImage(comp.avatar)}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/30 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            title="Click to view image popup"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-white text-base truncate">{comp.name}, {comp.age}</h4>
                            </div>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" /> {comp.city}, {comp.country}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge & Rating */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                          {comp.status && <CompanionStatusBadge status={comp.status} size="md" />}
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" /> {comp.ratingAvg}
                            <span className="text-slate-500 text-[10px] font-normal">({comp.ratingCount})</span>
                          </div>
                        </div>

                        {/* Pricing & Bookings */}
                        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-mono">Hourly Rate</span>
                            <span className="font-mono font-bold text-emerald-400">${comp.hourlyRate}/hr</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-mono">Bookings</span>
                            <span className="font-bold text-white">{comp.completedBookings} Done</span>
                          </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-1">
                          {comp.categories.slice(0, 2).map((cat, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
                              {cat}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 mt-auto">
                          <Link
                            href={`/companion/${comp.id}`}
                            className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center transition-all"
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={() => toggleCompanionActive(comp.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                              comp.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            {comp.status === 'ACTIVE' ? 'Active' : 'Toggle Active'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 5: 🛎️ SERVICES & CATEGORIES                   */}
          {/* ==================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
                <div>
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" /> Service & Category Management Hub
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage service catalog, pricing multipliers, risk assessment levels & compliance rules ({categories.length} Total Categories)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/categories"
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    Public Catalog <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setIsCategoryModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs hover:opacity-90 shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add New Category
                  </button>
                </div>
              </div>

              {/* Sub-Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['categories', 'services', 'service-policies', 'pricing-rules', 'risk-levels'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubFilter(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${subFilter === s || (subFilter === 'all' && s === 'categories') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'}`}
                  >
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* SUB-VIEW 1: Category Cards Grid */}
              {(subFilter === 'categories' || subFilter === 'all') && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      isAdmin={true}
                      onEdit={(c) => {
                        setEditingCategory(c);
                        setIsCategoryModalOpen(true);
                      }}
                      onDelete={(id) => {
                        if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                          deleteCategory(id);
                          setNotification(`Category "${cat.name}" deleted.`);
                        }
                      }}
                      onToggleActive={(id) => {
                        toggleCategory(id);
                        setNotification(`Category status updated.`);
                      }}
                      onToggleFeatured={(id) => {
                        toggleCategoryFeatured(id);
                        setNotification(`Featured status toggled.`);
                      }}
                      onViewDetails={(c) => setViewingCategory(c)}
                    />
                  ))}
                </div>
              )}

              {/* SUB-VIEW 2: Flattened Services Table */}
              {subFilter === 'services' && (
                <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">All Sub-Service Offerings</h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {categories.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0)} Total Sub-Services
                    </span>
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-mono text-slate-400 uppercase">
                        <th className="py-3.5 px-4">Sub-Service Name</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Base Rate ($/hr)</th>
                        <th className="py-3.5 px-4">Verification Needed</th>
                        <th className="py-3.5 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {categories.flatMap(cat =>
                        (cat.subcategories || []).map(sub => (
                          <tr key={sub.id} className="hover:bg-slate-800/40">
                            <td className="py-3 px-4 font-bold text-white">{sub.name}</td>
                            <td className="py-3 px-4 text-indigo-400 font-semibold">{cat.name}</td>
                            <td className="py-3 px-4 font-mono font-bold text-emerald-400">${sub.basePrice}/hr</td>
                            <td className="py-3 px-4">
                              {sub.requiredVerification ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">Required</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">Optional</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{sub.description}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SUB-VIEW 3: Service Policies */}
              {subFilter === 'service-policies' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="font-bold text-white text-base flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-400" /> {cat.name} Policy
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-slate-300 font-mono text-[10px]">
                          Risk: {cat.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {cat.safetyPolicy || 'Standard public venue protocol applies with live GPS tracking.'}
                      </p>
                      <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                        <span>Min Companion Age: {cat.minAgeLimit}+</span>
                        <span>Emergency SOS Dispatch: Enabled</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-VIEW 4: Pricing Rules & Multipliers */}
              {subFilter === 'pricing-rules' && (
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Category Base Rate Multiplier Matrix</h4>
                      <p className="text-xs text-slate-400">Multipliers are applied to companion base rates during booking calculations.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white text-xs block">{cat.name}</span>
                          <span className="text-[10px] text-slate-400">{cat.companionCount} Companions</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-mono font-black text-emerald-400">{cat.baseRateMultiplier}x</span>
                          <span className="text-[10px] text-slate-500 block">Multiplier</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-VIEW 5: Risk Levels Matrix */}
              {subFilter === 'risk-levels' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {['LOW', 'MEDIUM', 'HIGH'].map((risk) => {
                    const matched = categories.filter(c => c.riskLevel === risk);
                    return (
                      <div key={risk} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <span className="font-black text-white text-sm tracking-wider uppercase">{risk} Risk Tier</span>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 font-mono text-[10px]">
                            {matched.length} Categories
                          </span>
                        </div>
                        <div className="space-y-2">
                          {matched.map(m => (
                            <div key={m.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-200">{m.name}</span>
                              <span className="text-slate-400 font-mono">{m.subcategories?.length || 0} Sub-services</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}


          {/* ==================================================== */}
          {/* MODULE 6: 📅 BOOKING MANAGEMENT                      */}
          {/* ==================================================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['all-bookings', 'pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-[11px] font-mono text-slate-400 uppercase">
                      <th className="py-4 px-5">Booking Ref</th>
                      <th className="py-4 px-5">Customer ➔ Companion</th>
                      <th className="py-4 px-5">Category</th>
                      <th className="py-4 px-5">Escrow Amount</th>
                      <th className="py-4 px-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs">
                    {MOCK_BOOKINGS.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/50">
                        <td className="py-4 px-5 font-mono font-bold text-purple-400">{b.bookingNumber}</td>
                        <td className="py-4 px-5 text-white">{b.userName} ➔ {b.companionName}</td>
                        <td className="py-4 px-5 text-slate-300">{b.category}</td>
                        <td className="py-4 px-5 font-mono font-bold text-emerald-400">${b.totalAmount}</td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 7: 💰 PAYMENTS & FINANCE                       */}
          {/* ==================================================== */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['transactions', 'payments', 'refunds', 'payouts', 'platform-fees', 'ledger', 'failed-payments', 'chargebacks'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400 font-mono">Platform Fee Rate</p>
                  <p className="text-2xl font-bold text-purple-400 mt-1">{config.platformFeePercent}%</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400 font-mono">Escrow Vault Reserve</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">$14,850.00</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400 font-mono">GST / VAT Rate</p>
                  <p className="text-2xl font-bold text-blue-400 mt-1">{config.gstTaxPercent}%</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 8: 💬 COMMUNICATION                           */}
          {/* ==================================================== */}
          {activeTab === 'communication' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['conversations', 'message-reports', 'flagged-messages', 'blocked-users'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" /> Monitored Live Encrypted Chat Streams
                </h3>
                <div className="space-y-3">
                  {MOCK_MESSAGES.map(m => (
                    <div key={m.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{m.senderName}: <span className="font-normal text-slate-300">{m.content}</span></p>
                        <p className="text-[10px] text-slate-500 mt-1">Timestamp: {m.timestamp} • End-to-End Encrypted</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">VERIFIED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 9: 🛡️ TRUST & SAFETY                         */}
          {/* ==================================================== */}
          {activeTab === 'safety' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['safety-dashboard', 'user-reports', 'safety-incidents', 'risk-alerts', 'fraud-detection', 'suspicious-accounts', 'emergency-events', 'safety-actions'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-4">
                <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" /> Active SOS Emergency Event Feed
                </h3>
                {MOCK_PANIC_ALERTS.map(a => (
                  <div key={a.id} className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">Panic Alert: {a.userName}</p>
                      <p className="text-xs text-rose-300">{a.address}</p>
                    </div>
                    <button onClick={() => triggerNotify(`SOS Dispatch Sent for Alert #${a.id}!`)} className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30">Dispatch Emergency Team</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 10: ⚖️ DISPUTES & RESOLUTION                  */}
          {/* ==================================================== */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['open-disputes', 'under-review', 'resolved', 'refund-cases', 'evidence'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <Scale className="w-10 h-10 text-purple-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Dispute Desk (0 Active Disputes)</h3>
                <p className="text-xs text-slate-400">All escrow transactions are currently smooth and dispute-free.</p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 11: ⭐ REVIEWS & MODERATION                   */}
          {/* ==================================================== */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['reviews', 'reported-reviews', 'flagged-content', 'moderation-queue'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {MOCK_REVIEWS.map(r => (
                  <div key={r.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{r.authorName}</span>
                        <span className="text-amber-400 font-bold">★ {r.rating}/5</span>
                      </div>
                      <p className="text-slate-300 mt-1">"{r.comment}"</p>
                    </div>
                    <button onClick={() => triggerNotify(`Review #${r.id} moderated.`)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white">Approve Review</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 12: 📍 LOCATION MANAGEMENT                   */}
          {/* ==================================================== */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['active-bookings', 'live-locations', 'location-alerts', 'location-history'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" /> Live GPS Companion Fleet Tracker
                </h3>
                <div className="h-64 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-slate-400 font-mono">
                  [ Live Interactive Geo-Map Simulation Active: 14 Companions Online in SF, NY & London ]
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 13: 🔔 NOTIFICATIONS                          */}
          {/* ==================================================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['push-notifications', 'email', 'sms', 'notification-templates', 'notification-logs'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-400" /> Broadcast System Notification
                </h3>
                <input type="text" placeholder="Title" value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-purple-500" />
                <textarea placeholder="Message body..." value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-purple-500 h-24" />
                <button onClick={() => { triggerNotify(`Broadcast sent via ${broadcastChannel}!`); setBroadcastTitle(''); setBroadcastMessage(''); }} className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-600/25">Send Broadcast Notification</button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 14: 🎁 PROMOTIONS                             */}
          {/* ==================================================== */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['coupons', 'promo-codes', 'campaigns', 'referral-program'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {promos.map(p => (
                  <div key={p.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-purple-400 text-sm">{p.code}</span>
                      <p className="text-xs text-slate-400">{p.discountPercent}% Discount</p>
                    </div>
                    <button onClick={() => togglePromoCode(p.id)} className={`px-3 py-1 rounded-full text-xs font-bold ${p.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{p.isActive ? 'Active' : 'Disabled'}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 15: 📈 ANALYTICS & REPORTS                     */}
          {/* ==================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['users-analytics', 'booking-analytics', 'revenue', 'companion-analytics', 'cancellation-analytics', 'safety-analytics', 'custom-reports'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <BarChart3 className="w-10 h-10 text-purple-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Executive BI Analytics Engine</h3>
                <p className="text-xs text-slate-400">Generating real-time cohorts, user retention curves & companion performance analytics.</p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 16: 👨‍💼 STAFF & ACCESS CONTROL                */}
          {/* ==================================================== */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['admin-users', 'roles', 'permissions', 'teams', 'login-sessions'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-purple-400" /> Admin Staff Roles & RBAC Matrix
                </h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">Executive Super Admin</p>
                      <p className="text-slate-400">admin@sathi.com</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">SUPER_ADMIN</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 17: 🔐 SECURITY                               */}
          {/* ==================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['security-events', 'login-attempts', 'suspicious-devices', 'api-activity', 'security-audit'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-400" /> Security Controls & 2FA Enforcement
                </h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <span>Enforce 2FA Mandatory for Admin Login</span>
                  <input type="checkbox" checked={config.require2FAForAdmin} onChange={e => updateConfig({ require2FAForAdmin: e.target.checked })} className="w-4 h-4 rounded text-purple-600" />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 18: 📝 AUDIT LOGS                             */}
          {/* ==================================================== */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" /> Immutable System Audit Logs
                </h3>
                <div className="space-y-2 font-mono text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span>[2026-08-05 10:45:12] ADMIN_LOGIN: User superadmin logged in from 192.168.1.1</span>
                    <span className="text-emerald-400">SUCCESS</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span>[2026-08-05 09:20:04] KYC_APPROVE: Approved Verification document doc-501</span>
                    <span className="text-emerald-400">SUCCESS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 19: ⚙️ SYSTEM SETTINGS                        */}
          {/* ==================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['general', 'booking', 'payment', 'cancellation', 'verification', 'safety', 'notifications', 'tax', 'localization'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" /> System Operational Parameters
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span>Maintenance Mode</span>
                    <input type="checkbox" checked={config.maintenanceMode} onChange={e => updateConfig({ maintenanceMode: e.target.checked })} />
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span>Auto SOS Dispatch</span>
                    <input type="checkbox" checked={config.autoSOSDispatch} onChange={e => updateConfig({ autoSOSDispatch: e.target.checked })} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 20: 🔧 SYSTEM HEALTH                          */}
          {/* ==================================================== */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['api-health', 'database', 'redis', 'queue', 'storage', 'payment-gateway', 'external-apis'].map((s) => (
                  <button key={s} onClick={() => setSubFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${subFilter === s ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'API Health (Next.js App Router)', status: 'Healthy (12ms latency)', icon: Server, color: 'text-emerald-400' },
                  { name: 'PostgreSQL Database (Prisma)', status: 'Connected (Pool: 10/10)', icon: Database, color: 'text-emerald-400' },
                  { name: 'Redis Cache & PubSub', status: 'Operational (0.4ms)', icon: Zap, color: 'text-emerald-400' },
                  { name: 'Background BullMQ Queue', status: '0 Jobs Waiting', icon: Activity, color: 'text-blue-400' },
                  { name: 'Cloud File Storage (AWS S3)', status: 'Operational', icon: HardDrive, color: 'text-emerald-400' },
                  { name: 'Payment Gateways (Stripe/Razorpay)', status: 'Live & Accepting', icon: CreditCard, color: 'text-emerald-400' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{item.status}</p>
                    </div>
                  );
                })}
              </div>
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

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={!!lightboxImage}
        imageUrl={lightboxImage}
        title="Enlarged Image Preview"
        onClose={() => setLightboxImage(null)}
      />

      {/* Category Form Modal (Add / Edit) */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={(catData) => {
          if (catData.id) {
            updateCategory(catData.id, catData);
            setNotification(`Category "${catData.name}" updated successfully.`);
          } else {
            addCategory(catData);
            setNotification(`Category "${catData.name}" created successfully.`);
          }
        }}
      />

      {/* Category Details Modal */}
      <CategoryDetailsModal
        isOpen={!!viewingCategory}
        category={viewingCategory}
        onClose={() => setViewingCategory(null)}
      />

    </div>
  );
}

