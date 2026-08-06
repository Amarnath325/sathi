'use client';

import React, { useState } from 'react';
import { X, Star, Send, ShieldCheck } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

interface ReviewFormModalProps {
  bookingId: string;
  bookingNumber: string;
  companionId: string;
  companionName: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  category?: string;
  onClose: () => void;
  onSuccessNotification?: (msg: string) => void;
}

export function ReviewFormModal({
  bookingId,
  bookingNumber,
  companionId,
  companionName,
  authorId,
  authorName,
  authorEmail,
  authorAvatar,
  category = "Event Companion",
  onClose,
  onSuccessNotification
}: ReviewFormModalProps) {
  const { submitReview } = useAdminStore();
  const [rating, setRating] = useState<number>(5);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [behavior, setBehavior] = useState<number>(5);
  const [communication, setCommunication] = useState<number>(5);
  const [authenticity, setAuthenticity] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const review = submitReview({
        bookingId,
        bookingNumber,
        companionId,
        companionName,
        authorId,
        authorName,
        authorEmail,
        authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        rating,
        subRatings: { punctuality, behavior, communication, authenticity },
        category,
        comment: comment.trim(),
        verifiedBooking: true
      });

      if (onSuccessNotification) {
        onSuccessNotification(`Thank you! Your review for ${companionName} has been submitted (Ref: ${review.reviewRef}).`);
      }
      onClose();
    } catch (err: any) {
      alert('Failed to submit review: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarSelector = (val: number, setVal: (n: number) => void) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => setVal(star)}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star className={`w-5 h-5 ${star <= val ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Rate Companion Experience</h3>
              <p className="text-xs text-slate-400 font-mono">Booking Ref: {bookingNumber}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <p className="leading-relaxed text-[11px]">
              Verified booking review for <strong className="text-white">{companionName}</strong>. Your honest feedback helps maintain community standards.
            </p>
          </div>

          {/* Overall Rating */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white text-xs">Overall Experience Rating</span>
            {renderStarSelector(rating, setRating)}
          </div>

          {/* Sub-Ratings */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-300 text-[11px] uppercase font-mono">Category Breakdown</h4>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Punctuality & Timeliness</span>
              {renderStarSelector(punctuality, setPunctuality)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Behavior & Professionalism</span>
              {renderStarSelector(behavior, setBehavior)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Communication Ease</span>
              {renderStarSelector(communication, setCommunication)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Profile Authenticity</span>
              {renderStarSelector(authenticity, setAuthenticity)}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Your Detailed Review & Feedback</label>
            <textarea
              required
              rows={4}
              placeholder="Share your experience, highlight companion strengths or areas for improvement..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
