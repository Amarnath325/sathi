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
  Sparkles,
  PhoneCall,
  Navigation,
  MapPin,
  Sliders,
  Eye,
  RefreshCw,
  Share2,
  Power,
  Bell,
  ShieldAlert,
  CreditCard,
  Building2,
  Check,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface BookingRequest {
  id: string;
  clientName: string;
  clientAvatar: string;
  isClientVerified: boolean;
  category: string;
  date: string;
  timeSlot: string;
  location: string;
  city: string;
  grossPay: number;
  netPay: number;
  escrowStatus: 'ESCROW_LOCKED' | 'PENDING_ACCEPTANCE' | 'RELEASED';
  purpose: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'IN_PROGRESS';
  clientRating: number;
}

const INITIAL_REQUESTS: BookingRequest[] = [
  {
    id: 'REQ-9901',
    clientName: 'Siddharth Rao',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    isClientVerified: true,
    category: 'Travel Companion',
    date: '2026-08-14',
    timeSlot: '10:00 AM - 04:00 PM (6 Hours)',
    location: 'Raipur Railway Station to Hotel Hyatt',
    city: 'Raipur',
    grossPay: 2000,
    netPay: 1700,
    escrowStatus: 'PENDING_ACCEPTANCE',
    purpose: 'Sightseeing & Event Guide',
    status: 'PENDING',
    clientRating: 4.9
  },
  {
    id: 'REQ-9902',
    clientName: 'Neha Verma',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    isClientVerified: true,
    category: 'Event Companion',
    date: '2026-08-18',
    timeSlot: '06:00 PM - 10:00 PM (4 Hours)',
    location: 'Magneto Conclave Mall, Raipur',
    city: 'Raipur',
    grossPay: 1600,
    netPay: 1360,
    escrowStatus: 'ESCROW_LOCKED',
    purpose: 'Gala Evening & Dinner Companion',
    status: 'ACCEPTED',
    clientRating: 5.0
  },
  {
    id: 'REQ-9903',
    clientName: 'Vikramaditya Roy',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    isClientVerified: true,
    category: 'Business & Networking',
    date: '2026-08-20',
    timeSlot: '02:00 PM - 08:00 PM (6 Hours)',
    location: 'Bandra Kurla Complex, Mumbai',
    city: 'Mumbai',
    grossPay: 4500,
    netPay: 3825,
    escrowStatus: 'PENDING_ACCEPTANCE',
    purpose: 'Tech Summit & Executive Escort',
    status: 'PENDING',
    clientRating: 4.8
  },
  {
    id: 'REQ-9889',
    clientName: 'Ananya Deshmukh',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    isClientVerified: true,
    category: 'Fine Dining & Cultural',
    date: '2026-08-10',
    timeSlot: '07:00 PM - 11:00 PM (4 Hours)',
    location: 'Bastian, Worli, Mumbai',
    city: 'Mumbai',
    grossPay: 3200,
    netPay: 2720,
    escrowStatus: 'RELEASED',
    purpose: 'Birthday Dinner Companion',
    status: 'COMPLETED',
    clientRating: 5.0
  }
];

export type CompanionApprovalState = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type ActiveTabType = 'OVERVIEW' | 'REQUESTS' | 'LIVE_BOOKINGS' | 'PAYOUTS' | 'SCHEDULE' | 'SAFETY';

