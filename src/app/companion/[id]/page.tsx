'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck, Star, MapPin, Globe, Clock, CheckCircle2, Award, Calendar,
  MessageSquare, Sparkles, Heart, Share2, Eye, ChevronLeft, Lock, AlertTriangle, Shield, Plus
} from 'lucide-react';
import { MOCK_COMPANIONS, MOCK_REVIEWS } from '@/lib/mockData';
import { CompanionStatusBadge } from '@/components/companion/CompanionStatusBadge';
import { AvailabilityGrid } from '@/components/companion/AvailabilityGrid';
import { ImageLightboxModal } from '@/components/common/ImageLightboxModal';
import { ReviewFormModal } from '@/components/review/ReviewFormModal';
import { useToast } from '@/components/ui/Toast';

export default function CompanionProfilePage() {
  const params = useParams();
  const { showToast } = useToast();
  const companionId = params?.id as string;
  const companion = MOCK_COMPANIONS.find(c => c.id === companionId) || MOCK_COMPANIONS[0];

  const [activePhoto, setActivePhoto] = useState(companion.avatar);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'availability' | 'safety' | 'reviews'>('overview');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const toggleFavorite = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      showToast('success', 'Saved to Favorites ♡', `${companion.name} added to your saved favorites.`);
    } else {
      showToast('info', 'Removed from Favorites', `${companion.name} removed from your saved list.`);
    }
  };

  const photoGallery = [
    companion.avatar,
    ...(companion.photos || []).filter(p => p !== companion.avatar),
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs & Header Controls */}
      <div className="flex items-center justify-between">
        <Link href="/search" className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Companion Discovery
        </Link>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFavorite}
            className={`p-2.5 rounded-2xl glass-card border transition-all ${isSaved ? 'text-rose-400 border-rose-500/40 bg-rose-500/10' : 'text-slate-400 border-slate-800 hover:text-white'}`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
          </button>
          <button className="p-2.5 rounded-2xl glass-card border border-slate-800 text-slate-400 hover:text-white transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Photo Showcase */}
          <div className="space-y-3">
            <div
              className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden glass-panel border border-slate-800 cursor-pointer group"
              onClick={() => setLightboxImage(activePhoto)}
            >
              <img src={activePhoto} alt={companion.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

              {/* SEPARATE VERIFICATION BADGES (Section 29) */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> EMAIL VERIFIED ✓
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> PHONE VERIFIED ✓
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> IDENTITY VERIFIED ✓
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> KYC VERIFIED ✓
                </span>
              </div>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between pointer-events-none">
                <div>
                  <h1 className="text-3xl font-extrabold text-white">{companion.name}, {companion.age}</h1>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-indigo-400" /> {companion.city}, {companion.country} (12 km away)
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
                  onClick={() => {
                    setActivePhoto(img);
                    setLightboxImage(img);
                  }}
                  className={`h-24 rounded-2xl overflow-hidden cursor-pointer border transition-all relative group ${activePhoto === img ? 'border-indigo-500 ring-2 ring-indigo-500/40 opacity-100' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Tabs (Section 28) */}
          <div className="flex border-b border-slate-800 gap-6 text-sm font-bold text-slate-400 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 border-b-2 transition-all shrink-0 ${activeTab === 'overview' ? 'border-indigo-500 text-white' : 'border-transparent hover:text-slate-200'}`}
            >
              Overview & Bio
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`pb-3 border-b-2 transition-all shrink-0 ${activeTab === 'services' ? 'border-indigo-500 text-white' : 'border-transparent hover:text-slate-200'}`}
            >
              Services & Pricing
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`pb-3 border-b-2 transition-all shrink-0 ${activeTab === 'availability' ? 'border-indigo-500 text-white' : 'border-transparent hover:text-slate-200'}`}
            >
              Availability Matrix
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`pb-3 border-b-2 transition-all shrink-0 ${activeTab === 'safety' ? 'border-indigo-500 text-white' : 'border-transparent hover:text-slate-200'}`}
            >
              Safety & Verification
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition-all shrink-0 ${activeTab === 'reviews' ? 'border-indigo-500 text-white' : 'border-transparent hover:text-slate-200'}`}
            >
              Reviews ({companion.ratingCount})
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white">About {companion.name}</h2>
                <span className="text-xs text-slate-400 font-mono">Response Rate: <strong className="text-emerald-400 font-bold">99% (within 15 mins)</strong></span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{companion.bio}</p>

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

          {/* TAB 2: SERVICES & PRICING */}
          {activeTab === 'services' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">Available Services</h2>
              <div className="grid grid-cols-1 gap-3">
                {companion.categories.map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{cat}</h4>
                      <p className="text-xs text-slate-400">Professional legal companionship for gala events, sightseeing & conversation.</p>
                    </div>
                    <span className="text-sm font-extrabold text-indigo-400 font-mono">${companion.hourlyRate}/hr</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AVAILABILITY */}
          {activeTab === 'availability' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-400" /> Weekly Availability Schedule</h2>
              <p className="text-xs text-slate-400">Green slots indicate active hours when companion is open for bookings.</p>
              <AvailabilityGrid availability={companion.availability || {}} editable={false} />
            </div>
          )}

          {/* TAB 4: SAFETY & PRIVACY GUARANTEE */}
          {activeTab === 'safety' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Platform Verification & Privacy Standards
              </h2>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" /> Strict Data Minimization & Privacy Protection
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For user safety and compliance with Section 28, the following sensitive credentials are <strong>NEVER EXPOSED</strong> on public profiles:
                </p>
                <ul className="text-xs text-slate-400 space-y-1 pl-4 list-disc">
                  <li>✕ Government ID documents or Passport files</li>
                  <li>✕ Private Mobile Phone Numbers</li>
                  <li>✕ Personal Email Addresses</li>
                  <li>✕ Exact Home Address or Coordinates</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    Verified Client Reviews ({companion.ratingCount})
                  </h2>
                  <p className="text-xs text-slate-400">All ratings are submitted by client accounts with completed escrow bookings.</p>
                </div>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" /> Rate & Review {companion.name.split(' ')[0]}
                </button>
              </div>

              <div className="space-y-4">
                {MOCK_REVIEWS.map(rev => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{rev.authorName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                          Verified Escrow Booking ✓
                        </span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />)}
                      <span className="text-xs font-bold text-white font-mono ml-1">{rev.rating}.0</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-light">"{rev.comment}"</p>

                    {/* Sub Ratings Breakdown */}
                    {rev.subRatings && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                          <span>Punctuality:</span> <strong className="text-amber-400">{rev.subRatings.punctuality}★</strong>
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                          <span>Behavior:</span> <strong className="text-amber-400">{rev.subRatings.behavior}★</strong>
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                          <span>Communication:</span> <strong className="text-amber-400">{rev.subRatings.communication}★</strong>
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                          <span>Authenticity:</span> <strong className="text-amber-400">{rev.subRatings.authenticity}★</strong>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Booking Box */}
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

      <ImageLightboxModal
        isOpen={!!lightboxImage}
        imageUrl={lightboxImage}
        title={`${companion.name}'s Photo Showcase`}
        onClose={() => setLightboxImage(null)}
      />

      {/* Review Form Lightbox Modal */}
      {isReviewModalOpen && (
        <ReviewFormModal
          bookingId={`bk-${companion.id}-99`}
          bookingNumber={`CC-2026-${companion.id}88`}
          companionId={companion.id}
          companionName={companion.name}
          authorId="usr-current"
          authorName="Valued Client"
          authorEmail="client@sathi.com"
          authorAvatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
          category={companion.categories[0] || 'Event Companion'}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccessNotification={(msg) => showToast('success', 'Review Submitted ✓', msg)}
        />
      )}

    </div>
  );
}
