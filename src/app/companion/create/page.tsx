'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserProfile, CompanionStatus, AvailabilityGrid as AvGrid } from '@/lib/types';
import { ALL_CATEGORIES } from '@/lib/mockData';
import { AvailabilityGrid } from '@/components/companion/AvailabilityGrid';
import {
  ArrowLeft, CheckCircle2, User, DollarSign, Calendar, Sparkles, ShieldCheck, Upload
} from 'lucide-react';

const STEPS = ['Basic Information', 'Services & Bio', 'Pricing & Rates', 'Availability Matrix', 'Review & Submit'];

export default function CreateCompanionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    age: 25,
    gender: 'Female',
    city: 'San Francisco',
    country: 'USA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    photos: [],
    categories: ['Event Companion'],
    skills: ['Multilingual', 'Etiquette'],
    languages: ['English'],
    hourlyRate: 45,
    dailyRate: 320,
    weeklyRate: 1800,
    bio: '',
    education: 'B.A. International Relations',
    experienceYears: 3,
    status: 'PENDING_VERIFICATION' as CompanionStatus,
    availability: {
      Mon: [9, 10, 11, 14, 15, 16],
      Tue: [9, 10, 11, 14, 15, 16],
      Wed: [9, 10, 11],
      Thu: [14, 15, 16],
      Fri: [9, 10, 11, 14, 15, 16],
      Sat: [10, 11, 12, 13, 14, 15],
      Sun: []
    }
  });

  const set = (key: keyof UserProfile, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

  const toggleCategory = (cat: string) => {
    const current = formData.categories || [];
    set('categories', current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat]);
  };

  const handleFinish = async () => {
    try {
      await fetch('/api/companions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch {}
    router.push('/companion');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Link href="/companion" className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Companion Directory
      </Link>

      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Companion Registration
        </div>
        <h1 className="text-2xl font-extrabold text-white">Create Companion Profile</h1>
        <p className="text-xs text-slate-400">Complete all 5 steps to register a new verified companion in the platform.</p>
      </div>

      {/* Stepper bar */}
      <div className="grid grid-cols-5 gap-2">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            onClick={() => idx <= currentStep && setCurrentStep(idx)}
            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              idx === currentStep
                ? 'bg-indigo-600/30 border-indigo-500 text-white'
                : idx < currentStep
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <div className="text-[10px] font-bold uppercase">{`Step ${idx + 1}`}</div>
            <div className="text-xs font-semibold truncate mt-0.5">{step}</div>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        {currentStep === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><User className="w-5 h-5 text-indigo-400" /> Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input type="text" value={formData.name || ''} onChange={e => set('name', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                <input type="email" value={formData.email || ''} onChange={e => set('email', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Age</label>
                <input type="number" value={formData.age || 25} onChange={e => set('age', Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Gender</label>
                <select value={formData.gender || 'Female'} onChange={e => set('gender', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">City</label>
                <input type="text" value={formData.city || ''} onChange={e => set('city', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Country</label>
                <input type="text" value={formData.country || ''} onChange={e => set('country', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Services & Biography</h2>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Service Specialties</label>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map(cat => {
                  const isSel = (formData.categories || []).includes(cat);
                  return (
                    <button key={cat} type="button" onClick={() => toggleCategory(cat)} className={`text-xs px-3 py-1.5 rounded-xl border font-semibold ${isSel ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>{cat}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Biography</label>
              <textarea rows={4} value={formData.bio || ''} onChange={e => set('bio', e.target.value)} placeholder="Introduce yourself, hobbies, languages spoken..." className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /> Pricing & Rates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hourly Rate ($)</label>
                <input type="number" value={formData.hourlyRate || 45} onChange={e => set('hourlyRate', Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Daily Rate ($)</label>
                <input type="number" value={formData.dailyRate || 320} onChange={e => set('dailyRate', Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Weekly Pass ($)</label>
                <input type="number" value={formData.weeklyRate || 1800} onChange={e => set('weeklyRate', Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-400" /> Availability Matrix</h2>
            <AvailabilityGrid availability={formData.availability || {}} editable={true} onChange={g => set('availability', g)} />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-400" /> Review Profile Details</h2>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Location:</strong> {formData.city}, {formData.country}</p>
              <p><strong>Rate:</strong> ${formData.hourlyRate}/hr · ${formData.dailyRate}/day</p>
              <p><strong>Categories:</strong> {(formData.categories || []).join(', ')}</p>
            </div>
          </div>
        )}

        {/* Bottom controls */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-6">
          <button disabled={currentStep === 0} onClick={() => setCurrentStep(s => s - 1)} className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-40">
            Back
          </button>
          {currentStep < 4 ? (
            <button onClick={() => setCurrentStep(s => s + 1)} className="px-6 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold hover:opacity-90">
              Continue
            </button>
          ) : (
            <button onClick={handleFinish} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Submit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
