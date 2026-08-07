'use client';

import React from 'react';
import { HardDrive, Cloud, Database, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useSystemSettingsStore } from '@/lib/systemSettingsStore';

export function StorageCdnConfig() {
  const { storage, updateStorageSettings, resetCategoryDefaults } = useSystemSettingsStore();
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
            <HardDrive className="w-4 h-4 text-purple-400" /> Cloud Storage, CDN & Database Backup Strategy
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure S3 storage buckets, Cloudflare CDN endpoints, and automated database snapshot retention
          </p>
        </div>

        <button
          type="button"
          onClick={() => resetCategoryDefaults('STORAGE')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Storage Provider */}
        <div>
          <label className="text-xs font-bold text-slate-300">Active Object Storage Provider</label>
          <select
            value={storage.storageProvider}
            onChange={(e) => updateStorageSettings({ storageProvider: e.target.value as any })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="AWS_S3">Amazon Web Services (AWS S3)</option>
            <option value="CLOUDFLARE_R2">Cloudflare R2 Storage</option>
            <option value="LOCAL_FS">Local File System Driver</option>
          </select>
        </div>

        {/* CDN Endpoint */}
        <div>
          <label className="text-xs font-bold text-slate-300">CDN Edge Acceleration Domain</label>
          <input
            type="text"
            value={storage.cdnEndpointUrl}
            onChange={(e) => updateStorageSettings({ cdnEndpointUrl: e.target.value })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* S3 Bucket */}
        <div>
          <label className="text-xs font-bold text-slate-300">S3 Bucket Name</label>
          <input
            type="text"
            value={storage.s3BucketName}
            onChange={(e) => updateStorageSettings({ s3BucketName: e.target.value })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* S3 Region */}
        <div>
          <label className="text-xs font-bold text-slate-300">AWS Datacenter Region</label>
          <input
            type="text"
            value={storage.s3Region}
            onChange={(e) => updateStorageSettings({ s3Region: e.target.value })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Daily Backup Schedule */}
        <div>
          <label className="text-xs font-bold text-slate-300">Automated DB Backup Cron Schedule</label>
          <input
            type="text"
            value={storage.dailyBackupSchedule}
            onChange={(e) => updateStorageSettings({ dailyBackupSchedule: e.target.value })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Backup Retention Days */}
        <div>
          <label className="text-xs font-bold text-slate-300">Database Snapshot Retention (Days)</label>
          <input
            type="number"
            value={storage.backupRetentionDays}
            onChange={(e) => updateStorageSettings({ backupRetentionDays: Number(e.target.value) })}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {saved ? (
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Storage & CDN configuration updated!
          </span>
        ) : (
          <span className="text-[11px] text-slate-500">Backups snapshot daily at 2:00 AM UTC</span>
        )}

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30"
        >
          <Save className="w-4 h-4" /> Save Storage Driver Config
        </button>
      </div>
    </form>
  );
}
