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
  EyeOff
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'CUSTOMER' | 'VERIFIED_COMPANION'>('CUSTOMER');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
      if (role === 'VERIFIED_COMPANION') {
        router.push('/kyc');
      } else {
        router.push('/search');
      }
    }, 1200);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-xl w-full glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Join Companion Connect Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create Your Account</h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Register as a client looking for assistance or apply to become a certified companion.</p>
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
            {isLoading ? 'Creating Account...' : (role === 'VERIFIED_COMPANION' ? 'Proceed to KYC Verification' : 'Create Client Account')} <ArrowRight className="w-4 h-4" />
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
