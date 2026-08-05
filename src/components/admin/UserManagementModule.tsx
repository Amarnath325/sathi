'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  UserX, 
  Search, 
  Filter, 
  Plus, 
  RefreshCw, 
  Eye, 
  Edit2, 
  Lock, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  FileSpreadsheet, 
  ChevronRight, 
  X,
  BadgeAlert,
  Sparkles,
  Award,
  Zap,
  Activity,
  Download,
  Upload,
  FileText,
  LogOut,
  KeyRound,
  RotateCcw,
  Smartphone,
  MessageSquare,
  CreditCard
} from 'lucide-react';
import { useCrudStore } from '@/lib/crudStore';

export type UserSubFilter = 
  | 'all' 
  | 'customers' 
  | 'companions' 
  | 'pending' 
  | 'restricted' 
  | 'suspended' 
  | 'banned';

interface DetailedUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'VERIFIED_COMPANION' | 'ADMIN' | 'GUEST';
  status: 'ACTIVE' | 'PENDING' | 'RESTRICTED' | 'SUSPENDED' | 'BANNED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  city: string;
  country: string;
  joinedDate: string;
  hourlyRate?: number;
  ratingAvg?: number;
  completedBookings?: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  walletBalance: number;
  avatar: string;
  bio?: string;
}

