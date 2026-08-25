'use client';

import React, { useState } from 'react';
import { UserProfile, CompanionStatus } from '@/lib/types';
import { ALL_CATEGORIES } from '@/lib/mockData';
import { AvailabilityGrid } from './AvailabilityGrid';
import { X, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<UserProfile>) => void;
  initialData?: UserProfile | null;
}

export function CompanionFormModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<Partial<UserProfile>>(() => initialData || {
    name: '',
    email: '',
    phone: '',
    age: '' as any,
    gender: '',
    city: '',
    country: '',
    avatar: '',
    photos: [],
    categories: [],
    skills: [],
    languages: [],
    hourlyRate: '' as any,
    dailyRate: '' as any,
    bio: '',
    education: '',
    experienceYears: '' as any,
    status: 'ACTIVE' as CompanionStatus,
    availability: {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: []
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');

  if (!isOpen) return null;

  const set = (key: keyof UserProfile, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const toggleCategory = (cat: string) => {
    const current = formData.categories || [];
    set('categories', current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat]);
  };

  const addSkill = () => {
    if (newSkill.trim() && !(formData.skills || []).includes(newSkill.trim())) {
      set('skills', [...(formData.skills || []), newSkill.trim()]);
      setNewSkill('');
    }
  };

  const addLang = () => {
    if (newLang.trim() && !(formData.languages || []).includes(newLang.trim())) {
      set('languages', [...(formData.languages || []), newLang.trim()]);
      setNewLang('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel max-w-3xl w-full rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 my-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Companion Profile' : 'Register New Companion'}</h2>
          <p className="text-xs text-slate-400 mt-1">Configure profile details, hourly rates, and availability slots.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input
                type="text" required value={formData.name || ''} onChange={e => set('name', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
              <input
                type="email" required value={formData.email || ''} onChange={e => set('email', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Age</label>
              <input
                type="number" min={18} max={80} value={formData.age || ''} onChange={e => set('age', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Gender</label>
              <select
                value={formData.gender || ''} onChange={e => set('gender', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">City</label>
              <input
                type="text" required value={formData.city || ''} onChange={e => set('city', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Country</label>
              <input
                type="text" required value={formData.country || ''} onChange={e => set('country', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hourly Rate ($)</label>
              <input
                type="number" min={10} max={500} value={formData.hourlyRate || ''} onChange={e => set('hourlyRate', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Daily Rate ($)</label>
              <input
                type="number" value={formData.dailyRate || ''} onChange={e => set('dailyRate', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
              <select
                value={formData.status || 'ACTIVE'} onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="border-t border-slate-800 pt-4">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map(cat => {
                const isSelected = (formData.categories || []).includes(cat);
                return (
                  <button
                    key={cat} type="button" onClick={() => toggleCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all
                      ${isSelected ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bio */}
          <div className="border-t border-slate-800 pt-4">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bio / Profile Description</label>
            <textarea
              rows={3} value={formData.bio || ''} onChange={e => set('bio', e.target.value)}
              placeholder="Describe background, personality, etiquette..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Availability */}
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase">Availability Schedule</label>
            <AvailabilityGrid
              availability={formData.availability || {}}
              editable={true}
              onChange={g => set('availability', g)}
            />
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold hover:opacity-90 transition-all flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Save Companion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
