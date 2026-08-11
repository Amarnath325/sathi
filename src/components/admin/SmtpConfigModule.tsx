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
  Sparkles,
  Database,
  Radio
} from 'lucide-react';
import { useEmailConfigStore, SmtpSettings } from '@/lib/emailConfigStore';

export function SmtpConfigModule() {
  const { smtpSettings, updateSmtpSettings, verifySmtpConnection } = useEmailConfigStore();

  const [formData, setFormData] = useState<SmtpSettings>(smtpSettings);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Test Email Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState('admin@sathi.com');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSmtpSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
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
    { key: 'SMTP', label: 'Custom SMTP', desc: 'Connect your private SMTP server', defaultHost: 'mail.yourdomain.com', defaultPort: 587 },
    { key: 'GMAIL', label: 'Gmail SMTP', desc: 'smtp.gmail.com (TLS/App Password)', defaultHost: 'smtp.gmail.com', defaultPort: 587 },
    { key: 'SENDGRID', label: 'Twilio SendGrid', desc: 'smtp.sendgrid.net (API Key)', defaultHost: 'smtp.sendgrid.net', defaultPort: 587 },
    { key: 'AWS_SES', label: 'Amazon SES', desc: 'email-smtp.us-east-1.amazonaws.com', defaultHost: 'email-smtp.us-east-1.amazonaws.com', defaultPort: 587 },
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
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden bg-slate-900/90 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                SMTP Gateway & Email Credentials Module
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {smtpSettings.isVerified ? 'VERIFIED ACTIVE' : 'UNVERIFIED'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Configure your primary mail server credentials for dispatches, OTPs, and escrow receipts.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setTestModalOpen(true); setTestResult(null); }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-indigo-400" /> Send Test Email
            </button>
          </div>
        </div>

        {isSaved && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> SMTP Configuration Saved Successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Mail Driver Selection Grid */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">1. Select Mail Driver / Provider</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {driverOptions.map(drv => (
              <button
                key={drv.key}
                type="button"
                onClick={() => handleSelectDriver(drv.key)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  formData.driver === drv.key 
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Server className="w-4 h-4 text-indigo-400" />
                  {formData.driver === drv.key && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="font-bold text-xs text-white">{drv.label}</div>
                <div className="text-[10px] text-slate-500 truncate">{drv.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Server & Connection Settings */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 bg-slate-900/60 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Sliders className="w-4 h-4 text-indigo-400" /> 2. Server & Authentication Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">SMTP Host</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={formData.host}
                  onChange={e => setFormData({ ...formData, host: e.target.value })}
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 pl-10"
                />
                <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">SMTP Port</label>
              <input 
                type="number"
                required
                value={formData.port}
                onChange={e => setFormData({ ...formData, port: parseInt(e.target.value) || 587 })}
                placeholder="587"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Encryption Protocol</label>
              <select
                value={formData.encryption}
                onChange={e => setFormData({ ...formData, encryption: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="TLS">TLS (Recommended - Port 587)</option>
                <option value="SSL">SSL (Secure - Port 465)</option>
                <option value="NONE">None (Unencrypted - Port 25)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">SMTP Username / Email</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  placeholder="notifications@sathi.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 pl-10"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">SMTP Password / App Secret</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 pl-10 pr-10"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sender Profile Settings */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 bg-slate-900/60 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Radio className="w-4 h-4 text-indigo-400" /> 3. Sender Header Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">From Sender Name</label>
              <input 
                type="text"
                required
                value={formData.fromName}
                onChange={e => setFormData({ ...formData, fromName: e.target.value })}
                placeholder="Sathi Platform Team"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">From Sender Email</label>
              <input 
                type="email"
                required
                value={formData.fromEmail}
                onChange={e => setFormData({ ...formData, fromEmail: e.target.value })}
                placeholder="no-reply@sathi.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs hover:opacity-95 shadow-xl shadow-indigo-600/30 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Save SMTP Credentials
          </button>
        </div>

      </form>

      {/* TEST EMAIL MODAL */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in text-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Send Test Email Verification</h3>
              </div>
              <button 
                onClick={() => setTestModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Dispatches a test TLS email payload via <strong className="text-white">{formData.host}:{formData.port}</strong>.
            </p>

            {testResult && (
              <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                testResult.success 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Recipient Email Address</label>
              <input 
                type="email"
                value={testEmailInput}
                onChange={e => setTestEmailInput(e.target.value)}
                placeholder="admin@sathi.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleRunTestEmail}
                disabled={isTesting}
                className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isTesting ? 'Sending Test Mail...' : 'Send Test Mail Now'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
