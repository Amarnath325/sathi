'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  MessageSquare, 
  Compass, 
  Calendar, 
  ShoppingBag, 
  BookOpen, 
  Gamepad2, 
  Dumbbell, 
  HeartHandshake, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const INTEREST_CATEGORIES = [
  { id: 'CONVERSATION', label: 'Conversation Partner', icon: MessageSquare, desc: 'Engaging dialogue & deep discussions' },
  { id: 'TRAVEL', label: 'Travel Partner', icon: Compass, desc: 'Sightseeing & city exploration' },
  { id: 'EVENT', label: 'Event Companion', icon: Calendar, desc: 'Galas, weddings & public events' },
  { id: 'SHOPPING', label: 'Shopping Partner', icon: ShoppingBag, desc: 'Styling & shopping assistance' },
  { id: 'STUDY', label: 'Study Partner', icon: BookOpen, desc: 'Library sessions & focus study' },
  { id: 'GAMING', label: 'Gaming Partner', icon: Gamepad2, desc: 'Co-op gaming & esports' },
  { id: 'FITNESS', label: 'Fitness Partner', icon: Dumbbell, desc: 'Workout sessions & outdoor sports' },
  { id: 'ELDERLY', label: 'Elderly Support', icon: HeartHandshake, desc: 'Care, companionship & errands' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['CONVERSATION', 'EVENT']);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [city, setCity] = useState('New York');

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const completionPercent = 70 + (selectedInterests.length > 0 ? 15 : 0) + (city ? 15 : 0);

  const handleCompleteOnboarding = () => {
    showToast('success', 'Preferences Saved!', 'Your onboarding preferences have been updated.');
    router.push('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
          STEP 2 OF 2 — PERSONALIZATION
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Welcome to Companion Connect!</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Personalize your marketplace experience. What types of companionship or assistance services are you interested in?
        </p>
      </div>

      {/* Progress Card */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-300">Profile Completeness</span>
          <span className="text-indigo-400 font-mono">{completionPercent}% Complete</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div 
            className="h-full gradient-bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Interest Categories Selector */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Select Categories of Interest
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTEREST_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedInterests.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleInterest(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{cat.label}</h4>
                  <p className="text-[10px] text-slate-400">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location & Language Form */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Primary City</label>
          <input 
            type="text" 
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="e.g. New York, London, Mumbai"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Preferred Language</label>
          <select 
            value={preferredLanguage}
            onChange={e => setPreferredLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex justify-between items-center pt-4">
        <Link 
          href="/dashboard" 
          className="text-xs font-bold text-slate-500 hover:text-slate-300"
        >
          Skip for Now
        </Link>

        <button
          onClick={handleCompleteOnboarding}
          className="px-8 py-3.5 rounded-2xl gradient-bg-primary text-white font-bold text-xs hover:opacity-95 transition-opacity flex items-center gap-2 shadow-xl shadow-indigo-600/30"
        >
          Save & Explore Marketplace <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
