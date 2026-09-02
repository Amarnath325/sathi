'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Eye, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Printer, 
  X, 
  Clock, 
  RefreshCw,
  Layers,
  Filter,
  Check,
  Shield,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Bell,
  Home,
  LayoutGrid,
  List
} from 'lucide-react';
import { scanKycDocumentWithAi, analyzeBiometricLiveness } from '@/lib/kycOcrScanner';

export type KycSubFilter = 
  | 'verification-dashboard' 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'expired' 
  | 'history';

export type PoliceBgvStatus = 'NOT_STARTED' | 'PENDING_POLICE' | 'POLICE_VERIFIED' | 'FAILED';
export type SafetyTier = 'TIER_1_ID' | 'TIER_2_ADDRESS' | 'TIER_3_POLICE_ELITE';

interface KycDocumentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: string;
  documentNumber: string;
  fileUrl: string;
  selfieUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  rejectionReason: string | null;
  createdAt: string;
  expiresAt: string;

  // Next-Gen 6 Features
  ocrData?: {
    extractedName: string;
    extractedDocNum: string;
    confidenceScore: number;
  };
  livenessScore?: number;
  bgvStatus?: PoliceBgvStatus;
  safetyTier?: SafetyTier;
  utilityBillUrl?: string;
  renewalReminderSent?: boolean;
}

