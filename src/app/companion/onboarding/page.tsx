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
  Edit3,
  X,
  Loader2,
  RefreshCw,
  AlertCircle
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
        setOtpDemoCode(data.data?.demoOtpCode || '');
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
      }
    } catch (err: any) {
      setOtpError(err.message || 'Verification failed.');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-lg shadow-indigo-600/30">
            CC
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-wide">Companion Connect</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Secure Companion Registration</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>ENCRYPTED • VERIFIED ONBOARDING</span>
        </div>
      </div>

      {/* TOP HORIZONTAL TAB VIEW NAVIGATION */}
      <div className="glass-panel bg-white dark:bg-slate-950/60 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
        <div className="flex justify-between items-center text-xs">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Companion Application</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Complete the 7 required verification stages</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-600 dark:text-slate-400">Step {currentStep} of 7</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800">
          <div 
            className="h-full gradient-bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* 7 Horizontal Step Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 overflow-x-auto">
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
                className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 min-w-[130px] ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 hover:border-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-xl flex items-center justify-center text-[11px] font-mono font-bold shrink-0 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : s.id}
                </div>

                <div className="overflow-hidden">
                  <h4 className={`text-[11px] font-bold truncate ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {s.title}
                  </h4>
                  <p className={`text-[9px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>{s.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN STEP CONTENT CARD */}
      <div className="glass-panel bg-white dark:bg-slate-950/60 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
        
        {/* STEP 1: ACCOUNT (Eligibility & OTP) */}
        {currentStep === 1 && (
          <div className="space-y-6">
            
            {/* Header Badge & Title */}
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">REQUIRED PRE-CHECK</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Account & Eligibility</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Create your secure account first. Age is calculated automatically from date of birth.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                18+ ELIGIBILITY
              </span>
            </div>

            {/* Adult-Only Alert */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse shrink-0"></div>
              <p>
                <strong>Adult-only marketplace:</strong> Companion Connect requires all service providers to be at least 18 years old. Your date of birth is used for eligibility verification.
              </p>
            </div>

            {/* Basic Account Info Form */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Basic account information</span>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">Age verification pending</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">First Name *</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="e.g. Aria"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Last Name *</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="e.g. Vance"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Date of Birth *</label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">You must be 18 or older.</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Country *</label>
                  <select 
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
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
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                    {!isEmailVerified && (
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">Not verified</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="email" 
                        value={email}
                        disabled={isEmailVerified}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 disabled:opacity-80 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                      />
                      {isEmailVerified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />
                      )}
                    </div>
                    {isEmailVerified ? (
                      <div className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => handleSendOtp('email')}
                        disabled={isSendingOtp}
                        className="px-3.5 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSendingOtp && otpTarget === 'email' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                        <span>Send OTP</span>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mobile Number *</label>
                    {!isPhoneVerified && (
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">Not verified</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="tel" 
                        value={phone}
                        disabled={isPhoneVerified}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono disabled:opacity-80 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                      />
                      {isPhoneVerified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />
                      )}
                    </div>
                    {isPhoneVerified ? (
                      <div className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => handleSendOtp('phone')}
                        disabled={isSendingOtp}
                        className="px-3.5 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSendingOtp && otpTarget === 'phone' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Phone className="w-3.5 h-3.5" />
                        )}
                        <span>Send OTP</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Password *</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 pr-10"
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Confirm Password *</label>
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

            </div>

            {/* Account Security Toggles */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Account security</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Recommended</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800/80">
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Enable Passkey</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Use your device biometric / PIN for future logins</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={enablePasskey} 
                  onChange={e => setEnablePasskey(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Enable 2FA after approval</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Authenticator app or secure OTP challenge</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={enable2FA} 
                  onChange={e => setEnable2FA(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Checkbox confirmation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input 
                  type="checkbox" 
                  checked={agreeAccountCheck}
                  onChange={e => setAgreeAccountCheck(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500"
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
            
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">PUBLIC PROFILE SETUP</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Profile & Services</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Build the profile customers will see. Private identity information remains restricted.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                PUBLIC PROFILE
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Profile Information</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Private legal name is never shown publicly</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Public Display Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="e.g. Aria Vance"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Shown to clients</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Legal Full Name</label>
                  <input 
                    type="text" 
                    value={legalName}
                    onChange={e => setLegalName(e.target.value)}
                    placeholder="As per government ID"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Private - KYC only</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Gender Identity</label>
                  <select 
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Languages Spoken</label>
                  <input 
                    type="text" 
                    value={languages}
                    onChange={e => setLanguages(e.target.value)}
                    placeholder="English, Hindi, French"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Photo Upload Box & Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2 flex flex-col items-center justify-center">
                  <UploadCloud className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Upload Profile Photo</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Clear, recent face photo • JPG/PNG • max 5 MB</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Professional Bio</label>
                  <textarea 
                    rows={4}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Describe your experience, personality, and the legal services you provide."
                    className="w-full p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  ></textarea>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block text-right">{bio.length}/500 characters • Minimum 30 characters</span>
                </div>
              </div>

            </div>

            {/* Categories Selector */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Companion categories</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Select up to 5</span>
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
                          : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {cat} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Skills & expertise</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Used for matching</span>
              </div>
              <input 
                type="text" 
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="Event coordination, public speaking, city guide, translation..."
                className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

          </div>
        )}

        {/* STEP 3: SAFETY (Boundaries) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">SERVICE BOUNDARIES</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Services & Safety</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Clear service boundaries protect companions, clients, and the platform.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold border border-emerald-200 dark:border-emerald-500/30">
                SAFETY FIRST
              </span>
            </div>

            {/* Services Offered */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Services you offer</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Select all that apply</span>
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
                          : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {service} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service Description & Policy Scanner */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Service description</span>
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">Moderation scan enabled</span>
              </div>

              <textarea 
                rows={3}
                value={serviceDescription}
                onChange={e => handleScanServiceText(e.target.value)}
                placeholder="Describe exactly what customers can book you for. Do not include prohibited or sexual services."
                className="w-full p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              ></textarea>

              {policyScanResult && (
                <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                  policyScanResult.allowed 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300' 
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/30 text-rose-900 dark:text-rose-300'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {policyScanResult.allowed ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                    {policyScanResult.allowed ? 'Service Policy Scan Passed!' : 'Prohibited Term Detected'}
                  </div>
                  <p className="text-[11px] opacity-80">{policyScanResult.summary || 'Complies with legal companionship policies.'}</p>
                </div>
              )}
            </div>

            {/* Mandatory Companion Safety Standards */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Mandatory Companion Safety Standards</span>
                <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">Required</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <input type="checkbox" checked={safetyCheckboxes.nonSexual} readOnly className="mt-0.5 w-4 h-4 accent-indigo-600" />
                  <span><strong>Non-sexual services only:</strong> Companion services are strictly non-sexual. Off-platform solicitation or prohibited services can result in permanent termination.</span>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <input type="checkbox" checked={safetyCheckboxes.verifiedBooking} readOnly className="mt-0.5 w-4 h-4 accent-indigo-600" />
                  <span><strong>Verified booking requirement:</strong> All engagements must be created and paid through the platform.</span>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <input type="checkbox" checked={safetyCheckboxes.safeMeeting} readOnly className="mt-0.5 w-4 h-4 accent-indigo-600" />
                  <span><strong>Safe meeting requirement:</strong> Follow platform rules for verified public venues and approved booking locations.</span>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <input type="checkbox" checked={safetyCheckboxes.prohibitedActivity} readOnly className="mt-0.5 w-4 h-4 accent-indigo-600" />
                  <span><strong>Prohibited activity:</strong> No illegal substances, weapons, exploitation, harassment, or unsafe activities.</span>
                </div>
              </div>
            </div>

            {/* Booking Restrictions */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Your booking restrictions</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Optional but recommended</span>
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
                          ? 'bg-slate-100 dark:bg-slate-900 border-indigo-500 text-indigo-700 dark:text-indigo-400 shadow-sm'
                          : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
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
            
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">DYNAMIC EARNINGS</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Rates & Availability</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Set your base pricing and availability. Platform fees are calculated automatically.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                EARNINGS
              </span>
            </div>

            {/* Pricing Cards */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Your rates</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Customer pricing preview</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Hourly Rate (₹)</label>
                  <input 
                    type="number" 
                    value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Half-Day Rate (₹)</label>
                  <input 
                    type="number" 
                    value={halfDayRate}
                    onChange={e => setHalfDayRate(Number(e.target.value))}
                    placeholder="e.g. 5000"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full-Day Rate (₹)</label>
                  <input 
                    type="number" 
                    value={fullDayRate}
                    onChange={e => setFullDayRate(Number(e.target.value))}
                    placeholder="e.g. 8000"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Calculation Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Customer pays / hour</span>
                  <strong className="text-sm font-mono text-slate-900 dark:text-white">₹{Math.round(hourlyRate * 1.15).toLocaleString()}</strong>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Estimated platform fee</span>
                  <strong className="text-sm font-mono text-indigo-600 dark:text-indigo-400">15%</strong>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Estimated payout / hour</span>
                  <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400">₹{Math.round(hourlyRate * 0.85).toLocaleString()}</strong>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Escrow protection</span>
                  <strong className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">Enabled ✓</strong>
                </div>
              </div>
            </div>

            {/* Working Days */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Working days</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{workingDays.length}/7 selected</span>
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
                          : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-400'
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
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">Preferred working hours</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Matching preference</span>
                </div>
                <select 
                  value={workingHours}
                  onChange={e => setWorkingHours(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Afternoon & Evening (12 PM – 10 PM)">Afternoon & Evening (12 PM – 10 PM)</option>
                  <option value="Morning (8 AM – 1 PM)">Morning (8 AM – 1 PM)</option>
                  <option value="Full Day Flexible">Full Day Flexible</option>
                </select>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">Minimum advance notice</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Booking protection</span>
                </div>
                <select 
                  value={advanceNotice}
                  onChange={e => setAdvanceNotice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="6 Hours">6 Hours</option>
                  <option value="12 Hours">12 Hours</option>
                  <option value="24 Hours">24 Hours</option>
                </select>
              </div>
            </div>

            {/* Cancellation Preference */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Cancellation preference</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Customer refund policy</span>
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
                          : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
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
            
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">LOCATION & EMERGENCY SAFETY</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Operating Area & Emergency Contact</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Only collect the location information needed for matching and safety.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold border border-emerald-200 dark:border-emerald-500/30">
                SAFETY SETUP
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Operating Area */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                  <span className="font-bold text-slate-900 dark:text-white">Operating area</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">No exact home address required</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Base Operating City *</label>
                  <select 
                    value={operatingCity}
                    onChange={e => setOperatingCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
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
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Maximum Travel Radius</label>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{travelRadiusKm} km</span>
                  </div>
                  <input 
                    type="range" 
                    min={5} 
                    max={100} 
                    value={travelRadiusKm}
                    onChange={e => setTravelRadiusKm(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                    <span>5 km</span>
                    <span>25 km</span>
                    <span>50 km</span>
                    <span>100 km</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Travel Allowance Beyond 10 km (₹)</label>
                  <input 
                    type="number" 
                    value={travelAllowancePerKm}
                    onChange={e => setTravelAllowancePerKm(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Per additional kilometer</span>
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
                            : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Emergency Contact */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                  <span className="font-bold text-slate-900 dark:text-white">Emergency contact</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Trusted safety contact</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <p> Emergency contacts may receive safety alerts during an active booking when permitted by your consent and platform policy.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    placeholder="Trusted person"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Relationship *</label>
                  <select 
                    value={emergencyRelationship}
                    onChange={e => setEmergencyRelationship(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mobile Number *</label>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Not verified</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="tel" 
                      value={emergencyPhone}
                      onChange={e => setEmergencyPhone(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none font-mono"
                    />
                    <button 
                      type="button"
                      onClick={() => showToast('info', 'OTP Sent', 'Safety contact OTP sent.')}
                      className="px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300 pt-1">
                  <input 
                    type="checkbox" 
                    checked={emergencyConsent}
                    onChange={e => setEmergencyConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-indigo-600"
                  />
                  <span>I consent to emergency safety alerts being sent to this contact during qualifying incidents.</span>
                </label>
              </div>

            </div>

            {/* Bottom Safety Disclaimer */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-900 dark:text-rose-300">
              <p>
                For safety, the platform should use approximate operating areas for discovery and reveal precise booking details only when required by the active booking and safety policy.
              </p>
            </div>

          </div>
        )}

        {/* STEP 6: IDENTITY (KYC & Liveness) */}
        {currentStep === 6 && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">SECURE IDENTITY VERIFICATION</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Government ID & Biometric Verification</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Identity verification is mandatory before the companion profile can become bookable.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                KYC SECURITY
              </span>
            </div>

            {/* Document Vault */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Government Identity document</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Encrypted document vault</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Government ID Type *</label>
                  <select 
                    value={idType}
                    onChange={e => setIdType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Document Number *</label>
                  <input 
                    type="text" 
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    placeholder="Enter document number"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Box Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2 flex flex-col items-center justify-center">
                  <UploadCloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Upload ID Front</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">JPG, PNG or PDF • encrypted on upload</p>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2 flex flex-col items-center justify-center">
                  <UploadCloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Upload ID Back</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Required where applicable</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                Sensitive document numbers should be encrypted at rest and displayed masked. Store only the minimum data required for verification and audit purpose.
              </p>
            </div>

            {/* Selfie & Liveness Check */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Selfie & liveness</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Anti-spoofing verification</span>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Verification Ready</h4>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Live Face Verification</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 max-w-md mx-auto">
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
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold block">✓ Random challenge</span>
                  <span className="text-slate-500 dark:text-slate-400">Anti-replay</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold block">✓ Face match</span>
                  <span className="text-slate-500 dark:text-slate-400">ID comparison</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold block">✓ Presentation attack</span>
                  <span className="text-slate-500 dark:text-slate-400">Spoof detection</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold block">✓ Audit record</span>
                  <span className="text-slate-500 dark:text-slate-400">Timestamped result</span>
                </div>
              </div>
            </div>

            {/* Background Verification Consent */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-slate-900 dark:text-white">Background verification consent</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Manual review may apply</span>
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input 
                  type="checkbox"
                  checked={backgroundConsent}
                  onChange={e => setBackgroundConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-indigo-600"
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
            
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">FINAL REVIEW & PAYOUT</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Review, Payout & Submit</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Bank details are protected and can be completed before the profile becomes bookable.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold border border-slate-200 dark:border-slate-800">
                ADMIN REVIEW
              </span>
            </div>

            {/* 6 Verification Checklist Cards */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Verification checklist</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Required before submission</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/30 flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Account</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Email + Mobile ✓</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/30 flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Profile</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Profile + Services ✓</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/30 flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Safety</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Boundaries Accepted ✓</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Identity</span>
                  <strong className="text-amber-600 dark:text-amber-400 font-bold">Pending</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Emergency</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Contact Added ✓</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Admin review</span>
                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold">Pending after submission</strong>
                </div>
              </div>
            </div>

            {/* Payout Setup */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Payout setup</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Masked escrow gateway</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Bank Account Holder *</label>
                  <input 
                    type="text" 
                    value={bankAccountHolder}
                    onChange={e => setBankAccountHolder(e.target.value)}
                    placeholder="As per bank account"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Bank / Payout Method *</label>
                  <select 
                    value={payoutMethod}
                    onChange={e => setPayoutMethod(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Direct Bank Transfer (IMPS/NEFT)">Direct Bank Transfer (IMPS/NEFT)</option>
                    <option value="UPI Instant Transfer">UPI Instant Transfer</option>
                    <option value="Stripe Escrow">Stripe Escrow</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Bank Account Number *</label>
                  <input 
                    type="text" 
                    value={bankAccountNumber}
                    onChange={e => setBankAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">IFSC Code *</label>
                  <input 
                    type="text" 
                    value={ifscCode}
                    onChange={e => setIfscCode(e.target.value)}
                    placeholder="e.g. SBIN0001234"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Account number should be encrypted and displayed masked after verification. Payout activation can remain locked until KYC/admin approval.
              </p>
            </div>

            {/* Review Info Summary */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Review your information</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Before submission</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Public profile</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{displayName}</strong>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(2)} className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Edit</button>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Services</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{selectedServices.slice(0, 3).join(', ')} + more</strong>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(3)} className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Edit</button>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Rates</span>
                    <strong className="text-slate-900 dark:text-white font-bold">₹{hourlyRate.toLocaleString()} / hour</strong>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(4)} className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Edit</button>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Operating area</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{operatingCity} - {travelRadiusKm} km</strong>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(5)} className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Edit</button>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Identity</span>
                    <strong className="text-amber-600 dark:text-amber-400 font-bold">Verification required</strong>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(6)} className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Edit</button>
                </div>
              </div>
            </div>

            {/* Final Consent Checkbox */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input 
                  type="checkbox"
                  checked={finalConsent}
                  onChange={e => setFinalConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-600"
                />
                <span>
                  I confirm that the information provided is accurate, I will follow Companion Connect's safety standards, and I understand that the application is subject to verification, manual review, suspension, and appeal procedures.
                </span>
              </label>
            </div>

          </div>
        )}

        {/* WIZARD CONTROL BUTTONS */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs disabled:opacity-30 flex items-center gap-1.5"
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

      {/* OTP VERIFICATION MODAL POPUP */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white space-y-5 shadow-2xl animate-in fade-in zoom-in-95 relative">
            
            {/* Close Button */}
            <button 
              type="button" 
              onClick={() => setIsOtpModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
                {otpTarget === 'email' ? <Mail className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
              </div>
              <h3 className="text-lg font-black tracking-wide">
                Verify {otpTarget === 'email' ? 'Email Address' : 'Mobile Number'}
              </h3>
              <p className="text-xs text-slate-400">
                We sent a 6-digit OTP code to <strong className="text-indigo-300 font-mono">{otpTargetValue}</strong>
              </p>
            </div>

            {/* 10-Minute Countdown Clock Banner */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
              otpTimerSeconds > 0
                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
                : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${otpTimerSeconds > 0 ? 'text-indigo-400 animate-pulse' : 'text-rose-400'}`} />
                <span className="font-semibold">
                  {otpTimerSeconds > 0 ? 'OTP Expire Timer:' : 'Status:'}
                </span>
              </div>
              <span className="font-mono font-black text-sm">
                {otpTimerSeconds > 0 ? (
                  `${String(Math.floor(otpTimerSeconds / 60)).padStart(2, '0')}:${String(otpTimerSeconds % 60).padStart(2, '0')}`
                ) : (
                  'EXPIRED'
                )}
              </span>
            </div>

            {/* Expired Warning */}
            {otpTimerSeconds === 0 && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>OTP code has expired after 10 minutes. Please click Resend OTP to request a new code.</span>
              </div>
            )}

            {/* OTP 6-Digit PIN Inputs */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex justify-center gap-2 py-1">
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
                    className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition-all"
                  />
                ))}
              </div>

              {/* Demo OTP Helper Tag */}
              {otpDemoCode && (
                <div 
                  onClick={() => {
                    const digits = otpDemoCode.split('');
                    setOtpCodeDigits(digits);
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between cursor-pointer hover:border-indigo-500/50 transition-all"
                  title="Click to auto-fill demo OTP code"
                >
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo OTP Code:
                  </span>
                  <span className="font-mono font-bold text-amber-400 tracking-widest">{otpDemoCode}</span>
                </div>
              )}

              {/* Error Message */}
              {otpError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* Submit & Resend Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isVerifyingOtp || otpTimerSeconds === 0 || otpCodeDigits.join('').length !== 6}
                  className="w-full py-3 rounded-xl gradient-bg-primary text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying OTP...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Verify OTP & Confirm
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSendOtp(otpTarget)}
                  disabled={otpResendCooldown > 0 || isSendingOtp}
                  className="w-full py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                  {otpResendCooldown > 0
                    ? `Resend OTP in ${otpResendCooldown}s`
                    : 'Didn\'t get OTP? Resend OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
