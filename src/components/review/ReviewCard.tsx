'use client';

import React from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageSquare, AlertTriangle, CheckCircle2, EyeOff, MoreHorizontal } from 'lucide-react';
import { Review } from '@/lib/types';

interface ReviewCardProps {
  review: Review;
  isAdminView?: boolean;
  onAudit?: (review: Review) => void;
  onApprove?: (id: string) => void;
  onFlag?: (id: string) => void;
}

export function ReviewCard({ review, isAdminView = false, onAudit, onApprove, onFlag }: ReviewCardProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4">
      
      <div className="space-y-3">
        
        {/* Header Badges */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`}
              />
            ))}
            <span className="ml-1 text-white font-mono">{review.rating}.0</span>
          </div>

          <div className="flex items-center gap-1.5">
            {review.verifiedBooking && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Booking
              </span>
            )}

            {isAdminView && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                review.status === 'APPROVED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : review.status === 'FLAGGED'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {review.status}
              </span>
            )}
          </div>
        </div>

        {/* Comment Text */}
        <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
          "{review.comment}"
        </p>

        {/* Sub Ratings Pill Bar */}
        {review.subRatings && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[9px] font-mono text-slate-400 pt-1">
            <div className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
              <span>Punctual:</span>
              <strong className="text-amber-400">{review.subRatings.punctuality}★</strong>
            </div>
            <div className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
              <span>Behavior:</span>
              <strong className="text-amber-400">{review.subRatings.behavior}★</strong>
            </div>
            <div className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
              <span>Comm:</span>
              <strong className="text-amber-400">{review.subRatings.communication}★</strong>
            </div>
            <div className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
              <span>Authentic:</span>
              <strong className="text-amber-400">{review.subRatings.authenticity}★</strong>
            </div>
          </div>
        )}

        {/* Official Staff Response Box if present */}
        {review.adminResponse && (
          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-purple-400 block flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Official Platform Response:
            </span>
            <p className="text-slate-300 text-xs italic">"{review.adminResponse}"</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
        
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={review.authorAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-white truncate text-xs">{review.authorName}</p>
            <p className="text-[10px] text-slate-400 truncate">For {review.companionName || review.companionId}</p>
          </div>
        </div>

        {isAdminView ? (
          <div className="flex items-center gap-1.5 shrink-0">
            {review.status !== 'APPROVED' && onApprove && (
              <button
                onClick={() => onApprove(review.id)}
                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                title="Approve Review"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
            {onAudit && (
              <button
                onClick={() => onAudit(review)}
                className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px]"
              >
                Audit
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
            <ThumbsUp className="w-3 h-3 text-slate-400" /> {review.helpfulVotes} helpful
          </div>
        )}

      </div>

    </div>
  );
}
