'use client';

import React from 'react';
import { FinancialTransaction, TransactionType, TransactionStatus } from '@/lib/types';
import { ShieldCheck, Lock, ArrowUpRight, ArrowDownLeft, RefreshCw, AlertTriangle, Eye, CreditCard, DollarSign, Wallet, CheckCircle2 } from 'lucide-react';

interface Props {
  transactions: FinancialTransaction[];
  onViewLedger: (txn: FinancialTransaction) => void;
  onRefundTxn?: (txn: FinancialTransaction) => void;
}

export function TransactionTable({ transactions, onViewLedger, onRefundTxn }: Props) {
  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case 'BOOKING_ESCROW_LOCK':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1"><Lock className="w-3 h-3 text-amber-400" /> Escrow Lock</span>;
      case 'COMPANION_PAYOUT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"><ArrowUpRight className="w-3 h-3 text-emerald-400" /> Host Payout</span>;
      case 'CUSTOMER_REFUND':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1"><ArrowDownLeft className="w-3 h-3 text-rose-400" /> Client Refund</span>;
      case 'WALLET_TOPUP':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1"><Wallet className="w-3 h-3 text-indigo-400" /> Wallet Top-Up</span>;
      case 'PLATFORM_FEE_CREDIT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1"><DollarSign className="w-3 h-3 text-purple-400" /> Platform Fee</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">{type}</span>;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold font-mono">COMPLETED</span>;
      case 'HELD_IN_ESCROW':
        return <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold font-mono">IN ESCROW</span>;
      case 'REFUNDED':
        return <span className="px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold font-mono">REFUNDED</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-700 text-[10px] font-bold font-mono">PENDING</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px] font-mono">{status}</span>;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <CreditCard className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
        <h4 className="text-base font-bold text-white">No Financial Transactions Found</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          No ledger entries match the selected filter criteria. Try clearing search filters or selecting another payment category.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Desktop View Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <th className="py-3.5 px-4">Transaction Ref</th>
              <th className="py-3.5 px-4">Client / Companion</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4 text-right">Gross Amount</th>
              <th className="py-3.5 px-4 text-right">Platform Commission</th>
              <th className="py-3.5 px-4 text-right">Net Payout</th>
              <th className="py-3.5 px-4">Gateway</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-extrabold text-white">
                  {t.transactionRef}
                  {t.bookingNumber && (
                    <span className="block text-[10px] font-normal text-slate-500">Ticket #{t.bookingNumber}</span>
                  )}
                </td>

                <td className="py-3.5 px-4 font-sans">
                  <span className="font-bold text-white block">{t.userName}</span>
                  {t.companionName ? (
                    <span className="text-[11px] text-indigo-400 block">Host: {t.companionName}</span>
                  ) : (
                    <span className="text-[10px] text-slate-500 block">Direct Ledger Transaction</span>
                  )}
                </td>

                <td className="py-3.5 px-4 font-sans">
                  {getTypeBadge(t.type)}
                </td>

                <td className="py-3.5 px-4 text-right font-black text-white text-sm">
                  ${t.amount.toLocaleString()}.00
                </td>

                <td className="py-3.5 px-4 text-right text-indigo-400 font-bold">
                  ${t.platformFee}.00
                </td>

                <td className="py-3.5 px-4 text-right text-emerald-400 font-extrabold">
                  ${t.netPayoutAmount}.00
                </td>

                <td className="py-3.5 px-4 font-sans">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
                    {t.paymentMethod}
                  </span>
                  {t.gatewayRef && (
                    <span className="block text-[9px] font-mono text-slate-500 truncate max-w-[100px]" title={t.gatewayRef}>
                      {t.gatewayRef}
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 font-sans">
                  {getStatusBadge(t.status)}
                </td>

                <td className="py-3.5 px-4 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onViewLedger(t)}
                      className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all"
                      title="View Financial Audit Ledger"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {t.status === 'HELD_IN_ESCROW' && onRefundTxn && (
                      <button
                        onClick={() => onRefundTxn(t)}
                        className="px-2 py-1 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-bold border border-rose-800 transition-all"
                        title="Refund Client"
                      >
                        Refund
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards View */}
      <div className="block md:hidden divide-y divide-slate-800/80">
        {transactions.map((t) => (
          <div key={t.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-extrabold text-white text-xs">{t.transactionRef}</span>
                <span className="text-[10px] text-slate-400 block">{t.userName}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-mono font-black text-white">${t.amount}.00</span>
                <div className="mt-0.5">{getStatusBadge(t.status)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/40">
              <div>{getTypeBadge(t.type)}</div>
              <button
                onClick={() => onViewLedger(t)}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 text-[11px] font-bold flex items-center gap-1"
              >
                <Eye className="w-3 h-3" /> Audit Ledger
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