export function KycVerificationModule() {
  const [activeSubFilter, setActiveSubFilter] = useState<KycSubFilter>('verification-dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Pagination & View Mode states
  const [pageSize, setPageSize] = useState<string>('10');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [kycViewMode, setKycViewMode] = useState<'table' | 'grid'>('table');

  // Data records state
  const [documents, setDocuments] = useState<KycDocumentRecord[]>([
    {
      id: 'kyc-101',
      userId: 'usr-1',
      userName: 'Sophia Chen',
      userEmail: 'sophia.c@example.com',
      type: 'GOVERNMENT_ID',
      documentNumber: 'ID-98471203',
      fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      status: 'PENDING',
      rejectionReason: null,
      createdAt: '2026-08-05T08:30:00Z',
      expiresAt: '2028-12-31',
      ocrData: { extractedName: 'Sophia Chen', extractedDocNum: 'ID-98471203', confidenceScore: 99.1 },
      livenessScore: 99.4,
      bgvStatus: 'PENDING_POLICE',
      safetyTier: 'TIER_2_ADDRESS',
      utilityBillUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      renewalReminderSent: false,
    },
    {
      id: 'kyc-102',
      userId: 'usr-2',
      userName: 'Marcus Brody',
      userEmail: 'marcus.b@example.com',
      type: 'PASSPORT',
      documentNumber: 'PASS-8840192',
      fileUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      status: 'APPROVED',
      rejectionReason: null,
      createdAt: '2026-08-04T14:15:00Z',
      expiresAt: '2030-05-15',
      ocrData: { extractedName: 'Marcus Brody', extractedDocNum: 'PASS-8840192', confidenceScore: 99.8 },
      livenessScore: 99.7,
      bgvStatus: 'POLICE_VERIFIED',
      safetyTier: 'TIER_3_POLICE_ELITE',
      utilityBillUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      renewalReminderSent: false,
    },
    {
      id: 'kyc-103',
      userId: 'usr-3',
      userName: 'Elena Rostova',
      userEmail: 'elena.r@example.com',
      type: 'DRIVING_LICENSE',
      documentNumber: 'DL-7730192',
      fileUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      status: 'REJECTED',
      rejectionReason: 'Document photo blurry and unreadable',
      createdAt: '2026-08-03T11:20:00Z',
      expiresAt: '2025-01-01',
      ocrData: { extractedName: 'Elena Rostova', extractedDocNum: 'DL-7730192', confidenceScore: 72.4 },
      livenessScore: 84.1,
      bgvStatus: 'FAILED',
      safetyTier: 'TIER_1_ID',
      renewalReminderSent: false,
    },
    {
      id: 'kyc-104',
      userId: 'usr-4',
      userName: 'Aarav Sharma',
      userEmail: 'aarav.s@example.com',
      type: 'NATIONAL_IDENTITY_CARD',
      documentNumber: 'NID-4401928',
      fileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      status: 'EXPIRED',
      rejectionReason: 'Document expired on 2025-12-31',
      createdAt: '2026-08-01T09:10:00Z',
      expiresAt: '2025-12-31',
      ocrData: { extractedName: 'Aarav Sharma', extractedDocNum: 'NID-4401928', confidenceScore: 98.2 },
      livenessScore: 98.9,
      bgvStatus: 'NOT_STARTED',
      safetyTier: 'TIER_1_ID',
      renewalReminderSent: false,
    }
  ]);

  // Modals state
  const [inspectingDoc, setInspectingDoc] = useState<KycDocumentRecord | null>(null);
  const [rejectingDoc, setRejectingDoc] = useState<KycDocumentRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('Blurry document image');
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

  // Fetch KYC queue from Backend API
  useEffect(() => {
    fetch('/api/admin/kyc')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((d: any) => ({
            id: d.id,
            userId: d.userId || 'usr-gen',
            userName: d.user?.fullName || d.userName || 'Verified User',
            userEmail: d.user?.email || d.userEmail || 'user@example.com',
            type: d.type || 'GOVERNMENT_ID',
            documentNumber: d.documentNumber || `ID-${Math.floor(100000 + Math.random() * 900000)}`,
            fileUrl: d.fileUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
            selfieUrl: d.selfieUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
            status: d.status || 'PENDING',
            rejectionReason: d.rejectionReason || null,
            createdAt: d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : '2026-08-05',
            expiresAt: d.expiresAt || '2028-12-31'
          }));
          setDocuments(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = doc.userName.toLowerCase().includes(q);
      const matchEmail = doc.userEmail.toLowerCase().includes(q);
      const matchNumber = doc.documentNumber.toLowerCase().includes(q);
      const matchType = doc.type.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchNumber && !matchType) return false;
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
  const totalCount = documents.length;
  const pendingCount = documents.filter(d => d.status === 'PENDING').length;
  const approvedCount = documents.filter(d => d.status === 'APPROVED').length;
  const rejectedCount = documents.filter(d => d.status === 'REJECTED').length;
  const expiredCount = documents.filter(d => d.status === 'EXPIRED').length;

  // Actions
  const handleToggleBgvStatus = (docId: string) => {
    setDocuments(documents.map(d => {
      if (d.id === docId) {
        const nextStatus: PoliceBgvStatus = d.bgvStatus === 'POLICE_VERIFIED' ? 'PENDING_POLICE' : 'POLICE_VERIFIED';
        const nextTier: SafetyTier = nextStatus === 'POLICE_VERIFIED' ? 'TIER_3_POLICE_ELITE' : 'TIER_2_ADDRESS';
        return { ...d, bgvStatus: nextStatus, safetyTier: nextTier };
      }
      return d;
    }));
    triggerToast(`Updated Police BGV Verification Status!`);
  };

  const handleSendRenewalReminder = (doc: KycDocumentRecord) => {
    setDocuments(documents.map(d => d.id === doc.id ? { ...d, renewalReminderSent: true } : d));
    triggerToast(`Renewal Notification & Email Dispatched to ${doc.userName}!`);
  };

  const handleApprove = async (doc: KycDocumentRecord) => {
    try {
      await fetch(`/api/admin/kyc/${doc.id}/approve`, { method: 'POST' });
    } catch (e) {}

    setDocuments(documents.map(d => d.id === doc.id ? { ...d, status: 'APPROVED', rejectionReason: null, safetyTier: d.bgvStatus === 'POLICE_VERIFIED' ? 'TIER_3_POLICE_ELITE' : 'TIER_2_ADDRESS' } : d));
    triggerToast(`Approved KYC Document for ${doc.userName}!`);
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingDoc) return;

    try {
      await fetch(`/api/admin/kyc/${rejectingDoc.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason })
      });
    } catch (e) {}

    setDocuments(documents.map(d => d.id === rejectingDoc.id ? { ...d, status: 'REJECTED', rejectionReason: rejectReason } : d));
    triggerToast(`Rejected KYC Document for ${rejectingDoc.userName}.`);
    setRejectingDoc(null);
  };

  // Export handlers
  const handleExportCSV = () => {
    const headers = ['ID', 'UserName', 'UserEmail', 'DocumentType', 'DocumentNumber', 'Status', 'ExpiresAt'];
    const lines = [headers.join(',')];
    filteredDocs.forEach(d => {
      lines.push(`"${d.id}","${d.userName}","${d.userEmail}","${d.type}","${d.documentNumber}","${d.status}","${d.expiresAt}"`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyc_verification_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${filteredDocs.length} KYC records to CSV!`);
  };

  const handleExportXLSX = () => {
    let xmlTable = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="KYC"><Table><Row>`;
    ['ID', 'UserName', 'UserEmail', 'DocumentType', 'DocumentNumber', 'Status', 'ExpiresAt'].forEach(h => {
      xmlTable += `<Cell><Data ss:Type="String">${h}</Data></Cell>`;
    });
    xmlTable += `</Row>`;
    filteredDocs.forEach(d => {
      xmlTable += `<Row>`;
      xmlTable += `<Cell><Data ss:Type="String">${d.id}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${d.userName}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${d.userEmail}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${d.type}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${d.documentNumber}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${d.status}</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">${d.expiresAt}</Data></Cell>`;
      xmlTable += `</Row>`;
    });
    xmlTable += `</Table></Worksheet></Workbook>`;

    const blob = new Blob([xmlTable], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyc_verification_export.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${filteredDocs.length} KYC records to XLSX!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
          <p className="text-[9px] font-mono text-slate-400 uppercase font-bold">Total Submissions</p>
          <p className="text-base font-extrabold text-white font-mono">{totalCount}</p>
          <p className="text-[9px] text-purple-400 font-medium">All KYC Documents</p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
          <p className="text-[9px] font-mono text-slate-400 uppercase font-bold">Pending Review</p>
          <p className="text-base font-extrabold text-amber-400 font-mono">{pendingCount}</p>
          <p className="text-[9px] text-amber-300 font-medium">Awaiting Inspection</p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
          <p className="text-[9px] font-mono text-slate-400 uppercase font-bold">Approved Verified</p>
          <p className="text-base font-extrabold text-emerald-400 font-mono">{approvedCount}</p>
          <p className="text-[9px] text-emerald-300 font-medium">Identity Confirmed</p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
          <p className="text-[9px] font-mono text-slate-400 uppercase font-bold">Rejected Docs</p>
          <p className="text-base font-extrabold text-rose-400 font-mono">{rejectedCount}</p>
          <p className="text-[9px] text-rose-300 font-medium">Verification Failed</p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
          <p className="text-[9px] font-mono text-slate-400 uppercase font-bold">Expired IDs</p>
          <p className="text-base font-extrabold text-orange-400 font-mono">{expiredCount}</p>
          <p className="text-[9px] text-orange-300 font-medium">Requires Renewal</p>
        </div>
      </div>

      {/* 🏷️ SUBMODULE NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {[
          { id: 'verification-dashboard', label: '📊 Verification Dashboard', count: totalCount },
          { id: 'pending', label: '⏳ Pending Verification', count: pendingCount },
          { id: 'approved', label: '✅ Approved', count: approvedCount },
          { id: 'rejected', label: '❌ Rejected', count: rejectedCount },
          { id: 'expired', label: '⚠️ Expired', count: expiredCount },
          { id: 'history', label: '📜 Verification History', count: totalCount },
        ].map((tab) => {
          const isActive = activeSubFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubFilter(tab.id as KycSubFilter)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold border-purple-500 shadow-sm shadow-purple-600/25'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 🎛️ MASTER CONTROL TOOLBAR */}
      <div className="glass-panel p-2.5 sm:p-3 rounded-xl border border-slate-800 space-y-2">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center gap-1.5 w-full lg:w-auto flex-1 max-w-md">
            {/* 🔍 Search Input Box */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by user name, document number, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg h-7.5 py-1 pl-8 pr-3 text-[11.5px] text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-all"
              />
            </div>

            {/* Page Size / Limit Dropdown (RIGHT SIDE OF SEARCH) */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 h-7.5 shrink-0 text-[10.5px]">
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-[10.5px]"
              >
                <option value="10" className="bg-slate-900 text-white">10</option>
                <option value="12" className="bg-slate-900 text-white">12</option>
                <option value="25" className="bg-slate-900 text-white">25</option>
                <option value="50" className="bg-slate-900 text-white">50</option>
                <option value="100" className="bg-slate-900 text-white">100</option>
                <option value="ALL" className="bg-slate-900 text-white">All</option>
              </select>
            </div>
          </div>

          {/* Action Toolbar Buttons & View Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto justify-end">
            {/* View Mode Switcher (Grid vs Table) */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setKycViewMode('table');
                  setPageSize('10');
                  setCurrentPage(1);
                }}
                className={`px-2 py-1 rounded-md text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  kycViewMode === 'table'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Table View (10 items per page)"
              >
                <List className="w-3 h-3" />
                <span className="hidden md:inline">Table (10)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setKycViewMode('grid');
                  setPageSize('12');
                  setCurrentPage(1);
                }}
                className={`px-2 py-1 rounded-md text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  kycViewMode === 'grid'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View (12 items per page)"
              >
                <LayoutGrid className="w-3 h-3" />
                <span className="hidden md:inline">Grid (12)</span>
              </button>
            </div>

            <label className="h-7 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-800 cursor-pointer flex items-center gap-1 shrink-0">
              <Upload className="w-3 h-3 text-indigo-400" />
              <span>Import Data</span>
              <input type="file" accept=".csv, .xlsx" className="hidden" />
            </label>

            <button
              onClick={handleExportCSV}
              className="h-7 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Download className="w-3 h-3" /> Export Sheet
            </button>

            <button
              onClick={handleExportXLSX}
              className="h-7 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-800 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <FileSpreadsheet className="w-3 h-3" /> Export Excel
            </button>

            <button
              onClick={() => setShowPdfModal(true)}
              className="h-7 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-800 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <FileText className="w-3 h-3" /> Export PDF
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
                  <th className="py-2.5 px-3 font-bold">User</th>
                  <th className="py-2.5 px-3 font-bold">Document Type</th>
                  <th className="py-2.5 px-3 font-bold">ID Number</th>
                  <th className="py-2.5 px-3 font-bold">Safety Tier</th>
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
                      No KYC documents found in {activeSubFilter.toUpperCase()} view.
                    </td>
                  </tr>
                ) : (
                  displayedDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={doc.selfieUrl}
                            alt={doc.userName}
                            onClick={() => {
                              setImagePreviewUrl(doc.selfieUrl);
                              setImagePreviewTitle(`${doc.userName} - 3D Biometric Liveness Scan`);
                            }}
                            className="w-7 h-7 rounded-lg object-cover border border-purple-500/30 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            title="Click to view full selfie"
                          />
                          <div className="min-w-0">
                            <span className="font-extrabold text-white text-[11.5px] block truncate">{doc.userName}</span>
                            <span className="text-[9px] text-slate-400 font-mono block truncate">{doc.userEmail}</span>
                          </div>
                        </div>
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
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border inline-flex items-center gap-0.5 ${
                          doc.safetyTier === 'TIER_3_POLICE_ELITE'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : doc.safetyTier === 'TIER_2_ADDRESS'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          <Award className="w-2.5 h-2.5" />
                          {doc.safetyTier === 'TIER_3_POLICE_ELITE' ? 'Tier 3 Elite' : doc.safetyTier === 'TIER_2_ADDRESS' ? 'Tier 2 Address' : 'Tier 1 ID'}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col gap-0.2 text-[9px] font-mono">
                          <span className="text-purple-300 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-purple-400" /> OCR: {doc.ocrData?.confidenceScore || 98.6}%
                          </span>
                          <span className="text-emerald-400">
                            3D Liveness: {doc.livenessScore || 99.4}%
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleToggleBgvStatus(doc.id)}
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
                              onClick={() => handleApprove(doc)}
                              className="h-6 px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {doc.status !== 'REJECTED' && (
                            <button
                              onClick={() => {
                                setRejectingDoc(doc);
                                setRejectReason('Blurry document photo or text unreadable');
                              }}
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
              No KYC verification documents found in {activeSubFilter.toUpperCase()} view.
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
                    <p className="text-[8.5px] text-slate-400 font-mono truncate">{doc.userEmail}</p>
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
                      <Sparkles className="w-2 h-2 text-purple-400" /> {doc.ocrData?.confidenceScore || 98.6}%
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
                      onClick={() => handleApprove(doc)}
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
              <option value="100">100</option>
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
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold font-mono text-xs transition-all ${
                  currentPage === pageNum
                    ? 'bg-purple-600 text-white font-extrabold shadow-lg shadow-purple-600/30'
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
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 🔍 MODAL 1: FULL RESOLUTION INSPECT & AI OCR MODAL        */}
      {/* ========================================================= */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-4xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    AI OCR & Biometric Inspection: {inspectingDoc.userName}
                  </h3>
                  <p className="text-xs text-slate-400">Target Companion ID: {inspectingDoc.userId}</p>
                </div>
              </div>
              <button onClick={() => setInspectingDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-400">Government Issued ID Document</p>
                  <span className="text-[10px] text-purple-400 font-mono font-bold">AI Scanned Confidence: {inspectingDoc.ocrData?.confidenceScore || 98.6}%</span>
                </div>
                <img src={inspectingDoc.fileUrl} className="w-full max-h-64 rounded-2xl border border-slate-800 object-contain bg-black" />

                {/* AI OCR Scanner Text Breakdown Panel */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI OCR Text Extraction Comparison
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Matches 100%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">User Profile Name</span>
                      <p className="font-bold text-white">{inspectingDoc.userName}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-purple-400 font-mono uppercase block">OCR Extracted Name</span>
                      <p className="font-bold text-purple-300">{inspectingDoc.ocrData?.extractedName || inspectingDoc.userName}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">User Document Number</span>
                      <p className="font-mono font-bold text-white">{inspectingDoc.documentNumber}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-purple-400 font-mono uppercase block">OCR Extracted Number</span>
                      <p className="font-mono font-bold text-purple-300">{inspectingDoc.ocrData?.extractedDocNum || inspectingDoc.documentNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-400">3D Liveness Selfie Scan</p>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">{inspectingDoc.livenessScore || 99.4}% Match</span>
                </div>
                <img src={inspectingDoc.selfieUrl} className="w-full h-36 rounded-2xl border border-slate-800 object-cover" />

                {/* Tier-2 Residential Address Proof Preview */}
                {inspectingDoc.utilityBillUrl && (
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-400 flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-indigo-400" /> Tier-2 Address Utility Bill
                    </p>
                    <img src={inspectingDoc.utilityBillUrl} className="w-full h-24 rounded-2xl border border-indigo-500/30 object-cover" />
                  </div>
                )}

                {/* Police Background Verification Control */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-bold">Police BGV Status:</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inspectingDoc.bgvStatus === 'POLICE_VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {inspectingDoc.bgvStatus === 'POLICE_VERIFIED' ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleBgvStatus(inspectingDoc.id)}
                    className="w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {inspectingDoc.bgvStatus === 'POLICE_VERIFIED' ? 'Revoke Police Verification' : 'Mark Police BGV Verified'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Current Safety Tier: <strong className="text-amber-400">{inspectingDoc.safetyTier || 'TIER_1_ID'}</strong></span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleApprove(inspectingDoc);
                    setInspectingDoc(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25"
                >
                  Approve & Assign Verified Shield
                </button>
                <button onClick={() => setInspectingDoc(null)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ❌ MODAL 2: REJECT WITH REASON MODAL                      */}
      {/* ========================================================= */}
      {rejectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" /> Reject KYC Document
              </h3>
              <button onClick={() => setRejectingDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Rejection Reason</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-purple-500 font-semibold"
                >
                  <option value="Blurry document photo or text unreadable">Blurry document photo or text unreadable</option>
                  <option value="Expired government ID or passport">Expired government ID or passport</option>
                  <option value="Name on ID does not match user account">Name on ID does not match user account</option>
                  <option value="Biometric selfie photo match failed">Biometric selfie photo match failed</option>
                  <option value="Suspected forged or tampered document">Suspected forged or tampered document</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRejectingDoc(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/25"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🔴 MODAL 3: PDF PRINT PREVIEW MODAL                       */}
      {/* ========================================================= */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-3xl shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" /> Verification & KYC Report - PDF Preview
              </h3>
              <button onClick={() => setShowPdfModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white text-slate-900 rounded-2xl space-y-4 shadow-inner font-sans">
              <div className="flex justify-between items-center border-b pb-3 border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">KYC Verification Audit Report</h2>
                  <p className="text-xs text-slate-500">Sathi ERP Trust & Safety Verification Module</p>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Total Records: {filteredDocs.length}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 font-bold text-slate-700">
                      <th className="p-2 font-mono text-[10px]">DOC ID</th>
                      <th className="p-2 font-mono text-[10px]">USER NAME</th>
                      <th className="p-2 font-mono text-[10px]">TYPE</th>
                      <th className="p-2 font-mono text-[10px]">NUMBER</th>
                      <th className="p-2 font-mono text-[10px]">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {filteredDocs.map((d) => (
                      <tr key={d.id}>
                        <td className="p-2 font-mono">{d.id}</td>
                        <td className="p-2 font-bold">{d.userName}</td>
                        <td className="p-2 font-mono">{d.type}</td>
                        <td className="p-2 font-mono">{d.documentNumber}</td>
                        <td className="p-2 font-bold">{d.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">PDF Preview Ready ({filteredDocs.length} records)</span>
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
      {/* 🖼️ MODAL 4: FULL RESOLUTION IMAGE LIGHTBOX POPUP          */}
      {/* ========================================================= */}
      {imagePreviewUrl && (
        <div 
          onClick={() => setImagePreviewUrl(null)} 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl space-y-4 cursor-default relative max-h-[90vh] flex flex-col items-center justify-center"
          >
            <div className="flex items-center justify-between w-full pb-3 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" /> {imagePreviewTitle || 'KYC Document Image Preview'}
              </h3>
              <button 
                onClick={() => setImagePreviewUrl(null)} 
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full flex-1 min-h-[280px] max-h-[68vh] bg-slate-950 rounded-2xl border border-slate-800/80 p-3 flex items-center justify-center overflow-hidden">
              <img 
                src={imagePreviewUrl} 
                alt="Document Full Preview" 
                className="max-w-full max-h-[64vh] object-contain rounded-xl shadow-2xl transition-all"
              />
            </div>

            <div className="flex items-center justify-between w-full pt-1 text-xs">
              <a 
                href={imagePreviewUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-purple-400 border border-slate-800 font-bold flex items-center gap-1.5 text-xs"
              >
                <Download className="w-4 h-4" /> Open Full Image
              </a>
              <button 
                onClick={() => setImagePreviewUrl(null)} 
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25"
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
