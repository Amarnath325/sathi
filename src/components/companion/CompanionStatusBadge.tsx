'use client';

import React from 'react';
import { CompanionStatus } from '@/lib/types';
import { ShieldCheck, Clock, XCircle, AlertTriangle } from 'lucide-react';

interface Props {
  status: CompanionStatus;
  size?: 'sm' | 'md';
}

const config: Record<CompanionStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  ACTIVE: {
    label: 'Active',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: <ShieldCheck className="w-3 h-3" />,
  },
  INACTIVE: {
    label: 'Inactive',
    color: 'text-slate-400',
    bg: 'bg-slate-800/60',
    border: 'border-slate-700/50',
    icon: <XCircle className="w-3 h-3" />,
  },
  SUSPENDED: {
    label: 'Suspended',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    icon: <XCircle className="w-3 h-3" />,
  },
  PENDING_VERIFICATION: {
    label: 'Pending KYC',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: <Clock className="w-3 h-3" />,
  },
};

export function CompanionStatusBadge({ status, size = 'sm' }: Props) {
  const c = config[status] || config.INACTIVE;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-semibold
        ${c.color} ${c.bg} ${c.border}
        ${size === 'md' ? 'text-xs px-3 py-1' : 'text-[11px]'}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}
