'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export type PageSizeOption = 10 | 12 | 25 | 50 | 100 | 'All';

export interface SearchAndLimitBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  pageSize: PageSizeOption;
  onPageSizeChange: (size: PageSizeOption) => void;
  placeholder?: string;
  sortBy?: string;
  onSortChange?: (sortVal: string) => void;
  sortOptions?: { label: string; value: string }[];
  extraControls?: React.ReactNode;
}

export function SearchAndLimitBar({
  searchQuery,
  onSearchChange,
  pageSize,
  onPageSizeChange,
  placeholder = 'Search records...',
  sortBy,
  onSortChange,
  sortOptions,
  extraControls
}: SearchAndLimitBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      {/* Search Bar + Limit Dropdown (Right Next to Search) */}
      <div className="flex items-center gap-2 flex-1 min-w-[280px]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Page Size / Limit Dropdown (DIRECTLY RIGHT SIDE OF SEARCH) */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 shrink-0 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const val = e.target.value;
              onPageSizeChange(val === 'All' ? 'All' : (Number(val) as PageSizeOption));
            }}
            className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
          >
            <option value={10} className="bg-slate-900 text-white">10</option>
            <option value={12} className="bg-slate-900 text-white">12</option>
            <option value={25} className="bg-slate-900 text-white">25</option>
            <option value={50} className="bg-slate-900 text-white">50</option>
            <option value={100} className="bg-slate-900 text-white">100</option>
            <option value="All" className="bg-slate-900 text-white">All</option>
          </select>
        </div>

        {/* Optional Sort By Dropdown */}
        {sortBy !== undefined && onSortChange && sortOptions && sortOptions.length > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 shrink-0 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {extraControls && <div className="flex items-center gap-2">{extraControls}</div>}
    </div>
  );
}

export interface PaginationFooterProps {
  currentPage: number;
  totalItems: number;
  pageSize: PageSizeOption;
  onPageChange: (page: number) => void;
  labelSingular?: string;
  labelPlural?: string;
}

export function PaginationFooter({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  labelSingular = 'entry',
  labelPlural = 'entries'
}: PaginationFooterProps) {
  if (totalItems === 0) return null;

  const numericPageSize = pageSize === 'All' ? totalItems : pageSize;
  const totalPages = Math.ceil(totalItems / numericPageSize) || 1;
  const startIndex = Math.min((currentPage - 1) * numericPageSize + 1, totalItems);
  const endIndex = Math.min(currentPage * numericPageSize, totalItems);

  // Generate page numbers
  const pageNumbers: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 text-xs">
      {/* Label Summary */}
      <div className="text-slate-400 font-medium">
        Showing <strong className="text-white font-mono">{startIndex}</strong> to{' '}
        <strong className="text-white font-mono">{endIndex}</strong> of{' '}
        <strong className="text-indigo-400 font-mono">{totalItems}</strong> {totalItems === 1 ? labelSingular : labelPlural}
      </div>

      {/* Page Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Number Buttons */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className={`px-3 py-1.5 rounded-xl font-bold font-mono transition-all ${
                  currentPage === 1
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-1 text-slate-600 font-bold">...</span>}
            </>
          )}

          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 rounded-xl font-bold font-mono transition-all ${
                currentPage === p
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-1 text-slate-600 font-bold">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className={`px-3 py-1.5 rounded-xl font-bold font-mono transition-all ${
                  currentPage === totalPages
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
