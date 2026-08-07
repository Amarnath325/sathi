'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  User, 
  UserCheck, 
  Mail, 
  Lock, 
  Phone, 
  Globe, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  FileCheck,
  Wallet,
  ChevronDown,
  ChevronUp,
  Building,
  CreditCard,
  UploadCloud
} from 'lucide-react';
import { useUserAuthStore } from '@/lib/userAuthStore';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useUserAuthStore();
  const [role, setRole] = useState<'CUSTOMER' | 'VERIFIED_COMPANION'>('CUSTOMER');
  
  // Account Mandatory Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Optional Accordion / Section Toggles
  const [showOptionalSections, setShowOptionalSections] = useState(false);

  // Optional KYC Verification State
  const [docType, setDocType] = useState<string>('NATIONAL_ID');
  const [idNumber, setIdNumber] = useState<string>('');
  const [docFileUploaded, setDocFileUploaded] = useState<boolean>(false);

  // Optional Wallet Setup State
  const [initialDeposit, setInitialDeposit] = useState<string>('50');
  const [payoutMethod, setPayoutMethod] = useState<string>('BANK_TRANSFER');
  const [accountNumber, setAccountNumber] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service & Safety Guidelines to proceed.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      // Save session in auth store
      login({
        name: fullName || 'Alex Mercer',
        email: email || 'alex@example.com',
        phone: phone || '+1 (555) 019-2834',
        role: role === 'VERIFIED_COMPANION' ? 'VERIFIED_COMPANION' : 'USER',
      });

      // Redirect to user dashboard
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-2xl w-full glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Join Companion Connect Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create Your Account</h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Register as a client looking for assistance or apply to become a certified companion.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection Selector */}
        <div className="mb-8">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3 text-center">I want to join as</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div 
              onClick={() => setRole('CUSTOMER')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${role === 'CUSTOMER' ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                {role === 'CUSTOMER' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Client / Member</h3>
                <p className="text-[11px] text-slate-400 mt-1">Book companions for events, travel, study, elderly assistance & shopping.</p>
              </div>
            </div>

            <div 
              onClick={() => setRole('VERIFIED_COMPANION')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${role === 'VERIFIED_COMPANION' ? 'bg-emerald-600/20 border-emerald-500 shadow-lg shadow-emerald-600/20' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                {role === 'VERIFIED_COMPANION' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Verified Companion</h3>
                <p className="text-[11px] text-slate-400 mt-1">Offer verified non-sexual companionship, set hourly rates & earn securely.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Optional KYC Verification & Wallet Setup Section */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowOptionalSections(!showOptionalSections)}
              className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-left hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">KYC Verification & Wallet Setup</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono font-bold">OPTIONAL</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Add ID documents or wallet payout details now or skip and fill later in profile.</p>
                </div>
              </div>
              {showOptionalSections ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showOptionalSections && (
              <div className="mt-3 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 animate-fadeIn">
                
                {/* Optional KYC Upload */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white">KYC Identity Document (Optional)</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Document Type</label>
                      <select 
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="NATIONAL_ID">National Passport / ID Card</option>
                        <option value="DRIVING_LICENSE">Driving License</option>
                        <option value="TAX_CARD">Government SSN / Tax Card</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Government ID Number</label>
                      <input 
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="e.g. A92839201"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div 
                    onClick={() => setDocFileUploaded(true)}
                    className={`p-3 rounded-xl border border-dashed text-center cursor-pointer transition-all ${docFileUploaded ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <UploadCloud className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
                    <span className="text-xs font-semibold block">
                      {docFileUploaded ? '✓ Document Front & Back Uploaded' : 'Click to Upload Document Photo / Scan'}
                    </span>
                  </div>
                </div>

                {/* Optional Wallet Setup */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-white">Wallet & Bank Payout Details (Optional)</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Preferred Payout Method</label>
                      <select 
                        value={payoutMethod}
                        onChange={(e) => setPayoutMethod(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="BANK_TRANSFER">Direct Bank Wire / ACH</option>
                        <option value="UPI">UPI / Instant Mobile Wallet</option>
                        <option value="CARD">Credit / Debit Card</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Account / IBAN / UPI ID</label>
                      <input 
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="e.g. alex@upi or US829103910"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Terms & Zero Tolerance Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input 
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400 leading-relaxed">
                I agree to the <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>, <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>, and confirm that I understand Companion Connect maintains a strict zero-tolerance policy against illegal, exploitative, or unsafe activities.
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 py-3.5 rounded-2xl gradient-bg-primary text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Creating Account...' : 'Complete Account Registration'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
