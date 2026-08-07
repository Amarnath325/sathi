'use client';

import React from 'react';
import { Building, Mail, Globe, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useSystemSettingsStore } from '@/lib/systemSettingsStore';

export function GeneralBrandingForm() {
  const { general, updateGeneralSettings, resetCategoryDefaults } = useSystemSettingsStore();
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" /> Enterprise Organization & Branding Configuration
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure global platform title, support email, default billing currency, and legal policy URIs
          </p>
        </div>

        <button
          type="button"
          onClick={() => resetCategoryDefaults('GENERAL')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* App Name */}
        <div>
          <label className="text-xs font-bold text-slate-300">Platform Title / App Name</label>
          <input
            type="text"
            value={general.appName}
            onChange={(e) => updateGeneralSettings({ appName: e.target.value })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Support Email */}
        <div>
          <label className="text-xs font-bold text-slate-300">Official Support Email</label>
          <input
            type="email"
            value={general.supportEmail}
            onChange={(e) => updateGeneralSettings({ supportEmail: e.target.value })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Default Currency */}
        <div>
          <label className="text-xs font-bold text-slate-300">Primary Billing Currency</label>
          <select
            value={general.defaultCurrency}
            onChange={(e) => updateGeneralSettings({ defaultCurrency: e.target.value as any })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="USD">USD ($ - United States Dollar)</option>
            <option value="INR">INR (₹ - Indian Rupee)</option>
            <option value="EUR">EUR (€ - Euro)</option>
            <option value="GBP">GBP (£ - British Pound)</option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="text-xs font-bold text-slate-300">Primary System Timezone</label>
          <input
            type="text"
            value={general.timezone}
            onChange={(e) => updateGeneralSettings({ timezone: e.target.value })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Logo URL */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-300">Platform Brand Logo URL</label>
          <input
            type="text"
            value={general.logoUrl}
            onChange={(e) => updateGeneralSettings({ logoUrl: e.target.value })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {saved ? (
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> General branding settings updated!
          </span>
        ) : (
          <span className="text-[11px] text-slate-500">All changes autosaved to local state</span>
        )}

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30"
        >
          <Save className="w-4 h-4" /> Save Branding Configuration
        </button>
      </div>
    </form>
  );
}
