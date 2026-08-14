'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  Calculator,
  UserCheck,
  Clock,
  Award,
  BadgeCheck,
  ChevronRight,
  Zap,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Check
} from 'lucide-react';

export default function BecomeCompanionLanding() {
  // State for interactive tab selection
  const [activeTab, setActiveTab] = useState<'perks' | 'calculator' | 'policy' | 'steps'>('perks');
  
  // State for interactive earnings calculator
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(15);
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  
  // Calculate earnings
  const weeklyTotal = hoursPerWeek * hourlyRate;
  const companionWeeklyShare = Math.round(weeklyTotal * 0.90); // 90% payout to companion
  const monthlyProjected = companionWeeklyShare * 4;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Dynamic Ambient Background Glow */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-950 p-6 sm:p-10 border border-slate-800/80 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Header */}
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/25 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFIED PROVIDER PROGRAM • HIRING NATIONWIDE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Earn Legitimate Income as a <span className="gradient-text">Verified Companion</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join a safe, identity-verified marketplace. Offer social companionship for events, travel, dining, study, fitness, and assistance with 100% bank escrow payout protection.
          </p>

          {/* Key Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>90% Direct Payout</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Escrow Security</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>24/7 SOS Protection</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Flexible Hours</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/companion/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm hover:opacity-95 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              Start Companion Onboarding <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setActiveTab('calculator')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm font-semibold text-slate-200 transition-all"
            >
              <Calculator className="w-4 h-4 text-indigo-400" /> Estimate Potential Earnings
            </button>
          </div>
        </div>
      </div>

      {/* Tabbed Navigation Bar */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 p-1.5 bg-slate-900/80 border border-slate-800/80 rounded-2xl max-w-2xl mx-auto overflow-x-auto">
        <button
          onClick={() => setActiveTab('perks')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'perks'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Why Join
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Calculator className="w-4 h-4" /> Earnings Calculator
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'policy'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Lock className="w-4 h-4" /> Policy & Rules
        </button>

        <button
          onClick={() => setActiveTab('steps')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'steps'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <UserCheck className="w-4 h-4" /> 4-Step Process
        </button>
      </div>

      {/* Tab 1: Perks & Benefits */}
      {activeTab === 'perks' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Set Your Own Rates & Multipliers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You retain complete control over your hourly, daily, or event pricing. Funds are pre-locked in escrow before meetups start to eliminate non-payment risks.
              </p>
              <div className="pt-2 text-xs font-semibold text-indigo-400 flex items-center gap-1">
                Zero Commission Penalty <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Full Schedule Autonomy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Work whenever you choose. Turn availability on/off instantly, block personal calendar days, or accept bookings strictly in your local city.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Real-Time Availability Matrix <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Bank-Grade Safety Protocol</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every client is identity-checked (Govt ID + Biometric Selfie). Live GPS check-in share and a 24/7 one-touch emergency panic system keep you safe.
              </p>
              <div className="pt-2 text-xs font-semibold text-cyan-400 flex items-center gap-1">
                KYC-Verified Clients Only <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Quick Highlight banner */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Companion Trust Guarantee</h4>
                <p className="text-xs text-slate-400">Keep 90% of all booking earnings with automatic bank payouts every Monday.</p>
              </div>
            </div>

            <Link
              href="/companion/onboarding"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              Apply Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Earnings Calculator */}
      {activeTab === 'calculator' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Companion Earnings Estimator</h3>
              <p className="text-xs text-slate-400">Customize your rate and weekly hours to project your net payout.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-6">
              {/* Hours Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300">Weekly Hours Committed:</span>
                  <span className="text-indigo-400 font-mono text-sm">{hoursPerWeek} Hours / week</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={40}
                  step={1}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>4 hrs (Part-Time)</span>
                  <span>20 hrs (Regular)</span>
                  <span>40 hrs (Full-Time)</span>
                </div>
              </div>

              {/* Hourly Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300">Your Base Hourly Rate:</span>
                  <span className="text-emerald-400 font-mono text-sm">${hourlyRate} / hour</span>
                </div>
                <input
                  type="range"
                  min={25}
                  max={150}
                  step={5}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>$25/hr</span>
                  <span>$75/hr</span>
                  <span>$150/hr</span>
                </div>
              </div>

              {/* Note */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  All client payments are held in bank escrow before booking begins. Platform fee is fixed at 10% for payment processing, security verification, and SOS panic coverage.
                </span>
              </div>
            </div>

            {/* Earnings Display Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/30 space-y-4 text-center">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-400">Projected Take-Home Income</span>
              
              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  ${monthlyProjected.toLocaleString()}
                  <span className="text-xs text-slate-400 font-normal"> / month</span>
                </div>
                <p className="text-xs text-slate-400">(${companionWeeklyShare.toLocaleString()} net weekly payout)</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-slate-800/80 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60">
                  <span className="text-[10px] text-slate-400 block">Gross Booking Value</span>
                  <span className="font-mono font-bold text-slate-200">${(weeklyTotal * 4).toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60">
                  <span className="text-[10px] text-slate-400 block">Your Take-Home (90%)</span>
                  <span className="font-mono font-bold text-emerald-400">${monthlyProjected.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/companion/onboarding"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl gradient-bg-primary text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all"
              >
                Apply with this Rate <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Platform Policy & Allowed vs Prohibited Matrix */}
      {activeTab === 'policy' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" /> Platform Code of Conduct & Zero-Tolerance Policy
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-mono font-bold border border-rose-500/20">
              STRICTLY ENFORCED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allowed Professional Services */}
            <div className="space-y-4 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-emerald-400 text-sm">Allowed Professional Services</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'Conversation & Discussion',
                  'Wedding & Event Companion',
                  'Sightseeing & Travel Guide',
                  'Shopping & Style Companion',
                  'Study & Library Focus Buddy',
                  'Fitness & Activity Partner',
                  'Elderly Support & Assistance',
                  'Dining & Gala Attendance'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 text-slate-200 border border-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strictly Prohibited Services */}
            <div className="space-y-4 p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30">
              <div className="flex items-center gap-2 border-b border-rose-500/20 pb-3">
                <XCircle className="w-5 h-5 text-rose-400" />
                <h4 className="font-bold text-rose-400 text-sm">Strictly Prohibited Actions</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'Escort or Sexual Services',
                  'Illegal Activities & Substances',
                  'Off-Platform Cash Payments',
                  'Physical Contact or Abuse',
                  'Dangerous Solicitations',
                  'Fake ID or Fraud Documents'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 text-slate-300 border border-slate-800">
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Zero Tolerance Guarantee:</strong> Any member soliciting non-compliant services will face immediate permanent account termination, forfeiture of escrow balance, and reporting to legal authorities.
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: 4-Step Onboarding Process */}
      {activeTab === 'steps' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" /> Simple 4-Step Verification & Launch
            </h3>
            <p className="text-xs text-slate-400">Complete these steps to become an active verified companion.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Basic Application',
                desc: 'Fill out your profile bio, hobbies, languages, and preferred companionship categories.',
                icon: UserCheck,
                color: 'text-indigo-400',
                bg: 'bg-indigo-500/10'
              },
              {
                step: '02',
                title: 'KYC & ID Check',
                desc: 'Upload official Government ID and complete live biometric selfie verification.',
                icon: ShieldCheck,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10'
              },
              {
                step: '03',
                title: 'Rates & Availability',
                desc: 'Set your custom hourly rates, daily pricing, and set weekly availability matrix.',
                icon: DollarSign,
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/10'
              },
              {
                step: '04',
                title: 'Go Live & Earn',
                desc: 'Receive direct booking requests, chat with verified clients, and earn weekly payouts.',
                icon: TrendingUp,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10'
              }
            ].map((s, idx) => {
              const IconComp = s.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative">
                  <span className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-600">{s.step}</span>
                  <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center font-bold`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{s.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/companion/onboarding"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm hover:opacity-95 shadow-xl shadow-indigo-600/30 transition-all"
            >
              Begin 12-Step Verification Wizard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Compact CTA Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-4xl mx-auto shadow-xl">
        <h3 className="text-lg sm:text-xl font-extrabold text-white">Ready to Monetize Your Time & Skills Securely?</h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Our automated onboarding wizard guides you step-by-step. Join thousands of verified companions today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/companion/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm hover:opacity-95 shadow-xl shadow-indigo-600/30 transition-all"
          >
            Start Companion Onboarding <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/safety"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Read Safety Center Policy
          </Link>
        </div>
      </div>

    </div>
  );
}