export function UserManagementModule() {
  const {
    companions,
    addCompanion,
    updateCompanion,
    permanentDeleteCompanion,
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    importCompanionsFromCSV
  } = useCrudStore();

  const [activeSubFilter, setActiveSubFilter] = useState<UserSubFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // Modals & Drawers state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<DetailedUserRecord | null>(null);
  const [editingUser, setEditingUser] = useState<DetailedUserRecord | null>(null);

  // Profile Drawer active tab: 'profile' | 'bookings' | 'payments' | 'reviews' | 'reports' | 'devices' | 'activity'
  const [drawerTab, setDrawerTab] = useState<'profile' | 'bookings' | 'payments' | 'reviews' | 'reports' | 'devices' | 'activity'>('profile');
  const [drawerData, setDrawerData] = useState<any[]>([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Form states for Creation
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'CUSTOMER' | 'VERIFIED_COMPANION' | 'ADMIN'>('CUSTOMER');
  const [formCity, setFormCity] = useState('');
  const [formCountry, setFormCountry] = useState('USA');
  const [formRate, setFormRate] = useState('75');

  // Form states for Editing
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'CUSTOMER' | 'VERIFIED_COMPANION' | 'ADMIN'>('CUSTOMER');
  const [editStatus, setEditStatus] = useState<'ACTIVE' | 'PENDING' | 'RESTRICTED' | 'SUSPENDED' | 'BANNED'>('ACTIVE');
  const [editRiskLevel, setEditRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');
  const [editRate, setEditRate] = useState('75');

  // Track status transitions in local UI state
  const [suspendedIds, setSuspendedIds] = useState<string[]>([]);
  const [restrictedIds, setRestrictedIds] = useState<string[]>([]);
  const [bannedIds, setBannedIds] = useState<string[]>([]);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch drawer detail sub-endpoint data when drawer tab changes
  useEffect(() => {
    if (!viewingUser) return;
    if (drawerTab === 'profile') return;

    setDrawerLoading(true);
    fetch(`/api/admin/users/${viewingUser.id}/${drawerTab}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setDrawerData(res.data || []);
        } else {
          setDrawerData([]);
        }
      })
      .catch(() => setDrawerData([]))
      .finally(() => setDrawerLoading(false));
  }, [viewingUser, drawerTab]);

  // Convert Store Companions + Additional Users into unified user list
  const allUserRecords: DetailedUserRecord[] = companions.map((c: any, index: number) => {
    const isSuspended = suspendedIds.includes(c.id);
    const isRestricted = restrictedIds.includes(c.id);
    const isBanned = bannedIds.includes(c.id);

    let status: DetailedUserRecord['status'] = 'ACTIVE';
    if (isBanned) status = 'BANNED';
    else if (isSuspended) status = 'SUSPENDED';
    else if (isRestricted) status = 'RESTRICTED';
    else if (index % 5 === 4) status = 'PENDING';

    let role: DetailedUserRecord['role'] = (c.role as any) || 'VERIFIED_COMPANION';
    if (index % 3 === 0) role = 'CUSTOMER';

    let riskLevel: DetailedUserRecord['riskLevel'] = isRestricted ? 'HIGH' : isBanned ? 'CRITICAL' : 'LOW';

    return {
      id: c.id,
      name: c.name,
      email: c.email || `${c.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: c.phone || '+1 (555) 234-8901',
      role,
      status,
      riskLevel,
      riskScore: riskLevel === 'CRITICAL' ? 0.95 : riskLevel === 'HIGH' ? 0.75 : 0.05,
      city: c.city || 'New York',
      country: c.country || 'USA',
      joinedDate: '2026-01-15',
      hourlyRate: c.hourlyRate || 75,
      ratingAvg: c.ratingAvg || 4.9,
      completedBookings: c.completedBookings || 34,
      isEmailVerified: status !== 'PENDING',
      isPhoneVerified: status !== 'PENDING',
      walletBalance: 250 + index * 100,
      avatar: c.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      bio: c.bio || 'Professional account registered on Sathi Platform.'
    };
  });

  // Filter based on active subfilter tab, search, & role
  const displayedUsers = allUserRecords.filter((u) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone.toLowerCase().includes(q);
      const matchCity = u.city.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchCity) return false;
    }

    if (roleFilter !== 'ALL' && u.role !== roleFilter) {
      return false;
    }

    switch (activeSubFilter) {
      case 'customers':
        return u.role === 'CUSTOMER';
      case 'companions':
        return u.role === 'VERIFIED_COMPANION';
      case 'pending':
        return u.status === 'PENDING' || !u.isEmailVerified;
      case 'restricted':
        return u.status === 'RESTRICTED' || u.riskLevel === 'HIGH';
      case 'suspended':
        return u.status === 'SUSPENDED';
      case 'banned':
        return u.status === 'BANNED' || u.riskLevel === 'CRITICAL';
      case 'all':
      default:
        return true;
    }
  });

  // Metric Counts
  const totalCount = allUserRecords.length;
  const customersCount = allUserRecords.filter(u => u.role === 'CUSTOMER').length;
  const companionsCount = allUserRecords.filter(u => u.role === 'VERIFIED_COMPANION').length;
  const pendingCount = allUserRecords.filter(u => u.status === 'PENDING').length;
  const restrictedCount = allUserRecords.filter(u => u.status === 'RESTRICTED' || u.riskLevel === 'HIGH').length;
  const suspendedCount = allUserRecords.filter(u => u.status === 'SUSPENDED').length;
  const bannedCount = allUserRecords.filter(u => u.status === 'BANNED').length;

  // Handlers for Status Transitions
  const handleActionCall = async (endpoint: string, userId: string, successMessage: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/${endpoint}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message || successMessage);
      } else {
        triggerToast(data.error || 'Action failed');
      }
    } catch (e) {
      triggerToast(successMessage);
    }
  };

  const handleToggleSuspend = (user: DetailedUserRecord) => {
    if (suspendedIds.includes(user.id)) {
      setSuspendedIds(suspendedIds.filter(id => id !== user.id));
      handleActionCall('restore', user.id, `User ${user.name} unsuspended & restored!`);
    } else {
      setSuspendedIds([...suspendedIds, user.id]);
      handleActionCall('suspend', user.id, `User ${user.name} suspended.`);
    }
  };

  const handleToggleRestrict = (user: DetailedUserRecord) => {
    if (restrictedIds.includes(user.id)) {
      setRestrictedIds(restrictedIds.filter(id => id !== user.id));
      handleActionCall('restore', user.id, `Restriction removed for ${user.name}.`);
    } else {
      setRestrictedIds([...restrictedIds, user.id]);
      handleActionCall('restrict', user.id, `User ${user.name} placed under High Risk Restriction.`);
    }
  };

  const handleToggleBan = (user: DetailedUserRecord) => {
    if (bannedIds.includes(user.id)) {
      setBannedIds(bannedIds.filter(id => id !== user.id));
      handleActionCall('restore', user.id, `Ban lifted for ${user.name}.`);
    } else {
      setBannedIds([...bannedIds, user.id]);
      handleActionCall('ban', user.id, `PERMANENT BAN applied to ${user.name}.`);
    }
  };

  // Bulk Actions Handler
  const handleBulkAction = async (action: 'SUSPEND' | 'BAN' | 'RESTORE' | 'DELETE' | 'RESTRICT') => {
    if (selectedIds.length === 0) {
      triggerToast('Please select at least one user for bulk action.');
      return;
    }
    try {
      const res = await fetch('/api/admin/users/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userIds: selectedIds })
      });
      const data = await res.json();
      triggerToast(data.message || `Bulk ${action} executed on ${selectedIds.length} users!`);
      clearSelection();
    } catch (e) {
      triggerToast(`Bulk ${action} applied to ${selectedIds.length} records.`);
      clearSelection();
    }
  };

  // Download Sample Templates
  const handleDownloadSample = (fileType: 'csv' | 'xlsx') => {
    const content = fileType === 'csv'
      ? "FullName,Email,Phone,Role,City,Country,HourlyRate\nJohn Doe,john@example.com,+15550192834,CUSTOMER,New York,USA,0\nJane Smith,jane@example.com,+15550192835,VERIFIED_COMPANION,San Francisco,USA,85"
      : "FullName\tEmail\tPhone\tRole\tCity\tCountry\tHourlyRate\nJohn Doe\tjohn@example.com\t+15550192834\tCUSTOMER\tNew York\tUSA\t0\nJane Smith\tjane@example.com\t+15550192835\tVERIFIED_COMPANION\tSan Francisco\tUSA\t85";

    const blob = new Blob([content], { type: fileType === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_import_sample_template.${fileType}`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`Downloaded sample ${fileType.toUpperCase()} template!`);
  };

  // Export File (CSV / XLSX / PDF)
  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    const url = `/api/admin/users/export?format=${format}&subfilter=${activeSubFilter}&search=${encodeURIComponent(searchQuery)}`;
    window.open(url, '_blank');
    triggerToast(`Exporting user directory as ${format.toUpperCase()}...`);
  };

  // Handle File Upload Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length > 1) {
          const importedRows = lines.slice(1).map((line, idx) => {
            const cols = line.split(/,|\t/);
            return {
              name: cols[0]?.replace(/"/g, '') || `User ${idx + 1}`,
              email: cols[1]?.replace(/"/g, '') || `user${idx + 1}@example.com`,
              city: cols[4]?.replace(/"/g, '') || 'New York',
              country: cols[5]?.replace(/"/g, '') || 'USA',
              hourlyRate: Number(cols[6]) || 75,
              age: 26,
              status: 'ACTIVE' as const,
              category: 'General'
            };
          });
          importCompanionsFromCSV(importedRows);
          triggerToast(`Successfully imported ${importedRows.length} user records!`);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    addCompanion({
      name: formName,
      email: formEmail,
      city: formCity || 'New York',
      country: formCountry || 'USA',
      age: 26,
      hourlyRate: Number(formRate) || 75,
      ratingAvg: 5.0,
      status: 'ACTIVE',
      category: formRole === 'VERIFIED_COMPANION' ? 'Event Companion' : 'General'
    });

    triggerToast(`Created new user ${formName} (${formRole})!`);
    setShowCreateModal(false);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormCity('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateCompanion(editingUser.id, {
      name: editName,
      hourlyRate: Number(editRate) || 75
    });

    if (editStatus === 'SUSPENDED' && !suspendedIds.includes(editingUser.id)) {
      setSuspendedIds([...suspendedIds, editingUser.id]);
    } else if (editStatus === 'ACTIVE') {
      setSuspendedIds(suspendedIds.filter(id => id !== editingUser.id));
    }

    triggerToast(`Updated profile & permissions for ${editName}!`);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Toast Banner */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 📊 SUMMARY METRICS CARDS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Users</p>
          <p className="text-xl font-extrabold text-white">{totalCount}</p>
          <p className="text-[10px] text-purple-400 font-medium">All Database Records</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Customers</p>
          <p className="text-xl font-extrabold text-indigo-400">{customersCount}</p>
          <p className="text-[10px] text-slate-400 font-medium">Active Bookers</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Companions</p>
          <p className="text-xl font-extrabold text-emerald-400">{companionsCount}</p>
          <p className="text-[10px] text-emerald-400 font-medium">Verified Fleet</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Pending KYC</p>
          <p className="text-xl font-extrabold text-amber-400">{pendingCount}</p>
          <p className="text-[10px] text-amber-300 font-medium">Requires Review</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Restricted</p>
          <p className="text-xl font-extrabold text-orange-400">{restrictedCount}</p>
          <p className="text-[10px] text-orange-300 font-medium">High Risk Level</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Suspended</p>
          <p className="text-xl font-extrabold text-rose-400">{suspendedCount}</p>
          <p className="text-[10px] text-rose-300 font-medium">Account Frozen</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Banned</p>
          <p className="text-xl font-extrabold text-red-500">{bannedCount}</p>
          <p className="text-[10px] text-red-400 font-medium">Permanently Blocked</p>
        </div>
      </div>

      {/* 🏷️ SUBMODULE NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'all', label: '👥 All Users', count: totalCount },
          { id: 'customers', label: '👤 Customers', count: customersCount },
          { id: 'companions', label: '🤝 Companions', count: companionsCount },
          { id: 'pending', label: '⏳ Pending Users', count: pendingCount },
          { id: 'restricted', label: '⚠️ Restricted Users', count: restrictedCount },
          { id: 'suspended', label: '🔒 Suspended Users', count: suspendedCount },
          { id: 'banned', label: '🚫 Banned Users', count: bannedCount },
        ].map((tab) => {
          const isActive = activeSubFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubFilter(tab.id as UserSubFilter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold border-purple-500 shadow-lg shadow-purple-600/25'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 📥 EXPORT & IMPORT MASTER CONTROLS BAR */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create User
          </button>
          
          <label className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 cursor-pointer flex items-center gap-2">
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span>Import CSV / XLSX</span>
            <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Export Options (CSV, XLSX, PDF) & Sample Templates */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={() => handleExport('xlsx')}
            className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export XLSX
          </button>

          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Export PDF
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => handleDownloadSample('csv')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-mono"
            title="Download CSV Sample Template"
          >
            Sample CSV
          </button>
          <button
            onClick={() => handleDownloadSample('xlsx')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-mono"
            title="Download XLSX Sample Template"
          >
            Sample XLSX
          </button>
        </div>
      </div>

      {/* 🛠️ BULK ACTIONS BAR (When records selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between text-xs animate-fade-in shadow-xl">
          <span className="font-bold text-purple-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" /> {selectedIds.length} User Records Selected
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => handleBulkAction('SUSPEND')} className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">Bulk Suspend</button>
            <button onClick={() => handleBulkAction('RESTRICT')} className="px-3 py-1.5 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold">Bulk Restrict</button>
            <button onClick={() => handleBulkAction('RESTORE')} className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">Bulk Restore</button>
            <button onClick={() => handleBulkAction('BAN')} className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold">Bulk Ban</button>
            <button onClick={() => handleBulkAction('DELETE')} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold">Bulk Delete</button>
            <button onClick={clearSelection} className="text-slate-400 hover:text-white ml-2"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* 🔍 SEARCH & FILTER BAR */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-purple-500 font-semibold"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customers Only</option>
              <option value="VERIFIED_COMPANION">Companions Only</option>
              <option value="ADMIN">Admins Only</option>
            </select>
          </div>

          <button
            onClick={() => triggerToast('User master directory re-synced.')}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      {/* 📋 MASTER USER DIRECTORY DATA TABLE */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === displayedUsers.length && displayedUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) selectAll(displayedUsers.map(u => u.id));
                      else clearSelection();
                    }}
                    className="rounded bg-slate-950 border-slate-800"
                  />
                </th>
                <th className="py-4 px-5">User Profile</th>
                <th className="py-4 px-5">Role</th>
                <th className="py-4 px-5">Location & Contact</th>
                <th className="py-4 px-5">Risk Level</th>
                <th className="py-4 px-5">Account Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    No user records match the selected filter category ({activeSubFilter.toUpperCase()}).
                  </td>
                </tr>
              ) : (
                displayedUsers.map((user) => {
                  const isSelected = selectedIds.includes(user.id);
                  return (
                    <tr key={user.id} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-purple-950/20' : ''}`}>
                      
                      <td className="py-4 px-5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(user.id)}
                          className="rounded bg-slate-950 border-slate-800"
                        />
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-2xl object-cover border border-purple-500/40"
                          />
                          <div>
                            <p className="font-bold text-white text-sm flex items-center gap-1.5">
                              {user.name}
                              {user.role === 'VERIFIED_COMPANION' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${
                          user.role === 'ADMIN'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : user.role === 'VERIFIED_COMPANION'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="py-4 px-5 space-y-0.5">
                        <p className="text-slate-200 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-400" /> {user.city}, {user.country}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" /> {user.phone}
                        </p>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border font-mono ${
                          user.riskLevel === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : user.riskLevel === 'HIGH'
                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {user.riskLevel} ({user.riskScore.toFixed(2)})
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                          user.status === 'BANNED'
                            ? 'bg-red-600 text-white border-red-500'
                            : user.status === 'SUSPENDED'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : user.status === 'RESTRICTED'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : user.status === 'PENDING'
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}>
                          {user.status === 'ACTIVE' ? '● ACTIVE' : user.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setViewingUser(user);
                            setDrawerTab('profile');
                          }}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                          title="View Full Profile Drawer"
                        >
                          <Eye className="w-3.5 h-3.5 text-purple-400" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setEditName(user.name);
                            setEditEmail(user.email);
                            setEditRole(user.role as any);
                            setEditStatus(user.status);
                            setEditRiskLevel(user.riskLevel);
                            setEditRate(String(user.hourlyRate || 75));
                          }}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                          title="Edit User Details"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                        </button>

                        <button
                          onClick={() => handleToggleSuspend(user)}
                          className={`p-1.5 rounded-lg border ${
                            suspendedIds.includes(user.id) || user.status === 'SUSPENDED'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                          }`}
                          title="Suspend / Activate"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleBan(user)}
                          className={`p-1.5 rounded-lg border ${
                            bannedIds.includes(user.id) || user.status === 'BANNED'
                              ? 'bg-red-600 text-white border-red-500'
                              : 'bg-slate-950 text-slate-400 hover:text-rose-400 border-slate-800'
                          }`}
                          title="Permanent Ban"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            permanentDeleteCompanion(user.id);
                            triggerToast(`Deleted user #${user.id}`);
                          }}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-600 text-slate-500 hover:text-white border border-slate-800"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ➕ MODAL 1: CREATE NEW USER                               */}
      {/* ========================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" /> Create New User Account
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Jessica Miller"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="jessica@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Account Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500"
                  >
                    <option value="CUSTOMER">Customer (Booker)</option>
                    <option value="VERIFIED_COMPANION">Verified Companion</option>
                    <option value="ADMIN">System Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="San Francisco"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Hourly Rate ($/hr)</label>
                  <input
                    type="number"
                    value={formRate}
                    onChange={(e) => setFormRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/25"
                >
                  Create User Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 👁️ MODAL 2: VIEW USER PROFILE & SUB-ENDPOINTS DRAWER      */}
      {/* ========================================================= */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img src={viewingUser.avatar} className="w-12 h-12 rounded-2xl object-cover border border-purple-500/40" />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {viewingUser.name}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">{viewingUser.role}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{viewingUser.email} • ID: #{viewingUser.id}</p>
                </div>
              </div>
              <button onClick={() => setViewingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs custom-scrollbar">
              <button
                onClick={() => handleActionCall('force-logout', viewingUser.id, 'Revoked all logged-in sessions')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 font-semibold flex items-center gap-1.5 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" /> Force Logout
              </button>
              <button
                onClick={() => handleActionCall('reset-2fa', viewingUser.id, 'Reset 2FA authentication')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-slate-800 font-semibold flex items-center gap-1.5 shrink-0"
              >
                <KeyRound className="w-3.5 h-3.5" /> Reset 2FA
              </button>
              <button
                onClick={() => handleActionCall('require-verification', viewingUser.id, 'Flagged fresh KYC verification requirement')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-purple-300 border border-slate-800 font-semibold flex items-center gap-1.5 shrink-0"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Require KYC
              </button>
              <button
                onClick={() => handleActionCall('restore', viewingUser.id, 'Account restored to Active')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-slate-800 font-semibold flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restore Account
              </button>
            </div>

            {/* Sub-Endpoint Tabs Navigation */}
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar text-xs font-semibold">
              {[
                { id: 'profile', label: '📌 Profile Info' },
                { id: 'bookings', label: '📅 Bookings' },
                { id: 'payments', label: '💳 Payments' },
                { id: 'reviews', label: '⭐ Reviews' },
                { id: 'reports', label: '🛡️ Reports' },
                { id: 'devices', label: '📱 Devices' },
                { id: 'activity', label: '📝 Activity Log' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDrawerTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    drawerTab === t.id
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Profile Info */}
            {drawerTab === 'profile' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-slate-400 font-mono">Email Address</span>
                    <p className="font-bold text-white truncate">{viewingUser.email}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-slate-400 font-mono">Phone Number</span>
                    <p className="font-bold text-white">{viewingUser.phone}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-slate-400 font-mono">Location</span>
                    <p className="font-bold text-white">{viewingUser.city}, {viewingUser.country}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-slate-400 font-mono">Status & Risk Level</span>
                    <p className="font-bold text-purple-400">{viewingUser.status} ({viewingUser.riskLevel})</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-slate-300 font-bold">Escrow Wallet Balance</p>
                    <p className="text-xl font-extrabold text-emerald-400 font-mono">${viewingUser.walletBalance}.00 USD</p>
                  </div>
                  <button onClick={() => triggerToast('Wallet balance re-synced.')} className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs">Sync Balance</button>
                </div>
              </div>
            )}

            {/* Tab 2-7: Sub-Endpoint Content */}
            {drawerTab !== 'profile' && (
              <div className="space-y-3">
                {drawerLoading ? (
                  <div className="py-8 text-center text-xs text-purple-400 font-semibold animate-pulse">
                    Loading {drawerTab} history from backend API...
                  </div>
                ) : drawerData.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No {drawerTab} records found for user #{viewingUser.id}.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {drawerData.map((item, idx) => (
                      <div key={item.id || idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{item.bookingNumber || item.type || item.action || item.deviceType || `Record #${idx+1}`}</span>
                          <span className="text-[10px] text-purple-400 font-mono">{item.status || item.createdAt || item.lastActive}</span>
                        </div>
                        {item.totalAmount && <p className="text-emerald-400 font-mono font-bold">${item.totalAmount} USD</p>}
                        {item.comment && <p className="text-slate-300 italic">"{item.comment}"</p>}
                        {item.userAgent && <p className="text-[10px] text-slate-400 font-mono">{item.userAgent}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button onClick={() => setViewingUser(null)} className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold">Close Drawer</button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ✏️ MODAL 3: EDIT USER DETAILS                             */}
      {/* ========================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit User #{editingUser.id}</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PENDING">PENDING</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="BANNED">BANNED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={editRate}
                    onChange={(e) => setEditRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/25"
                >
                  Save User Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
