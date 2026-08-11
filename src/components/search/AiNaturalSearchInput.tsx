'use client';

import React, { useState } from 'react';
import { Wand2, Sparkles, ArrowRight, Check } from 'lucide-react';

interface AiNaturalSearchInputProps {
  onApplyFilters: (parsed: {
    location?: string;
    category?: string;
    maxPrice?: number;
    language?: string;
  }) => void;
}

export function AiNaturalSearchInput({ onApplyFilters }: AiNaturalSearchInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedNotice, setParsedNotice] = useState<string | null>(null);

  const handleParsePrompt = () => {
    if (!prompt.trim()) return;
    setIsParsing(true);

    setTimeout(() => {
      const lower = prompt.toLowerCase();
      const result: { location?: string; category?: string; maxPrice?: number; language?: string } = {};

      if (lower.includes('raipur')) result.location = 'Raipur';
      else if (lower.includes('mumbai')) result.location = 'Mumbai';
      else if (lower.includes('delhi')) result.location = 'Delhi';

      if (lower.includes('event') || lower.includes('dinner') || lower.includes('gala')) result.category = 'Event Companion';
      else if (lower.includes('travel') || lower.includes('tour') || lower.includes('city')) result.category = 'Travel Companion';
      else if (lower.includes('elderly') || lower.includes('doctor')) result.category = 'Elderly Support';
      else if (lower.includes('study') || lower.includes('exam')) result.category = 'Study Partner';

      if (lower.includes('80')) result.maxPrice = 80;
      else if (lower.includes('50')) result.maxPrice = 50;
      else if (lower.includes('150')) result.maxPrice = 150;

      if (lower.includes('english')) result.language = 'English';
      else if (lower.includes('hindi')) result.language = 'Hindi';
      else if (lower.includes('spanish')) result.language = 'Spanish';

      onApplyFilters(result);
      setParsedNotice(`AI Parsed: ${result.category || 'Service'} in ${result.location || 'Location'} (Max $${result.maxPrice || 100}/hr)`);
      setIsParsing(false);
    }, 800);
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 font-mono">
          <Wand2 className="w-4 h-4 text-indigo-400 animate-pulse" /> AI Natural Language Companion Search
        </span>
        <span className="text-[10px] text-indigo-400/80 font-mono">Type prompt in natural language</span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Need a bilingual companion in Raipur for a corporate dinner under $80/hr..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
          onKeyDown={(e) => e.key === 'Enter' && handleParsePrompt()}
        />

        <button
          onClick={handleParsePrompt}
          disabled={isParsing}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-50"
        >
          {isParsing ? (
            <Sparkles className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>AI Parse</span>
            </>
          )}
        </button>
      </div>

      {parsedNotice && (
        <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/30 flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" /> {parsedNotice}
        </div>
      )}
    </div>
  );
}
