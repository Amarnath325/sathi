'use client';

import React, { useState } from 'react';
import { Settings, Building, DollarSign, MessageSquare, HardDrive, Wrench, Shield, CheckCircle2, AlertOctagon } from 'lucide-react';
import { GeneralBrandingForm } from '@/components/settings/GeneralBrandingForm';
import { FinanceCommissionForm } from '@/components/settings/FinanceCommissionForm';
import { CommunicationProvidersForm } from '@/components/settings/CommunicationProvidersForm';
import { StorageCdnConfig } from '@/components/settings/StorageCdnConfig';
import { MaintenanceModeManager } from '@/components/settings/MaintenanceModeManager';
import { SecurityRateLimitConfig } from '@/components/settings/SecurityRateLimitConfig';
import { useSystemSettingsStore } from '@/lib/systemSettingsStore';

export default function AdminSystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'finance' | 'communication' | 'storage' | 'maintenance' | 'security'>('general');
  const { general, finance, storage, maintenance, toggleMaintenanceMode } = useSystemSettingsStore();

  return (
    <div className="w-full bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Maintenance Banner Alert */}
        {maintenance.isMaintenanceActive && (
          <div className="p-4 rounded-3xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-between shadow-2xl shadow-amber-900/50 border border-amber-400">
            <div className="flex items-center gap-3">
              <AlertOctagon className="w-6 h-6 shrink-0" />
              <div>
                <div className="text-sm uppercase tracking-widest">⚠️ PLATFORM MAINTENANCE MODE IS CURRENTLY ACTIVE</div>
                <div className="text-xs font-medium text-slate-900">{maintenance.outageMessage}</div>
              </div>
            </div>
            <button
              onClick={toggleMaintenanceMode}
              className="px-4 py-2 rounded-xl bg-slate-950 text-amber-400 text-xs font-black hover:bg-slate-900 shrink-0"
            >
              Disable Maintenance
            </button>
          </div>
        )}

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-400" /> System Settings & Configuration Engine
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v3.4 Enterprise Core
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Centralized platform configuration, escrow rates, 3rd party API keys, cloud drivers, and emergency maintenance
            </p>
          </div>

          <button
            onClick={toggleMaintenanceMode}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-xl ${
              maintenance.isMaintenanceActive
                ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
            }`}
          >
            <Wrench className="w-4 h-4" />
            {maintenance.isMaintenanceActive ? 'Turn Off Maintenance' : 'Activate Maintenance Mode'}
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Platform Title</span>
              <Building className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-lg font-extrabold text-white truncate">{general.appName}</div>
            <div className="text-[10px] text-slate-500 font-mono">Currency: {general.defaultCurrency}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Escrow Platform Take-Rate</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">{finance.commissionRatePercent}%</div>
            <div className="text-[10px] text-slate-500 font-mono">Hold days: {finance.escrowHoldDays} days</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Object Storage Driver</span>
              <HardDrive className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-lg font-extrabold text-white font-mono">{storage.storageProvider}</div>
            <div className="text-[10px] text-slate-500 font-mono">Bucket: {storage.s3BucketName}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Platform Status</span>
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-extrabold text-white">
              {maintenance.isMaintenanceActive ? (
                <span className="text-amber-400 font-bold">MAINTENANCE</span>
              ) : (
                <span className="text-emerald-400 font-bold">OPERATIONAL 🟢</span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">No active outage alerts</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800">
          {[
            { id: 'general', label: '🏢 Enterprise Branding', icon: <Building className="w-4 h-4" /> },
            { id: 'finance', label: '💳 Finance & Escrow Rates', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'communication', label: '💬 Communication Providers', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'storage', label: '☁️ Storage & CDN Driver', icon: <HardDrive className="w-4 h-4" /> },
            { id: 'maintenance', label: '🛠️ Maintenance Mode', icon: <Wrench className="w-4 h-4" /> },
            { id: 'security', label: '🔒 Security & Rate Limits', icon: <Shield className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'gradient-bg-primary text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === 'general' && <GeneralBrandingForm />}
          {activeTab === 'finance' && <FinanceCommissionForm />}
          {activeTab === 'communication' && <CommunicationProvidersForm />}
          {activeTab === 'storage' && <StorageCdnConfig />}
          {activeTab === 'maintenance' && <MaintenanceModeManager />}
          {activeTab === 'security' && <SecurityRateLimitConfig />}
        </div>
      </div>
    </div>
  );
}
