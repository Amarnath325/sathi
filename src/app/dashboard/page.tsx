'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  ShieldCheck, 
  Wallet, 
  Calendar, 
  MessageSquare, 
  Heart, 
  Lock, 
  Settings, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  Key,
  Bell,
  Smartphone,
  LogOut,
  Sparkles,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_COMPANIONS } from '@/lib/mockData';

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'saved' | 'wallet' | 'settings'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  
  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // User Profile Data
  const user = {
    name: "Alex Mercer",
    email: "alex.mercer@example.com",
    phone: "+1 (415) 892-3011",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    kycStatus: "APPROVED",
    memberSince: "March 2025",
    walletBalance: 480.00,
    escrowLocked: 207.00,
    riskScore: 0.01,
  };

  const filteredBookings = MOCK_BOOKINGS.filter(b => {
    if (bookingFilter === 'ACTIVE') return b.status === 'ESCROW_LOCKED' || b.status === 'ACCEPTED';
    if (bookingFilter === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Profile Overview */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* User Info */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-500/60 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg" title="KYC Verified">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ID VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{user.email} • {user.phone}</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Member since {user.memberSince}
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Available Funds</span>
              <span className="text-xl font-extrabold text-white font-mono">${user.walletBalance.toFixed(2)}</span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Escrow Held
              </span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">${user.escrowLocked.toFixed(2)}</span>
            </div>

            <Link
              href="/wallet"
              className="px-5 py-3.5 rounded-2xl gradient-bg-primary text-white text-xs font-extrabold hover:opacity-90 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" /> Manage Wallet
            </Link>
          </div>

        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'bookings'
                ? 'bg-indigo-600/20 border border-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-400" /> My Bookings
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'saved'
                ? 'bg-indigo-600/20 border border-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" /> Saved Companions ({MOCK_COMPANIONS.slice(0, 3).length})
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'wallet'
                ? 'bg-indigo-600/20 border border-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" /> Escrow & Payments
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600/20 border border-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 text-cyan-400" /> Security & Profile
          </button>
        </div>

        <Link 
          href="/admin" 
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-400 hover:text-white hover:border-slate-700"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" /> Admin Command Center
        </Link>
      </div>

      {/* Tab 1: Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Active & Historical Bookings
            </h2>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setBookingFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                    bookingFilter === filter 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={booking.companionAvatar} 
                      alt={booking.companionName} 
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{booking.companionName}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-semibold">
                          {booking.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Booking Ref: <span className="font-mono text-indigo-400 font-bold">{booking.bookingNumber}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      booking.status === 'ESCROW_LOCKED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                    <span className="text-base font-extrabold text-white font-mono">${booking.totalAmount}.00</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Duration: <strong className="text-slate-200">{booking.durationHours} hours</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="truncate">{booking.locationAddress}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Escrow Payout: <strong className="text-emerald-400">{booking.escrowStatus}</strong></span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                  <p className="text-xs text-slate-400 italic">"{booking.specialNotes}"</p>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      href="/chat"
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Chat Companion
                    </Link>

                    <Link
                      href="/disputes"
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> File Dispute
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Saved Companions */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400" /> Bookmarked Companions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_COMPANIONS.slice(0, 3).map((comp) => (
              <div key={comp.id} className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-4">
                  <img src={comp.avatar} alt={comp.name} className="w-16 h-16 rounded-2xl object-cover border border-emerald-500/40" />
                  <div>
                    <h3 className="text-base font-bold text-white">{comp.name}, {comp.age}</h3>
                    <p className="text-xs text-slate-400">{comp.city}, {comp.country}</p>
                    <span className="text-xs font-extrabold text-emerald-400 font-mono mt-1 block">${comp.hourlyRate}/hr</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{comp.bio}</p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <Link href={`/companion/${comp.id}`} className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
                    View Profile <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href={`/companion/${comp.id}`} className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Wallet & Escrow Ledger Quick View */}
      {activeTab === 'wallet' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" /> Escrow Balance & Tax Invoices
              </h2>
              <p className="text-xs text-slate-400 mt-1">Bank-grade escrow holding ledger protected by 256-bit AES encryption.</p>
            </div>

            <Link href="/wallet" className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500">
              Open Full Wallet Terminal
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-bold">Total Deposited Funds</span>
              <p className="text-2xl font-extrabold text-white font-mono">$687.00</p>
            </div>
            <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
              <span className="text-xs text-indigo-300 font-bold">Active Escrow Protection</span>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono">$207.00</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Account Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" /> Account & Security Settings
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage identity credentials, 2-Factor Authentication, and notification alerts.</p>
            </div>

            {savedSuccess && (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences Updated!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Profile Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" /> Personal Identity Details
              </h3>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user.name} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user.email} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold">Phone Number (SMS Alert Enabled)</label>
                <input 
                  type="text" 
                  defaultValue={user.phone} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>
            </div>

            {/* Right: Security & 2FA */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" /> Security Controls & 2FA
              </h3>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-400">Require TOTP Authenticator code during login.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${twoFactorEnabled ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">Instant Emergency SOS Alerts</h4>
                  <p className="text-[11px] text-slate-400">Send direct SMS & Push notifications to emergency contacts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsAlerts(!smsAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${smsAlerts ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${smsAlerts ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl gradient-bg-primary text-white text-xs font-bold hover:opacity-90"
            >
              Save Profile Changes
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
