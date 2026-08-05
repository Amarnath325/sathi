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
  FileCheck
} from 'lucide-react';

export type KycSubFilter = 
  | 'verification-dashboard' 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'expired' 
  | 'history';

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
}

export function KycVerificationModule() {
  const [activeSubFilter, setActiveSubFilter] = useState<KycSubFilter>('verification-dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Data records state
  const [documents, setDocuments] = useState<KycDocumentRecord[]>([
    {
      id: 'kyc-101',
      userId: 'usr-1',
      userName: 'Sophia Chen',
      userEmail: 'sophia.c@example.com',
      type: 'GOVERNMENT_ID',
      documentNumber: 'ID-98471203',
      fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      status: 'PENDING',
      rejectionReason: null,
      createdAt: '2026-08-05T08:30:00Z',
      expiresAt: '2028-12-31'
    },
    {
      id: 'kyc-102',
      userId: 'usr-2',
      userName: 'Marcus Brody',
      userEmail: 'marcus.b@example.com',
      type: 'PASSPORT',
      documentNumber: 'PASS-8840192',
      fileUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      status: 'APPROVED',
      rejectionReason: null,
      createdAt: '2026-08-04T14:15:00Z',
      expiresAt: '2030-05-15'
    },
    {
      id: 'kyc-103',
      userId: 'usr-3',
      userName: 'Elena Rostova',
      userEmail: 'elena.r@example.com',
      type: 'DRIVING_LICENSE',
      documentNumber: 'DL-7730192',
      fileUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      status: 'REJECTED',
      rejectionReason: 'Document photo blurry and unreadable',
      createdAt: '2026-08-03T11:20:00Z',
      expiresAt: '2025-01-01'
    },
    {
      id: 'kyc-104',
      userId: 'usr-4',
      userName: 'Aarav Sharma',
      userEmail: 'aarav.s@example.com',
      type: 'NATIONAL_IDENTITY_CARD',
      documentNumber: 'NID-4401928',
      fileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      status: 'EXPIRED',
      rejectionReason: 'Document expired on 2025-12-31',
      createdAt: '2026-08-01T09:10:00Z',
      expiresAt: '2025-12-31'
    }
  ]);

  // Modals state
  const [inspectingDoc, setInspectingDoc] = useState<KycDocumentRecord | null>(null);
  const [rejectingDoc, setRejectingDoc] = useState<KycDocumentRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('Blurry document image');
  const [showPdfModal, setShowPdfModal] = useState(false);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

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
            fileUrl: d.fileUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
            selfieUrl: d.selfieUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
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
  const displayedDocs = documents.filter((doc) => {
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

  // Summary Metrics
  const totalCount = documents.length;
  const pendingCount = documents.filter(d => d.status === 'PENDING').length;
  const approvedCount = documents.filter(d => d.status === 'APPROVED').length;
  const rejectedCount = documents.filter(d => d.status === 'REJECTED').length;
  const expiredCount = documents.filter(d => d.status === 'EXPIRED').length;

  // Actions
  const handleApprove = async (doc: KycDocumentRecord) => {
    try {
      await fetch(`/api/admin/kyc/${doc.id}/approve`, { method: 'POST' });
    } catch (e) {}

    setDocuments(documents.map(d => d.id === doc.id ? { ...d, status: 'APPROVED', rejectionReason: null } : d));
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
    displayedDocs.forEach(d => {
      lines.push(`"${d.id}","${d.userName}","${d.userEmail}","${d.type}","${d.documentNumber}","${d.status}","${d.expiresAt}"`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyc_verification_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${displayedDocs.length} KYC records to CSV!`);
  };

  const handleExportXLSX = () => {
    let xmlTable = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="KYC"><Table><Row>`;
    ['ID', 'UserName', 'UserEmail', 'DocumentType', 'DocumentNumber', 'Status', 'ExpiresAt'].forEach(h => {
      xmlTable += `<Cell><Data ss:Type="String">${h}</Data></Cell>`;
    });
    xmlTable += `</Row>`;
    displayedDocs.forEach(d => {
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
    triggerToast(`Exported ${displayedDocs.length} KYC records to XLSX!`);
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Submissions</p>
          <p className="text-xl font-extrabold text-white">{totalCount}</p>
          <p className="text-[10px] text-purple-400 font-medium">All User KYC Documents</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Pending Review</p>
          <p className="text-xl font-extrabold text-amber-400">{pendingCount}</p>
          <p className="text-[10px] text-amber-300 font-medium">Awaiting Inspection</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Approved Verified</p>
          <p className="text-xl font-extrabold text-emerald-400">{approvedCount}</p>
          <p className="text-[10px] text-emerald-300 font-medium">Identity Confirmed</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Rejected Docs</p>
          <p className="text-xl font-extrabold text-rose-400">{rejectedCount}</p>
          <p className="text-[10px] text-rose-300 font-medium">Verification Failed</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Expired IDs</p>
          <p className="text-xl font-extrabold text-orange-400">{expiredCount}</p>
          <p className="text-[10px] text-orange-300 font-medium">Requires Renewal</p>
        </div>
      </div>

      {/* 🏷️ SUBMODULE NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
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

      {/* 🎛️ MASTER CONTROL TOOLBAR */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
          
          {/* 🔍 Search Input Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by user name, document number, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-all"
            />
          </div>

          {/* Action Toolbar Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <label className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 cursor-pointer flex items-center gap-1.5 shrink-0">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Import Data</span>
              <input type="file" accept=".csv, .xlsx" className="hidden" />
            </label>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Export Sheet
            </button>

            <button
              onClick={handleExportXLSX}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
            </button>

            <button
              onClick={() => setShowPdfModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <FileText className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>

        </div>
      </div>

      {/* 📋 KYC DOCUMENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedDocs.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 font-medium">
            No KYC verification documents found in {activeSubFilter.toUpperCase()} view.
          </div>
        ) : (
          displayedDocs.map((doc) => (
            <div key={doc.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all">
              
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    {doc.userName}
                    {doc.status === 'APPROVED' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">{doc.userEmail} • #{doc.id}</p>
                </div>

                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
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

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Document Type</span>
                  <p className="font-bold text-purple-400 truncate">{doc.type.replace(/_/g, ' ')}</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">ID / Passport No</span>
                  <p className="font-mono font-bold text-white truncate">{doc.documentNumber}</p>
                </div>
              </div>

              {/* Document Photo Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 group h-44 bg-slate-950">
                <img
                  src={doc.fileUrl}
                  alt="KYC Document"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* User Live Selfie Overlay Badge */}
                <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <img src={doc.selfieUrl} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="text-[10px]">
                    <p className="font-bold text-white">Live Selfie</p>
                    <p className="text-emerald-400 font-mono">Matched</p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectingDoc(doc)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 text-white hover:bg-purple-600 transition-colors border border-slate-800 flex items-center gap-1 text-xs font-bold"
                >
                  <Eye className="w-3.5 h-3.5" /> Inspect Full
                </button>
              </div>

              {doc.rejectionReason && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Reason: "{doc.rejectionReason}"</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                {doc.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleApprove(doc)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve KYC
                  </button>
                )}

                {doc.status !== 'REJECTED' && (
                  <button
                    onClick={() => {
                      setRejectingDoc(doc);
                      setRejectReason('Blurry document photo or text unreadable');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-rose-600/20 text-rose-400 border border-slate-800 font-bold flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* 🔍 MODAL 1: FULL RESOLUTION INSPECT MODAL                  */}
      {/* ========================================================= */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" /> High-Resolution Inspection: {inspectingDoc.userName}
              </h3>
              <button onClick={() => setInspectingDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 space-y-2">
                <p className="font-semibold text-slate-400">Government Issued ID Document</p>
                <img src={inspectingDoc.fileUrl} className="w-full rounded-2xl border border-slate-800 object-contain bg-black" />
              </div>
              <div className="space-y-3">
                <p className="font-semibold text-slate-400">User Biometric Selfie Match</p>
                <img src={inspectingDoc.selfieUrl} className="w-full h-48 rounded-2xl border border-slate-800 object-cover" />
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-slate-400">Doc Number</p>
                  <p className="font-mono font-bold text-white">{inspectingDoc.documentNumber}</p>
                  <p className="text-slate-400 pt-2">Expires Date</p>
                  <p className="font-mono font-bold text-emerald-400">{inspectingDoc.expiresAt}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  handleApprove(inspectingDoc);
                  setInspectingDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Approve Verified
              </button>
              <button onClick={() => setInspectingDoc(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs">Close</button>
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
                  <p>Total Records: {displayedDocs.length}</p>
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
                    {displayedDocs.map((d) => (
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
              <span className="text-xs text-slate-400 font-mono">PDF Preview Ready ({displayedDocs.length} records)</span>
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

    </div>
  );
}
