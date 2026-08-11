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
  CheckCircle2,
  UserCheck,
  Zap
} from 'lucide-react';
import { useUserAuthStore, PRECONFIGURED_ACCOUNTS, UserSession } from '@/lib/userAuthStore';
import { OtpModal } from '@/components/auth/OtpModal';
import { GoogleAuthModal } from '@/components/auth/GoogleAuthModal';
import { GoogleUserProfile } from '@/lib/googleAuthService';
import { OtpStore } from '@/lib/otpStore';
import { SmsGatewayService } from '@/lib/smsGatewayService';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserAuthStore();
  const [smsToast, setSmsToast] = useState<{ text: string; code: string } | null>(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const [loginMethod, setLoginMethod] = useState<'EMAIL' | 'PHONE' | 'GOOGLE'>('EMAIL');
  
  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Pending user session awaiting 2FA / OTP verification
  const [pendingUser, setPendingUser] = useState<Partial<UserSession> | null>(null);

  // 2FA modal & OTP states
  const [show2faModal, setShow2faModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick 1-click credential prefill
  const fillDemoAccount = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loginMethod === 'EMAIL') {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanEmail) {
        setError('Email address is required. Please enter your email.');
        return;
      }

      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setError('Invalid email format. Please enter a valid email (e.g. client@sathi.com).');
        return;
      }

      if (!cleanPass) {
        setError('Password is required. Please enter your password.');
        return;
      }

      if (cleanPass.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      // Check against Preconfigured Demo Accounts
      const matchedAccount = PRECONFIGURED_ACCOUNTS.find(a => a.email.toLowerCase() === cleanEmail);

      if (matchedAccount) {
        if (matchedAccount.password !== cleanPass) {
          setError(`Invalid credentials! Incorrect password for ${cleanEmail}.`);
          return;
        }
        setPendingUser({
          id: matchedAccount.id,
          name: matchedAccount.name,
          email: matchedAccount.email,
          role: matchedAccount.role,
          avatar: matchedAccount.avatar
        });
      } else {
        // Generic verified user fallback
        setPendingUser({
          id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
          name: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          role: 'USER'
        });
      }

      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        // Trigger 2FA step
        setShow2faModal(true);
      }, 800);
    }
  };

  const handleSendPhoneOtp = async () => {
    setError(null);
    const digitsOnly = phone.replace(/\D/g, '');

    if (!digitsOnly || digitsOnly.length < 10) {
      setError('Please enter a valid 10-digit mobile phone number to receive OTP.');
      return;
    }

    // 1. Create & Save OTP Record in Database (10 Mins Expiry)
    const record = OtpStore.createOtpRecord(phone);

    // 2. Dispatch SMS via Dove SMS API
    if (record.otpCode) {
      const message = `Your Sathi OTP verification code is ${record.otpCode}. Valid for 10 minutes. Do not share.`;
      await SmsGatewayService.sendSms(phone, message);

      // Trigger Toast notification with OTP code for easy testing
      setSmsToast({
        text: `Dove SMS Dispatched to ${phone}`,
        code: record.otpCode
      });
      setTimeout(() => setSmsToast(null), 8000);
    }

    setPendingUser({
      id: `usr-phone-${digitsOnly.slice(-4)}`,
      name: `User (+91 ${digitsOnly.slice(-4)})`,
      email: `user.${digitsOnly.slice(-4)}@sathi.com`,
      phone: phone,
      role: 'USER'
    });

    setOtpModalOpen(true);
  };

  const handleVerify2fa = () => {
    setTwoFactorError(null);
    const cleanCode = twoFactorCode.replace(/\D/g, '');

    if (!cleanCode || cleanCode.length < 6) {
      setTwoFactorError('Please enter a valid 6-digit 2FA Authenticator code (e.g. 123456).');
      return;
    }

    setShow2faModal(false);
    
    // Complete authentication in userAuthStore
    login(pendingUser || {
      id: 'USR-8821',
      name: email.split('@')[0] || 'Valued Client',
      email: email || 'client@sathi.com',
      role: 'USER'
    });

    router.push('/dashboard');
  };

  const handleGoogleLogin = () => {
    setGoogleModalOpen(true);
  };

  const handleCompleteGoogleAuth = (profile: GoogleUserProfile) => {
    login({
      id: profile.googleId,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      role: 'USER'
    });
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 relative">
      
      {/* Real-time Dove SMS API Banner Toast */}
      {smsToast && (
        <div className="mb-4 p-4 rounded-2xl bg-indigo-600/90 border border-indigo-400 text-white font-sans shadow-2xl animate-bounce flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{smsToast.text}</span>
            </div>
            <p className="text-[11px] text-indigo-150 font-mono">
              Sent via Dove Gateway API. Your OTP Code: <strong className="text-amber-300 text-sm font-black tracking-widest">{smsToast.code}</strong>
            </p>
          </div>
        </div>
      )}

      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-bg-primary flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Log in to Companion Connect</h1>
          <p className="text-xs text-slate-400">Select your preferred login method.</p>
        </div>

        {/* Login Method Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setLoginMethod('EMAIL'); setError(null); }}
            className={`py-2 rounded-xl transition-all ${loginMethod === 'EMAIL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('PHONE'); setError(null); }}
            className={`py-2 rounded-xl transition-all ${loginMethod === 'PHONE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Phone OTP
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('GOOGLE'); setError(null); }}
            className={`py-2 rounded-xl transition-all ${loginMethod === 'GOOGLE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Google
          </button>
        </div>

        {/* Demo Account Prefill Chips */}
        {loginMethod === 'EMAIL' && (
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> Quick Demo Login:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => fillDemoAccount('client@sathi.com', 'password123')}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold truncate text-center"
                title="Client Login"
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('companion@sathi.com', 'password123')}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-300 font-bold truncate text-center"
                title="Companion Login"
              >
                Companion
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@sathi.com', 'admin123')}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300 font-bold truncate text-center"
                title="Admin Login"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <AlertCircle className="w-4 h-4 shrink-0" /> <span>{error}</span>
          </div>
        )}

        {/* EMAIL + PASSWORD FORM */}
        {loginMethod === 'EMAIL' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="client@sathi.com"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 pl-10"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <a href="#" className="text-[10px] text-indigo-400 hover:underline font-bold">Forgot?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 pl-10 pr-10"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
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
              className="w-full py-4 rounded-2xl gradient-bg-primary text-white font-extrabold text-sm hover:opacity-95 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? 'Authenticating Credentials...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* PHONE + OTP LOGIN */}
        {loginMethod === 'PHONE' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Phone Number</label>
              <div className="relative">
                <input 
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 pl-10"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendPhoneOtp}
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
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {isLoading ? 'Connecting to Google OAuth...' : 'Sign in with Google'}
            </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-400">
          Don't have an account? <Link href="/register" className="text-indigo-400 font-bold hover:underline">Register</Link>
        </p>
      </div>

      {/* 2FA MODAL */}
      {show2faModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-sm w-full space-y-5 animate-fade-in text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">2-Factor Authentication Required</h3>
              <p className="text-xs text-slate-400">Enter 6-digit code (Try: <span className="font-mono text-white font-bold">123456</span>).</p>
            </div>

            {twoFactorError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {twoFactorError}
              </div>
            )}

            <input 
              type="text"
              maxLength={6}
              value={twoFactorCode}
              onChange={e => setTwoFactorCode(e.target.value)}
              placeholder="123456"
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
        onVerified={() => {
          login(pendingUser || {
            id: 'usr-phone-verified',
            name: 'Phone User',
            email: 'phone.user@sathi.com',
            role: 'USER'
          });
          router.push('/dashboard');
        }}
      />

      {/* GOOGLE OAUTH 2.0 SINGLE SIGN-ON MODAL */}
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectGoogleAccount={handleCompleteGoogleAuth}
      />

    </div>
  );
}
