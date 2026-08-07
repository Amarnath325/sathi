'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useUserAuthStore } from '@/lib/userAuthStore';
import { OtpModal } from '@/components/auth/OtpModal';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserAuthStore();

  const [loginMethod, setLoginMethod] = useState<'EMAIL' | 'PHONE' | 'GOOGLE'>('EMAIL');
  
  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2FA modal & OTP states
  const [show2faModal, setShow2faModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loginMethod === 'EMAIL' && (!email || !password)) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Trigger 2FA
      setShow2faModal(true);
    }, 1000);
  };

  const handleVerify2fa = () => {
    setShow2faModal(false);
    login({
      id: 'USR-8821',
      name: 'Aria Vance',
      email: email || 'aria@companionconnect.com',
      role: 'USER'
    });
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-bg-primary flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Log in to Companion Connect</h1>
          <p className="text-xs text-slate-400">Select your preferred login method.</p>
        </div>

        {/* Login Method Tabs (Section 17) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setLoginMethod('EMAIL')}
            className={`py-2 rounded-xl transition-all ${loginMethod === 'EMAIL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('PHONE')}
            className={`py-2 rounded-xl transition-all ${loginMethod === 'PHONE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Phone OTP
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('GOOGLE')}
            className={`py-2 rounded-xl transition-all ${loginMethod === 'GOOGLE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Google
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* EMAIL + PASSWORD FORM */}
        {loginMethod === 'EMAIL' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <a href="#" className="text-[10px] text-indigo-400 hover:underline font-bold">Forgot?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm hover:opacity-95 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* PHONE + OTP LOGIN */}
        {loginMethod === 'PHONE' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Phone Number</label>
              <input 
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setOtpModalOpen(true)}
              className="w-full py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm hover:opacity-95 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Send OTP Code <Phone className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* GOOGLE LOGIN */}
        {loginMethod === 'GOOGLE' && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-slate-400">OAuth 2.0 Secure Single Sign-On</p>
            <button
              type="button"
              onClick={() => handleVerify2fa()}
              className="w-full py-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-400">
          Don't have an account? <Link href="/register" className="text-indigo-400 font-bold hover:underline">Register</Link>
        </p>
      </div>

      {/* 2FA MODAL (Section 19) */}
      {show2faModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-sm w-full space-y-5 animate-fade-in text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">2-Factor Authentication Required</h3>
              <p className="text-xs text-slate-400">Enter code from your Authenticator app.</p>
            </div>

            <input 
              type="text"
              value={twoFactorCode}
              onChange={e => setTwoFactorCode(e.target.value)}
              placeholder="123 456"
              className="w-full text-center px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-lg font-mono tracking-widest text-white focus:outline-none focus:border-indigo-500"
            />

            <div className="space-y-2">
              <button
                onClick={handleVerify2fa}
                className="w-full py-3 rounded-2xl gradient-bg-primary text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
              >
                Verify & Continue
              </button>

              <button
                onClick={() => setShow2faModal(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP MODAL FOR PHONE LOGIN */}
      <OtpModal 
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        phoneOrEmail={phone || '+91 9876543210'}
        type="PHONE"
        onVerified={handleVerify2fa}
      />

    </div>
  );
}
