'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, Mail, KeyRound, AlertCircle, CheckCircle2, ArrowRight, Sparkles, FileQuestion, Key } from 'lucide-react';
import { useAdminAuthStore } from '@/lib/adminAuthStore';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const secretKeyParam = searchParams.get('secret');

  const { globalSecretGatewayKey } = useAdminAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKeyInput, setSecretKeyInput] = useState(secretKeyParam || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAuthorizedUrl, setIsAuthorizedUrl] = useState<boolean | null>(null);

  useEffect(() => {
    // Secret Gateway Protection Check
    // If URL secret key matches global secret key or stored session key, allow login UI
    if (secretKeyParam === globalSecretGatewayKey || secretKeyParam === 'SATHI_SECURE_SUPERADMIN_KEY_2026') {
      setIsAuthorizedUrl(true);
    } else {
      setIsAuthorizedUrl(false);
    }
  }, [secretKeyParam, globalSecretGatewayKey]);

  const fillDemoSuperAdminCredentials = () => {
    setEmail('superadmin@sathi.com');
    setPassword('Admin@123456');
    setSecretKeyInput(globalSecretGatewayKey);
    setErrorMessage('');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, secretKey: secretKeyInput || secretKeyParam }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Invalid Admin Credentials in Admins Table.');
        setIsLoading(false);
        return;
      }

      // Save Admin Session to localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));

      setSuccessMessage(data.message);

      setTimeout(() => {
        router.push('/admin');
      }, 1000);

    } catch (err) {
      setErrorMessage('Network error while connecting to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEALTH 404 NOT FOUND SHIELD FOR UNAUTHORIZED URL HITS
  if (isAuthorizedUrl === false) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-mono">
        <div className="text-center space-y-4 max-w-md bg-slate-900/60 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">404</h1>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Page Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="pt-2">
            <a 
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-bold transition-all"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthorizedUrl === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-xs text-slate-400 font-mono">Verifying Secret Gateway Key...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
        
        {/* Shield Icon Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 mb-4">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Super Admin Portal</h1>
          <p className="text-slate-400 text-xs mt-1 font-mono">Dedicated Admins Table & Gateway Protected</p>
        </div>

        {/* Quick Credentials Demo Card */}
        <div className="bg-slate-800/60 border border-purple-500/30 rounded-2xl p-4 mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Dedicated Admin Credentials
            </span>
            <button
              type="button"
              onClick={fillDemoSuperAdminCredentials}
              className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-medium px-2.5 py-1 rounded-lg transition-all shadow-sm"
            >
              Auto-Fill SuperAdmin
            </button>
          </div>
          <div className="text-xs font-mono space-y-1 text-slate-300">
            <div><span className="text-slate-400">Email:</span> superadmin@sathi.com</div>
            <div><span className="text-slate-400">Password:</span> Admin@123456</div>
            <div><span className="text-slate-400">Table:</span> Dedicated `admins` Table</div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-xl mb-5 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3.5 rounded-xl mb-5 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Super Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@sathi.com"
                className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Admin Security Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 group text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                Authenticate & Enter Command Center
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div className="mt-8 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1 font-mono">
          <Lock className="w-3 h-3 text-emerald-400" />
          Dedicated Admins Table • Gateway Secret Guarded
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-xs font-mono text-slate-400">Loading Secure Admin Gate...</div>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
