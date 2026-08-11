'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, DollarSign, FileText, Lock, User, Clock, Image as ImageIcon, Send, Sparkles, Brain } from 'lucide-react';
import { DisputeTicket, ResolutionOutcome } from '@/lib/types';
import { useAdminStore } from '@/lib/adminStore';
import { analyzeDisputeWithAI } from '@/lib/aiArbitrationEngine';
import { evaluateFraudRisk } from '@/lib/fraudRiskRadar';
import { triggerPaymentGatewayWebhook } from '@/lib/paymentGatewayWebhook';

interface DisputeAuditModalProps {
  dispute: DisputeTicket;
  onClose: () => void;
  onSuccessNotification?: (msg: string) => void;
}

export function DisputeAuditModal({ dispute, onClose, onSuccessNotification }: DisputeAuditModalProps) {
  const { resolveDispute, escalateDispute } = useAdminStore();
  const [outcome, setOutcome] = useState<ResolutionOutcome>('FULL_REFUND_CUSTOMER');
  const [refundAmount, setRefundAmount] = useState<number>(dispute.disputedAmount);
  const [penaltyAmount, setPenaltyAmount] = useState<number>(0);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);

  const fraudRisk = evaluateFraudRisk(dispute);

  const handleAiAutoFill = () => {
    const res = analyzeDisputeWithAI(dispute);
    setOutcome(res.recommendedOutcome);
    setRefundAmount(res.recommendedRefundAmount);
    setPenaltyAmount(res.recommendedPenaltyAmount);
    setAdminNotes(`[AI AUDIT AUTO-RECOMMENDATION]: ${res.aiSummary} Risk score: ${res.confidenceScore}%. Findings: ${res.keyFindings.join('; ')}`);
    setAiApplied(true);
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      resolveDispute(dispute.id, outcome, refundAmount, penaltyAmount, adminNotes);

      // Execute Payment Gateway Webhook
      const webhookReceipt = triggerPaymentGatewayWebhook(
        dispute.disputeRef,
        outcome === 'FULL_REFUND_CUSTOMER' || outcome === 'PARTIAL_REFUND' ? 'PAYMENT_REFUND_SUCCESS' : 'ESCROW_DISBURSED_COMPANION',
        refundAmount || dispute.disputedAmount
      );

      if (onSuccessNotification) {
        onSuccessNotification(`Dispute ${dispute.disputeRef} resolved! Payment Gateway Webhook executed (${webhookReceipt.gatewayProvider} TxHash: ${webhookReceipt.transactionHash.slice(0, 10)}...).`);
      }
      onClose();
    } catch (err: any) {
      alert('Failed to resolve dispute: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscalate = () => {
    const reason = prompt('Enter reason for escalating to executive management:');
    if (reason) {
      escalateDispute(dispute.id, reason);
      if (onSuccessNotification) {
        onSuccessNotification(`Dispute ${dispute.disputeRef} escalated to executive management.`);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-0 my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Dispute Audit & Resolution</h3>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {dispute.disputeRef}
                </span>
              </div>
              <p className="text-xs text-slate-400">Booking Ref: <span className="font-mono text-white">{dispute.bookingNumber}</span></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          
          {/* Top Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Disputed Escrow</span>
              <div className="text-lg font-mono font-bold text-emerald-400">${dispute.disputedAmount}</div>
              <span className="text-[10px] text-slate-400">Status: <strong className="text-amber-400">{dispute.escrowStatus}</strong></span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Customer</span>
              <div className="font-bold text-white truncate">{dispute.customerName}</div>
              <span className="text-[10px] text-slate-400 truncate block">{dispute.customerEmail}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Companion</span>
              <div className="font-bold text-white truncate">{dispute.companionName}</div>
              <span className="text-[10px] text-slate-400 truncate block">{dispute.companionEmail}</span>
            </div>
          </div>

          {/* Fraud Risk Radar Banner */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            fraudRisk.riskCategory === 'HIGH_RISK_FRAUD'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : fraudRisk.riskCategory === 'ELEVATED_RISK'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 font-mono text-xs">
                <ShieldAlert className="w-4 h-4" /> Fraud Risk Radar Assessment
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border bg-slate-950">
                Score: {fraudRisk.riskScore}% ({fraudRisk.riskCategory.replace('_', ' ')})
              </span>
            </div>

            <p className="text-xs">{fraudRisk.recommendation}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {fraudRisk.riskBadges.map((badge, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300">
                  ⚠️ {badge}
                </span>
              ))}
            </div>
          </div>

          {/* AI Quick Auto-Fill Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">AI Neural Arbitration Engine</h4>
                <p className="text-[10px] text-purple-300">Analyze evidence & auto-suggest optimal refund percentage</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAiAutoFill}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiApplied ? 'Re-Apply AI Verdict' : 'Auto-Fill AI Verdict'}</span>
            </button>
          </div>

          {/* Description & Category */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Category: {dispute.category.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Filed: {new Date(dispute.filedAt).toLocaleString()}</span>
            </div>
            <p className="text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-light">
              "{dispute.detailedDescription}"
            </p>
          </div>

          {/* Evidence Attachments */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> Uploaded Evidence ({dispute.evidence.length})
            </h4>
            {dispute.evidence.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-slate-500 text-center">
                No external evidence uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dispute.evidence.map((item) => (
                  <a
                    key={item.id}
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 flex items-center gap-3 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white truncate text-xs">{item.title}</p>
                      <p className="text-[10px] text-slate-500">By {item.uploadedBy} ({item.uploaderRole})</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Formal Resolution Form */}
          <form onSubmit={handleResolve} className="p-5 rounded-2xl bg-slate-950 border border-purple-500/20 space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Execute Financial Resolution
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">Resolution Outcome</label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as ResolutionOutcome)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500"
                >
                  <option value="FULL_REFUND_CUSTOMER">Full Refund to Customer ($ {dispute.disputedAmount})</option>
                  <option value="PARTIAL_REFUND">Partial Refund to Customer</option>
                  <option value="RELEASE_COMPANION">Release Funds to Companion</option>
                  <option value="COMPANION_PENALIZED">Penalize Companion & Refund</option>
                  <option value="DISMISSED">Dismiss Dispute (No Action)</option>
                </select>
              </div>

              {(outcome === 'PARTIAL_REFUND' || outcome === 'COMPANION_PENALIZED') && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                    {outcome === 'PARTIAL_REFUND' ? 'Partial Refund Amount ($)' : 'Penalty Deduction Amount ($)'}
                  </label>
                  <input
                    type="number"
                    max={dispute.disputedAmount}
                    min={0}
                    value={outcome === 'PARTIAL_REFUND' ? refundAmount : penaltyAmount}
                    onChange={(e) => outcome === 'PARTIAL_REFUND' ? setRefundAmount(Number(e.target.value)) : setPenaltyAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5">Arbitration Audit Notes & Rationale</label>
              <textarea
                rows={3}
                placeholder="Enter official arbitration rationale, evidence reviewed, and terms applied..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleEscalate}
                className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all"
              >
                Escalate to Management
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-lg shadow-indigo-600/30 hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Finalize & Issue Settlement</span>
                </button>
              </div>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
