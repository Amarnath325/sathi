'use client';

import React from 'react';
import Link from 'next/link';
import { ServiceCategory } from '@/lib/types';
import {
  Users, Compass, Heart, BookOpen, Activity, Gamepad, Sparkles, Shield,
  Star, ArrowRight, Eye, Edit3, Trash2, CheckCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';

interface CategoryCardProps {
  category: ServiceCategory;
  isAdmin?: boolean;
  onEdit?: (cat: ServiceCategory) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  onToggleFeatured?: (id: string) => void;
  onViewDetails?: (cat: ServiceCategory) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Gamepad: <Gamepad className="w-5 h-5" />,
};

const RISK_BADGE: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  LOW: { label: 'Low Risk', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', icon: <ShieldCheck className="w-3 h-3" /> },
  MEDIUM: { label: 'Medium Risk', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400', icon: <AlertTriangle className="w-3 h-3" /> },
  HIGH: { label: 'High Governance', color: 'bg-rose-500/10 border-rose-500/30 text-rose-400', icon: <Shield className="w-3 h-3" /> },
  CRITICAL: { label: 'Strict Protocol', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400', icon: <Shield className="w-3 h-3" /> },
};

export function CategoryCard({
  category,
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onViewDetails
}: CategoryCardProps) {
  const icon = ICON_MAP[category.iconName] || <Sparkles className="w-5 h-5" />;
  const riskInfo = RISK_BADGE[category.riskLevel] || RISK_BADGE.LOW;

  return (
    <div className={`glass-card rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden group hover:shadow-2xl ${category.isActive ? 'border-slate-800 hover:border-indigo-500/50' : 'border-rose-900/40 opacity-70 bg-rose-950/10'}`}>
      {/* Banner / Header */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-900">
        <img
          src={category.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'}
          alt={category.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-1 rounded-full border backdrop-blur-md text-[10px] font-extrabold flex items-center gap-1 ${riskInfo.color}`}>
              {riskInfo.icon} {riskInfo.label}
            </span>
            {category.isFeatured && (
              <span className="px-2.5 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 backdrop-blur-md text-[10px] font-extrabold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> Featured
              </span>
            )}
          </div>

          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700 backdrop-blur-md text-slate-300 text-[10px] font-mono font-bold">
            {category.baseRateMultiplier}x Base Rate
          </span>
        </div>

        {/* Icon & Title */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3 pointer-events-none">
          <div className="p-3 rounded-2xl bg-indigo-600/90 text-white shadow-lg border border-indigo-400/40 backdrop-blur-md shrink-0">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-white text-lg truncate leading-tight">{category.name}</h3>
            <p className="text-[11px] text-slate-300 font-medium">{category.companionCount} Companions Available</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{category.description}</p>

        {/* Subcategories preview */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {category.subcategories.length} Sub-Services Included
            </span>
            <div className="flex flex-wrap gap-1">
              {category.subcategories.slice(0, 3).map((sub) => (
                <span
                  key={sub.id}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                >
                  {sub.name} (${sub.basePrice}/hr)
                </span>
              ))}
              {category.subcategories.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
                  +{category.subcategories.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Admin Controls / User Link */}
        <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {isAdmin ? (
            <>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onToggleActive?.(category.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${category.isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {category.isActive ? 'Active' : 'Disabled'}
                </button>
                <button
                  onClick={() => onToggleFeatured?.(category.id)}
                  className={`p-1.5 rounded-xl border text-xs transition-all ${category.isFeatured ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                  title="Toggle Featured"
                >
                  <Star className={`w-3.5 h-3.5 ${category.isFeatured ? 'fill-amber-400' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-1">
                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(category)}
                    className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs"
                    title="View Full Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(category)}
                    className="p-1.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition-all text-xs"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(category.id)}
                    className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all text-xs"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(category)}
                  className="text-xs text-slate-400 hover:text-white font-semibold flex items-center gap-1"
                >
                  Details <Eye className="w-3.5 h-3.5 text-indigo-400" />
                </button>
              )}
              <Link
                href={`/companion?category=${encodeURIComponent(category.name)}`}
                className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1 ml-auto"
              >
                Browse Companions <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
