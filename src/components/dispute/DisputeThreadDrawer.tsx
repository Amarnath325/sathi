'use client';

import React, { useState } from 'react';
import { X, Send, Lock, MessageSquare, Shield, User, Sparkles, Brain, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { DisputeTicket } from '@/lib/types';
import { useAdminStore } from '@/lib/adminStore';
import { analyzeDisputeWithAI, AIArbitrationResult } from '@/lib/aiArbitrationEngine';

interface DisputeThreadDrawerProps {
  dispute: DisputeTicket;
  onClose: () => void;
}

export function DisputeThreadDrawer({ dispute, onClose }: DisputeThreadDrawerProps) {
  const { addDisputeMessage, proposeMutualSettlement, acceptMutualSettlement } = useAdminStore();
  const [messageText, setMessageText] = useState('');
  const [isStaffNote, setIsStaffNote] = useState(false);
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIArbitrationResult | null>(null);

  const [showSettlementForm, setShowSettlementForm] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState<number>(Math.round(dispute.disputedAmount / 2));
  const [settlementNote, setSettlementNote] = useState('');

  const handleProposeSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (settlementAmount <= 0) return;
    proposeMutualSettlement(dispute.id, 'CUSTOMER', settlementAmount, settlementNote || 'Mutual partial refund agreement.');
    setShowSettlementForm(false);
    setSettlementNote('');
  };

  const handleAcceptSettlement = () => {
    acceptMutualSettlement(dispute.id);
  };

  const handleRunAiAudit = () => {
    const result = analyzeDisputeWithAI(dispute);
    setAiAnalysis(result);
    setShowAiAnalysis(true);
  };

  const handleApplyAiRecommendation = () => {
    if (!aiAnalysis) return;
    addDisputeMessage(dispute.id, {
      senderId: 'ai-arbitrator',
      senderName: 'AI Neural Arbitrator Engine',
      senderRole: 'ADMIN',
      message: `[AI ARBITRATION RECOMMENDATION] ${aiAnalysis.aiSummary} Risk Score: ${aiAnalysis.confidenceScore}%. Timeline Verdict: ${aiAnalysis.timelineVerdict}`,
      isArbitratorNote: true
    });
    setShowAiAnalysis(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    addDisputeMessage(dispute.id, {
      senderId: 'admin-current',
      senderName: 'Senior Arbitrator (Support)',
      senderRole: 'ADMIN',
      message: messageText.trim(),
      isArbitratorNote: isStaffNote
    });

    setMessageText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
      
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              Arbitration Log ({dispute.disputeRef})
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              {dispute.customerName} vs {dispute.companionName}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messaging History Scroll Area */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs custom-scrollbar">
        
        {/* Ticket Header Card + AI Trigger */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span>Category: <strong className="text-purple-400">{dispute.category}</strong></span>
            <span>Escrow: <strong className="text-emerald-400">${dispute.disputedAmount}</strong></span>
          </div>
          <p className="text-slate-300 font-medium text-xs font-mono">Issue: {dispute.reason}</p>

          <button
            onClick={handleRunAiAudit}
            className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Run AI Neural Arbitration Audit</span>
          </button>
        </div>

        {/* AI Analysis Panel */}
        {showAiAnalysis && aiAnalysis && (
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5 font-mono">
                <Brain className="w-4 h-4 text-purple-400" /> AI Verdict Analysis
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Match: {aiAnalysis.evidenceMatchScore}%
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans">{aiAnalysis.aiSummary}</p>

            <div className="space-y-1 text-[11px] text-slate-300">
              <strong className="text-purple-300 block text-[10px] font-mono uppercase">Key Findings:</strong>
              {aiAnalysis.keyFindings.map((finding, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{finding}</span>
                </div>
              ))}
            </div>

            {aiAnalysis.riskFactors.length > 0 && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] space-y-1">
                {aiAnalysis.riskFactors.map((risk, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleApplyAiRecommendation}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all"
            >
              <span>Post AI Verdict to Arbitration Thread</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Mutual Settlement Card */}
        {dispute.settlementOffer ? (
          <div className={`p-4 rounded-2xl border space-y-3 ${
            dispute.settlementOffer.status === 'ACCEPTED'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mutual Escrow Settlement Offer
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                {dispute.settlementOffer.status}
              </span>
            </div>

            <p className="text-xs text-slate-200 font-medium">
              Proposed Refund: <strong className="text-emerald-400 font-mono">${dispute.settlementOffer.amount}</strong> out of ${dispute.disputedAmount}
            </p>
            <p className="text-[11px] text-slate-400 italic">"{dispute.settlementOffer.note}"</p>

            {dispute.settlementOffer.status === 'PENDING' && (
              <button
                onClick={handleAcceptSettlement}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Settlement & Release ${dispute.settlementOffer.amount} Refund</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Want an instant resolution?</span>
            <button
              onClick={() => setShowSettlementForm(!showSettlementForm)}
              className="text-purple-400 font-bold hover:underline text-xs"
            >
              {showSettlementForm ? 'Cancel Proposal' : 'Propose Partial Settlement'}
            </button>
          </div>
        )}

        {/* Proposal Form */}
        {showSettlementForm && !dispute.settlementOffer && (
          <form onSubmit={handleProposeSettlement} className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3">
            <h4 className="font-bold text-white text-xs">Propose Mutual Settlement</h4>
            <div>
              <label className="block text-[10px] text-slate-400 font-bold mb-1">Proposed Partial Refund Amount ($)</label>
              <input
                type="number"
                max={dispute.disputedAmount}
                min={1}
                value={settlementAmount}
                onChange={(e) => setSettlementAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-bold mb-1">Settlement Terms / Note</label>
              <input
                type="text"
                placeholder="e.g. Agreeing to 50% refund due to 45min delay"
                value={settlementNote}
                onChange={(e) => setSettlementNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Send Mutual Settlement Proposal
            </button>
          </form>
        )}

        {dispute.messages.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="font-bold text-white">No messages posted yet</p>
            <p className="text-[11px]">Start arbitration thread by typing a message below.</p>
          </div>
        ) : (
          dispute.messages.map((msg) => {
            const isAdmin = msg.senderRole === 'ADMIN';
            const isCustomer = msg.senderRole === 'CUSTOMER';
            const isNote = msg.isArbitratorNote;

            return (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isNote
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : isAdmin
                    ? 'bg-purple-600/20 border-purple-500/30 text-white ml-6'
                    : isCustomer
                    ? 'bg-slate-950 border-slate-800 text-slate-200 mr-6'
                    : 'bg-indigo-950/40 border-indigo-800/40 text-slate-200 ml-6'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px]">
                  <span className="font-bold flex items-center gap-1">
                    {isAdmin ? <Shield className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3 text-slate-400" />}
                    {msg.senderName} ({msg.senderRole})
                  </span>
                  <span className="font-mono text-slate-400">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {isNote && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 uppercase font-bold mb-1">
                    <Lock className="w-3 h-3" /> Private Staff Note
                  </div>
                )}

                <p className="leading-relaxed text-xs">{msg.message}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Input Message Footer */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <label className="flex items-center gap-1.5 cursor-pointer text-amber-300 font-bold">
            <input
              type="checkbox"
              checked={isStaffNote}
              onChange={(e) => setIsStaffNote(e.target.checked)}
              className="rounded accent-amber-500"
            />
            <Lock className="w-3 h-3" /> Internal Staff Note Only
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={isStaffNote ? "Type internal staff arbitration note..." : "Type response to customer & companion..."}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
}

