import React from 'react';
import { CheckCircle2, ShieldCheck, AlertTriangle, XCircle, Info } from 'lucide-react';

export type BadgeVariant = 
  | 'verified' 
  | 'pending' 
  | 'failed' 
  | 'low_risk' 
  | 'medium_risk' 
  | 'high_risk' 
  | 'info';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, label, size = 'sm', className = '' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  switch (variant) {
    case 'verified':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 ${sizeClasses} ${className}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {label || 'VERIFIED'}
        </span>
      );
    case 'pending':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 ${sizeClasses} ${className}`}>
          <Info className="w-3 h-3 text-amber-400" />
          {label || 'PENDING'}
        </span>
      );
    case 'failed':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40 ${sizeClasses} ${className}`}>
          <XCircle className="w-3 h-3 text-rose-400" />
          {label || 'FAILED'}
        </span>
      );
    case 'low_risk':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40 ${sizeClasses} ${className}`}>
          <ShieldCheck className="w-3 h-3 text-indigo-400" />
          {label || 'LOW RISK'}
        </span>
      );
    case 'high_risk':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 ${sizeClasses} ${className}`}>
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          {label || 'HIGH RISK'}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700 ${sizeClasses} ${className}`}>
          {label || 'STATUS'}
        </span>
      );
  }
};
