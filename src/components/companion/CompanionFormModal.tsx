'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, CompanionStatus, AvailabilityGrid as AvGrid } from '@/lib/types';
import { ALL_CATEGORIES } from '@/lib/mockData';
import { AvailabilityGrid } from './AvailabilityGrid';
import { SearchableLocationPicker, LocationSelection } from '@/components/location/SearchableLocationPicker';

import {
  X,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  User,
  DollarSign,
  FileText,
  ShieldCheck,
  Calendar,
  Sparkles,
  Award,
  Globe,
  Phone,
  Mail,
  MapPin,
  Camera,
  Check,
  AlertCircle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<UserProfile>) => void;
  initialData?: UserProfile | null;
}

type TabType = 'basic' | 'pricing' | 'bio_skills' | 'kyc' | 'schedule';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
];

const PRESET_LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'Mandarin', 'German', 'Japanese', 'Russian', 'Italian'];

const DEFAULT_SCHEDULE: AvGrid = {
  Mon: [9, 10, 11, 14, 15, 16, 17],
  Tue: [9, 10, 11, 14, 15, 16, 17],
  Wed: [9, 10, 11, 14, 15, 16, 17],
  Thu: [9, 10, 11, 14, 15, 16, 17],
  Fri: [9, 10, 11, 14, 15, 16, 17],
  Sat: [10, 11, 12, 13, 14, 15, 16],
  Sun: []
};

