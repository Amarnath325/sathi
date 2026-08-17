'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ServiceCategory } from '@/lib/types';
import { ImageLightboxModal } from '@/components/common/ImageLightboxModal';
import {
  X, ShieldCheck, AlertTriangle, Shield, CheckCircle, ArrowRight,
  DollarSign, Users, Calendar, Info, Layers, Maximize2
} from 'lucide-react';

interface CategoryDetailsModalProps {
  isOpen: boolean;
  category: ServiceCategory | null;
  onClose: () => void;
}

export function CategoryDetailsModal({ isOpen, category, onClose }: CategoryDetailsModalProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!isOpen || !category) return null;

  const bannerImg = category.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden animate-fade-in">
          {/* Banner */}
          <div
            className="relative h-60 sm:h-72 bg-slate-950 cursor-pointer group"
            onClick={() => setLightboxImage(bannerImg)}
            title="Click to preview full size image"
          >
            <img
              src={bannerImg}
              alt={category.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Hover Badge */}
            <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-xl">
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" /> Click to Preview Full Size
              </span>
            </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/90 text-white font-bold text-[10px] uppercase tracking-wider">
                {category.riskLevel} Risk Level
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 font-mono text-[10px]">
                {category.baseRateMultiplier}x Multiplier
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{category.name}</h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] text-xs">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
            <p className="text-slate-300 leading-relaxed text-sm">{category.description}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Companions</span>
              <span className="text-sm font-bold text-white">{category.companionCount} Available</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Min Age</span>
              <span className="text-sm font-bold text-white">{category.minAgeLimit}+ Years</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Featured</span>
              <span className="text-sm font-bold text-amber-400">{category.isFeatured ? 'Yes ⭐' : 'Standard'}</span>
            </div>
          </div>

          {/* Subcategories Breakdown */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Available Sub-Services ({category.subcategories.length})
              </h4>
              <div className="space-y-2">
                {category.subcategories.map((sub) => (
                  <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{sub.name}</span>
                      <span className="font-mono font-bold text-emerald-400">${sub.basePrice}/hr</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{sub.description}</p>
                    {sub.requiredVerification && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 mt-1">
                        <ShieldCheck className="w-3 h-3 text-indigo-400" /> Verification Mandatory
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety & Governance Policy */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Safety & Governance Policy
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {category.safetyPolicy || 'Standard Sathi safety protocol applies. Live GPS tracking during active sessions and auto emergency SOS dispatch enabled.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs"
          >
            Close
          </button>
          <Link
            href={`/companion?category=${encodeURIComponent(category.name)}`}
            className="px-5 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs hover:opacity-90 flex items-center gap-1.5"
            onClick={onClose}
          >
            Find Companions in Category <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>

    {lightboxImage && (
      <ImageLightboxModal
        isOpen={!!lightboxImage}
        imageUrl={lightboxImage}
        title={`${category.name} Banner`}
        onClose={() => setLightboxImage(null)}
      />
    )}
  </>
  );
}
