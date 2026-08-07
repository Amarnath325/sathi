'use client';

import React, { useState } from 'react';
import { useAnalyticsStore, AnalyticsDomainTab, SavedReportRecord } from '@/lib/analyticsStore';
import { X, FileText, CheckCircle2, Sliders, Calendar, Layers, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportBuilderModal({ isOpen, onClose }: Props) {
  const { saveReportTemplate } = useAnalyticsStore();

  const [title, setTitle] = useState('Quarterly Escrow & Revenue Audit Deck');
  const [domain, setDomain] = useState<AnalyticsDomainTab>('FINANCIAL');
  const [groupBy, setGroupBy] = useState<SavedReportRecord['groupBy']>('DATE');
  const [timeframe, setTimeframe] = useState<SavedReportRecord['timeframe']>('30D');
  const [recurrence, setRecurrence] = useState<SavedReportRecord['recurrence']>('MONTHLY');
  const [outputFormat, setOutputFormat] = useState<SavedReportRecord['outputFormat']>('PDF');

  // Selected Metric Options
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['gmv', 'net_revenue', 'escrow_holding']);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const availableMetrics = [
    { key: 'gmv', label: 'Gross Merchandise Value (GMV)' },
    { key: 'net_revenue', label: 'Platform Net Margin' },
    { key: 'escrow_holding', label: 'Escrow Liquidity Reserves' },
    { key: 'active_users', label: 'Active User Growth' },
    { key: 'kyc_approval_rate', label: 'KYC Biometric Verification Rate' },
    { key: 'companion_retention', label: 'Companion Retention Index' },
    { key: 'sos_alerts', label: 'Trust & Safety SOS Alerts' },
    { key: 'dispute_rate', label: 'Escrow Dispute & Chargeback Rate' },
  ];

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;

    saveReportTemplate({
      title,
      domain,
      metrics: selectedMetrics,
      groupBy,
      timeframe,
      recurrence,
      outputFormat,
      createdBy: 'Alexander Vance (CFO)',
    });

    setSuccessMsg('Report Template created & added to saved library.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-xl p-6 rounded-3xl border border-slate-800 bg-slate-950/95 shadow-2xl space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Custom Analytics Report Builder</h3>
              <p className="text-xs text-slate-400">Configure metrics, grouping dimensions & automated schedules</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Report Template Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
            />
          </div>

          {/* Select Domain & Timeframe */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Analytics Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="OVERVIEW">Executive Overview</option>
                <option value="FINANCIAL">Financial & Revenue</option>
                <option value="USER_GROWTH">User Growth & Retention</option>
                <option value="OPERATIONS">Booking Operations</option>
                <option value="SAFETY">Trust & Safety</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Period Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
                <option value="90D">Quarterly (90 Days)</option>
                <option value="1Y">1 Full Year</option>
              </select>
            </div>
          </div>

          {/* Select Metrics Checkboxes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Select Included Metrics</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableMetrics.map((m) => {
                const isSelected = selectedMetrics.includes(m.key);
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => toggleMetric(m.key)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500/50 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{m.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GroupBy, Schedule, Format */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Group By</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="DATE">By Date</option>
                <option value="CATEGORY">By Service Category</option>
                <option value="REGION">By Region</option>
                <option value="TIER">By Companion Tier</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Recurrence Schedule</label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="NONE">Manual Run Only</option>
                <option value="DAILY">Daily Digest</option>
                <option value="WEEKLY">Weekly Automation</option>
                <option value="MONTHLY">Monthly Audit</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Output Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="PDF">PDF Report</option>
                <option value="CSV">CSV Data Export</option>
                <option value="XLSX">Excel Workbook</option>
              </select>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30"
          >
            Save Report Template
          </button>
        </div>
      </div>
    </div>
  );
}
