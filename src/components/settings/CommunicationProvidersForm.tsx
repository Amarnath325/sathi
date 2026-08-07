'use client';

import React, { useState } from 'react';
import { MessageSquare, Mail, Zap, RefreshCw, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSystemSettingsStore } from '@/lib/systemSettingsStore';

export function CommunicationProvidersForm() {
  const { communication, updateCommunicationSettings, testProviderConnection } = useSystemSettingsStore();

  const [showSecret, setShowSecret] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);

  const handleTest = async (provider: 'TWILIO' | 'SENDGRID' | 'AWS_S3') => {
    setTestingProvider(provider);
    setTestResult(null);
    const res = await testProviderConnection(provider);
    setTestResult(res.message);
    setTestingProvider(null);
  };

  return (
    <div className="space-y-6">
      {/* Twilio SMS Settings */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" /> Twilio SMS Carrier Integration
          </h3>

          <button
            type="button"
            onClick={() => handleTest('TWILIO')}
            disabled={testingProvider === 'TWILIO'}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5"
          >
            <Zap className={`w-3.5 h-3.5 ${testingProvider === 'TWILIO' ? 'animate-bounce' : ''}`} />
            {testingProvider === 'TWILIO' ? 'Testing Handshake...' : 'Test Twilio SMS API'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <label className="text-xs font-bold text-slate-300 font-sans">Twilio Account SID</label>
            <input
              type="text"
              value={communication.twilioAccountSid}
              onChange={(e) => updateCommunicationSettings({ twilioAccountSid: e.target.value })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 font-sans flex items-center justify-between">
              <span>Twilio Auth Token</span>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-[10px] text-slate-500 hover:text-white"
              >
                {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </label>
            <input
              type={showSecret ? 'text' : 'password'}
              value={communication.twilioAuthToken}
              onChange={(e) => updateCommunicationSettings({ twilioAuthToken: e.target.value })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 font-sans">Twilio Verified Phone Number</label>
            <input
              type="text"
              value={communication.twilioSenderPhone}
              onChange={(e) => updateCommunicationSettings({ twilioSenderPhone: e.target.value })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* SendGrid Email Settings */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" /> SendGrid SMTP Gateway & Transactional Email
          </h3>

          <button
            type="button"
            onClick={() => handleTest('SENDGRID')}
            disabled={testingProvider === 'SENDGRID'}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5"
          >
            <Zap className={`w-3.5 h-3.5 ${testingProvider === 'SENDGRID' ? 'animate-bounce' : ''}`} />
            {testingProvider === 'SENDGRID' ? 'Testing Handshake...' : 'Test SendGrid SMTP'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <label className="text-xs font-bold text-slate-300 font-sans">SendGrid Host</label>
            <input
              type="text"
              value={communication.sendgridSmtpHost}
              onChange={(e) => updateCommunicationSettings({ sendgridSmtpHost: e.target.value })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 font-sans">SMTP Port</label>
            <input
              type="number"
              value={communication.sendgridSmtpPort}
              onChange={(e) => updateCommunicationSettings({ sendgridSmtpPort: Number(e.target.value) })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 font-sans">Sender Email Address</label>
            <input
              type="email"
              value={communication.sendgridSenderEmail}
              onChange={(e) => updateCommunicationSettings({ sendgridSenderEmail: e.target.value })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Test Connection Output Alert */}
      {testResult && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {testResult}
        </div>
      )}
    </div>
  );
}
