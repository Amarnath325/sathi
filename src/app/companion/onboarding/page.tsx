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
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Lock,
  Building,
  Check,
  Search,
  HeartHandshake,
  Users,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  CreditCard,
  Camera,
  Globe,
  Shield,
  Edit3
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ServicePolicyEngine } from '@/lib/servicePolicyEngine';

export default function CompanionOnboardingWizard() {
  const router = useRouter();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Step 1: Account & Eligibility State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('India');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enablePasskey, setEnablePasskey] = useState(true);
  const [enable2FA, setEnable2FA] = useState(true);
  const [agreeAccountCheck, setAgreeAccountCheck] = useState(false);

  // Step 2: Profile & Services State
  const [displayName, setDisplayName] = useState('Aria Vance');
  const [legalName, setLegalName] = useState('Aria Vance');
  const [gender, setGender] = useState('Female');
  const [languages, setLanguages] = useState('English, Hindi, French');
  const [bio, setBio] = useState('Professional event companion for gala dinners, business travel, sightseeing, and intelligent conversation.');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Event Companion', 'Travel Companion', 'Dining & Gala', 'Study & Focus Partner'
  ]);
  const [skills, setSkills] = useState('Event coordination, public speaking, city guide, translation...');

  // Step 3: Safety & Boundaries State
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Event Companion', 'Fine Dining Companion', 'Sightseeing & City Guide'
  ]);
  const [serviceDescription, setServiceDescription] = useState('Describe exactly what customers can book you for. All services strictly non-sexual.');
  const [policyScanResult, setPolicyScanResult] = useState<any>(null);
  const [safetyCheckboxes, setSafetyCheckboxes] = useState({
    nonSexual: true,
    verifiedBooking: true,
    safeMeeting: true,
    prohibitedActivity: true,
  });
  const [bookingRestrictions, setBookingRestrictions] = useState<string[]>([
    'No Overnight', 'No Private Residence', 'No Late Night'
  ]);

  // Step 4: Rates & Availability State
  const [hourlyRate, setHourlyRate] = useState<number>(1500);
  const [halfDayRate, setHalfDayRate] = useState<number>(5000);
  const [fullDayRate, setFullDayRate] = useState<number>(8000);
  const [workingDays, setWorkingDays] = useState<string[]>([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]);
  const [workingHours, setWorkingHours] = useState('Afternoon & Evening (12 PM – 10 PM)');
  const [advanceNotice, setAdvanceNotice] = useState('6 Hours');
  const [cancellationPreference, setCancellationPreference] = useState('Moderate — 100% up to 24h');

  // Step 5: Location & Emergency Safety State
  const [operatingCity, setOperatingCity] = useState('Mumbai Metro');
  const [travelRadiusKm, setTravelRadiusKm] = useState<number>(25);
  const [travelAllowancePerKm, setTravelAllowancePerKm] = useState<number>(20);
  const [travelPreferences, setTravelPreferences] = useState<string[]>(['Intercity Travel']);
  const [emergencyName, setEmergencyName] = useState('Trusted person');
  const [emergencyRelationship, setEmergencyRelationship] = useState('Parent');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 9876543210');
  const [emergencyConsent, setEmergencyConsent] = useState(true);

  // Step 6: Identity Verification State
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [idFrontUploaded, setIdFrontUploaded] = useState(true);
  const [idBackUploaded, setIdBackUploaded] = useState(true);
  const [livenessDone, setLivenessDone] = useState(true);
  const [backgroundConsent, setBackgroundConsent] = useState(true);

  // Step 7: Review & Payout State
  const [bankAccountHolder, setBankAccountHolder] = useState('As per bank account');
  const [payoutMethod, setPayoutMethod] = useState('Direct Bank Transfer (IMPS/NEFT)');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [finalConsent, setFinalConsent] = useState(false);

  // Helper Functions
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    } else {
      if (selectedCategories.length >= 5) {
        showToast('error', 'Limit Reached', 'You can select up to 5 categories.');
        return;
      }
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(prev => prev.filter(s => s !== service));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handleRestrictionToggle = (restriction: string) => {
    if (bookingRestrictions.includes(restriction)) {
      setBookingRestrictions(prev => prev.filter(r => r !== restriction));
    } else {
      setBookingRestrictions(prev => [...prev, restriction]);
    }
  };

  const handleDayToggle = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(prev => prev.filter(d => d !== day));
    } else {
      setWorkingDays(prev => [...prev, day]);
    }
  };

  const handleScanServiceText = (text: string) => {
    setServiceDescription(text);
    const scan = ServicePolicyEngine.evaluateProposedService(text);
    setPolicyScanResult(scan);
  };

  const handleNext = () => {
    if (currentStep === 3 && policyScanResult && !policyScanResult.allowed) {
      showToast('error', 'Policy Check Required', 'Please revise your service description to remove prohibited phrases.');
      return;
    }
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitApplication = () => {
    if (!finalConsent) {
      showToast('error', 'Consent Required', 'Please check the final declaration confirmation box before submitting.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('success', 'Application Submitted!', 'Your companion application has been submitted for Admin Verification Review.');
      router.push('/companion/dashboard');
    }, 1500);
  };

  // 7 Steps Navigation Metadata
  const STEPS = [
    { id: 1, title: 'Account', subtitle: 'Eligibility & OTP' },
    { id: 2, title: 'Profile & Services', subtitle: 'Public profile' },
    { id: 3, title: 'Safety', subtitle: 'Boundaries' },
    { id: 4, title: 'Rates & Availability', subtitle: 'Pricing & schedule' },
    { id: 5, title: 'Location', subtitle: 'Travel & emergency' },
    { id: 6, title: 'Identity', subtitle: 'KYC & liveness' },
    { id: 7, title: 'Review & Payout', subtitle: 'Submit application' },
  ];

  const progressPercentage = Math.round((currentStep / 7) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-lg shadow-indigo-600/30">
            CC
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">Companion Connect</h1>
            <p className="text-xs text-slate-400 font-mono">Secure Companion Registration</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>ENCRYPTED • VERIFIED ONBOARDING</span>
        </div>
      </div>

      {/* Main 2-Column Wizard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-6 sticky top-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Companion Application</h3>
            <p className="text-[11px] text-slate-400">Complete the required verification stages</p>
          </div>

          {/* 7 Vertical Step Indicators */}
          <div className="space-y-2">
            {STEPS.map((s) => {
              const isActive = currentStep === s.id;
              const isDone = currentStep > s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    if (s.id < currentStep || isDone) setCurrentStep(s.id);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-900/30'
                      : isDone
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      : 'bg-slate-950/30 border-slate-900 text-slate-500'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isActive
                        ? 'bg-indigo-500 text-white shadow-md'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : s.id}
                  </div>

                  <div className="overflow-hidden">
                    <h4 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {s.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">{s.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-400">Application progress</span>
              <span className="text-indigo-400 font-bold">{progressPercentage}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div 
                className="h-full gradient-bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT STEP CONTENT CARD */}
        <div className="lg:col-span-9 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          
          {/* STEP 1: ACCOUNT (Eligibility & OTP) */}
          {currentStep === 1 && (
            <div className="space-y-6">
              
              {/* Header Badge & Title */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider uppercase">REQUIRED PRE-CHECK</span>
                  <h2 className="text-2xl font-black text-white">Account & Eligibility</h2>
                  <p className="text-xs text-slate-400">Create your secure account first. Age is calculated automatically from date of birth.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  18+ ELIGIBILITY
                </span>
              </div>

              {/* Adult-Only Alert */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0"></div>
                <p>
                  <strong>Adult-only marketplace:</strong> Companion Connect requires all service providers to be at least 18 years old. Your date of birth is used for eligibility verification.
                </p>
              </div>

              {/* Basic Account Info Form */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Basic account information</span>
                  <span className="text-[10px] font-mono text-amber-400">Age verification pending</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">First Name *</label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="e.g. Aria"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Last Name *</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="e.g. Vance"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Date of Birth *</label>
                    <input 
                      type="date" 
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">You must be 18 or older.</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Country *</label>
                    <select 
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>

                {/* Email & Phone with OTP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                      <span className="text-[10px] font-mono text-emerald-400">Not verified</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button 
                        type="button" 
                        onClick={() => showToast('info', 'OTP Sent', 'Check your email for 6-digit verification code.')}
                        className="px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-bold hover:border-indigo-500 shrink-0"
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">Mobile Number *</label>
                      <span className="text-[10px] font-mono text-emerald-400">Not verified</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="+91 9876543210"
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button 
                        type="button"
                        onClick={() => showToast('info', 'SMS OTP Sent', 'Check your phone SMS for 6-digit verification code.')}
                        className="px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-bold hover:border-indigo-500 shrink-0"
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Password *</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 pr-10"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm Password *</label>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

              </div>

              {/* Account Security Toggles */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Account security</span>
                  <span className="text-[10px] font-mono text-slate-400">Recommended</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Enable Passkey</h5>
                    <p className="text-[10px] text-slate-400">Use your device biometric / PIN for future logins</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={enablePasskey} 
                    onChange={e => setEnablePasskey(e.target.checked)}
                    className="w-5 h-5 accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Enable 2FA after approval</h5>
                    <p className="text-[10px] text-slate-400">Authenticator app or secure OTP challenge</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={enable2FA} 
                    onChange={e => setEnable2FA(e.target.checked)}
                    className="w-5 h-5 accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Checkbox confirmation */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-300">
                  <input 
                    type="checkbox" 
                    checked={agreeAccountCheck}
                    onChange={e => setAgreeAccountCheck(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span>
                    I confirm that I am at least 18 years old and agree to the <strong>Terms of Service</strong>, <strong>Privacy Policy</strong>, and Companion Connect safety standards.
                  </span>
                </label>
              </div>

            </div>
          )}

          {/* STEP 2: PROFILE & SERVICES (Public Profile) */}
          {currentStep === 2 && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider uppercase">PUBLIC PROFILE SETUP</span>
                  <h2 className="text-2xl font-black text-white">Profile & Services</h2>
                  <p className="text-xs text-slate-400">Build the profile customers will see. Private identity information remains restricted.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  PUBLIC PROFILE
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Profile Information</span>
                  <span className="text-[10px] font-mono text-slate-400">Private legal name is never shown publicly</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Public Display Name</label>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="e.g. Aria Vance"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Shown to clients</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Legal Full Name</label>
                    <input 
                      type="text" 
                      value={legalName}
                      onChange={e => setLegalName(e.target.value)}
                      placeholder="As per government ID"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Private - KYC only</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Gender Identity</label>
                    <select 
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Languages Spoken</label>
                    <input 
                      type="text" 
                      value={languages}
                      onChange={e => setLanguages(e.target.value)}
                      placeholder="English, Hindi, French"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Photo Upload Box & Bio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 text-center space-y-2 flex flex-col items-center justify-center">
                    <UploadCloud className="w-8 h-8 text-indigo-400" />
                    <p className="text-xs font-bold text-white">Upload Profile Photo</p>
                    <p className="text-[10px] text-slate-500">Clear, recent face photo • JPG/PNG • max 5 MB</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Professional Bio</label>
                    <textarea 
                      rows={4}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Describe your experience, personality, and the legal services you provide."
                      className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    ></textarea>
                    <span className="text-[10px] text-slate-500 mt-1 block text-right">{bio.length}/500 characters • Minimum 30 characters</span>
                  </div>
                </div>

              </div>

              {/* Categories Selector */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Companion categories</span>
                  <span className="text-[10px] font-mono text-slate-400">Select up to 5</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    'Event Companion', 'Travel Companion', 'Dining & Gala', 'Study & Focus Partner',
                    'Elderly Assistance', 'Shopping Companion', 'Fitness & Activity', 'Gaming Partner',
                    'Conversation Partner', 'Museum & Art Partner'
                  ].map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Skills & expertise</span>
                  <span className="text-[10px] font-mono text-slate-400">Used for matching</span>
                </div>
                <input 
                  type="text" 
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="Event coordination, public speaking, city guide, translation..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

            </div>
          )}

          {/* STEP 3: SAFETY (Boundaries) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider uppercase">SERVICE BOUNDARIES</span>
                  <h2 className="text-2xl font-black text-white">Services & Safety</h2>
                  <p className="text-xs text-slate-400">Clear service boundaries protect companions, clients, and the platform.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  SAFETY FIRST
                </span>
              </div>

              {/* Services Offered */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Services you offer</span>
                  <span className="text-[10px] font-mono text-slate-400">Select all that apply</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    'Event Companion', 'Fine Dining Companion', 'Sightseeing & City Guide',
                    'Business Gala Escort', 'Museum & Art Partner', 'Fitness & Outdoor Buddy',
                    'Virtual Study Focus', 'Wedding Guest Companion', 'Language & Accent Guide',
                    'Shopping & Stylist Buddy'
                  ].map((service) => {
                    const isSelected = selectedServices.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => handleServiceToggle(service)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {service} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Description & Policy Scanner */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Service description</span>
                  <span className="text-[10px] font-mono text-indigo-400">Moderation scan enabled</span>
                </div>

                <textarea 
                  rows={3}
                  value={serviceDescription}
                  onChange={e => handleScanServiceText(e.target.value)}
                  placeholder="Describe exactly what customers can book you for. Do not include prohibited or sexual services."
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                ></textarea>

                {policyScanResult && (
                  <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                    policyScanResult.allowed 
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {policyScanResult.allowed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      {policyScanResult.allowed ? 'Service Policy Scan Passed!' : 'Prohibited Term Detected'}
                    </div>
                    <p className="text-[11px] opacity-80">{policyScanResult.summary || 'Complies with legal companionship policies.'}</p>
                  </div>
                )}
              </div>

              {/* Mandatory Companion Safety Standards */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Mandatory Companion Safety Standards</span>
                  <span className="text-[10px] font-mono text-rose-400">Required</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input type="checkbox" checked={safetyCheckboxes.nonSexual} readOnly className="mt-0.5 w-4 h-4 accent-indigo-500" />
                    <span><strong>Non-sexual services only:</strong> Companion services are strictly non-sexual. Off-platform solicitation or prohibited services can result in permanent termination.</span>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input type="checkbox" checked={safetyCheckboxes.verifiedBooking} readOnly className="mt-0.5 w-4 h-4 accent-indigo-500" />
                    <span><strong>Verified booking requirement:</strong> All engagements must be created and paid through the platform.</span>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input type="checkbox" checked={safetyCheckboxes.safeMeeting} readOnly className="mt-0.5 w-4 h-4 accent-indigo-500" />
                    <span><strong>Safe meeting requirement:</strong> Follow platform rules for verified public venues and approved booking locations.</span>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input type="checkbox" checked={safetyCheckboxes.prohibitedActivity} readOnly className="mt-0.5 w-4 h-4 accent-indigo-500" />
                    <span><strong>Prohibited activity:</strong> No illegal substances, weapons, exploitation, harassment, or unsafe activities.</span>
                  </div>
                </div>
              </div>

              {/* Booking Restrictions */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Your booking restrictions</span>
                  <span className="text-[10px] font-mono text-slate-400">Optional but recommended</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    'No Overnight', 'No Private Residence', 'No Late Night',
                    'No International Travel', 'No Alcohol Events', 'No High-Risk Activities'
                  ].map((res) => {
                    const isSelected = bookingRestrictions.includes(res);
                    return (
                      <button
                        key={res}
                        type="button"
                        onClick={() => handleRestrictionToggle(res)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-slate-900 border-indigo-500 text-indigo-400 shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {res} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: RATES & AVAILABILITY (Pricing & Schedule) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider uppercase">DYNAMIC EARNINGS</span>
                  <h2 className="text-2xl font-black text-white">Rates & Availability</h2>
                  <p className="text-xs text-slate-400">Set your base pricing and availability. Platform fees are calculated automatically.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  EARNINGS
                </span>
              </div>

              {/* Pricing Cards */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Your rates</span>
                  <span className="text-[10px] font-mono text-slate-400">Customer pricing preview</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Hourly Rate (₹)</label>
                    <input 
                      type="number" 
                      value={hourlyRate}
                      onChange={e => setHourlyRate(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Half-Day Rate (₹)</label>
                    <input 
                      type="number" 
                      value={halfDayRate}
                      onChange={e => setHalfDayRate(Number(e.target.value))}
                      placeholder="e.g. 5000"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Full-Day Rate (₹)</label>
                    <input 
                      type="number" 
                      value={fullDayRate}
                      onChange={e => setFullDayRate(Number(e.target.value))}
                      placeholder="e.g. 8000"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Calculation Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Customer pays / hour</span>
                    <strong className="text-sm font-mono text-white">₹{Math.round(hourlyRate * 1.15).toLocaleString()}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Estimated platform fee</span>
                    <strong className="text-sm font-mono text-indigo-400">15%</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Estimated payout / hour</span>
                    <strong className="text-sm font-mono text-emerald-400">₹{Math.round(hourlyRate * 0.85).toLocaleString()}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Escrow protection</span>
                    <strong className="text-xs font-mono text-emerald-400 font-bold">Enabled ✓</strong>
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Working days</span>
                  <span className="text-[10px] font-mono text-slate-400">{workingDays.length}/7 selected</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const isSelected = workingDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold text-center transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Working Hours & Advance Notice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Preferred working hours</span>
                    <span className="text-[10px] font-mono text-slate-400">Matching preference</span>
                  </div>
                  <select 
                    value={workingHours}
                    onChange={e => setWorkingHours(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="Afternoon & Evening (12 PM – 10 PM)">Afternoon & Evening (12 PM – 10 PM)</option>
                    <option value="Morning (8 AM – 1 PM)">Morning (8 AM – 1 PM)</option>
                    <option value="Full Day Flexible">Full Day Flexible</option>
                  </select>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Minimum advance notice</span>
                    <span className="text-[10px] font-mono text-slate-400">Booking protection</span>
                  </div>
                  <select 
                    value={advanceNotice}
                    onChange={e => setAdvanceNotice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="6 Hours">6 Hours</option>
                    <option value="12 Hours">12 Hours</option>
                    <option value="24 Hours">24 Hours</option>
                  </select>
                </div>
              </div>

              {/* Cancellation Preference */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Cancellation preference</span>
                  <span className="text-[10px] font-mono text-slate-400">Customer refund policy</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Flexible — 100% up to 12h',
                    'Moderate — 100% up to 24h',
                    'Strict — 50% non-refundable'
                  ].map((pref) => {
                    const isSelected = cancellationPreference === pref;
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setCancellationPreference(pref)}
                        className={`p-3 rounded-xl text-xs font-bold text-center transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 5: LOCATION (Travel & Emergency) */}
          {currentStep === 5 && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider uppercase">LOCATION & EMERGENCY SAFETY</span>
                  <h2 className="text-2xl font-black text-white">Operating Area & Emergency Contact</h2>
                  <p className="text-xs text-slate-400">Only collect the location information needed for matching and safety.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  SAFETY SETUP
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column: Operating Area */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                    <span className="font-bold text-white">Operating area</span>
                    <span className="text-[10px] font-mono text-slate-400">No exact home address required</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Base Operating City *</label>
                    <select 
                      value={operatingCity}
                      onChange={e => setOperatingCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="Mumbai Metro">Mumbai Metro</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Kolkata">Kolkata</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <label className="font-semibold text-slate-300">Maximum Travel Radius</label>
                      <span className="font-mono text-indigo-400 font-bold">{travelRadiusKm} km</span>
                    </div>
                    <input 
                      type="range" 
                      min={5} 
                      max={100} 
                      value={travelRadiusKm}
                      onChange={e => setTravelRadiusKm(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>5 km</span>
                      <span>25 km</span>
                      <span>50 km</span>
                      <span>100 km</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Travel Allowance Beyond 10 km (₹)</label>
                    <input 
                      type="number" 
                      value={travelAllowancePerKm}
                      onChange={e => setTravelAllowancePerKm(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Per additional kilometer</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {['Intercity Travel', 'International Travel'].map((pref) => {
                      const isSelected = travelPreferences.includes(pref);
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => {
                            if (isSelected) setTravelPreferences(prev => prev.filter(p => p !== pref));
                            else setTravelPreferences(prev => [...prev, pref]);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {pref}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Emergency Contact */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                    <span className="font-bold text-white">Emergency contact</span>
                    <span className="text-[10px] font-mono text-emerald-400">Trusted safety contact</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <p> Emergency contacts may receive safety alerts during an active booking when permitted by your consent and platform policy.</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      value={emergencyName}
                      onChange={e => setEmergencyName(e.target.value)}
                      placeholder="Trusted person"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Relationship *</label>
                    <select 
                      value={emergencyRelationship}
                      onChange={e => setEmergencyRelationship(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">Mobile Number *</label>
                      <span className="text-[10px] font-mono text-emerald-400">Not verified</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="tel" 
                        value={emergencyPhone}
                        onChange={e => setEmergencyPhone(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none font-mono"
                      />
                      <button 
                        type="button"
                        onClick={() => showToast('info', 'OTP Sent', 'Safety contact OTP sent.')}
                        className="px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-bold shrink-0"
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-300 pt-1">
                    <input 
                      type="checkbox" 
                      checked={emergencyConsent}
                      onChange={e => setEmergencyConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-indigo-500"
                    />
                    <span>I consent to emergency safety alerts being sent to this contact during qualifying incidents.</span>
                  </label>
                </div>

              </div>

              {/* Bottom Safety Disclaimer */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300">
                <p>
                  For safety, the platform should use approximate operating areas for discovery and reveal precise booking details only when required by the active booking and safety policy.
                </p>
              </div>

            </div>
          )}

          {/* STEP 6: IDENTITY (KYC & Liveness) */}
          {currentStep === 6 && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider uppercase">SECURE IDENTITY VERIFICATION</span>
                  <h2 className="text-2xl font-black text-white">Government ID & Biometric Verification</h2>
                  <p className="text-xs text-slate-400">Identity verification is mandatory before the companion profile can become bookable.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  KYC SECURITY
                </span>
              </div>

              {/* Document Vault */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Government Identity document</span>
                  <span className="text-[10px] font-mono text-emerald-400">Encrypted document vault</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Government ID Type *</label>
                    <select 
                      value={idType}
                      onChange={e => setIdType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Voter ID">Voter ID</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Document Number *</label>
                    <input 
                      type="text" 
                      value={idNumber}
                      onChange={e => setIdNumber(e.target.value)}
                      placeholder="Enter document number"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Upload Box Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 text-center space-y-2 flex flex-col items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-indigo-400" />
                    <p className="text-xs font-bold text-white">Upload ID Front</p>
                    <p className="text-[10px] text-slate-500">JPG, PNG or PDF • encrypted on upload</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 text-center space-y-2 flex flex-col items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-indigo-400" />
                    <p className="text-xs font-bold text-white">Upload ID Back</p>
                    <p className="text-[10px] text-slate-500">Required where applicable</p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 text-center">
                  Sensitive document numbers should be encrypted at rest and displayed masked. Store only the minimum data required for verification and audit purpose.
                </p>
              </div>

              {/* Selfie & Liveness Check */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Selfie & liveness</span>
                  <span className="text-[10px] font-mono text-emerald-400">Anti-spoofing verification</span>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Verification Ready</h4>
                  <p className="text-xs font-bold text-indigo-400">Live Face Verification</p>
                  <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                    Camera challenge will verify that a real person is present and compare the selfie against the verified identity document.
                  </p>

                  <button 
                    type="button"
                    onClick={() => showToast('success', 'Liveness Verified', 'Anti-spoofing face match challenge completed.')}
                    className="px-6 py-2.5 rounded-2xl gradient-bg-primary text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                  >
                    Start Liveness Check
                  </button>
                </div>

                {/* 4 Status Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-emerald-400 font-bold block">✓ Random challenge</span>
                    <span className="text-slate-500">Anti-replay</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-emerald-400 font-bold block">✓ Face match</span>
                    <span className="text-slate-500">ID comparison</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-emerald-400 font-bold block">✓ Presentation attack</span>
                    <span className="text-slate-500">Spoof detection</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-emerald-400 font-bold block">✓ Audit record</span>
                    <span className="text-slate-500">Timestamped result</span>
                  </div>
                </div>
              </div>

              {/* Background Verification Consent */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold text-white">Background verification consent</span>
                  <span className="text-[10px] font-mono text-slate-400">Manual review may apply</span>
                </div>
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input 
                    type="checkbox"
                    checked={backgroundConsent}
                    onChange={e => setBackgroundConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-indigo-500"
                  />
                  <span>
                    I authorize Companion Connect, where legally permitted and required for the service, to perform identity/background screening for trust and safety purposes. I understand that additional review may be required.
                  </span>
                </label>
              </div>

            </div>
          )}

          {/* STEP 7: REVIEW & PAYOUT (Submit Application) */}
          {currentStep === 7 && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider uppercase">FINAL REVIEW & PAYOUT</span>
                  <h2 className="text-2xl font-black text-white">Review, Payout & Submit</h2>
                  <p className="text-xs text-slate-400">Bank details are protected and can be completed before the profile becomes bookable.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-[10px] font-mono font-bold border border-slate-800">
                  ADMIN REVIEW
                </span>
              </div>

              {/* 6 Verification Checklist Cards */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Verification checklist</span>
                  <span className="text-[10px] font-mono text-slate-400">Required before submission</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex justify-between items-center">
                    <span className="text-slate-400">Account</span>
                    <strong className="text-emerald-400 font-bold">Email + Mobile ✓</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex justify-between items-center">
                    <span className="text-slate-400">Profile</span>
                    <strong className="text-emerald-400 font-bold">Profile + Services ✓</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex justify-between items-center">
                    <span className="text-slate-400">Safety</span>
                    <strong className="text-emerald-400 font-bold">Boundaries Accepted ✓</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Identity</span>
                    <strong className="text-amber-400 font-bold">Pending</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Emergency</span>
                    <strong className="text-emerald-400 font-bold">Contact Added ✓</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Admin review</span>
                    <strong className="text-indigo-400 font-bold">Pending after submission</strong>
                  </div>
                </div>
              </div>

              {/* Payout Setup */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Payout setup</span>
                  <span className="text-[10px] font-mono text-slate-400">Masked escrow gateway</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Bank Account Holder *</label>
                    <input 
                      type="text" 
                      value={bankAccountHolder}
                      onChange={e => setBankAccountHolder(e.target.value)}
                      placeholder="As per bank account"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Bank / Payout Method *</label>
                    <select 
                      value={payoutMethod}
                      onChange={e => setPayoutMethod(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="Direct Bank Transfer (IMPS/NEFT)">Direct Bank Transfer (IMPS/NEFT)</option>
                      <option value="UPI Instant Transfer">UPI Instant Transfer</option>
                      <option value="Stripe Escrow">Stripe Escrow</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Bank Account Number *</label>
                    <input 
                      type="text" 
                      value={bankAccountNumber}
                      onChange={e => setBankAccountNumber(e.target.value)}
                      placeholder="Enter account number"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">IFSC Code *</label>
                    <input 
                      type="text" 
                      value={ifscCode}
                      onChange={e => setIfscCode(e.target.value)}
                      placeholder="e.g. SBIN0001234"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-500">
                  Account number should be encrypted and displayed masked after verification. Payout activation can remain locked until KYC/admin approval.
                </p>
              </div>

              {/* Review Info Summary */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">Review your information</span>
                  <span className="text-[10px] font-mono text-slate-400">Before submission</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Public profile</span>
                      <strong className="text-white font-bold">{displayName}</strong>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(2)} className="text-[10px] text-indigo-400 font-bold hover:underline">Edit</button>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Services</span>
                      <strong className="text-white font-bold">{selectedServices.slice(0, 3).join(', ')} + more</strong>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(3)} className="text-[10px] text-indigo-400 font-bold hover:underline">Edit</button>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Rates</span>
                      <strong className="text-white font-bold">₹{hourlyRate.toLocaleString()} / hour</strong>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(4)} className="text-[10px] text-indigo-400 font-bold hover:underline">Edit</button>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Operating area</span>
                      <strong className="text-white font-bold">{operatingCity} - {travelRadiusKm} km</strong>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(5)} className="text-[10px] text-indigo-400 font-bold hover:underline">Edit</button>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Identity</span>
                      <strong className="text-amber-400 font-bold">Verification required</strong>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(6)} className="text-[10px] text-indigo-400 font-bold hover:underline">Edit</button>
                  </div>
                </div>
              </div>

              {/* Final Consent Checkbox */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-300">
                  <input 
                    type="checkbox"
                    checked={finalConsent}
                    onChange={e => setFinalConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-emerald-500"
                  />
                  <span>
                    I confirm that the information provided is accurate, I will follow Companion Connect's safety standards, and I understand that the application is subject to verification, manual review, suspension, and appeal procedures.
                  </span>
                </label>
              </div>

            </div>
          )}

          {/* WIZARD CONTROL BUTTONS */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs disabled:opacity-30 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-2xl gradient-bg-primary text-white font-bold text-xs hover:opacity-95 flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitApplication}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-900/30 flex items-center gap-2"
              >
                {isSubmitting ? 'Submitting to Admin Review...' : 'Submit Companion Application ✓'}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