export function CompanionFormModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    age: 25,
    gender: 'Female',
    city: 'New York',
    country: 'USA',
    avatar: PRESET_AVATARS[0],
    photos: [PRESET_AVATARS[0]],
    categories: ['Event Companion'],
    skills: ['Multilingual', 'Event Hosting', 'Communication'],
    languages: ['English'],
    hourlyRate: 50,
    dailyRate: 350,
    weeklyRate: 2000,
    bio: '',
    education: 'Bachelor Degree',
    experienceYears: 3,
    status: 'ACTIVE',
    verificationBadge: true,
    isAvailableNow: true,
    kycStatus: 'APPROVED',
    riskLevel: 'LOW',
    availability: DEFAULT_SCHEDULE,
    ratingAvg: 5.0,
    ratingCount: 0,
    completedBookings: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        photos: initialData.photos && initialData.photos.length > 0 ? initialData.photos : [initialData.avatar || PRESET_AVATARS[0]],
        availability: initialData.availability || DEFAULT_SCHEDULE
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: 25,
        gender: 'Female',
        city: 'New York',
        country: 'USA',
        avatar: PRESET_AVATARS[0],
        photos: [PRESET_AVATARS[0]],
        categories: ['Event Companion'],
        skills: ['Multilingual', 'Event Hosting'],
        languages: ['English'],
        hourlyRate: 50,
        dailyRate: 350,
        weeklyRate: 2000,
        bio: '',
        education: 'Bachelor Degree',
        experienceYears: 3,
        status: 'ACTIVE',
        verificationBadge: true,
        isAvailableNow: true,
        kycStatus: 'APPROVED',
        riskLevel: 'LOW',
        availability: DEFAULT_SCHEDULE,
        ratingAvg: 5.0,
        ratingCount: 0,
        completedBookings: 0,
        totalEarnings: 0
      });
    }
    setActiveTab('basic');
    setFormError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const setField = (key: keyof UserProfile, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    setFormError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setActiveTab('basic');
      setFormError('Companion full name is required.');
      return;
    }
    if (!formData.email?.trim()) {
      setActiveTab('basic');
      setFormError('Valid email address is required.');
      return;
    }
    if (!formData.hourlyRate || formData.hourlyRate <= 0) {
      setActiveTab('pricing');
      setFormError('Please provide a valid hourly rate.');
      return;
    }

    onSubmit({
      ...formData,
      id: formData.id || `comp-${Date.now()}`,
      avatar: formData.avatar || PRESET_AVATARS[0],
      createdAt: formData.createdAt || new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  const toggleCategory = (cat: string) => {
    const current = formData.categories || [];
    setField(
      'categories',
      current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat]
    );
  };

  const addSkill = () => {
    if (newSkill.trim() && !(formData.skills || []).includes(newSkill.trim())) {
      setField('skills', [...(formData.skills || []), newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setField('skills', (formData.skills || []).filter(s => s !== skill));
  };

  const toggleLanguage = (lang: string) => {
    const current = formData.languages || [];
    setField(
      'languages',
      current.includes(lang) ? current.filter(l => l !== lang) : [...current, lang]
    );
  };

  const addCustomLanguage = () => {
    if (newLang.trim() && !(formData.languages || []).includes(newLang.trim())) {
      setField('languages', [...(formData.languages || []), newLang.trim()]);
      setNewLang('');
    }
  };

  const addPhoto = () => {
    if (newPhotoUrl.trim()) {
      setField('photos', [...(formData.photos || []), newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const removePhoto = (index: number) => {
    const updated = (formData.photos || []).filter((_, i) => i !== index);
    setField('photos', updated);
  };

  const applySchedulePreset = (type: 'weekdays' | 'weekends' | 'both' | 'clear') => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9am to 8pm
    let newGrid: AvGrid = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
    
    if (type === 'weekdays') {
      newGrid = { Mon: [...hours], Tue: [...hours], Wed: [...hours], Thu: [...hours], Fri: [...hours], Sat: [], Sun: [] };
    } else if (type === 'weekends') {
      newGrid = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [...hours], Sun: [...hours] };
    } else if (type === 'both') {
      newGrid = { Mon: [...hours], Tue: [...hours], Wed: [...hours], Thu: [...hours], Fri: [...hours], Sat: [...hours], Sun: [...hours] };
    } else if (type === 'clear') {
      newGrid = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
    }
    setField('availability', newGrid);
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'basic', label: '1. Basic Info', icon: User },
    { id: 'pricing', label: '2. Rates & Categories', icon: DollarSign },
    { id: 'bio_skills', label: '3. Bio & Badges', icon: Sparkles },
    { id: 'kyc', label: '4. KYC Verification', icon: ShieldCheck },
    { id: 'schedule', label: '5. Availability', icon: Calendar }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {initialData ? 'Edit Companion Profile' : 'Register New Companion'}
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Admin Portal
                </span>
              </h2>
              <p className="text-xs text-slate-400">Complete companion profile setup with KYC, rates, and schedule slots.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/40 border-b border-slate-800 overflow-x-auto shrink-0 custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Alert Error */}
        {formError && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-purple-400" /> Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sophia Chen"
                    value={formData.name || ''}
                    onChange={e => setField('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-purple-400" /> Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sophia@example.com"
                    value={formData.email || ''}
                    onChange={e => setField('email', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-purple-400" /> Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 415-555-0192"
                    value={formData.phone || ''}
                    onChange={e => setField('phone', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={80}
                    value={formData.age || 25}
                    onChange={e => setField('age', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Gender Identity
                  </label>
                  <select
                    value={formData.gender || 'Female'}
                    onChange={e => setField('gender', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other / Prefer not to say</option>
                  </select>
                </div>

              </div>

              {/* DYNAMIC SEARCHABLE LOCATION CASCADE (Country -> State -> City -> Pincode) */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <SearchableLocationPicker
                  initialCountry={formData.country || ''}
                  initialState={(formData as any).state || ''}
                  initialCity={formData.city || ''}
                  initialPincode={(formData as any).pincode || ''}
                  onChange={(loc: LocationSelection) => {
                    setFormData(prev => ({
                      ...prev,
                      country: loc.country,
                      city: loc.city,
                      state: loc.state,
                      pincode: loc.pincode
                    }));
                  }}
                />
              </div>


              {/* Languages Spoken */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_LANGUAGES.map(lang => {
                    const isSelected = (formData.languages || []).includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-purple-400" />}
                        {lang}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add custom language..."
                    value={newLang}
                    onChange={e => setNewLang(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomLanguage}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & CATEGORIES */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Hourly Rate ($ / ₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={formData.hourlyRate || 50}
                    onChange={e => setField('hourlyRate', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold text-emerald-400 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Daily Rate ($ / ₹)
                  </label>
                  <input
                    type="number"
                    value={formData.dailyRate || (Number(formData.hourlyRate || 50) * 7)}
                    onChange={e => setField('dailyRate', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold text-emerald-400 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Weekly Rate ($ / ₹)
                  </label>
                  <input
                    type="number"
                    value={formData.weeklyRate || (Number(formData.hourlyRate || 50) * 40)}
                    onChange={e => setField('weeklyRate', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold text-emerald-400 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={formData.experienceYears || 3}
                    onChange={e => setField('experienceYears', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Education Level
                  </label>
                  <input
                    type="text"
                    placeholder="B.S. Computer Science"
                    value={formData.education || ''}
                    onChange={e => setField('education', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={formData.status || 'ACTIVE'}
                    onChange={e => setField('status', e.target.value as CompanionStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-bold focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="ACTIVE" className="text-emerald-400">ACTIVE</option>
                    <option value="PENDING_VERIFICATION" className="text-amber-400">PENDING VERIFICATION</option>
                    <option value="INACTIVE" className="text-slate-400">INACTIVE</option>
                    <option value="SUSPENDED" className="text-rose-400">SUSPENDED</option>
                  </select>
                </div>
              </div>

              {/* Service Categories Multi-select */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Service Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map(cat => {
                    const isSelected = (formData.categories || []).includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BIO, SKILLS & BADGES */}
          {activeTab === 'bio_skills' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Bio / Profile Tagline
                </label>
                <textarea
                  rows={4}
                  value={formData.bio || ''}
                  onChange={e => setField('bio', e.target.value)}
                  placeholder="Describe companion background, hobbies, etiquette, conversational skills..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none transition-all custom-scrollbar"
                />
              </div>

              {/* Skills Tag Input */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Skills & Expertise Tags
                </label>

                <div className="flex flex-wrap gap-2">
                  {(formData.skills || []).map(skill => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1.5"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Fine Dining Etiquette, CPR Certified)..."
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

              {/* Avatar Selector & Upload */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Profile Avatar Image
                </label>

                <div className="flex items-center gap-4">
                  <img
                    src={formData.avatar || PRESET_AVATARS[0]}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500 shrink-0 shadow-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Paste Image URL..."
                      value={formData.avatar || ''}
                      onChange={e => setField('avatar', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Quick Pick Avatar:</span>
                      {PRESET_AVATARS.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt="Preset"
                          onClick={() => setField('avatar', url)}
                          className={`w-7 h-7 rounded-lg object-cover cursor-pointer border hover:scale-110 transition-all ${
                            formData.avatar === url ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Badges Toggles */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Verification & Status Badges
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-purple-500/40 transition-all">
                    <input
                      type="checkbox"
                      checked={!!formData.verificationBadge}
                      onChange={e => setField('verificationBadge', e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 bg-slate-950 border-slate-800 focus:ring-purple-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Companion Badge
                      </span>
                      <p className="text-[10px] text-slate-400">Display blue checkmark on profile</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-purple-500/40 transition-all">
                    <input
                      type="checkbox"
                      checked={!!formData.isAvailableNow}
                      onChange={e => setField('isAvailableNow', e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 bg-slate-950 border-slate-800 focus:ring-purple-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-white flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Available Now Indicator
                      </span>
                      <p className="text-[10px] text-slate-400">Highlight live available status for instant booking</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KYC VERIFICATION */}
          {activeTab === 'kyc' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" /> KYC Identity Credentials
                  </h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    formData.kycStatus === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {formData.kycStatus || 'PENDING'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Document Type</label>
                    <select
                      value={formData.kycStatus === 'APPROVED' ? 'Aadhaar Card' : 'Government ID'}
                      onChange={e => setField('kycStatus', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="APPROVED">Aadhaar Card (Dual Side)</option>
                      <option value="APPROVED">Passport Scan</option>
                      <option value="APPROVED">Driving License</option>
                      <option value="PENDING">Voter ID</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">KYC Approval Status</label>
                    <select
                      value={formData.kycStatus || 'APPROVED'}
                      onChange={e => setField('kycStatus', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="APPROVED" className="text-emerald-400">APPROVED</option>
                      <option value="PENDING" className="text-amber-400">PENDING MANUAL REVIEW</option>
                      <option value="REJECTED" className="text-rose-400">REJECTED</option>
                    </select>
                  </div>
                </div>

                {/* Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">ID Document Front</span>
                    <img
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"
                      alt="ID Front"
                      className="w-full h-32 rounded-lg object-cover border border-slate-800"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">ID Document Back</span>
                    <img
                      src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80"
                      alt="ID Back"
                      className="w-full h-32 rounded-lg object-cover border border-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AVAILABILITY SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Weekly Availability Slots Grid
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Toggle hours when companion accepts live booking requests.</p>
                  </div>

                  {/* Schedule Presets */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => applySchedulePreset('weekdays')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 text-[10px] font-bold border border-slate-800 hover:border-purple-500/30 transition-all"
                    >
                      Weekdays (9am-8pm)
                    </button>
                    <button
                      type="button"
                      onClick={() => applySchedulePreset('weekends')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 text-[10px] font-bold border border-slate-800 hover:border-purple-500/30 transition-all"
                    >
                      Weekends (9am-8pm)
                    </button>
                    <button
                      type="button"
                      onClick={() => applySchedulePreset('both')}
                      className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-[10px] font-bold border border-purple-500/40 transition-all"
                    >
                      Both (All Days)
                    </button>
                    <button
                      type="button"
                      onClick={() => applySchedulePreset('clear')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-900/30 text-rose-400 text-[10px] font-bold border border-slate-800 hover:border-rose-500/30 transition-all"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Grid */}
                <AvailabilityGrid
                  availability={formData.availability || DEFAULT_SCHEDULE}
                  editable={true}
                  onChange={grid => setField('availability', grid)}
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold border border-slate-800 transition-all"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1].id);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800"
              >
                Back
              </button>
            )}

            {activeTab !== 'schedule' ? (
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTab);
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFormSubmit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Save Companion Profile
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
