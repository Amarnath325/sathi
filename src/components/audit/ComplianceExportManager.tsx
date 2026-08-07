'use client';

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, ShieldCheck, Plus, CheckCircle2, Clock } from 'lucide-react';
import { useAuditLogsStore, ComplianceExportJob } from '@/lib/auditLogsStore';

export function ComplianceExportManager() {
  const { exportJobs, createExportJob } = useAuditLogsStore();

  const [domainFilter, setDomainFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-08-01');
  const [format, setFormat] = useState<'CSV' | 'JSON' | 'PDF_REPORT' | 'CRYPTOGRAPHIC_PROOF'>('CRYPTOGRAPHIC_PROOF');

  const handleCreateExport = (e: React.FormEvent) => {
    e.preventDefault();
    createExportJob({
      requestedBy: 'Alexander Vance (CTO)',
      domainFilter,
      startDate,
      endDate,
      format,
    });
  };

  return (
    <div className="space-y-6">
      {/* Create Export Form Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-indigo-400" /> Generate Compliance Audit Export & Cryptographic Proof
        </h3>

        <form onSubmit={handleCreateExport} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300">Domain Filter</label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Domains</option>
              <option value="FINANCE_AND_ESCROW">Finance & Escrow</option>
              <option value="TRUST_AND_SAFETY">Trust & Safety</option>
              <option value="STAFF_RBAC">Staff & RBAC</option>
              <option value="SYSTEM_CONFIG">System Settings</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Export Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="CRYPTOGRAPHIC_PROOF">Signed Cryptographic Proof (.json)</option>
              <option value="CSV">Raw CSV Audit Ledger (.csv)</option>
              <option value="JSON">Structured JSON (.json)</option>
              <option value="PDF_REPORT">Compliance PDF Summary Report (.pdf)</option>
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" /> Generate Export Package
            </button>
          </div>
        </form>
      </div>

      {/* Export Jobs History Table */}
      <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Requested By</th>
                <th className="p-4">Domain Filter</th>
                <th className="p-4">Format</th>
                <th className="p-4">Date Range</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {exportJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-4 font-sans font-bold text-white">{job.requestedBy}</td>
                  <td className="p-4 text-indigo-400 font-bold text-[10px]">{job.domainFilter}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      {job.format}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] text-slate-400">{job.startDate} → {job.endDate}</td>
                  <td className="p-4 font-sans">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
                    </span>
                  </td>
                  <td className="p-4 text-right font-sans">
                    <a
                      href={job.fileUrl}
                      download
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-400 text-xs font-bold inline-flex items-center gap-1 border border-slate-800"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
