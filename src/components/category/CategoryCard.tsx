'use client';

import React from 'react';
import Link from 'next/link';
import { ServiceCategory } from '@/lib/types';
import {
  Users, MapPin, Compass, Heart, GraduationCap, Dumbbell, Gamepad2, Sparkles, Shield,
  Star, ArrowRight, Eye, Edit2, Trash2, ShieldCheck, AlertTriangle
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

const getCategoryIcon = (cat: ServiceCategory) => {
  const name = (cat.name || '').toLowerCase();
  const icon = cat.iconName;

  if (name.includes('event') || name.includes('hospitality') || icon === 'Users') {
    return <Users className="w-5 h-5" />;
  }
  if (name.includes('travel') || name.includes('guide') || name.includes('explore') || icon === 'Compass' || icon === 'MapPin') {
    return <MapPin className="w-5 h-5" />;
  }
  if (name.includes('elder') || name.includes('care') || name.includes('assist') || icon === 'Heart') {
    return <Heart className="w-5 h-5" />;
  }
  if (name.includes('edu') || name.includes('study') || name.includes('work') || icon === 'BookOpen' || icon === 'GraduationCap') {
    return <GraduationCap className="w-5 h-5" />;
  }
  if (name.includes('fit') || name.includes('sport') || name.includes('wellness') || icon === 'Activity' || icon === 'Dumbbell') {
    return <Dumbbell className="w-5 h-5" />;
  }
  if (name.includes('game') || name.includes('esport') || name.includes('entertainment') || icon === 'Gamepad' || icon === 'Gamepad2') {
    return <Gamepad2 className="w-5 h-5" />;
  }
  return <Sparkles className="w-5 h-5" />;
};

const getRiskBadge = (level: string) => {
  switch (level?.toUpperCase()) {
    case 'LOW':
      return {
        label: 'Low Risk',
        badgeClass: 'bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1'
      };
    case 'MEDIUM':
      return {
        label: 'Medium Risk',
        badgeClass: 'bg-amber-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1'
      };
    case 'HIGH':
    case 'CRITICAL':
      return {
        label: 'Strict Protocol',
        badgeClass: 'bg-rose-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1'
      };
    default:
      return {
        label: 'Low Risk',
        badgeClass: 'bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1'
      };
  }
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
  const riskBadge = getRiskBadge(category.riskLevel);
  const icon = getCategoryIcon(category);

  return (
    <div className={`rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden group hover:shadow-xl ${
      category.isActive
        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-75'
    }`}>
      {/* Banner / Cover Header */}
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={category.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className={riskBadge.badgeClass}>
            {riskBadge.label}
          </span>

          {category.isFeatured && (
            <span className="px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 text-amber-600 dark:text-amber-400 backdrop-blur-md text-[10px] font-extrabold flex items-center gap-1 shadow-md border border-amber-300/40">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Featured
            </span>
          )}
        </div>

        {/* Floating Circular Icon Badge */}
        <div className="absolute -bottom-5 left-5 z-20 w-11 h-11 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center border-2 border-white dark:border-slate-900">
          {icon}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="pt-7 px-5 pb-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight leading-snug">
            {category.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {category.description}
          </p>

          {/* Companions Available Stats */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
            <Users className="w-4 h-4" />
            <span>{category.companionCount || 15} Companions Available</span>
          </div>
        </div>

        {/* Sub-Services Pricing Pills */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {category.subcategories.slice(0, 2).map((sub) => (
              <div
                key={sub.id}
                className="flex-1 min-w-[110px] bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-2 flex flex-col justify-between"
              >
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  {sub.name}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  ₹{sub.basePrice ? (sub.basePrice * 15).toLocaleString() : '1,200'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Card Footer / Controls */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          {isAdmin ? (
            <>
              {/* Toggle Switch */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleActive?.(category.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    category.isActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  title={category.isActive ? 'Deactivate Category' : 'Activate Category'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      category.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {onEdit && (
                  <button
                    onClick={() => onEdit(category)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(category.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(category)}
                  className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold flex items-center gap-1"
                >
                  View Details <Eye className="w-3.5 h-3.5" />
                </button>
              )}
              <Link
                href={`/companion?category=${encodeURIComponent(category.name)}`}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-indigo-600/20 ml-auto"
              >
                Browse <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

