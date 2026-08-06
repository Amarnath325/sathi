'use client';

import React from 'react';
import { AvailabilityGrid as AvGrid } from '@/lib/types';

interface Props {
  availability: AvGrid;
  editable?: boolean;
  onChange?: (grid: AvGrid) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(h: number) {
  if (h === 0) return '12am';
  if (h === 12) return '12pm';
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

export function AvailabilityGrid({ availability, editable = false, onChange }: Props) {
  const toggle = (day: string, hour: number) => {
    if (!editable || !onChange) return;
    const current = availability[day] || [];
    const updated = current.includes(hour)
      ? current.filter(h => h !== hour)
      : [...current, hour].sort((a, b) => a - b);
    onChange({ ...availability, [day]: updated });
  };

  // Show only hours 6-23 to save space
  const visibleHours = HOURS.filter(h => h >= 6);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Header row */}
        <div className="flex items-center mb-1">
          <div className="w-10 shrink-0" />
          {visibleHours.map(h => (
            <div
              key={h}
              className={`text-center text-[8px] text-slate-500 font-medium shrink-0 ${h % 3 === 0 ? 'w-6' : 'w-6 opacity-0'}`}
            >
              {h % 3 === 0 ? formatHour(h) : ''}
            </div>
          ))}
        </div>

        {/* Day rows */}
        {DAYS.map(day => {
          const activeHours = new Set(availability[day] || []);
          const count = activeHours.size;
          return (
            <div key={day} className="flex items-center mb-1 gap-0.5">
              <div className="w-10 text-[11px] font-bold text-slate-400 shrink-0">{day}</div>
              {visibleHours.map(h => {
                const isActive = activeHours.has(h);
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => toggle(day, h)}
                    disabled={!editable}
                    className={`w-6 h-5 rounded-sm transition-all shrink-0
                      ${isActive
                        ? 'bg-indigo-500 hover:bg-indigo-400'
                        : 'bg-slate-800 hover:bg-slate-700'}
                      ${!editable ? 'cursor-default' : 'cursor-pointer'}
                    `}
                    title={`${day} ${formatHour(h)}`}
                  />
                );
              })}
              <span className="ml-2 text-[10px] text-slate-500 shrink-0">{count}h</span>
            </div>
          );
        })}

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-indigo-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-slate-800" />
            <span>Unavailable</span>
          </div>
          {editable && <span className="text-indigo-400">Click to toggle slots</span>}
        </div>
      </div>
    </div>
  );
}
