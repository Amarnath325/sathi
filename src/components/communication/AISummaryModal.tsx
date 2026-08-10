'use client';

import React, { useMemo } from 'react';
import { Sparkles, X, CheckCircle2, ShieldCheck, FileText, Download } from 'lucide-react';
import { generateChatAndMeetingSummary } from '@/lib/aiEngine';
import { FullChatMessage } from '@/lib/communicationStore';

interface AISummaryModalProps {
  companionName: string;
  messages: FullChatMessage[];
  onClose: () => void;
}

export default function AISummaryModal({ companionName, messages, onClose }: AISummaryModalProps) {
  const summary = useMemo(
    () => generateChatAndMeetingSummary(messages, companionName),
    [messages, companionName]
  );

  const handleExportText = () => {
    const textContent = `
AI MEETING & COMMUNICATION SUMMARY
Companion: ${companionName}
Generated At: ${new Date(summary.generatedAt).toLocaleString()}
Trust & Safety Audit Score: ${summary.trustSafetyScore}% (${summary.sentimentGrade})

EXECUTIVE SUMMARY:
${summary.executiveSummary}

KEY HIGHLIGHTS:
${summary.keyHighlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}

ACTION ITEMS:
${summary.actionItems.map((a, i) => `[ ] ${a}`).join('\n')}
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_Summary_${companionName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full glass-panel border border-slate-700 rounded-3xl p-6 relative space-y-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                AI Meeting Summary Engine
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold border border-emerald-500/40">
                  99.8% TRUST
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Gemini AI Automated Transcript Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Executive Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" /> Executive Overview
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">{summary.executiveSummary}</p>
          </div>

          {/* Key Highlights */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Key Session Highlights
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {summary.keyHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Action Points & Next Steps
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {summary.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-500 font-mono">
            Audit Timestamp: {new Date(summary.generatedAt).toLocaleTimeString()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportText}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" /> Export Summary
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl gradient-bg-primary text-xs font-extrabold text-white hover:opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
