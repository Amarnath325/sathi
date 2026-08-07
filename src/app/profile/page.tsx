'use client';

import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Eye, 
  Lock, 
  ShieldCheck, 
  Globe, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Navigation,
  FileCheck
} from 'lucide-react';
import { useUserAuthStore } from '@/lib/userAuthStore';
import { useToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const { user } = useUserAuthStore();
  const { showToast } = useToast();

  // Basic Profile Info
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || 'Aria');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || 'Vance');
  const [bio, setBio] = useState('Passionate about travel, museum galas, and quiet conversation.');
  const [languages, setLanguages] = useState('English, Hindi, Spanish');
  const [interests, setInterests] = useState('Conversation, Travel, Gala Events');
  
  // Location Settings (Section 25 & 26)
  const [city, setCity] = useState('New York');
  const [country, setCountry] = useState('United States');
  const [isGpsActive, setIsGpsActive] = useState(false);

  // Profile Visibility Switcher (Section 24)
  const [visibility, setVisibility] = useState<'PUBLIC' | 'LIMITED' | 'HIDDEN'>('LIMITED');

  const completionPercent = 70 + (bio ? 10 : 0) + (city ? 10 : 0) + (languages ? 10 : 0);

  const handleRequestGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsGpsActive(true);
          showToast('success', 'Location Updated', `Approximate location retrieved via browser GPS (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
        },
        () => {
          showToast('error', 'Location Error', 'Unable to retrieve GPS location.');
        }
      );
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Profile Updated ✓', 'Your profile details have been saved.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Completeness */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Account & Profile Settings</h1>
            <p className="text-xs text-slate-400">Manage your profile, visibility controls, and location privacy.</p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
            COMPLETENESS: {completionPercent}%
          </span>
        </div>

        {/* Completeness Bar (Section 22) */}
        <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div 
            className="h-full gradient-bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* SECTION 24: PROFILE VISIBILITY CONTROLS */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Eye className="w-5 h-5 text-indigo-400" /> Marketplace Profile Visibility
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setVisibility('PUBLIC')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                visibility === 'PUBLIC' 
                  ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <h4 className="text-xs font-bold text-white mb-0.5">Public to Marketplace</h4>
              <p className="text-[10px] text-slate-400">Visible to all registered users searching for companions.</p>
            </button>

            <button
              type="button"
              onClick={() => setVisibility('LIMITED')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                visibility === 'LIMITED' 
                  ? 'bg-amber-600/20 border-amber-500 text-white' 
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <h4 className="text-xs font-bold text-white mb-0.5">Limited (Recommended)</h4>
              <p className="text-[10px] text-slate-400">Visible only to companions with confirmed bookings.</p>
            </button>

            <button
              type="button"
              onClick={() => setVisibility('HIDDEN')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                visibility === 'HIDDEN' 
                  ? 'bg-rose-600/20 border-rose-500 text-white' 
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <h4 className="text-xs font-bold text-white mb-0.5">Hidden Mode</h4>
              <p className="text-[10px] text-slate-400">Completely unlisted from marketplace discovery.</p>
            </button>
          </div>
        </div>

        {/* BASIC INFORMATION & ABOUT ME */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Basic Profile Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">About Me (Bio)</label>
            <textarea 
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Languages Spoken</label>
              <input 
                type="text" 
                value={languages}
                onChange={e => setLanguages(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Interests</label>
              <input 
                type="text" 
                value={interests}
                onChange={e => setInterests(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 25 & 26: LOCATION COLLECTION & PRIVACY */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-400" /> Location & Privacy</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> EXACT ADDRESS PROTECTED
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
              <input 
                type="text" 
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Country</label>
              <input 
                type="text" 
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">Browser Geolocation GPS</p>
              <p className="text-[10px] text-slate-400">Used only for nearby companion matching. Never publicly displays exact coordinates.</p>
            </div>

            <button
              type="button"
              onClick={handleRequestGps}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isGpsActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-900 text-indigo-400 border-slate-800 hover:border-indigo-500'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              {isGpsActive ? 'GPS Active ✓' : 'Use Current Location'}
            </button>
          </div>
        </div>

        {/* SAVE CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>

      </form>
    </div>
  );
}
