'use client';

import React from 'react';
import { useAnalyticsStore } from '@/lib/analyticsStore';
import { FileText, Calendar, Trash2, Play, Download, Clock, CheckCircle2 } from 'lucide-react';

export default function SavedReportsTable() {
  const { savedReports, exportHistory, deleteReportTemplate, triggerExport, searchFilter } = useAnalyticsStore();

  const filteredReports = savedReports.filter((r) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.domain.toLowerCase().includes(q) ||
      r.createdBy.toLowerCase().includes(q)
    );
  });

  const handleRunNow = async (title: string, format: 'PDF' | 'CSV' | 'XLSX') => {
    alert(`Running automated execution for report: "${title}"...`);
    await triggerExport(title, format);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Saved Report Templates Table (2 columns) */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Saved Report Templates</h3>
              <p className="text-xs text-slate-400">Recurring automated reports and custom query configurations</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
            {savedReports.length} SAVED
          </span>
        </div>

        <div className="space-y-3">
          {filteredReports.map((rpt) => (
            <div
              key={rpt.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-900"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    {rpt.domain}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {rpt.outputFormat}
                  </span>
                  {rpt.recurrence !== 'NONE' && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {rpt.recurrence}
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white mt-1">{rpt.title}</h4>
                <p className="text-[11px] text-slate-400">
                  Metrics: {rpt.metrics.join(', ')} • Group by: {rpt.groupBy} ({rpt.timeframe})
                </p>

                <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1">
                  <span>Created by: {rpt.createdBy}</span>
                  <span>•</span>
                  <span>Last run: {new Date(rpt.lastRunAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleRunNow(rpt.title, rpt.outputFormat)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 flex items-center gap-1 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Run Now
                </button>

                <button
                  onClick={() => deleteReportTemplate(rpt.id)}
                  title="Delete Template"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Download History Log (1 column) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Export History</h3>
              <p className="text-xs text-slate-400">Audit log of generated data downloads</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {exportHistory.map((exp) => (
            <div key={exp.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{exp.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{exp.recordCount} Records • {exp.fileSize}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[9px] font-bold border border-indigo-500/30 shrink-0">
                  {exp.format}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                <a
                  href={exp.downloadUrl}
                  onClick={(e) => { e.preventDefault(); alert(`Downloading file: ${exp.title}`); }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  Download <Download className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
