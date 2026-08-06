'use client';

import React, { useState } from 'react';
import { BookingDetails, BookingStatus, EscrowStatus } from '@/lib/types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Shield,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  AlertTriangle,
  User,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface Props {
  booking: BookingDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BookingStatus, escrowStatus?: EscrowStatus) => void;
  onReleaseEscrow: (id: string) => void;
  onRefund: (id: string) => void;
}

export function BookingDetailsModal({ booking, isOpen, onClose, onUpdateStatus, onReleaseEscrow, onRefund }: Props) {
  if (!isOpen || !booking) return null;

  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(booking.status);

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(booking.id, selectedStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8 max-h-[90vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-xl border border-indigo-800">
                {booking.bookingNumber}
              </span>
              <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                {booking.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">Booking & Escrow Audit Ticket</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Booking Status</span>
            <div className="flex items-center gap-2 mt-1">
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value as BookingStatus)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="ESCROW_LOCKED">ESCROW_LOCKED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="DISPUTED">DISPUTED</option>
              </select>
              {selectedStatus !== booking.status && (
                <button
                  onClick={handleStatusSubmit}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md"
                >
                  Save Status
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Escrow Vault State</span>
            <div className="mt-1 flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                booking.escrowStatus === 'HELD' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                booking.escrowStatus === 'RELEASED_TO_COMPANION' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                'bg-sky-500/20 text-sky-300 border-sky-500/40'
              }`}>
                {booking.escrowStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Client vs Companion Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Client Details */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" /> Client Profile
            </span>
            <div className="flex items-center gap-3">
              <img
                src={booking.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80'}
                alt={booking.userName}
                className="w-12 h-12 rounded-full object-cover border border-slate-700"
              />
              <div>
                <h4 className="text-sm font-extrabold text-white">{booking.userName}</h4>
                <p className="text-xs text-slate-400 font-mono">ID: {booking.userId}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                  Verified Escrow Account
                </span>
              </div>
            </div>
          </div>

          {/* Companion Details */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Assigned Companion
            </span>
            <div className="flex items-center gap-3">
              <img
                src={booking.companionAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                alt={booking.companionName}
                className="w-12 h-12 rounded-full object-cover border border-indigo-500/50"
              />
              <div>
                <h4 className="text-sm font-extrabold text-white">{booking.companionName}</h4>
                <p className="text-xs text-slate-400 font-mono">ID: {booking.companionId}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-800">
                  Gov-KYC Verified Host
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Schedule Date
            </span>
            <p className="text-xs font-bold text-white">{booking.date || booking.createdAt.split('T')[0]}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Duration & Hours
            </span>
            <p className="text-xs font-bold text-white">{booking.durationHours} Hours (${booking.hourlyRate}/hr)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Payment Gateway
            </span>
            <p className="text-xs font-bold text-emerald-400">{booking.paymentMethod}</p>
          </div>
        </div>

        {/* Location & Special Instructions */}
        {booking.locationAddress && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" /> Designated Meeting Address
            </span>
            <p className="text-xs text-slate-200 font-semibold">{booking.locationAddress}</p>
          </div>
        )}

        {booking.specialNotes && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" /> Client Instructions & Requirements
            </span>
            <p className="text-xs text-slate-300 italic">"{booking.specialNotes}"</p>
          </div>
        )}

        {/* Itemized Financial Breakdown */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Financial & Escrow Vault Breakdown
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Base Companion Rate ({booking.durationHours} hrs × ${booking.hourlyRate})</span>
              <span className="font-bold text-white">${booking.baseAmount || (booking.durationHours * booking.hourlyRate)}.00</span>
            </div>

            {booking.escrowFee && (
              <div className="flex justify-between text-slate-400">
                <span>Escrow Holding & Insurance Fee (5%)</span>
                <span className="font-semibold text-slate-300">${booking.escrowFee}.00</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>Sathi Platform Fee (10%)</span>
              <span className="font-semibold text-slate-300">${booking.platformFee}.00</span>
            </div>

            <div className="flex justify-between text-sm font-extrabold text-white border-t border-slate-800 pt-2">
              <span className="text-emerald-400">Total Escrow Funds Secured</span>
              <span className="text-emerald-400">${booking.totalAmount}.00</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            {booking.escrowStatus === 'HELD' && (
              <button
                onClick={() => {
                  onReleaseEscrow(booking.id);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-emerald-950 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Release Payout to Companion
              </button>
            )}

            {booking.escrowStatus === 'HELD' && (
              <button
                onClick={() => {
                  onRefund(booking.id);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-2xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs transition-all flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Refund Escrow to Client
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors w-full sm:w-auto"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
}
