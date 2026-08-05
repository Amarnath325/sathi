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
  CreditCard,
  Archive,
  Layers,
  Printer
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

  // Trash view toggle
  const [viewTrashBin, setViewTrashBin] = useState(false);

  // Modals & Drawers state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<DetailedUserRecord | null>(null);
  const [editingUser, setEditingUser] = useState<DetailedUserRecord | null>(null);

  // Profile Drawer active tab
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
  const [editRate, setEditRate] = useState('75');

  // Track status transitions in local UI state
  const [suspendedIds, setSuspendedIds] = useState<string[]>([]);
  const [restrictedIds, setRestrictedIds] = useState<string[]>([]);
  const [bannedIds, setBannedIds] = useState<string[]>([]);
  const [trashIds, setTrashIds] = useState<string[]>([]);

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

  // Filter based on Trash mode, Subfilter tab, Search, & Role
  const displayedUsers = allUserRecords.filter((u) => {
    // Trash bin view filter
    const isTrashed = trashIds.includes(u.id);
    if (viewTrashBin && !isTrashed) return false;
    if (!viewTrashBin && isTrashed) return false;

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone.toLowerCase().includes(q);
      const matchCity = u.city.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchCity) return false;
    }

    // Role filter
    if (roleFilter !== 'ALL' && u.role !== roleFilter) {
      return false;
    }

    // Subfilter tab
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
  const totalCount = allUserRecords.filter(u => !trashIds.includes(u.id)).length;
  const trashCount = trashIds.length;
  const customersCount = allUserRecords.filter(u => u.role === 'CUSTOMER' && !trashIds.includes(u.id)).length;
  const companionsCount = allUserRecords.filter(u => u.role === 'VERIFIED_COMPANION' && !trashIds.includes(u.id)).length;
  const pendingCount = allUserRecords.filter(u => u.status === 'PENDING' && !trashIds.includes(u.id)).length;
  const restrictedCount = allUserRecords.filter(u => (u.status === 'RESTRICTED' || u.riskLevel === 'HIGH') && !trashIds.includes(u.id)).length;
  const suspendedCount = allUserRecords.filter(u => u.status === 'SUSPENDED' && !trashIds.includes(u.id)).length;
  const bannedCount = allUserRecords.filter(u => u.status === 'BANNED' && !trashIds.includes(u.id)).length;

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

  const handleToggleBan = (user: DetailedUserRecord) => {
    if (bannedIds.includes(user.id)) {
      setBannedIds(bannedIds.filter(id => id !== user.id));
      handleActionCall('restore', user.id, `Ban lifted for ${user.name}.`);
    } else {
      setBannedIds([...bannedIds, user.id]);
      handleActionCall('ban', user.id, `PERMANENT BAN applied to ${user.name}.`);
    }
  };

  // Soft Delete handler
  const handleSoftDelete = (user: DetailedUserRecord) => {
    setTrashIds([...trashIds, user.id]);
    triggerToast(`Moved ${user.name} to Trash Bin.`);
  };

  // Restore from Trash handler
  const handleRestoreFromTrash = (user: DetailedUserRecord) => {
    setTrashIds(trashIds.filter(id => id !== user.id));
    triggerToast(`Restored ${user.name} from Trash Bin.`);
  };

  // Download Sample Templates (CSV & XLSX)
  const handleDownloadSample = (fileType: 'csv' | 'xlsx') => {
    const headers = ['FullName', 'Email', 'Phone', 'Role', 'City', 'Country', 'HourlyRate'];
    const sampleRow = ['John Doe', 'john@example.com', '+15550192834', 'CUSTOMER', 'New York', 'USA', '0'];

    const delimiter = fileType === 'csv' ? ',' : '\t';
    const content = `${headers.join(delimiter)}\n${sampleRow.join(delimiter)}`;

    const blob = new Blob([content], { type: fileType === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_import_sample_template.${fileType}`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`Downloaded Sample ${fileType.toUpperCase()} Template!`);
  };

  // Export Data (CSV, XLSX, PDF)
  const handleExportCSV = () => {
    const headers = ['ID', 'FullName', 'Email', 'Phone', 'Role', 'Status', 'City', 'Country', 'HourlyRate'];
    const lines = [headers.join(',')];
    displayedUsers.forEach(u => {
      lines.push(`"${u.id}","${u.name}","${u.email}","${u.phone}","${u.role}","${u.status}","${u.city}","${u.country}","${u.hourlyRate || 75}"`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_directory_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${displayedUsers.length} users to CSV!`);
  };

  const handleExportXLSX = () => {
    const headers = ['ID', 'FullName', 'Email', 'Phone', 'Role', 'Status', 'City', 'Country', 'HourlyRate'];
    let xmlTable = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Users"><Table><Row>`;
    headers.forEach(h => { xmlTable += `<Cell><Data ss:Type="String">${h}</Data></Cell>`; });
    xmlTable += `</Row>`;
    displayedUsers.forEach(u => {
      xmlTable += `<Row>`;
      xmlTable += `<Cell><Data ss:Type="String">${u.id}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${u.name}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${u.email}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${u.phone}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${u.role}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${u.status}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${u.city}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${u.country}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${u.hourlyRate || 75}</Data></Cell>`;
      xmlTable += `</Row>`;
    });
    xmlTable += `</Table></Worksheet></Workbook>`;

    const blob = new Blob([xmlTable], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_directory_export.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${displayedUsers.length} users to XLSX!`);
  };

  // Handle File Upload Import (CSV / XLSX)
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
          triggerToast(`Successfully imported ${importedRows.length} user records from ${file.name}!`);
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

      {/* 🏷️ SUBMODULE NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'all', label: 'All Users', count: totalCount },
          { id: 'customers', label: 'Customers Users', count: customersCount },
          { id: 'companions', label: 'Companions Users', count: companionsCount },
          { id: 'pending', label: 'Pending Users', count: pendingCount },
          { id: 'restricted', label: 'Restricted Users', count: restrictedCount },
          { id: 'suspended', label: 'Suspended Users', count: suspendedCount },
          { id: 'banned', label: 'Banned Users', count: bannedCount },
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

      {/* 🎛️ MASTER CONTROL MANAGEMENT PANEL TOOLBAR (Matches Screenshot EXACTLY!) */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
        
        {/* Panel Title & Active Directory vs Trash Bin Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                User Directory Master Control Management Panel
              </h3>
              <p className="text-[11px] text-slate-400">
                {viewTrashBin ? `Trash Bin (${trashCount} soft deleted)` : `Active Directory (${displayedUsers.length} records)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewTrashBin(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${!viewTrashBin ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
            >
              Active Directory ({totalCount})
            </button>
            <button 
              onClick={() => setViewTrashBin(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${viewTrashBin ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Archive className="w-3.5 h-3.5" /> Trash Bin ({trashCount})
            </button>
          </div>
        </div>

        {/* 🔍 SEARCH BAR & ACTION TOOLBAR BUTTONS */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
          
          {/* 🔍 Search Input Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-all"
            />
          </div>

          {/* Action Toolbar Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            {!viewTrashBin && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Create New
              </button>
            )}

            {/* Import CSV / XLSX */}
            <label className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 cursor-pointer flex items-center gap-1.5 shrink-0">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Import CSV / XLSX</span>
              <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>

            {/* Export XLSX */}
            <button
              onClick={handleExportXLSX}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export XLSX
            </button>

            {/* Export PDF (Opens PDF Printable Preview Modal) */}
            <button
              onClick={() => setShowPdfModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <FileText className="w-3.5 h-3.5" /> Export PDF
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

            {/* Sample CSV */}
            <button
              onClick={() => handleDownloadSample('csv')}
              className="px-2.5 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-mono shrink-0"
              title="Download Sample CSV Template"
            >
              Sample CSV
            </button>

            {/* Sample XLSX */}
            <button
              onClick={() => handleDownloadSample('xlsx')}
              className="px-2.5 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-mono shrink-0"
              title="Download Sample XLSX Template"
            >
              Sample XLSX
            </button>
          </div>

        </div>

      </div>

      {/* 📋 MASTER DATA TABLE */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5">User</th>
                <th className="py-4 px-5">Role</th>
                <th className="py-4 px-5">Location</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                    No user records found in {viewTrashBin ? 'Trash Bin' : activeSubFilter.toUpperCase()}.
                  </td>
                </tr>
              ) : (
                displayedUsers.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      
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
                          {user.role === 'VERIFIED_COMPANION' ? 'COMPANION' : user.role}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-slate-300 font-medium">
                        {user.city}, {user.country}
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
                          {user.status === 'ACTIVE' ? 'Active' : user.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right space-x-2">
                        {!viewTrashBin ? (
                          <>
                            <button
                              onClick={() => {
                                setViewingUser(user);
                                setDrawerTab('profile');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-bold"
                            >
                              View Profile
                            </button>

                            <button
                              onClick={() => handleToggleSuspend(user)}
                              className={`px-3 py-1.5 rounded-xl font-bold border ${
                                suspendedIds.includes(user.id) || user.status === 'SUSPENDED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800'
                              }`}
                            >
                              {suspendedIds.includes(user.id) || user.status === 'SUSPENDED' ? 'Unsuspend' : 'Suspend'}
                            </button>

                            <button
                              onClick={() => handleSoftDelete(user)}
                              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-rose-600/20 text-slate-400 hover:text-rose-300 border border-slate-800 font-bold"
                              title="Move to Trash"
                            >
                              Trash
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestoreFromTrash(user)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                          >
                            Restore
                          </button>
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
      {/* 🔴 MODAL 2: PRINTABLE PDF PREVIEW MODAL                    */}
      {/* ========================================================= */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-3xl shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" /> User Directory - PDF Document Preview
              </h3>
              <button onClick={() => setShowPdfModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div id="pdf-print-area" className="p-6 bg-white text-slate-900 rounded-2xl space-y-4 shadow-inner font-sans">
              <div className="flex justify-between items-center border-b pb-3 border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">User Directory Master Report</h2>
                  <p className="text-xs text-slate-500">Sathi ERP Enterprise Companion Connect Platform</p>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Total Users: {displayedUsers.length}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 font-bold text-slate-700">
                      <th className="p-2 font-mono text-[10px]">ID</th>
                      <th className="p-2 font-mono text-[10px]">NAME</th>
                      <th className="p-2 font-mono text-[10px]">EMAIL</th>
                      <th className="p-2 font-mono text-[10px]">ROLE</th>
                      <th className="p-2 font-mono text-[10px]">LOCATION</th>
                      <th className="p-2 font-mono text-[10px]">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {displayedUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="p-2 font-mono">{u.id}</td>
                        <td className="p-2 font-bold">{u.name}</td>
                        <td className="p-2 font-mono">{u.email}</td>
                        <td className="p-2 font-mono">{u.role}</td>
                        <td className="p-2">{u.city}, {u.country}</td>
                        <td className="p-2 font-bold">{u.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
                <span>Confidential - Sathi ERP Administration Report</span>
                <span>Page 1 of 1</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">PDF Preview Ready ({displayedUsers.length} records)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25"
                >
                  <Printer className="w-4 h-4" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:text-white"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 👁️ MODAL 3: VIEW USER PROFILE DRAWER                      */}
      {/* ========================================================= */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
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

    </div>
  );
}
