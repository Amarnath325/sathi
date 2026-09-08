'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  Lock,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  List,
  MapPin,
  Tag,
  User,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowRight,
  Sliders,
  Check,
  X,
  FileText,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldAlert,
  Send
} from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import { useCrudStore } from '@/lib/crudStore';
import { useUserStore } from '@/lib/userStore';
import { BookingDetails, BookingStatus, EscrowStatus, PaymentMethod } from '@/lib/types';

export type BookingSubFilter =
  | 'all-bookings'
  | 'pending'
  | 'escrow-locked'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export function BookingManagementModule() {
  const {
    bookings,
    categories,
    config,
    addBooking,
    updateBookingStatus,
    releaseEscrow,
    refundBooking,
    cancelBooking,
    updateBookingDetails
  } = useAdminStore();

  const { companions } = useCrudStore();
  const { users } = useUserStore();

  // Subfilter & Search State
  const [activeSubFilter, setActiveSubFilter] = useState<BookingSubFilter>('all-bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [gatewayFilter, setGatewayFilter] = useState<string>('ALL');

  // View Mode: Grid vs Table
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [pageSize, setPageSize] = useState<string>('12');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [notification, setNotification] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingReceiptBooking, setViewingReceiptBooking] = useState<BookingDetails | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingDetails | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Form state for Create Booking
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedCompanionId, setSelectedCompanionId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Event Companion');
  const [subSpecialty, setSubSpecialty] = useState('Corporate Gala Escort');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('18:00');
  const [durationHours, setDurationHours] = useState<number>(3);
  const [hourlyRate, setHourlyRate] = useState<number>(50);
  const [locationAddress, setLocationAddress] = useState('Palace of Fine Arts, San Francisco, CA');
  const [paymentGateway, setPaymentGateway] = useState<PaymentMethod>('STRIPE');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Auto update hourly rate when a companion is chosen
  const handleSelectCompanion = (compNameOrId: string) => {
    const found = companions.find(c => c.id === compNameOrId || c.name.toLowerCase() === compNameOrId.toLowerCase());
    if (found) {
      setSelectedCompanionId(found.id);
      if (found.hourlyRate) setHourlyRate(found.hourlyRate);
      if (found.categories && found.categories.length > 0) setSelectedCategory(found.categories[0]);
      if (found.city) setLocationAddress(`${found.city}, ${found.country}`);
    }
  };

  // Dynamic Calculated Escrow Total
  const calculatedBase = useMemo(() => {
    const hrs = Math.max(1, durationHours || 1);
    const rate = Math.max(1, hourlyRate || 50);
    return hrs * rate;
  }, [durationHours, hourlyRate]);

  const platformFeeAmount = useMemo(() => {
    const pct = config?.platformFeePercent || 10;
    return Math.round(calculatedBase * (pct / 100));
  }, [calculatedBase, config]);

  const gstTaxAmount = useMemo(() => {
    const taxPct = config?.gstTaxPercent || 18;
    return Math.round(calculatedBase * (taxPct / 100));
  }, [calculatedBase, config]);

  const totalCalculatedEscrow = useMemo(() => {
    return calculatedBase + platformFeeAmount + gstTaxAmount;
  }, [calculatedBase, platformFeeAmount, gstTaxAmount]);

  // Handle Form Submission for Create Manual Escrow Booking
  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      triggerToast('Client name is required.');
      return;
    }

    const selectedComp = companions.find(c => c.id === selectedCompanionId || c.name.toLowerCase() === selectedCompanionId.toLowerCase()) || companions[0];
    const compName = selectedComp ? selectedComp.name : 'Sophia Chen';
    const compAvatar = selectedComp?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
    const compId = selectedComp ? selectedComp.id : `comp-${Date.now()}`;

    const newBookingNumber = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBookingId = `bk-${Date.now()}`;

    const newBookingData = {
      bookingNumber: newBookingNumber,
      userId: `usr-${Date.now()}`,
      userName: clientName.trim(),
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      companionId: compId,
      companionName: compName,
      companionAvatar: compAvatar,
      category: selectedCategory,
      subCategory: subSpecialty.trim() || 'General Meetup',
      date: bookingDate,
      startTime: `${bookingDate}T${startTime}:00Z`,
      durationHours: Number(durationHours) || 3,
      locationName: locationAddress.split(',')[0] || 'Authorized Meeting Venue',
      locationAddress: locationAddress.trim(),
      specialNotes: specialRequirements.trim() || undefined,
      hourlyRate: Number(hourlyRate) || 50,
      baseAmount: calculatedBase,
      subtotal: calculatedBase,
      platformFee: platformFeeAmount,
      escrowFee: 0,
      totalAmount: totalCalculatedEscrow,
      status: 'ESCROW_LOCKED' as BookingStatus,
      paymentMethod: paymentGateway,
      escrowStatus: 'HELD' as EscrowStatus,
      createdAt: new Date().toISOString()
    };

    addBooking(newBookingData);
    triggerToast(`✓ Created and Locked Escrow Booking #${newBookingNumber} ($${totalCalculatedEscrow}.00)!`);

    // Reset Form
    setIsCreateModalOpen(false);
    setClientName('');
    setClientEmail('');
    setSpecialRequirements('');
    setActiveSubFilter('all-bookings');
    setCurrentPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubFilter, searchQuery, categoryFilter, statusFilter, gatewayFilter, pageSize]);

  // Filter Bookings List
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Sub-Filter tab
      if (activeSubFilter === 'pending' && b.status !== 'PENDING_APPROVAL') return false;
      if (activeSubFilter === 'escrow-locked' && b.status !== 'ESCROW_LOCKED' && b.escrowStatus !== 'HELD') return false;
      if (activeSubFilter === 'in-progress' && b.status !== 'IN_PROGRESS') return false;
      if (activeSubFilter === 'completed' && b.status !== 'COMPLETED') return false;
      if (activeSubFilter === 'cancelled' && b.status !== 'CANCELLED') return false;
      if (activeSubFilter === 'refunded' && b.escrowStatus !== 'REFUNDED_TO_USER') return false;

      // Category filter
      if (categoryFilter !== 'ALL' && b.category !== categoryFilter) return false;

      // Status filter
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;

      // Gateway filter
      if (gatewayFilter !== 'ALL' && b.paymentMethod !== gatewayFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = b.bookingNumber?.toLowerCase().includes(q);
        const matchClient = b.userName?.toLowerCase().includes(q);
        const matchComp = b.companionName?.toLowerCase().includes(q);
        const matchLoc = b.locationAddress?.toLowerCase().includes(q) || b.locationName?.toLowerCase().includes(q);
        const matchCat = b.category?.toLowerCase().includes(q) || b.subCategory?.toLowerCase().includes(q);
        if (!matchNumber && !matchClient && !matchComp && !matchLoc && !matchCat) return false;
      }

      return true;
    });
  }, [bookings, activeSubFilter, categoryFilter, statusFilter, gatewayFilter, searchQuery]);

  // Pagination calculation
  const totalItems = filteredBookings.length;
  const effectivePageLimit = pageSize === 'ALL' ? totalItems : parseInt(pageSize, 10) || 12;
  const totalPages = Math.ceil(totalItems / (effectivePageLimit || 1)) || 1;
  const startIndex = (currentPage - 1) * effectivePageLimit;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + effectivePageLimit);

  // Summary Metrics Calculation
  const totalCount = bookings.length;
  const totalEscrowHeld = useMemo(() => {
    return bookings
      .filter(b => b.escrowStatus === 'HELD' || b.status === 'ESCROW_LOCKED')
      .reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  }, [bookings]);

  const activeMeetupsCount = useMemo(() => {
    return bookings.filter(b => b.status === 'IN_PROGRESS').length;
  }, [bookings]);

  const platformCommissionTotal = useMemo(() => {
    return bookings.reduce((acc, b) => acc + (b.platformFee || 0), 0);
  }, [bookings]);

  // Tab counts for sub-filter bar
  const counts = useMemo(() => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'PENDING_APPROVAL').length,
      escrowLocked: bookings.filter(b => b.status === 'ESCROW_LOCKED' || b.escrowStatus === 'HELD').length,
      inProgress: bookings.filter(b => b.status === 'IN_PROGRESS').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
      refunded: bookings.filter(b => b.escrowStatus === 'REFUNDED_TO_USER').length
    };
  }, [bookings]);

  // Export CSV generator
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      triggerToast('No records to export.');
      return;
    }
    const headers = ['Booking #', 'Client Name', 'Companion Name', 'Category', 'Date', 'Duration (Hrs)', 'Hourly Rate', 'Total Amount', 'Status', 'Escrow Status', 'Payment Method', 'Location'];
    const rows = filteredBookings.map(b => [
      `"${b.bookingNumber}"`,
      `"${b.userName}"`,
      `"${b.companionName}"`,
      `"${b.category}"`,
      `"${b.date || (b.createdAt ? b.createdAt.split('T')[0] : '')}"`,
      b.durationHours,
      b.hourlyRate,
      `$${b.totalAmount}.00`,
      b.status,
      b.escrowStatus,
      b.paymentMethod,
      `"${b.locationAddress || b.locationName || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sathi_Bookings_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported ${filteredBookings.length} booking records to CSV!`);
  };

  // Helper for Status Badge Styling
  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'ESCROW_LOCKED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10.5px] font-mono font-bold flex items-center gap-1">
            <Lock className="w-3 h-3 text-purple-400" /> Escrow Locked
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10.5px] font-mono font-bold flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3 text-emerald-400" /> In Progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10.5px] font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-teal-400" /> Completed
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10.5px] font-mono font-bold flex items-center gap-1">
            <Check className="w-3 h-3 text-blue-400" /> Accepted
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10.5px] font-mono font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> Pending Approval
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10.5px] font-mono font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-400" /> Cancelled
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10.5px] font-mono font-bold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" /> Disputed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10.5px] font-mono">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-purple-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 📊 TOP 4 METRICS ROW (Matching Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold">Total Bookings</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{totalCount}</div>
          <p className="text-[10px] text-slate-500">Across all categories</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold">Escrow Vault Held</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            ${totalEscrowHeld.toLocaleString()}.00
          </div>
          <p className="text-[10px] text-amber-400/90 font-bold">Secured in Partner Bank</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold">Active Live Meetups</span>
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {activeMeetupsCount}
          </div>
          <p className="text-[10px] text-emerald-400/90 font-bold">GPS Live Tracking Active</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold">Platform Commission</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-indigo-400 font-mono">
            ${platformCommissionTotal.toLocaleString()}.00
          </div>
          <p className="text-[10px] text-slate-500">From 10% platform fee</p>
        </div>

      </div>

      {/* 🏷️ SUB-FILTER TABS BAR (All Bookings, Pending, Escrow Locked, Active Live, Completed, Cancelled) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          {[
            { id: 'all-bookings', label: 'All Bookings', count: counts.all },
            { id: 'pending', label: 'Pending', count: counts.pending },
            { id: 'escrow-locked', label: 'Escrow Locked', count: counts.escrowLocked },
            { id: 'in-progress', label: 'Active Live', count: counts.inProgress },
            { id: 'completed', label: 'Completed', count: counts.completed },
            { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          ].map((tab) => {
            const isActive = activeSubFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubFilter(tab.id as BookingSubFilter);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold border-purple-500 shadow-md shadow-purple-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher + Create Booking Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => {
                setViewMode('grid');
                setPageSize('12');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid (12)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('table');
                setPageSize('10');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table (10)</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl gradient-bg-primary text-white text-[11px] font-extrabold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> + Create Booking
          </button>
        </div>
      </div>

      {/* 🎛️ MASTER SEARCH & FILTER TOOLBAR */}
      <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, booking #, location, category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filters & Export Options */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-end">
          
          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="h-8 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-medium focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Payment Method Filter */}
          <select
            value={gatewayFilter}
            onChange={e => setGatewayFilter(e.target.value)}
            className="h-8 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-medium focus:outline-none"
          >
            <option value="ALL">All Gateways</option>
            <option value="STRIPE">Stripe</option>
            <option value="RAZORPAY">Razorpay</option>
            <option value="UPI">UPI Payment</option>
            <option value="CREDIT_CARD">Credit Card</option>
          </select>

          {/* Page Size Selector */}
          <select
            value={pageSize}
            onChange={e => setPageSize(e.target.value)}
            className="h-8 px-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 focus:outline-none"
          >
            <option value="10">Show: 10</option>
            <option value="12">Show: 12</option>
            <option value="25">Show: 25</option>
            <option value="50">Show: 50</option>
            <option value="ALL">Show: ALL</option>
          </select>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="h-8 px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Export to CSV"
          >
            <Download className="w-3 h-3 text-emerald-400" /> Export CSV
          </button>
        </div>

      </div>

      {/* 📦 CONTENT VIEW: GRID (CARDS) vs TABLE */}
      {paginatedBookings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No Booking Records Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are no booking orders matching your current filter. Click "+ Create Booking" to dispatch a manual escrow ticket.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-md shadow-indigo-600/20"
          >
            + Create New Booking
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* 🎴 GRID CARDS VIEW (Matching Screenshot) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedBookings.map((b) => {
            const isEscrowLocked = b.escrowStatus === 'HELD' || b.status === 'ESCROW_LOCKED';
            const isReleased = b.escrowStatus === 'RELEASED_TO_COMPANION';
            const isRefunded = b.escrowStatus === 'REFUNDED_TO_USER' || b.status === 'CANCELLED';

            return (
              <div
                key={b.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-4 hover:border-indigo-500/40 transition-all shadow-md group relative flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Top Header Row: Booking #, Category, Status Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-xs shadow-sm">
                        {b.bookingNumber}
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold">
                        {b.category}
                      </span>
                    </div>

                    <div>
                      {renderStatusBadge(b.status)}
                    </div>
                  </div>

                  {/* Mid Row: Dual Client & Companion Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-4">
                    {/* Left: Client */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={b.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={b.userName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-wider block">CLIENT</span>
                        <h4 className="font-bold text-white text-xs truncate">{b.userName}</h4>
                      </div>
                    </div>

                    {/* Right: Companion */}
                    <div className="flex items-center gap-2.5 min-w-0 text-right justify-end">
                      <div className="min-w-0">
                        <span className="text-[9.5px] font-mono font-bold text-indigo-400 uppercase tracking-wider block flex items-center justify-end gap-1">
                          <ShieldCheck className="w-3 h-3 text-indigo-400" /> COMPANION
                        </span>
                        <h4 className="font-bold text-white text-xs truncate">{b.companionName}</h4>
                      </div>
                      <img
                        src={b.companionAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={b.companionName}
                        className="w-9 h-9 rounded-full object-cover border border-indigo-500/40 shrink-0"
                      />
                    </div>
                  </div>

                  {/* Details Row: Date, Duration, Total Escrow, Escrow State */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <Calendar className="w-3 h-3 text-indigo-400" /> Date
                      </span>
                      <p className="font-mono font-bold text-slate-200 truncate">
                        {b.date || (b.createdAt ? b.createdAt.split('T')[0] : '2026-08-10')}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-indigo-400" /> Duration
                      </span>
                      <p className="font-mono font-bold text-slate-200 truncate">
                        {b.durationHours} hrs (${b.hourlyRate}/hr)
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <DollarSign className="w-3 h-3 text-emerald-400" /> Total Escrow
                      </span>
                      <p className="font-mono font-bold text-emerald-400 truncate text-sm">
                        ${b.totalAmount}.00
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                        <Lock className="w-3 h-3 text-amber-400" /> Escrow State
                      </span>
                      <p className="font-mono font-bold text-amber-400 truncate">
                        {b.escrowStatus === 'HELD' ? '🔒 Vault Held' : b.escrowStatus === 'RELEASED_TO_COMPANION' ? '⚡ Released' : '↩ Refunded'}
                      </p>
                    </div>

                  </div>

                  {/* Meeting Location Box */}
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="truncate">{b.locationAddress || b.locationName || 'San Francisco, CA'}</span>
                  </div>
                </div>

                {/* Bottom Row Action Buttons */}
                <div className="pt-2 flex items-center gap-2 flex-wrap sm:flex-nowrap border-t border-slate-800/60">
                  <button
                    onClick={() => setViewingReceiptBooking(b)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" /> View Details & Receipt
                  </button>

                  {/* Release Escrow Button */}
                  <button
                    onClick={() => {
                      releaseEscrow(b.id);
                      triggerToast(`✓ Released $${b.totalAmount}.00 Escrow Vault to ${b.companionName}!`);
                    }}
                    disabled={isReleased || isRefunded}
                    className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                      isReleased 
                        ? 'bg-emerald-950/40 text-emerald-500/50 border border-emerald-500/20 cursor-not-allowed'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Release Escrow
                  </button>

                  {/* Refund Button */}
                  <button
                    onClick={() => {
                      refundBooking(b.id, 'Admin initiated refund to customer account');
                      triggerToast(`Refund processed for booking #${b.bookingNumber}!`);
                    }}
                    disabled={isRefunded}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isRefunded
                        ? 'bg-rose-950/30 text-rose-500/40 border border-rose-500/20 cursor-not-allowed'
                        : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Refund
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* 📋 TABLE VIEW (10 Items per page) */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left border-collapse text-[11.5px] text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Booking #</th>
                  <th className="py-3 px-4">Client User</th>
                  <th className="py-3 px-4">Companion</th>
                  <th className="py-3 px-4">Service Specialty</th>
                  <th className="py-3 px-4">Schedule / Date</th>
                  <th className="py-3 px-4">Total & Escrow</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {paginatedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Booking Number */}
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                      {b.bookingNumber}
                    </td>

                    {/* Client */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={b.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={b.userName}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <span className="font-bold text-white truncate max-w-[120px]">{b.userName}</span>
                      </div>
                    </td>

                    {/* Companion */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={b.companionAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={b.companionName}
                          className="w-6 h-6 rounded-full object-cover border border-purple-500/40 shrink-0"
                        />
                        <span className="font-bold text-slate-200 truncate max-w-[120px]">{b.companionName}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold text-[10.5px]">
                        {b.category}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-3 px-4 font-mono text-slate-300 text-[11px]">
                      <div>{b.date || (b.createdAt ? b.createdAt.split('T')[0] : '2026-08-10')}</div>
                      <div className="text-[10px] text-slate-500">{b.durationHours} hrs @ ${b.hourlyRate}/hr</div>
                    </td>

                    {/* Amount & Escrow */}
                    <td className="py-3 px-4 font-mono">
                      <div className="text-emerald-400 font-bold">${b.totalAmount}.00</div>
                      <div className="text-[10px] text-amber-400/90">{b.escrowStatus === 'HELD' ? '🔒 Vault Held' : '⚡ Released'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {renderStatusBadge(b.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingReceiptBooking(b)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white"
                          title="View Details & Receipt"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        </button>
                        <button
                          onClick={() => {
                            releaseEscrow(b.id);
                            triggerToast(`Released Escrow for ${b.bookingNumber}!`);
                          }}
                          disabled={b.escrowStatus === 'RELEASED_TO_COMPANION'}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10.5px] font-bold disabled:opacity-40"
                          title="Release Escrow"
                        >
                          Release
                        </button>
                        <button
                          onClick={() => {
                            refundBooking(b.id, 'Admin initiated refund');
                            triggerToast(`Refund processed for ${b.bookingNumber}!`);
                          }}
                          disabled={b.escrowStatus === 'REFUNDED_TO_USER'}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 disabled:opacity-40"
                          title="Refund"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📄 PAGINATION FOOTER */}
      {totalPages > 1 && (
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{startIndex + 1}</strong> to <strong className="text-white">{Math.min(startIndex + effectivePageLimit, totalItems)}</strong> of <strong className="text-white">{totalItems}</strong> Bookings
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono font-bold text-white text-xs">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ➕ MODAL 1: CREATE MANUAL ESCROW BOOKING (Exact Match to User Screenshot) */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-7 space-y-6 shadow-2xl relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">Create Manual Escrow Booking</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Dispatch a new companion meetup ticket with locked bank escrow.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateBookingSubmit} className="space-y-4 text-xs">
              
              {/* Row 1: Client Name & Companion Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">CLIENT NAME *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Michael Jordan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">COMPANION NAME *</label>
                  <select
                    value={selectedCompanionId}
                    onChange={e => handleSelectCompanion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Choose Companion...</option>
                    {companions.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} (${c.hourlyRate || 50}/hr - {c.city || 'Available'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Service Category & Sub-Service Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">SERVICE CATEGORY</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Event Companion">Event Companion</option>
                    <option value="Sightseeing & Travel">Sightseeing & Travel</option>
                    <option value="Dining & Gala Escort">Dining & Gala Escort</option>
                    <option value="Elderly Support & Care">Elderly Support & Care</option>
                    <option value="Conversation & Study">Conversation & Study</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">SUB-SERVICE SPECIALTY</label>
                  <input
                    type="text"
                    value={subSpecialty}
                    onChange={e => setSubSpecialty(e.target.value)}
                    placeholder="e.g. Corporate Gala Escort"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 3: Date, Duration, Hourly Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">DATE</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">DURATION (HOURS)</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={durationHours}
                    onChange={e => setDurationHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">HOURLY RATE ($)</label>
                  <input
                    type="number"
                    min={10}
                    value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 4: Meeting Location Address */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">MEETING LOCATION ADDRESS</label>
                <input
                  type="text"
                  required
                  value={locationAddress}
                  onChange={e => setLocationAddress(e.target.value)}
                  placeholder="e.g. Palace of Fine Arts, San Francisco, CA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Row 5: Payment Gateway & Total Calculated Escrow Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">PAYMENT GATEWAY</label>
                  <select
                    value={paymentGateway}
                    onChange={e => setPaymentGateway(e.target.value as PaymentMethod)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="STRIPE">STRIPE</option>
                    <option value="RAZORPAY">RAZORPAY</option>
                    <option value="UPI">UPI ESCROW</option>
                    <option value="CREDIT_CARD">CREDIT CARD</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">TOTAL CALCULATED ESCROW</label>
                  <div className="px-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      ${totalCalculatedEscrow}.00
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md">
                      Vault Lock Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 6: Special Client Requirements */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block mb-1">SPECIAL CLIENT REQUIREMENTS</label>
                <textarea
                  rows={2}
                  value={specialRequirements}
                  onChange={e => setSpecialRequirements(e.target.value)}
                  placeholder="Any special instructions, dress code, or language requirements..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" /> Create & Lock Escrow Ticket
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🧾 MODAL 2: VIEW DETAILS & ESCROW RECEIPT MODAL                           */}
      {/* ========================================================================= */}
      {viewingReceiptBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-7 space-y-6 shadow-2xl relative my-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Escrow Audit Ticket & Receipt</h3>
                  <p className="text-[11px] font-mono text-indigo-400">{viewingReceiptBooking.bookingNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingReceiptBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                <span>Client:</span> <strong className="text-white">{viewingReceiptBooking.userName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                <span>Companion:</span> <strong className="text-white">{viewingReceiptBooking.companionName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                <span>Category:</span> <strong className="text-purple-300">{viewingReceiptBooking.category}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                <span>Schedule:</span> <strong className="text-white">{viewingReceiptBooking.date || '2026-08-10'} ({viewingReceiptBooking.durationHours} Hours)</strong>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                <span>Meeting Point:</span> <strong className="text-white">{viewingReceiptBooking.locationAddress || viewingReceiptBooking.locationName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                <span>Platform Service Fee (10%):</span> <strong className="text-indigo-400">${viewingReceiptBooking.platformFee || 20}.00</strong>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-emerald-400">
                <span>Total Escrow Amount:</span> <span>${viewingReceiptBooking.totalAmount}.00</span>
              </div>
            </div>

            {/* Direct Admin Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  releaseEscrow(viewingReceiptBooking.id);
                  setViewingReceiptBooking({ ...viewingReceiptBooking, escrowStatus: 'RELEASED_TO_COMPANION', status: 'COMPLETED' });
                  triggerToast('✓ Escrow released to companion bank vault!');
                }}
                disabled={viewingReceiptBooking.escrowStatus === 'RELEASED_TO_COMPANION'}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs disabled:opacity-40"
              >
                <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> Release Escrow
              </button>

              <button
                onClick={() => {
                  refundBooking(viewingReceiptBooking.id, 'Refund processed by Super Admin');
                  setViewingReceiptBooking({ ...viewingReceiptBooking, escrowStatus: 'REFUNDED_TO_USER', status: 'CANCELLED' });
                  triggerToast('Refund executed to client balance!');
                }}
                disabled={viewingReceiptBooking.escrowStatus === 'REFUNDED_TO_USER'}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs disabled:opacity-40"
              >
                <XCircle className="w-3.5 h-3.5 inline mr-1" /> Refund Client
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
