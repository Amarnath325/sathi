'use client';

import React from 'react';
import { FinancialTransaction } from '@/lib/types';
import { X, ShieldCheck, Lock, FileText, CheckCircle2, DollarSign, CreditCard, Clock } from 'lucide-react';

interface Props {
  transaction: FinancialTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onRefund?: (id: string) => void;
}

export function FinancialLedgerModal({ transaction, isOpen, onClose, onRefund }: Props) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-lg border border-indigo-800">
                {transaction.transactionRef}
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                transaction.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                transaction.status === 'HELD_IN_ESCROW' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {transaction.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">Itemized Financial Ledger Audit</h2>
          </div>

          <button onClick={onClose} className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Client Payer</span>
            <p className="font-extrabold text-white text-sm">{transaction.userName}</p>
            <span className="text-[10px] text-slate-400 font-mono">User ID: {transaction.userId}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recipient Companion Host</span>
            <p className="font-extrabold text-indigo-300 text-sm">{transaction.companionName || 'N/A Direct Ledger'}</p>
            <span className="text-[10px] text-slate-400 font-mono">Companion ID: {transaction.companionId || 'N/A'}</span>
          </div>
        </div>

        {/* Itemized Calculation Ledger */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-indigo-400" /> Itemized Accounting Ledger
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-sans">Gross Booking Amount</span>
              <span className="font-bold text-white text-sm">${transaction.amount.toLocaleString()}.00</span>
            </div>

            <div className="flex items-center justify-between text-indigo-300">
              <span className="font-sans">Less: Sathi Platform Commission (10%)</span>
              <span>- ${transaction.platformFee}.00</span>
            </div>

            <div className="flex items-center justify-between text-amber-300">
              <span className="font-sans">Less: Escrow Vault Holding Fee (2%)</span>
              <span>- ${transaction.escrowFee}.00</span>
            </div>

            <div className="flex items-center justify-between text-blue-300">
              <span className="font-sans">Less: Government GST / VAT (5%)</span>
              <span>- ${transaction.gstTax}.00</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-sm font-black text-emerald-400 font-sans">
              <span>Net Host Transfer Amount</span>
              <span className="font-mono text-base">${transaction.netPayoutAmount.toLocaleString()}.00 USD</span>
            </div>
          </div>
        </div>

        {/* Gateway Meta Info */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-mono text-[10px]">Payment Provider:</span>
            <span className="font-bold text-white">{transaction.paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-mono text-[10px]">Gateway Reference ID:</span>
            <span className="font-mono font-bold text-indigo-300">{transaction.gatewayRef || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-mono text-[10px]">Timestamp Created:</span>
            <span className="font-mono text-slate-400">{new Date(transaction.createdAt).toLocaleString()}</span>
          </div>
          {transaction.notes && (
            <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900 font-sans">"{transaction.notes}"</p>
          )}
        </div>

        <div className="flex justify-between items-center border-t border-slate-800 pt-4">
          {transaction.status === 'HELD_IN_ESCROW' && onRefund ? (
            <button
              onClick={() => {
                onRefund(transaction.id);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-all"
            >
              Refund Client & Cancel Ticket
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            Close Ledger Audit
          </button>
        </div>
      </div>
    </div>
  );
}
