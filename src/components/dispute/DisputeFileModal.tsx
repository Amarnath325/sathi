'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, Upload, Send, AlertCircle } from 'lucide-react';
import { DisputeCategory } from '@/lib/types';
import { useAdminStore } from '@/lib/adminStore';

interface DisputeFileModalProps {
  bookingId: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  companionId: string;
  companionName: string;
  companionEmail: string;
  disputedAmount: number;
  onClose: () => void;
  onSuccessNotification?: (msg: string) => void;
}

export function DisputeFileModal({
  bookingId,
  bookingNumber,
  customerId,
  customerName,
  customerEmail,
  companionId,
  companionName,
  companionEmail,
  disputedAmount,
  onClose,
  onSuccessNotification
}: DisputeFileModalProps) {
  const { fileDispute } = useAdminStore();
  const [category, setCategory] = useState<DisputeCategory>('SERVICE_QUALITY');
  const [reason, setReason] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !detailedDescription.trim()) return;

    setIsSubmitting(true);
    try {
      const ticket = fileDispute({
        bookingId,
        bookingNumber,
        customerId,
        customerName,
        customerEmail,
        companionId,
        companionName,
        companionEmail,
        disputedAmount,
        escrowStatus: 'FROZEN',
        category,
        reason: reason.trim(),
        detailedDescription: detailedDescription.trim(),
        status: 'OPEN_LODGED'
      });

      if (onSuccessNotification) {
        onSuccessNotification(`Dispute filed successfully! Ref: ${ticket.disputeRef}. Escrow locked.`);
      }
      onClose();
    } catch (err: any) {
      alert('Error filing dispute: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">File Booking Dispute</h3>
              <p className="text-xs text-slate-400 font-mono">Booking Ref: {bookingNumber}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Filing a dispute locks disputed escrow funds (${disputedAmount}) until arbitration concludes. Both parties will be requested to provide timestamps/evidence.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Dispute Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DisputeCategory)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-rose-500"
            >
              <option value="SERVICE_QUALITY">Service Quality Issue</option>
              <option value="NO_SHOW">No Show at Location</option>
              <option value="INAPPROPRIATE_BEHAVIOR">Inappropriate Conduct</option>
              <option value="UNAUTHORIZED_FEE">Unauthorized Fee Demand</option>
              <option value="TIMELINESS">Late Arrival / Early Exit</option>
              <option value="SAFETY_VIOLATION">Safety Concern</option>
              <option value="OTHER">Other Dispute</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Brief Dispute Summary</label>
            <input
              type="text"
              required
              placeholder="e.g., Companion arrived 40 minutes late without notification"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Detailed Explanation & Timeline</label>
            <textarea
              required
              rows={4}
              placeholder="Provide exact timelines, locations, and details of what transpired..."
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-rose-500"
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
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Dispute Ticket</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
