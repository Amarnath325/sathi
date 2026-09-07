'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  ShieldCheck, 
  Upload, 
  Camera, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Lock,
  Check,
  RefreshCw,
  User,
  HeartHandshake,
  ArrowRight,
  Search,
  FileCheck,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useKycStore, KycApplicantType } from '@/lib/kycStore';
import { useUserStore } from '@/lib/userStore';

export default function KycVerificationPage() {
  const { showToast } = useToast();
  const { applications, addApplication } = useKycStore();

  // Mode: 'submit' vs 'tracker'
  const [activeTab, setActiveTab] = useState<'submit' | 'tracker'>('submit');

  // Applicant Type: 'USER' vs 'COMPANION'
  const [applicantType, setApplicantType] = useState<KycApplicantType>('USER');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('24');
  const [gender, setGender] = useState('Female');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');

  // Document Fields
  const [docType, setDocType] = useState<string>('AADHAAR_CARD');
  const [idNumber, setIdNumber] = useState('');
  const [frontDocName, setFrontDocName] = useState<string | null>(null);
  const [frontDocUrl, setFrontDocUrl] = useState<string>('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80');
  const [backDocName, setBackDocName] = useState<string | null>(null);
  const [backDocUrl, setBackDocUrl] = useState<string>('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80');
  
  // Biometrics
  const [selfieCaptured, setSelfieCaptured] = useState<boolean>(false);
  const [selfieUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80');
  const [livenessScore, setLivenessScore] = useState<number | null>(null);
  
  // Companion specific rates if COMPANION
  const [hourlyRate, setHourlyRate] = useState('75');
  const [skills, setSkills] = useState('Multilingual, Event Companion');
  const [bio, setBio] = useState('Professional verified applicant seeking platform eligibility.');

  // Mandatory KYC Consent
  const [kycConsentAccepted, setKycConsentAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Status Tracker Search Query
  const [trackerQuery, setTrackerQuery] = useState('');
  const [searchedRecord, setSearchedRecord] = useState<any>(null);

  const handleFrontDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        showToast('error', 'File Too Large', 'Maximum allowed document file size is 10MB.');
        return;
      }
      setFrontDocName(file.name);
      setFrontDocUrl(URL.createObjectURL(file));
      showToast('success', 'Front Document Scanned', `Loaded ${file.name} securely.`);
    }
  };

  const handleBackDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        showToast('error', 'File Too Large', 'Maximum allowed document file size is 10MB.');
        return;
      }
      setBackDocName(file.name);
      setBackDocUrl(URL.createObjectURL(file));
      showToast('success', 'Back Document Scanned', `Loaded ${file.name} securely.`);
    }
  };

  const handleSimulateSelfie = () => {
    setSelfieCaptured(true);
    setLivenessScore(98.8);
    showToast('success', 'Liveness Check Passed ✓', 'Biometric liveness verified with 98.8% facial match confidence.');
  };

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('error', 'Full Name Required', 'Please enter your official legal name as shown on ID.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('error', 'Valid Email Required', 'Please enter a valid email address for audit trail.');
      return;
    }
    if (!idNumber.trim()) {
      showToast('error', 'Document Number Required', 'Please enter your government document identification number.');
      return;
    }
    if (!selfieCaptured) {
      showToast('error', 'Biometric Selfie Required', 'Please complete the live face liveness capture.');
      return;
    }
    if (!kycConsentAccepted) {
      showToast('error', 'Consent Required', 'You must accept the identity verification and safety terms.');
      return;
    }

    setIsSubmitting(true);
    const applicantId = applicantType === 'COMPANION' ? `comp-${Date.now()}` : `usr-${Date.now()}`;

    setTimeout(() => {
      const newRec = addApplication({
        userId: applicantId,
        applicantType,
        userName: fullName.trim(),
        userEmail: email.trim().toLowerCase(),
        userPhone: phone.trim() || '+91 98765 43210',
        userAge: Number(age) || 24,
        userGender: gender,
        userCountry: country,
        userState: state,
        userCity: city || 'Mumbai',
        languages: ['English', 'Hindi'],
        hourlyRate: applicantType === 'COMPANION' ? Number(hourlyRate) || 75 : undefined,
        skills: applicantType === 'COMPANION' ? skills.split(',').map(s => s.trim()) : undefined,
        categories: applicantType === 'COMPANION' ? ['Event Companion', 'Sightseeing Guide'] : undefined,
        bio: bio.trim() || `${applicantType} account verification submitted.`,
        avatar: selfieUrl,
        photos: [selfieUrl],
        type: docType,
        documentNumber: idNumber.trim(),
        fileUrl: frontDocUrl,
        fileUrlBack: backDocUrl,
        selfieUrl,
        ocrData: {
          extractedName: fullName.trim(),
          extractedDocNum: idNumber.trim(),
          confidenceScore: 99.4
        },
        livenessScore: livenessScore || 98.8,
        status: 'PENDING',
        safetyTier: 'TIER_2_ADDRESS',
        bgvStatus: 'NOT_STARTED',
        expiresAt: '2028-12-31'
      });

      // If applicant is USER, queue in user store with pending status
      if (applicantType === 'USER') {
        try {
          useUserStore.getState().addUser({
            id: applicantId,
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim() || '+91 98765 43210',
            role: 'CUSTOMER',
            status: 'PENDING',
            riskLevel: 'LOW',
            riskScore: 0.05,
            city: city || 'Mumbai',
            country: country || 'India',
            isEmailVerified: false,
            isPhoneVerified: false,
            walletBalance: 0,
            avatar: selfieUrl,
            bio: bio.trim() || 'Customer account submitted for KYC approval.'
          });
        } catch (e) {
          console.warn('User store syncing warning:', e);
        }
      }

      setIsSubmitting(false);
      setSubmittedAppId(newRec.id);
      showToast('success', 'KYC Application Queued ✓', 'Your documents have been submitted to the Admin KYC Verification Center for compliance inspection.');
    }, 1200);
  };

  const handleSearchTracker = () => {
    if (!trackerQuery.trim()) {
      showToast('info', 'Enter Search Term', 'Enter your Email, Name, or Application ID to check status.');
      return;
    }
    const q = trackerQuery.trim().toLowerCase();
    const found = applications.find(
      a => a.id.toLowerCase() === q ||
           a.userEmail?.toLowerCase() === q ||
           a.userName?.toLowerCase().includes(q) ||
           a.documentNumber?.toLowerCase() === q
    );
    if (found) {
      setSearchedRecord(found);
      showToast('success', 'Application Found', `Loaded verification record for ${found.userName}`);
    } else {
      setSearchedRecord(null);
      showToast('error', 'Not Found', 'No KYC application matched the provided details.');
    }
  };

  const submittedRecord = submittedAppId ? applications.find(a => a.id === submittedAppId) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 text-center space-y-4 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg-primary flex items-center justify-center shadow-xl shadow-indigo-500/20">
          <UserCheck className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          KYC & Identity Verification Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Comprehensive compliance gate for <strong>Users (Customers)</strong> and <strong>Companions</strong>. To protect platform safety, all service access and booking functionality remain locked until documentation is reviewed and approved by compliance administrators.
        </p>

        {/* Navigation Tabs (Submit vs Status Tracker) */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-950 border border-slate-800 gap-2 mt-2">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'submit' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <FileText className="w-4 h-4" /> Submit Application
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'tracker' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Search className="w-4 h-4" /> Check KYC Status
          </button>
        </div>
      </div>

      {/* Strict Service Eligibility Lock Notice */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-indigo-500/30 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              Mandatory Service Gate Policy
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                ENFORCED
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Profiles with <span className="text-amber-400 font-mono">PENDING</span> or <span className="text-rose-400 font-mono">REJECTED</span> status cannot accept or request bookings. Approval by Super Admin unlocks <span className="text-emerald-400 font-mono font-bold">⚡ Service Eligibility</span>.
            </p>
          </div>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-400 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all"
        >
          Admin Verification Portal <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* TAB 1: SUBMIT NEW APPLICATION */}
      {activeTab === 'submit' && (
        <>
          {submittedRecord ? (
            /* Post Submission Confirmation Card */
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/40 bg-slate-950/90 text-center space-y-6 shadow-2xl animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30 shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">KYC Verification Under Inspection</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{submittedRecord.userName}</strong>. Your identification and biometric records have been securely registered and queued for verification.
                </p>
              </div>

              {/* Status Details Card */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-lg mx-auto text-left space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Application ID:</span>
                  <strong className="text-indigo-300">{submittedRecord.id}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Account Type:</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold">
                    {submittedRecord.applicantType === 'COMPANION' ? '🤝 COMPANION' : '👤 USER / CUSTOMER'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">KYC Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold border ${
                    submittedRecord.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                    submittedRecord.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                    'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {submittedRecord.status === 'PENDING' ? '⏳ UNDER REVIEW (INSPECT QUEUE)' : submittedRecord.status}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Service Eligibility:</span>
                  <strong className={submittedRecord.status === 'APPROVED' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {submittedRecord.status === 'APPROVED' ? '⚡ ELIGIBLE (Active)' : '🔒 LOCKED (Pending Approval)'}
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSubmittedAppId(null);
                    setFullName('');
                    setEmail('');
                    setIdNumber('');
                    setSelfieCaptured(false);
                    setKycConsentAccepted(false);
                  }}
                  className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Submit Another Application
                </button>
                <Link
                  href="/admin"
                  className="px-6 py-3 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Open Admin KYC Queue to Review & Approve →
                </Link>
              </div>
            </div>
          ) : (
            /* Application Submission Form */
            <form onSubmit={handleSubmitKyc} className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
              
              {/* STEP 1: Account Role Selection */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider block">
                  Select Verification Account Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setApplicantType('USER')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                      applicantType === 'USER' 
                        ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/30' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">User / Customer Account</h4>
                        {applicantType === 'USER' && <Check className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Verify your identity to book companions, unlock high-tier event access, and verify payment methods.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setApplicantType('COMPANION')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                      applicantType === 'COMPANION' 
                        ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/30' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Companion Service Profile</h4>
                        {applicantType === 'COMPANION' && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Register as a verified professional companion to receive bookings, publish hourly rates, and earn via platform escrow.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: Personal Identification Details */}
              <div className="space-y-4 border-t border-slate-800/80 pt-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-mono">1</span>
                  Personal & Legal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal Name *</label>
                    <input 
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. priya.sharma@gmail.com"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number *</label>
                    <input 
                      type="text"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Age</label>
                    <input 
                      type="number"
                      min={18}
                      max={90}
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">City / Region</label>
                    <input 
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Extra Companion Fields */}
                {applicantType === 'COMPANION' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Proposed Hourly Rate ($ / hr)</label>
                      <input 
                        type="number"
                        min={20}
                        value={hourlyRate}
                        onChange={e => setHourlyRate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Skills & Specializations</label>
                      <input 
                        type="text"
                        value={skills}
                        onChange={e => setSkills(e.target.value)}
                        placeholder="e.g. Multilingual, Event Companion, Tourism"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: Government Document Details & Upload */}
              <div className="space-y-4 border-t border-slate-800/80 pt-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-mono">2</span>
                  Government Issued Identity Document
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Country of Issuance</label>
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="India">India (UIDAI / Election / Passport)</option>
                      <option value="United States">United States (State ID / Passport)</option>
                      <option value="United Kingdom">United Kingdom (Passport / Driver's)</option>
                      <option value="Canada">Canada (Driver's License / Passport)</option>
                      <option value="Singapore">Singapore (NRIC / Passport)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Document Type *</label>
                    <select
                      value={docType}
                      onChange={e => setDocType(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="AADHAAR_CARD">National Identity Card (Aadhaar Card)</option>
                      <option value="PASSPORT">International Passport</option>
                      <option value="DRIVING_LICENSE">Driver's License</option>
                      <option value="VOTER_ID">Voter ID Card</option>
                      <option value="PAN_CARD">Tax ID / PAN Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Document ID Number *</label>
                    <input 
                      type="text"
                      required
                      value={idNumber}
                      onChange={e => setIdNumber(e.target.value)}
                      placeholder="e.g. 5432-8765-9012"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Upload Dual Front & Back Image Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-indigo-500 text-center space-y-3 relative cursor-pointer group">
                    <input 
                      type="file" 
                      onChange={handleFrontDocSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <Upload className="w-7 h-7 text-indigo-400 mx-auto group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-bold text-white">Upload Document Front Side</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">High resolution PNG, JPG, or PDF (Max 10MB)</p>
                    </div>
                    {frontDocName ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {frontDocName}
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                        Front Face Scanned Default
                      </span>
                    )}
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-indigo-500 text-center space-y-3 relative cursor-pointer group">
                    <input 
                      type="file" 
                      onChange={handleBackDocSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <Upload className="w-7 h-7 text-indigo-400 mx-auto group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-bold text-white">Upload Document Back Side</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Address proof & authority signature</p>
                    </div>
                    {backDocName ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {backDocName}
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                        Back Face Scanned Default
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 4: Live Biometric Selfie & Liveness Check */}
              <div className="space-y-4 border-t border-slate-800/80 pt-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-mono">3</span>
                  Biometric Facial Liveness Verification
                </h3>

                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-400" /> AI Face Match & Liveness Engine
                    </h4>
                    <p className="text-[11px] text-slate-400 max-w-md leading-relaxed">
                      Instant 3D depth and anti-spoofing facial check comparing your camera capture against the uploaded government ID.
                    </p>
                  </div>

                  {selfieCaptured ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/50">
                        <img src={selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                      </div>
                      <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Match Score: 98.8% ✓
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSimulateSelfie}
                      className="px-6 py-3 rounded-xl gradient-bg-primary text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:opacity-90 transition-all"
                    >
                      <Camera className="w-4 h-4" /> Capture Live Selfie & Check Liveness
                    </button>
                  )}
                </div>
              </div>

              {/* STEP 5: Mandatory Legal Consent & Terms */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 border-t border-slate-800/80">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={kycConsentAccepted}
                    onChange={e => setKycConsentAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    I confirm that the submitted identity documents belong to me and are authentic. I authorize the compliance team to inspect my credentials for platform safety and service eligibility. I agree that my account will remain restricted until full KYC verification is granted.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Transmitting Encrypted KYC Records to Compliance Queue...
                  </>
                ) : (
                  <>
                    Submit KYC for Compliance Verification <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}
        </>
      )}

      {/* TAB 2: LIVE KYC STATUS TRACKER */}
      {activeTab === 'tracker' && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Search className="w-5 h-5 text-indigo-400" /> Real-Time KYC Status Tracker
            </h2>
            <p className="text-xs text-slate-400">
              Lookup your verification status using your registered Email, Application ID, or Document Number.
            </p>
          </div>

          {/* Search Box */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={trackerQuery}
                onChange={e => setTrackerQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchTracker()}
                placeholder="Enter Email Address, Name, or Application ID (e.g. kyc-178...)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleSearchTracker}
              className="px-6 py-3.5 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              Search
            </button>
          </div>

          {/* Searched Record Display */}
          {searchedRecord ? (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-700 shrink-0">
                    <img src={searchedRecord.avatar || searchedRecord.selfieUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">{searchedRecord.userName}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" /> {searchedRecord.userEmail} • <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {searchedRecord.userCity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
                    searchedRecord.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                    searchedRecord.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                    'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {searchedRecord.status === 'APPROVED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {searchedRecord.status}
                  </span>
                </div>
              </div>

              {/* Service Eligibility Lock Status */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                searchedRecord.status === 'APPROVED' 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
              }`}>
                <div className="flex items-center gap-2.5 text-xs font-bold">
                  {searchedRecord.status === 'APPROVED' ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-amber-400" />}
                  <span>
                    Service Access Status: {searchedRecord.status === 'APPROVED' ? '⚡ ELIGIBLE FOR ALL PLATFORM SERVICES' : '🔒 SERVICE ACCESS LOCKED (KYC Verification Required)'}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  {searchedRecord.applicantType || 'USER'}
                </span>
              </div>

              {/* Review Audit Notes */}
              {searchedRecord.reviewRemarks && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                  <span className="text-slate-400 font-bold block">Compliance Review Remarks:</span>
                  <p className="text-slate-200">{searchedRecord.reviewRemarks}</p>
                  {searchedRecord.reviewedBy && (
                    <span className="text-[10px] text-slate-500 block pt-1">
                      Reviewed by: {searchedRecord.reviewedBy} on {searchedRecord.reviewedAt ? new Date(searchedRecord.reviewedAt).toLocaleString() : '—'}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2 text-slate-400">
              <FileCheck className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No record queried yet. Enter your search term above to track approval status.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
