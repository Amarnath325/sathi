'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  Lock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  ShieldCheck, 
  PlusCircle, 
  DollarSign,
  Building,
  CheckCircle2,
  Tag,
  FileText,
  QrCode,
  Landmark,
  Percent
} from 'lucide-react';

export default function WalletPage() {
  const [balance, setBalance] = useState(480);
  const [escrowHeld, setEscrowHeld] = useState(207);
  const [topUpAmount, setTopUpAmount] = useState('100');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const transactions = [
    { id: 'tx-1', type: 'ESCROW_HOLD', desc: 'Booking #CC-2026-8812 (Sophia Chen)', amount: -207, date: 'Aug 03, 2026', status: 'ESCROW_HELD', gst: '$16.50' },
    { id: 'tx-2', type: 'DEPOSIT', desc: 'Stripe Direct Credit Card Deposit', amount: 500, date: 'Aug 01, 2026', status: 'COMPLETED', gst: '$0.00' },
    { id: 'tx-3', type: 'PARTIAL_REFUND', desc: 'Dispute Partial Refund (50%)', amount: 120, date: 'Jul 30, 2026', status: 'REFUNDED', gst: '$0.00' },
    { id: 'tx-4', type: 'ESCROW_RELEASE', desc: 'Companion Payout for Booking #CC-2026-7710', amount: 180, date: 'Jul 28, 2026', status: 'COMPLETED', gst: '$14.40' }
  ];

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'WELCOME10') {
      setPromoApplied(true);
    }
  };

  const handleDeposit = () => {
    const amt = parseFloat(topUpAmount) || 0;
    setBalance(prev => prev + amt);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Wallet Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Escrow Wallet & Multi-Rail Payout Gateway <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bank-grade Stripe, Razorpay, UPI Instant & Cards payment processor with automated GST Invoicing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px]">Available Wallet Balance</span>
            <span className="text-lg font-extrabold text-white font-mono">${balance}.00</span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-xs">
            <span className="text-indigo-300 flex items-center gap-1 text-[10px]">
              <Lock className="w-3 h-3 text-emerald-400" /> Locked in Escrow
            </span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono">${escrowHeld}.00</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Multi-Rail Deposit & Payout Options */}
        <div className="space-y-6">
          
          {/* Top-up Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Add Wallet Funds
            </h3>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button 
                onClick={() => setPaymentMethod('card')} 
                className={`py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 ${paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-600/20 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
              >
                <CreditCard className="w-4 h-4" /> Credit Card
              </button>
              <button 
                onClick={() => setPaymentMethod('upi')} 
                className={`py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 ${paymentMethod === 'upi' ? 'border-indigo-500 bg-indigo-600/20 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
              >
                <QrCode className="w-4 h-4" /> UPI Instant
              </button>
              <button 
                onClick={() => setPaymentMethod('netbanking')} 
                className={`py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 ${paymentMethod === 'netbanking' ? 'border-indigo-500 bg-indigo-600/20 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
              >
                <Landmark className="w-4 h-4" /> NetBanking
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Deposit Amount ($USD)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="number" 
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Promo Code input */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Promo Code (WELCOME10)" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3" /> WELCOME10 Applied: 10% Discount active!
                </span>
              )}
            </div>

            <button
              onClick={handleDeposit}
              className="w-full py-3 rounded-xl gradient-bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Deposit Funds ({paymentMethod.toUpperCase()})
            </button>
          </div>

          {/* Payout Request Card (Bank Transfer & UPI for Companions) */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-400" /> Instant Payout Withdrawal
            </h3>
            <p className="text-xs text-slate-400">Transfer completed booking earnings directly via ACH Bank Transfer or UPI ID.</p>

            {payoutSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-mono text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Bank / UPI Payout Dispatched!
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => setPayoutSuccess(true)}
                  className="w-full py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Landmark className="w-4 h-4 text-indigo-400" /> Bank Transfer (${balance}.00)
                </button>
                <button
                  onClick={() => setPayoutSuccess(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" /> UPI Instant Payout
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Transaction History Ledger & GST Invoices */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Escrow Ledger & GST Tax Invoices
            </h3>
            <button className="text-xs text-indigo-400 font-semibold flex items-center gap-1 hover:underline">
              <FileText className="w-3.5 h-3.5" /> Download Tax Invoice (PDF)
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{tx.desc}</h4>
                    <span className="text-[10px] text-slate-500">{tx.date} • GST Tax: {tx.gst}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold font-mono ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {tx.amount > 0 ? `+$${tx.amount}.00` : `-$${Math.abs(tx.amount)}.00`}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider font-mono text-indigo-400 font-bold mt-0.5">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
