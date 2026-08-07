'use client';

import React, { useState, useMemo } from 'react';
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
  CreditCard,
  Mail,
  LockKeyhole,
  CheckCircle,
  AlertCircle,
  Edit3,
  Percent,
  FileText,
  UserPlus
} from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_COMPANIONS } from '@/lib/mockData';
import { useUserAuthStore } from '@/lib/userAuthStore';

export default function UserDashboardPage() {
  const { isLoggedIn, login, logout } = useUserAuthStore();
  const [authInput, setAuthInput] = useState<string>('alex.mercer@example.com');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'saved' | 'wallet' | 'settings'>('profile');
  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  
  // User Profile Form State
  const [userProfile, setUserProfile] = useState({
    name: "Alex Mercer",
    username: "alexmercer_sf",
    email: "alex.mercer@example.com",
    phone: "+1 (415) 892-3011",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    kycStatus: "APPROVED",
    memberSince: "March 2025",
    city: "San Francisco, CA",
    country: "USA",
    bio: "Tech strategist and culture enthusiast. Frequent traveler looking for verified companions for tech summits, art galas, and fine dining.",
    emergencyContact: "+1 (415) 555-0199 (Sister - Sarah)",
    walletBalance: 480.00,
    escrowLocked: 207.00,
    riskScore: 0.01,
    socialInstagram: "@alex_mercer_sf",
    socialLinkedin: "linkedin.com/in/alexmercersf"
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Calculate Dynamic Profile Completion Percentage
  const profileCompletion = useMemo(() => {
    let score = 0;
    const checks = [
      { key: 'name', weight: 15, label: 'Full Name' },
      { key: 'email', weight: 15, label: 'Email Address' },
      { key: 'phone', weight: 10, label: 'Mobile Number' },
      { key: 'avatar', weight: 15, label: 'Profile Photo' },
      { key: 'kycStatus', weight: 20, isVerified: userProfile.kycStatus === 'APPROVED', label: 'KYC Document Verification' },
      { key: 'bio', weight: 10, label: 'Personal Bio' },
      { key: 'emergencyContact', weight: 10, label: 'Emergency Contact' },
      { key: 'socialInstagram', weight: 5, label: 'Social Media Profiles' },
    ];

    checks.forEach(item => {
      if (item.isVerified !== undefined) {
        if (item.isVerified) score += item.weight;
      } else if (userProfile[item.key as keyof typeof userProfile]) {
        score += item.weight;
      }
    });

    return { percentage: Math.min(100, score), checks };
  }, [userProfile]);

  // Handle Credential Login Verification
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);
      if (authInput.trim().length > 0 && passwordInput.trim().length > 0) {
        login({ email: authInput });
      } else {
        setAuthError('Please enter a valid Email / Username / Mobile and Password.');
      }
    }, 800);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const filteredBookings = MOCK_BOOKINGS.filter(b => {
    if (bookingFilter === 'ACTIVE') return b.status === 'ESCROW_LOCKED' || b.status === 'ACCEPTED';
    if (bookingFilter === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  // STEP 1: If User is NOT authenticated, show Credential Verification Modal / Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LockKeyhole className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Account Authentication</h2>
            <p className="text-xs text-slate-400">
              Please enter your Email, Username, or Mobile Number and Password to access your verified profile.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthenticate} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Email, Username, or Mobile No.</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={authInput}
                  onChange={(e) => setAuthInput(e.target.value)}
                  placeholder="alex.mercer@example.com / +14158923011"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Account Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter account password..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-2xl gradient-bg-primary text-white text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying Credentials...' : 'Unlock My Profile'}
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-500">
                Demo Auth Mode: Click <strong className="text-indigo-400 cursor-pointer" onClick={() => login({ email: authInput })}>Unlock My Profile</strong> to proceed.
              </span>
            </div>

          </form>

        </div>
      </div>
    );
  }

  // STEP 2: Authenticated View — Profile Details & Completion Meter
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
                src={userProfile.avatar} 
                alt={userProfile.name} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-500/60 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg" title="KYC Verified">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{userProfile.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ID VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">@{userProfile.username} • {userProfile.email}</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Member since {userProfile.memberSince}
              </p>
            </div>
          </div>

          {/* Quick Metrics & Logout */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Available Funds</span>
              <span className="text-xl font-extrabold text-white font-mono">${userProfile.walletBalance.toFixed(2)}</span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Escrow Held
              </span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">${userProfile.escrowLocked.toFixed(2)}</span>
            </div>

            <button
              onClick={() => logout()}
              className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Logout Account
            </button>
          </div>

        </div>

        {/* Profile Completion Meter Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Profile Completion Status</span>
            </div>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">
              {profileCompletion.percentage}% Completed
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
            <div 
              className="h-full rounded-full gradient-bg-primary transition-all duration-1000 shadow-lg shadow-indigo-500/50" 
              style={{ width: `${profileCompletion.percentage}%` }}
            ></div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>
              {profileCompletion.percentage === 100 
                ? '🎉 Fantastic! Your profile is 100% complete and fully verified.' 
                : `Fill remaining details to get 100% verified profile status.`}
            </span>
            <span className="text-indigo-400 font-semibold cursor-pointer" onClick={() => setActiveTab('profile')}>
              Edit Profile Details →
            </span>
          </div>
        </div>

      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-600/20 border border-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-indigo-400" /> Profile Details ({profileCompletion.percentage}%)
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'bookings'
                ? 'bg-indigo-600/20 border border-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" /> My Bookings
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
            <CreditCard className="w-4 h-4 text-amber-400" /> Escrow Wallet
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600/20 border border-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 text-cyan-400" /> Security & 2FA
          </button>
        </div>

        <Link 
          href="/admin" 
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-400 hover:text-white hover:border-slate-700"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" /> Admin Command Center
        </Link>
      </div>

      {/* TAB 1: Complete User Profile Details & Completion Breakdown */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Editable User Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUpdateProfile} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-400" /> Personal Profile Information
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Your personal credentials added during registration.</p>
                </div>

                {savedSuccess && (
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Profile Updated!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Full Name</label>
                  <input 
                    type="text" 
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Username</label>
                  <input 
                    type="text" 
                    value={userProfile.username}
                    onChange={(e) => setUserProfile({ ...userProfile, username: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Email Address</label>
                  <input 
                    type="email" 
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Mobile Phone Number</label>
                  <input 
                    type="text" 
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">City / Location</label>
                  <input 
                    type="text" 
                    value={userProfile.city}
                    onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Emergency SOS Contact Phone</label>
                  <input 
                    type="text" 
                    value={userProfile.emergencyContact}
                    onChange={(e) => setUserProfile({ ...userProfile, emergencyContact: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">About Me / Personal Bio</label>
                <textarea 
                  rows={3}
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Instagram Handle</label>
                  <input 
                    type="text" 
                    value={userProfile.socialInstagram}
                    onChange={(e) => setUserProfile({ ...userProfile, socialInstagram: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">LinkedIn Profile</label>
                  <input 
                    type="text" 
                    value={userProfile.socialLinkedin}
                    onChange={(e) => setUserProfile({ ...userProfile, socialLinkedin: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl gradient-bg-primary text-white text-xs font-extrabold hover:opacity-90 transition-opacity"
                >
                  Save Profile Info
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Profile Completion Checklist */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" /> Completion Breakdown
              </h3>

              <div className="space-y-3">
                {profileCompletion.checks.map((item, idx) => {
                  const isDone = item.isVerified !== undefined 
                    ? item.isVerified 
                    : Boolean(userProfile[item.key as keyof typeof userProfile]);

                  return (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className={isDone ? 'text-slate-200 font-medium' : 'text-slate-400'}>
                          {item.label}
                        </span>
                      </div>
                      <span className={`font-mono font-bold text-[11px] ${isDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                        +{item.weight}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Verification Benefits
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Completing 100% of your profile grants instant companion booking acceptance and unlocks bank-grade escrow instant payouts.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Bookings Management */}
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

      {/* TAB 3: Saved Companions */}
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

      {/* TAB 4: Wallet & Escrow Ledger */}
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

      {/* TAB 5: Security & 2FA Settings */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" /> Security Controls & 2FA
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage identity security, 2-Factor Authentication, and emergency panic contacts.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</h4>
                <p className="text-[11px] text-slate-400">Require TOTP Authenticator code during credential login.</p>
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
      )}

    </div>
  );
}
