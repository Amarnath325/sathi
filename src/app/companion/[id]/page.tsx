'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck, Star, MapPin, Globe, Clock, CheckCircle2, Award, Calendar,
  MessageSquare, Sparkles, Heart, Share2, Flag, GraduationCap, Briefcase, ChevronLeft
} from 'lucide-react';
import { MOCK_COMPANIONS, MOCK_REVIEWS } from '@/lib/mockData';
import { CompanionStatusBadge } from '@/components/companion/CompanionStatusBadge';
import { AvailabilityGrid } from '@/components/companion/AvailabilityGrid';

export default function CompanionProfilePage() {
  const params = useParams();
  const router = useRouter();
  const companionId = params?.id as string;
  const companion = MOCK_COMPANIONS.find(c => c.id === companionId) || MOCK_COMPANIONS[0];

  const [activePhoto, setActivePhoto] = useState(companion.avatar);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'availability' | 'reviews'>('overview');

  const photoGallery = [
    companion.avatar,
    ...(companion.photos || []).filter(p => p !== companion.avatar),
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link href="/companion" className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Companion Directory
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2.5 rounded-2xl glass-card border transition-all ${isSaved ? 'text-rose-400 border-rose-500/40 bg-rose-500/10' : 'text-slate-400 border-slate-800 hover:text-white'}`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
          </button>
          <button className="p-2.5 rounded-2xl glass-card border border-slate-800 text-slate-400 hover:text-white transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Showcase */}
          <div className="space-y-3">
            <div className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden glass-panel border border-slate-800">
              <img src={activePhoto} alt={companion.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {companion.verificationBadge && (
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> GOVERNMENT ID VERIFIED
                  </span>
                )}
                {companion.status && <CompanionStatusBadge status={companion.status} size="md" />}
              </div>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold text-white">{companion.name}, {companion.age}</h1>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-indigo-400" /> {companion.city}, {companion.country}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-sm font-bold flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {companion.ratingAvg} ({companion.ratingCount} reviews)
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3">
              {photoGallery.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhoto(img)}
                  className={`h-24 rounded-2xl overflow-hidden cursor-pointer border transition-all ${activePhoto === img ? 'border-indigo-500 ring-2 ring-indigo-500/40 opacity-100' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-6 text-sm font-bold text-slate-400">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 border-b-2 transition-all ${activeTab === 'overview' ? 'border-indigo-500 text-white' : 'border-transparent hover:text-slate-200'}`}
            >
              Overview & Bio
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`pb-3 border-b-2 transition-all ${activeTab === 'availability' ? 'border-indigo-500 text-white' : 'border-transparent hover:text-slate-200'}`}
            >
              Availability Matrix
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition-all ${activeTab === 'reviews' ? 'border-indigo-500 text-white' : 'border-transparent hover:text-slate-200'}`}
            >
              Reviews ({companion.ratingCount})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white">About {companion.name}</h2>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Online Now
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line">{companion.bio}</p>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {companion.categories.map((cat, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-400" /> Languages Spoken
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {companion.languages.map((lang, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">{lang}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" /> Skills & Qualifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {companion.skills.map((sk, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">{sk}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-400" /> Weekly Availability Schedule</h2>
              <p className="text-xs text-slate-400">Green slots indicate active hours when companion is open for bookings.</p>
              <AvailabilityGrid availability={companion.availability || {}} editable={false} />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <h2 className="text-xl font-bold text-white">Verified Client Reviews</h2>
              <div className="space-y-4">
                {MOCK_REVIEWS.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{rev.authorName}</span>
                      <span className="text-slate-500">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />)}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: rates & booking */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 sticky top-24 space-y-6">
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Hourly Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white">${companion.hourlyRate}</span>
                <span className="text-xs text-slate-400">/ hour</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Full Day Pass: ${companion.dailyRate || 320}/day</p>
            </div>

            <div className="space-y-3">
              <Link
                href={`/booking/${companion.id}`}
                className="w-full py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30"
              >
                Configure & Book Now <Sparkles className="w-4 h-4" />
              </Link>
              <Link
                href="/chat"
                className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:text-white flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Encrypted Inquiry Chat
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" /> 100% Escrow Protection
              </div>
              <p className="leading-relaxed">Money is safely locked in holding until your meetup is completed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
