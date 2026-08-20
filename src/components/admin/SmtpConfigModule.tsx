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
  FileCode,
  Check
} from 'lucide-react';
import { useEmailConfigStore, SmtpSettings } from '@/lib/emailConfigStore';
import { decryptCredential } from '@/lib/cryptoUtils';

export function SmtpConfigModule() {
  const { smtpSettings, updateSmtpSettings, verifySmtpConnection } = useEmailConfigStore();

  const [driverVault, setDriverVault] = useState<Record<string, SmtpSettings>>({});

  const [formData, setFormData] = useState<SmtpSettings>({
    driver: 'SMTP',
    host: '',
    port: 587,
    username: '',
    password: '',
    encryption: 'TLS',
    fromName: '',
    fromEmail: '',
    isVerified: false,
    isEncryptedInDb: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncingApi, setIsSyncingApi] = useState(false);
  const [dbSource, setDbSource] = useState<string>('NEON_POSTGRES_DB');

  // Fetch decrypted settings & per-driver vault from Live DB API on mount
  React.useEffect(() => {
    async function loadSmtpFromApi() {
      try {
        const res = await fetch('/api/admin/smtp');
        const data = await res.json();
        if (data.success && data.settings) {
          if (data.source) setDbSource(data.source);

          const vaultMap: Record<string, SmtpSettings> = data.settings.driverVault || {};
          setDriverVault(vaultMap);

          const activeDriver = data.settings.driver || 'SMTP';
          const activeDriverData = vaultMap[activeDriver] || data.settings;

          setFormData({
            driver: activeDriver,
            host: activeDriverData.host || '',
            port: Number(activeDriverData.port) || 587,
            username: activeDriverData.username || '',
            password: activeDriverData.password || '', // Plaintext decrypted value
            encryption: activeDriverData.encryption || 'TLS',
            fromName: activeDriverData.fromName || '',
            fromEmail: activeDriverData.fromEmail || '',
            isVerified: activeDriverData.isVerified ?? false,
            isEncryptedInDb: true
          });
        } else {
          setFormData({
            driver: 'SMTP',
            host: '',
            port: 587,
            username: '',
            password: '',
            encryption: 'TLS',
            fromName: '',
            fromEmail: '',
            isVerified: false,
            isEncryptedInDb: false
          });
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

      // Update local driverVault state map
      setDriverVault(prev => ({
        ...prev,
        [formData.driver]: { ...formData, isVerified: true, isEncryptedInDb: true }
      }));

      // 2. Encrypt & Save in Client Store
      updateSmtpSettings({
        ...formData,
        password: formData.password
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

  const driverOptions: { key: SmtpSettings['driver']; label: string; desc: string }[] = [
    { key: 'SMTP', label: 'Custom SMTP', desc: 'Private SMTP server' },
    { key: 'GMAIL', label: 'Gmail SMTP', desc: 'smtp.gmail.com (TLS)' },
    { key: 'SENDGRID', label: 'Twilio SendGrid', desc: 'smtp.sendgrid.net' },
    { key: 'AWS_SES', label: 'Amazon SES', desc: 'email-smtp.amazonaws.com' },
    { key: 'MAILGUN', label: 'Mailgun', desc: 'smtp.mailgun.org' },
    { key: 'POSTMARK', label: 'Postmark', desc: 'smtp.postmarkapp.com' }
  ];

  const handleSelectDriver = (driverKey: SmtpSettings['driver']) => {
    const savedForDriver = driverVault[driverKey];

    if (savedForDriver && savedForDriver.host) {
      // If user previously saved config for this specific driver tab, load it!
      setFormData({
        driver: driverKey,
        host: savedForDriver.host || '',
        port: Number(savedForDriver.port) || 587,
        username: savedForDriver.username || '',
        password: savedForDriver.password || '',
        encryption: savedForDriver.encryption || 'TLS',
        fromName: savedForDriver.fromName || '',
        fromEmail: savedForDriver.fromEmail || '',
        isVerified: savedForDriver.isVerified ?? false,
        isEncryptedInDb: true
      });
    } else {
      // If no config saved for this driver tab yet, keep all fields 100% BLANK!
      setFormData({
        driver: driverKey,
        host: '',
        port: 587,
        username: '',
        password: '',
        encryption: 'TLS',
        fromName: '',
        fromEmail: '',
        isVerified: false,
        isEncryptedInDb: false
      });
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-2 lg:space-y-2.5 xl:space-y-4 bg-[#f8fafc] p-2 sm:p-2.5 lg:p-3 xl:p-5 rounded-2xl xl:rounded-3xl">
      
      {/* 1. Header Vault Banner Card — Optimized Laptop & Desktop Height */}
      <div className="bg-white p-2.5 sm:p-3 lg:p-3.5 xl:p-6 rounded-2xl xl:rounded-3xl border border-slate-200/80 shadow-sm space-y-1.5 xl:space-y-2.5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 xl:gap-4">
          
          <div className="flex items-center gap-2.5 lg:gap-3 xl:gap-4">
            <div className="w-8 h-8 lg:w-9 lg:h-9 xl:w-11 xl:h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
              <Mail className="w-4 h-4 lg:w-4.5 lg:h-4.5 xl:w-5.5 xl:h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 xl:gap-2 flex-wrap">
                <h2 className="text-xs sm:text-sm lg:text-base xl:text-xl 2xl:text-2xl font-extrabold text-slate-800 tracking-tight">
                  SMTP Gateway & Credentials Vault
                </h2>
                <span className="text-[8px] sm:text-[9px] lg:text-[10px] xl:text-xs font-mono font-bold uppercase px-1.5 py-0.5 lg:px-2 lg:py-0.5 xl:px-2.5 xl:py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {smtpSettings.isVerified ? '✓ VERIFIED ACTIVE' : 'UNVERIFIED'}
                </span>
                <span className="text-[8px] sm:text-[9px] lg:text-[10px] xl:text-xs font-mono font-bold uppercase px-1.5 py-0.5 lg:px-2 lg:py-0.5 xl:px-2.5 xl:py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-purple-500" /> AES-256 VAULT ENCRYPTED
                </span>
              </div>
              <p className="text-[10px] lg:text-[11px] xl:text-xs text-slate-500 font-medium">
                All third-party credentials are encrypted with AES-256 in the database and decrypted in-memory for API dispatch.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-end shrink-0">
            <button
              type="button"
              onClick={() => { setTestModalOpen(true); setTestResult(null); }}
              className="px-3 py-1.5 lg:px-3.5 lg:py-2 xl:px-5 xl:py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/80 text-[11px] lg:text-xs xl:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
            >
              <Send className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-indigo-600" /> Send Test Email
            </button>
          </div>
        </div>

        {isSaved && (
          <div className="p-2 lg:p-2.5 xl:p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] lg:text-xs xl:text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 shrink-0 text-emerald-600" /> Credentials Encrypted with AES-256 & Updated Live in Database!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-2 lg:space-y-2.5 xl:space-y-4">
        
        {/* 2. Mail Driver Selection Grid */}
        <div className="space-y-1 lg:space-y-1.5">
          <label className="text-[9px] sm:text-[10px] lg:text-[11px] xl:text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider block px-1">
            1. SELECT MAIL DRIVER / PROVIDER
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 lg:gap-2 xl:gap-3">
            {driverOptions.map(drv => {
              const isSelected = formData.driver === drv.key;
              const hasConfig = Boolean(driverVault[drv.key]?.host);
              return (
                <button
                  key={drv.key}
                  type="button"
                  onClick={() => handleSelectDriver(drv.key)}
                  className={`p-2 lg:p-2.5 xl:p-3.5 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-indigo-50/70 border-2 border-indigo-500 text-slate-900 shadow-sm relative' 
                      : 'bg-white border-slate-200/80 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5 lg:mb-1">
                    <Server className={`w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div className="flex items-center gap-1">
                      {hasConfig && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" title="Saved Config Available" />
                      )}
                      {isSelected && (
                        <div className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                          <Check className="w-2 h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`font-bold text-[10px] lg:text-[11px] xl:text-sm ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{drv.label}</div>
                  <div className="text-[8px] lg:text-[9px] xl:text-xs text-slate-400 truncate font-medium flex items-center justify-between">
                    <span>{drv.desc}</span>
                    {hasConfig && <span className="text-[8px] text-emerald-600 font-bold ml-1">✓ Saved</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Server Credentials & Header Profile Container — Ultra Compact for Laptop Zero Scroll */}
        <div className="bg-white p-2.5 sm:p-3 lg:p-3.5 xl:p-6 rounded-2xl xl:rounded-3xl border border-slate-200/80 shadow-sm space-y-2 lg:space-y-2.5 xl:space-y-4">
          <h3 className="text-xs lg:text-xs xl:text-base font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 lg:pb-2 xl:pb-3">
            <Sliders className="w-3.5 h-3.5 xl:w-4.5 xl:h-4.5 text-indigo-600" /> 2. Server Credentials & Sender Header Profile
          </h3>

          {/* Combined Grid: Tight Laptop Padding & Sizing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-2.5 xl:gap-4">
            <div>
              <label className="text-[10px] lg:text-[11px] xl:text-sm font-bold text-slate-700 block mb-0.5 lg:mb-1">SMTP Host</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={formData.host}
                  onChange={e => setFormData({ ...formData, host: e.target.value })}
                  placeholder="Enter SMTP Host (e.g. smtp-relay.brevo.com)"
                  className="w-full px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2.5 rounded-lg xl:rounded-xl bg-slate-50/60 border border-slate-200 text-xs xl:text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white pl-8 lg:pl-8.5 xl:pl-10 transition-all"
                />
                <Globe className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 absolute left-2.5 lg:left-3 top-2 lg:top-2 xl:top-3" />
              </div>
            </div>

            <div>
              <label className="text-[10px] lg:text-[11px] xl:text-sm font-bold text-slate-700 block mb-0.5 lg:mb-1">SMTP Port</label>
              <input 
                type="number"
                required
                value={formData.port}
                onChange={e => setFormData({ ...formData, port: parseInt(e.target.value) || 587 })}
                placeholder="587"
                className="w-full px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2.5 rounded-lg xl:rounded-xl bg-slate-50/60 border border-slate-200 text-xs xl:text-sm text-slate-900 font-mono font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] lg:text-[11px] xl:text-sm font-bold text-slate-700 block mb-0.5 lg:mb-1">Encryption Protocol</label>
              <select
                value={formData.encryption}
                onChange={e => setFormData({ ...formData, encryption: e.target.value as any })}
                className="w-full px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2.5 rounded-lg xl:rounded-xl bg-slate-50/60 border border-slate-200 text-xs xl:text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              >
                <option value="TLS">TLS (Recommended - Port 587)</option>
                <option value="SSL">SSL (Secure - Port 465)</option>
                <option value="NONE">None (Unencrypted - Port 25)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] lg:text-[11px] xl:text-sm font-bold text-slate-700 block mb-0.5 lg:mb-1">SMTP Username / Email</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter Username / Email..."
                  className="w-full px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2.5 rounded-lg xl:rounded-xl bg-slate-50/60 border border-slate-200 text-xs xl:text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white pl-8 lg:pl-8.5 xl:pl-10 transition-all"
                />
                <Key className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 absolute left-2.5 lg:left-3 top-2 lg:top-2 xl:top-3" />
              </div>
            </div>

            <div>
              <label className="text-[10px] lg:text-[11px] xl:text-sm font-bold text-slate-700 block mb-0.5 lg:mb-1 flex items-center justify-between">
                <span>SMTP Password / App Secret</span>
                <span className="text-[8px] lg:text-[9px] xl:text-xs text-purple-600 font-mono flex items-center gap-0.5 font-bold">
                  <Lock className="w-2.5 h-2.5 xl:w-3 xl:h-3" /> AES-256
                </span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter Password / Secret Key..."
                  className="w-full px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2.5 rounded-lg xl:rounded-xl bg-slate-50/60 border border-slate-200 text-xs xl:text-sm text-slate-900 font-mono font-medium focus:outline-none focus:border-indigo-500 focus:bg-white pl-8 lg:pl-8.5 xl:pl-10 pr-8 lg:pr-8.5 xl:pr-10 transition-all"
                />
                <Lock className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-purple-500 absolute left-2.5 lg:left-3 top-2 lg:top-2 xl:top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 lg:right-3 top-2 lg:top-2 xl:top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-indigo-600" /> : <Eye className="w-3.5 h-3.5 xl:w-4 xl:h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] lg:text-[11px] xl:text-sm font-bold text-slate-700 block mb-0.5 lg:mb-1">From Sender Name</label>
              <input 
                type="text"
                required
                value={formData.fromName}
                onChange={e => setFormData({ ...formData, fromName: e.target.value })}
                placeholder="Enter Sender Name..."
                className="w-full px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2.5 rounded-lg xl:rounded-xl bg-slate-50/60 border border-slate-200 text-xs xl:text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-[10px] lg:text-[11px] xl:text-sm font-bold text-slate-700 block mb-0.5 lg:mb-1">From Sender Email</label>
              <input 
                type="email"
                required
                value={formData.fromEmail}
                onChange={e => setFormData({ ...formData, fromEmail: e.target.value })}
                placeholder="Enter Sender Email..."
                className="w-full px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2.5 rounded-lg xl:rounded-xl bg-slate-50/60 border border-slate-200 text-xs xl:text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-end justify-end">
              <button
                type="submit"
                className="w-full px-4 py-1.5 lg:px-5 lg:py-2 xl:px-7 xl:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs xl:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <ShieldCheck className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> Encrypt & Save Credentials
              </button>
            </div>

          </div>
        </div>

      </form>

      {/* 5. TEST EMAIL MODAL */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl xl:rounded-3xl max-w-md xl:max-w-lg w-full p-4 xl:p-6 space-y-4 shadow-2xl animate-fade-in text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 xl:w-5 xl:h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm xl:text-base">Send Test Email Verification</h3>
              </div>
              <button 
                onClick={() => setTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 text-xs xl:text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] xl:text-xs text-slate-500 font-medium leading-relaxed">
              Decrypts AES-256 credentials in-memory and dispatches payload via <strong className="text-slate-800">{formData.host}:{formData.port}</strong>.
            </p>

            {testResult && (
              <div className={`p-3 rounded-xl text-xs xl:text-sm space-y-1.5 font-mono ${
                testResult.success 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                <div className="flex items-start gap-2 font-sans font-bold">
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{testResult.message}</span>
                </div>
                {testResult.exceptionCode && (
                  <div className="text-[10px] xl:text-xs text-rose-700 bg-rose-100/60 p-1.5 rounded-lg border border-rose-200 flex items-center gap-1.5">
                    <FileCode className="w-3 h-3 text-rose-600" />
                    <span>Exception Code: <strong>{testResult.exceptionCode}</strong></span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-[11px] xl:text-xs font-bold text-slate-700 block mb-1">Recipient Email Address</label>
              <input 
                type="email"
                value={testEmailInput}
                onChange={e => setTestEmailInput(e.target.value)}
                placeholder="admin@sathi.com"
                className="w-full px-3 py-2 xl:px-4 xl:py-3 rounded-xl bg-slate-50/60 border border-slate-200 text-xs xl:text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="px-3.5 py-2 xl:px-5 xl:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs xl:text-sm font-bold transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleRunTestEmail}
                disabled={isTesting}
                className="px-4 py-2 xl:px-6 xl:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs xl:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {isTesting ? 'Transmitting...' : 'Send Live Test Mail'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
