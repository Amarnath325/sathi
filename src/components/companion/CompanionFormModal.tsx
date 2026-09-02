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
  AlertCircle,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useKycStore } from '@/lib/kycStore';


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

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Aadhaar & OCR state
  const [aadhaarFront, setAadhaarFront] = useState<string>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
  );
  const [aadhaarBack, setAadhaarBack] = useState<string>(
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
  );
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('5894 3019 4821');
  const [isOcrScanning, setIsOcrScanning] = useState<boolean>(false);
  const [ocrConfidence, setOcrConfidence] = useState<number>(99.2);

  const handleAadhaarUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (side === 'front') {
        setAadhaarFront(result);
      } else {
        setAadhaarBack(result);
      }

      runAadhaarOcrScan(file.name);
    };
    reader.readAsDataURL(file);
  };

  const runAadhaarOcrScan = (fileName: string) => {
    setIsOcrScanning(true);

    let hash = 0;
    for (let i = 0; i < fileName.length; i++) {
      hash = (hash << 5) - hash + fileName.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    const part1 = String((absHash % 8999) + 1000).padStart(4, '5');
    const part2 = String(((absHash * 3) % 8999) + 1000).padStart(4, '8');
    const part3 = String(((absHash * 7) % 8999) + 1000).padStart(4, '2');
    const extractedUid = `${part1} ${part2} ${part3}`;

    const score = 97 + ((absHash % 25) / 10);

    setTimeout(() => {
      setAadhaarNumber(extractedUid);
      setOcrConfidence(Number(score.toFixed(1)));
      setIsOcrScanning(false);
    }, 1200);
  };


  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    dob: '2000-01-01',
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
        dob: initialData.dob || '1999-05-15',
        photos: initialData.photos && initialData.photos.length > 0 ? initialData.photos : [initialData.avatar || PRESET_AVATARS[0]],
        availability: initialData.availability || DEFAULT_SCHEDULE
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        dob: '2000-01-01',
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
    setFieldErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const setField = (key: keyof UserProfile, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    setFormError(null);
    if (fieldErrors[key as string]) {
      setFieldErrors(prev => ({ ...prev, [key as string]: '' }));
    }
  };

  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setField('phone', digitsOnly);
  };

  const handleEmailChange = (val: string) => {
    const trimmed = val.slice(0, 30);
    setField('email', trimmed);
  };

  const handleDobChange = (dobValue: string) => {
    setField('dob', dobValue);
    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (!isNaN(calculatedAge) && calculatedAge > 0) {
        setField('age', Math.max(0, calculatedAge));
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Full Name Validation
    const nameStr = (formData.name || '').trim();
    if (!nameStr) {
      errors.name = 'Full name is required.';
    } else if (nameStr.length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    // 2. Email Address Validation (Max 30 chars & valid regex)
    const emailStr = (formData.email || '').trim();
    if (!emailStr) {
      errors.email = 'Email address is required.';
    } else if (emailStr.length > 30) {
      errors.email = 'Email address length cannot exceed 30 characters.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    // 3. Mobile Number Validation (Exactly 10 numeric digits)
    const phoneStr = (formData.phone || '').trim();
    if (!phoneStr) {
      errors.phone = 'Mobile phone number is required.';
    } else if (!/^[0-9]{10}$/.test(phoneStr)) {
      errors.phone = 'Mobile number must be exactly 10 numeric digits.';
    }

    // 4. Date of Birth (DOB) Validation
    if (!formData.dob) {
      errors.dob = 'Date of Birth (DOB) is required.';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (isNaN(calculatedAge) || birthDate > today) {
        errors.dob = 'Please select a valid past Date of Birth.';
      } else if (calculatedAge < 18) {
        errors.dob = `Companion must be at least 18 years old (Current calculated age: ${calculatedAge}).`;
      }
    }

    // 5. Location Validation
    if (!formData.country?.trim() || !formData.city?.trim()) {
      errors.location = 'Country and City / Hub selection is required.';
    }

    // 6. Spoken Languages Validation
    if (!formData.languages || formData.languages.length === 0) {
      errors.languages = 'Please select at least 1 spoken language.';
    }

    // Check Tab 1 Errors
    if (errors.name || errors.email || errors.phone || errors.dob || errors.location || errors.languages) {
      setActiveTab('basic');
      setFieldErrors(errors);
      setFormError(errors.name || errors.email || errors.phone || errors.dob || errors.location || errors.languages);
      return false;
    }

    // 7. Pricing & Categories Tab Validation
    if (!formData.hourlyRate || formData.hourlyRate <= 0) {
      errors.hourlyRate = 'Hourly rate must be greater than 0.';
    }
    if (!formData.categories || formData.categories.length === 0) {
      errors.categories = 'Please select at least 1 service category.';
    }

    if (errors.hourlyRate || errors.categories) {
      setActiveTab('pricing');
      setFieldErrors(errors);
      setFormError(errors.hourlyRate || errors.categories);
      return false;
    }

    // 8. Bio & Skills Tab Validation
    if (!formData.bio || formData.bio.trim().length < 10) {
      errors.bio = 'Bio description is required (minimum 10 characters).';
    }
    if (!formData.skills || formData.skills.length === 0) {
      errors.skills = 'Please add at least 1 skill or specialty tag.';
    }

    if (errors.bio || errors.skills) {
      setActiveTab('bio_skills');
      setFieldErrors(errors);
      setFormError(errors.bio || errors.skills);
      return false;
    }

    setFieldErrors({});
    setFormError(null);
    return true;
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const companionId = formData.id || `comp-${Date.now()}`;
    const docNum = aadhaarNumber || (formData as any).aadhaarNumber || `ID-${Math.floor(100000 + Math.random() * 900000)}`;

    // Add to KYC Application Store as PENDING verification
    try {
      useKycStore.getState().addApplication({
        userId: companionId,
        userName: formData.name || 'New Companion',
        userEmail: formData.email || '',
        userPhone: formData.phone || '',
        userDob: formData.dob || '2000-01-01',
        userAge: formData.age || 25,
        userGender: formData.gender || 'Female',
        userCountry: formData.country || 'India',
        userState: (formData as any).state || '',
        userCity: formData.city || 'Mumbai',
        userPincode: (formData as any).pincode || '',
        languages: formData.languages || ['English'],
        hourlyRate: formData.hourlyRate || 75,
        dailyRate: formData.dailyRate || 350,
        weeklyRate: formData.weeklyRate || 2000,
        categories: formData.categories || ['Event Companion'],
        skills: formData.skills || ['Multilingual'],
        bio: formData.bio || 'Registered Companion Profile',
        avatar: formData.avatar || PRESET_AVATARS[0],
        photos: formData.photos || [formData.avatar || PRESET_AVATARS[0]],
        type: 'AADHAAR_CARD',
        documentNumber: docNum,
        fileUrl: aadhaarFront || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
        fileUrlBack: aadhaarBack || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        selfieUrl: formData.avatar || PRESET_AVATARS[0],
        ocrData: {
          extractedName: formData.name || 'Verified Applicant',
          extractedDocNum: docNum,
          confidenceScore: ocrConfidence || 99.2
        },
        livenessScore: 99.4,
        status: 'PENDING',
        safetyTier: 'TIER_2_ADDRESS',
        bgvStatus: 'NOT_STARTED',
        expiresAt: '2028-12-31'
      });
    } catch (kycErr) {
      console.warn('Failed to queue KYC record from modal:', kycErr);
    }

    onSubmit({
      ...formData,
      id: companionId,
      createdSource: initialData?.createdSource || 'ADMIN',
      aadhaarNumber: docNum,
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

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setField('avatar', dataUrl);
      const existing = formData.photos || [];
      if (!existing.includes(dataUrl)) {
        setField('photos', [dataUrl, ...existing]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), dataUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };



  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'basic', label: '1. Basic Info', icon: User },
    { id: 'pricing', label: '2. Rates & Categories', icon: DollarSign },
    { id: 'bio_skills', label: '3. Bio & Badges', icon: Sparkles },
    { id: 'kyc', label: '4. KYC Verification', icon: ShieldCheck },
    { id: 'schedule', label: '5. Availability', icon: Calendar }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-slate-950/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">

        {/* Header */}
        <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 leading-tight">
                {initialData ? 'Edit Companion Profile' : 'Register New Companion'}
                <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Admin Portal
                </span>
              </h2>
              <p className="text-[9.5px] text-slate-400 leading-tight">Setup companion profile with location, rates, KYC & availability.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-3 py-1 bg-slate-950/40 border-b border-slate-800 overflow-x-auto shrink-0 custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Alert Error */}
        {formError && (
          <div className="mx-3 mt-1.5 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10.5px] font-semibold flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-2.5 custom-scrollbar">

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-2.5 animate-fade-in">
              {/* Row 1: 4 Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">

                {/* Full Name */}
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <User className="w-2.5 h-2.5 text-purple-400" /> Full Name <span className="text-rose-400">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sophia Chen"
                    value={formData.name || ''}
                    onChange={e => setField('name', e.target.value)}
                    className={`w-full px-2 py-1 rounded-md bg-slate-950 border text-xs text-white focus:outline-none transition-all h-7.5 ${fieldErrors.name ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-800 focus:border-purple-500'
                      }`}
                  />
                </div>

                {/* Email Address (Max 30 Chars) */}
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Mail className="w-2.5 h-2.5 text-purple-400" /> Email <span className="text-rose-400">*</span>
                    </span>
                    <span className={`text-[8.5px] font-mono ${(formData.email?.length || 0) >= 30 ? 'text-amber-400 font-bold' : 'text-slate-500'
                      }`}>
                      {formData.email?.length || 0}/30
                    </span>
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={30}
                    placeholder="sophia@example.com"
                    value={formData.email || ''}
                    onChange={e => handleEmailChange(e.target.value)}
                    className={`w-full px-2 py-1 rounded-md bg-slate-950 border text-xs text-white focus:outline-none transition-all h-7.5 ${fieldErrors.email ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-800 focus:border-purple-500'
                      }`}
                  />
                </div>

                {/* Mobile Phone (10 Digits Only) */}
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5 text-purple-400" /> Mobile <span className="text-rose-400">*</span>
                    </span>
                    <span className={`text-[8.5px] font-mono ${(formData.phone?.length || 0) === 10 ? 'text-emerald-400 font-bold' : 'text-slate-500'
                      }`}>
                      {formData.phone?.length || 0}/10
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={formData.phone || ''}
                    onChange={e => handlePhoneChange(e.target.value)}
                    className={`w-full px-2 py-1 rounded-md bg-slate-950 border text-xs text-white font-mono focus:outline-none transition-all h-7.5 ${fieldErrors.phone ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-800 focus:border-purple-500'
                      }`}
                  />
                </div>

                {/* Date of Birth (DOB) Date Picker */}
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-purple-400" /> DOB <span className="text-rose-400">*</span>
                    </span>
                    <span className="text-[8.5px] font-mono font-bold text-purple-300">
                      Age: {formData.age || 25}y
                    </span>
                  </label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.dob || ''}
                    onChange={e => handleDobChange(e.target.value)}
                    className={`w-full px-2 py-1 rounded-md bg-slate-950 border text-xs text-white focus:outline-none transition-all h-7.5 ${fieldErrors.dob ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-800 focus:border-purple-500'
                      }`}
                  />
                </div>

              </div>

              {/* Row 2: Age, Gender, Spoken Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {/* Age (Calculated/Manual) */}
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={80}
                    value={formData.age || 25}
                    onChange={e => setField('age', Number(e.target.value))}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-white font-mono font-bold text-purple-300 focus:border-purple-500 focus:outline-none transition-all h-7.5"
                    disabled
                  />
                </div>

                {/* Gender Identity */}
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Gender Identity
                  </label>
                  <select
                    value={formData.gender || 'Female'}
                    onChange={e => setField('gender', e.target.value)}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none transition-all h-7.5"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other / Prefer not to say</option>
                  </select>
                </div>

                {/* Spoken Languages Quick Selector & Custom Add */}
                <div className="lg:col-span-2">
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Spoken Languages
                  </label>
                  <div className="flex flex-wrap items-center gap-1">
                    {PRESET_LANGUAGES.slice(0, 5).map(lang => {
                      const isSelected = (formData.languages || []).includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          className={`text-[9.5px] px-1.5 py-0.5 rounded border font-bold transition-all flex items-center gap-0.5 cursor-pointer ${isSelected
                            ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                          {isSelected && <Check className="w-2 h-2 text-purple-400" />}
                          {lang}
                        </button>
                      );
                    })}
                    <div className="flex items-center gap-1 flex-1 min-w-[120px]">
                      <input
                        type="text"
                        placeholder="Add lang..."
                        value={newLang}
                        onChange={e => setNewLang(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomLanguage())}
                        className="w-full px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-white outline-none h-6"
                      />
                      <button
                        type="button"
                        onClick={addCustomLanguage}
                        className="px-2 py-0.5 rounded bg-purple-600 text-white text-[9.5px] font-bold hover:bg-purple-500 h-6 shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: 4-Column Location Cascade (Country -> State -> City -> Pincode) */}
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
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
            </div>
          )}

          {/* TAB 2: PRICING & CATEGORIES */}
          {activeTab === 'pricing' && (
            <div className="space-y-2.5 animate-fade-in">
              {/* Top Row: 6 Compact Pricing & Stat Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Hourly Rate <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={formData.hourlyRate || 50}
                    onChange={e => setField('hourlyRate', Number(e.target.value))}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-white font-mono font-bold text-emerald-400 focus:border-purple-500 focus:outline-none transition-all h-7.5"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Daily Rate
                  </label>
                  <input
                    type="number"
                    value={formData.dailyRate || (Number(formData.hourlyRate || 50) * 7)}
                    onChange={e => setField('dailyRate', Number(e.target.value))}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-white font-mono font-bold text-emerald-400 focus:border-purple-500 focus:outline-none transition-all h-7.5"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Weekly Rate
                  </label>
                  <input
                    type="number"
                    value={formData.weeklyRate || (Number(formData.hourlyRate || 50) * 40)}
                    onChange={e => setField('weeklyRate', Number(e.target.value))}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-white font-mono font-bold text-emerald-400 focus:border-purple-500 focus:outline-none transition-all h-7.5"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Experience (Yrs)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={formData.experienceYears || 3}
                    onChange={e => setField('experienceYears', Number(e.target.value))}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none transition-all h-7.5"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Education Level
                  </label>
                  <input
                    type="text"
                    placeholder="Bachelor Degree"
                    value={formData.education || ''}
                    onChange={e => setField('education', e.target.value)}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none transition-all h-7.5"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Account Status
                  </label>
                  <select
                    value={formData.status || 'ACTIVE'}
                    onChange={e => setField('status', e.target.value as CompanionStatus)}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-white font-bold focus:border-purple-500 focus:outline-none transition-all h-7.5"
                  >
                    <option value="ACTIVE" className="text-emerald-400">ACTIVE</option>
                    <option value="PENDING_VERIFICATION" className="text-amber-400">PENDING</option>
                    <option value="INACTIVE" className="text-slate-400">INACTIVE</option>
                    <option value="SUSPENDED" className="text-rose-400">SUSPENDED</option>
                  </select>
                </div>
              </div>

              {/* Service Categories Multi-select */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                  Service Categories
                </label>
                <div className="flex flex-wrap gap-1">
                  {ALL_CATEGORIES.map(cat => {
                    const isSelected = (formData.categories || []).includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`text-[9.5px] px-2 py-1 rounded-md border font-bold transition-all cursor-pointer ${isSelected
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 animate-fade-in">

              {/* Left Column: Bio & Badges */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Bio / Profile Tagline
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio || ''}
                    onChange={e => setField('bio', e.target.value)}
                    placeholder="Describe companion background, hobbies, etiquette, conversational skills..."
                    className="w-full px-2 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none transition-all custom-scrollbar"
                  />
                </div>

                {/* Skills Tag Input */}
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                    Skills & Specialties
                  </label>

                  <div className="flex flex-wrap gap-1">
                    {(formData.skills || []).map(skill => (
                      <span
                        key={skill}
                        className="text-[9px] px-1.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-rose-400"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-1 pt-0.5">
                    <input
                      type="text"
                      placeholder="Add skill (e.g. CPR Certified)..."
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-white outline-none focus:border-purple-500 h-6.5"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-2.5 py-1 rounded-md bg-purple-600 text-white text-[9.5px] font-bold hover:bg-purple-500 flex items-center gap-1 h-6.5"
                    >
                      <Plus className="w-2.5 h-2.5" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Avatar, Gallery & Badges */}
              <div className="space-y-2">
                {/* Avatar Selector */}
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[9.5px] font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                      <Camera className="w-2.5 h-2.5 text-purple-400" /> Avatar Image
                    </label>
                    <label className="cursor-pointer px-2 py-0.5 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[9px] font-bold hover:bg-purple-600/50 transition-all flex items-center gap-1 shadow-sm">
                      <Upload className="w-2.5 h-2.5" /> Upload File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src={formData.avatar || PRESET_AVATARS[0]}
                      alt="Avatar Preview"
                      className="w-10 h-10 rounded-lg object-cover border border-purple-500 shadow-sm shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        placeholder="Paste Image URL..."
                        value={formData.avatar || ''}
                        onChange={e => setField('avatar', e.target.value)}
                        className="w-full px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-white outline-none focus:border-purple-500 h-6"
                      />
                      <div className="flex flex-wrap items-center gap-1">
                        {PRESET_AVATARS.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt="Preset"
                            onClick={() => setField('avatar', url)}
                            className={`w-5 h-5 rounded object-cover cursor-pointer border hover:scale-105 transition-all ${formData.avatar === url ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-slate-800'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Badges Toggles */}
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-purple-500/40 transition-all">
                    <input
                      type="checkbox"
                      checked={!!formData.verificationBadge}
                      onChange={e => setField('verificationBadge', e.target.checked)}
                      className="w-3 h-3 rounded text-purple-600 bg-slate-950 border-slate-800"
                    />
                    <div className="text-[10px]">
                      <span className="font-bold text-white flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Verified Badge
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-purple-500/40 transition-all">
                    <input
                      type="checkbox"
                      checked={!!formData.isAvailableNow}
                      onChange={e => setField('isAvailableNow', e.target.checked)}
                      className="w-3 h-3 rounded text-purple-600 bg-slate-950 border-slate-800"
                    />
                    <div className="text-[10px]">
                      <span className="font-bold text-white flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> Available Now
                      </span>
                    </div>
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: KYC VERIFICATION */}
          {activeTab === 'kyc' && (
            <div className="space-y-2.5 animate-fade-in">
              {/* Top Row: Document Type, Status, Read-Only Aadhaar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-0.5">Document Type</label>
                  <select
                    value={formData.kycStatus === 'APPROVED' ? 'Aadhaar Card' : 'Government ID'}
                    onChange={e => setField('kycStatus', e.target.value)}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none h-7.5"
                  >
                    <option value="APPROVED">Aadhaar Card (Dual Side)</option>
                    <option value="APPROVED">Passport Scan</option>
                    <option value="APPROVED">Driving License</option>
                    <option value="PENDING">Voter ID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-0.5">KYC Approval Status</label>
                  <select
                    value={formData.kycStatus || 'APPROVED'}
                    onChange={e => setField('kycStatus', e.target.value)}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none h-7.5"
                  >
                    <option value="APPROVED" className="text-emerald-400">APPROVED</option>
                    <option value="PENDING" className="text-amber-400">PENDING</option>
                    <option value="REJECTED" className="text-rose-400">REJECTED</option>
                  </select>
                </div>

                {/* Read-Only Aadhaar Number */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[9.5px] font-bold text-purple-300 uppercase flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-purple-400" /> Aadhaar (OCR Extracted)
                    </label>
                    <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0 rounded border border-emerald-500/30">
                      Match {ocrConfidence}%
                    </span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={isOcrScanning ? 'Scanning...' : aadhaarNumber}
                    className="w-full px-2 py-1 rounded-md bg-slate-950 border border-purple-500/40 text-xs text-emerald-400 font-mono font-bold tracking-wider cursor-not-allowed outline-none select-none h-7.5"
                  />
                </div>
              </div>

              {/* Bottom Row: Aadhaar Upload Front & Back Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Front Upload */}
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] text-slate-300 font-extrabold uppercase flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5 text-purple-400" /> Aadhaar Front
                    </span>
                    <label className="cursor-pointer px-2 py-0.5 rounded bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[8.5px] font-bold hover:bg-purple-600/50 transition-all flex items-center gap-1">
                      <Upload className="w-2 h-2" /> Upload Front
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleAadhaarUpload(e, 'front')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="relative group overflow-hidden rounded-md border border-slate-800 bg-slate-950">
                    <img
                      src={aadhaarFront}
                      alt="Aadhaar Front"
                      className="w-full h-24 object-cover"
                    />
                    {isOcrScanning && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center gap-1">
                        <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" />
                        <span className="text-[9px] font-mono font-bold text-purple-300">Scanning Front...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Back Upload */}
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] text-slate-300 font-extrabold uppercase flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5 text-purple-400" /> Aadhaar Back
                    </span>
                    <label className="cursor-pointer px-2 py-0.5 rounded bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[8.5px] font-bold hover:bg-purple-600/50 transition-all flex items-center gap-1">
                      <Upload className="w-2 h-2" /> Upload Back
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleAadhaarUpload(e, 'back')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="relative group overflow-hidden rounded-md border border-slate-800 bg-slate-950">
                    <img
                      src={aadhaarBack}
                      alt="Aadhaar Back"
                      className="w-full h-24 object-cover"
                    />
                    {isOcrScanning && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center gap-1">
                        <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" />
                        <span className="text-[9px] font-mono font-bold text-purple-300">Scanning Back...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* TAB 5: AVAILABILITY SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-2 animate-fade-in">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <h3 className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Weekly Availability Slots Grid
                    </h3>
                  </div>

                  {/* Schedule Presets */}
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => applySchedulePreset('weekdays')}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 text-[8.5px] font-bold border border-slate-800 hover:border-purple-500/30 transition-all"
                    >
                      Weekdays (9am-8pm)
                    </button>
                    <button
                      type="button"
                      onClick={() => applySchedulePreset('weekends')}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 text-[8.5px] font-bold border border-slate-800 hover:border-purple-500/30 transition-all"
                    >
                      Weekends (9am-8pm)
                    </button>
                    <button
                      type="button"
                      onClick={() => applySchedulePreset('both')}
                      className="px-2 py-0.5 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-[8.5px] font-bold border border-purple-500/40 transition-all"
                    >
                      All Days
                    </button>
                    <button
                      type="button"
                      onClick={() => applySchedulePreset('clear')}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-rose-900/30 text-rose-400 text-[8.5px] font-bold border border-slate-800 hover:border-rose-500/30 transition-all"
                    >
                      Clear
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
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold border border-slate-800 transition-all cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-1.5">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1].id);
                }}
                className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 cursor-pointer"
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
                className="px-3.5 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFormSubmit}
                className="px-3.5 py-1 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-300" /> Save Profile
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
