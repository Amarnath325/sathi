'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAInput, setTwoFAInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Simulate 2FA challenge trigger for enterprise security
      if (!show2FA && email.includes('admin')) {
        setShow2FA(true);
      } else {
        // Redirect to dashboard or landing page
        router.push('/');
      }
    }, 1200);
  };

  const handleSendOTP = () => {
    if (!phone) {
      setError('Please enter a valid mobile number');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Secure Sign In</h1>
          <p className="text-xs text-slate-400">Access your Companion Connect account & active bookings</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 2FA Challenge View */}
        {show2FA ? (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <KeyRound className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Two-Factor Security Verification</h3>
              <p className="text-xs text-slate-400">Enter the 6-digit authentication code from your authenticator app.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">2FA Security Code</label>
              <input 
                type="text" 
                maxLength={6}
                value={twoFAInput}
                onChange={(e) => setTwoFAInput(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl gradient-bg-primary text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying Code...' : 'Verify & Continue'} <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              type="button" 
              onClick={() => setShow2FA(false)}
              className="w-full text-xs text-slate-400 hover:text-white transition-colors text-center block"
            >
              ← Back to standard login
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            
            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold">
              <button 
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${loginMethod === 'password' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Mail className="w-3.5 h-3.5" /> Password
              </button>
              <button 
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${loginMethod === 'otp' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Smartphone className="w-3.5 h-3.5" /> OTP Login
              </button>
            </div>

            {/* Password Login Form */}
            {loginMethod === 'password' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.companion@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <a href="#" className="text-[11px] text-indigo-400 hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
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

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 rounded-2xl gradient-bg-primary text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* OTP Login Form */
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Mobile Phone Number</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {otpSent ? (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">6-Digit One Time Password</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button 
                      onClick={handleLoginSubmit}
                      disabled={isLoading || otpCode.length < 6}
                      className="w-full mt-4 py-3.5 rounded-2xl gradient-bg-primary text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Verifying OTP...' : 'Verify OTP & Login'}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Sending SMS...' : 'Send Login OTP via SMS'}
                  </button>
                )}
              </div>
            )}

            {/* Social Google Login Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-wider"><span className="bg-slate-950 px-3 text-slate-500">Or continue with</span></div>
            </div>

            <button 
              type="button" 
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs hover:text-white hover:border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
              Google Account Single Sign-On
            </button>

            {/* Footer Sign Up Link */}
            <div className="pt-4 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
                  Register as User or Companion
                </Link>
              </p>
            </div>

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              256-Bit SSL Encrypted & Bank-Grade Security
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
