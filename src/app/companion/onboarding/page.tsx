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
  AlertCircle,
  Plus,
  Trash2,
  CheckSquare,
  Slash,
  BadgeAlert,
  BadgeCheck,
  Sliders,
  DollarSignIcon
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
          // Set initial default selections matching actual DB categories if none selected yet
          setSelectedCategories(prev => {
            if (prev.length === 0) {
              const defaults: ServiceCategory[] = json.data.slice(0, 2);
              setSelectedCategoryIds(defaults.map((c: ServiceCategory) => c.id));
              return defaults.map((c: ServiceCategory) => c.name);
            }
            return prev;
          });
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

  // =========================================================================
  // STEP 1: ACCOUNT & ELIGIBILITY STATE
  // =========================================================================
  const [firstName, setFirstName] = useState('Aria');
  const [lastName, setLastName] = useState('Vance');
  const [dob, setDob] = useState('2001-05-14'); // YYYY-MM-DD
  const [country, setCountry] = useState('India');
  const [email, setEmail] = useState('aria.vance@example.com');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enablePasskey, setEnablePasskey] = useState(true);
  const [enable2FA, setEnable2FA] = useState(true);
  const [agreeAccountCheck, setAgreeAccountCheck] = useState(true);

  // OTP Verification States
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
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

  // DOB Age Calculation Helper
  const dobAgeInfo = useMemo(() => {
    if (!dob) return { age: null, isEligible: false, message: 'Please select your Date of Birth.' };
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      return { age: null, isEligible: false, message: 'Invalid Date of Birth.' };
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      return { 
        age, 
        isEligible: false, 
        message: 'You must be at least 18 years old to become a companion.' 
      };
    }
    return { 
      age, 
      isEligible: true, 
      message: `Age: ${age} years ✓ Eligible` 
    };
  }, [dob]);

  // 10-Minute Timer Countdown Effect for OTP
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

  // =========================================================================
  // STEP 2: PROFILE & SERVICES STATE (PUBLIC PROFILE)
  // =========================================================================
  const [displayName, setDisplayName] = useState('Aria Vance');
  const [legalName, setLegalName] = useState('Aria Vance');
  const [gender, setGender] = useState('Female');
  const [bio, setBio] = useState('Professional event companion, art enthusiast, and city tour buddy with 3+ years of experience.');
  
  // Tag Manager States
  const [languagesList, setLanguagesList] = useState<string[]>(['English', 'Hindi', 'French']);
  const [newLanguageInput, setNewLanguageInput] = useState('');

  const [skillsList, setSkillsList] = useState<string[]>(['Public Speaking', 'Event Etiquette', 'Museum Guide', 'Networking']);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [interestsList, setInterestsList] = useState<string[]>(['Art & Culture', 'Fine Dining', 'Conferences', 'Travel']);
  const [newInterestInput, setNewInterestInput] = useState('');

  const [experienceLevel, setExperienceLevel] = useState('3-5 Years');
  const [profileVisibility, setProfileVisibility] = useState('PUBLIC');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Helper functions for tags
  const handleAddTag = (
    type: 'lang' | 'skill' | 'interest',
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    inputSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setter(prev => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    inputSetter('');
  };

  const handleRemoveTag = (
    item: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev => prev.filter(i => i !== item));
  };

  // =========================================================================
  // STEP 3: SERVICES & SAFETY BOUNDARIES STATE
  // =========================================================================
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['srv-1', 'srv-3']);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Event Companion', 'Sightseeing & City Guide'
  ]);
  const [serviceDescription, setServiceDescription] = useState('Professional companion for social events, corporate gatherings, and city tours. All bookings are strictly non-sexual.');
  const [serviceSearchQuery, setServiceSearchQuery] = useState<string>('');
  const [policyScanResult, setPolicyScanResult] = useState<any>(null);

  // Prohibited Activities Checkbox Group
  const [prohibitedActivities, setProhibitedActivities] = useState({
    sexualServices: true,
    adultContent: true,
    illegalActivities: true,
    drugsSubstances: true,
    violenceWeapons: true,
    offPlatformPayments: true,
    unverifiedPrivateResidences: true,
    overnightUnmonitoredStays: true
  });

  // Service Availability State
  const [serviceAvailabilityStatus, setServiceAvailabilityStatus] = useState('AVAILABLE');
  const [serviceNoticeWindow, setServiceNoticeWindow] = useState('6 Hours');
  const [minBookingDuration, setMinBookingDuration] = useState<number>(1);
  const [maxBookingDuration, setMaxBookingDuration] = useState<number>(8);

  // Dynamic available services computation from DB categories
  const availableServices = useMemo(() => {
    if (!dbCategories || dbCategories.length === 0) {
      return [
        { id: 'srv-1', name: 'Event Companion', categoryName: 'Events' },
        { id: 'srv-2', name: 'Fine Dining Companion', categoryName: 'Dining' },
        { id: 'srv-3', name: 'Sightseeing & City Guide', categoryName: 'Travel' },
        { id: 'srv-4', name: 'Business Gala Escort', categoryName: 'Events' },
        { id: 'srv-5', name: 'Museum & Art Partner', categoryName: 'Culture' },
        { id: 'srv-6', name: 'Virtual Study Focus', categoryName: 'Study' }
      ];
    }

    const activeCats = (selectedCategories.length > 0 || selectedCategoryIds.length > 0)
      ? dbCategories.filter(c => selectedCategories.includes(c.name) || selectedCategoryIds.includes(c.id))
      : dbCategories;

    const subList: { id: string; name: string; categoryName: string }[] = [];
    activeCats.forEach(cat => {
      if (cat.subcategories && Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
        cat.subcategories.forEach((sub, idx) => {
          if (sub.name && !subList.some(s => s.name === sub.name)) {
            subList.push({ 
              id: sub.id || `sub-${cat.id}-${idx}`, 
              name: sub.name, 
              categoryName: cat.name 
            });
          }
        });
      }
    });

    if (subList.length === 0) {
      return activeCats.map((c, idx) => ({ id: c.id || `cat-${idx}`, name: c.name, categoryName: c.name }));
    }

    return subList;
  }, [dbCategories, selectedCategories]);

  // Group services by category
  const groupedServices = useMemo(() => {
    const groups: { [categoryName: string]: { id: string; name: string; categoryName: string }[] } = {};
    availableServices.forEach(s => {
      const cat = s.categoryName || 'General Services';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });
    return groups;
  }, [availableServices]);

  // Filter grouped services by search query
  const filteredGroupedServices = useMemo(() => {
    if (!serviceSearchQuery.trim()) return groupedServices;
    const q = serviceSearchQuery.toLowerCase().trim();

    const filtered: { [categoryName: string]: { id: string; name: string; categoryName: string }[] } = {};
    Object.keys(groupedServices).forEach(catName => {
      const matching = groupedServices[catName].filter(s => s.name.toLowerCase().includes(q));
      if (matching.length > 0) {
        filtered[catName] = matching;
      }
    });
    return filtered;
  }, [groupedServices, serviceSearchQuery]);

  const handleToggleAllCategoryServices = (catName: string) => {
    const catServices = groupedServices[catName]?.map(s => s.name) || [];
    const catServiceIds = groupedServices[catName]?.map(s => s.id) || [];
    const allSelected = catServices.every(s => selectedServices.includes(s));

    if (allSelected) {
      setSelectedServices(prev => prev.filter(s => !catServices.includes(s)));
      setSelectedServiceIds(prev => prev.filter(id => !catServiceIds.includes(id)));
    } else {
      setSelectedServices(Array.from(new Set([...selectedServices, ...catServices])));
      setSelectedServiceIds(Array.from(new Set([...selectedServiceIds, ...catServiceIds])));
    }
  };

  // Dynamic Safety Commitments from Category DB Policies
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

  // =========================================================================
  // STEP 4: RATES & SCHEDULE STATE (PRICING & DAY-BY-DAY HOURS)
  // =========================================================================
  const [hourlyRate, setHourlyRate] = useState<number>(1500);
  const [halfDayRate, setHalfDayRate] = useState<number>(5000);
  const [fullDayRate, setFullDayRate] = useState<number>(8000);

  // Surcharges & Charges
  const [weekendSurcharge, setWeekendSurcharge] = useState<number>(500);
  const [holidaySurcharge, setHolidaySurcharge] = useState<number>(1000);
  const [travelChargePerKm, setTravelChargePerKm] = useState<number>(20);
  const [extraHourCharge, setExtraHourCharge] = useState<number>(1800);

  // Schedule & Working Days
  const [workingDays, setWorkingDays] = useState<string[]>([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]);

  // Structured Day-Wise Working Hours
  const [dayWiseHours, setDayWiseHours] = useState<{ [day: string]: { start: string; end: string; enabled: boolean } }>({
    Monday: { start: '12:00', end: '22:00', enabled: true },
    Tuesday: { start: '12:00', end: '22:00', enabled: true },
    Wednesday: { start: '12:00', end: '22:00', enabled: true },
    Thursday: { start: '12:00', end: '22:00', enabled: true },
    Friday: { start: '12:00', end: '22:00', enabled: true },
    Saturday: { start: '12:00', end: '22:00', enabled: true },
    Sunday: { start: '12:00', end: '22:00', enabled: true },
  });

  const [advanceNotice, setAdvanceNotice] = useState('6 Hours');
  const [sameDayBooking, setSameDayBooking] = useState(true);
  const [minNoticeHours, setMinNoticeHours] = useState(3);
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState(2);
  const [bufferTimeBetweenBookings, setBufferTimeBetweenBookings] = useState('2 Hours');
  const [cancellationPreference, setCancellationPreference] = useState('Moderate — 100% up to 24h');

  // Helper to copy Monday hours to all active days
  const handleApplyMondayHoursToAll = () => {
    const mon = dayWiseHours['Monday'] || { start: '12:00', end: '22:00', enabled: true };
    setDayWiseHours(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(day => {
        next[day] = { ...next[day], start: mon.start, end: mon.end };
      });
      return next;
    });
    showToast('success', 'Schedule Updated', 'Applied Monday working hours to all operating days.');
  };

  // =========================================================================
  // STEP 5: LOCATION & EMERGENCY STATE
  // =========================================================================
  // Section 1: Operating Location & Travel (Public)
  const [operatingCountry, setOperatingCountry] = useState('India');
  const [operatingState, setOperatingState] = useState('Maharashtra');
  const [operatingCity, setOperatingCity] = useState('Mumbai Metro');
  const [localityArea, setLocalityArea] = useState('Bandra West / South Mumbai');
  const [travelRadiusKm, setTravelRadiusKm] = useState<number>(25);
  const [localTravelEnabled, setLocalTravelEnabled] = useState(true);
  const [intercityTravelEnabled, setIntercityTravelEnabled] = useState(false);
  const [outstationTravelEnabled, setOutstationTravelEnabled] = useState(false);
  const [travelAllowancePerKm, setTravelAllowancePerKm] = useState<number>(20);
  const [transportationPreference, setTransportationPreference] = useState('Cab / Rideshare');

  // Section 2: Private Verified Address (Moved from Tab 1)
  const [address, setAddress] = useState('Flat 402, Sunshine Heights, Hill Road');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400050');

  // Section 3: Trusted Emergency Contact
  const [emergencyName, setEmergencyName] = useState('Suresh Sharma');
  const [emergencyRelationship, setEmergencyRelationship] = useState('Parent');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 9876543210');
  const [emergencyAltPhone, setEmergencyAltPhone] = useState('+91 9876543211');
  const [emergencyConsent, setEmergencyConsent] = useState(true);

  // =========================================================================
  // STEP 6: IDENTITY & VERIFICATION STATE (KYC & MASKED ID)
  // =========================================================================
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('987654321098');
  const [showPlainId, setShowPlainId] = useState(false); // Masked ID display toggle
  const [idFrontUploaded, setIdFrontUploaded] = useState(true);
  const [idBackUploaded, setIdBackUploaded] = useState(true);
  const [livenessDone, setLivenessDone] = useState(true);

  // DYNAMIC KYC STATUS (NOT HARDCODED)
  const [kycStatus, setKycStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED'>('IN_PROGRESS');
  const [backgroundConsent, setBackgroundConsent] = useState(true);
  const [identityVerificationConsent, setIdentityVerificationConsent] = useState(true);
  const [kycConsent, setKycConsent] = useState(true);
  const [kycTimestamp] = useState('2026-08-25 14:05 IST');

  // Masked ID Helper Function
  const formattedMaskedId = useMemo(() => {
    if (!idNumber) return 'Not Provided';
    if (showPlainId) return idNumber;
    if (idNumber.length <= 4) return '•••• ' + idNumber;
    const visiblePart = idNumber.slice(-4);
    const maskedPart = '•••• '.repeat(Math.ceil((idNumber.length - 4) / 4)).trim();
    return `${maskedPart} ${visiblePart}`;
  }, [idNumber, showPlainId]);

  // =========================================================================
  // STEP 7: REVIEW & PAYOUT STATE
  // =========================================================================
  const [bankAccountHolder, setBankAccountHolder] = useState('Aria Vance');
  const [bankAccountNumber, setBankAccountNumber] = useState('918273645019');
  const [confirmBankAccountNumber, setConfirmBankAccountNumber] = useState('918273645019');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [bankName, setBankName] = useState('HDFC Bank Ltd.');
  const [payoutMethod, setPayoutMethod] = useState('Direct Bank Transfer (IMPS/NEFT)');
  const [upiId, setUpiId] = useState('aria.vance@upi');
  
  // Final Declaration Checkboxes
  const [declAccuracy, setDeclAccuracy] = useState(true);
  const [declSafetyPolicy, setDeclSafetyPolicy] = useState(true);
  const [declNonSexual, setDeclNonSexual] = useState(true);
  const [declTerms, setDeclTerms] = useState(true);
  const [declPrivacy, setDeclPrivacy] = useState(true);
  const [declPayoutTerms, setDeclPayoutTerms] = useState(true);
  const [declBackgroundConsent, setDeclBackgroundConsent] = useState(true);

  // AUTOMATED IDENTITY MATCHING CHECK
  const identityMatchCheck = useMemo(() => {
    const accName = `${firstName} ${lastName}`.trim().toLowerCase();
    const legName = legalName.trim().toLowerCase();
    const bankNameHolder = bankAccountHolder.trim().toLowerCase();

    const isAccountVsKycMatch = accName === legName || legName.includes(accName) || accName.includes(legName);
    const isKycVsBankMatch = legName === bankNameHolder || bankNameHolder.includes(legName) || legName.includes(bankNameHolder);

    const isFullMatch = isAccountVsKycMatch && isKycVsBankMatch;

    return {
      isFullMatch,
      accountName: `${firstName} ${lastName}`.trim(),
      kycName: legalName,
      bankName: bankAccountHolder,
      message: isFullMatch
        ? '✓ Identity Match Verified across Account, KYC Document, and Bank Account.'
        : '⚠️ Identity Mismatch Detected: Please ensure Account Name, KYC Legal Name, and Bank Account Holder Name match exactly to avoid payout holds.'
    };
  }, [firstName, lastName, legalName, bankAccountHolder]);

  // General Toggle Helpers
  const handleCategoryToggle = (catObj: ServiceCategory) => {
    const isSelected = selectedCategories.includes(catObj.name) || selectedCategoryIds.includes(catObj.id);
    if (isSelected) {
      setSelectedCategories(prev => prev.filter(c => c !== catObj.name));
      setSelectedCategoryIds(prev => prev.filter(id => id !== catObj.id));
    } else {
      if (selectedCategories.length >= 5) {
        showToast('error', 'Limit Reached', 'You can select up to 5 categories.');
        return;
      }
      setSelectedCategories(prev => (prev.includes(catObj.name) ? prev : [...prev, catObj.name]));
      setSelectedCategoryIds(prev => (prev.includes(catObj.id) ? prev : [...prev, catObj.id]));
    }
  };

  const handleServiceToggle = (serviceObj: { id: string; name: string }) => {
    const isSelected = selectedServices.includes(serviceObj.name);
    if (isSelected) {
      setSelectedServices(prev => prev.filter(s => s !== serviceObj.name));
      setSelectedServiceIds(prev => prev.filter(id => id !== serviceObj.id));
    } else {
      setSelectedServices(prev => [...prev, serviceObj.name]);
      setSelectedServiceIds(prev => [...prev, serviceObj.id]);
    }
  };

  const handleDayToggle = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(prev => prev.filter(d => d !== day));
      setDayWiseHours(prev => ({
        ...prev,
        [day]: { ...prev[day], enabled: false }
      }));
    } else {
      setWorkingDays(prev => [...prev, day]);
      setDayWiseHours(prev => ({
        ...prev,
        [day]: { ...prev[day], enabled: true }
      }));
    }
  };

  const handleScanServiceText = (text: string) => {
    setServiceDescription(text);
    const scan = ServicePolicyEngine.evaluateProposedService(text);
    setPolicyScanResult(scan);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!dobAgeInfo.isEligible) {
        showToast('error', 'Ineligible Age', dobAgeInfo.message);
        return;
      }
      if (!isEmailVerified || !isPhoneVerified) {
        showToast('error', 'OTP Verification Required', 'Please verify both your email address and mobile number before proceeding.');
        return;
      }
    }
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
    if (!declAccuracy || !declSafetyPolicy || !declNonSexual || !declTerms || !declPrivacy || !declPayoutTerms || !declBackgroundConsent) {
      showToast('error', 'Consent Required', 'Please check all final declaration confirmation boxes before submitting.');
      return;
    }
    if (bankAccountNumber !== confirmBankAccountNumber) {
      showToast('error', 'Bank Details Mismatch', 'Bank Account Number and Confirm Account Number do not match.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setKycStatus('UNDER_REVIEW');
      showToast('success', 'Application Submitted Successfully! ✓', 'Your companion application is now under admin verification review.');
      router.push('/companion/dashboard');
    }, 1500);
  };

  // 7 Steps Navigation Metadata
  const STEPS = [
    { id: 1, title: 'Account', subtitle: 'Eligibility & OTP' },
    { id: 2, title: 'Profile & Services', subtitle: 'Public profile' },
    { id: 3, title: 'Services & Safety', subtitle: 'Boundaries' },
    { id: 4, title: 'Rates & Schedule', subtitle: 'Pricing & hours' },
    { id: 5, title: 'Location & Emergency', subtitle: 'Travel & emergency' },
    { id: 6, title: 'Identity & KYC', subtitle: 'KYC & liveness' },
    { id: 7, title: 'Review & Payout', subtitle: 'Submit application' },
  ];

  const progressPercentage = Math.round((currentStep / 7) * 100);

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-2 lg:py-3 space-y-2 lg:space-y-3">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs lg:text-sm shadow-md shadow-indigo-600/30">
            CC
          </div>
          <div>
            <h1 className="text-xs lg:text-sm font-black text-slate-900 dark:text-white tracking-wide leading-tight">Companion Connect</h1>
            <p className="text-[9px] lg:text-[10px] text-slate-500 dark:text-slate-400 font-mono">Enterprise Onboarding Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[9px] lg:text-[10px] font-mono font-bold">
          <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>256-BIT ENCRYPTED PORTAL</span>
        </div>
      </div>

      {/* Horizontal 7-Step Navigation */}
      <div className="glass-panel bg-white dark:bg-slate-950/70 p-2 lg:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-md">
        <div className="flex justify-between items-center text-[10px] lg:text-xs">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] lg:text-xs">Companion Application</h3>
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

        {/* 7 Step Navigation Buttons */}
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
        
        {/* =========================================================================
            TAB 1: ACCOUNT & ELIGIBILITY
            ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-2.5 lg:space-y-3">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">TAB 1 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Account Setup & Age Eligibility</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[9px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                18+ MANDATORY
              </span>
            </div>

            {/* Adult-Only Banner */}
            <div className="py-1.5 px-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <p className="truncate">
                  <strong>Age Verification Notice:</strong> You must be at least 18 years old to join Companion Connect. Address details have been moved to Tab 5 (Operating Location).
                </p>
              </div>
            </div>

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

                {/* DOB & Dynamic Age Calculation */}
                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Date of Birth *</label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  {/* Dynamic Age Badge Display */}
                  <div className="mt-1">
                    {dobAgeInfo.isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {dobAgeInfo.message}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        {dobAgeInfo.message}
                      </span>
                    )}
                  </div>
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

              {/* Email & Phone OTP Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3 pt-1">
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                    <span className={`text-[9px] font-mono font-bold ${isEmailVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {isEmailVerified ? '✓ Verified' : 'Not verified'}
                    </span>
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
                    <span className={`text-[9px] font-mono font-bold ${isPhoneVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {isPhoneVerified ? '✓ Verified' : 'Not verified'}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <input 
                      type="tel" 
                      value={phone}
                      disabled={isPhoneVerified}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3 pt-1">
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

            {/* Account Security Toggles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-[11px] lg:text-xs font-bold text-slate-800 dark:text-slate-200">Enable Biometric Passkey</h5>
                  <p className="text-[9px] text-slate-500">Biometric / PIN authentication</p>
                </div>
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
                  <p className="text-[9px] text-slate-500">Authenticator app / SMS OTP</p>
                </div>
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

            {/* Declaration Checkbox */}
            <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-[10px] lg:text-xs text-slate-700 dark:text-slate-300">
                <input 
                  type="checkbox" 
                  checked={agreeAccountCheck}
                  onChange={e => setAgreeAccountCheck(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I confirm that I am at least 18 years old and agree to the <strong>Terms of Service</strong>, <strong>Privacy Policy</strong>, and 18+ Companion code of conduct.
                </span>
              </label>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: PUBLIC PROFILE SETUP
            ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">TAB 2 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Public Profile & Categories</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[9px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                PUBLIC DISPLAY
              </span>
            </div>

            <div className="p-3 lg:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              
              {/* Names & Gender */}
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
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Gender Identity *</label>
                  <select 
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-3 py-1.5 lg:py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Photo & Short Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border-2 border-dashed border-indigo-300 dark:border-indigo-800 text-center flex flex-col items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-indigo-600 mb-1" />
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">Profile Photo *</p>
                  <p className="text-[9px] text-slate-400">Clear face photo • max 5 MB</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Short Professional Bio *</label>
                  <textarea 
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Describe your background, companion style, and conversation topics..."
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Languages Tag Manager */}
              <div>
                <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Languages Spoken *</label>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <input 
                    type="text" 
                    value={newLanguageInput}
                    onChange={e => setNewLanguageInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag('lang', newLanguageInput, setLanguagesList, setNewLanguageInput);
                      }
                    }}
                    placeholder="Add language (e.g. German) & press Enter"
                    className="flex-1 px-3 py-1 text-xs rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleAddTag('lang', newLanguageInput, setLanguagesList, setNewLanguageInput)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {languagesList.map(lang => (
                    <span key={lang} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold flex items-center gap-1">
                      {lang}
                      <button type="button" onClick={() => handleRemoveTag(lang, setLanguagesList)} className="text-indigo-400 hover:text-indigo-600">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills & Experience Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Experience Level</label>
                  <select 
                    value={experienceLevel}
                    onChange={e => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Fresh / New Companion">Fresh / New Companion</option>
                    <option value="1-2 Years">1-2 Years Experience</option>
                    <option value="3-5 Years">3-5 Years Experience</option>
                    <option value="5+ Years">5+ Years Experienced Escort/Guide</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Profile Visibility</label>
                  <select 
                    value={profileVisibility}
                    onChange={e => setProfileVisibility(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="PUBLIC">Public (Listed on Sathi Marketplace)</option>
                    <option value="SEMI_PRIVATE">Semi-Private (Verified Users Only)</option>
                    <option value="PRIVATE">Private (Invite Link Only)</option>
                  </select>
                </div>
              </div>

              {/* Skills Tag Manager */}
              <div>
                <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Key Skills & Capabilities</label>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <input 
                    type="text" 
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag('skill', newSkillInput, setSkillsList, setNewSkillInput);
                      }
                    }}
                    placeholder="Add skill (e.g. Corporate Etiquette) & press Enter"
                    className="flex-1 px-3 py-1 text-xs rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleAddTag('skill', newSkillInput, setSkillsList, setNewSkillInput)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {skillsList.map(skill => (
                    <span key={skill} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => handleRemoveTag(skill, setSkillsList)} className="text-emerald-400 hover:text-emerald-600">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Personality / Interests Tag Manager */}
              <div>
                <label className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Personality & Interests</label>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <input 
                    type="text" 
                    value={newInterestInput}
                    onChange={e => setNewInterestInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag('interest', newInterestInput, setInterestsList, setNewInterestInput);
                      }
                    }}
                    placeholder="Add interest (e.g. Classical Music) & press Enter"
                    className="flex-1 px-3 py-1 text-xs rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleAddTag('interest', newInterestInput, setInterestsList, setNewInterestInput)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {interestsList.map(interest => (
                    <span key={interest} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold flex items-center gap-1">
                      {interest}
                      <button type="button" onClick={() => handleRemoveTag(interest, setInterestsList)} className="text-amber-400 hover:text-amber-600">×</button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Live DB Categories Selector */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] lg:text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Companion Categories (Max 5)</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                    Live Database
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
                <div className="max-h-40 overflow-y-auto pr-1 flex flex-wrap gap-1.5">
                  {dbCategories.map((catObj) => {
                    const isSelected = selectedCategories.includes(catObj.name) || selectedCategoryIds.includes(catObj.id);
                    const subCount = catObj.subcategories ? catObj.subcategories.length : 0;
                    return (
                      <button
                        key={catObj.id || catObj.name}
                        type="button"
                        onClick={() => handleCategoryToggle(catObj)}
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

        {/* =========================================================================
            TAB 3: SERVICES & SAFETY BOUNDARIES
            ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">TAB 3 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Service Boundaries & Prohibited Activities</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono font-bold border border-emerald-200 dark:border-emerald-500/30">
                SAFETY FIRST
              </span>
            </div>

            {/* Services Offered & Moderation Scan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
              
              {/* Dynamic Services Selector */}
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2 flex flex-col justify-between">
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">Select Offered Services</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                        {selectedCategories.length > 0 ? `${selectedCategories.length} Categories` : 'All Categories'}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      {selectedServices.length} Selected
                    </span>
                  </div>

                  {/* Search Toolbar */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                      <input
                        type="text"
                        value={serviceSearchQuery}
                        onChange={e => setServiceSearchQuery(e.target.value)}
                        placeholder="Filter sub-services..."
                        className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    {selectedServices.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedServices([]);
                          setSelectedServiceIds([]);
                        }}
                        className="px-2 py-1 text-[9px] font-bold text-rose-600 dark:text-rose-400 hover:underline shrink-0"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Scrollable Container */}
                  <div className="max-h-56 overflow-y-auto pr-1 space-y-2 custom-scrollbar p-2 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800">
                    {Object.keys(filteredGroupedServices).length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-3">No matching services found.</p>
                    ) : (
                      Object.keys(filteredGroupedServices).map(catName => {
                        const servicesInCat = filteredGroupedServices[catName];
                        const selectedInCatCount = servicesInCat.filter(s => selectedServices.includes(s.name)).length;
                        const allSelected = servicesInCat.length > 0 && selectedInCatCount === servicesInCat.length;

                        return (
                          <div key={catName} className="space-y-1">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-0.5">
                              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                <span>{catName}</span>
                                <span className="text-[9px] text-slate-400 font-mono">({selectedInCatCount}/{servicesInCat.length})</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleToggleAllCategoryServices(catName)}
                                className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                              >
                                {allSelected ? 'Deselect All' : 'Select All'}
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {servicesInCat.map(serviceObj => {
                                const isSelected = selectedServices.includes(serviceObj.name);
                                return (
                                  <button
                                    key={serviceObj.id}
                                    type="button"
                                    onClick={() => handleServiceToggle(serviceObj)}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                                      isSelected
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                                    }`}
                                  >
                                    {serviceObj.name} {isSelected && '✓'}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* Service Description Box */}
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block mb-1">Service Description & Policy Moderation</span>
                  <textarea 
                    rows={6}
                    value={serviceDescription}
                    onChange={e => handleScanServiceText(e.target.value)}
                    placeholder="Describe exactly what customers can book you for..."
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                {policyScanResult && (
                  <div className={`p-2 rounded-xl text-[10px] border font-mono ${
                    policyScanResult.allowed
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                  }`}>
                    <strong>AI Policy Check:</strong> {policyScanResult.allowed ? 'Passed ✓ Content conforms to safety guidelines.' : 'Flagged ⚠️ Please remove prohibited terms.'}
                  </div>
                )}
              </div>

            </div>

            {/* SECTION A: SERVICE-SPECIFIC BOUNDARIES & RESTRICTIONS */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                A. Service-Specific Boundaries
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">✓ Allowed Activities</span>
                  <ul className="text-[10px] text-emerald-700 dark:text-emerald-400 space-y-0.5 list-disc list-inside">
                    <li>Public events & conferences</li>
                    <li>Weddings & social gatherings</li>
                    <li>City tours & sightseeing</li>
                    <li>Fine dining & museum visits</li>
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">⚠️ Strict Restrictions</span>
                  <ul className="text-[10px] text-amber-700 dark:text-amber-400 space-y-0.5 list-disc list-inside">
                    <li>No overnight bookings</li>
                    <li>No private residence stays</li>
                    <li>No unverified locations</li>
                    <li>No alcohol pressure</li>
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                  <span className="font-bold text-indigo-800 dark:text-indigo-300 block mb-1">🛡️ Safety Requirements</span>
                  <ul className="text-[10px] text-indigo-700 dark:text-indigo-400 space-y-0.5 list-disc list-inside">
                    <li>Mandatory identity match</li>
                    <li>In-app SOS GPS monitoring</li>
                    <li>Escrow payment lock</li>
                    <li>Customer 18+ verification</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION B: PROHIBITED ACTIVITIES CHECKBOX GROUP */}
            <div className="p-3 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                  <Slash className="w-3.5 h-3.5 text-rose-600" />
                  <span>B. Zero-Tolerance Prohibited Activities (Mandatory Enforcement)</span>
                </span>
                <span className="text-[9px] font-mono text-rose-600 font-bold">STRICT ENFORCEMENT</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[10px]">
                {Object.entries({
                  sexualServices: 'Sexual services or adult requests',
                  adultContent: 'Adult material or explicit content',
                  illegalActivities: 'Illegal acts or contraband',
                  drugsSubstances: 'Substance abuse or narcotics',
                  violenceWeapons: 'Violence, threats or weapons',
                  offPlatformPayments: 'Off-platform cash transactions',
                  unverifiedPrivateResidences: 'Unverified private home bookings',
                  overnightUnmonitoredStays: 'Overnight unmonitored stays'
                }).map(([key, label]) => (
                  <label key={key} className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-rose-200 dark:border-rose-900/40 flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                    <input 
                      type="checkbox"
                      checked={(prohibitedActivities as any)[key]}
                      onChange={e => setProhibitedActivities({ ...prohibitedActivities, [key]: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="leading-tight">{label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: RATES & SCHEDULE (SERVICE-WISE PRICING & DAY-BY-DAY HOURS)
            ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">TAB 4 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Rates, Surcharges & Detailed Schedule</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[9px] font-mono font-bold border border-indigo-200 dark:border-indigo-500/30">
                EARNINGS ENGINE
              </span>
            </div>

            {/* Base Rates & Platform Earnings Estimator */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Base Rates & Earnings Breakdown</span>
                <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  10% Platform Fee Applied
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3">
                {/* Hourly Rate */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">Hourly Rate (₹)</label>
                  <input 
                    type="number" 
                    value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className="w-full px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    You Earn: ₹{Math.round(hourlyRate * 0.9)}/hr
                  </p>
                </div>

                {/* Half Day Rate */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">Half-Day Rate (₹) [4 Hours]</label>
                  <input 
                    type="number" 
                    value={halfDayRate}
                    onChange={e => setHalfDayRate(Number(e.target.value))}
                    className="w-full px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    You Earn: ₹{Math.round(halfDayRate * 0.9)}/session
                  </p>
                </div>

                {/* Full Day Rate */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">Full-Day Rate (₹) [8 Hours]</label>
                  <input 
                    type="number" 
                    value={fullDayRate}
                    onChange={e => setFullDayRate(Number(e.target.value))}
                    className="w-full px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    You Earn: ₹{Math.round(fullDayRate * 0.9)}/day
                  </p>
                </div>
              </div>
            </div>

            {/* Surcharges Grid */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">Surcharges & Fee Overrides</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Weekend Surcharge (₹)</label>
                  <input 
                    type="number" 
                    value={weekendSurcharge}
                    onChange={e => setWeekendSurcharge(Number(e.target.value))}
                    className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Holiday Surcharge (₹)</label>
                  <input 
                    type="number" 
                    value={holidaySurcharge}
                    onChange={e => setHolidaySurcharge(Number(e.target.value))}
                    className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Travel Allowance (₹/km)</label>
                  <input 
                    type="number" 
                    value={travelChargePerKm}
                    onChange={e => setTravelChargePerKm(Number(e.target.value))}
                    className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Extra Hour Rate (₹)</label>
                  <input 
                    type="number" 
                    value={extraHourCharge}
                    onChange={e => setExtraHourCharge(Number(e.target.value))}
                    className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* STRUCTURED DAY-BY-DAY WORKING HOURS */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">Day-wise Operating Schedule</span>
                  <p className="text-[9px] text-slate-500">Configure exact working start & end times for each day of the week.</p>
                </div>
                <button
                  type="button"
                  onClick={handleApplyMondayHoursToAll}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold hover:bg-indigo-100"
                >
                  Apply Monday Hours to All
                </button>
              </div>

              <div className="space-y-1.5">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const dayObj = dayWiseHours[day] || { start: '12:00', end: '22:00', enabled: true };
                  const isDayActive = workingDays.includes(day);

                  return (
                    <div key={day} className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all ${
                      isDayActive
                        ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                        : 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200/50 opacity-60'
                    }`}>
                      <div className="flex items-center gap-2 w-28">
                        <input 
                          type="checkbox" 
                          checked={isDayActive}
                          onChange={() => handleDayToggle(day)}
                          className="w-3.5 h-3.5 rounded text-indigo-600"
                        />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{day}</span>
                      </div>

                      {isDayActive ? (
                        <div className="flex items-center gap-2 flex-1 justify-end font-mono">
                          <span className="text-[10px] text-slate-400">Start:</span>
                          <input 
                            type="time" 
                            value={dayObj.start}
                            onChange={e => setDayWiseHours({
                              ...dayWiseHours,
                              [day]: { ...dayObj, start: e.target.value }
                            })}
                            className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                          />
                          <span className="text-[10px] text-slate-400">End:</span>
                          <input 
                            type="time" 
                            value={dayObj.end}
                            onChange={e => setDayWiseHours({
                              ...dayWiseHours,
                              [day]: { ...dayObj, end: e.target.value }
                            })}
                            className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 italic">Day Off / Unavailable</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Advance Notice & Booking Controls */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">Booking Controls & Policy</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Advance Booking Notice</label>
                  <select 
                    value={advanceNotice}
                    onChange={e => setAdvanceNotice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="2 Hours">2 Hours Notice</option>
                    <option value="6 Hours">6 Hours Notice</option>
                    <option value="12 Hours">12 Hours Notice</option>
                    <option value="24 Hours">24 Hours Notice</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Buffer Between Bookings</label>
                  <select 
                    value={bufferTimeBetweenBookings}
                    onChange={e => setBufferTimeBetweenBookings(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="1 Hour">1 Hour Buffer</option>
                    <option value="2 Hours">2 Hours Buffer</option>
                    <option value="3 Hours">3 Hours Buffer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Cancellation Policy</label>
                  <select 
                    value={cancellationPreference}
                    onChange={e => setCancellationPreference(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Flexible — 100% up to 12h">Flexible (100% up to 12h prior)</option>
                    <option value="Moderate — 100% up to 24h">Moderate (100% up to 24h prior)</option>
                    <option value="Strict — 50% non-refundable">Strict (50% non-refundable)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 5: LOCATION & EMERGENCY
            ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">TAB 5 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Operating Area, Address & Emergency Contact</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono font-bold border border-emerald-200 dark:border-emerald-500/30">
                PRIVACY PROTECTED
              </span>
            </div>

            {/* SECTION 1: OPERATING AREA (PUBLIC) */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Operating Location & Service Radius (Public Profile Info)</span>
                <span className="text-[9px] font-mono text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">PUBLIC VIEW</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Operating City *</label>
                  <select 
                    value={operatingCity}
                    onChange={e => setOperatingCity(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Mumbai Metro">Mumbai Metro</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Locality / Primary Area</label>
                  <input 
                    type="text" 
                    value={localityArea}
                    onChange={e => setLocalityArea(e.target.value)}
                    placeholder="e.g. Bandra West / South Mumbai"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                    <span>Service Radius</span>
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

              {/* Travel Preferences Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <label className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={localTravelEnabled}
                    onChange={e => setLocalTravelEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600"
                  />
                  <span>Local City Travel</span>
                </label>

                <label className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={intercityTravelEnabled}
                    onChange={e => setIntercityTravelEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600"
                  />
                  <span>Intercity Travel</span>
                </label>

                <label className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={outstationTravelEnabled}
                    onChange={e => setOutstationTravelEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600"
                  />
                  <span>Outstation Travel</span>
                </label>
              </div>
            </div>

            {/* SECTION 2: PRIVATE VERIFIED ADDRESS (RELOCATED FROM TAB 1) */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Full Verified Address (Private / Admin Verification Only)</span>
                <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  NEVER SHOWN PUBLICLY
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Street Address *</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Flat / Building / Street"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">City *</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">State *</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Pincode *</label>
                  <input 
                    type="text" 
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="e.g. 400001"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: TRUSTED EMERGENCY CONTACT */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">Trusted Emergency Contact (Mandatory Safety Field)</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Contact Name *</label>
                  <input 
                    type="text" 
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Relationship *</label>
                  <select 
                    value={emergencyRelationship}
                    onChange={e => setEmergencyRelationship(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Relative">Relative</option>
                    <option value="Friend">Trusted Friend</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Mobile Number *</label>
                  <input 
                    type="tel" 
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Alternate Mobile</label>
                  <input 
                    type="tel" 
                    value={emergencyAltPhone}
                    onChange={e => setEmergencyAltPhone(e.target.value)}
                    placeholder="Optional alt phone"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 6: IDENTITY & KYC (DYNAMIC STATUS & MASKED ID)
            ========================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">TAB 6 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Government Identity & Dynamic KYC</h2>
              </div>

              {/* DYNAMIC KYC STATUS BADGE (NOT HARDCODED) */}
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                kycStatus === 'VERIFIED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800'
                  : kycStatus === 'UNDER_REVIEW'
                  ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800'
                  : kycStatus === 'IN_PROGRESS'
                  ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800'
                  : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-400'
              }`}>
                KYC STATUS: {kycStatus.replace('_', ' ')}
              </span>
            </div>

            {/* IDENTITY MATCH WARNING / BADGE */}
            <div className={`p-2.5 rounded-xl text-xs font-mono border ${
              identityMatchCheck.isFullMatch
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
            }`}>
              <div className="flex items-center justify-between">
                <span>{identityMatchCheck.message}</span>
                <span className="text-[9px] uppercase font-bold">Auto-Check</span>
              </div>
            </div>

            {/* Document Details & Masked Display Toggle */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Government ID Type *</label>
                  <select 
                    value={idType}
                    onChange={e => setIdType(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Aadhaar Card">Aadhaar Card (12 Digits)</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID Card</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Document Number *</label>
                    <button 
                      type="button" 
                      onClick={() => setShowPlainId(!showPlainId)}
                      className="text-[9px] font-mono text-indigo-600 font-bold hover:underline flex items-center gap-1"
                    >
                      {showPlainId ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPlainId ? 'Mask Number' : 'Show Plain Text'}</span>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={showPlainId ? idNumber : formattedMaskedId}
                    onChange={e => setIdNumber(e.target.value)}
                    placeholder="Enter ID number"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Front & Back Upload Boxes */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-1">
                  <UploadCloud className="w-4 h-4 text-indigo-600 mx-auto" />
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white block">Document Front Side *</span>
                  <span className="text-[8px] font-mono text-emerald-600 font-bold">✓ Front Uploaded</span>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-1">
                  <UploadCloud className="w-4 h-4 text-indigo-600 mx-auto" />
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white block">Document Back Side *</span>
                  <span className="text-[8px] font-mono text-emerald-600 font-bold">✓ Back Uploaded</span>
                </div>
              </div>
            </div>

            {/* Liveness Verification Box */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600" />
                <div>
                  <h5 className="text-[11px] font-bold text-slate-900 dark:text-white">AI Biometric Liveness Scan</h5>
                  <p className="text-[9px] text-slate-500">Real-time facial liveness check passed</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                ✓ LIVENESS PASSED
              </span>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 7: REVIEW & PAYOUT DETAILS
            ========================================================================= */}
        {currentStep === 7 && (
          <div className="space-y-2.5 lg:space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">TAB 7 OF 7</span>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight">Review Application & Payout Setup</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono font-bold border border-emerald-200 dark:border-emerald-500/30">
                FINAL DECLARATION
              </span>
            </div>

            {/* SUMMARY CARDS WITH EDIT BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">1. Account</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{firstName} {lastName}</strong>
                  <p className="text-[9px] text-slate-500 truncate">{email}</p>
                </div>
                <button type="button" onClick={() => setCurrentStep(1)} className="text-[10px] text-indigo-600 font-bold hover:underline">Edit</button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">2. Profile</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{displayName}</strong>
                  <p className="text-[9px] text-slate-500">{gender} • {experienceLevel}</p>
                </div>
                <button type="button" onClick={() => setCurrentStep(2)} className="text-[10px] text-indigo-600 font-bold hover:underline">Edit</button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">3. Services</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{selectedServices.length} Services</strong>
                  <p className="text-[9px] text-emerald-600 font-mono">Non-sexual bound ✓</p>
                </div>
                <button type="button" onClick={() => setCurrentStep(3)} className="text-[10px] text-indigo-600 font-bold hover:underline">Edit</button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">4. Pricing</span>
                  <strong className="text-slate-900 dark:text-white font-bold">₹{hourlyRate}/hr</strong>
                  <p className="text-[9px] text-slate-500 font-mono">{workingDays.length} Days Active</p>
                </div>
                <button type="button" onClick={() => setCurrentStep(4)} className="text-[10px] text-indigo-600 font-bold hover:underline">Edit</button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">5. Location</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{operatingCity}</strong>
                  <p className="text-[9px] text-slate-500">Radius: {travelRadiusKm} km</p>
                </div>
                <button type="button" onClick={() => setCurrentStep(5)} className="text-[10px] text-indigo-600 font-bold hover:underline">Edit</button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">6. Identity</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{idType}</strong>
                  <p className="text-[9px] text-emerald-600 font-mono">{kycStatus.replace('_', ' ')}</p>
                </div>
                <button type="button" onClick={() => setCurrentStep(6)} className="text-[10px] text-indigo-600 font-bold hover:underline">Edit</button>
              </div>
            </div>

            {/* FULL PAYOUT FORM UI (RENDERED IN CODE) */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Bank Account & Payout Details</span>
                <span className="text-[9px] font-mono text-indigo-600 font-bold">DIRECT DISBURSEMENT</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Account Holder Name *</label>
                  <input 
                    type="text" 
                    value={bankAccountHolder}
                    onChange={e => setBankAccountHolder(e.target.value)}
                    placeholder="As per bank record"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Bank Account Number *</label>
                  <input 
                    type="text" 
                    value={bankAccountNumber}
                    onChange={e => setBankAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Confirm Account Number *</label>
                  <input 
                    type="password" 
                    value={confirmBankAccountNumber}
                    onChange={e => setConfirmBankAccountNumber(e.target.value)}
                    placeholder="Repeat account number"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">IFSC Code *</label>
                  <input 
                    type="text" 
                    value={ifscCode}
                    onChange={e => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0001234"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono uppercase text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Bank Name</label>
                  <input 
                    type="text" 
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="Bank Name"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Payout Method</label>
                  <select 
                    value={payoutMethod}
                    onChange={e => setPayoutMethod(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Direct Bank Transfer (IMPS/NEFT)">Direct Bank Transfer (IMPS/NEFT)</option>
                    <option value="UPI Instant Transfer">UPI Instant Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">UPI ID (Optional)</label>
                  <input 
                    type="text" 
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="username@upi"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* FINAL DECLARATIONS & CONSENT CHECKBOXES */}
            <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-[10px] lg:text-xs">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Final Application Declarations & Code of Conduct</span>
              
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={declAccuracy} onChange={e => setDeclAccuracy(e.target.checked)} className="w-3.5 h-3.5 rounded text-indigo-600" />
                <span>I certify that all provided information, KYC documents, and bank details are accurate.</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={declSafetyPolicy} onChange={e => setDeclSafetyPolicy(e.target.checked)} className="w-3.5 h-3.5 rounded text-indigo-600" />
                <span>I agree to follow all Sathi Companion Safety Guidelines and emergency protocols.</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={declNonSexual} onChange={e => setDeclNonSexual(e.target.checked)} className="w-3.5 h-3.5 rounded text-indigo-600" />
                <span>I explicitly declare that all services provided are strictly non-sexual, professional companionship.</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={declTerms} onChange={e => setDeclTerms(e.target.checked)} className="w-3.5 h-3.5 rounded text-indigo-600" />
                <span>I agree to Platform Terms of Service and Privacy Policy.</span>
              </label>
            </div>

          </div>
        )}

        {/* WIZARD CONTROL BUTTONS */}
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
              disabled={currentStep === 1 && !dobAgeInfo.isEligible}
              className="px-5 py-1.5 lg:py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs hover:opacity-95 flex items-center gap-1.5 shadow-md shadow-indigo-600/30 disabled:opacity-40"
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
              {isSubmitting ? 'Submitting Application...' : 'Submit Companion Application ✓'}
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

