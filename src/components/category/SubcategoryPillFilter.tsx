'use client';

import React from 'react';
import { Tag, Sparkles } from 'lucide-react';

interface SubcategoryPillFilterProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

const POPULAR_SUB_TAGS = [
  { id: 'ALL', label: 'All Services' },
  { id: 'Event', label: '#PublicEvents' },
  { id: 'Travel', label: '#CityGuide' },
  { id: 'Elderly', label: '#ElderlyEscort' },
  { id: 'Study', label: '#StudyBuddy' },
  { id: 'Gaming', label: '#GamingCoOp' },
  { id: 'Fitness', label: '#FitnessCompanion' }
];

export function SubcategoryPillFilter({ selectedTag, onSelectTag }: SubcategoryPillFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar text-xs">
      <span className="text-slate-500 font-mono flex items-center gap-1 shrink-0 font-bold">
        <Tag className="w-3.5 h-3.5 text-indigo-400" /> Trending Sub-Services:
      </span>

      {POPULAR_SUB_TAGS.map((tag) => {
        const isSelected = selectedTag === tag.id;
        return (
          <button
            key={tag.id}
            onClick={() => onSelectTag(tag.id)}
            className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap border shrink-0 ${
              isSelected
                ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
