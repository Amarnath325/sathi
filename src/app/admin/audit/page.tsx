'use client';

import React, { useState } from 'react';
import { ScrollText, Link, ShieldCheck, Download, Clock, Search, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';
import { AuditLedgerTable } from '@/components/audit/AuditLedgerTable';
import { CryptographicIntegrityValidator } from '@/components/audit/CryptographicIntegrityValidator';
import { AuditSearchFilter } from '@/components/audit/AuditSearchFilter';
import { ComplianceExportManager } from '@/components/audit/ComplianceExportManager';
import { RetentionPolicyConfig } from '@/components/audit/RetentionPolicyConfig';
import { useAuditLogsStore } from '@/lib/auditLogsStore';

export default function AdminAuditLogsPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'verify' | 'search' | 'export' | 'retention'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const { auditLogs, isChainVerified, retentionPolicies, exportJobs } = useAuditLogsStore();

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDomain('ALL');
    setSelectedAction('ALL');
  };

  const filteredLogs = auditLogs.filter((log) => {
    const dMatch = selectedDomain === 'ALL' || log.resourceDomain === selectedDomain;
    const aMatch = selectedAction === 'ALL' || log.action === selectedAction;
    const qMatch =
      !searchQuery.trim() ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    return dMatch && aMatch && qMatch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <ScrollText className="w-6 h-6 text-emerald-400" /> Immutable System Audit Ledger
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SHA-256 Chain Secured
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cryptographically verifiable append-only system audit trail, SHA-256 hash integrity checks, and SOC2/HIPAA compliance exports
            </p>
          </div>

          <button
            onClick={() => setActiveTab('verify')}
            className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30 shrink-0"
          >
            <ShieldCheck className="w-4 h-4" /> Verify Chain Integrity
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Total Audit Records</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{auditLogs.length} Entries</div>
            <div className="text-[10px] text-slate-500 font-mono">Append-only ledger sequence</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Cryptographic Chain Status</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">
              {isChainVerified ? '100% VALID' : 'TAMPERED ⚠️'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">SHA-256 Hash Chained</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Compliance Export Packages</span>
              <Download className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{exportJobs.length} Packages</div>
            <div className="text-[10px] text-slate-500 font-mono">Signed proofs generated</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Active Retention Rules</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{retentionPolicies.length} Domains</div>
            <div className="text-[10px] text-slate-500 font-mono">SOC2 / HIPAA / GDPR rules</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800">
          {[
            { id: 'feed', label: '📜 Immutable Ledger Feed', icon: <ScrollText className="w-4 h-4" /> },
            { id: 'verify', label: '⛓️ Hash Chain Integrity Verifier', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'search', label: '🔍 SIEM Search & Query Matrix', icon: <Search className="w-4 h-4" /> },
            { id: 'export', label: '📦 Compliance Export & Proofs', icon: <Download className="w-4 h-4" /> },
            { id: 'retention', label: '⏳ Retention & Archiving Rules', icon: <Clock className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'gradient-bg-primary text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-2 space-y-4">
          {activeTab === 'feed' && (
            <>
              <AuditSearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDomain={selectedDomain}
                setSelectedDomain={setSelectedDomain}
                selectedAction={selectedAction}
                setSelectedAction={setSelectedAction}
                onReset={handleResetFilters}
              />
              <AuditLedgerTable logs={filteredLogs} />
            </>
          )}

          {activeTab === 'verify' && <CryptographicIntegrityValidator />}

          {activeTab === 'search' && (
            <>
              <AuditSearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDomain={selectedDomain}
                setSelectedDomain={setSelectedDomain}
                selectedAction={selectedAction}
                setSelectedAction={setSelectedAction}
                onReset={handleResetFilters}
              />
              <AuditLedgerTable logs={filteredLogs} />
            </>
          )}

          {activeTab === 'export' && <ComplianceExportManager />}
          {activeTab === 'retention' && <RetentionPolicyConfig />}
        </div>
      </div>
    </div>
  );
}
