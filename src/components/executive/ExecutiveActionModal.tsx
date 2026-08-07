'use client';

import React, { useState } from 'react';
import { useExecutiveStore, ExecutiveReportItem } from '@/lib/executiveStore';
import { X, SlidersHorizontal, ShieldAlert, FileText, CheckCircle, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  modalType: 'COMMISSION' | 'AUDIT' | 'REPORT' | null;
  onClose: () => void;
}

export default function ExecutiveActionModal({ isOpen, modalType, onClose }: Props) {
  const { escrowCommissionRate, setEscrowCommissionRate, generateReport, triggerSecurityLockdownAudit, isGeneratingReport } = useExecutiveStore();

  const [rateInput, setRateInput] = useState(escrowCommissionRate.toString());
  const [reportTitle, setReportTitle] = useState('Executive Board Financial Deck Q3');
  const [reportType, setReportType] = useState<ExecutiveReportItem['reportType']>('WEEKLY_BOARD_DECK');
  const [fileFormat, setFileFormat] = useState<ExecutiveReportItem['fileFormat']>('PDF');
  const [isAuditing, setIsAuditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !modalType) return null;

  const handleSaveCommission = () => {
    const val = parseFloat(rateInput);
    if (!isNaN(val)) {
      setEscrowCommissionRate(val);
      setSuccessMsg(`Escrow Commission updated to ${val}%`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    await triggerSecurityLockdownAudit();
    setIsAuditing(false);
    setSuccessMsg('Security Threat Audit completed. Output logged to alerts.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleGenerateReport = async () => {
    await generateReport(reportTitle, reportType, fileFormat);
    setSuccessMsg('Board deck generated & added to report archive.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-800 bg-slate-950/95 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            {modalType === 'COMMISSION' && (
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
            )}
            {modalType === 'AUDIT' && (
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
            )}
            {modalType === 'REPORT' && (
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-white">
                {modalType === 'COMMISSION' && 'Adjust Escrow Margin Rate'}
                {modalType === 'AUDIT' && 'Trigger Executive Threat Audit'}
                {modalType === 'REPORT' && 'Export Board Report Deck'}
              </h3>
              <p className="text-xs text-slate-400">
                {modalType === 'COMMISSION' && 'Modify platform fee percentage across companion transactions'}
                {modalType === 'AUDIT' && 'Run automated deep security scan across API endpoints and 2FA'}
                {modalType === 'REPORT' && 'Generate formatted PDF or CSV summary for C-Suite board presentation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {modalType === 'COMMISSION' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Escrow Commission Take-Rate (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="50"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-indigo-500"
                />
                <span className="text-slate-400 text-sm font-bold">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Current active rate: <strong className="text-indigo-400">{escrowCommissionRate}%</strong>. Modifying this rate recalculates platform net yield forecasts in real time.
              </p>
            </div>
          </div>
        )}

        {modalType === 'AUDIT' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2">
              <p className="font-bold">⚠️ Executive Authorization Notice</p>
              <p>
                Initiating this audit will execute real-time threat detection across server endpoints, rate limiters, and 2FA authentication logs.
              </p>
            </div>
          </div>
        )}

        {modalType === 'REPORT' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Report Document Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Report Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="WEEKLY_BOARD_DECK">Weekly Board Deck</option>
                  <option value="MONTHLY_FINANCIAL_AUDIT">Monthly Financial Audit</option>
                  <option value="SECURITY_COMPLIANCE_SUMMARY">Security Compliance</option>
                  <option value="QUARTERLY_TAX_RESERVE">Tax & Escrow Reserve</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Export Format</label>
                <select
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="PDF">PDF Presentation</option>
                  <option value="CSV">CSV Data Export</option>
                  <option value="XLSX">Excel Spreadsheet</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800"
          >
            Cancel
          </button>

          {modalType === 'COMMISSION' && (
            <button
              onClick={handleSaveCommission}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
            >
              Update Margin Rate
            </button>
          )}

          {modalType === 'AUDIT' && (
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/30 flex items-center gap-2"
            >
              {isAuditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              {isAuditing ? 'Auditing...' : 'Run Security Scan'}
            </button>
          )}

          {modalType === 'REPORT' && (
            <button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              {isGeneratingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              {isGeneratingReport ? 'Generating...' : 'Generate Deck'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
