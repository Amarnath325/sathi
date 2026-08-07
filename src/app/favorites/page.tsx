'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin, ShieldCheck, ArrowRight, Trash2 } from 'lucide-react';
import { MOCK_COMPANIONS } from '@/lib/mockData';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(MOCK_COMPANIONS.slice(0, 3));

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> My Saved Favorites
          </h1>
          <p className="text-xs text-slate-400">Quickly access and book your saved verified companions.</p>
        </div>

        <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/30">
          {favorites.length} SAVED
        </span>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(comp => (
            <div key={comp.id} className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
              
              <div className="space-y-3">
                {/* Photo & Remove button */}
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <img src={comp.avatar} alt={comp.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  <button
                    onClick={() => handleRemoveFavorite(comp.id)}
                    title="Remove from favorites"
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-rose-400 hover:bg-rose-600 hover:text-white transition-all border border-rose-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-amber-500/30">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {comp.ratingAvg} ({comp.ratingCount})
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-lg font-bold text-white">{comp.name}, {comp.age}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {comp.city}, {comp.country}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(comp.categories || ['Travel Companion', 'Conversation']).map((cat, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Rate</span>
                  <span className="text-base font-extrabold text-white font-mono">${comp.hourlyRate}/hr</span>
                </div>

                <Link
                  href={`/companion/${comp.id}`}
                  className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold hover:opacity-95 flex items-center gap-1 shadow-md shadow-indigo-600/30"
                >
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Saved Companions Yet</h3>
          <p className="text-xs text-slate-400">Click the ♡ Save icon on any companion card to bookmark them here.</p>
          <Link
            href="/search"
            className="inline-block px-6 py-3 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs"
          >
            Explore Marketplace
          </Link>
        </div>
      )}

    </div>
  );
}
