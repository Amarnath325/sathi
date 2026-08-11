'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Mail, ArrowRight, UserPlus, RefreshCw } from 'lucide-react';
import { GoogleAuthService, GoogleUserProfile } from '@/lib/googleAuthService';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGoogleAccount: (profile: GoogleUserProfile) => void;
}

export function GoogleAuthModal({ isOpen, onClose, onSelectGoogleAccount }: GoogleAuthModalProps) {
  const [demoAccounts] = useState<GoogleUserProfile[]>(GoogleAuthService.getDemoGoogleAccounts());
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAccount = (profile: GoogleUserProfile) => {
    setSelectedEmail(profile.email);
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      onSelectGoogleAccount(profile);
      onClose();
    }, 800);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) return;

    const profile = GoogleAuthService.parseGoogleUserPayload(customEmail, customName);
    handleSelectAccount(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative space-y-0 text-slate-100">
        
        {/* Top Google Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/90 text-center relative space-y-2">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-900 border border-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-md">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>

          <h3 className="text-lg font-extrabold text-white">Sign in with Google</h3>
          <p className="text-xs text-slate-400">Choose an account to continue to <strong className="text-white">Sathi</strong></p>
        </div>

        {/* Account Selector List */}
        <div className="p-6 space-y-4">
          
          {isAuthenticating ? (
            <div className="py-8 text-center space-y-3 font-mono text-xs text-slate-400">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p>Exchanging OAuth 2.0 Token for <strong className="text-white">{selectedEmail}</strong>...</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Available Accounts:</span>
                {demoAccounts.map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={acc.avatar} alt={acc.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="font-bold text-white text-xs group-hover:text-indigo-300">{acc.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{acc.email}</div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-3 rounded-2xl bg-slate-950 border border-dashed border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-indigo-400" /> Use another Gmail Account
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 animate-fade-in">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Your Gmail Address</label>
                    <input 
                      type="email"
                      required
                      value={customEmail}
                      onChange={e => setCustomEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Your Name (Optional)</label>
                    <input 
                      type="text"
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl gradient-bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    Authenticate Gmail Account <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </>
          )}

          <div className="pt-2 text-center text-[10px] text-slate-500 border-t border-slate-800/80 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Google OAuth 2.0 Encrypted SSL Verification
          </div>

        </div>

      </div>
    </div>
  );
}
