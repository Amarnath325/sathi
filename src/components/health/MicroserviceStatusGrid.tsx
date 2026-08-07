'use client';

import React from 'react';
import { Database, Zap, Radio, CreditCard, MessageSquare, Mail, HardDrive, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useSystemHealthStore, MicroserviceStatusRecord } from '@/lib/systemHealthStore';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  DATABASE: <Database className="w-4 h-4 text-emerald-400" />,
  CACHE: <Zap className="w-4 h-4 text-amber-400" />,
  GATEWAY: <Radio className="w-4 h-4 text-indigo-400" />,
  PAYMENT: <CreditCard className="w-4 h-4 text-cyan-400" />,
  COMMUNICATION: <MessageSquare className="w-4 h-4 text-purple-400" />,
  STORAGE: <HardDrive className="w-4 h-4 text-blue-400" />,
};

export function MicroserviceStatusGrid() {
  const { services, pingServices } = useSystemHealthStore();
  const [isPinging, setIsPinging] = React.useState(false);

  const handlePing = () => {
    setIsPinging(true);
    pingServices();
    setTimeout(() => setIsPinging(false), 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400" /> Platform Microservice Ping & Gateway Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time TCP/HTTP handshake pings, SLA uptime percentages, and response latency across 7 core services
          </p>
        </div>

        <button
          onClick={handlePing}
          disabled={isPinging}
          className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          {isPinging ? 'Pinging Nodes...' : 'Ping All Services'}
        </button>
      </div>

      {/* Grid of Microservice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => {
          const icon = CATEGORY_ICONS[svc.category] || <Database className="w-4 h-4 text-indigo-400" />;

          return (
            <div key={svc.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{svc.displayName}</h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{svc.endpointUrl}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-center">
                <div>
                  <span className="text-[9px] text-slate-500 font-sans block font-bold">Status</span>
                  <span className="text-[11px] font-extrabold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> {svc.status}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-500 font-sans block font-bold">Ping Latency</span>
                  <span className="text-[11px] font-extrabold text-white mt-0.5 block">{svc.lastPingMs} ms</span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-500 font-sans block font-bold">Uptime SLA</span>
                  <span className="text-[11px] font-extrabold text-indigo-400 mt-0.5 block">{svc.uptimePercent}%</span>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-mono flex items-center justify-between" suppressHydrationWarning>
                <span>Category: {svc.category}</span>
                <span>Last pinged: {new Date(svc.lastCheckedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
