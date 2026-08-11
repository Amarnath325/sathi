'use client';

import React, { useState } from 'react';
import { X, Scale, Users, ShieldCheck, CheckCircle2, Vote, Sparkles, Award } from 'lucide-react';

interface CommunityAppealModalProps {
  disputeRef: string;
  disputedAmount: number;
  reason: string;
  onClose: () => void;
  onVoteComplete: (verdict: 'OVERTURN_REFUND' | 'SUSTAIN_ORIGINAL') => void;
}

export function CommunityAppealModal({
  disputeRef,
  disputedAmount,
  reason,
  onClose,
  onVoteComplete
}: CommunityAppealModalProps) {
  const [votes, setVotes] = useState<{ [key: string]: 'OVERTURN' | 'SUSTAIN' }>({
    'arb-1': 'OVERTURN',
    'arb-2': 'OVERTURN',
  });
  const [userVote, setUserVote] = useState<'OVERTURN' | 'SUSTAIN' | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);

  const handleCastVote = (vote: 'OVERTURN' | 'SUSTAIN') => {
    setUserVote(vote);
    const updated = { ...votes, 'arb-3': vote };
    setVotes(updated);

    const overturnCount = Object.values(updated).filter(v => v === 'OVERTURN').length;
    const finalVerdict = overturnCount >= 2 ? 'OVERTURN_REFUND' : 'SUSTAIN_ORIGINAL';

    setTimeout(() => {
      setIsFinalized(true);
      setTimeout(() => {
        onVoteComplete(finalVerdict);
        onClose();
      }, 2000);
    }, 800);
  };

  const overturnVotes = Object.values(votes).filter(v => v === 'OVERTURN').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">3-Member Neutral Community Arbitration Panel</h3>
              <p className="text-[10px] font-mono text-amber-400">Appeal Hearing: {disputeRef}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Disputed Escrow: <strong className="text-emerald-400">${disputedAmount}</strong></span>
              <span className="text-amber-400 font-bold">STATUS: UNDER APPEAL</span>
            </div>
            <p className="text-slate-300 font-medium text-xs">Claim: "{reason}"</p>
          </div>

          {/* Panel Members List */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5 font-mono">
              <Users className="w-4 h-4 text-indigo-400" /> Independent Community Arbitrators
            </h4>

            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs">A1</div>
                  <div>
                    <p className="font-bold text-white text-xs">Elena Rostova</p>
                    <p className="text-[10px] text-slate-500">Verified Top 1% Companion • 4.98★</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">
                  Voted: OVERTURN (Full Refund)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-xs">A2</div>
                  <div>
                    <p className="font-bold text-white text-xs">Marcus Thorne</p>
                    <p className="text-[10px] text-slate-500">Community Safety Lead • 140+ Reviews</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">
                  Voted: OVERTURN (Full Refund)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs">A3</div>
                  <div>
                    <p className="font-bold text-white text-xs">Your Seat (Senior Compliance Judge)</p>
                    <p className="text-[10px] text-purple-300">Tie-Breaking Consensus Vote</p>
                  </div>
                </div>
                {userVote ? (
                  <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold font-mono">
                    Voted: {userVote}
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 font-bold animate-pulse">Awaiting Vote...</span>
                )}
              </div>
            </div>
          </div>

          {/* Voting Action Controls */}
          {isFinalized ? (
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-2 animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-extrabold text-white text-sm">Appeal Decision Finalized ({overturnVotes}/3 Consensus)</h4>
              <p className="text-xs text-slate-300">Original decision OVERTURNED. Full refund released to customer escrow account.</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-center text-slate-400 font-bold text-[11px]">Cast your final consensus vote to conclude appeal:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleCastVote('OVERTURN')}
                  className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Vote className="w-4 h-4" />
                  <span>Overturn & Refund Customer</span>
                </button>

                <button
                  onClick={() => handleCastVote('SUSTAIN')}
                  className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Sustain Original Decision</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
