'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Scale, ShieldAlert, FileText, CheckCircle2, Clock, Plus, Search, MessageSquare, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import { SearchAndLimitBar, PaginationFooter, PageSizeOption } from '@/components/common/PaginationBar';
import { DisputeFileModal } from '@/components/dispute/DisputeFileModal';
import { DisputeThreadDrawer } from '@/components/dispute/DisputeThreadDrawer';
import { DisputeTicket } from '@/lib/types';

export default function PublicDisputeHubPage() {
  const { disputes } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [drawerDispute, setDrawerDispute] = useState<DisputeTicket | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredDisputes = useMemo(() => {
    let result = [...disputes];

    if (selectedStatus !== 'ALL') {
      result = result.filter(d => d.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        d =>
          d.disputeRef.toLowerCase().includes(q) ||
          d.bookingNumber.toLowerCase().includes(q) ||
          d.reason.toLowerCase().includes(q) ||
          d.companionName.toLowerCase().includes(q) ||
          d.customerName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [disputes, selectedStatus, searchQuery]);

  const paginatedDisputes = useMemo(() => {
    if (pageSize === 'All') return filteredDisputes;
    const start = (currentPage - 1) * pageSize;
    return filteredDisputes.slice(start, start + pageSize);
  }, [filteredDisputes, currentPage, pageSize]);

  const triggerNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-2xl animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white">Dispute & Resolution Portal</h1>
                <p className="text-[10px] text-purple-400 font-mono">Sathi Escrow Protection & Arbitration</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFileModalOpen(true)}
              className="px-4 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> File New Dispute
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
              Fair Arbitration & Escrow Protection <ShieldAlert className="w-5 h-5 text-purple-400" />
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Every booking made on Sathi ERP holds funds in secure escrow. If any issue arises regarding punctuality, quality, or safety, our neutral arbitration team investigates timestamps and evidence to guarantee fair refunds or settlements.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Escrow Guarantee</span>
            <div className="text-lg font-bold text-emerald-400">100% Protected</div>
            <span className="text-[10px] text-slate-400">Neutral Admin Audit</span>
          </div>
        </div>

        {/* Toolbar (Search + Limit Selector Right Side) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {['ALL', 'OPEN_LODGED', 'UNDER_ARBITRATION', 'RESOLVED_REFUNDED', 'RESOLVED_DISMISSED'].map((status) => (
                <button
                  key={status}
                  onClick={() => { setSelectedStatus(status); setCurrentPage(1); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedStatus === status
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {status === 'ALL' ? 'All Tickets' : status.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Standardized Search & Limit Selector Bar */}
            <SearchAndLimitBar
              searchQuery={searchQuery}
              onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              pageSize={pageSize}
              onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
              placeholder="Search by ref, booking number, reason..."
            />
          </div>

          {/* Cards Grid */}
          {paginatedDisputes.length === 0 ? (
            <div className="p-16 text-center text-slate-500 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
              <Scale className="w-12 h-12 text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-white">No dispute tickets found</h3>
              <p className="text-xs text-slate-400">There are no dispute tickets matching your current search and filter settings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDisputes.map((dispute) => (
                <div key={dispute.id} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-purple-400">{dispute.disputeRef}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        dispute.status.startsWith('RESOLVED')
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {dispute.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base">{dispute.reason}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{dispute.detailedDescription}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Booking Ref</span>
                        <span className="font-mono font-bold text-slate-200">{dispute.bookingNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Companion</span>
                        <span className="font-bold text-white">{dispute.companionName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Disputed Amount</span>
                        <span className="font-mono font-bold text-emerald-400">${dispute.disputedAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      Filed: {new Date(dispute.filedAt).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => setDrawerDispute(dispute)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Chat ({dispute.messages.length})</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Pagination Footer */}
          {filteredDisputes.length > 0 && (
            <PaginationFooter
              currentPage={currentPage}
              totalItems={filteredDisputes.length}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
              labelSingular="ticket"
              labelPlural="tickets"
            />
          )}

        </div>

      </main>

      {/* File Dispute Modal */}
      {isFileModalOpen && (
        <DisputeFileModal
          bookingId="bk-sample-101"
          bookingNumber="CC-2026-9901"
          customerId="usr-current"
          customerName="Valued Client"
          customerEmail="client@sathi.com"
          companionId="comp-101"
          companionName="Sophia Chen"
          companionEmail="sophia.chen@example.com"
          disputedAmount={180}
          onClose={() => setIsFileModalOpen(false)}
          onSuccessNotification={(msg) => triggerNotify(msg)}
        />
      )}

      {/* Live Arbitration Chat Drawer */}
      {drawerDispute && (
        <DisputeThreadDrawer
          dispute={drawerDispute}
          onClose={() => setDrawerDispute(null)}
        />
      )}

    </div>
  );
}
