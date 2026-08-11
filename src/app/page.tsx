'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  UserCheck, 
  Lock, 
  Star, 
  ArrowRight, 
  PartyPopper, 
  HeartHandshake, 
  Compass, 
  Dumbbell, 
  ShoppingBag, 
  BookOpen, 
  Gamepad2, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Globe,
  Sparkles,
  Users
} from 'lucide-react';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { LivePlatformActivityTicker } from '@/components/common/LivePlatformActivityTicker';
import { HomeEscrowTrustWidget } from '@/components/common/HomeEscrowTrustWidget';

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: "event", name: "Event Companion", desc: "Galas, corporate summits & celebrations", icon: PartyPopper, color: "from-indigo-500 to-purple-500" },
    { id: "elderly", name: "Elderly Support", desc: "Companionship, mobility & errand help", icon: HeartHandshake, color: "from-emerald-500 to-teal-500" },
    { id: "travel", name: "Travel Buddy", desc: "City guides, airport meetups & sightseeing", icon: Compass, color: "from-cyan-500 to-blue-500" },
    { id: "fitness", name: "Fitness Partner", desc: "Gym accountability, outdoor running & tennis", icon: Dumbbell, color: "from-rose-500 to-pink-500" },
    { id: "shopping", name: "Shopping & Styling", desc: "Personal stylist & luxury gift shopping", icon: ShoppingBag, color: "from-amber-500 to-orange-500" },
    { id: "study", name: "Study & Co-Working", desc: "Library study sessions & deep focus", icon: BookOpen, color: "from-violet-500 to-indigo-500" }
  ];

  return (
    <div className="relative overflow-hidden space-y-20 pb-20">
      
      {/* Live Global Platform Pulse Ticker */}
      <LivePlatformActivityTicker />
      
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          
          {/* Safety & Compliance Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide shadow-lg shadow-emerald-900/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Identity Verified & AI Security Screened
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-5xl mx-auto">
            Book Verified Adults for <span className="gradient-text">Safe Companionship</span> & Real Assistance
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            The premier marketplace for hiring background-checked partners to attend galas, assist elderly loved ones, explore cities, study, or shop together. Protected by bank-grade escrow & instant emergency safety monitoring.
          </p>

          {/* Quick Search Bar Widget */}
          <div className="max-w-3xl mx-auto glass-panel p-3 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-2 text-slate-300 w-full">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input 
                type="text" 
                placeholder="What service do you need? (e.g. SF Event Companion, Elderly Care, Study)..."
                className="bg-transparent border-none text-white placeholder-slate-400 text-sm focus:outline-none w-full"
              />
            </div>
            
            <Link 
              href="/search"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl gradient-bg-primary text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Search Verified Companions
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 text-left">
            <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-start gap-3">
              <UserCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">KYC Verified</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Government ID & Live Selfie matched</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-start gap-3">
              <Lock className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Escrow Protection</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Funds released only upon completion</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Panic SOS Alert</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">1-Tap 24/7 emergency dispatch</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-start gap-3">
              <Zap className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Risk Scanned</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Zero tolerance for unsafe conduct</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Category Grid Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Explore Certified Services</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Select a category to view instant-available companions for hourly or daily hire.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.id} 
                href={`/search?category=${encodeURIComponent(cat.name)}`}
                className="group relative p-6 rounded-3xl glass-card border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cat.desc}</p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  View Available Companions <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Verified Companions Carousel / Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <Users className="w-4 h-4" /> Recommended Companions
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-1">Featured Verified Companions</h2>
          </div>
          <Link href="/search" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            See All Companions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_COMPANIONS.map((comp) => (
            <div key={comp.id} className="rounded-3xl glass-card border border-slate-800 overflow-hidden hover:border-slate-700 transition-all group flex flex-col justify-between">
              
              {/* Image & Badges Header */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={comp.avatar} 
                  alt={comp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                {/* KYC Verification Badge */}
                {comp.verificationBadge && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ID VERIFIED
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-amber-400 text-[11px] font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {comp.ratingAvg} ({comp.ratingCount})
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white">{comp.name}, {comp.age}</h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" /> {comp.city}, {comp.country}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{comp.bio}</p>
                
                {/* Categories */}
                <div className="flex flex-wrap gap-1.5">
                  {comp.categories.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>

                {/* Pricing & Booking Trigger */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">Rate from</span>
                    <p className="text-base font-extrabold text-white">${comp.hourlyRate}<span className="text-xs font-normal text-slate-400">/hr</span></p>
                  </div>
                  <Link 
                    href={`/companion/${comp.id}`}
                    className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    Book Now
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Interactive Escrow & Safety Showcase */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <HomeEscrowTrustWidget />
      </section>

      {/* Escrow & Trust Process Breakdown */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-3xl font-extrabold text-white">How Bank-Grade Escrow Works</h2>
            <p className="text-sm text-slate-400">Your funds stay 100% protected until your booking service is completed to your satisfaction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto text-lg font-bold">1</div>
              <h3 className="text-base font-bold text-white">Reserve & Escrow Deposit</h3>
              <p className="text-xs text-slate-400">Select date & hours. Payment is placed into secure holding escrow—not sent to companion yet.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto text-lg font-bold">2</div>
              <h3 className="text-base font-bold text-white">Verified Companion Meetup</h3>
              <p className="text-xs text-slate-400">Meet your companion. Live GPS location sharing and Panic SOS features remain active.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mx-auto text-lg font-bold">3</div>
              <h3 className="text-base font-bold text-white">Mutual Approval Release</h3>
              <p className="text-xs text-slate-400">Both parties confirm completion. Escrow releases payout to companion wallet seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
