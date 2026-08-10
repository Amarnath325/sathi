'use client';

import React, { useState } from 'react';
import { Scale, ShieldAlert, CheckCircle2, X, AlertOctagon, FileText } from 'lucide-react';
import { useCommunicationStore, DisputeReportRecord } from '@/lib/communicationStore';

interface DisputeReportModalProps {
  conversationId: string;
  companionName: string;
  onClose: () => void;
}

export default function DisputeReportModal({ conversationId, companionName, onClose }: DisputeReportModalProps) {
  const { submitDisputeReport } = useCommunicationStore();
  const [category, setCategory] = useState<DisputeReportRecord['category']>('SAFETY_CONCERN');
  const [description, setDescription] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const report = submitDisputeReport(conversationId, companionName, category, description);
    setSubmittedCode(report.disputeCode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full glass-panel border border-rose-500/40 rounded-3xl p-6 relative space-y-5 shadow-2xl overflow-hidden text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {submittedCode ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Dispute Case Filed Successfully</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your incident audit case has been logged with Sathi Compliance & Legal Review Board.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Incident Tracking Code</span>
              <p className="text-base font-extrabold font-mono text-emerald-400">{submittedCode}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl gradient-bg-primary text-xs font-bold text-white shadow-lg"
            >
              Return to Chat
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">File Formal Incident & Dispute Report</h3>
                <p className="text-[11px] text-slate-400">Target Companion: {companionName}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300">Incident Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="SAFETY_CONCERN">🚨 Safety or Threat Concern</option>
                <option value="HARASSMENT">⚠️ Harassment or Inappropriate Conduct</option>
                <option value="PAYMENT_DISPUTE">💳 Escrow & Payment Dispute</option>
                <option value="POLICY_VIOLATION">📋 Platform Rules / Anti-Bypass Violation</option>
                <option value="OTHER">📁 Other General Dispute</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300">Detailed Statement & Evidence</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred during the session. Chat logs and encrypted audit transcripts will be attached automatically..."
                rows={4}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <FileText className="w-3.5 h-3.5" /> Automatic Audit Trail Enclosed
              </div>
              <p>AES-256 chat transcripts and session location timestamps will be securely transmitted to Sathi Dispute Officer.</p>
            </div>

            <button
              type="submit"
              disabled={!description.trim()}
              className="w-full py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-500 shadow-xl shadow-rose-900/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <AlertOctagon className="w-4 h-4" /> SUBMIT FORMAL DISPUTE REPORT
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
