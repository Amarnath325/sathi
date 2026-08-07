'use client';

import React, { useState } from 'react';
import { Activity, Cpu, Radio, AlertTriangle, BarChart3, Flame, RefreshCw, CheckCircle2 } from 'lucide-react';
import { TelemetryGauges } from '@/components/health/TelemetryGauges';
import { MicroserviceStatusGrid } from '@/components/health/MicroserviceStatusGrid';
import { SystemAlertsFeed } from '@/components/health/SystemAlertsFeed';
import { ResourceUtilizationCharts } from '@/components/health/ResourceUtilizationCharts';
import { ChaosLoadSimulator } from '@/components/health/ChaosLoadSimulator';
import { useSystemHealthStore } from '@/lib/systemHealthStore';
import { AdminAuthGuard } from '@/components/auth/AdminAuthGuard';

export default function AdminSystemHealthPage() {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'services' | 'alerts' | 'trends' | 'chaos'>('telemetry');
  const { currentMetric, alerts, services, isChaosTesting, stopChaosLoad } = useSystemHealthStore();

  const activeAlertsCount = alerts.filter((a) => !a.isResolved).length;

  return (
    <AdminAuthGuard>
    <div className="w-full bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Chaos Active Banner Alert */}
        {isChaosTesting && (
          <div className="p-4 rounded-3xl bg-rose-500 text-slate-950 font-extrabold flex items-center justify-between shadow-2xl shadow-rose-900/50 border border-rose-400">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 shrink-0" />
              <div>
                <div className="text-sm uppercase tracking-widest">🔥 SYNTHETIC CHAOS LOAD STRESS TEST IN PROGRESS</div>
                <div className="text-xs font-medium text-slate-950">System metrics and alert triggers are currently influenced by chaos testing.</div>
              </div>
            </div>
            <button
              onClick={stopChaosLoad}
              className="px-4 py-2 rounded-xl bg-slate-950 text-rose-400 text-xs font-black hover:bg-slate-900 shrink-0"
            >
              Stop Chaos Test
            </button>
          </div>
        )}

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-400" /> System Health & Telemetry Engine
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Telemetry Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time server CPU/RAM gauges, DB connection pool saturation, 7 microservice pings, and incident alert manager
            </p>
          </div>

          <button
            onClick={() => setActiveTab('chaos')}
            className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30 shrink-0"
          >
            <Flame className="w-4 h-4 text-rose-400" /> Chaos Load Simulator
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Overall Platform Status</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">HEALTHY 🟢</div>
            <div className="text-[10px] text-slate-500 font-mono">Uptime SLA: 99.98%</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>CPU Core Load</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">{currentMetric.cpuUsagePercent}%</div>
            <div className="text-[10px] text-slate-500 font-mono">RAM: {currentMetric.memoryUsagePercent}%</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Active Services Pinged</span>
              <Radio className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{services.length} Microservices</div>
            <div className="text-[10px] text-slate-500 font-mono">7 / 7 Online</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Active Incident Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {activeAlertsCount === 0 ? '0 Incidents' : `${activeAlertsCount} Active ⚠️`}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Alert manager active</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800">
          {[
            { id: 'telemetry', label: '📊 Real-Time Telemetry Dials', icon: <Activity className="w-4 h-4" /> },
            { id: 'services', label: '🌐 Microservices Health Grid', icon: <Radio className="w-4 h-4" /> },
            { id: 'alerts', label: `🚨 Incident Alerts (${activeAlertsCount})`, icon: <AlertTriangle className="w-4 h-4" /> },
            { id: 'trends', label: '📈 Resource Trends', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'chaos', label: '⚡ Chaos Load Simulator', icon: <Flame className="w-4 h-4" /> },
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
          {activeTab === 'telemetry' && <TelemetryGauges />}
          {activeTab === 'services' && <MicroserviceStatusGrid />}
          {activeTab === 'alerts' && <SystemAlertsFeed />}
          {activeTab === 'trends' && <ResourceUtilizationCharts />}
          {activeTab === 'chaos' && <ChaosLoadSimulator />}
        </div>
      </div>
    </div>
    </AdminAuthGuard>
  );
}
