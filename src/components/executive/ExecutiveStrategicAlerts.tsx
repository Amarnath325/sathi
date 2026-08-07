'use client';

import React from 'react';
import { useExecutiveStore, ExecutiveAlertItem } from '@/lib/executiveStore';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, FileText, ExternalLink } from 'lucide-react';

export default function ExecutiveStrategicAlerts() {
  const { alerts, acknowledgeAlert, resolveAlert, reports } = useExecutiveStore();

  const getSeverityBadge = (severity: ExecutiveAlertItem['severity']) => {
    if (severity === 'CRITICAL') {
      return {
        bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        icon: ShieldAlert,
        dot: 'bg-rose-500',
      };
    }
    if (severity === 'WARNING') {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        icon: AlertTriangle,
        dot: 'bg-amber-500',
      };
    }
    return {
      bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      icon: Info,
      dot: 'bg-blue-500',
    };
  };

  const getStatusBadge = (status: ExecutiveAlertItem['status']) => {
    if (status === 'RESOLVED') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (status === 'ACKNOWLEDGED') {
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Strategic Live Alert Desk (2 columns) */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">C-Suite Strategic Alerts Desk</h3>
              <p className="text-xs text-slate-400">Real-time risk mitigation, compliance notifications & surge flags</p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
            {alerts.filter((a) => a.status === 'OPEN').length} ACTION REQUIRED
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((item) => {
            const sev = getSeverityBadge(item.severity);
            const Icon = sev.icon;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all hover:bg-slate-900"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border ${sev.bg} shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${sev.bg}`}>
                        {item.category}
                      </span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>

                    {item.actionRequired && (
                      <p className="text-[11px] text-indigo-400 font-semibold mt-1">
                        👉 Action Required: {item.actionRequired}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {item.status === 'OPEN' && (
                    <button
                      onClick={() => acknowledgeAlert(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                    >
                      Acknowledge
                    </button>
                  )}

                  {item.status !== 'RESOLVED' && (
                    <button
                      onClick={() => resolveAlert(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Board Decks & Reports (1 column) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Board Reports</h3>
              <p className="text-xs text-slate-400">Exported C-suite audit documents</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {reports.map((rpt) => (
            <div key={rpt.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{rpt.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{rpt.periodCovered}</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-mono text-[9px] font-bold border border-indigo-500/30 shrink-0">
                  {rpt.fileFormat}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                <span>By {rpt.generatedBy}</span>
                <a
                  href={rpt.downloadUrl}
                  onClick={(e) => { e.preventDefault(); alert(`Downloading report: ${rpt.title}`); }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  Download <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
