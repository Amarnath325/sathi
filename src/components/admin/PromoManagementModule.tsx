'use client';

import React, { useState, useMemo } from 'react';
import { useAdminStore } from '@/lib/adminStore';
import { PromoCodeItem } from '@/lib/types';
import { PromoCard } from '@/components/promo/PromoCard';
import { PromoFormModal } from '@/components/promo/PromoFormModal';
import { PromoDetailsModal } from '@/components/promo/PromoDetailsModal';
import {
  Ticket,
  Users,
  Gift,
  TrendingUp,
  Search,
  Plus,
  Filter,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  Percent,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpDown,
  Calculator,
  RefreshCw,
  Copy,
  Check,
  Power,
  Eye,
  Edit3,
  Trash2,
  ChevronDown
} from 'lucide-react';

export function PromoManagementModule() {
  const {
    promos,
    addPromoCode,
    updatePromoCode,
    deletePromoCode,
    togglePromoCode,
    validatePromoCode
  } = useAdminStore();

  // Filters & State
  const [subFilter, setSubFilter] = useState<'all' | 'active' | 'percentage' | 'flat' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'usage' | 'discount' | 'expiry'>('usage');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCodeItem | null>(null);
  const [viewingPromo, setViewingPromo] = useState<PromoCodeItem | null>(null);
  const [deletingPromoId, setDeletingPromoId] = useState<string | null>(null);

  // Coupon Simulator Drawer
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simCode, setSimCode] = useState('WELCOME10');
  const [simAmount, setSimAmount] = useState(250);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPIs
  const today = new Date().toISOString().split('T')[0];
  const activeCampaigns = promos.filter(p => p.isActive && (!p.expiryDate || p.expiryDate >= today)).length;
  const totalRedemptions = promos.reduce((acc, p) => acc + p.usageCount, 0);
  const savingsGranted = promos.reduce(
    (acc, p) => acc + (p.usageCount * (p.discountValue || p.discountPercent || p.flatDiscount || 15)),
    0
  );
  const grossVolume = totalRedemptions * 280;

  // Filtered & Sorted Promos
  const filteredPromos = useMemo(() => {
    let list = promos.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.code.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q));
        if (!match) return false;
      }

      if (subFilter === 'active') return p.isActive && (!p.expiryDate || p.expiryDate >= today);
      if (subFilter === 'percentage') return p.discountType === 'PERCENTAGE' || !!p.discountPercent;
      if (subFilter === 'flat') return p.discountType === 'FLAT_AMOUNT' || !!p.flatDiscount;
      if (subFilter === 'expired') return !p.isActive || (p.expiryDate && p.expiryDate < today);

      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'usage') return b.usageCount - a.usageCount;
      if (sortBy === 'discount') {
        const valA = a.discountValue || a.discountPercent || a.flatDiscount || 0;
        const valB = b.discountValue || b.discountPercent || b.flatDiscount || 0;
        return valB - valA;
      }
      if (sortBy === 'expiry') {
        return (a.expiryDate || '9999').localeCompare(b.expiryDate || '9999');
      }
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

    return list;
  }, [promos, searchQuery, subFilter, sortBy, today]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Code', 'Title', 'Type', 'Value', 'Min Booking', 'Redemptions', 'Limit', 'Expiry', 'Status'];
    const rows = filteredPromos.map(p => [
      p.code,
      `"${p.title.replace(/"/g, '""')}"`,
      p.discountType,
      p.discountValue || p.discountPercent || p.flatDiscount,
      p.minBookingAmount,
      p.usageCount,
      p.usageLimit || 'Unlimited',
      p.expiryDate || 'N/A',
      p.isActive ? 'Active' : 'Paused'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `promotions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Promotions exported to CSV successfully!');
  };

  // Simulation test calculation
  const simulationResult = useMemo(() => {
    if (!simCode.trim() || simAmount <= 0) return null;
    return validatePromoCode(simCode, simAmount);
  }, [simCode, simAmount, validatePromoCode, promos]);

  return (
    <div className="space-y-4 text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-950 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Promotions & Coupon Management
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Live Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Manage promotional discount campaigns, redemption limits, rules, and track ROI revenue attribution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSimulatorOpen
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Open Live Discount Calculator"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Test Coupon</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingPromo(null);
              setIsFormOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>Active Campaigns</span>
            <Ticket className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
            {activeCampaigns} <span className="text-xs text-slate-400 font-normal">/ {promos.length}</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Live redeemable codes</p>
        </div>

        <div className="p-3 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>Coupon Redemptions</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {totalRedemptions.toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400/80 font-bold">Client redemptions claimed</p>
        </div>

        <div className="p-3 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>Savings Granted</span>
            <Gift className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            ${savingsGranted.toLocaleString()}.00
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Total customer discounts given</p>
        </div>

        <div className="p-3 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>Driven Volume</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
            ${grossVolume.toLocaleString()}.00
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400/80 font-bold">Attributed gross booking volume</p>
        </div>
      </div>

      {/* Interactive Coupon Simulator Drawer / Banner */}
      {isSimulatorOpen && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-slate-900/20 border border-purple-400 dark:border-purple-500/40 space-y-2.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-700 dark:text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Calculator className="w-4 h-4" /> Live Coupon Validation Tester
            </span>
            <button
              type="button"
              onClick={() => setIsSimulatorOpen(false)}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-0.5">
                Select / Enter Code
              </label>
              <select
                value={simCode}
                onChange={e => setSimCode(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
              >
                {promos.map(p => (
                  <option key={p.id} value={p.code}>
                    {p.code} - {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-0.5">
                Booking Subtotal ($)
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={simAmount}
                onChange={e => setSimAmount(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
              />
            </div>

            <div className="col-span-2 p-2 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              {simulationResult?.isValid ? (
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Code Valid & Applied!
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      Original: ${simAmount}.00 • Discount: -${simulationResult.discountAmount}.00
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-sans">Final Payable</span>
                    <span className="text-sm font-mono font-black text-purple-600 dark:text-purple-400">
                      ${simulationResult.finalAmount}.00
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="text-xs font-bold">Invalid or Ineligible</span>
                    <p className="text-[10px] text-slate-500">{simulationResult?.error || 'Validation failed'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Filter Tabs & Action Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { id: 'all', label: 'All Coupons' },
            { id: 'active', label: '⚡ Active' },
            { id: 'percentage', label: '% Percentage' },
            { id: 'flat', label: '$ Flat Savings' },
            { id: 'expired', label: '⏳ Expired' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                subFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, Sort & View Mode Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Search Box */}
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code, title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 h-8 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="h-8 px-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="usage">Most Redeemed</option>
            <option value="discount">Highest Discount</option>
            <option value="expiry">Expiring Soon</option>
            <option value="newest">Newest First</option>
          </select>

          {/* View Toggle (Grid / Table) */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Dense Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Empty State / Grid View / Table View */}
      {filteredPromos.length === 0 ? (
        <div className="p-10 text-center rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-950 text-purple-500 mx-auto flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Promo Codes Found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No active coupons match your query or filter. Create a new campaign to boost bookings!
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingPromo(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create Coupon
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPromos.map(p => (
            <PromoCard
              key={p.id}
              promo={p}
              onEdit={promoItem => {
                setEditingPromo(promoItem);
                setIsFormOpen(true);
              }}
              onAudit={promoItem => setViewingPromo(promoItem)}
              onToggleActive={id => {
                togglePromoCode(id);
                triggerToast(`Promo #${id} status toggled!`);
              }}
              onDelete={id => setDeletingPromoId(id)}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Coupon Code & Title</th>
                  <th className="py-2.5 px-3">Discount Model</th>
                  <th className="py-2.5 px-3">Min Order</th>
                  <th className="py-2.5 px-3">Usage Progress</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredPromos.map(p => {
                  const isExpiredItem = p.expiryDate && p.expiryDate < today;
                  const discountVal = p.discountValue || p.discountPercent || p.flatDiscount || 10;
                  const isPct = p.discountType === 'PERCENTAGE' || !!p.discountPercent;
                  const limit = p.usageLimit || 1000;
                  const pct = Math.min(100, Math.round((p.usageCount / limit) * 100));

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 dark:text-white bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800/60">
                            {p.code}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                            {p.title}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                          {isPct ? `${discountVal}% OFF` : `$${discountVal} FLAT`}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                        ${p.minBookingAmount}.00
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-slate-500">
                            <span>{p.usageCount}</span>
                            <span>{p.usageLimit ? p.usageLimit : '∞'}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct > 85 ? 'bg-rose-500' : 'bg-purple-600'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {p.expiryDate || 'Permanent'}
                      </td>

                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={() => {
                            togglePromoCode(p.id);
                            triggerToast(`Promo #${p.id} status toggled!`);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border flex items-center gap-1 cursor-pointer ${
                            !p.isActive
                              ? 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
                              : isExpiredItem
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${p.isActive && !isExpiredItem ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          <span>{!p.isActive ? 'PAUSED' : isExpiredItem ? 'EXPIRED' : 'ACTIVE'}</span>
                        </button>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingPromo(p)}
                            className="p-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 cursor-pointer"
                            title="Audit Analytics"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPromo(p);
                              setIsFormOpen(true);
                            }}
                            className="p-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingPromoId(p.id)}
                            className="p-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-800 cursor-pointer"
                            title="Delete"
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
        </div>
      )}

      {/* Promo Form Modal (Create / Edit) */}
      <PromoFormModal
        isOpen={isFormOpen}
        promo={editingPromo}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPromo(null);
        }}
        onSave={data => {
          if (editingPromo) {
            updatePromoCode(editingPromo.id, data);
            triggerToast(`Promo #${data.code} updated successfully!`);
          } else {
            addPromoCode(data);
            triggerToast(`New promo #${data.code} created successfully!`);
          }
          setIsFormOpen(false);
          setEditingPromo(null);
        }}
      />

      {/* Promo Details / Audit Modal */}
      <PromoDetailsModal
        isOpen={!!viewingPromo}
        promo={viewingPromo}
        onClose={() => setViewingPromo(null)}
      />

      {/* Delete Confirmation Modal */}
      {deletingPromoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
          <div className="relative w-full max-w-sm glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 text-slate-900 dark:text-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Delete Promo Campaign?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this coupon? Active booking carts using this code will no longer receive discounts.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingPromoId(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePromoCode(deletingPromoId);
                  triggerToast('Promo campaign deleted.');
                  setDeletingPromoId(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md shadow-rose-600/30"
              >
                Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
