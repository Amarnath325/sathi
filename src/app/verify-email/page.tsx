'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, RefreshCw, ArrowRight, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function VerifyEmailPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('user@example.com');
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResendLink = () => {
    if (cooldown > 0) return;
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCooldown(60);
      showToast('success', 'Verification Link Resent', `A new email verification link was sent to ${email}`);
    }, 1000);
  };

  const handleSimulateVerify = () => {
    setIsVerified(true);
    showToast('success', 'Email Verified ✓', 'Your email address has been successfully verified.');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      
      {!isVerified ? (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-xl">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white">Verify your email</h1>
            <p className="text-xs text-slate-400">
              We sent a verification link to <span className="font-mono text-indigo-300 font-bold">{email}</span>.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <a 
              href="mailto:"
              target="_blank"
              rel="noreferrer"
              className="w-full block py-3.5 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 hover:opacity-95"
            >
              Open Email App
            </a>

            <button
              onClick={handleSimulateVerify}
              className="w-full py-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all"
            >
              Simulate Instant Email Verification ✓
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
            <p>Didn't receive it?</p>
            <button
              onClick={handleResendLink}
              disabled={cooldown > 0 || isResending}
              className="font-bold text-indigo-400 hover:underline disabled:opacity-40 flex items-center gap-1.5 mx-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              {cooldown > 0 ? `Resend link in ${cooldown}s` : 'Resend Verification Email'}
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white">Email Verified ✓</h1>
            <p className="text-xs text-slate-400">Your email address is confirmed. You can now explore Companion Connect.</p>
          </div>

          <Link
            href="/search"
            className="w-full block py-3.5 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30"
          >
            Explore Companion Marketplace <ArrowRight className="w-4 h-4 inline-block ml-1" />
          </Link>
        </div>
      )}

    </div>
  );
}
