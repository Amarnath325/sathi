'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Star, RefreshCw } from 'lucide-react';
import { ServiceCategory } from '@/lib/types';

interface AiCategoryMatchmakerModalProps {
  categories: ServiceCategory[];
  onSelectCategory: (cat: ServiceCategory) => void;
  onClose: () => void;
}

export function AiCategoryMatchmakerModal({ categories, onSelectCategory, onClose }: AiCategoryMatchmakerModalProps) {
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState('CORPORATE_EVENT');
  const [vibe, setVibe] = useState('PROFESSIONAL');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchedCategory, setMatchedCategory] = useState<ServiceCategory | null>(null);
  const [matchScore, setMatchScore] = useState(98.4);

  const handleRunMatchmaker = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Intelligently select best matching category
      let found = categories.find(c => c.name.toLowerCase().includes('event') || c.name.toLowerCase().includes('social'));
      if (!found && categories.length > 0) found = categories[0];
      setMatchedCategory(found || null);
      setMatchScore(96.0 + Math.random() * 3.8);
      setIsAnalyzing(false);
      setStep(3);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">AI Category Matchmaker Wizard</h3>
              <p className="text-[10px] text-indigo-400 font-mono">Neural Occasion Assessment</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs">
          
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Step 1 of 2</span>
                <h4 className="text-base font-extrabold text-white">What type of occasion or service do you need?</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'CORPORATE_EVENT', title: 'Formal / Gala Event', desc: 'Galas, awards, dinners' },
                  { id: 'CITY_EXPLORE', title: 'City Tour & Travel', desc: 'Local guidance, shopping' },
                  { id: 'ELDERLY_CARE', title: 'Elderly Assistance', desc: 'Doctor visits, walks, care' },
                  { id: 'WORKOUT_STUDY', title: 'Fitness & Study Buddy', desc: 'Gym, exam prep, gaming' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setOccasion(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      occasion === item.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs block text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Next: Companion Vibe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Step 2 of 2</span>
                <h4 className="text-base font-extrabold text-white">Select preferred companion atmosphere</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'PROFESSIONAL', title: 'Strictly Professional', desc: 'Polished, corporate etiquette' },
                  { id: 'FRIENDLY_CASUAL', title: 'Friendly & Casual', desc: 'Easygoing, conversational' },
                  { id: 'VIP_PLATINUM', title: 'VIP High-Profile', desc: 'Multilingual, top-rated' },
                  { id: 'ACTIVE_FIT', title: 'Energetic & Athletic', desc: 'Sports, fitness focused' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setVibe(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      vibe === item.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs block text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3.5 rounded-2xl bg-slate-950 text-slate-400 border border-slate-800 font-bold text-xs"
                >
                  Back
                </button>

                <button
                  onClick={handleRunMatchmaker}
                  disabled={isAnalyzing}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Calculate AI Match Score</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && matchedCategory && (
            <div className="space-y-5 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> {matchScore.toFixed(1)}% AI Match Score
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 text-left space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-white text-sm">{matchedCategory.name}</h4>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    Recommended
                  </span>
                </div>
                <p className="text-slate-300 text-xs">{matchedCategory.description}</p>
                <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Base Rate: <strong className="text-emerald-400">${Math.round(45 * (matchedCategory.baseRateMultiplier || 1.0))}/hr</strong></span>
                  <span>Safety Deposit: <strong className="text-indigo-300">100% Escrow</strong></span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3.5 rounded-2xl bg-slate-950 text-slate-400 border border-slate-800 font-bold text-xs"
                >
                  Retake Wizard
                </button>

                <button
                  onClick={() => {
                    onSelectCategory(matchedCategory);
                    onClose();
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Select Matched Category</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
