'use client';

import React, { useState, useMemo } from 'react';
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
  Edit3,
  X,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ServicePolicyEngine } from '@/lib/servicePolicyEngine';
import { ServiceCategory } from '@/lib/types';

export default function CompanionOnboardingWizard() {
  const router = useRouter();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Dynamic DB Categories State
  const [dbCategories, setDbCategories] = useState<ServiceCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  // Fetch Categories & Subcategories from Database API
  React.useEffect(() => {
    async function fetchDbCategories() {
      try {
        setIsLoadingCategories(true);
        const res = await fetch('/api/categories?active=true');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setDbCategories(json.data);
        } else {
          setDbCategories([]);
        }
      } catch (err) {
        console.error('Failed to fetch DB categories:', err);
        setDbCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchDbCategories();
  }, []);

  // Step 1: Account & Eligibility State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('India');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enablePasskey, setEnablePasskey] = useState(true);
  const [enable2FA, setEnable2FA] = useState(true);
  const [agreeAccountCheck, setAgreeAccountCheck] = useState(false);

  // OTP Verification States
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpTarget, setOtpTarget] = useState<'email' | 'phone'>('email');
  const [otpTargetValue, setOtpTargetValue] = useState('');
  const [otpCodeDigits, setOtpCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpDemoCode, setOtpDemoCode] = useState('');
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(600); // 10 minutes
  const [otpResendCooldown, setOtpResendCooldown] = useState(60); // 60 seconds
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  // 10-Minute Timer Countdown Effect
  React.useEffect(() => {
    let timer: any = null;
    if (isOtpModalOpen && otpTimerSeconds > 0) {
      timer = setInterval(() => {
        setOtpTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
        setOtpResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOtpModalOpen, otpTimerSeconds]);

  // Send OTP Handler
  const handleSendOtp = async (target: 'email' | 'phone') => {
    const value = target === 'email' ? email : phone;
    if (!value || !value.trim()) {
      showToast('error', 'Required Field', `Please enter your ${target === 'email' ? 'email address' : 'mobile number'} first.`);
      return;
    }
    if (target === 'email' && !/\S+@\S+\.\S+/.test(email)) {
      showToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (target === 'phone' && phone.length < 10) {
      showToast('error', 'Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSendingOtp(true);
    setOtpError('');
    try {
      const res = await fetch('/api/mobile/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          identifier: value.trim().toLowerCase(),
          purpose: target === 'email' ? 'COMPANION_EMAIL_VERIFICATION' : 'COMPANION_PHONE_VERIFICATION',
          name: `${firstName} ${lastName}`.trim() || 'Companion Candidate',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpTarget(target);
        setOtpTargetValue(value.trim());
        const isSmtpLive = data.data?.isSmtpConfigured;
        setOtpDemoCode(target === 'phone' || !isSmtpLive ? (data.data?.demoOtpCode || '') : '');
        setOtpCodeDigits(['', '', '', '', '', '']);
        setOtpTimerSeconds(600); // 10 minutes
        setOtpResendCooldown(60);
        setIsOtpModalOpen(true);
        showToast('success', 'OTP Sent Successfully!', data.message || `Verification OTP sent to ${value}. Valid for 10 minutes.`);
      } else {
        showToast('error', 'Failed to Send OTP', data.error || 'Could not send verification OTP.');
      }
    } catch (err: any) {
      showToast('error', 'Network Error', err.message || 'Failed to connect to server.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const clearOtpInputs = () => {
    setOtpCodeDigits(['', '', '', '', '', '']);
    setTimeout(() => {
      for (let i = 0; i < 6; i++) {
        const inputEl = document.getElementById(`otp-input-${i}`) as HTMLInputElement;
        if (inputEl) inputEl.value = '';
      }
      const firstInput = document.getElementById('otp-input-0');
      if (firstInput) firstInput.focus();
    }, 20);
  };

  // Verify OTP Handler
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = otpCodeDigits.join('').trim();
    if (fullCode.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP code.');
      return;
    }
    if (otpTimerSeconds === 0) {
      setOtpError('OTP has expired after 10 minutes. Please click Resend OTP to request a new code.');
      clearOtpInputs();
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await fetch('/api/mobile/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          identifier: otpTargetValue.toLowerCase(),
          purpose: otpTarget === 'email' ? 'COMPANION_EMAIL_VERIFICATION' : 'COMPANION_PHONE_VERIFICATION',
          code: fullCode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (otpTarget === 'email') {
          setIsEmailVerified(true);
        } else {
          setIsPhoneVerified(true);
        }
        setIsOtpModalOpen(false);
        showToast('success', 'Verified Successfully! ✓', `${otpTarget === 'email' ? 'Email address' : 'Mobile number'} has been verified.`);
      } else {
        setOtpError(data.error || 'Invalid OTP code.');
        clearOtpInputs();
      }
    } catch (err: any) {
      setOtpError(err.message || 'Verification failed.');
      clearOtpInputs();
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...otpCodeDigits];
      newDigits[index] = '';
      setOtpCodeDigits(newDigits);
      return;
    }
    if (cleanVal.length === 6) {
      const pasted = cleanVal.split('');
      setOtpCodeDigits(pasted);
      const nextInput = document.getElementById('otp-input-5');
      if (nextInput) nextInput.focus();
      return;
    }
    const newDigits = [...otpCodeDigits];
    newDigits[index] = cleanVal[cleanVal.length - 1];
    setOtpCodeDigits(newDigits);

    if (index < 5 && cleanVal) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCodeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Step 2: Profile & Services State
  const [displayName, setDisplayName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [gender, setGender] = useState('Female');
  const [languages, setLanguages] = useState('English, Hindi, French');
  const [bio, setBio] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [skills, setSkills] = useState('');

  // Step 3: Safety & Boundaries State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
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

  // DYNAMIC COMPUTATIONS FOR SERVICES & SAFETY POLICIES
  const availableServices = useMemo(() => {
    if (!dbCategories || dbCategories.length === 0) {
      return [
        { name: 'Event Companion', categoryName: 'Events' },
        { name: 'Fine Dining Companion', categoryName: 'Dining' },
        { name: 'Sightseeing & City Guide', categoryName: 'Travel' },
        { name: 'Business Gala Escort', categoryName: 'Events' },
        { name: 'Museum & Art Partner', categoryName: 'Culture' },
        { name: 'Virtual Study Focus', categoryName: 'Study' }
      ];
    }

    // Filter categories that match user's selectedCategories, or use all if none selected
    const activeCats = selectedCategories.length > 0
      ? dbCategories.filter(c => selectedCategories.includes(c.name))
      : dbCategories;

    const subList: { name: string; categoryName: string }[] = [];
    activeCats.forEach(cat => {
      if (cat.subcategories && Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          if (sub.name && !subList.some(s => s.name === sub.name)) {
            subList.push({ name: sub.name, categoryName: cat.name });
          }
        });
      }
    });

    // Fallback if DB category has no subcategories
    if (subList.length === 0) {
      return activeCats.map(c => ({ name: c.name, categoryName: c.name }));
    }

    return subList;
  }, [dbCategories, selectedCategories]);

  // Compute Dynamic Safety Commitments from Database Safety Policies
  const dynamicSafetyCommitments = useMemo(() => {
    const baseCommitments = [
      { title: 'Strictly Non-Sexual', desc: 'Legal companionship only. Zero tolerance for adult content.' },
      { title: 'Platform Escrow Booking', desc: 'All payments created & held securely through Sathi app.' }
    ];

    if (!dbCategories || selectedCategories.length === 0) return baseCommitments;

    const selectedCatObjs = dbCategories.filter(c => selectedCategories.includes(c.name));
    const categoryPolicies: { title: string; desc: string }[] = [];

    selectedCatObjs.forEach(cat => {
      if (cat.safetyPolicy) {
        categoryPolicies.push({
          title: `${cat.name} Safety Standard`,
          desc: cat.safetyPolicy
        });
      }
    });

    return categoryPolicies.length > 0 ? [...baseCommitments, ...categoryPolicies] : baseCommitments;
  }, [dbCategories, selectedCategories]);

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
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
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
    { id: 4, title: 'Rates & Schedule', subtitle: 'Pricing & hours' },
    { id: 5, title: 'Location', subtitle: 'Travel & emergency' },
    { id: 6, title: 'Identity', subtitle: 'KYC & liveness' },
    { id: 7, title: 'Review & Payout', subtitle: 'Submit application' },
  ];

  const progressPercentage = Math.round((currentStep / 7) * 100);

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-2 lg:py-3 space-y-2 lg:space-y-3">
      
      {/* Compact Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs lg:text-sm shadow-md shadow-indigo-600/30">
            CC
          </div>
          <div>
            <h1 className="text-xs lg:text-sm font-black text-slate-900 dark:text-white tracking-wide leading-tight">Companion Connect</h1>
            <p className="text-[9px] lg:text-[10px] text-slate-500 dark:text-slate-400 font-mono">Secure Onboarding Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[9px] lg:text-[10px] font-mono font-bold">
          <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>ENCRYPTED ONBOARDING</span>
        </div>
      </div>

      {/* Ultra-Compact Horizontal 7-Step Navigation */}
      <div className="glass-panel bg-white dark:bg-slate-950/70 p-2 lg:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-md">
        <div className="flex justify-between items-center text-[10px] lg:text-xs">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] lg:text-xs">Companion Registration</h3>
            <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">• Stage {currentStep} of 7</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] lg:text-xs">
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
              {progressPercentage}% Completed
            </span>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200/60 dark:border-slate-800">
          <div 
            className="h-full gradient-bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* 7 Compact Step Buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 lg:gap-1.5 pt-0.5">
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
                className={`p-1 lg:p-1.5 rounded-xl border text-left transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:border-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 lg:w-5 lg:h-5 rounded-lg flex items-center justify-center text-[9px] lg:text-[10px] font-mono font-bold shrink-0 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : s.id}
                </div>

                <div className="overflow-hidden min-w-0">
                  <h4 className={`text-[9px] lg:text-[10px] font-bold truncate leading-tight ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {s.title}
                  </h4>
                  <p className={`text-[8px] truncate leading-tight hidden lg:block ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>{s.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN STEP CONTENT CARD */}
      <div className="glass-panel bg-white dark:bg-slate-950/70 p-3 sm:p-4 lg:p-5 rounded-2xl lg:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2.5 lg:space-y-3">
        
        {/* STEP 1: ACCOUNT & ELIGIBILITY */}
        {currentStep === 1 && (
          <div className="space-y-2.5 lg:space-y-3">
            
            {/* Header Badge */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">STAGE 1 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Account & Eligibility Pre-Check</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[9px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                18+ MANDATORY
              </span>
            </div>

            {/* Adult-Only Compact Alert */}
            <div className="py-1.5 px-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse shrink-0"></div>
              <p className="truncate">
                <strong>Adult-Only Marketplace:</strong> Companion Connect requires service providers to be 18+ years old.
              </p>
            </div>

            {/* Account Form Fields in Compact Grid */}
            <div className="p-3 lg:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              
              {/* Personal Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">First Name *</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="e.g. Aria"
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Last Name *</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="e.g. Vance"
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Date of Birth *</label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Country *</label>
                  <select 
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              {/* Address, City, State, Pincode Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Street Address *</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Flat / Building / Street"
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">City *</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">State *</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Pincode *</label>
                  <input 
                    type="text" 
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="e.g. 400001"
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Email & Phone OTP Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                    <span className="text-[9px] font-mono text-amber-600 font-bold">{isEmailVerified ? '✓ Verified' : 'Not verified'}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <input 
                      type="email" 
                      value={email}
                      disabled={isEmailVerified}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 disabled:opacity-80"
                    />
                    {!isEmailVerified && (
                      <button 
                        type="button" 
                        onClick={() => handleSendOtp('email')}
                        disabled={isSendingOtp}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-[11px] font-bold shrink-0 flex items-center gap-1 hover:bg-indigo-500"
                      >
                        {isSendingOtp && otpTarget === 'email' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                        <span>Send OTP</span>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Number *</label>
                    <span className="text-[9px] font-mono text-amber-600 font-bold">{isPhoneVerified ? '✓ Verified' : 'Not verified'}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <input 
                      type="tel" 
                      value={phone}
                      disabled={isPhoneVerified}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="+91 9876543210"
                      className="flex-1 px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 disabled:opacity-80"
                    />
                    {!isPhoneVerified && (
                      <button 
                        type="button"
                        onClick={() => handleSendOtp('phone')}
                        disabled={isSendingOtp}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-[11px] font-bold shrink-0 flex items-center gap-1 hover:bg-indigo-500"
                      >
                        {isSendingOtp && otpTarget === 'phone' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Phone className="w-3 h-3" />}
                        <span>Send OTP</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Password *</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Create strong password"
                      className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 pr-8"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Confirm Password *</label>
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

            </div>

            {/* Account Security Toggles with iOS-Style Toggle Switches */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-[11px] lg:text-xs font-bold text-slate-800 dark:text-slate-200">Enable Biometric Passkey</h5>
                  <p className="text-[9px] text-slate-500">Biometric / PIN login</p>
                </div>
                {/* Sleek Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setEnablePasskey(!enablePasskey)}
                  className={`w-10 h-5 lg:w-11 lg:h-6 rounded-full transition-colors relative focus:outline-none p-0.5 shrink-0 ${
                    enablePasskey ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      enablePasskey ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-[11px] lg:text-xs font-bold text-slate-800 dark:text-slate-200">Enable 2-Factor Authentication</h5>
                  <p className="text-[9px] text-slate-500">Authenticator app / OTP</p>
                </div>
                {/* Sleek Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setEnable2FA(!enable2FA)}
                  className={`w-10 h-5 lg:w-11 lg:h-6 rounded-full transition-colors relative focus:outline-none p-0.5 shrink-0 ${
                    enable2FA ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      enable2FA ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Single Line Declaration Checkbox */}
            <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-[10px] lg:text-xs text-slate-700 dark:text-slate-300">
                <input 
                  type="checkbox" 
                  checked={agreeAccountCheck}
                  onChange={e => setAgreeAccountCheck(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I confirm that I am at least 18 years old and agree to the <strong>Terms of Service</strong>, <strong>Privacy Policy</strong>, and Companion safety standards.
                </span>
              </label>
            </div>

          </div>
        )}

        {/* STEP 2: PROFILE & SERVICES */}
        {currentStep === 2 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">STAGE 2 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Public Profile Setup</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[9px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                PUBLIC VIEW
              </span>
            </div>

            <div className="p-3 lg:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3">
                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Public Display Name *</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="e.g. Aria Vance"
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Legal Full Name (Private)</label>
                  <input 
                    type="text" 
                    value={legalName}
                    onChange={e => setLegalName(e.target.value)}
                    placeholder="As per government ID"
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Gender Identity</label>
                  <select 
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </select>
                </div>
              </div>

              {/* Upload Photo & Bio Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-indigo-600 mb-1" />
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">Upload Profile Photo</p>
                  <p className="text-[9px] text-slate-400">JPG/PNG • max 5 MB</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Professional Bio</label>
                  <textarea 
                    rows={2}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Describe your experience, personality, and services..."
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Dynamic DB Categories Pills */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] lg:text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Companion Categories (Max 5)</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                    Live DB
                  </span>
                </span>
                <span className="text-[9px] text-slate-400">{selectedCategories.length}/5 Selected</span>
              </div>

              {isLoadingCategories ? (
                <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold py-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading categories from database...</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {dbCategories.map((catObj) => {
                    const isSelected = selectedCategories.includes(catObj.name);
                    const subCount = catObj.subcategories ? catObj.subcategories.length : 0;
                    return (
                      <button
                        key={catObj.id || catObj.name}
                        type="button"
                        onClick={() => handleCategoryToggle(catObj.name)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] lg:text-xs font-bold transition-all border flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <span>{catObj.name}</span>
                        {subCount > 0 && (
                          <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                            {subCount} services
                          </span>
                        )}
                        {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* STEP 3: SERVICES & SAFETY */}
        {currentStep === 3 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">STAGE 3 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Service Boundaries & Safety Standards</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono font-bold border border-emerald-200 dark:border-emerald-500/30">
                SAFETY FIRST
              </span>
            </div>

            {/* Services Offered - Dynamically Filtered by Selected Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Select Services Offered</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                      {selectedCategories.length > 0 ? `Filtered by ${selectedCategories.length} Categories` : 'All Available Services'}
                    </span>
                  </span>
                  {selectedServices.length > 0 && (
                    <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      {selectedServices.length} Selected
                    </span>
                  )}
                </div>

                {selectedCategories.length > 0 && (
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                    Showing sub-services for: <strong className="text-indigo-600 dark:text-indigo-300">{selectedCategories.join(', ')}</strong>
                  </p>
                )}

                <div className="flex flex-wrap gap-1">
                  {availableServices.map((serviceObj) => {
                    const serviceName = serviceObj.name;
                    const categoryTag = serviceObj.categoryName;
                    const isSelected = selectedServices.includes(serviceName);

                    return (
                      <button
                        key={serviceName}
                        type="button"
                        onClick={() => handleServiceToggle(serviceName)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <span>{serviceName}</span>
                        {categoryTag && selectedCategories.length > 1 && (
                          <span className={`text-[8px] opacity-75 font-mono ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                            ({categoryTag})
                          </span>
                        )}
                        {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Service Description & Moderation Scan</span>
                <textarea 
                  rows={2}
                  value={serviceDescription}
                  onChange={e => handleScanServiceText(e.target.value)}
                  placeholder="Describe exactly what customers can book you for..."
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                ></textarea>
              </div>
            </div>

            {/* Dynamic Safety Commitments from Category DB Policies */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Mandatory Companion Safety Commitments</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                  Dynamic Policies
                </span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                {dynamicSafetyCommitments.map((commit, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="leading-tight">
                      <strong>{commit.title}:</strong> {commit.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* STEP 4: RATES & SCHEDULE */}
        {currentStep === 4 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">STAGE 4 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Rates & Working Availability</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[9px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                EARNINGS
              </span>
            </div>

            {/* Rates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3">
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Hourly Rate (₹)</label>
                <input 
                  type="number" 
                  value={hourlyRate}
                  onChange={e => setHourlyRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Half-Day Rate (₹)</label>
                <input 
                  type="number" 
                  value={halfDayRate}
                  onChange={e => setHalfDayRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Full-Day Rate (₹)</label>
                <input 
                  type="number" 
                  value={fullDayRate}
                  onChange={e => setFullDayRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Working Days Row */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">Working Days</span>
              <div className="grid grid-cols-7 gap-1">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const isSelected = workingDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`py-1 text-[10px] font-bold rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* STEP 5: LOCATION & EMERGENCY */}
        {currentStep === 5 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">STAGE 5 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Operating Area & Emergency Contact</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono font-bold border border-emerald-200 dark:border-emerald-500/30">
                SAFETY SETUP
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Operating Area</span>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Base Operating City *</label>
                  <select 
                    value={operatingCity}
                    onChange={e => setOperatingCity(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Mumbai Metro">Mumbai Metro</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                    <span>Travel Radius</span>
                    <span className="font-mono text-indigo-600 font-bold">{travelRadiusKm} km</span>
                  </div>
                  <input 
                    type="range" 
                    min={5} 
                    max={100} 
                    value={travelRadiusKm}
                    onChange={e => setTravelRadiusKm(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Trusted Emergency Contact</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Contact Name *</label>
                    <input 
                      type="text" 
                      value={emergencyName}
                      onChange={e => setEmergencyName(e.target.value)}
                      placeholder="Trusted person"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Mobile Number *</label>
                    <input 
                      type="tel" 
                      value={emergencyPhone}
                      onChange={e => setEmergencyPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 6: IDENTITY (KYC & Liveness) */}
        {currentStep === 6 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">STAGE 6 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Government ID & Biometric Verification</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[9px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                KYC VERIFIED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">ID Type *</label>
                  <select 
                    value={idType}
                    onChange={e => setIdType(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Document Number *</label>
                  <input 
                    type="text" 
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    placeholder="Enter ID number"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 text-center">
                  <UploadCloud className="w-4 h-4 text-indigo-600 mx-auto mb-0.5" />
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white block">Upload ID Front</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 text-center">
                  <UploadCloud className="w-4 h-4 text-indigo-600 mx-auto mb-0.5" />
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white block">Upload ID Back</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 7: REVIEW & PAYOUT */}
        {currentStep === 7 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">STAGE 7 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Review & Submit Application</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono font-bold border border-emerald-200 dark:border-emerald-500/30">
                FINAL REVIEW
              </span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block">Candidate</span>
                <strong className="text-slate-900 dark:text-white font-bold">{displayName || 'Candidate Name'}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block">Base Rate</span>
                <strong className="text-slate-900 dark:text-white font-bold">₹{hourlyRate}/hr</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block">City</span>
                <strong className="text-slate-900 dark:text-white font-bold">{operatingCity}</strong>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[10px] space-y-1">
              <div className="text-slate-600 dark:text-slate-300">
                Selected Categories: <strong className="text-indigo-600 dark:text-indigo-400">{selectedCategories.join(', ') || 'None selected'}</strong>
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Offered Services: <strong className="text-indigo-600 dark:text-indigo-400">{selectedServices.join(', ') || 'None selected'}</strong>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-[10px] lg:text-xs text-slate-700 dark:text-slate-300">
                <input 
                  type="checkbox"
                  checked={finalConsent}
                  onChange={e => setFinalConsent(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  I confirm that the information provided is accurate and I agree to Companion Connect safety rules.
                </span>
              </label>
            </div>

          </div>
        )}

        {/* WIZARD CONTROL BUTTONS - DIRECTLY ATTACHED INSIDE FORM CARD */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 py-1.5 lg:py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-30 flex items-center gap-1 hover:bg-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-1.5 lg:py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs hover:opacity-95 flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center gap-1.5"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Companion Application ✓'}
            </button>
          )}
        </div>

      </div>

      {/* OTP VERIFICATION MODAL POPUP */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-4 text-white space-y-3 shadow-2xl relative">
            <button 
              type="button" 
              onClick={() => setIsOtpModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-black">Verify {otpTarget === 'email' ? 'Email' : 'Mobile Number'}</h3>
              <p className="text-[11px] text-slate-400">
                OTP sent to <strong className="text-indigo-300 font-mono">{otpTargetValue}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="flex justify-center gap-1.5">
                {otpCodeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    disabled={otpTimerSeconds === 0}
                    className="w-9 h-10 text-center text-base font-bold font-mono rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-indigo-500"
                  />
                ))}
              </div>

              {otpTarget === 'phone' && otpDemoCode && (
                <div 
                  onClick={() => setOtpCodeDigits(otpDemoCode.split(''))}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400 flex justify-between cursor-pointer"
                >
                  <span>Demo OTP:</span>
                  <span className="font-mono font-bold text-amber-400">{otpDemoCode}</span>
                </div>
              )}

              {otpError && (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px]">
                  {otpError}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifyingOtp || otpCodeDigits.join('').length !== 6}
                className="w-full py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold disabled:opacity-50"
              >
                {isVerifyingOtp ? 'Verifying...' : 'Verify OTP & Confirm'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