export default function CompanionDashboard() {
  const { showToast } = useToast();
  
  // Dashboard Core States
  const [requests, setRequests] = useState<BookingRequest[]>(INITIAL_REQUESTS);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Financial & Payout States
  const [availablePayoutBalance, setAvailablePayoutBalance] = useState<number>(14250); // INR
  const [pendingEscrowBalance, setPendingEscrowBalance] = useState<number>(3060);     // INR
  const [lifetimeGrossEarnings, setLifetimeGrossEarnings] = useState<number>(58900); // INR
  const [payoutRequested, setPayoutRequested] = useState<boolean>(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState<boolean>(false);
  const [payoutAmountInput, setPayoutAmountInput] = useState<string>('14250');

  // Companion Profile Meta
  const companionProfile = {
    displayName: 'Aria Vance',
    legalName: 'Aria Vance',
    rating: 4.96,
    totalReviews: 48,
    completedBookings: 62,
    baseHourlyRate: 1500, // INR
    operatingCity: 'Mumbai Metro',
    maxRadiusKm: 35,
    approvalStatus: 'APPROVED' as CompanionApprovalState,
    isProfilePublished: true,
    emergencyGuardian: 'Rahul Vance (+91 9876543210)',
    payoutBank: 'State Bank of India (•••• 5012)',
    upiId: 'ariavance@okaxis'
  };

  // Profile Publishing Requirements Checklist
  const publishingConditions = {
    accountVerified: true,
    ageEligible: true,
    kycApproved: true,
    companionApproved: companionProfile.approvalStatus === 'APPROVED',
    profileComplete: true,
    approvedServiceExists: true,
    availabilityConfigured: true
  };

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    showToast(
      nextState ? 'success' : 'info',
      `Status: ${nextState ? 'ONLINE' : 'OFFLINE'}`,
      nextState ? 'You are now visible to clients for instant companion bookings.' : 'Your profile has been hidden from client searches.'
    );
  };

  const handleAction = (id: string, action: 'ACCEPTED' | 'DECLINED') => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const nextStatus = action;
        const nextEscrow = action === 'ACCEPTED' ? 'ESCROW_LOCKED' : req.escrowStatus;
        return { ...req, status: nextStatus, escrowStatus: nextEscrow };
      }
      return req;
    }));

    const req = requests.find(r => r.id === id);
    showToast(
      action === 'ACCEPTED' ? 'success' : 'info',
      `Booking ${action === 'ACCEPTED' ? 'Accepted & Escrow Locked' : 'Declined'}`,
      action === 'ACCEPTED' 
        ? `Request #${id} accepted. ₹${req?.netPay} placed into secure platform escrow.`
        : `Request #${id} has been declined.`
    );
  };

  const handleDispatchPayout = () => {
    const amount = Number(payoutAmountInput);
    if (!amount || amount < 500) {
      showToast('error', 'Invalid Payout Amount', 'Minimum payout request amount is ₹500.');
      return;
    }

    if (amount > availablePayoutBalance) {
      showToast('error', 'Insufficient Funds', `Maximum available payout balance is ₹${availablePayoutBalance.toLocaleString()}.`);
      return;
    }

    setAvailablePayoutBalance(prev => prev - amount);
    setPayoutRequested(true);
    setPayoutModalOpen(false);

    showToast(
      'success',
      'Payout Dispatched via IMPS',
      `₹${amount.toLocaleString()} has been queued for instant bank transfer to ${companionProfile.payoutBank}.`
    );
  };

  const handleTriggerSOS = () => {
    showToast(
      'error',
      'EMERGENCY SOS ALERT TRIGGERED',
      `Emergency dispatch sent to ${companionProfile.emergencyGuardian} and Platform Trust Safety Desk.`
    );
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* ==================== ENTERPRISE TOP HEADER BAR ==================== */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 border-indigo-500/40 p-1 flex items-center justify-center shadow-xl">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl">
                  {companionProfile.displayName.charAt(0)}
                </div>
              </div>
              <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-950 flex items-center justify-center ${
                isOnline ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' : 'bg-slate-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-ping' : 'bg-slate-400'}`}></span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> VERIFIED COMPANION
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  Status: {companionProfile.approvalStatus}
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400" /> Published ✓
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                {companionProfile.displayName}
                <span className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {companionProfile.rating} ({companionProfile.totalReviews})
                </span>
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {companionProfile.operatingCity} ({companionProfile.maxRadiusKm}km Radius)</span>
                <span>•</span>
                <span className="font-mono text-emerald-400 font-bold">₹{companionProfile.baseHourlyRate}/hr Base Rate</span>
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
            <button
              type="button"
              onClick={handleToggleOnline}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                isOnline 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Power className={`w-4 h-4 ${isOnline ? 'text-white' : 'text-slate-500'}`} />
              <span>{isOnline ? 'ONLINE & ACCEPTING' : 'OFFLINE / BUSY'}</span>
            </button>

            <button
              type="button"
              onClick={handleTriggerSOS}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-white" /> SOS Emergency
            </button>

            <button
              type="button"
              onClick={() => setPayoutModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              <DollarSign className="w-4 h-4 text-white" /> Request Payout (₹{availablePayoutBalance.toLocaleString()})
            </button>
          </div>
        </div>

        {/* Section 76 Publishing Gate Requirements Status */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-[10px] font-semibold text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> ID Verified
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Age 18+
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Aadhaar KYC
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Admin Approved
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Rates Configured
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Guardian SOS Active
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Escrow Protected
          </div>
        </div>
      </div>

      {/* ==================== FINANCIAL & METRICS OVERVIEW (4 CARDS) ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Available Payout */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden group">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Available for Payout</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            ₹{availablePayoutBalance.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">IMPS / UPI Payout Ready</span>
            <button 
              type="button" 
              onClick={() => setPayoutModalOpen(true)}
              className="text-indigo-400 hover:text-white font-bold underline"
            >
              Withdraw Now
            </button>
          </div>
        </div>

        {/* Pending Escrow Lock */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Locked in Escrow</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">
            ₹{pendingEscrowBalance.toLocaleString()}
          </p>
          <span className="text-[10px] text-amber-400/90 font-mono block">Releases post booking completion</span>
        </div>

        {/* Lifetime Earnings */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Lifetime Gross Earnings</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">
            ₹{lifetimeGrossEarnings.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 block font-mono">Total 62 Bookings Fulfilled</span>
        </div>

        {/* Registered Payout Channel */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Payout Account</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-black text-white font-mono truncate">
            {companionProfile.payoutBank}
          </p>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> UPI: {companionProfile.upiId}
          </span>
        </div>

      </div>

      {/* ==================== DASHBOARD TAB NAVIGATION & SEARCH ==================== */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'OVERVIEW', label: 'All Booking Requests', icon: Calendar, count: requests.length },
            { id: 'LIVE_BOOKINGS', label: 'Accepted & Active', icon: Clock, count: requests.filter(r => r.status === 'ACCEPTED').length },
            { id: 'PAYOUTS', label: 'Payout History', icon: DollarSign },
            { id: 'SAFETY', label: 'SOS Safety Hub', icon: ShieldAlert }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ActiveTabType)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isActive 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                    : 'bg-slate-100 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by client or location..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* ==================== MAIN TAB CONTENT: BOOKING REQUESTS ==================== */}
      {(activeTab === 'OVERVIEW' || activeTab === 'REQUESTS') && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" /> Incoming Companion Booking Queue
              </h3>
              <p className="text-xs text-slate-400">Review prospective client bookings, inspect venue details, and accept to lock escrow funds.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20">
              {filteredRequests.filter(r => r.status === 'PENDING').length} Pending Requests
            </span>
          </div>

          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div 
                key={req.id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:border-slate-700"
              >
                <div className="flex items-start gap-4">
                  <img 
                    src={req.clientAvatar} 
                    alt={req.clientName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0 shadow-md" 
                  />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {req.clientName}
                        {req.isClientVerified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </h4>
                      
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold border border-indigo-500/20">
                        {req.category}
                      </span>

                      <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Client Score: {req.clientRating}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{req.date} • {req.timeSlot}</span>
                    </p>

                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{req.location} ({req.city})</span>
                    </p>

                    <div className="pt-1 text-[11px] text-slate-300">
                      Booking Purpose: <strong className="text-white">{req.purpose}</strong>
                    </div>
                  </div>
                </div>

                {/* Pricing & Action Buttons */}
                <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-slate-900 pt-4 lg:pt-0">
                  <div className="text-left lg:text-right space-y-0.5">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Client Gross: ₹{req.grossPay}</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                      ₹{req.netPay} Net Payout
                    </span>
                    <span className={`block text-[10px] font-mono font-bold ${
                      req.escrowStatus === 'ESCROW_LOCKED' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {req.escrowStatus === 'ESCROW_LOCKED' ? '✓ Escrow Locked' : '• Pending Escrow Lock'}
                    </span>
                  </div>

                  {req.status === 'PENDING' ? (
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAction(req.id, 'ACCEPTED')}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept & Lock Escrow
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(req.id, 'DECLINED')}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-800 hover:border-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Decline
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-2 rounded-2xl text-xs font-bold border ${
                        req.status === 'ACCEPTED' 
                          ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40' 
                          : req.status === 'COMPLETED'
                          ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40'
                          : 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/40'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB: LIVE ACTIVE BOOKINGS ==================== */}
      {activeTab === 'LIVE_BOOKINGS' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" /> Active & Confirmed Engagements
              </h3>
              <p className="text-xs text-slate-400">Monitor live bookings, client location check-ins, and safety protocols.</p>
            </div>
          </div>

          <div className="space-y-4">
            {requests.filter(r => r.status === 'ACCEPTED').map(req => (
              <div key={req.id} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img src={req.clientAvatar} alt={req.clientName} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{req.clientName}</h4>
                      <p className="text-xs text-slate-400">{req.date} • {req.timeSlot}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                    Escrow Locked: ₹{req.netPay}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Public Meeting Location:</span>
                    <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" /> {req.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Safety Status:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> SOS GPS Beacon Active
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={handleTriggerSOS}
                    className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" /> Trigger SOS Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB: SOS SAFETY HUB ==================== */}
      {activeTab === 'SAFETY' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" /> Companion Trust & SOS Emergency Hub
              </h3>
              <p className="text-xs text-slate-400">Emergency guardian contact and 24/7 trust safety protocols.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono font-bold border border-rose-500/20">
              SOS PROTECTED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" /> Emergency Safety Guardian
              </h4>
              <p className="text-sm font-bold text-emerald-400 font-mono">{companionProfile.emergencyGuardian}</p>
              <p className="text-[11px] text-slate-400">Receives real-time SMS & GPS tracking links when you trigger the 1-Tap SOS button.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Zero-Intimacy Policy Guarantee
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">All companion services are 100% non-intimate and strictly confined to public venues. Off-platform solicitations are permanently blocked.</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PAYOUT REQUEST MODAL ==================== */}
      {payoutModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" /> Request Instant Payout
              </h3>
              <button 
                type="button" 
                onClick={() => setPayoutModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Registered Bank Account</span>
                <span className="text-xs font-bold text-white font-mono">{companionProfile.payoutBank}</span>
                <span className="text-[10px] text-emerald-400 block font-mono">UPI: {companionProfile.upiId}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Payout Amount (₹ INR) *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-mono font-bold text-slate-400">₹</span>
                  <input 
                    type="number"
                    value={payoutAmountInput}
                    onChange={e => setPayoutAmountInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>Available Balance: ₹{availablePayoutBalance.toLocaleString()}</span>
                  <span>Min ₹500</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPayoutModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDispatchPayout}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all"
              >
                Confirm & Payout ₹{Number(payoutAmountInput || 0).toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
