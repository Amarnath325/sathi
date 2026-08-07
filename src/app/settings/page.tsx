'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Smartphone, 
  Laptop, 
  LogOut, 
  AlertTriangle, 
  Trash2, 
  CreditCard, 
  Eye, 
  User, 
  Check, 
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  Ban
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function UserSettingsPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications' | 'privacy' | 'suspension' | 'danger'>('account');

  // Section 83: Notification Preferences State
  const [notifPreferences, setNotifPreferences] = useState({
    emailBooking: true,
    pushBooking: true,
    smsBooking: true,
    emailMessages: true,
    pushMessages: true,
    smsMessages: false,
    emailPayments: true,
    pushPayments: true,
    smsPayments: true,
    emailSafety: true, // Mandatory
    pushSafety: true, // Mandatory
    smsSafety: true, // Mandatory
    marketing: false
  });

  // Section 84: Privacy Settings State
  const [profileVisibility, setProfileVisibility] = useState('LIMITED');
  const [locationSharing, setLocationSharing] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  // Section 85: Login History State
  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'Chrome — Windows 11', location: 'New Delhi, India', time: 'Today (Active Now)', current: true },
    { id: 'sess-2', device: 'Android — Companion Connect App', location: 'Mumbai, India', time: 'Yesterday at 04:12 PM', current: false },
    { id: 'sess-3', device: 'Safari — macOS Sonoma', location: 'Unknown Location', time: '3 days ago', current: false }
  ]);

  // Section 87: Account Deletion State
  const [deleteStep, setDeleteStep] = useState<1 | 2 | 3>(1);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  const handleLogoutSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('info', 'Session Terminated', 'Device session logged out successfully.');
  };

  const handleLogoutAll = () => {
    setActiveSessions(prev => prev.filter(s => s.current));
    showToast('success', 'Logged Out All Devices', 'All other active sessions have been invalidated.');
  };

  const handleReportSuspicious = (device: string) => {
    showToast('warning', 'Suspicious Activity Flagged', `Security team notified regarding session from ${device}. Password reset recommended.`);
  };

  const handleDeleteAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      showToast('error', 'Password Required', 'Enter your password to authorize account deletion.');
      return;
    }
    showToast('warning', 'Account Deletion Scheduled', 'Your account deletion request has been submitted. Financial records will be retained for 7 years per regulatory guidelines.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <SettingsIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Account Settings & Security</h1>
          </div>
          <p className="text-xs text-slate-400">Manage security credentials, login devices, notification channels, and privacy preferences.</p>
        </div>

        <Link
          href="/profile"
          className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5"
        >
          <User className="w-4 h-4 text-indigo-400" /> Edit Public Profile
        </Link>
      </div>

      {/* Tabs Row */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'account', label: 'Account & Security' },
          { id: 'notifications', label: 'Notification Preferences' },
          { id: 'privacy', label: 'Privacy & Data' },
          { id: 'suspension', label: 'Restriction Status' },
          { id: 'danger', label: 'Account Deletion' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'gradient-bg-primary text-white shadow-lg'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ACCOUNT & SECURITY & LOGIN HISTORY (Section 84 & 85) */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          
          {/* Section 85: Login History & Active Sessions */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-indigo-400" /> Section 85: Login History & Active Sessions
                </h3>
                <p className="text-xs text-slate-400">Monitor active browser & mobile sessions. Terminate unrecognized logins instantly.</p>
              </div>
              
              <button
                onClick={handleLogoutAll}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout All Other Devices
              </button>
            </div>

            <div className="space-y-3">
              {activeSessions.map((sess) => (
                <div 
                  key={sess.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sess.current ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-400'}`}>
                      {sess.device.includes('Android') ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{sess.device}</h4>
                        {sess.current && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
                            CURRENT DEVICE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{sess.location} • <span className="font-mono text-slate-300">{sess.time}</span></p>
                    </div>
                  </div>

                  {!sess.current && (
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-900 pt-2 sm:pt-0">
                      <button
                        onClick={() => handleReportSuspicious(sess.device)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-[11px] font-bold hover:bg-amber-500/30"
                      >
                        Report Suspicious
                      </button>
                      <button
                        onClick={() => handleLogoutSession(sess.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-800"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Credentials */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" /> Password & Two-Factor Authentication (2FA)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white">Password Authentication</h4>
                <p className="text-[11px] text-slate-400">Last changed 45 days ago.</p>
                <button className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-indigo-400 hover:text-white">
                  Change Password
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Two-Factor Authentication (TOTP)
                </h4>
                <p className="text-[11px] text-slate-400">Protects your account with Google Authenticator or SMS OTP.</p>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold inline-block">
                  2FA ACTIVE ✓
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: NOTIFICATION PREFERENCES (Section 83) */}
      {activeTab === 'notifications' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" /> Section 83: Notification Preferences
            </h3>
            <p className="text-xs text-slate-400">Configure email, push, and SMS dispatch channels for marketplace activity.</p>
          </div>

          <div className="space-y-4">
            {[
              { id: 'Booking', label: 'Booking Requests & Status Updates' },
              { id: 'Messages', label: 'Encrypted Chat Messages' },
              { id: 'Payments', label: 'Escrow Holds & Payout Transfers' },
              { id: 'Safety', label: 'Emergency Alerts & Account Security (Mandatory)', mandatory: true },
              { id: 'Marketing', label: 'Promotional Offers & Updates' }
            ].map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white">{cat.label}</h4>
                  {cat.mandatory && <p className="text-[10px] text-amber-400">Safety notifications cannot be disabled.</p>}
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={true}
                      disabled={cat.mandatory}
                      className="rounded border-slate-800 text-indigo-500" 
                    />
                    <span>Email</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={true}
                      disabled={cat.mandatory}
                      className="rounded border-slate-800 text-indigo-500" 
                    />
                    <span>Push</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cat.id !== 'Marketing'}
                      disabled={cat.mandatory}
                      className="rounded border-slate-800 text-indigo-500" 
                    />
                    <span>SMS</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRIVACY & DATA (Section 84 & 94) */}
      {activeTab === 'privacy' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" /> Section 84 & 94: Privacy & Data Minimization Controls
            </h3>
            <p className="text-xs text-slate-400">Control profile visibility, read receipts, and location minimization rules.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Online Status Indicator</h4>
                <p className="text-[10px] text-slate-400">Allow users to see when you are active on Companion Connect.</p>
              </div>
              <input 
                type="checkbox" 
                checked={onlineStatus} 
                onChange={e => setOnlineStatus(e.target.checked)} 
                className="rounded border-slate-800 text-indigo-500 w-4 h-4" 
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Read Receipts in Encrypted Chat</h4>
                <p className="text-[10px] text-slate-400">Show blue checkmarks when you view messages.</p>
              </div>
              <input 
                type="checkbox" 
                checked={readReceipts} 
                onChange={e => setReadReceipts(e.target.checked)} 
                className="rounded border-slate-800 text-indigo-500 w-4 h-4" 
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACCOUNT SUSPENSION UI NOTICE (Section 86) */}
      {activeTab === 'suspension' && (
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/40 bg-amber-950/20 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Section 86: Account Restriction & Compliance Status</h3>
              <p className="text-xs text-slate-300">Your account is currently in good standing.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-white">Sample Account Suspension Notice UI Example:</h4>
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2">
              <p className="font-extrabold text-sm">⚠️ Your account has been temporarily restricted.</p>
              <p><strong>Reason:</strong> Pending identity re-verification audit following security report.</p>
              <p><strong>Restriction:</strong> Marketplace booking creation is paused until verification completes.</p>
              <Link 
                href="/safety"
                className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 mt-2"
              >
                Contact Support & Appeals Team
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACCOUNT DELETION FLOW (Section 87) */}
      {activeTab === 'danger' && (
        <div className="glass-panel p-8 rounded-3xl border border-rose-500/40 bg-rose-950/10 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-400" /> Section 87: Account Deletion Flow
            </h3>
            <p className="text-xs text-slate-400">Permanently close your Companion Connect account and remove marketplace credentials.</p>
          </div>

          <form onSubmit={handleDeleteAccountSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <h4 className="font-bold text-rose-400">Regulatory Data Retention Notice (Section 87)</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Per regulatory & financial anti-money laundering laws, financial transactions and audit logs are retained for 7 years prior to purge. Active bookings will be cancelled.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Reason for Leaving (Optional)</label>
              <input 
                type="text" 
                value={deleteReason}
                onChange={e => setDeleteReason(e.target.value)}
                placeholder="Tell us why you are deleting your account..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Re-enter Password to Confirm</label>
              <input 
                type="password" 
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl shadow-rose-900/40"
            >
              Request Account Deletion
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
