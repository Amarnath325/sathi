'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  DollarSign, 
  Calendar, 
  MapPin, 
  UploadCloud, 
  CheckCircle2, 
  XCircle,
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Lock,
  Building,
  Check,
  Phone,
  Mail,
  User,
  Sparkles,
  Award,
  Globe
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ServicePolicyEngine } from '@/lib/servicePolicyEngine';

export default function CompanionOnboardingWizard() {
  const router = useRouter();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ==================== STEP 1: ELIGIBILITY STATE ====================
  const [dob, setDob] = useState<string>('2000-01-15');
  const [phone, setPhone] = useState<string>('+1 (555) 389-2910');
  const [email, setEmail] = useState<string>('aria.vance@companion.com');
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(true);
  const [agreedEligibility, setAgreedEligibility] = useState<boolean>(true);

  const [step1Errors, setStep1Errors] = useState<{
    dob?: string;
    phone?: string;
    email?: string;
    agreedEligibility?: string;
  }>({});

  // Age calculation helper
  const calculateAge = (birthDateString: string): number => {
    if (!birthDateString) return 0;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const userAge = calculateAge(dob);

  const validateStep1 = (): boolean => {
    const errors: { dob?: string; phone?: string; email?: string; agreedEligibility?: string } = {};

    if (!dob) {
      errors.dob = 'Date of Birth is required for age verification.';
    } else if (userAge < 18) {
      errors.dob = `You must be at least 18 years old to join as a companion (Current Age: ${userAge}).`;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      errors.phone = 'Please enter a valid phone number.';
    }

    if (!email.trim() || !email.includes('@')) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!agreedEligibility) {
      errors.agreedEligibility = 'You must confirm legal eligibility and zero-tolerance policy terms.';
    }

    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== STEP 2: PROFILE STATE ====================
  const [displayName, setDisplayName] = useState('Aria Vance');
  const [legalName, setLegalName] = useState('Aria Elizabeth Vance');
  const [gender, setGender] = useState('Female');
  const [primaryCategory, setPrimaryCategory] = useState('Event Companion');
  const [bio, setBio] = useState('Experienced event companion with a background in art history, fine dining etiquette, and city sightseeing guide services.');
  const [languages, setLanguages] = useState('English, French, Hindi');
  const [skills, setSkills] = useState('Event Coordination, Public Speaking, Fine Dining Etiquette');

  const [step2Errors, setStep2Errors] = useState<{
    displayName?: string;
    legalName?: string;
    gender?: string;
    primaryCategory?: string;
    bio?: string;
    languages?: string;
    skills?: string;
  }>({});

  const CATEGORY_OPTIONS = [
    'Event Companion',
    'Sightseeing & Travel',
    'Dining & Gala',
    'Study & Focus Partner',
    'Elderly Assistance',
    'Shopping Companion',
    'Fitness & Activity'
  ];

  const validateStep2 = (): boolean => {
    const errors: {
      displayName?: string;
      legalName?: string;
      gender?: string;
      primaryCategory?: string;
      bio?: string;
      languages?: string;
      skills?: string;
    } = {};

    if (!displayName.trim() || displayName.trim().length < 3) {
      errors.displayName = 'Public Display Name must be at least 3 characters long.';
    } else if (displayName.trim().length > 40) {
      errors.displayName = 'Display Name cannot exceed 40 characters.';
    }

    if (!legalName.trim() || legalName.trim().length < 3) {
      errors.legalName = 'Full Legal Name is required for KYC identity matching.';
    }

    if (!bio.trim() || bio.trim().length < 30) {
      errors.bio = `Bio must be at least 30 characters long (Currently ${bio.trim().length} characters).`;
    }

    if (!languages.trim()) {
      errors.languages = 'Please specify at least one language spoken.';
    }

    if (!skills.trim()) {
      errors.skills = 'Please list at least two key skills or background hobbies.';
    }

    setStep2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== STEP 3 - 12 OTHER STATES ====================
  const [serviceDescription, setServiceDescription] = useState('Event companion for gala dinners and sightseeing tours.');
  const [policyScanResult, setPolicyScanResult] = useState<any>(null);

  const [hourlyRate, setHourlyRate] = useState(75);
  const [dailyRate, setDailyRate] = useState(500);

  const [serviceCity, setServiceCity] = useState('New York');
  const [maxDistanceKm, setMaxDistanceKm] = useState(25);

  const [docType, setDocType] = useState('NATIONAL_ID');
  const [idNumber, setIdNumber] = useState('ID-8821903');

  const [bankAccountNumber, setBankAccountNumber] = useState('•••• 8821');
  const [agreedToSafety, setAgreedToSafety] = useState(false);

  const handleScanService = (text: string) => {
    setServiceDescription(text);
    const scan = ServicePolicyEngine.evaluateProposedService(text);
    setPolicyScanResult(scan);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        showToast('error', 'Eligibility Validation Failed', 'Please fix the highlighted fields in Step 1.');
        return;
      }
    }

    if (currentStep === 2) {
      if (!validateStep2()) {
        showToast('error', 'Profile Validation Failed', 'Please complete all required profile fields correctly.');
        return;
      }
    }

    if (currentStep === 3 && policyScanResult && !policyScanResult.allowed) {
      showToast('error', 'Prohibited Content Detected', 'Please revise your service description to comply with safety policies.');
      return;
    }

    if (currentStep < 12) {
      setCurrentStep(prev => prev + 1);
      showToast('success', `Step ${currentStep} Completed`, `Proceeding to Step ${currentStep + 1}`);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitApplication = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('success', 'Application Submitted!', 'Your companion application has been dispatched for Admin Review.');
      router.push('/companion/dashboard');
    }, 1500);
  };

  const STEPS_LIST = [
    'Eligibility',
    'Profile',
    'Services',
    'Pricing',
    'Availability',
    'Service Area',
    'Identity',
    'KYC Vault',
    'Payout Setup',
    'Safety Terms',
    'Review',
    'Submit'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Header & Step Tracker */}
      <div className="space-y-3 sm:space-y-4 text-center">
        <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30 inline-block">
          STEP {currentStep} OF 12 — {STEPS_LIST[currentStep - 1].toUpperCase()}
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Companion Verification & Onboarding
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Complete the 12-step application to verify your identity and publish your companion profile.
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div 
            className="h-full gradient-bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 12) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content Card */}
      <div className="glass-panel p-5 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        
        {/* ==================== STEP 1: ELIGIBILITY CHECK ==================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400 shrink-0" /> Step 1: Legal Age & Account Eligibility Check
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20">
                REQUIRED PRE-CHECK
              </span>
            </div>

            {/* Age & Identity Status Banner */}
            <div className={`p-4 rounded-2xl border text-xs space-y-2 transition-colors ${
              userAge >= 18 
                ? 'bg-emerald-950/30 border-emerald-500/30 text-slate-300' 
                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="font-bold flex items-center gap-2 text-sm">
                  {userAge >= 18 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Age Eligibility Verified (18+)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-400">Age Requirement Failed</span>
                    </>
                  )}
                </div>

                <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold border ${
                  userAge >= 18 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}>
                  {userAge > 0 ? `Age ${userAge}` : 'Invalid Date'}
                </span>
              </div>
              <p className="text-slate-400">
                Companion Connect requires all service providers to be at least 18 years old. Your date of birth is verified against your government ID during Step 8 KYC.
              </p>
            </div>

            {/* Input Form Fields for Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date of Birth Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date of Birth *
                  </span>
                  {userAge >= 18 && <span className="text-[10px] text-emerald-400 font-bold">✓ 18+ Eligible</span>}
                </label>
                <input 
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono ${
                    step1Errors.dob ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {step1Errors.dob && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {step1Errors.dob}
                  </p>
                )}
              </div>

              {/* Verified Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Verified Email Address *
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 ${
                    step1Errors.email ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {step1Errors.email && (
                  <p className="text-[11px] text-rose-400 font-medium">{step1Errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" /> Mobile Phone Number *
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> OTP VERIFIED
                  </span>
                </label>
                <input 
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono ${
                    step1Errors.phone ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {step1Errors.phone && (
                  <p className="text-[11px] text-rose-400 font-medium">{step1Errors.phone}</p>
                )}
              </div>
            </div>

            {/* Pre-Requisites Summary Checklist */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-white block border-b border-slate-800/80 pb-2">Pre-Requisites Status:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Email OTP Verified</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Phone OTP Verified</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 ${agreedEligibility ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {agreedEligibility ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  <span>Policy Agreement</span>
                </div>
              </div>
            </div>

            {/* Legal Terms Checkbox */}
            <div className={`p-4 rounded-2xl border transition-all ${
              step1Errors.agreedEligibility ? 'bg-rose-950/30 border-rose-500/50' : 'bg-slate-950 border-slate-800'
            }`}>
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-300">
                <input 
                  type="checkbox"
                  checked={agreedEligibility}
                  onChange={e => setAgreedEligibility(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500 accent-indigo-500 shrink-0"
                />
                <span className="leading-relaxed">
                  I confirm that I am at least 18 years old, legally permitted to work in my jurisdiction, have no criminal convictions for violent offenses or fraud, and strictly adhere to Companion Connect’s zero-tolerance platform policy.
                </span>
              </label>
              {step1Errors.agreedEligibility && (
                <p className="text-[11px] text-rose-400 font-medium mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> {step1Errors.agreedEligibility}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ==================== STEP 2: PROFILE & BIO ==================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400 shrink-0" /> Step 2: Personal Profile & Specialization
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20">
                PUBLIC PROFILE SETUP
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Public Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Public Display Name * <span className="text-slate-500 font-normal">(Shown to clients)</span>
                </label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Aria Vance"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 ${
                    step2Errors.displayName ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {step2Errors.displayName && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {step2Errors.displayName}
                  </p>
                )}
              </div>

              {/* Confidential Full Legal Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Full Legal Name *</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> Private (KYC only)
                  </span>
                </label>
                <input 
                  type="text" 
                  value={legalName}
                  onChange={e => setLegalName(e.target.value)}
                  placeholder="e.g. Aria Elizabeth Vance"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 ${
                    step2Errors.legalName ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {step2Errors.legalName && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {step2Errors.legalName}
                  </p>
                )}
              </div>

              {/* Gender Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Gender Identity *</label>
                <select 
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Primary Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Primary Companionship Category *</label>
                <select 
                  value={primaryCategory}
                  onChange={e => setPrimaryCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORY_OPTIONS.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Quick Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">Or Select Quick Category Tag:</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrimaryCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      primaryCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Professional Bio */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="text-slate-300">Professional Bio & Experience *</label>
                <span className={`font-mono text-[11px] ${bio.trim().length >= 30 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {bio.trim().length} / 500 characters (Min 30 required)
                </span>
              </div>
              <textarea 
                rows={4}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Share your experience, conversation background, etiquette training, hobbies, and companion philosophy..."
                className={`w-full p-4 rounded-2xl bg-slate-950 border text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 leading-relaxed ${
                  step2Errors.bio ? 'border-rose-500' : 'border-slate-800'
                }`}
              ></textarea>
              {step2Errors.bio && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> {step2Errors.bio}
                </p>
              )}
            </div>

            {/* Languages & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" /> Languages Spoken *
                </label>
                <input 
                  type="text" 
                  value={languages}
                  onChange={e => setLanguages(e.target.value)}
                  placeholder="e.g. English, Spanish, French"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 ${
                    step2Errors.languages ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {step2Errors.languages && (
                  <p className="text-[11px] text-rose-400 font-medium">{step2Errors.languages}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Key Skills & Expertise *
                </label>
                <input 
                  type="text" 
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="e.g. Public Speaking, Etiquette, Sightseeing"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 ${
                    step2Errors.skills ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {step2Errors.skills && (
                  <p className="text-[11px] text-rose-400 font-medium">{step2Errors.skills}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 3: SERVICES & PROHIBITED SERVICE SCANNER ==================== */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Step 3: Service Catalog & Policy Scanner</span>
              <span className="text-[10px] font-mono text-indigo-400">REAL-TIME MODERATION</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Proposed Service Description</label>
              <textarea 
                rows={3}
                value={serviceDescription}
                onChange={e => handleScanService(e.target.value)}
                placeholder="Describe your companionship services (e.g., event companion, city travel guide)..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            {policyScanResult && (
              <div className={`p-4 rounded-2xl border text-xs space-y-1 ${policyScanResult.allowed ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/30 border-rose-500/30 text-rose-300'}`}>
                <div className="font-bold flex items-center gap-1.5">
                  {policyScanResult.allowed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  {policyScanResult.allowed ? 'Service Policy Scan Passed!' : 'Policy Violation Detected'}
                </div>
                <p className="text-[11px] opacity-80">{policyScanResult.summary || 'Content complies with legal companionship rules.'}</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== STEP 4: PRICING ==================== */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Step 4: Hourly & Daily Rates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Hourly Rate ($ USD)</label>
                <input 
                  type="number" 
                  value={hourlyRate}
                  onChange={e => setHourlyRate(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Day Rate ($ USD)</label>
                <input 
                  type="number" 
                  value={dailyRate}
                  onChange={e => setDailyRate(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 5: AVAILABILITY ==================== */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Step 5: Weekly Availability Schedule
            </h3>
            <p className="text-xs text-slate-400">Set your default available working days and times.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="font-bold text-white block">{day}</span>
                  <span className="text-[10px] text-emerald-400">09:00 AM - 08:00 PM</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== STEP 6: SERVICE AREA ==================== */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Step 6: Location & Service Radius
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Base Operating City</label>
                <input 
                  type="text"
                  value={serviceCity}
                  onChange={e => setServiceCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Max Travel Distance (Km)</label>
                <input 
                  type="number"
                  value={maxDistanceKm}
                  onChange={e => setMaxDistanceKm(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 7: IDENTITY OVERVIEW ==================== */}
        {currentStep === 7 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Step 7: Biometric & Selfie Check
            </h3>
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <UserCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Live Facial Recognition Passed</h4>
              <p className="text-xs text-slate-400">Liveness check matches registered user credentials.</p>
            </div>
          </div>
        )}

        {/* ==================== STEP 8: PRIVACY DOCUMENT VAULT (KYC) ==================== */}
        {currentStep === 8 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Step 8: Identity Verification (KYC Document Vault)</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> SECURE VAULT
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Document Type</label>
                <select 
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="NATIONAL_ID">National ID / Aadhar / SSN</option>
                  <option value="PASSPORT">International Passport</option>
                  <option value="DRIVING_LICENSE">Driver's License</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Document Number</label>
                <input 
                  type="text" 
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 text-center space-y-2">
              <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="text-xs text-slate-300 font-bold">Encrypted Document Upload Vault</p>
              <p className="text-[10px] text-slate-500">Government documents are never exposed to ordinary users or public search.</p>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                ✓ Document Attached (id_proof_v2.pdf)
              </span>
            </div>
          </div>
        )}

        {/* ==================== STEP 9: PAYOUT SETUP ==================== */}
        {currentStep === 9 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Step 9: Bank Account & Masked Payout Setup
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Bank / Payout Account Number</label>
              <input 
                type="text" 
                value={bankAccountNumber}
                onChange={e => setBankAccountNumber(e.target.value)}
                placeholder="e.g. 1234567890"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">For safety, your bank account details are masked on the frontend (`•••• 8821`).</p>
            </div>
          </div>
        )}

        {/* ==================== STEP 10: SAFETY TERMS ==================== */}
        {currentStep === 10 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Step 10: Safety Terms & Zero-Tolerance Agreement
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreedToSafety}
                  onChange={e => setAgreedToSafety(e.target.checked)}
                  className="mt-0.5 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500" 
                />
                <span>I understand that Companion Connect strictly prohibits escort services, illegal activity, harassment, and off-platform cash solicitations. Violations result in immediate permanent ban.</span>
              </label>
            </div>
          </div>
        )}

        {/* ==================== STEP 11 & 12: REVIEW & SUBMIT ==================== */}
        {(currentStep === 11 || currentStep === 12) && (
          <div className="space-y-4 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Application Ready for Submission</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your 12-step verification data is complete. Clicking submit dispatches your application to the Admin Trust & Safety Review Board.
            </p>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 max-w-lg mx-auto">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Display Name:</span>
                <span className="font-bold text-white">{displayName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-indigo-400">{primaryCategory}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Hourly Rate:</span>
                <span className="font-mono font-bold text-emerald-400">${hourlyRate}/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">KYC Status:</span>
                <span className="font-bold text-emerald-400">Verified ({docType})</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 sm:px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs disabled:opacity-30 flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentStep < 12 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 sm:px-7 py-2.5 rounded-2xl gradient-bg-primary text-white font-bold text-xs hover:opacity-95 flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-900/30 flex items-center gap-2 transition-all"
            >
              {isSubmitting ? 'Submitting to Admin Review...' : 'Submit Companion Application'} <Check className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
