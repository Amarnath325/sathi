'use client';

import React from 'react';
import { Bell, Mail, Smartphone, MessageSquare, Moon, ShieldAlert, CheckCircle } from 'lucide-react';
import { useNotificationEngineStore } from '@/lib/notificationEngineStore';

export function PreferencesPanel() {
  const { userPreferences, updatePreferences } = useNotificationEngineStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
      <div>
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" /> Notification Channel & Privacy Preferences
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Customize how and when you receive security alerts, booking updates, and messages
        </p>
      </div>

      {/* Channel Toggles */}
      <div className="space-y-3 divide-y divide-slate-800/60">
        <div className="pt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">In-App SSE Notifications</h4>
              <p className="text-[11px] text-slate-400">Live popovers and header badges inside Sathi hub</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={userPreferences.inAppEnabled}
            onChange={(e) => updatePreferences({ inAppEnabled: e.target.checked })}
            className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
          />
        </div>

        <div className="pt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Email Digest & Alerts</h4>
              <p className="text-[11px] text-slate-400">Escrow receipts, booking confirmations, and weekly digests</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={userPreferences.emailEnabled}
            onChange={(e) => updatePreferences({ emailEnabled: e.target.checked })}
            className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
          />
        </div>

        <div className="pt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Mobile Push Notifications</h4>
              <p className="text-[11px] text-slate-400">Instant background push alerts on your phone</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={userPreferences.pushEnabled}
            onChange={(e) => updatePreferences({ pushEnabled: e.target.checked })}
            className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
          />
        </div>

        <div className="pt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">SMS Security Alerts</h4>
              <p className="text-[11px] text-slate-400">2FA OTPs and urgent SOS emergency broadcasts</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={userPreferences.smsEnabled}
            onChange={(e) => updatePreferences({ smsEnabled: e.target.checked })}
            className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Quiet Hours & DND */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            <div>
              <h4 className="text-xs font-bold text-white">Do Not Disturb (Quiet Hours)</h4>
              <p className="text-[10px] text-slate-400">Suppress non-urgent push notifications during night hours</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={userPreferences.dndEnabled}
            onChange={(e) => updatePreferences({ dndEnabled: e.target.checked })}
            className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
          />
        </div>

        {userPreferences.dndEnabled && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-[10px] text-slate-400 font-bold">Quiet Hours Start</label>
              <input
                type="time"
                value={userPreferences.quietHoursStart || '22:00'}
                onChange={(e) => updatePreferences({ quietHoursStart: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold">Quiet Hours End</label>
              <input
                type="time"
                value={userPreferences.quietHoursEnd || '07:00'}
                onChange={(e) => updatePreferences({ quietHoursEnd: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
