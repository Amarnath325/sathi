'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight,
  UserCheck,
  AlertCircle,
  FileText,
  Settings,
  Lock,
  Globe,
  Award,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface BookingRequest {
  id: string;
  clientName: string;
  clientAvatar: string;
  category: string;
  date: string;
  timeSlot: string;
  location: string;
  totalPay: number;
  purpose: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

const INITIAL_REQUESTS: BookingRequest[] = [
  {
    id: 'REQ-9901',
    clientName: 'Siddharth Rao',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    category: 'Travel Companion',
    date: '2026-08-14',
    timeSlot: '10:00 AM - 04:00 PM',
    location: 'Raipur Railway Station to Hotel Hyatt',
    totalPay: 270,
    purpose: 'Sightseeing & Event Guide',
    status: 'PENDING'
  },
  {
    id: 'REQ-9902',
    clientName: 'Neha Verma',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    category: 'Event Companion',
    date: '2026-08-18',
    timeSlot: '06:00 PM - 10:00 PM',
    location: 'Magneto Conclave Mall, Raipur',
    totalPay: 200,
    purpose: 'Gala Evening Companion',
    status: 'PENDING'
  }
];

export type CompanionApprovalState = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'REVERIFICATION_REQUIRED';

export type PayoutStatusState = 
  | 'NOT_CONFIGURED'
  | 'VERIFICATION_REQUIRED'
  | 'PENDING'
  | 'ACTIVE'
  | 'RESTRICTED'
  | 'FAILED'
  | 'DISABLED';

export default function CompanionDashboard() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<BookingRequest[]>(INITIAL_REQUESTS);
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Companion Approval & Publishing Gate state (Sections 75, 76)
  const [approvalState, setApprovalState] = useState<CompanionApprovalState>('APPROVED');
  const [payoutStatus, setPayoutStatus] = useState<PayoutStatusState>('ACTIVE');

  // Publishing Gate Conditions Checklist (Section 76)
  const publishingConditions = {
    accountVerified: true,
    ageEligible: true,
    kycApproved: true,
    companionApproved: approvalState === 'APPROVED',
    profileComplete: true,
    approvedServiceExists: true,
    availabilityConfigured: true
  };

  const isProfilePublished = Object.values(publishingConditions).every(Boolean);

  const handleAction = (id: string, action: 'ACCEPTED' | 'DECLINED') => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
    showToast(
      action === 'ACCEPTED' ? 'success' : 'info',
      `Booking ${action === 'ACCEPTED' ? 'Accepted' : 'Declined'}`,
      `Request #${id} has been marked as ${action.toLowerCase()}.`
    );
  };

  const handlePayout = () => {
    setPayoutRequested(true);
    showToast('success', 'Payout Request Dispatched', '$1,450.00 payout requested to your registered bank account (•••• 1234).');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED COMPANION PORTAL
            </span>
            
            {/* Approval State Badge (Section 75) */}
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
              Approval Status: {approvalState}
            </span>

            {/* Profile Published Badge (Section 76) */}
            {isProfilePublished ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> Profile Published ✓
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                Publishing Pending
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome back, Aria!</h1>
          <p className="text-xs text-slate-400">Manage booking requests, track detailed earnings, and configure payout settings.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/companion/create"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4 text-indigo-400" /> Edit Profile & Rates
          </Link>
          <button
            onClick={handlePayout}
            disabled={payoutRequested}
            className="px-5 py-2.5 rounded-2xl gradient-bg-primary text-white font-bold text-xs hover:opacity-95 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {payoutRequested ? 'Payout Pending ($1,450)' : 'Request Payout ($1,450)'}
          </button>
        </div>
      </div>

      {/* Section 76: Profile Publishing Requirements Gate Checklist */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Section 76 Profile Publishing Gate Requirements
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Account Verified
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Age Eligible (18+)
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> KYC Approved
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Companion Approved
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Profile Complete
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved Services
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Availability Set
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Market Search Active
          </div>
        </div>
      </div>

      {/* Section 79 & 80: Comprehensive Earnings & Payout Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Bookings Amount</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">$4,850.00</p>
          <span className="text-[10px] text-slate-400 font-mono">Platform Fee: -$485 | Taxes: -$120</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Net Earnings</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400">$4,245.00</p>
          <span className="text-[10px] text-emerald-400 font-bold">Net Payouts Collected</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Available for Payout</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">$1,450.00</p>
          <span className="text-[10px] text-slate-400 font-mono">Pending Escrow: $350.00</span>
        </div>

        {/* Section 80 & 81: Masked Bank Details & Payout Status */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Payout Account</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-black text-white font-mono">Bank •••• 1234</p>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            Status: {payoutStatus} ✓ (Stripe Connect)
          </span>
        </div>

      </div>

      {/* Booking Requests Queue (Section 77, 78) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Incoming Booking Requests (Section 77)
            </h3>
            <p className="text-xs text-slate-400">Review client requests and accept to initiate escrow lock.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
            {requests.filter(r => r.status === 'PENDING').length} Pending
          </span>
        </div>

        <div className="space-y-4">
          {requests.map((req) => (
            <div 
              key={req.id}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <img 
                  src={req.clientAvatar} 
                  alt={req.clientName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0" 
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{req.clientName}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-indigo-400 font-mono font-bold border border-slate-800">
                      {req.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{req.date} • {req.timeSlot}</p>
                  <p className="text-[11px] text-slate-400">{req.location} • Purpose: <strong className="text-slate-200">{req.purpose}</strong></p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-900 pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Net Payout</span>
                  <span className="text-base font-black text-emerald-400">${req.totalPay}.00</span>
                </div>

                {req.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(req.id, 'ACCEPTED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept Request
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'DECLINED')}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-900/30 text-rose-400 border border-slate-800 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${req.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'}`}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
