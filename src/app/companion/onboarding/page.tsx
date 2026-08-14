'use client';

import React, { useState, useRef } from 'react';
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
  Globe,
  KeyRound,
  Tag,
  ShieldAlert,
  Clock,
  Plane,
  Calculator,
  Percent,
  Navigation,
  Sliders,
  Briefcase,
  PhoneCall,
  Camera,
  Scan,
  CreditCard,
  Building2
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ServicePolicyEngine } from '@/lib/servicePolicyEngine';

export default function CompanionOnboardingWizard() {
  const router = useRouter();
  const { showToast } = useToast();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ==================== STEP 1: ELIGIBILITY STATE ====================
  const [dob, setDob] = useState<string>('2000-01-15');
  
  // 10-digit India Mobile Number state
  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [mobileOtpSent, setMobileOtpSent] = useState<boolean>(false);
  const [mobileOtpInput, setMobileOtpInput] = useState<string>('1234');
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(true);

  // Email & OTP state
  const [email, setEmail] = useState<string>('aria.vance@companion.com');
  const [emailOtpSent, setEmailOtpSent] = useState<boolean>(false);
  const [emailOtpInput, setEmailOtpInput] = useState<string>('5678');
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

  // OTP Verification Handlers
  const handleSendMobileOtp = () => {
    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      showToast('error', 'Invalid Phone Number', 'Mobile number must be exactly 10 digits.');
      return;
    }
    setMobileOtpSent(true);
    showToast('info', 'Mobile OTP Dispatched', `A 4-digit verification code was sent to +91 ${mobileNumber}`);
  };

  const handleVerifyMobileOtp = () => {
    if (mobileOtpInput.trim() === '1234' || mobileOtpInput.trim().length === 4) {
      setIsPhoneVerified(true);
      setMobileOtpSent(false);
      showToast('success', 'Mobile Number Verified', `+91 ${mobileNumber} successfully verified with OTP!`);
    } else {
      showToast('error', 'Incorrect OTP', 'Please enter the correct 4-digit code (Demo code: 1234)');
    }
  };

  const handleSendEmailOtp = () => {
    if (!email.trim() || !email.includes('@')) {
      showToast('error', 'Invalid Email Address', 'Please enter a valid email address.');
      return;
    }
    setEmailOtpSent(true);
    showToast('info', 'Email OTP Dispatched', `A 4-digit verification code was sent to ${email}`);
  };

  const handleVerifyEmailOtp = () => {
    if (emailOtpInput.trim() === '5678' || emailOtpInput.trim().length === 4) {
      setIsEmailVerified(true);
      setEmailOtpSent(false);
      showToast('success', 'Email Address Verified', `${email} successfully verified with OTP!`);
    } else {
      showToast('error', 'Incorrect OTP', 'Please enter the correct 4-digit code (Demo code: 5678)');
    }
  };

  const validateStep1 = (): boolean => {
    const errors: { dob?: string; phone?: string; email?: string; agreedEligibility?: string } = {};

    if (!dob) {
      errors.dob = 'Date of Birth is required for age verification.';
    } else if (userAge < 18) {
      errors.dob = `You must be at least 18 years old to join as a companion (Current Age: ${userAge}).`;
    }

    if (!mobileNumber.trim()) {
      errors.phone = 'Mobile phone number is required.';
    } else if (!/^\d{10}$/.test(mobileNumber.trim())) {
      errors.phone = 'Mobile number must be exactly 10 digits (e.g. 9876543210).';
    } else if (!isPhoneVerified) {
      errors.phone = 'Please send and verify Mobile OTP before proceeding.';
    }

    if (!email.trim() || !email.includes('@')) {
      errors.email = 'Please enter a valid email address.';
    } else if (!isEmailVerified) {
      errors.email = 'Please send and verify Email OTP before proceeding.';
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Event Companion', 'Study & Focus Partner']);
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

  const handleToggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) {
        showToast('info', 'At least 1 Category Required', 'Please keep at least 1 companionship category selected.');
        return;
      }
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else {
      if (selectedCategories.length >= 3) {
        showToast('warning', 'Maximum 3 Categories Limit', 'You can select a maximum of 3 companionship categories.');
        return;
      }
      setSelectedCategories(prev => [...prev, cat]);
    }
  };

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

    if (selectedCategories.length === 0) {
      errors.primaryCategory = 'Please select at least 1 category (Maximum 3 allowed).';
    } else if (selectedCategories.length > 3) {
      errors.primaryCategory = 'You can select a maximum of 3 categories.';
    }

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

  // ==================== STEP 3: SERVICES & SAFETY BOUNDARY STATE ====================
  const [offeredServices, setOfferedServices] = useState<string[]>([
    'Event Companion',
    'Fine Dining Companion',
    'Sightseeing & City Guide',
    'Language & Accent Guide'
  ]);
  const [serviceDescription, setServiceDescription] = useState('Professional companion for corporate galas, fine dining etiquette, language translation, art museum visits, and city tours.');
  const [policyScanResult, setPolicyScanResult] = useState<any>(null);
  const [safetyBoundaries, setSafetyBoundaries] = useState({
    zeroIntimacy: true,
    publicVenueOnly: true,
    noIllegalSubstances: true
  });
  const [step3Errors, setStep3Errors] = useState<{ services?: string; safety?: string; description?: string }>({});

  const SERVICE_CATALOG_OPTIONS = [
    'Event Companion',
    'Fine Dining Companion',
    'Sightseeing & City Guide',
    'Business Gala Escort',
    'Museum & Art Partner',
    'Fitness & Outdoor Buddy',
    'Virtual Study Focus Companion',
    'Wedding Guest Companion',
    'Language & Accent Guide',
    'Shopping & Stylist Buddy'
  ];

  const handleToggleServiceCatalog = (srv: string) => {
    if (offeredServices.includes(srv)) {
      if (offeredServices.length <= 1) {
        showToast('info', 'At least 1 Service Required', 'Please keep at least one companion service selected.');
        return;
      }
      setOfferedServices(prev => prev.filter(s => s !== srv));
    } else {
      setOfferedServices(prev => [...prev, srv]);
    }
  };

  const handleScanService = (text: string) => {
    setServiceDescription(text);
    const scan = ServicePolicyEngine.evaluateProposedService(text);
    setPolicyScanResult(scan);
  };

  const validateStep3 = (): boolean => {
    const errors: { services?: string; safety?: string; description?: string } = {};

    if (offeredServices.length === 0) {
      errors.services = 'Please select at least one offered service tag.';
    }

    if (!safetyBoundaries.zeroIntimacy || !safetyBoundaries.publicVenueOnly || !safetyBoundaries.noIllegalSubstances) {
      errors.safety = 'You must accept all 3 mandatory safety boundary agreements to offer companion services.';
    }

    if (!serviceDescription.trim() || serviceDescription.trim().length < 20) {
      errors.description = 'Please describe your services in at least 20 characters.';
    }

    if (policyScanResult && !policyScanResult.allowed) {
      errors.description = 'Your service description contains prohibited content. Please revise.';
    }

    setStep3Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== STEP 4: PRICING & ESCROW CALCULATOR STATE ====================
  const [hourlyRate, setHourlyRate] = useState<number>(1500); // INR per hour
  const [dailyRate, setDailyRate] = useState<number>(8000);   // INR per day
  const [currencySymbol, setCurrencySymbol] = useState<string>('₹');
  const [cancellationPolicy, setCancellationPolicy] = useState<'FLEXIBLE' | 'MODERATE' | 'STRICT'>('MODERATE');
  const [enableOvertimePremium, setEnableOvertimePremium] = useState<boolean>(true);
  const [outstationMultiplier, setOutstationMultiplier] = useState<number>(1.5);
  const [step4Errors, setStep4Errors] = useState<{ hourlyRate?: string; dailyRate?: string }>({});

  const validateStep4 = (): boolean => {
    const errors: { hourlyRate?: string; dailyRate?: string } = {};

    if (!hourlyRate || hourlyRate < 300) {
      errors.hourlyRate = 'Minimum hourly rate is ₹300/hr.';
    } else if (hourlyRate > 25000) {
      errors.hourlyRate = 'Maximum hourly rate limit is ₹25,000/hr.';
    }

    if (!dailyRate || dailyRate < hourlyRate * 3) {
      errors.dailyRate = `Full day rate should be at least ₹${hourlyRate * 3} (3x hourly rate).`;
    }

    setStep4Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== STEP 5: AVAILABILITY & SAFETY GUARDIAN STATE ====================
  const [availableDays, setAvailableDays] = useState<{ [key: string]: boolean }>({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: false
  });
  const [preferredShift, setPreferredShift] = useState<string>('Afternoon & Evening (12 PM - 10 PM)');
  const [bookingNotice, setBookingNotice] = useState<string>('6 Hours Advance Notice');
  const [emergencyGuardianName, setEmergencyGuardianName] = useState<string>('Rahul Vance');
  const [emergencyGuardianPhone, setEmergencyGuardianPhone] = useState<string>('9876543210');
  const [enableLiveGpsTracking, setEnableLiveGpsTracking] = useState<boolean>(true);
  const [step5Errors, setStep5Errors] = useState<{ days?: string; guardianPhone?: string }>({});

  const handleToggleDay = (day: string) => {
    setAvailableDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const validateStep5 = (): boolean => {
    const errors: { days?: string; guardianPhone?: string } = {};

    const activeDaysCount = Object.values(availableDays).filter(Boolean).length;
    if (activeDaysCount === 0) {
      errors.days = 'Please select at least 1 available working day.';
    }

    if (!emergencyGuardianPhone.trim() || !/^\d{10}$/.test(emergencyGuardianPhone.trim())) {
      errors.guardianPhone = 'Please enter a valid 10-digit emergency guardian mobile number (+91).';
    }

    setStep5Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== STEP 6: SERVICE AREA & GEOFENCING STATE ====================
  const [serviceCity, setServiceCity] = useState<string>('Mumbai Metro');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(25);
  const [allowOutstation, setAllowOutstation] = useState<boolean>(true);
  const [hasValidPassport, setHasValidPassport] = useState<boolean>(true);
  const [travelAllowancePerKm, setTravelAllowancePerKm] = useState<number>(20);
  const [step6Errors, setStep6Errors] = useState<{ city?: string; distance?: string }>({});

  const CITIES_LIST = [
    'Mumbai Metro',
    'Delhi NCR (Gurugram/Noida)',
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Goa',
    'Chandigarh',
    'International Travel Ready'
  ];

  const validateStep6 = (): boolean => {
    const errors: { city?: string; distance?: string } = {};

    if (!serviceCity.trim()) {
      errors.city = 'Please select your base operating city.';
    }

    if (!maxDistanceKm || maxDistanceKm < 5 || maxDistanceKm > 100) {
      errors.distance = 'Travel radius must be between 5 km and 100 km.';
    }

    setStep6Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== STEP 7: IDENTITY & BIOMETRIC LIVENESS STATE ====================
  const [biometricStatus, setBiometricStatus] = useState<'NOT_STARTED' | 'SCANNING' | 'VERIFIED'>('VERIFIED');
  const [livenessScore, setLivenessScore] = useState<number>(98.6);
  const [step7Errors, setStep7Errors] = useState<{ biometric?: string }>({});

  const handleStartBiometricScan = () => {
    setBiometricStatus('SCANNING');
    setTimeout(() => {
      setBiometricStatus('VERIFIED');
      setLivenessScore(99.1);
      showToast('success', 'Biometric Scan Passed', 'Facial recognition and anti-spoofing liveness verified successfully!');
    }, 1800);
  };

  const validateStep7 = (): boolean => {
    if (biometricStatus !== 'VERIFIED') {
      setStep7Errors({ biometric: 'Please complete the live facial recognition biometric scan.' });
      return false;
    }
    setStep7Errors({});
    return true;
  };

  // ==================== STEP 8: KYC VAULT (GOVT DOCUMENT ENCRYPTED) STATE ====================
  const [docType, setDocType] = useState<string>('AADHAAR');
  const [idNumber, setIdNumber] = useState<string>('482910398821');
  const [attachedFileName, setAttachedFileName] = useState<string>('aadhaar_front_back_encrypted.pdf');
  const [isFileAttached, setIsFileAttached] = useState<boolean>(true);
  const [step8Errors, setStep8Errors] = useState<{ idNumber?: string; file?: string }>({});

  const validateStep8 = (): boolean => {
    const errors: { idNumber?: string; file?: string } = {};

    if (!idNumber.trim()) {
      errors.idNumber = 'Government ID document number is required.';
    } else if (docType === 'AADHAAR' && !/^\d{12}$/.test(idNumber.trim())) {
      errors.idNumber = 'Aadhaar Card number must be exactly 12 digits.';
    } else if (docType === 'PAN' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(idNumber.trim().toUpperCase())) {
      errors.idNumber = 'Invalid PAN Card format (e.g. ABCDE1234F).';
    }

    if (!isFileAttached) {
      errors.file = 'Please upload an encrypted copy of your government ID proof.';
    }

    setStep8Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== STEP 9: PAYOUT SETUP STATE ====================
  const [payoutMethod, setPayoutMethod] = useState<'BANK' | 'UPI'>('BANK');
  const [accountHolderName, setAccountHolderName] = useState<string>('Aria Vance');
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('50100293847192');
  const [ifscCode, setIfscCode] = useState<string>('SBIN0001234');
  const [upiId, setUpiId] = useState<string>('ariavance@okaxis');
  const [step9Errors, setStep9Errors] = useState<{ holder?: string; account?: string; ifsc?: string; upi?: string }>({});

  const validateStep9 = (): boolean => {
    const errors: { holder?: string; account?: string; ifsc?: string; upi?: string } = {};

    if (!accountHolderName.trim()) {
      errors.holder = 'Account holder name is required.';
    }

    if (payoutMethod === 'BANK') {
      if (!bankAccountNumber.trim() || bankAccountNumber.trim().length < 8) {
        errors.account = 'Please enter a valid bank account number (Min 8 digits).';
      }
      if (!ifscCode.trim() || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.trim().toUpperCase())) {
        errors.ifsc = 'Invalid IFSC code format (e.g. SBIN0001234).';
      }
    } else {
      if (!upiId.trim() || !upiId.includes('@')) {
        errors.upi = 'Please enter a valid UPI ID (e.g. username@upi).';
      }
    }

    setStep9Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== STEP 10: SAFETY TERMS & BACKGROUND CHECK CONSENT STATE ====================
  const [agreedBackgroundCheck, setAgreedBackgroundCheck] = useState<boolean>(true);
  const [agreedOffPlatformContract, setAgreedOffPlatformContract] = useState<boolean>(true);
  const [agreedSosLocationConsent, setAgreedSosLocationConsent] = useState<boolean>(true);
  const [step10Errors, setStep10Errors] = useState<{ terms?: string }>({});

  const validateStep10 = (): boolean => {
    if (!agreedBackgroundCheck || !agreedOffPlatformContract || !agreedSosLocationConsent) {
      setStep10Errors({ terms: 'You must accept all 3 legal safety & background check consents.' });
      return false;
    }
    setStep10Errors({});
    return true;
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

    if (currentStep === 3) {
      if (!validateStep3()) {
        showToast('error', 'Services Validation Failed', 'Please select services and accept all safety boundary terms.');
        return;
      }
    }

    if (currentStep === 4) {
      if (!validateStep4()) {
        showToast('error', 'Pricing Validation Failed', 'Please enter valid hourly and daily rates.');
        return;
      }
    }

    if (currentStep === 5) {
      if (!validateStep5()) {
        showToast('error', 'Availability Validation Failed', 'Please select working days and a valid emergency contact.');
        return;
      }
    }

    if (currentStep === 6) {
      if (!validateStep6()) {
        showToast('error', 'Location Validation Failed', 'Please select your operating city and valid radius.');
        return;
      }
    }

    if (currentStep === 7) {
      if (!validateStep7()) {
        showToast('error', 'Identity Validation Failed', 'Please complete the live facial liveness scan.');
        return;
      }
    }

    if (currentStep === 8) {
      if (!validateStep8()) {
        showToast('error', 'KYC Validation Failed', 'Please enter valid government ID details and upload proof.');
        return;
      }
    }

    if (currentStep === 9) {
      if (!validateStep9()) {
        showToast('error', 'Payout Validation Failed', 'Please enter valid bank or UPI payout account details.');
        return;
      }
    }

    if (currentStep === 10) {
      if (!validateStep10()) {
        showToast('error', 'Safety Terms Required', 'Please accept all legal & background check consents.');
        return;
      }
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
              
              {/* Date of Birth Field with Visible Calendar Icon */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date of Birth *
                  </span>
                  {userAge >= 18 && <span className="text-[10px] text-emerald-400 font-bold">✓ 18+ Eligible</span>}
                </label>
                
                <div className="relative flex items-center">
                  <input 
                    ref={dateInputRef}
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className={`w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-90 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                      step1Errors.dob ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => dateInputRef.current?.showPicker?.()}
                    className="absolute right-3 text-indigo-400 hover:text-indigo-300 p-1"
                    title="Open Calendar Picker"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>

                {step1Errors.dob && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {step1Errors.dob}
                  </p>
                )}
              </div>

              {/* Verified Email Address Field with OTP Flow */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Address *
                  </span>
                  {isEmailVerified ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-bold">Verification Pending</span>
                  )}
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setIsEmailVerified(false);
                  }}
                  placeholder="aria.vance@companion.com"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 ${
                    step1Errors.email ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {step1Errors.email && (
                  <p className="text-[11px] text-rose-400 font-medium">{step1Errors.email}</p>
                )}

                {/* Email OTP Verification Drawer */}
                {!isEmailVerified && (
                  <div className="pt-1.5">
                    {!emailOtpSent ? (
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Mail className="w-3.5 h-3.5" /> Send Email OTP
                      </button>
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 animate-fadeIn">
                        <p className="text-[11px] text-slate-300 font-semibold">Enter 4-Digit Email OTP (Demo: 5678):</p>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            maxLength={4}
                            value={emailOtpInput}
                            onChange={e => setEmailOtpInput(e.target.value)}
                            placeholder="5678"
                            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-center font-mono font-bold text-white tracking-widest focus:outline-none focus:border-indigo-500 w-24"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyEmailOtp}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verify OTP
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Phone Field with Disabled +91 Prefix & 10-Digit Validation */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" /> Mobile Phone Number (India) *
                  </span>
                  {isPhoneVerified ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> OTP VERIFIED
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-bold">Verification Pending</span>
                  )}
                </label>

                <div className="flex items-center">
                  {/* Disabled +91 India Country Code */}
                  <span className="px-4 py-3 rounded-l-2xl bg-slate-900 border border-r-0 border-slate-800 text-slate-300 font-mono font-bold text-sm select-none flex items-center gap-1 shrink-0">
                    🇮🇳 +91
                  </span>
                  <input 
                    type="text"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, ''); // Numeric digits only
                      setMobileNumber(val);
                      if (val !== mobileNumber) setIsPhoneVerified(false);
                    }}
                    placeholder="9876543210"
                    className={`w-full px-4 py-3 rounded-r-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono tracking-wider ${
                      step1Errors.phone ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-0.5">
                  <span>Standard 10-digit Indian Mobile Number</span>
                  <span className={mobileNumber.length === 10 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {mobileNumber.length} / 10 digits
                  </span>
                </div>

                {step1Errors.phone && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {step1Errors.phone}
                  </p>
                )}

                {/* Mobile OTP Verification Drawer */}
                {!isPhoneVerified && (
                  <div className="pt-1.5">
                    {!mobileOtpSent ? (
                      <button
                        type="button"
                        onClick={handleSendMobileOtp}
                        className="px-4 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Send Mobile OTP (+91 {mobileNumber})
                      </button>
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 max-w-sm animate-fadeIn">
                        <p className="text-xs text-slate-300 font-semibold">Enter 4-Digit Mobile OTP (Demo: 1234):</p>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            maxLength={4}
                            value={mobileOtpInput}
                            onChange={e => setMobileOtpInput(e.target.value)}
                            placeholder="1234"
                            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-center font-mono font-bold text-white tracking-widest focus:outline-none focus:border-indigo-500 w-28"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyMobileOtp}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-900/30"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Verify Mobile OTP
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pre-Requisites Summary Checklist */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-white block border-b border-slate-800/80 pb-2">Pre-Requisites Status:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className={`flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border ${
                  isEmailVerified ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'
                }`}>
                  {isEmailVerified ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-amber-400" />}
                  <span className="font-medium">Email OTP {isEmailVerified ? 'Verified' : 'Pending'}</span>
                </div>

                <div className={`flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border ${
                  isPhoneVerified ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'
                }`}>
                  {isPhoneVerified ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-amber-400" />}
                  <span className="font-medium">Phone OTP {isPhoneVerified ? 'Verified' : 'Pending'}</span>
                </div>

                <div className={`flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border ${
                  agreedEligibility ? 'border-emerald-500/30 text-emerald-400' : 'border-slate-800 text-slate-400'
                }`}>
                  {agreedEligibility ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  <span className="font-medium">Policy Agreement</span>
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

            </div>

            {/* Companionship Categories (Multi-Select Up to 3) */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <span>Companionship Categories *</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Select 1 to 3 categories)</span>
                </label>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedCategories.length > 0 && selectedCategories.length <= 3
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {selectedCategories.length} / 3 Selected
                </span>
              </div>

              {/* Tag Chips Grid */}
              <div className="flex flex-wrap gap-2 pt-1">
                {CATEGORY_OPTIONS.map((cat, idx) => {
                  const isSelected = selectedCategories.includes(cat);
                  const isMaxReached = selectedCategories.length >= 3 && !isSelected;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                          : isMaxReached
                          ? 'bg-slate-900/40 border-slate-800/60 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" /> : <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Categories Chips Preview */}
              {selectedCategories.length > 0 && (
                <div className="pt-2 flex items-center gap-2 flex-wrap border-t border-slate-900 mt-2">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Active Tags:</span>
                  {selectedCategories.map((cat, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                      {cat}
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(cat)}
                        className="text-indigo-400 hover:text-rose-400 ml-1 text-xs"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {step2Errors.primaryCategory && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> {step2Errors.primaryCategory}
                </p>
              )}
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

        {/* ==================== STEP 3: SERVICES & SAFETY SHIELD ==================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400 shrink-0" /> Step 3: Offered Services & Safety Boundary Protocol
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20">
                SERVICE BOUNDARIES
              </span>
            </div>

            {/* Service Catalog Tag Selection */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <span>Select Companion Services You Offer *</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Select all that apply)</span>
                </label>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {offeredServices.length} Selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {SERVICE_CATALOG_OPTIONS.map((srv, idx) => {
                  const isSelected = offeredServices.includes(srv);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleServiceCatalog(srv)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" /> : <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                      <span>{srv}</span>
                    </button>
                  );
                })}
              </div>

              {step3Errors.services && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> {step3Errors.services}
                </p>
              )}
            </div>

            {/* Detailed Service Description & Real-Time Policy Scanner */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="text-slate-300">Detailed Service Description & Specialization *</label>
                <span className="text-[10px] font-mono text-indigo-400">REAL-TIME MODERATION SCANNER</span>
              </div>
              <textarea 
                rows={3}
                value={serviceDescription}
                onChange={e => handleScanService(e.target.value)}
                placeholder="Describe your companionship offerings in detail..."
                className={`w-full p-4 rounded-2xl bg-slate-950 border text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 leading-relaxed ${
                  step3Errors.description ? 'border-rose-500' : 'border-slate-800'
                }`}
              ></textarea>
              
              {policyScanResult && (
                <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${policyScanResult.allowed ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/30 border-rose-500/30 text-rose-300'}`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {policyScanResult.allowed ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                    {policyScanResult.allowed ? 'Service Policy Scan Passed' : 'Prohibited Content Violation Detected'}
                  </div>
                  <p className="text-[11px] opacity-80">{policyScanResult.summary || 'Complies with platform zero-tolerance companionship rules.'}</p>
                </div>
              )}

              {step3Errors.description && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> {step3Errors.description}
                </p>
              )}
            </div>

            {/* Mandatory Safety Boundaries (3 Checkboxes) */}
            <div className={`p-4 rounded-2xl border space-y-3 ${
              step3Errors.safety ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" /> Mandatory Platform Safety Boundary Terms *
                </span>
                <span className="text-[10px] text-rose-400 font-mono font-bold">ZERO TOLERANCE</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={safetyBoundaries.zeroIntimacy}
                    onChange={e => setSafetyBoundaries(prev => ({ ...prev, zeroIntimacy: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500 accent-indigo-500 shrink-0"
                  />
                  <span><strong>Zero Physical Intimacy:</strong> All companionship services are strictly non-sexual. Off-platform solicitations lead to immediate permanent ban.</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={safetyBoundaries.publicVenueOnly}
                    onChange={e => setSafetyBoundaries(prev => ({ ...prev, publicVenueOnly: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500 accent-indigo-500 shrink-0"
                  />
                  <span><strong>Public Venue Meeting Requirement:</strong> All initial client engagements must occur in verified public venues (restaurants, events, museums).</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={safetyBoundaries.noIllegalSubstances}
                    onChange={e => setSafetyBoundaries(prev => ({ ...prev, noIllegalSubstances: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500 accent-indigo-500 shrink-0"
                  />
                  <span><strong>Substance Prohibition:</strong> Strictly refrain from illegal substance use or excessive intoxication during active booking hours.</span>
                </label>
              </div>

              {step3Errors.safety && (
                <p className="text-[11px] text-rose-400 font-medium pt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> {step3Errors.safety}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ==================== STEP 4: PRICING & ESCROW CALCULATOR ==================== */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400 shrink-0" /> Step 4: Service Rates & Escrow Earnings Calculator
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                DYNAMIC EARNINGS
              </span>
            </div>

            {/* Rate Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Base Hourly Rate ({currencySymbol} / hr) *</span>
                  <span className="text-[10px] text-slate-500">Min ₹300 - Max ₹25,000</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-mono font-bold text-slate-400">{currencySymbol}</span>
                  <input 
                    type="number" 
                    value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className={`w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold ${
                      step4Errors.hourlyRate ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                </div>
                {step4Errors.hourlyRate && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {step4Errors.hourlyRate}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Full Day Package Rate (8 Hours) *</span>
                  <span className="text-[10px] text-slate-500">Recommended Discounted Day Rate</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-mono font-bold text-slate-400">{currencySymbol}</span>
                  <input 
                    type="number" 
                    value={dailyRate}
                    onChange={e => setDailyRate(Number(e.target.value))}
                    className={`w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold ${
                      step4Errors.dailyRate ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                </div>
                {step4Errors.dailyRate && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {step4Errors.dailyRate}
                  </p>
                )}
              </div>
            </div>

            {/* Escrow Payout Breakdown Calculator Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-indigo-400 shrink-0" /> Live Escrow Payout Breakdown (Per 1-Hour Booking)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">100% ESCROW PROTECTED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Client Total Charged</span>
                  <span className="font-mono font-bold text-white text-base">₹{Math.round(hourlyRate * 1.10)}</span>
                  <span className="text-[10px] text-slate-500 block">Includes 10% Trust & Escrow Fee</span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                  <span className="text-indigo-300 block text-[11px]">Your Net Payout (85%)</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">₹{Math.round(hourlyRate * 0.85)} / hr</span>
                  <span className="text-[10px] text-emerald-400/80 block">Direct Bank Deposit</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Platform Commission</span>
                  <span className="font-mono font-bold text-slate-300 text-base">₹{Math.round(hourlyRate * 0.15)}</span>
                  <span className="text-[10px] text-slate-500 block">15% Safety & Verification</span>
                </div>
              </div>
            </div>

            {/* Cancellation Policy Selection Cards */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Cancellation & Refund Policy *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'FLEXIBLE', title: 'Flexible', desc: '100% refund up to 12 hours before booking starts.' },
                  { key: 'MODERATE', title: 'Moderate (Recommended)', desc: '100% refund up to 24h, 50% refund within 24h.' },
                  { key: 'STRICT', title: 'Strict', desc: '50% non-refundable deposit for cancellations.' }
                ].map(pol => (
                  <button
                    key={pol.key}
                    type="button"
                    onClick={() => setCancellationPolicy(pol.key as any)}
                    className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                      cancellationPolicy === pol.key
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{pol.title}</span>
                      {cancellationPolicy === pol.key && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <p className="text-[10px] leading-relaxed text-slate-400">{pol.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 5: AVAILABILITY & SAFETY GUARDIAN ==================== */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400 shrink-0" /> Step 5: Weekly Schedule & Safety Guardian Setup
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20">
                LIVE SCHEDULE
              </span>
            </div>

            {/* Weekly Days Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="text-slate-300">Working Days Selection *</label>
                <span className="text-[10px] font-mono text-emerald-400">
                  {Object.values(availableDays).filter(Boolean).length} / 7 Days Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {Object.keys(availableDays).map((day) => {
                  const isActive = availableDays[day];
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                        isActive
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-mono tracking-wider opacity-80">{day.substring(0, 3)}</span>
                      <span className="text-xs">{day}</span>
                    </button>
                  );
                })}
              </div>

              {step5Errors.days && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> {step5Errors.days}
                </p>
              )}
            </div>

            {/* Preferred Working Shift & Booking Notice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Preferred Working Shift *</label>
                <select 
                  value={preferredShift}
                  onChange={e => setPreferredShift(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Morning & Afternoon (8 AM - 4 PM)">Morning & Afternoon (8 AM - 4 PM)</option>
                  <option value="Afternoon & Evening (12 PM - 10 PM)">Afternoon & Evening (12 PM - 10 PM)</option>
                  <option value="Evening & Late Night (4 PM - 1 AM)">Evening & Late Night (4 PM - 1 AM)</option>
                  <option value="Full Day Flexible (8 AM - 11 PM)">Full Day Flexible (8 AM - 11 PM)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Minimum Advance Booking Notice *</label>
                <select 
                  value={bookingNotice}
                  onChange={e => setBookingNotice(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="2 Hours Advance Notice">Immediate (2 Hours Notice)</option>
                  <option value="6 Hours Advance Notice">Same Day (6 Hours Notice)</option>
                  <option value="24 Hours Advance Notice">Standard (24 Hours Notice)</option>
                </select>
              </div>
            </div>

            {/* Emergency SOS Guardian Setup (Safety Shield) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-white">Emergency Safety Guardian Contact (+91) *</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  LIVE SOS PROTECTED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Designate a trusted family member or friend's mobile number. They receive real-time location alerts if you trigger the 1-Tap Emergency SOS button during active bookings.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Guardian Full Name *</label>
                  <input 
                    type="text" 
                    value={emergencyGuardianName}
                    onChange={e => setEmergencyGuardianName(e.target.value)}
                    placeholder="e.g. Rahul Vance"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Guardian Mobile Number (+91) *</label>
                  <div className="flex">
                    <span className="px-3.5 py-3 rounded-l-2xl bg-slate-900 border border-r-0 border-slate-800 text-xs font-mono font-bold text-indigo-400 flex items-center">
                      +91
                    </span>
                    <input 
                      type="text" 
                      maxLength={10}
                      value={emergencyGuardianPhone}
                      onChange={e => setEmergencyGuardianPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className={`w-full px-4 py-3 rounded-r-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono ${
                        step5Errors.guardianPhone ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                  </div>
                  {step5Errors.guardianPhone && (
                    <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" /> {step5Errors.guardianPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 6: SERVICE AREA & GEOFENCING ==================== */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-indigo-400 shrink-0" /> Step 6: Operating City & Geofence Travel Radius
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20">
                GEOFENCE RADIUS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Base City Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Base Operating City *</label>
                <select 
                  value={serviceCity}
                  onChange={e => setServiceCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {CITIES_LIST.map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Travel Allowance Rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Travel Allowance Fee (Beyond 10km)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-mono font-bold text-slate-400">₹</span>
                  <input 
                    type="number" 
                    value={travelAllowancePerKm}
                    onChange={e => setTravelAllowancePerKm(Number(e.target.value))}
                    className="w-full pl-9 pr-12 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                  <span className="absolute right-4 text-xs font-mono text-slate-400">/ km</span>
                </div>
              </div>
            </div>

            {/* Travel Distance Geofence Range Slider */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-400" /> Maximum Travel Radius Geofence *
                </label>
                <span className="font-mono font-bold text-indigo-400 text-sm">
                  {maxDistanceKm} Km Radius
                </span>
              </div>

              <input 
                type="range" 
                min={5}
                max={100}
                step={5}
                value={maxDistanceKm}
                onChange={e => setMaxDistanceKm(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-900 appearance-none cursor-pointer accent-indigo-500"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>5 Km (Local District)</span>
                <span>25 Km (City-Wide)</span>
                <span>50 Km (Metropolitan)</span>
                <span>100 Km (Outstation)</span>
              </div>
            </div>

            {/* Outstation & Travel Readiness Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Outstation Travel Willingness</span>
                  <span className="text-[10px] text-slate-400 block">Available for inter-city travel bookings</span>
                </div>
                <input 
                  type="checkbox"
                  checked={allowOutstation}
                  onChange={e => setAllowOutstation(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500 accent-indigo-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-indigo-400" /> Valid Passport Availability
                  </span>
                  <span className="text-[10px] text-slate-400 block">Ready for international travel companionships</span>
                </div>
                <input 
                  type="checkbox"
                  checked={hasValidPassport}
                  onChange={e => setHasValidPassport(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500 accent-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 7: IDENTITY & BIOMETRIC LIVENESS CHECK ==================== */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-400 shrink-0" /> Step 7: Facial Biometrics & Liveness Anti-Spoofing Check
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                BIOMETRIC SECURED
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4 max-w-lg mx-auto shadow-2xl">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border-2 border-dashed ${
                  biometricStatus === 'VERIFIED' ? 'border-emerald-500 animate-spin-slow' : 'border-indigo-500 animate-spin'
                }`}></div>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border ${
                  biometricStatus === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                }`}>
                  {biometricStatus === 'VERIFIED' ? (
                    <UserCheck className="w-12 h-12" />
                  ) : (
                    <Scan className="w-12 h-12 animate-pulse" />
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  {biometricStatus === 'VERIFIED' ? 'Facial Liveness Verification Passed' : 'Live Facial Scan Required'}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {biometricStatus === 'VERIFIED'
                    ? `Biometric match score: ${livenessScore}% confidence. Liveness & depth perception verified.`
                    : 'Position your face inside the frame to complete 3D liveness detection.'}
                </p>
              </div>

              {biometricStatus === 'VERIFIED' ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>3D Liveness Anti-Spoofing: Verified</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleStartBiometricScan}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
                >
                  Start Live Camera Scan
                </button>
              )}

              <div className="pt-3 border-t border-slate-900 grid grid-cols-3 gap-2 text-[10px] text-slate-400">
                <div>✓ Eye Blink Test</div>
                <div>✓ Depth Sensor</div>
                <div>✓ ID Match</div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 8: PRIVACY DOCUMENT VAULT (KYC) ==================== */}
        {currentStep === 8 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0" /> Step 8: Government ID Proof & KYC Vault
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                AES-256 VAULT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Government Document Type *</label>
                <select 
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="AADHAAR">Aadhaar Card (India - 12 Digits)</option>
                  <option value="PAN">PAN Card (India - 10 Chars)</option>
                  <option value="PASSPORT">International Passport</option>
                  <option value="DRIVING_LICENSE">Driver's License</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Document Identification Number *</label>
                <input 
                  type="text" 
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  placeholder={docType === 'AADHAAR' ? 'e.g. 482910398821' : 'Enter document number'}
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono ${
                    step8Errors.idNumber ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                {step8Errors.idNumber && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" /> {step8Errors.idNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Document Upload Box */}
            <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 text-center space-y-3">
              <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto" />
              <div>
                <p className="text-xs text-slate-300 font-bold">Encrypted Document Upload Vault</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Government documents are stored in an isolated vault and never shared publicly.</p>
              </div>

              {isFileAttached ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{attachedFileName} (AES-256 Encrypted)</span>
                  <button 
                    type="button"
                    onClick={() => setIsFileAttached(false)}
                    className="text-slate-400 hover:text-rose-400 ml-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsFileAttached(true);
                    setAttachedFileName('gov_id_proof_scanned.pdf');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-indigo-400 hover:text-white transition-all"
                >
                  Browse File to Upload
                </button>
              )}

              {step8Errors.file && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> {step8Errors.file}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ==================== STEP 9: MASKED PAYOUT & BANK / UPI SETUP ==================== */}
        {currentStep === 9 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400 shrink-0" /> Step 9: Bank Account & Masked Payout Setup
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                MASKED ESCROW GATEWAY
              </span>
            </div>

            {/* Payout Method Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayoutMethod('BANK')}
                className={`p-3.5 rounded-2xl border text-center font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  payoutMethod === 'BANK'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" /> Direct Bank Transfer (IMPS)
              </button>

              <button
                type="button"
                onClick={() => setPayoutMethod('UPI')}
                className={`p-3.5 rounded-2xl border text-center font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  payoutMethod === 'UPI'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" /> Instant UPI Payout
              </button>
            </div>

            {/* Account Holder Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Bank Account Holder Full Name *</label>
              <input 
                type="text" 
                value={accountHolderName}
                onChange={e => setAccountHolderName(e.target.value)}
                placeholder="Must match your legal KYC name"
                className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 ${
                  step9Errors.holder ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {step9Errors.holder && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> {step9Errors.holder}
                </p>
              )}
            </div>

            {payoutMethod === 'BANK' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Bank Account Number *</label>
                  <input 
                    type="text" 
                    value={bankAccountNumber}
                    onChange={e => setBankAccountNumber(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono ${
                      step9Errors.account ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                  <p className="text-[10px] text-slate-500">Frontend display is masked (`•••• •••• {bankAccountNumber.slice(-4)}`).</p>
                  {step9Errors.account && (
                    <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">{step9Errors.account}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Bank IFSC Code *</label>
                  <input 
                    type="text" 
                    value={ifscCode}
                    onChange={e => setIfscCode(e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono uppercase ${
                      step9Errors.ifsc ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                  <p className="text-[10px] text-emerald-400 font-mono">✓ Branch Verified: State Bank of India, Mumbai</p>
                  {step9Errors.ifsc && (
                    <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">{step9Errors.ifsc}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">UPI ID Handle *</label>
                <input 
                  type="text" 
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. username@okaxis or 9876543210@ybl"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-white focus:outline-none focus:border-indigo-500 font-mono ${
                    step9Errors.upi ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
                <p className="text-[10px] text-emerald-400 font-mono">✓ VPA Handle Active & Verified</p>
                {step9Errors.upi && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">{step9Errors.upi}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== STEP 10: SAFETY TERMS & BACKGROUND CHECK CONSENT ==================== */}
        {currentStep === 10 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0" /> Step 10: Legal Safety Terms & Background Check Consents
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono font-bold border border-rose-500/20">
                LEGAL COMPLIANCE
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs text-slate-300">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreedBackgroundCheck}
                  onChange={e => setAgreedBackgroundCheck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500 accent-indigo-500 shrink-0" 
                />
                <span><strong>Criminal Background Search Consent:</strong> I authorize Companion Connect to run automated police record & court database checks for trust & safety.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer border-t border-slate-900 pt-3">
                <input 
                  type="checkbox" 
                  checked={agreedOffPlatformContract}
                  onChange={e => setAgreedOffPlatformContract(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500 accent-indigo-500 shrink-0" 
                />
                <span><strong>Zero-Tolerance Off-Platform Contract:</strong> Accepting direct cash payments or arranging unmonitored off-platform bookings results in immediate account termination.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer border-t border-slate-900 pt-3">
                <input 
                  type="checkbox" 
                  checked={agreedSosLocationConsent}
                  onChange={e => setAgreedSosLocationConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500 accent-indigo-500 shrink-0" 
                />
                <span><strong>Emergency Live Location Tracking:</strong> I consent to active background GPS location tracking during confirmed companion bookings for emergency guardian alerts.</span>
              </label>

              {step10Errors.terms && (
                <p className="text-[11px] text-rose-400 font-medium pt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> {step10Errors.terms}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ==================== STEP 11 & 12: AUDIT REVIEW & ADMIN SUBMISSION ==================== */}
        {(currentStep === 11 || currentStep === 12) && (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Application Ready for Admin Review</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                Your 12-step verification data is complete and sealed. Clicking submit dispatches your profile to the Admin Safety Board.
              </p>
            </div>

            {/* Comprehensive Companion Audit Card */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-left text-xs space-y-3 max-w-lg mx-auto shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">COMPANION PROFILE DRAFT</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  SEALED & ENCRYPTED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Public Display Name:</span>
                  <span className="font-bold text-white">{displayName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Legal Name:</span>
                  <span className="font-bold text-white">{legalName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Mobile (+91):</span>
                  <span className="font-mono font-bold text-emerald-400">+91 {mobileNumber} ✓</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Operating City:</span>
                  <span className="font-bold text-white">{serviceCity} ({maxDistanceKm}km)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Specializations:</span>
                  <span className="font-bold text-indigo-400">{selectedCategories.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Base Hourly Rate:</span>
                  <span className="font-mono font-bold text-emerald-400">₹{hourlyRate}/hr (Net ₹{Math.round(hourlyRate * 0.85)})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Biometric Liveness:</span>
                  <span className="font-bold text-emerald-400">Verified ({livenessScore}%)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Government KYC:</span>
                  <span className="font-bold text-emerald-400">{docType} Verified</span>
                </div>
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
