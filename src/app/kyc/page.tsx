'use client';

import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Upload, 
  Camera, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  Sparkles,
  Lock
} from 'lucide-react';
import { DocumentType, VerificationStatus } from '@/lib/types';

export default function KycVerificationPage() {
  const [docType, setDocType] = useState<DocumentType>('GOVERNMENT_ID');
  const [fileUploaded, setFileUploaded] = useState<string | null>(null);
  const [selfieCaptured, setSelfieCaptured] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [kycStatus, setKycStatus] = useState<VerificationStatus>('PENDING');
  const [livenessScore, setLivenessScore] = useState<number | null>(null);

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUploaded(e.target.files[0].name);
    }
  };

  const handleSimulateSelfie = () => {
    setSelfieCaptured(true);
    setLivenessScore(0.97); // 97% match AI
  };

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setKycStatus('APPROVED');
    }, 1200);
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
          To maintain zero-tolerance marketplace safety, all users and companions must upload official government credentials & complete AI liveness matching.
        </p>
      </div>

      {kycStatus === 'APPROVED' ? (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">KYC Verification Approved!</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your government ID and biometric face match scored <strong className="text-emerald-400 font-mono">97% authenticity</strong>. You are granted full verified status across the platform.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4" /> VERIFICATION_BADGE_ACTIVE
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitKyc} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
          
          {/* Step 1: Select Document Type */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs">1</span>
              Select Official Document Type
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { type: 'GOVERNMENT_ID', label: 'National ID Card' },
                { type: 'PASSPORT', label: 'International Passport' },
                { type: 'DRIVING_LICENSE', label: 'Driving License' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setDocType(item.type as DocumentType)}
                  className={`p-4 rounded-2xl border text-xs font-semibold transition-all text-left ${
                    docType === item.type 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <FileText className="w-5 h-5 mb-2 text-indigo-400" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Upload Front & Back Document */}
          <div className="space-y-3 border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs">2</span>
              Upload Document Scan / Photo
            </h3>

            <div className="p-8 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 hover:border-indigo-500 text-center space-y-3 cursor-pointer relative">
              <input 
                type="file" 
                onChange={handleDocumentSelect}
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
              <div>
                <p className="text-xs font-semibold text-white">Click or Drag & Drop File</p>
                <p className="text-[11px] text-slate-500">Supports JPG, PNG, PDF up to 10MB</p>
              </div>
              {fileUploaded && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> File Loaded: {fileUploaded}
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Biometric Liveness Selfie Simulation */}
          <div className="space-y-3 border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs">3</span>
              Live Biometric Selfie & Face Match
            </h3>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" /> AI Liveness Verification Scanner
                </h4>
                <p className="text-[11px] text-slate-400">Match your face with the uploaded ID card photograph.</p>
              </div>

              {selfieCaptured ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Face Match Score: 97%
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulateSelfie}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors"
                >
                  Capture Live Selfie
                </button>
              )}
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={isSubmitting || !fileUploaded}
              className="w-full py-4 rounded-2xl gradient-bg-primary text-white text-sm font-bold uppercase tracking-wider hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Analyzing Documents with AI Neural Scanner...' : 'Submit Verification Documents'}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
