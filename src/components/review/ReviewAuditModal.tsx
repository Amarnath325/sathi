'use client';

import React, { useState } from 'react';
import { X, Star, ShieldAlert, CheckCircle2, AlertTriangle, EyeOff, MessageSquare, Send, User, Calendar, ThumbsUp, ShieldCheck } from 'lucide-react';
import { Review } from '@/lib/types';
import { useAdminStore } from '@/lib/adminStore';

interface ReviewAuditModalProps {
  review: Review;
  onClose: () => void;
  onSuccessNotification?: (msg: string) => void;
}

export function ReviewAuditModal({ review, onClose, onSuccessNotification }: ReviewAuditModalProps) {
  const { approveReview, flagReview, rejectReview, hideReview, addAdminReviewResponse, deleteReview } = useAdminStore();
  const [adminNotes, setAdminNotes] = useState(review.adminNotes || '');
  const [adminResponse, setAdminResponse] = useState(review.adminResponse || '');
  const [flagReason, setFlagReason] = useState(review.flaggedReason || '');

  const handleApprove = () => {
    approveReview(review.id, adminNotes);
    if (onSuccessNotification) {
      onSuccessNotification(`Review #${review.reviewRef || review.id} approved!`);
    }
    onClose();
  };

  const handleFlag = () => {
    if (!flagReason) {
      alert('Please specify reason for flagging this review.');
      return;
    }
    flagReview(review.id, flagReason, 'ADMIN');
    if (onSuccessNotification) {
      onSuccessNotification(`Review #${review.reviewRef || review.id} flagged as suspicious.`);
    }
    onClose();
  };

  const handleReject = () => {
    rejectReview(review.id, adminNotes || 'Violates community standards');
    if (onSuccessNotification) {
      onSuccessNotification(`Review #${review.reviewRef || review.id} rejected.`);
    }
    onClose();
  };

  const handleHide = () => {
    hideReview(review.id);
    if (onSuccessNotification) {
      onSuccessNotification(`Review #${review.reviewRef || review.id} hidden from public directory.`);
    }
    onClose();
  };

  const handlePostResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminResponse.trim()) return;

    addAdminReviewResponse(review.id, adminResponse.trim());
    if (onSuccessNotification) {
      onSuccessNotification(`Official staff response added to review.`);
    }
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to permanently delete this review?')) {
      deleteReview(review.id);
      if (onSuccessNotification) {
        onSuccessNotification(`Review permanently deleted.`);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Review Audit & Moderation</h3>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 border border-slate-700">
                  {review.reviewRef || review.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">Target Companion: <span className="font-bold text-white">{review.companionName || review.companionId}</span></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          
          {/* Status & Sentiment Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Overall Rating</span>
              <div className="flex items-center gap-1 text-amber-400 font-bold text-base">
                <Star className="w-4 h-4 fill-amber-400" /> {review.rating}.0 / 5.0
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Moderation Status</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                review.status === 'APPROVED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : review.status === 'FLAGGED'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {review.status}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">AI Sentiment Tag</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                review.sentiment === 'POSITIVE'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : review.sentiment === 'SUSPICIOUS' || review.sentiment === 'NEGATIVE'
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {review.sentiment} ({Math.round(review.sentimentScore * 100)}%)
              </span>
            </div>
          </div>

          {/* User Review Quote & Sub-Ratings */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <img src={review.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="font-bold text-white">{review.authorName}</span>
                {review.verifiedBooking && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Client
                  </span>
                )}
              </div>
              <span className="font-mono text-slate-500">{new Date(review.date).toLocaleDateString()}</span>
            </div>

            <p className="text-slate-200 text-sm italic font-light bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
              "{review.comment}"
            </p>

            {review.subRatings && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px]">
                <div className="p-2 rounded-xl bg-slate-900 text-center">
                  <span className="text-slate-400 block">Punctuality</span>
                  <strong className="text-amber-400 font-mono">{review.subRatings.punctuality}★</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 text-center">
                  <span className="text-slate-400 block">Behavior</span>
                  <strong className="text-amber-400 font-mono">{review.subRatings.behavior}★</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 text-center">
                  <span className="text-slate-400 block">Communication</span>
                  <strong className="text-amber-400 font-mono">{review.subRatings.communication}★</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 text-center">
                  <span className="text-slate-400 block">Authenticity</span>
                  <strong className="text-amber-400 font-mono">{review.subRatings.authenticity}★</strong>
                </div>
              </div>
            )}
          </div>

          {/* Flag Reason if applicable */}
          {review.flaggedReason && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Flagged Reason ({review.flaggedBy}):
              </span>
              <p className="text-xs">{review.flaggedReason}</p>
            </div>
          )}

          {/* Official Staff Response Form */}
          <form onSubmit={handlePostResponse} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-purple-400" /> Official Platform Response
            </h4>
            <textarea
              rows={2}
              placeholder="Write public response from Sathi Support team..."
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-purple-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
              >
                <Send className="w-3 h-3" /> Save Response
              </button>
            </div>
          </form>

          {/* Flag Reason Input */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">Flagging Rationale (If flagging)</label>
            <input
              type="text"
              placeholder="e.g. Profanity, competitor advertisement, or unverified slander"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-rose-500"
            />
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={handleDelete}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-bold transition-all text-xs"
            >
              Delete Review
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleHide}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all text-xs flex items-center gap-1"
              >
                <EyeOff className="w-3.5 h-3.5" /> Hide
              </button>

              <button
                onClick={handleFlag}
                className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold transition-all text-xs flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Flag
              </button>

              <button
                onClick={handleReject}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-xs"
              >
                Reject
              </button>

              <button
                onClick={handleApprove}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-xs flex items-center gap-1 shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Publish
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
