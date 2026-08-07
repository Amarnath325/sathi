'use client';

import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { AuditDomain, AuditAction } from '@/lib/auditLogsStore';

interface AuditSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDomain: string;
  setSelectedDomain: (d: string) => void;
  selectedAction: string;
  setSelectedAction: (a: string) => void;
  onReset: () => void;
}

const DOMAIN_OPTIONS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Domains' },
  { key: 'FINANCE_AND_ESCROW', label: 'Finance & Escrow' },
  { key: 'TRUST_AND_SAFETY', label: 'Trust & Safety' },
  { key: 'STAFF_RBAC', label: 'Staff & RBAC' },
  { key: 'SYSTEM_CONFIG', label: 'System Settings' },
  { key: 'USERS', label: 'User Accounts' },
  { key: 'BOOKINGS', label: 'Bookings & Escrow' },
  { key: 'REVIEWS', label: 'Review Moderation' },
  { key: 'KYC_VERIFICATION', label: 'KYC Verification' },
];

const ACTION_OPTIONS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Action Types' },
  { key: 'CREATE', label: 'CREATE' },
  { key: 'READ', label: 'READ' },
  { key: 'UPDATE', label: 'UPDATE' },
  { key: 'DELETE', label: 'DELETE' },
  { key: 'EXECUTE', label: 'EXECUTE' },
  { key: 'AUTHENTICATE', label: 'AUTHENTICATE' },
  { key: 'AUTHORIZE_OVERRIDE', label: 'AUTHORIZE OVERRIDE' },
  { key: 'EXPORT', label: 'EXPORT' },
];

export function AuditSearchFilter({
  searchQuery,
  setSearchQuery,
  selectedDomain,
  setSelectedDomain,
  selectedAction,
  setSelectedAction,
  onReset,
}: AuditSearchFilterProps) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by actor name, email, IP, or resource..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Domain & Action Selectors */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
        >
          {DOMAIN_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
        >
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={onReset}
          className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Reset Filters"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
