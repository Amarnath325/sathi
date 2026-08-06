'use client';

import React, { useState } from 'react';
import { IncidentReport, DisciplinaryAction, IncidentStatus } from '@/lib/types';
import { X, ShieldAlert, FileText, Ban, Lock, AlertTriangle, CheckCircle2, UserX, Image as ImageIcon, Send } from 'lucide-react';

interface IncidentAuditModalProps {
  isOpen: boolean;
  incident: IncidentReport | null;
  onClose: () => void;
  onApplyAction: (id: string, action: DisciplinaryAction, notes?: string) => void;
  onUpdateStatus: (id: string, status: IncidentStatus, notes?: string) => void;
}

export function IncidentAuditModal({ isOpen, incident, onClose, onApplyAction, onUpdateStatus }: IncidentAuditModalProps) {
  const [selectedAction, setSelectedAction] = useState<DisciplinaryAction>('ESCROW_FROZEN');
  const [adminNotes, setAdminNotes] = useState('');

  if (!isOpen || !incident) return null;

  const handleEnforceDisciplinary = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyAction(incident.id, selectedAction, adminNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl p-6 glass-panel rounded-3xl border border-indigo-500/40 shadow-2xl space-y-6 bg-slate-950/95 text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-indigo-300 text-sm">{incident.incidentRef}</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-extrabold uppercase">
                {incident.severity} SEVERITY
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Trust & Safety Incident Audit</h3>
          </div>
        </div>

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Reporting Party</span>
            <span className="font-bold text-white block">{incident.reporterName}</span>
            <span className="text-[10px] text-indigo-400 block font-mono">Role: {incident.reporterRole} (ID: {incident.reporterId})</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Accused Target</span>
            <span className="font-bold text-rose-300 block">{incident.targetName}</span>
            <span className="text-[10px] text-rose-400 block font-mono">Role: {incident.targetRole} (ID: {incident.targetId})</span>
          </div>
        </div>

        {/* Description & Evidence */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Incident Allegation Statement</label>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {incident.description}
          </div>

          {incident.evidenceUrls && incident.evidenceUrls.length > 0 && (
            <div className="pt-2">
              <label className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider block mb-2">Attached Photo/Doc Evidence</label>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {incident.evidenceUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Evidence ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded-xl border border-slate-800 hover:border-indigo-500 transition-all cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disciplinary Enforcement Form */}
        <form onSubmit={handleEnforceDisciplinary} className="space-y-4 pt-2 border-t border-slate-800">
          <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
            Select Disciplinary Action
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'WARNING_ISSUED', label: 'Issue Official Warning', color: 'border-amber-500/50 bg-amber-950/20 text-amber-300' },
              { id: 'ESCROW_FROZEN', label: 'Freeze Booking Escrow', color: 'border-indigo-500/50 bg-indigo-950/20 text-indigo-300' },
              { id: 'TEMPORARY_SUSPENSION', label: 'Suspend Account 30 Days', color: 'border-purple-500/50 bg-purple-950/20 text-purple-300' },
              { id: 'PERMANENT_BAN', label: 'Permanent Network Ban', color: 'border-rose-500/50 bg-rose-950/20 text-rose-300' },
              { id: 'LAW_ENFORCEMENT_ESCALATION', label: 'Escalate to Police / Law', color: 'border-rose-600 bg-rose-950/40 text-white' },
              { id: 'NONE', label: 'Dismiss Incident', color: 'border-slate-800 bg-slate-900 text-slate-400' }
            ].map(act => (
              <button
                key={act.id}
                type="button"
                onClick={() => setSelectedAction(act.id as DisciplinaryAction)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                  selectedAction === act.id
                    ? `${act.color} ring-2 ring-indigo-500`
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400">Administrative Audit Notes & Rationale</label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="Enter administrative audit findings, escrow lock details, or disciplinary explanation..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Enforce Disciplinary Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
