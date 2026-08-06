'use client';

import React from 'react';
import { BookingDetails, BookingStatus, EscrowStatus } from '@/lib/types';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
  DollarSign,
  User,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface BookingCardProps {
  booking: BookingDetails;
  onViewDetails: (b: BookingDetails) => void;
  onReleaseEscrow?: (id: string) => void;
  onRefund?: (id: string) => void;
}

export function BookingCard({ booking, onViewDetails, onReleaseEscrow, onRefund }: BookingCardProps) {
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Accepted</span>;
      case 'ESCROW_LOCKED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1"><Lock className="w-3 h-3" /> Escrow Locked</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 animate-pulse"><Clock className="w-3 h-3" /> Active Meeting</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      case 'DISPUTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Disputed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  const getEscrowBadge = (escrow: EscrowStatus) => {
    switch (escrow) {
      case 'HELD':
        return <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Vault Held</span>;
      case 'RELEASED_TO_COMPANION':
        return <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Payout Released</span>;
      case 'REFUNDED_TO_USER':
        return <span className="text-[10px] font-bold text-sky-400 flex items-center gap-1"><XCircle className="w-3 h-3 text-sky-400" /> Refunded to Client</span>;
      default:
        return <span className="text-[10px] text-slate-400">{escrow}</span>;
    }
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 space-y-4 shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/50">
            {booking.bookingNumber}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
            {booking.category}
          </span>
        </div>
        <div>{getStatusBadge(booking.status)}</div>
      </div>

      {/* Main Companion & Client Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-900">
        {/* Client */}
        <div className="flex items-center gap-3">
          <img
            src={booking.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80'}
            alt={booking.userName}
            className="w-10 h-10 rounded-full object-cover border border-slate-700 ring-2 ring-slate-800"
          />
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Client</span>
            <span className="text-xs font-bold text-white truncate block">{booking.userName}</span>
          </div>
        </div>

        {/* Companion */}
        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-800/60 pt-2 sm:pt-0 sm:pl-4">
          <img
            src={booking.companionAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
            alt={booking.companionName}
            className="w-10 h-10 rounded-full object-cover border border-indigo-500/40 ring-2 ring-indigo-950"
          />
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" /> Companion
            </span>
            <span className="text-xs font-bold text-white truncate block">{booking.companionName}</span>
          </div>
        </div>
      </div>

      {/* Date, Location & Pricing details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mb-0.5">
            <Calendar className="w-3 h-3 text-indigo-400" /> Date
          </span>
          <span className="text-slate-200 font-bold text-[11px]">{booking.date || booking.createdAt.split('T')[0]}</span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mb-0.5">
            <Clock className="w-3 h-3 text-indigo-400" /> Duration
          </span>
          <span className="text-slate-200 font-bold text-[11px]">{booking.durationHours} hrs (${booking.hourlyRate}/hr)</span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mb-0.5">
            <CreditCard className="w-3 h-3 text-indigo-400" /> Total Escrow
          </span>
          <span className="text-emerald-400 font-extrabold text-xs">${booking.totalAmount}.00</span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Escrow State</span>
          {getEscrowBadge(booking.escrowStatus)}
        </div>
      </div>

      {/* Location Bar */}
      {booking.locationAddress && (
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-800/60 truncate">
          <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          <span className="truncate">{booking.locationAddress}</span>
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
        <button
          onClick={() => onViewDetails(booking)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 font-bold text-xs border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" /> View Details & Receipt
        </button>

        <div className="flex items-center gap-2">
          {booking.escrowStatus === 'HELD' && onReleaseEscrow && (
            <button
              onClick={() => onReleaseEscrow(booking.id)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-xs transition-all flex items-center gap-1 shadow-lg shadow-emerald-950"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Release Escrow
            </button>
          )}

          {booking.status !== 'CANCELLED' && booking.escrowStatus === 'HELD' && onRefund && (
            <button
              onClick={() => onRefund(booking.id)}
              className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs transition-all flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Refund
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
