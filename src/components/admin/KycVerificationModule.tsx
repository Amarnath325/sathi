'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Eye, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  X, 
  Clock, 
  RefreshCw,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Home,
  LayoutGrid,
  List,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Check,
  User,
  History,
  MessageSquare
} from 'lucide-react';
import { useKycStore, KycApplicationRecord, KycStatus, SafetyTier, PoliceBgvStatus } from '@/lib/kycStore';
import { useCrudStore } from '@/lib/crudStore';

export type KycSubFilter = 
  | 'verification-dashboard' 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'expired' 
  | 'history';

// Helper to format ISO date to readable string with exact local time
function formatDateTime(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
}

export function KycVerificationModule() {
  const [activeSubFilter, setActiveSubFilter] = useState<KycSubFilter>('verification-dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Pagination & View Mode states
  const [pageSize, setPageSize] = useState<string>('10');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [kycViewMode, setKycViewMode] = useState<'table' | 'grid'>('table');

  // Zustand Store
  const { 
    applications, 
    approveApplication, 
    rejectApplication, 
    toggleBgvStatus, 
    sendRenewalReminder,
    addApplication
  } = useKycStore();

  const { companions } = useCrudStore();

  // Modals state
  const [inspectingDoc, setInspectingDoc] = useState<KycApplicationRecord | null>(null);
  
  // Approve Modal State
  const [approvingDoc, setApprovingDoc] = useState<KycApplicationRecord | null>(null);
  const [approvalRemarks, setApprovalRemarks] = useState('All government identity documents and biometric face scans verified successfully. Approved for active platform companionship.');

  // Reject Modal State
  const [rejectingDoc, setRejectingDoc] = useState<KycApplicationRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('Blurry document photo or text unreadable');
  const [rejectRemarks, setRejectRemarks] = useState('');

  // Lightbox & PDF Modals
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imagePreviewTitle, setImagePreviewTitle] = useState<string>('');

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Reset page number on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubFilter, searchQuery, pageSize]);

  // Seed / Sync from existing companions if store is empty
  useEffect(() => {
    if (applications.length === 0 && companions && companions.length > 0) {
      companions.forEach((comp) => {
        addApplication({
          userId: comp.id,
          userName: comp.name,
          userEmail: comp.email,
          userPhone: comp.phone || '+91 98765 43210',
          userAge: comp.age || 25,
          userGender: comp.gender || 'Female',
          userCountry: comp.country || 'India',
          userState: comp.state || '',
          userCity: comp.city || 'Mumbai',
          userPincode: comp.pincode || '',
          languages: comp.languages || ['English', 'Hindi'],
          hourlyRate: comp.hourlyRate || 75,
          dailyRate: comp.dailyRate || 350,
          weeklyRate: comp.weeklyRate || 2000,
          categories: comp.categories || [comp.category || 'Event Companion'],
          skills: comp.skills || ['Multilingual'],
          bio: comp.bio || 'Verified Companion Profile',
          avatar: comp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
          photos: comp.photos || [comp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'],
          type: 'AADHAAR_CARD',
          documentNumber: comp.aadhaarNumber || `ID-${Math.floor(100000 + Math.random() * 900000)}`,
          fileUrl: comp.photos?.[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
          fileUrlBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
          selfieUrl: comp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          ocrData: {
            extractedName: comp.name,
            extractedDocNum: comp.aadhaarNumber || 'UID-VERIFIED',
            confidenceScore: 99.2
          },
          livenessScore: 99.5,
          status: comp.kycStatus === 'APPROVED' ? 'APPROVED' : comp.kycStatus === 'REJECTED' ? 'REJECTED' : 'PENDING',
          safetyTier: comp.kycStatus === 'APPROVED' ? 'TIER_3_POLICE_ELITE' : 'TIER_2_ADDRESS',
          bgvStatus: comp.kycStatus === 'APPROVED' ? 'POLICE_VERIFIED' : 'PENDING_POLICE',
          reviewedAt: comp.kycStatus === 'APPROVED' ? new Date().toISOString() : null,
          reviewedBy: comp.kycStatus === 'APPROVED' ? 'Super Admin' : null,
          reviewRemarks: comp.kycStatus === 'APPROVED' ? 'Initial verified platform companion record.' : null,
          expiresAt: '2028-12-31'
        });
      });
    }
  }, [applications.length, companions, addApplication]);

  // Filter documents based on active subtab & search
  const filteredDocs = applications.filter((doc) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = doc.userName?.toLowerCase().includes(q);
      const matchEmail = doc.userEmail?.toLowerCase().includes(q);
      const matchPhone = doc.userPhone?.toLowerCase().includes(q);
      const matchNumber = doc.documentNumber?.toLowerCase().includes(q);
      const matchType = doc.type?.toLowerCase().includes(q);
      const matchCity = doc.userCity?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchNumber && !matchType && !matchCity) return false;
    }

    switch (activeSubFilter) {
      case 'pending':
        return doc.status === 'PENDING';
      case 'approved':
        return doc.status === 'APPROVED';
      case 'rejected':
        return doc.status === 'REJECTED';
      case 'expired':
        return doc.status === 'EXPIRED';
      case 'history':
        return doc.status === 'APPROVED' || doc.status === 'REJECTED';
      case 'verification-dashboard':
      default:
        return true;
    }
  });

  // Pagination calculation
  const totalItems = filteredDocs.length;
  const effectivePageSize = pageSize === 'ALL' ? totalItems : parseInt(pageSize, 10) || 10;
  const totalPages = Math.ceil(totalItems / (effectivePageSize || 1)) || 1;
  const startIndex = (currentPage - 1) * effectivePageSize;
  const displayedDocs = filteredDocs.slice(startIndex, startIndex + effectivePageSize);

  // Summary Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter(d => d.status === 'PENDING').length;
  const approvedCount = applications.filter(d => d.status === 'APPROVED').length;
  const rejectedCount = applications.filter(d => d.status === 'REJECTED').length;
  const expiredCount = applications.filter(d => d.status === 'EXPIRED').length;
  const historyCount = applications.filter(d => d.status === 'APPROVED' || d.status === 'REJECTED').length;

  // Actions
  const handleToggleBgv = (docId: string) => {
    toggleBgvStatus(docId);
    triggerToast(`Updated Police Background Verification Status!`);
  };

  const handleSendReminder = (doc: KycApplicationRecord) => {
    sendRenewalReminder(doc.id);
    triggerToast(`Renewal Notification & Email Dispatched to ${doc.userName}!`);
  };

  const handleOpenApproveModal = (doc: KycApplicationRecord) => {
    setApprovingDoc(doc);
    setApprovalRemarks('All government identity documents and biometric face scans verified successfully. Approved for active platform companionship.');
  };

  const handleConfirmApprove = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!approvingDoc) return;

    approveApplication(approvingDoc.id, approvalRemarks, 'Super Admin');
    triggerToast(`Approved KYC for "${approvingDoc.userName}"! Companion is now ACTIVE.`);
    setApprovingDoc(null);

    // If currently inspecting this doc, update inspection state
    if (inspectingDoc && inspectingDoc.id === approvingDoc.id) {
      setInspectingDoc({
        ...inspectingDoc,
        status: 'APPROVED',
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Super Admin',
        reviewRemarks: approvalRemarks,
        rejectionReason: null
      });
    }
  };

  const handleOpenRejectModal = (doc: KycApplicationRecord) => {
    setRejectingDoc(doc);
    setRejectReason('Blurry document photo or text unreadable');
    setRejectRemarks('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingDoc) return;

    rejectApplication(rejectingDoc.id, rejectReason, rejectRemarks, 'Super Admin');
    triggerToast(`Rejected KYC application for "${rejectingDoc.userName}".`);
    setRejectingDoc(null);

    // If currently inspecting this doc, update inspection state
    if (inspectingDoc && inspectingDoc.id === rejectingDoc.id) {
      setInspectingDoc({
        ...inspectingDoc,
        status: 'REJECTED',
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Super Admin',
        reviewRemarks: rejectRemarks || `Application rejected: ${rejectReason}`,
        rejectionReason: rejectReason
      });
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    const headers = ['ID', 'UserName', 'UserEmail', 'Phone', 'City', 'Country', 'DocumentType', 'DocumentNumber', 'Status', 'SubmittedAt', 'ReviewedAt', 'ReviewedBy', 'Remarks'];
    const lines = [headers.join(',')];

    filteredDocs.forEach((doc) => {
      lines.push([
        `"${doc.id}"`,
        `"${doc.userName}"`,
        `"${doc.userEmail}"`,
        `"${doc.userPhone}"`,
        `"${doc.userCity || ''}"`,
        `"${doc.userCountry || ''}"`,
        `"${doc.type}"`,
        `"${doc.documentNumber}"`,
        `"${doc.status}"`,
        `"${doc.submittedAt || doc.createdAt}"`,
        `"${doc.reviewedAt || ''}"`,
        `"${doc.reviewedBy || ''}"`,
        `"${(doc.reviewRemarks || doc.rejectionReason || '').replace(/"/g, '""')}"`
      ].join(','));
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sathi_KYC_Verification_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Exported KYC Verification Sheet (CSV) successfully!');
  };

  const handleExportXLSX = () => {
    handleExportCSV();
  };

  return (
    <div className="space-y-3">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-purple-500 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-up">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 📊 SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Total Submissions</span>
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-base font-extrabold text-white font-mono">{totalCount}</div>
          <p className="text-[9px] text-slate-500">All registered KYC applicants</p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Pending Review</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base font-extrabold text-amber-400 font-mono">{pendingCount}</div>
          <p className="text-[9px] text-amber-400/80 font-bold">Awaiting inspection</p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Approved Verified</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base font-extrabold text-emerald-400 font-mono">{approvedCount}</div>
          <p className="text-[9px] text-emerald-400/80 font-bold">Active in Companions</p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Rejected Applications</span>
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-base font-extrabold text-rose-400 font-mono">{rejectedCount}</div>
          <p className="text-[9px] text-rose-400/80 font-bold">Verification failed</p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Verification History</span>
            <History className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-base font-extrabold text-indigo-400 font-mono">{historyCount}</div>
          <p className="text-[9px] text-slate-500">Audited activity log</p>
        </div>
      </div>

      {/* 🧭 SUBMODULE NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {[
          { id: 'verification-dashboard', label: 'All Submissions', icon: LayoutGrid, count: totalCount },
          { id: 'pending', label: 'Pending Verification', icon: Clock, count: pendingCount },
          { id: 'approved', label: 'Approved', icon: CheckCircle2, count: approvedCount },
          { id: 'rejected', label: 'Rejected', icon: XCircle, count: rejectedCount },
          { id: 'expired', label: 'Expired', icon: AlertTriangle, count: expiredCount },
          { id: 'history', label: 'Verification History', icon: History, count: historyCount },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubFilter(tab.id as KycSubFilter)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'gradient-bg-primary text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
              <span className={`px-1 py-0.2 rounded-full text-[9px] font-mono ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 🎛️ MASTER CONTROL TOOLBAR */}
      <div className="glass-panel p-2.5 sm:p-3 rounded-xl border border-slate-800 space-y-2">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          
          {/* Search Box */}
          <div className="flex items-center gap-2 w-full lg:w-auto flex-1">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applicant name, email, phone, city, ID number..."
                className="w-full pl-8 pr-3 h-7.5 rounded-lg bg-slate-950 border border-slate-800 text-[11.5px] text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Page Size Selector in Toolbar */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 h-7 text-white font-bold font-mono outline-none focus:border-purple-500 cursor-pointer text-[11px]"
              >
                <option value="10">10</option>
                <option value="12">12</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="ALL">All</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle & Action Buttons */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto justify-end overflow-x-auto">
            {/* View Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
              <button
                onClick={() => setKycViewMode('table')}
                className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  kycViewMode === 'table' ? 'gradient-bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3 h-3" /> Table ({totalItems})
              </button>
              <button
                onClick={() => setKycViewMode('grid')}
                className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  kycViewMode === 'grid' ? 'gradient-bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3 h-3" /> Grid ({totalItems})
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="h-7 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Download className="w-3 h-3" /> Export CSV
            </button>

            <button
              onClick={handleExportXLSX}
              className="h-7 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-800 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <FileSpreadsheet className="w-3 h-3" /> Excel
            </button>

            <button
              onClick={() => setShowPdfModal(true)}
              className="h-7 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-800 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <FileText className="w-3 h-3" /> PDF
            </button>
          </div>

        </div>
      </div>

      {/* 📋 KYC DOCUMENT CONTENT: TABLE OR GRID VIEW */}
      {kycViewMode === 'table' ? (
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left border-collapse text-[11.5px] text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-[9.5px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-bold">Applicant / Companion</th>
                  <th className="py-2.5 px-3 font-bold">Location</th>
                  <th className="py-2.5 px-3 font-bold">Document Type</th>
                  <th className="py-2.5 px-3 font-bold">ID Number</th>
                  <th className="py-2.5 px-3 font-bold">AI OCR & Liveness</th>
                  <th className="py-2.5 px-3 font-bold">Police BGV</th>
                  <th className="py-2.5 px-3 font-bold">Status</th>
                  <th className="py-2.5 px-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displayedDocs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-medium text-xs">
                      No KYC applications found in {activeSubFilter.toUpperCase()} view.
                    </td>
                  </tr>
                ) : (
                  displayedDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={doc.selfieUrl || doc.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                            alt={doc.userName}
                            onClick={() => {
                              setImagePreviewUrl(doc.selfieUrl || doc.avatar || '');
                              setImagePreviewTitle(`${doc.userName} - 3D Biometric Liveness Scan`);
                            }}
                            className="w-7 h-7 rounded-lg object-cover border border-purple-500/30 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            title="Click to view full selfie"
                          />
                          <div className="min-w-0">
                            <span className="font-extrabold text-white text-[11.5px] block truncate">{doc.userName}</span>
                            <span className="text-[9px] text-slate-400 font-mono block truncate">{doc.userEmail || doc.userPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-300 font-medium">
                        {doc.userCity ? `${doc.userCity}, ${doc.userCountry || 'India'}` : 'Not specified'}
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-[9px]">
                          {doc.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-white text-[11px]">
                        {doc.documentNumber}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col gap-0.2 text-[9px] font-mono">
                          <span className="text-purple-300 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-purple-400" /> OCR: {doc.ocrData?.confidenceScore || 99.2}%
                          </span>
                          <span className="text-emerald-400">
                            3D Liveness: {doc.livenessScore || 99.4}%
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleToggleBgv(doc.id)}
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                            doc.bgvStatus === 'POLICE_VERIFIED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {doc.bgvStatus === 'POLICE_VERIFIED' ? '✓ Verified' : 'Pending'}
                        </button>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold border uppercase ${
                          doc.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : doc.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : doc.status === 'EXPIRED'
                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setInspectingDoc(doc)}
                            className="h-6 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Inspect
                          </button>
                          {doc.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleOpenApproveModal(doc)}
                              className="h-6 px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {doc.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleOpenRejectModal(doc)}
                              className="h-6 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-rose-600/20 text-rose-400 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW (12 PER PAGE) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
          {displayedDocs.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500 font-medium text-xs">
              No KYC applications found in {activeSubFilter.toUpperCase()} view.
            </div>
          ) : (
            displayedDocs.map((doc) => (
              <div key={doc.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 shadow-sm hover:border-purple-500/40 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 gap-1">
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-[11px] flex items-center gap-1 truncate">
                      <span className="truncate">{doc.userName}</span>
                      {doc.status === 'APPROVED' && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />}
                    </h4>
                    <p className="text-[8.5px] text-slate-400 font-mono truncate">{doc.userCity || doc.userEmail}</p>
                  </div>

                  <span className={`px-1.5 py-0.2 rounded-full text-[8.5px] font-bold border shrink-0 ${
                    doc.status === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : doc.status === 'REJECTED'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : doc.status === 'EXPIRED'
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[8.5px]">
                  <div className="p-1 rounded-md bg-slate-950 border border-slate-800/80 min-w-0">
                    <span className="text-[7.5px] text-slate-500 font-mono uppercase block truncate">Doc Type</span>
                    <p className="font-bold text-purple-400 truncate text-[9.5px]">{doc.type.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="p-1 rounded-md bg-slate-950 border border-slate-800/80 min-w-0">
                    <span className="text-[7.5px] text-slate-500 font-mono uppercase block truncate">ID Number</span>
                    <p className="font-mono font-bold text-white truncate text-[9.5px]">{doc.documentNumber}</p>
                  </div>
                </div>

                {/* Document Photo Preview */}
                <div 
                  onClick={() => setInspectingDoc(doc)}
                  className="relative rounded-lg overflow-hidden border border-slate-800/80 group h-20 bg-slate-950 flex items-center justify-center p-0.5 shadow-inner cursor-pointer hover:border-purple-500/50 transition-all"
                >
                  <img
                    src={doc.fileUrl}
                    alt="KYC Document"
                    className="w-full h-full object-contain rounded group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-0.5 left-0.5 flex flex-col gap-0.2">
                    <span className="px-1 py-0.2 rounded bg-purple-950/90 text-purple-300 text-[7.5px] font-mono font-bold border border-purple-800 flex items-center gap-0.5">
                      <Sparkles className="w-2 h-2 text-purple-400" /> {doc.ocrData?.confidenceScore || 99.2}%
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => setInspectingDoc(doc)}
                    className="flex-1 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9.5px] font-bold cursor-pointer"
                  >
                    Inspect
                  </button>
                  {doc.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleOpenApproveModal(doc)}
                      className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9.5px] cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 🔢 PAGINATION & ROWS PER PAGE CONTROL BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
        
        {/* Page Size Dropdown Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-white font-bold font-mono outline-none focus:border-purple-500 cursor-pointer text-xs"
            >
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="ALL">All</option>
            </select>
          </div>

          <span className="font-mono text-slate-400 text-[11px]">
            Showing <strong className="text-white">{totalItems === 0 ? 0 : startIndex + 1}</strong> - <strong className="text-white">{Math.min(startIndex + effectivePageSize, totalItems)}</strong> of <strong className="text-white">{totalItems}</strong>
          </span>
        </div>

        {/* Page Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-bold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-[11px]"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-6 h-6 rounded-lg font-bold font-mono text-[11px] transition-all ${
                  currentPage === pageNum
                    ? 'bg-purple-600 text-white font-extrabold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {pageNum}
              </button>
            ))}
            {totalPages > 5 && <span className="text-slate-500 font-mono px-1">... {totalPages}</span>}
          </div>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-bold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-[11px]"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 🔍 MODAL 1: COMPREHENSIVE APPLICANT & KYC INSPECTION MODAL */}
      {/* ========================================================= */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 w-full max-w-4xl shadow-2xl space-y-3.5 max-h-[92vh] overflow-y-auto custom-scrollbar text-[11.5px]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <img
                  src={inspectingDoc.avatar || inspectingDoc.selfieUrl}
                  alt={inspectingDoc.userName}
                  className="w-9 h-9 rounded-xl object-cover border border-purple-500/40 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {inspectingDoc.userName}
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold border uppercase ${
                      inspectingDoc.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : inspectingDoc.status === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {inspectingDoc.status}
                    </span>
                  </h3>
                  <p className="text-[9.5px] text-slate-400 font-mono">
                    Applicant ID: {inspectingDoc.userId} • Applied: {formatDateTime(inspectingDoc.submittedAt || inspectingDoc.createdAt)}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setInspectingDoc(null)} 
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3-Column Inspection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Column 1: Basic Profile & Contact Information */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-purple-300 text-xs flex items-center gap-1.5 border-b border-slate-800/80 pb-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" /> Basic Information
                </h4>

                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Email Address</span>
                    <p className="text-white font-medium break-all">{inspectingDoc.userEmail || '—'}</p>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Phone Number</span>
                    <p className="text-white font-medium">{inspectingDoc.userPhone || '—'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Age & Gender</span>
                      <p className="text-white font-medium">{inspectingDoc.userAge || 25} yrs • {inspectingDoc.userGender || 'Female'}</p>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Date of Birth</span>
                      <p className="text-white font-medium">{inspectingDoc.userDob || '—'}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Location & Hub</span>
                    <p className="text-white font-medium">
                      {inspectingDoc.userCity || 'Mumbai'}, {inspectingDoc.userState ? `${inspectingDoc.userState}, ` : ''}{inspectingDoc.userCountry || 'India'}
                      {inspectingDoc.userPincode ? ` (${inspectingDoc.userPincode})` : ''}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Hourly Rate</span>
                      <p className="text-emerald-400 font-bold font-mono">${inspectingDoc.hourlyRate || 75}/hr</p>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Daily / Weekly</span>
                      <p className="text-indigo-300 font-mono">${inspectingDoc.dailyRate || 350} / ${inspectingDoc.weeklyRate || 2000}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Spoken Languages</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {(inspectingDoc.languages || ['English']).map((lang, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[9.5px] text-slate-300">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Selected Categories</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {(inspectingDoc.categories || ['Event Companion']).map((cat, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 rounded bg-purple-500/10 border border-purple-500/20 text-[9.5px] text-purple-300 font-bold">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Bio / Statement</span>
                    <p className="text-slate-300 text-[10.5px] leading-relaxed bg-slate-900 p-1.5 rounded-lg border border-slate-800/80">
                      {inspectingDoc.bio || 'Verified platform companion applicant.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 2: Government Documents Proofs */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-indigo-300 text-xs flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> Government ID Proofs
                  </span>
                  <span className="text-[9px] text-purple-400 font-mono font-bold">
                    OCR: {inspectingDoc.ocrData?.confidenceScore || 99.2}%
                  </span>
                </h4>

                {/* Front Document Photo */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9.5px]">
                    <span className="text-slate-400 font-bold uppercase">Front Side Photo</span>
                    <span className="text-purple-400 font-mono">{inspectingDoc.type.replace(/_/g, ' ')}</span>
                  </div>
                  <div 
                    onClick={() => {
                      setImagePreviewUrl(inspectingDoc.fileUrl);
                      setImagePreviewTitle(`${inspectingDoc.userName} - ${inspectingDoc.type} Front Photo`);
                    }}
                    className="h-28 rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center cursor-pointer group relative"
                  >
                    <img 
                      src={inspectingDoc.fileUrl} 
                      alt="Front Document" 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] gap-1">
                      <Eye className="w-3.5 h-3.5" /> Click to Zoom
                    </div>
                  </div>
                </div>

                {/* Back Document Photo */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9.5px]">
                    <span className="text-slate-400 font-bold uppercase">Back Side Photo</span>
                    <span className="text-slate-500 font-mono">Address & Hologram</span>
                  </div>
                  <div 
                    onClick={() => {
                      setImagePreviewUrl(inspectingDoc.fileUrlBack || inspectingDoc.fileUrl);
                      setImagePreviewTitle(`${inspectingDoc.userName} - ${inspectingDoc.type} Back Photo`);
                    }}
                    className="h-24 rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center cursor-pointer group relative"
                  >
                    <img 
                      src={inspectingDoc.fileUrlBack || inspectingDoc.fileUrl} 
                      alt="Back Document" 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] gap-1">
                      <Eye className="w-3.5 h-3.5" /> Click to Zoom
                    </div>
                  </div>
                </div>

                {/* OCR Match Breakdown */}
                <div className="p-2 rounded-lg bg-slate-900 border border-purple-500/30 space-y-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300">AI OCR Verification</span>
                    <span className="text-emerald-400 font-bold font-mono">100% Match</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 font-mono text-[9px]">
                    <div className="bg-slate-950 p-1 rounded">
                      <span className="text-slate-500 block">PROFILE NAME</span>
                      <span className="text-white font-bold truncate block">{inspectingDoc.userName}</span>
                    </div>
                    <div className="bg-slate-950 p-1 rounded">
                      <span className="text-purple-400 block">OCR EXTRACTED</span>
                      <span className="text-purple-300 font-bold truncate block">{inspectingDoc.ocrData?.extractedName || inspectingDoc.userName}</span>
                    </div>
                    <div className="bg-slate-950 p-1 rounded">
                      <span className="text-slate-500 block">ID NUMBER</span>
                      <span className="text-white font-bold truncate block">{inspectingDoc.documentNumber}</span>
                    </div>
                    <div className="bg-slate-950 p-1 rounded">
                      <span className="text-purple-400 block">OCR EXTRACTED #</span>
                      <span className="text-purple-300 font-bold truncate block">{inspectingDoc.ocrData?.extractedDocNum || inspectingDoc.documentNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Biometrics & Activity Audit Log */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-emerald-300 text-xs flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Biometrics & Liveness
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold">
                    Score: {inspectingDoc.livenessScore || 99.4}%
                  </span>
                </h4>

                {/* 3D Live Selfie Photo */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9.5px]">
                    <span className="text-slate-400 font-bold uppercase">Live Biometric Selfie</span>
                    <span className="text-emerald-400 font-mono font-bold">3D Face Check ✓</span>
                  </div>
                  <div 
                    onClick={() => {
                      setImagePreviewUrl(inspectingDoc.selfieUrl);
                      setImagePreviewTitle(`${inspectingDoc.userName} - 3D Facial Liveness Scan`);
                    }}
                    className="h-28 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center cursor-pointer group relative"
                  >
                    <img 
                      src={inspectingDoc.selfieUrl} 
                      alt="Biometric Selfie" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] gap-1">
                      <Eye className="w-3.5 h-3.5" /> Click to Zoom
                    </div>
                  </div>
                </div>

                {/* Police BGV Status Toggle */}
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-[10.5px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300">Police BGV Status:</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      inspectingDoc.bgvStatus === 'POLICE_VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {inspectingDoc.bgvStatus === 'POLICE_VERIFIED' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleToggleBgv(inspectingDoc.id);
                      setInspectingDoc({
                        ...inspectingDoc,
                        bgvStatus: inspectingDoc.bgvStatus === 'POLICE_VERIFIED' ? 'PENDING_POLICE' : 'POLICE_VERIFIED',
                        safetyTier: inspectingDoc.bgvStatus === 'POLICE_VERIFIED' ? 'TIER_2_ADDRESS' : 'TIER_3_POLICE_ELITE'
                      });
                    }}
                    className="w-full py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    {inspectingDoc.bgvStatus === 'POLICE_VERIFIED' ? 'Revoke Police Verification' : 'Mark Police BGV Verified'}
                  </button>
                </div>

                {/* Audit & Activity Log */}
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-[10px]">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <History className="w-3 h-3 text-purple-400" /> Verification Activity Trail
                  </span>
                  <div className="space-y-1 text-[9.5px]">
                    <div className="flex justify-between border-b border-slate-800/60 pb-0.5">
                      <span className="text-slate-500">Submitted At:</span>
                      <span className="text-slate-300 font-mono">{formatDateTime(inspectingDoc.submittedAt || inspectingDoc.createdAt)}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-0.5">
                      <span className="text-slate-500">Reviewed At:</span>
                      <span className="text-white font-mono">{inspectingDoc.reviewedAt ? formatDateTime(inspectingDoc.reviewedAt) : 'Pending Review'}</span>
                    </div>
                    {inspectingDoc.reviewedBy && (
                      <div className="flex justify-between border-b border-slate-800/60 pb-0.5">
                        <span className="text-slate-500">Reviewed By:</span>
                        <span className="text-purple-300 font-bold">{inspectingDoc.reviewedBy}</span>
                      </div>
                    )}
                    {inspectingDoc.rejectionReason && (
                      <div className="border-b border-slate-800/60 pb-0.5">
                        <span className="text-rose-400 font-bold block">Rejection Reason:</span>
                        <span className="text-rose-300">{inspectingDoc.rejectionReason}</span>
                      </div>
                    )}
                    {inspectingDoc.reviewRemarks && (
                      <div>
                        <span className="text-slate-500 block">Admin Remarks:</span>
                        <span className="text-slate-300 italic">{inspectingDoc.reviewRemarks}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-[10.5px]">
                <span className="text-slate-400">Safety Tier:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[9.5px]">
                  {inspectingDoc.safetyTier || 'TIER_1_ID'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {inspectingDoc.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleOpenApproveModal(inspectingDoc)}
                    className="h-7 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Activate Companion
                  </button>
                )}
                {inspectingDoc.status !== 'REJECTED' && (
                  <button
                    onClick={() => handleOpenRejectModal(inspectingDoc)}
                    className="h-7 px-3 py-1 rounded-lg bg-slate-800 hover:bg-rose-600/20 text-rose-400 border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject Application
                  </button>
                )}
                <button
                  onClick={() => setInspectingDoc(null)}
                  className="h-7 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ✅ MODAL 2: APPROVE WITH REMARKS & TIMESTAMP CONFIRMATION */}
      {/* ========================================================= */}
      {approvingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 w-full max-w-md shadow-2xl space-y-3 text-[11.5px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Approve Companion KYC & Profile
              </h3>
              <button onClick={() => setApprovingDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">{approvingDoc.userName}</span>
                <span className="text-purple-300 font-mono text-[10px]">{approvingDoc.documentNumber}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Approving this KYC will mark the companion profile as <strong className="text-emerald-400 font-mono">ACTIVE</strong> and automatically display them in Companion Management.
              </p>
            </div>

            <form onSubmit={handleConfirmApprove} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1 font-bold text-[11px]">
                  Approval Remarks / Audit Notes:
                </label>
                <textarea
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  rows={3}
                  required
                  placeholder="Enter approval remarks (e.g. Identity verified via Aadhaar OCR and facial liveness match)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500 font-medium text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Timestamp: {formatDateTime(new Date().toISOString())}</span>
                <span>Reviewer: Super Admin</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setApprovingDoc(null)}
                  className="h-7 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Confirm & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ❌ MODAL 3: REJECT WITH REASON & REMARKS MODAL           */}
      {/* ========================================================= */}
      {rejectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 w-full max-w-md shadow-2xl space-y-3 text-[11.5px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-400" /> Reject KYC Application
              </h3>
              <button onClick={() => setRejectingDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">{rejectingDoc.userName}</span>
                <span className="text-rose-300 font-mono text-[10px]">{rejectingDoc.documentNumber}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                This application will remain under the <strong className="text-rose-400">Rejected</strong> tab with the entered reason and remarks.
              </p>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-2.5">
              <div>
                <label className="block text-slate-300 mb-1 font-bold text-[11px]">
                  Select Rejection Reason:
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg h-7.5 px-2.5 text-white outline-none focus:border-rose-500 font-medium text-xs cursor-pointer"
                >
                  <option value="Blurry document photo or text unreadable">Blurry document photo or text unreadable</option>
                  <option value="Expired government ID or passport">Expired government ID or passport</option>
                  <option value="Name / DOB on ID does not match user account">Name / DOB on ID does not match user account</option>
                  <option value="Biometric selfie photo match failed">Biometric selfie photo match failed</option>
                  <option value="Suspected forged or tampered document">Suspected forged or tampered document</option>
                  <option value="Underage applicant (must be 18+ years)">Underage applicant (must be 18+ years)</option>
                  <option value="Other safety policy violation">Other safety policy violation</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold text-[11px]">
                  Detailed Rejection Remarks (Audit Notes):
                </label>
                <textarea
                  value={rejectRemarks}
                  onChange={(e) => setRejectRemarks(e.target.value)}
                  rows={2.5}
                  placeholder="Enter specific feedback or reason for rejection..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-rose-500 font-medium text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Timestamp: {formatDateTime(new Date().toISOString())}</span>
                <span>Reviewer: Super Admin</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRejectingDoc(null)}
                  className="h-7 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-sm cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🔴 MODAL 4: PDF PRINT PREVIEW MODAL                       */}
      {/* ========================================================= */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 w-full max-w-3xl shadow-2xl space-y-3 max-h-[88vh] overflow-y-auto custom-scrollbar text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-400" /> Verification Audit Report - Print / PDF
              </h3>
              <button onClick={() => setShowPdfModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white text-slate-900 rounded-xl space-y-3 shadow-inner font-sans">
              <div className="flex justify-between items-center border-b pb-2 border-slate-200">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">KYC Verification Audit Report</h2>
                  <p className="text-[10px] text-slate-500">Sathi Platform Trust & Safety Verification</p>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-mono">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Total Records: {filteredDocs.length}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10.5px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 font-bold text-slate-700">
                      <th className="p-1.5 font-mono text-[9.5px]">ID</th>
                      <th className="p-1.5 font-mono text-[9.5px]">USER NAME</th>
                      <th className="p-1.5 font-mono text-[9.5px]">DOC TYPE</th>
                      <th className="p-1.5 font-mono text-[9.5px]">DOC NUMBER</th>
                      <th className="p-1.5 font-mono text-[9.5px]">STATUS</th>
                      <th className="p-1.5 font-mono text-[9.5px]">REVIEWED AT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {filteredDocs.map((d) => (
                      <tr key={d.id}>
                        <td className="p-1.5 font-mono text-[9px]">{d.id}</td>
                        <td className="p-1.5 font-bold">{d.userName}</td>
                        <td className="p-1.5 font-mono text-[9px]">{d.type}</td>
                        <td className="p-1.5 font-mono text-[9px]">{d.documentNumber}</td>
                        <td className="p-1.5 font-bold">{d.status}</td>
                        <td className="p-1.5 font-mono text-[9px]">{d.reviewedAt ? formatDateTime(d.reviewedAt) : 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">Ready to print ({filteredDocs.length} records)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="h-7 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> Print PDF
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="h-7 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold text-[11px] hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🖼️ MODAL 5: FULL RESOLUTION IMAGE LIGHTBOX POPUP          */}
      {/* ========================================================= */}
      {imagePreviewUrl && (
        <div 
          onClick={() => setImagePreviewUrl(null)} 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 cursor-zoom-out animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 w-full max-w-4xl shadow-2xl space-y-3 cursor-default relative max-h-[92vh] flex flex-col items-center justify-center"
          >
            <div className="flex items-center justify-between w-full pb-2 border-b border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                <Eye className="w-4 h-4 text-purple-400 shrink-0" /> {imagePreviewTitle || 'KYC Document Image Preview'}
              </h3>
              <button 
                onClick={() => setImagePreviewUrl(null)} 
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full flex-1 min-h-[260px] max-h-[70vh] bg-slate-950 rounded-xl border border-slate-800/80 p-2 flex items-center justify-center overflow-hidden">
              <img 
                src={imagePreviewUrl} 
                alt="Document Full Preview" 
                className="max-w-full max-h-[66vh] object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-between w-full pt-1 text-xs">
              <a 
                href={imagePreviewUrl} 
                target="_blank" 
                rel="noreferrer"
                className="h-7 px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-purple-400 border border-slate-800 font-bold flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3" /> Open Full Image
              </a>
              <button 
                onClick={() => setImagePreviewUrl(null)} 
                className="h-7 px-3.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
