'use client';

import React from 'react';
import { IncidentReport } from '@/lib/types';
import { ShieldAlert, AlertTriangle, FileText, UserX, Lock, Ban, CheckCircle2, Clock, Image as ImageIcon } from 'lucide-react';

interface IncidentReportCardProps {
  incident: IncidentReport;
  onAudit: (incident: IncidentReport) => void;
}

export function IncidentReportCard({ incident, onAudit }: IncidentReportCardProps) {
  const isCritical = incident.severity === 'CRITICAL' || incident.severity === 'SERIOUS';
  const isResolved = incident.status === 'RESOLVED' || incident.status === 'ACTION_TAKEN' || incident.status === 'DISMISSED';

  return (
    <div className={`p-5 rounded-3xl transition-all border shadow-lg flex flex-col justify-between ${
      isResolved
        ? 'bg-slate-900/90 border-slate-800'
        : isCritical
        ? 'bg-slate-900 border-amber-500/50 shadow-amber-500/5'
        : 'bg-slate-900 border-slate-800'
    }`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-indigo-400">{incident.incidentRef}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
              incident.category === 'HARASSMENT'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : incident.category === 'STALKING'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : incident.category === 'IDENTITY_MISMATCH'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {incident.category.replace('_', ' ')}
            </span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
            incident.status === 'PENDING_AUDIT'
              ? 'bg-amber-500/20 text-amber-300'
              : incident.status === 'INVESTIGATING'
              ? 'bg-indigo-500/20 text-indigo-300'
              : incident.status === 'ACTION_TAKEN'
              ? 'bg-rose-500/20 text-rose-300'
              : 'bg-emerald-500/20 text-emerald-300'
          }`}>
            {incident.status.replace('_', ' ')}
          </span>
        </div>

        {/* Reporter vs Target */}
        <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Reporter</span>
            <span className="font-bold text-white block truncate">{incident.reporterName}</span>
            <span className="text-[10px] text-indigo-400 block uppercase font-mono">{incident.reporterRole}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Offender Target</span>
            <span className="font-bold text-rose-300 block truncate">{incident.targetName}</span>
            <span className="text-[10px] text-rose-400 block uppercase font-mono">{incident.targetRole}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-light">
          {incident.description}
        </p>

        {/* Attachments & Disciplinary Action */}
        <div className="flex items-center justify-between text-xs pt-1">
          {incident.evidenceUrls && incident.evidenceUrls.length > 0 ? (
            <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> {incident.evidenceUrls.length} File Evidence(s)
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">No Attachments</span>
          )}

          {incident.disciplinaryAction !== 'NONE' && (
            <span className="px-2 py-0.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-bold flex items-center gap-1">
              <Ban className="w-3 h-3 text-rose-400" /> {incident.disciplinaryAction.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" /> {new Date(incident.filedAt).toLocaleDateString()}
        </span>

        <button
          onClick={() => onAudit(incident)}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" /> Audit Incident
        </button>
      </div>
    </div>
  );
}
