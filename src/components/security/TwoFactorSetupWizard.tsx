'use client';

import React, { useState } from 'react';
import { ShieldCheck, QrCode, Key, Copy, CheckCircle2, Lock, AlertTriangle, RefreshCw, Smartphone, Mail, Shield } from 'lucide-react';
import { useSecurityControlsStore, TwoFactorMethod } from '@/lib/securityControlsStore';

export function TwoFactorSetupWizard() {
  const { user2FA, initiate2FASetup, verify2FA, disable2FA, regenerateBackupCodes } = useSecurityControlsStore();

  const [method, setMethod] = useState<TwoFactorMethod>('TOTP_AUTHENTICATOR');
  const [verificationCode, setVerificationCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartSetup = (m: TwoFactorMethod) => {
    setMethod(m);
    initiate2FASetup(m);
    setVerifySuccess(null);
    setErrorMessage('');
  };

  const handleCopySecret = () => {
    if (user2FA.secret) {
      navigator.clipboard.writeText(user2FA.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 3000);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = verify2FA(verificationCode);
    setVerifySuccess(res);

    if (!res) {
      setErrorMessage('Invalid 6-digit code or backup code. Try code "123456" for demo.');
    } else {
      setVerificationCode('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 2FA Adoption & Active Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">Two-Factor Authentication (2FA) Status</h3>
                {user2FA.isEnabled ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    PROTECTED (ACTIVE)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    UNPROTECTED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Primary Method: <span className="font-mono text-indigo-300">{user2FA.method}</span>
              </p>
            </div>
          </div>

          {user2FA.isEnabled ? (
            <button
              onClick={disable2FA}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
            >
              Disable 2FA Protection
            </button>
          ) : (
            <button
              onClick={() => handleStartSetup('TOTP_AUTHENTICATOR')}
              className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-extrabold shadow-lg hover:opacity-90"
            >
              Set Up 2FA Authenticator
            </button>
          )}
        </div>
      </div>

      {/* 2FA Method Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            id: 'TOTP_AUTHENTICATOR',
            title: 'Authenticator App',
            sub: 'Google Authenticator, Authy, 1Password',
            icon: <Smartphone className="w-5 h-5 text-indigo-400" />,
          },
          {
            id: 'SMS_OTP',
            title: 'SMS Carrier OTP',
            sub: 'Twilio SMS text message verification',
            icon: <Mail className="w-5 h-5 text-emerald-400" />,
          },
          {
            id: 'EMAIL_MAGIC_CODE',
            title: 'Email Security Code',
            sub: '6-digit OTP dispatched to work email',
            icon: <Mail className="w-5 h-5 text-cyan-400" />,
          },
          {
            id: 'HARDWARE_KEY',
            title: 'Hardware Security Key',
            sub: 'FIDO2 / YubiKey physical key',
            icon: <Key className="w-5 h-5 text-purple-400" />,
          },
        ].map((item) => {
          const isCurrent = user2FA.method === item.id && user2FA.isEnabled;
          return (
            <div
              key={item.id}
              onClick={() => handleStartSetup(item.id as TwoFactorMethod)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-2 ${
                isCurrent
                  ? 'bg-indigo-950/30 border-indigo-500 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                {item.icon}
                {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <h4 className="text-xs font-bold text-white">{item.title}</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">{item.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Setup Wizard & QR Code Generator */}
      {user2FA.secret && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          {/* QR Code Column */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-400" /> Scan QR Code with Authenticator
            </h4>
            <p className="text-xs text-slate-400">
              Open your Google Authenticator or Authy app, tap (+) and scan this barcode:
            </p>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl border border-slate-200">
              {user2FA.qrCodeUrl ? (
                <img src={user2FA.qrCodeUrl} alt="2FA QR Code" className="w-44 h-44 object-contain mx-auto" />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-slate-800 text-xs font-mono">
                  Loading QR...
                </div>
              )}
            </div>

            {/* Secret key fallback */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block">CAN'T SCAN? ENTER SECRET KEY MANUALLY</span>
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <code className="text-xs font-mono text-emerald-400 font-extrabold flex-1 truncate">
                  {user2FA.secret}
                </code>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedSecret ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Verification Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> Verify 6-Digit TOTP Token
            </h4>
            <p className="text-xs text-slate-400">
              Enter the 6-digit verification code generated by your authenticator app to activate 2FA protection:
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-3">
              <input
                type="text"
                maxLength={8}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code e.g. 123456"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-center text-lg font-mono font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 tracking-widest"
              />

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {errorMessage}
                </div>
              )}

              {verifySuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> 2FA Authenticator verified & activated successfully!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl gradient-bg-primary text-white text-xs font-extrabold hover:opacity-90 shadow-lg"
              >
                Verify & Enable 2FA
              </button>
            </form>

            {/* Emergency Backup Codes */}
            {user2FA.backupCodes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" /> Emergency Backup Codes ({user2FA.backupCodes.length})
                  </span>
                  <button
                    onClick={regenerateBackupCodes}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  {user2FA.backupCodes.map((code, idx) => (
                    <div key={idx} className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
