'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  UserCheck, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

export default function BecomeCompanionLanding() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5 w-max mx-auto">
          <ShieldCheck className="w-4 h-4" /> VERIFIED PROVIDER PROGRAM
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Earn by Providing Legitimate Companionship</h1>
        <p className="text-sm text-slate-300">
          Join a trusted, safety-verified marketplace. Offer professional companionship for events, travel, study, fitness, and local assistance.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Set Your Own Rates</h3>
          <p className="text-xs text-slate-400">Choose hourly or daily rates. Receive payments directly into bank escrow with zero payment risk.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Flexible Schedule</h3>
          <p className="text-xs text-slate-400">Configure your weekly availability matrix. Block dates or vacation days anytime with one click.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Bank-Grade Safety</h3>
          <p className="text-xs text-slate-400">Identity verification (KYC), real-time chat moderation, and 24/7 Emergency SOS panic support.</p>
        </div>
      </div>

      {/* Allowed vs Prohibited Matrix */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-400" /> Platform Policy & Zero-Tolerance Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3 p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Allowed Professional Services
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>✓ Conversation & Discussion Partner</li>
              <li>✓ Gala, Wedding & Event Companion</li>
              <li>✓ Sightseeing & Travel Companion</li>
              <li>✓ Shopping & Fashion Companion</li>
              <li>✓ Study, Library & Focus Buddy</li>
              <li>✓ Gaming & Fitness Activity Companion</li>
              <li>✓ Elderly Assistance & Errands</li>
            </ul>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30">
            <h4 className="font-bold text-rose-400 flex items-center gap-1.5 text-sm">
              <XCircle className="w-4 h-4" /> Strictly Prohibited Services
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>✕ Escort or Sexual Services</li>
              <li>✕ Illegal Activities or Drugs</li>
              <li>✕ Off-Platform Direct Payments</li>
              <li>✕ Physical Harassment or Abuse</li>
              <li>✕ Dangerous or Unsafe Solicitations</li>
              <li>✕ Fraudulent or Fake Documents</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center space-y-4 bg-slate-950 p-8 rounded-3xl border border-slate-800">
        <h3 className="text-xl font-bold text-white">Ready to start your companion application?</h3>
        <p className="text-xs text-slate-400">Complete the 12-step verification wizard to publish your companion profile.</p>

        <Link
          href="/companion/onboarding"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm hover:opacity-95 shadow-xl shadow-indigo-600/30 transition-all"
        >
          Start 12-Step Companion Onboarding <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
