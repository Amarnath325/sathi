'use client';

import React, { useState } from 'react';
import { X, ArrowUpRight, Building2, ShieldCheck, DollarSign, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (data: { companionId: string; companionName: string; bankName: string; accountNumberMasked: string; amount: number }) => void;
}

export function PayoutModal({ isOpen, onClose, onDispatch }: Props) {
  if (!isOpen) return null;

  const [companionName, setCompanionName] = useState('Sophia Chen');
  const [companionId, setCompanionId] = useState('comp-101');
  const [bankName, setBankName] = useState('JPMorgan Chase Bank, N.A.');
  const [accountNumberMasked, setAccountNumberMasked] = useState('•••• •••• 9812');
  const [amount, setAmount] = useState(450);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDispatch({
      companionId,
      companionName,
      bankName,
      accountNumberMasked,
      amount: Number(amount)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-400" /> Dispatch Companion Bank Payout
            </h2>
            <p className="text-xs text-slate-400 mt-1">Release cleared funds directly to host bank accounts.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Companion Host</label>
            <input
              type="text"
              required
              placeholder="Companion Full Name"
              value={companionName}
              onChange={e => setCompanionName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Partner Clearing Bank</label>
            <input
              type="text"
              required
              placeholder="e.g. JPMorgan Chase Bank"
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Number (Masked)</label>
              <input
                type="text"
                required
                placeholder="•••• •••• 9812"
                value={accountNumberMasked}
                onChange={e => setAccountNumberMasked(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payout Amount ($)</label>
              <input
                type="number"
                min="10"
                step="10"
                required
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none font-mono font-extrabold"
              />
            </div>
          </div>

          {/* Transfer Breakdown Panel */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span>Gross Cleared Balance:</span>
              <span className="font-mono font-bold text-white">${amount}.00</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Automated Direct Bank Transfer:</span>
              <span className="font-mono text-emerald-400 font-bold">$0.00 Fee</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60 font-extrabold text-sm text-white">
              <span>Net Direct Wire Amount:</span>
              <span className="font-mono text-emerald-400">${amount}.00 USD</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Dispatch Instant Bank Wire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
