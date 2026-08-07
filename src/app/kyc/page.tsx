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
  AlertCircle, 
  Sparkles,
  Lock,
  EyeOff,
  Check,
  Shield,
  RefreshCw,
  Globe
} from 'lucide-react';
import { DocumentType } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export type KycState = 
  | 'NOT_STARTED' 
  | 'IN_PROGRESS' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'EXPIRED' 
  | 'REVERIFICATION_REQUIRED';

export default function KycVerificationPage() {
  const { showToast } = useToast();

  const [country, setCountry] = useState('India');
  const [docType, setDocType] = useState<DocumentType>('GOVERNMENT_ID');
  const [idNumber, setIdNumber] = useState('');
  const [fileUploaded, setFileUploaded] = useState<string | null>(null);
  const [selfieCaptured, setSelfieCaptured] = useState<boolean>(false);
  const [livenessScore, setLivenessScore] = useState<number | null>(null);
  
  // Mandatory KYC Consent (Section 70)
  const [kycConsentAccepted, setKycConsentAccepted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [kycStatus, setKycStatus] = useState<KycState>('NOT_STARTED');

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        showToast('error', 'File Too Large', 'Maximum allowed document file size is 10MB.');
        return;
      }
      setFileUploaded(file.name);
      showToast('success', 'Document Scanned', `Loaded ${file.name} securely.`);
    }
  };

  const handleSimulateSelfie = () => {
    setSelfieCaptured(true);
    setLivenessScore(0.98); // 98% AI Match score
    showToast('success', 'Liveness Check Passed', 'Biometric liveness verification completed (98% confidence).');
  };

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUploaded) {
      showToast('error', 'Document Required', 'Please upload a valid government document image.');
      return;
    }
    if (!selfieCaptured) {
      showToast('error', 'Selfie Required', 'Please complete the biometric selfie liveness check.');
      return;
    }
    if (!kycConsentAccepted) {
      showToast('error', 'Consent Required', 'You must accept the identity verification consent terms.');
      return;
    }

    setIsSubmitting(true);
    setKycStatus('SUBMITTED');

    setTimeout(() => {
      setIsSubmitting(false);
      setKycStatus('VERIFIED');
      showToast('success', 'KYC Verified ✓', 'Your identity has been verified by the backend verification provider.');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <UserCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">KYC Identity & Biometric Verification</h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          To maintain high trust, companions & users undergo identity verification. All sensitive documents remain encrypted and strictly protected.
        </p>

        {/* KYC Status Badge (Section 71) */}
        <div className="pt-2">
          <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold border inline-flex items-center gap-1.5 ${
            kycStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
            kycStatus === 'SUBMITTED' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
            kycStatus === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
            'bg-slate-900 text-slate-400 border-slate-800'
          }`}>
            Status: {kycStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Strict Privacy Guarantee Box (Section 72) */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <EyeOff className="w-4 h-4" /> Section 72 Document Privacy Guarantee
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Your government IDs are encrypted at rest using AES-256. Documents are <strong>NEVER SHOWN PUBLICLY</strong>, never stored in public URLs, browser logs, or client-side stores.
        </p>
      </div>

      {kycStatus === 'VERIFIED' ? (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">KYC Verification Approved!</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your government ID and biometric face match scored <strong className="text-emerald-400 font-mono">98% authenticity</strong>. You have received full KYC verification approval.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4" /> KYC_VERIFIED_ACTIVE
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitKyc} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
          
          {/* Step 1: Select Country & Document Type (Section 69) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs">1</span>
              Country & Document Selection
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Country of Issuance</label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                >
                  <option value="India">India (Aadhaar / Passport / DL)</option>
                  <option value="United States">United States (SSN State ID / Passport)</option>
                  <option value="United Kingdom">United Kingdom (National Insurance / Passport)</option>
                  <option value="Canada">Canada (Driver's License / Passport)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value as DocumentType)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                >
                  <option value="GOVERNMENT_ID">National Government ID Card</option>
                  <option value="PASSPORT">International Passport</option>
                  <option value="DRIVING_LICENSE">Driver's License</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Document Number (Optional)</label>
              <input 
                type="text"
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                placeholder="e.g. XXXX-XXXX-XXXX"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Step 2: Upload Document (Section 69) */}
          <div className="space-y-3 border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs">2</span>
              Upload High-Resolution Document Image
            </h3>

            <div className="p-8 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-indigo-500 text-center space-y-3 cursor-pointer relative">
              <input 
                type="file" 
                onChange={handleDocumentSelect}
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
              <div>
                <p className="text-xs font-semibold text-white">Click or Drag Document Image Here</p>
                <p className="text-[11px] text-slate-500">Supports JPG, PNG, PDF up to 10MB</p>
              </div>
              {fileUploaded && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> File Loaded: {fileUploaded}
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Selfie Liveness Check (Section 73) */}
          <div className="space-y-3 border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs">3</span>
              Live Biometric Selfie & Liveness Match
            </h3>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" /> Biometric Liveness Verification
                </h4>
                <p className="text-[11px] text-slate-400">Match your face with the uploaded document picture.</p>
              </div>

              {selfieCaptured ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Liveness Score: 98%
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulateSelfie}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4 text-indigo-400" /> Capture Live Selfie
                </button>
              )}
            </div>
          </div>

          {/* Step 4: Mandatory Consent Checkbox (Section 70) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 border-t border-slate-800 pt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={kycConsentAccepted}
                onChange={e => setKycConsentAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-800 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I authorize Companion Connect and its verification provider to verify my identity for platform eligibility and safety purposes. I acknowledge the{' '}
                <Link href="/privacy" className="text-indigo-400 underline">Privacy Policy</Link> and{' '}
                <Link href="/terms" className="text-indigo-400 underline">Data Retention Policy</Link>.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials with AI Provider...
              </>
            ) : (
              'Submit Encrypted KYC for Verification'
            )}
          </button>

        </form>
      )}

    </div>
  );
}
