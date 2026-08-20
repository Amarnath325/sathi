'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Server, 
  Key, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Sliders, 
  Globe, 
  Lock,
  Database,
  Radio,
  FileCode,
  Check
} from 'lucide-react';
import { useEmailConfigStore, SmtpSettings } from '@/lib/emailConfigStore';
import { decryptCredential, encryptCredential } from '@/lib/cryptoUtils';

export function SmtpConfigModule() {
  const { smtpSettings, updateSmtpSettings, verifySmtpConnection } = useEmailConfigStore();

  const [formData, setFormData] = useState<SmtpSettings>(() => ({
    ...smtpSettings,
    password: decryptCredential(smtpSettings.password)
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncingApi, setIsSyncingApi] = useState(false);
  const [dbSource, setDbSource] = useState<string>('NEON_POSTGRES_DB');

  // Fetch decrypted settings from Live DB API on mount
  React.useEffect(() => {
    async function loadSmtpFromApi() {
      try {
        const res = await fetch('/api/admin/smtp');
        const data = await res.json();
        if (data.success && data.settings) {
          if (data.source) setDbSource(data.source);
          setFormData(prev => ({
            ...prev,
            ...data.settings,
            password: data.settings.password // Plaintext decrypted value
          }));
        }
      } catch (err) {
        console.error('SMTP API Fetch Error:', err);
      }
    }
    loadSmtpFromApi();
  }, []);

  // Test Email Modal State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState('admin@sathi.com');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; exceptionCode?: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncingApi(true);

    try {
      // 1. Sync & Encrypt in Backend API / Live DB
      const apiRes = await fetch('/api/admin/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      await apiRes.json();

      // 2. Encrypt & Save in Client Store
      updateSmtpSettings({
        ...formData,
        password: formData.password // Will be encrypted inside updateSmtpSettings
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSyncingApi(false);
    }
  };

  const handleRunTestEmail = async () => {
    if (!testEmailInput || !testEmailInput.includes('@')) return;
    setIsTesting(true);
    setTestResult(null);

    const result = await verifySmtpConnection(testEmailInput);

    setIsTesting(false);
    setTestResult(result);
  };

  const driverOptions: { key: SmtpSettings['driver']; label: string; desc: string; defaultHost: string; defaultPort: number }[] = [
    { key: 'SMTP', label: 'Custom SMTP', desc: 'Connect private SMTP server', defaultHost: 'mail.yourdomain.com', defaultPort: 587 },
    { key: 'GMAIL', label: 'Gmail SMTP', desc: 'smtp.gmail.com (TLS/App Key)', defaultHost: 'smtp.gmail.com', defaultPort: 587 },
    { key: 'SENDGRID', label: 'Twilio SendGrid', desc: 'smtp.sendgrid.net (API Key)', defaultHost: 'smtp.sendgrid.net', defaultPort: 587 },
    { key: 'AWS_SES', label: 'Amazon SES', desc: 'email-smtp.us-east-1.aws.com', defaultHost: 'email-smtp.us-east-1.amazonaws.com', defaultPort: 587 },
    { key: 'MAILGUN', label: 'Mailgun', desc: 'smtp.mailgun.org (Domain Key)', defaultHost: 'smtp.mailgun.org', defaultPort: 587 },
    { key: 'POSTMARK', label: 'Postmark', desc: 'smtp.postmarkapp.com (Token)', defaultHost: 'smtp.postmarkapp.com', defaultPort: 587 }
  ];

  const handleSelectDriver = (driverKey: SmtpSettings['driver']) => {
    const selected = driverOptions.find(d => d.key === driverKey);
    setFormData(prev => ({
      ...prev,
      driver: driverKey,
      host: selected ? selected.defaultHost : prev.host,
      port: selected ? selected.defaultPort : prev.port
    }));
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-4 sm:space-y-6 xl:space-y-8 bg-[#f8fafc] p-2 sm:p-4 lg:p-6 xl:p-8 rounded-2xl sm:rounded-3xl min-h-screen">
      
      {/* 1. Header Vault Banner Card — Tailored for Laptop (lg) vs Large Desktop (xl/2xl) */}
      <div className="bg-white p-4 sm:p-6 lg:p-7 xl:p-9 2xl:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 lg:gap-6">
          
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-13 lg:h-13 xl:w-14 xl:h-14 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0 mt-0.5 sm:mt-0">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 flex-wrap">
                <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-extrabold text-slate-800 tracking-tight">
                  SMTP Gateway & Credentials Vault
                </h2>
                <span className="text-[9px] sm:text-[10px] xl:text-xs font-mono font-bold uppercase px-2 py-0.5 sm:px-2.5 xl:px-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {smtpSettings.isVerified ? '✓ VERIFIED ACTIVE' : 'UNVERIFIED'}
                </span>
                <span className="text-[9px] sm:text-[10px] xl:text-xs font-mono font-bold uppercase px-2 py-0.5 sm:px-2.5 xl:px-3 rounded-full bg-purple-50 text-purple-600 border border-purple-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-500" /> AES-256 VAULT ENCRYPTED
                </span>
                <span className="text-[9px] sm:text-[10px] xl:text-xs font-mono font-bold uppercase px-2 py-0.5 sm:px-2.5 xl:px-3 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                  <Database className="w-3 h-3 text-slate-500" /> NEON POSTGRESQL DB
                </span>
              </div>
              <p className="text-[11px] sm:text-xs lg:text-xs xl:text-sm text-slate-500 font-medium leading-relaxed max-w-4xl">
                All third-party credentials are encrypted with AES-256 in the database and decrypted in-memory for API dispatch.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex items-center justify-end shrink-0 pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => { setTestModalOpen(true); setTestResult(null); }}
              className="w-full md:w-auto px-4 py-2.5 sm:py-3 lg:px-5 lg:py-3 xl:px-6 xl:py-3.5 rounded-xl xl:rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/80 text-xs lg:text-xs xl:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
            >
              <Send className="w-4 h-4 xl:w-5 xl:h-5 text-indigo-600" /> Send Test Email
            </button>
          </div>
        </div>

        {isSaved && (
          <div className="p-3 sm:p-4 xl:p-5 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs xl:text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-4 h-4 xl:w-5 xl:h-5 shrink-0 text-emerald-600" /> Credentials Encrypted with AES-256 & Updated Live in Neon PostgreSQL Database!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4 sm:space-y-6 xl:space-y-8">
        
        {/* 2. Mail Driver Selection Grid — Laptop: 3 cols | Desktop: 6 cols */}
        <div className="space-y-2.5 sm:space-y-3 xl:space-y-4">
          <label className="text-[11px] sm:text-xs xl:text-sm font-mono font-bold text-indigo-600 uppercase tracking-wider block px-1">
            1. SELECT MAIL DRIVER / PROVIDER
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3.5 xl:gap-4.5">
            {driverOptions.map(drv => {
              const isSelected = formData.driver === drv.key;
              return (
                <button
                  key={drv.key}
                  type="button"
                  onClick={() => handleSelectDriver(drv.key)}
                  className={`p-3 sm:p-4 lg:p-4 xl:p-5 rounded-xl sm:rounded-2xl xl:rounded-3xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-indigo-50/70 border-2 border-indigo-500 text-slate-900 shadow-md shadow-indigo-100 relative' 
                      : 'bg-white border-slate-200/80 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2 xl:mb-3">
                    <Server className={`w-3.5 h-3.5 sm:w-4 sm:h-4 xl:w-5 xl:h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {isSelected && (
                      <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 xl:w-3.5 xl:h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className={`font-bold text-[11px] sm:text-xs xl:text-sm ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{drv.label}</div>
                  <div className="text-[9px] sm:text-[10px] xl:text-xs text-slate-400 truncate font-medium mt-0.5">{drv.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Server & Connection Credentials Card — Laptop: 3 cols | Desktop: 3 spacious cols */}
        <div className="bg-white p-4 sm:p-6 lg:p-7 xl:p-9 2xl:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm space-y-4 sm:space-y-6 xl:space-y-8">
          <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 xl:pb-4">
            <Sliders className="w-4 h-4 xl:w-5 xl:h-5 text-indigo-600" /> 2. Server & Authentication Credentials
          </h3>

          {/* Row 1: Host, Port, Protocol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 xl:gap-6">
            <div>
              <label className="text-[11px] sm:text-xs xl:text-sm font-bold text-slate-700 block mb-1.5 xl:mb-2">SMTP Host</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={formData.host}
                  onChange={e => setFormData({ ...formData, host: e.target.value })}
                  placeholder="smtp-relay.brevo.com"
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 xl:px-4.5 xl:py-3.5 rounded-xl xl:rounded-2xl bg-slate-50/60 border border-slate-200 text-xs sm:text-sm xl:text-base text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white pl-10 xl:pl-12 transition-all"
                />
                <Globe className="w-4 h-4 xl:w-5 xl:h-5 text-slate-400 absolute left-3.5 xl:left-4 top-3 sm:top-3.5 xl:top-4" />
              </div>
            </div>

            <div>
              <label className="text-[11px] sm:text-xs xl:text-sm font-bold text-slate-700 block mb-1.5 xl:mb-2">SMTP Port</label>
              <input 
                type="number"
                required
                value={formData.port}
                onChange={e => setFormData({ ...formData, port: parseInt(e.target.value) || 587 })}
                placeholder="587"
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 xl:px-4.5 xl:py-3.5 rounded-xl xl:rounded-2xl bg-slate-50/60 border border-slate-200 text-xs sm:text-sm xl:text-base text-slate-900 font-mono font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-[11px] sm:text-xs xl:text-sm font-bold text-slate-700 block mb-1.5 xl:mb-2">Encryption Protocol</label>
              <select
                value={formData.encryption}
                onChange={e => setFormData({ ...formData, encryption: e.target.value as any })}
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 xl:px-4.5 xl:py-3.5 rounded-xl xl:rounded-2xl bg-slate-50/60 border border-slate-200 text-xs sm:text-sm xl:text-base text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              >
                <option value="TLS">TLS (Recommended - Port 587)</option>
                <option value="SSL">SSL (Secure - Port 465)</option>
                <option value="NONE">None (Unencrypted - Port 25)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Username & Password */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5 xl:gap-6">
            <div>
              <label className="text-[11px] sm:text-xs xl:text-sm font-bold text-slate-700 block mb-1.5 xl:mb-2">SMTP Username / Email</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  placeholder="b57a23001@smtp-brevo.com"
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 xl:px-4.5 xl:py-3.5 rounded-xl xl:rounded-2xl bg-slate-50/60 border border-slate-200 text-xs sm:text-sm xl:text-base text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white pl-10 xl:pl-12 transition-all"
                />
                <Key className="w-4 h-4 xl:w-5 xl:h-5 text-slate-400 absolute left-3.5 xl:left-4 top-3 sm:top-3.5 xl:top-4" />
              </div>
            </div>

            <div>
              <label className="text-[11px] sm:text-xs xl:text-sm font-bold text-slate-700 block mb-1.5 xl:mb-2 flex items-center justify-between">
                <span>SMTP Password / App Secret</span>
                <span className="text-[9px] sm:text-[10px] xl:text-xs text-purple-600 font-mono flex items-center gap-1 font-bold">
                  <Lock className="w-3 h-3" /> AES-256 Protected
                </span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••••••••••••••••••••••"
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 xl:px-4.5 xl:py-3.5 rounded-xl xl:rounded-2xl bg-slate-50/60 border border-slate-200 text-xs sm:text-sm xl:text-base text-slate-900 font-mono font-medium focus:outline-none focus:border-indigo-500 focus:bg-white pl-10 xl:pl-12 pr-10 xl:pr-12 transition-all"
                />
                <Lock className="w-4 h-4 xl:w-5 xl:h-5 text-purple-500 absolute left-3.5 xl:left-4 top-3 sm:top-3.5 xl:top-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 xl:right-4 top-3 sm:top-3.5 xl:top-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 xl:w-5 xl:h-5 text-indigo-600" /> : <Eye className="w-4 h-4 xl:w-5 xl:h-5" />}
                </button>
              </div>

              {/* Cryptographic Encryption Status Box */}
              <div className="mt-3 p-3 sm:p-3.5 xl:p-4 rounded-xl sm:rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs xl:text-sm space-y-2 font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-purple-700 font-bold">
                  <span className="flex items-center gap-1.5 text-[11px] sm:text-xs xl:text-sm">
                    <Lock className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-purple-600 shrink-0" /> Stored in DB (AES-256 Encrypted):
                  </span>
                  <span className="text-[9px] sm:text-[10px] xl:text-xs text-emerald-600 font-sans font-bold">
                    {isSyncingApi ? 'Encrypting & Writing...' : '✓ Auto-Encrypted'}
                  </span>
                </div>
                <div className="text-slate-600 truncate bg-white px-3 py-2 xl:px-4 xl:py-2.5 rounded-lg sm:rounded-xl border border-indigo-200/70 text-[9px] sm:text-[10px] xl:text-xs select-all shadow-inner font-mono overflow-x-auto">
                  {encryptCredential(formData.password)}
                </div>
                <div className="text-slate-500 font-sans text-[9px] sm:text-[10px] xl:text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-medium">
                  <span><strong className="text-indigo-600 font-bold">On Fetch:</strong> Decrypted to actual value in UI & API</span>
                  <span className="text-amber-600 font-mono text-[9px] sm:text-[10px] font-bold">Zero Plaintext in DB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Sender Header Profile Card */}
        <div className="bg-white p-4 sm:p-6 lg:p-7 xl:p-9 2xl:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm space-y-4 sm:space-y-6 xl:space-y-8">
          <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 xl:pb-4">
            <Radio className="w-4 h-4 xl:w-5 xl:h-5 text-indigo-600" /> 3. Sender Header Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5 xl:gap-6">
            <div>
              <label className="text-[11px] sm:text-xs xl:text-sm font-bold text-slate-700 block mb-1.5 xl:mb-2">From Sender Name</label>
              <input 
                type="text"
                required
                value={formData.fromName}
                onChange={e => setFormData({ ...formData, fromName: e.target.value })}
                placeholder="Sathi Companion Connect"
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 xl:px-4.5 xl:py-3.5 rounded-xl xl:rounded-2xl bg-slate-50/60 border border-slate-200 text-xs sm:text-sm xl:text-base text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] sm:text-xs xl:text-sm font-bold text-slate-700 block mb-1.5 xl:mb-2">From Sender Email</label>
              <input 
                type="email"
                required
                value={formData.fromEmail}
                onChange={e => setFormData({ ...formData, fromEmail: e.target.value })}
                placeholder="no-reply@sathi-connect.com"
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 xl:px-4.5 xl:py-3.5 rounded-xl xl:rounded-2xl bg-slate-50/60 border border-slate-200 text-xs sm:text-sm xl:text-base text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 sm:py-3.5 xl:px-8 xl:py-4 rounded-xl xl:rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm xl:text-base shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6" /> Encrypt & Save Credentials
          </button>
        </div>

      </form>

      {/* 5. TEST EMAIL MODAL */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-md lg:max-w-lg w-full p-4 sm:p-6 xl:p-8 space-y-4 sm:space-y-5 shadow-2xl animate-fade-in text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base xl:text-lg">Send Test Email Verification</h3>
              </div>
              <button 
                onClick={() => setTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] sm:text-xs xl:text-sm text-slate-500 font-medium leading-relaxed">
              Decrypts AES-256 credentials in-memory and dispatches payload via <strong className="text-slate-800">{formData.host}:{formData.port}</strong>.
            </p>

            {testResult && (
              <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs xl:text-sm space-y-2 font-mono ${
                testResult.success 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                <div className="flex items-start gap-2 font-sans font-bold">
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{testResult.message}</span>
                </div>
                {testResult.exceptionCode && (
                  <div className="text-[10px] xl:text-xs text-rose-700 bg-rose-100/60 p-2 rounded-lg border border-rose-200 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-rose-600" />
                    <span>Exception Code: <strong>{testResult.exceptionCode}</strong></span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-[11px] sm:text-xs xl:text-sm font-bold text-slate-700 block mb-1.5">Recipient Email Address</label>
              <input 
                type="email"
                value={testEmailInput}
                onChange={e => setTestEmailInput(e.target.value)}
                placeholder="admin@sathi.com"
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 xl:px-4.5 xl:py-3.5 rounded-xl sm:rounded-2xl bg-slate-50/60 border border-slate-200 text-xs sm:text-sm xl:text-base text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="px-3.5 py-2 sm:px-4 sm:py-2.5 xl:px-5 xl:py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs xl:text-sm font-bold transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleRunTestEmail}
                disabled={isTesting}
                className="px-4 py-2 sm:px-5 sm:py-2.5 xl:px-6 xl:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs xl:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all"
              >
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isTesting ? 'Transmitting...' : 'Send Live Test Mail'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
