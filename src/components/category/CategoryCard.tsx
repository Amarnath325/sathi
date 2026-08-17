'use client';

import React from 'react';
import Link from 'next/link';
import { ServiceCategory } from '@/lib/types';
import {
  Users, MapPin, Compass, Heart, GraduationCap, Dumbbell, Gamepad2, Sparkles,
  Star, ArrowRight, Eye, Edit2, Trash2
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

  if (name.includes('event') || name.includes('hospitality') || name.includes('community') || name.includes('home') || icon === 'Users') {
    return <Users className="w-3.5 h-3.5" />;
  }
  if (name.includes('travel') || name.includes('guide') || name.includes('explore') || icon === 'Compass' || icon === 'MapPin') {
    return <MapPin className="w-3.5 h-3.5" />;
  }
  if (name.includes('care') || name.includes('elder') || name.includes('assist') || icon === 'Heart') {
    return <Heart className="w-3.5 h-3.5" />;
  }
  if (name.includes('edu') || name.includes('study') || name.includes('career') || name.includes('work') || icon === 'BookOpen' || icon === 'GraduationCap') {
    return <GraduationCap className="w-3.5 h-3.5" />;
  }
  if (name.includes('fit') || name.includes('sport') || name.includes('wellness') || icon === 'Activity' || icon === 'Dumbbell') {
    return <Dumbbell className="w-3.5 h-3.5" />;
  }
  if (name.includes('game') || name.includes('esport') || name.includes('entertainment') || icon === 'Gamepad' || icon === 'Gamepad2') {
    return <Gamepad2 className="w-3.5 h-3.5" />;
  }
  return <Sparkles className="w-3.5 h-3.5" />;
};

const getRiskBadge = (level: string) => {
  switch (level?.toUpperCase()) {
    case 'LOW':
      return {
        label: 'Low Risk',
        badgeClass: 'bg-emerald-600/90 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full shadow-sm backdrop-blur-md flex items-center gap-0.5'
      };
    case 'MEDIUM':
      return {
        label: 'Medium Risk',
        badgeClass: 'bg-amber-500/90 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full shadow-sm backdrop-blur-md flex items-center gap-0.5'
      };
    case 'HIGH':
    case 'CRITICAL':
      return {
        label: 'Strict Protocol',
        badgeClass: 'bg-rose-500/90 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full shadow-sm backdrop-blur-md flex items-center gap-0.5'
      };
    default:
      return {
        label: 'Low Risk',
        badgeClass: 'bg-emerald-600/90 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full shadow-sm backdrop-blur-md flex items-center gap-0.5'
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
    <div className={`rounded-xl border transition-all duration-300 flex flex-col overflow-hidden group hover:shadow-md ${
      category.isActive
        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-75'
    }`}>
      {/* Banner / Cover Header - Very Compact Height */}
      <div className="relative h-20 overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={category.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none z-10">
          <span className={riskBadge.badgeClass}>
            {riskBadge.label}
          </span>

          {category.isFeatured && (
            <span className="px-1.5 py-0.5 rounded-full bg-white/95 dark:bg-slate-900/90 text-amber-600 dark:text-amber-400 backdrop-blur-md text-[8px] font-extrabold flex items-center gap-0.5 shadow-sm border border-amber-300/40">
              <Star className="w-2 h-2 fill-amber-400 text-amber-400" /> Featured
            </span>
          )}
        </div>

        {/* Floating Circular Icon Badge */}
        <div className="absolute -bottom-3 left-3 z-20 w-7 h-7 rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 flex items-center justify-center border-2 border-white dark:border-slate-900">
          {icon}
        </div>
      </div>

      {/* Card Content Body - Tight & Compact */}
      <div className="pt-3 px-3 pb-2.5 flex-1 flex flex-col justify-between gap-1.5">
        <div className="space-y-0.5">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight leading-tight truncate" title={category.name}>
            {category.name}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-tight">
            {category.description}
          </p>

          {/* Companions Available Stats */}
          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 pt-0.5">
            <Users className="w-3 h-3" />
            <span>{category.companionCount || 15} Companions</span>
          </div>
        </div>

        {/* Sub-Services Pricing Pills */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {category.subcategories.slice(0, 2).map((sub) => (
              <div
                key={sub.id}
                className="flex-1 min-w-[75px] bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 rounded-md p-1 flex flex-col justify-between"
              >
                <span className="text-[8px] text-slate-500 dark:text-slate-400 font-medium truncate" title={sub.name}>
                  {sub.name}
                </span>
                <span className="text-[10px] font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  ₹{sub.basePrice ? (sub.basePrice * 15).toLocaleString() : '1,200'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Card Footer / Controls */}
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-0.5">
          {isAdmin ? (
            <>
              {/* Toggle Switch */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onToggleActive?.(category.id)}
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    category.isActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  title={category.isActive ? 'Deactivate Category' : 'Activate Category'}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      category.isActive ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(category)}
                    className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(category.id)}
                    className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(category)}
                  className="text-[10px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold flex items-center gap-0.5"
                >
                  Details <Eye className="w-2.5 h-2.5" />
                </button>
              )}
              <Link
                href={`/companion?category=${encodeURIComponent(category.name)}`}
                className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold transition-all flex items-center gap-0.5 shadow-sm ml-auto"
              >
                Browse <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
