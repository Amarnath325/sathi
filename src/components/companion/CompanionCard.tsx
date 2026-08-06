'use client';

import React from 'react';
import Link from 'next/link';
import { UserProfile } from '@/lib/types';
import { CompanionStatusBadge } from './CompanionStatusBadge';
import {
  Star, MapPin, Globe, Clock, CheckCircle2, ShieldCheck,
  Zap, Heart, MessageSquare, ArrowRight, Award
} from 'lucide-react';

interface Props {
  companion: UserProfile;
  onSave?: (id: string) => void;
  isSaved?: boolean;
  showActions?: boolean;
  variant?: 'grid' | 'list';
}

export function CompanionCard({ companion, onSave, isSaved = false, showActions = true, variant = 'grid' }: Props) {
  if (variant === 'list') {
    return (
      <div className="glass-card rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 p-4 flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={companion.avatar}
            alt={companion.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          {companion.isAvailableNow && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-white text-sm">{companion.name}, {companion.age}</h3>
            {companion.verificationBadge && <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />}
            {companion.status && <CompanionStatusBadge status={companion.status} />}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-indigo-400" /> {companion.city}, {companion.country}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {companion.categories.slice(0, 2).map((cat, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600/15 border border-indigo-500/20 text-indigo-300">{cat}</span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0 space-y-1">
          <div className="text-white font-black text-lg">${companion.hourlyRate}<span className="text-slate-500 font-normal text-xs">/hr</span></div>
          <div className="flex items-center gap-1 text-amber-400 justify-end">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="text-xs font-bold">{companion.ratingAvg}</span>
            <span className="text-slate-500 text-[10px]">({companion.ratingCount})</span>
          </div>
          <Link href={`/companion/${companion.id}`} className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
            View <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 group overflow-hidden flex flex-col">
      {/* Photo */}
      <div className="relative overflow-hidden h-52">
        <img
          src={companion.avatar}
          alt={companion.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {companion.verificationBadge && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-indigo-500/40 text-indigo-300 text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
          {companion.isAvailableNow && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
              <Zap className="w-3 h-3" /> Available Now
            </span>
          )}
        </div>

        {/* Save button */}
        {onSave && (
          <button
            onClick={() => onSave(companion.id)}
            className={`absolute top-3 right-3 p-1.5 rounded-xl backdrop-blur-md border transition-all
              ${isSaved ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:text-white'}`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
          </button>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base leading-tight">{companion.name}, {companion.age}</h3>
              <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-indigo-400" />{companion.city}, {companion.country}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-black text-lg">${companion.hourlyRate}</p>
              <p className="text-[10px] text-slate-400">/hour</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Rating & Response */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold text-white">{companion.ratingAvg}</span>
            <span className="text-slate-500">({companion.ratingCount} reviews)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{companion.responseTimeMin} min response</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {companion.categories.slice(0, 3).map((cat, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600/15 border border-indigo-500/20 text-indigo-300 font-medium">
              {cat}
            </span>
          ))}
        </div>

        {/* Languages */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Globe className="w-3 h-3 text-slate-500" />
          {companion.languages.join(' · ')}
        </div>

        {/* Status */}
        {companion.status && (
          <div className="flex items-center gap-2">
            <CompanionStatusBadge status={companion.status} />
            <span className="text-[10px] text-slate-500">{companion.completedBookings} bookings</span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-auto pt-1">
            <Link
              href={`/companion/${companion.id}`}
              className="flex-1 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs text-center hover:opacity-90 transition-all flex items-center justify-center gap-1"
            >
              View Profile <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/chat"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
