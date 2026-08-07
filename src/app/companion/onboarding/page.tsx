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
  Check
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ServicePolicyEngine } from '@/lib/servicePolicyEngine';

export default function CompanionOnboardingWizard() {
  const router = useRouter();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Step 2: Personal Info
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('English, Hindi');
  const [skills, setSkills] = useState('Public Speaking, Event Coordination');

  // Step 3: Services & Policy Check
  const [serviceDescription, setServiceDescription] = useState('Event companion for gala dinners and sightseeing tours.');
  const [policyScanResult, setPolicyScanResult] = useState<any>(null);

  // Step 4: Pricing
  const [hourlyRate, setHourlyRate] = useState(75);
  const [dailyRate, setDailyRate] = useState(500);

  // Step 6: Service Area
  const [serviceCity, setServiceCity] = useState('New York');
  const [maxDistanceKm, setMaxDistanceKm] = useState(25);

  // Step 8: KYC Document Vault
  const [docType, setDocType] = useState('NATIONAL_ID');
  const [idNumber, setIdNumber] = useState('ID-8821903');
  const [docUploaded, setDocUploaded] = useState(true);

  // Step 9: Payout Setup
  const [bankAccountNumber, setBankAccountNumber] = useState('•••• 8821');

  // Step 10: Agreement
  const [agreedToSafety, setAgreedToSafety] = useState(false);

  const handleScanService = (text: string) => {
    setServiceDescription(text);
    const scan = ServicePolicyEngine.evaluateProposedService(text);
    setPolicyScanResult(scan);
  };

  const handleNext = () => {
    if (currentStep === 3 && policyScanResult && !policyScanResult.allowed) {
      showToast('error', 'Prohibited Content Detected', 'Please revise your service description to comply with safety policies.');
      return;
    }
    if (currentStep < 12) {
      setCurrentStep(prev => prev + 1);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Step Tracker */}
      <div className="space-y-4 text-center">
        <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
          STEP {currentStep} OF 12 — {STEPS_LIST[currentStep - 1].toUpperCase()}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Companion Verification & Onboarding</h1>
        <p className="text-xs text-slate-400">Complete the 12-step application to publish your profile on Companion Connect.</p>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div 
            className="h-full gradient-bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 12) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* STEP 1: ELIGIBILITY CHECK */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <UserCheck className="w-5 h-5 text-indigo-400" /> Step 1: Legal Age & Account Eligibility Check
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Age & Identity Verified
              </div>
              <p>Your account has been verified as 18+ eligible based on your registration Date of Birth.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-white block">Pre-Requisites Met:</span>
              <p>✓ Email Verified</p>
              <p>✓ Phone Verified</p>
              <p>✓ Zero-Tolerance Prohibited Policy Agreement</p>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE & BIO */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Step 2: Personal Profile & Skills
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Public Display Name</label>
              <input 
                type="text" 
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Aria Vance"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Professional Bio</label>
              <textarea 
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Share your experience, etiquette training, and companion background..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Languages Spoken</label>
                <input 
                  type="text" 
                  value={languages}
                  onChange={e => setLanguages(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Key Skills / Expertise</label>
                <input 
                  type="text" 
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SERVICES & PROHIBITED SERVICE SCANNER */}
        {currentStep === 3 && (
          <div className="space-y-4">
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

        {/* STEP 4: PRICING */}
        {currentStep === 4 && (
          <div className="space-y-4">
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

        {/* STEP 8: PRIVACY DOCUMENT VAULT (KYC) */}
        {currentStep === 8 && (
          <div className="space-y-4">
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

        {/* STEP 9: PAYOUT SETUP */}
        {currentStep === 9 && (
          <div className="space-y-4">
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

        {/* STEP 10: SAFETY TERMS */}
        {currentStep === 10 && (
          <div className="space-y-4">
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

        {/* STEP 11 & 12: REVIEW & SUBMIT */}
        {(currentStep === 11 || currentStep === 12) && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Application Ready for Submission</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your 12-step verification data is ready. Clicking submit dispatches your application to the Admin Trust & Safety Review Board.
            </p>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs disabled:opacity-30 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentStep < 12 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-2xl gradient-bg-primary text-white font-bold text-xs hover:opacity-95 flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-900/30 flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting to Admin Review...' : 'Submit Companion Application'} <Check className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
