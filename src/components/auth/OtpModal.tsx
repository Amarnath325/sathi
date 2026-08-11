'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, X, RefreshCw, CheckCircle2, MessageSquare } from 'lucide-react';
import { OtpStore } from '@/lib/otpStore';
import { SmsGatewayService } from '@/lib/smsGatewayService';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneOrEmail: string;
  type: 'PHONE' | 'EMAIL';
  onVerified: () => void;
}

export function OtpModal({ isOpen, onClose, phoneOrEmail, type, onVerified }: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTimer(30);
      setCanResend(false);
      setOtp(Array(6).fill(''));
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split('');
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleVerify = () => {
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      setIsVerifying(false);
      
      // Perform DB OTP Verification
      const result = OtpStore.verifyOtpCode(phoneOrEmail, fullCode);

      if (!result.success) {
        setError(result.error || 'Verification failed. Incorrect OTP code.');
        return;
      }

      onVerified();
      onClose();
    }, 800);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setError(null);
    setOtp(Array(6).fill(''));

    // Create fresh OTP in DB
    const newRecord = OtpStore.createOtpRecord(phoneOrEmail);

    if (newRecord.otpCode) {
      const msg = `Your Sathi OTP verification code is ${newRecord.otpCode}. Valid for 10 minutes. Do not share.`;
      await SmsGatewayService.sendSms(phoneOrEmail, msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-md w-full relative space-y-6 shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Verify {type === 'PHONE' ? 'Phone Number' : 'Email Address'}</h3>
          <p className="text-xs text-slate-400">
            We sent a 6-digit verification code to <span className="font-bold text-slate-200">{phoneOrEmail}</span>
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={el => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              className="w-10 h-12 sm:w-12 sm:h-14 rounded-2xl bg-slate-950 border border-slate-800 text-center text-lg sm:text-xl font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying || otp.join('').length < 6}
          className="w-full py-3.5 rounded-2xl gradient-bg-primary text-white font-bold text-xs hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          {isVerifying ? 'Verifying Code...' : 'Submit Verification Code'}
        </button>

        <div className="text-center text-xs text-slate-400 pt-2">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-indigo-400 hover:underline font-bold"
            >
              Resend Verification Code
            </button>
          ) : (
            <span>Resend code available in <span className="font-mono font-bold text-white">{timer}s</span></span>
          )}
        </div>

      </div>
    </div>
  );
}
