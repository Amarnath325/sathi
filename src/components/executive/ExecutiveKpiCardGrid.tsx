'use client';

import React from 'react';
import { useExecutiveStore } from '@/lib/executiveStore';
import { 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Lock, 
  Award, 
  ArrowUpRight, 
  PieChart 
} from 'lucide-react';

export default function ExecutiveKpiCardGrid() {
  const { getKpis, escrowCommissionRate } = useExecutiveStore();
  const kpis = getKpis();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      title: 'Gross Merchandise Value',
      value: formatCurrency(kpis.gmvAmount),
      growth: `+${kpis.gmvGrowthPct}%`,
      subtitle: 'Total volume processed across companion bookings',
      icon: DollarSign,
      color: 'indigo',
      gradient: 'from-indigo-500/20 to-indigo-600/5',
      borderColor: 'border-indigo-500/30',
      textColor: 'text-indigo-400',
    },
    {
      title: 'Platform Net Revenue',
      value: formatCurrency(kpis.netRevenue),
      growth: `+${kpis.netRevenueGrowthPct}%`,
      subtitle: `Net yield at ${escrowCommissionRate}% escrow take-rate`,
      icon: TrendingUp,
      color: 'emerald',
      gradient: 'from-emerald-500/20 to-emerald-600/5',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    {
      title: 'Escrow Reserve Liquidity',
      value: formatCurrency(kpis.escrowReserve),
      growth: `+${kpis.escrowReserveGrowthPct}%`,
      subtitle: 'Active protected funds held in secure trust',
      icon: Lock,
      color: 'blue',
      gradient: 'from-blue-500/20 to-blue-600/5',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    {
      title: 'Active Companions',
      value: kpis.activeCompanions.toLocaleString(),
      growth: `+${kpis.activeCompanionsGrowthPct}%`,
      subtitle: `${kpis.companionRetentionPct}% retention rate across verified profiles`,
      icon: Users,
      color: 'purple',
      gradient: 'from-purple-500/20 to-purple-600/5',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
    {
      title: 'System Security Score',
      value: `${kpis.systemSecurityScore} / 100`,
      growth: 'Optimal',
      subtitle: 'Zero open vulnerabilities & 2FA enforcement active',
      icon: ShieldCheck,
      color: 'cyan',
      gradient: 'from-cyan-500/20 to-cyan-600/5',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
    },
    {
      title: 'CLV to CAC Unit Economics',
      value: `${kpis.clvToCacRatio}x`,
      growth: '+0.4x YoY',
      subtitle: 'Target lifetime value ratio per client acquisition',
      icon: Award,
      color: 'amber',
      gradient: 'from-amber-500/20 to-amber-600/5',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel p-5 rounded-3xl border ${card.borderColor} bg-gradient-to-br ${card.gradient} bg-slate-950/80 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] shadow-xl group`}
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all pointer-events-none" />

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">{card.value}</h2>
                  <span className={`text-xs font-bold flex items-center gap-0.5 ${card.textColor}`}>
                    <ArrowUpRight className="w-3 h-3" />
                    {card.growth}
                  </span>
                </div>
              </div>

              <div className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 ${card.textColor} shadow-md`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60 relative z-10">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
