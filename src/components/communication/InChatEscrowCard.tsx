'use client';

import React, { useState } from 'react';
import { ShieldCheck, DollarSign, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { useCommunicationStore } from '@/lib/communicationStore';

interface InChatEscrowCardProps {
  conversationId: string;
  bookingRef: string;
  amount: number;
  status: 'LOCKED' | 'RELEASED';
  companionName: string;
}

export default function InChatEscrowCard({
  conversationId,
  bookingRef,
  amount,
  status: initialStatus,
  companionName,
}: InChatEscrowCardProps) {
  const { releaseEscrowPayment } = useCommunicationStore();
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [isReleased, setIsReleased] = useState(initialStatus === 'RELEASED');

  const handleRelease = (extraHours = 0) => {
    releaseEscrowPayment(conversationId, bookingRef, tipAmount, extraHours);
    setIsReleased(true);
  };

  return (
    <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/60 border border-emerald-500/40 p-4 space-y-3.5 shadow-xl text-left">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">Escrow Payment Protection</h4>
            <p className="text-[10px] text-slate-400 font-mono">Ref: {bookingRef}</p>
          </div>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
          isReleased ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        }`}>
          {isReleased ? 'RELEASED' : 'ESCROW LOCKED'}
        </span>
      </div>

      <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono">Guaranteed Booking Fee</span>
          <p className="text-base font-extrabold text-white">${amount} USD</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Recipient Companion</span>
          <p className="text-xs font-bold text-indigo-300">{companionName}</p>
        </div>
      </div>

      {isReleased ? (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Payment authorized and released directly to {companionName}'s verified payout wallet.</span>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {/* Tip Companion Buttons */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Add Companion Tip (Optional)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 20, 50, 100].map(tip => (
                <button
                  key={tip}
                  onClick={() => setTipAmount(tip)}
                  className={`py-1 rounded-lg text-xs font-bold border transition-all ${
                    tipAmount === tip ? 'bg-amber-500 border-amber-400 text-slate-950' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {tip === 0 ? 'No Tip' : `$${tip}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleRelease(1)}
              className="py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-xs font-bold text-indigo-300 flex items-center justify-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" /> Extend +1 Hour
            </button>
            <button
              onClick={() => handleRelease(0)}
              className="py-2.5 rounded-xl gradient-bg-primary text-xs font-extrabold text-white shadow-lg hover:opacity-90 flex items-center justify-center gap-1"
            >
              <DollarSign className="w-3.5 h-3.5" /> Release Escrow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
