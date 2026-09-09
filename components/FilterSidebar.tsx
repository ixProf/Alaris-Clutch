'use client';

import React from 'react';
import { CATEGORY_DEFINITIONS } from '@/lib/multi-classifier';
import { Search, MapPin, Briefcase, Calendar, X, SlidersHorizontal, Check } from 'lucide-react';

export interface FilterState {
  search: string;
  categories: string[];
  locationGroup: 'all' | 'remote' | 'egypt-onsite' | 'other';
  experience: 'all' | 'junior' | 'mid' | 'senior';
  ageBucket: 'all' | '24h' | '1week' | 'older';
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  categoryCounts: Record<string, number>;
  locationCounts: { remote: number; egyptOnsite: number; other: number };
  experienceCounts: { junior: number; mid: number; senior: number };
  totalJobs: number;
}

export function FilterSidebar({
  filters,
  onChange,
  categoryCounts,
  locationCounts,
  experienceCounts,
  totalJobs,
}: FilterSidebarProps) {
  const toggleCategory = (categoryId: string) => {
    const nextCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];

    onChange({ ...filters, categories: nextCategories });
  };

  const handleReset = () => {
    onChange({
      search: '',
      categories: [],
      locationGroup: 'all',
      experience: 'all',
      ageBucket: 'all',
    });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.categories.length > 0 ||
    filters.locationGroup !== 'all' ||
    filters.experience !== 'all' ||
    filters.ageBucket !== 'all';

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-5">
      {/* Header & Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EEEEEE]">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#5E6AD2]" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-[#8A8F98] hover:text-[#EEEEEE] transition"
          >
            <X className="h-3 w-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8F98]" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Filter by title, skill, company..."
          className="w-full rounded-md bg-[#151619] border border-[rgba(255,255,255,0.08)] pl-9 pr-3 py-2 text-xs text-[#EEEEEE] placeholder-[#8A8F98] focus:border-[#5E6AD2] focus:outline-none focus:ring-1 focus:ring-[#5E6AD2] transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8F98] hover:text-[#EEEEEE]"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Technology Categories (Multi-select) */}
      <div className="rounded-md bg-[#151619] border border-[rgba(255,255,255,0.08)] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#EEEEEE]">
          <span>Tech Domain</span>
          {filters.categories.length > 0 && (
            <span className="rounded bg-[#1F2024] px-1.5 py-0.5 text-[10px] text-[#EEEEEE] border border-[rgba(255,255,255,0.08)]">
              {filters.categories.length}
            </span>
          )}
        </div>

        <div className="flex flex-col space-y-0.5 max-h-64 overflow-y-auto pr-1">
          {CATEGORY_DEFINITIONS.map((cat) => {
            const isSelected = filters.categories.includes(cat.id);
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition text-left ${
                  isSelected
                    ? 'bg-[#1F2024] text-[#EEEEEE] font-medium border border-[rgba(255,255,255,0.12)]'
                    : 'text-[#8A8F98] hover:bg-[#1F2024] hover:text-[#EEEEEE]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border transition ${
                      isSelected
                        ? 'border-[#5E6AD2] bg-[#5E6AD2] text-white'
                        : 'border-[rgba(255,255,255,0.2)] bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                  <span>{cat.name}</span>
                </div>
                <span className="text-[10px] font-mono text-[#8A8F98]">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location / Remote Grouping */}
      <div className="rounded-md bg-[#151619] border border-[rgba(255,255,255,0.08)] p-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#EEEEEE]">
          <MapPin className="h-3 w-3 text-[#8A8F98]" />
          <span>Location</span>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {[
            { key: 'all', label: 'All', count: totalJobs },
            { key: 'remote', label: 'Remote', count: locationCounts.remote },
            { key: 'egypt-onsite', label: 'Egypt', count: locationCounts.egyptOnsite },
            { key: 'other', label: 'Other', count: locationCounts.other },
          ].map((loc) => {
            const isSelected = filters.locationGroup === loc.key;
            return (
              <button
                key={loc.key}
                onClick={() => onChange({ ...filters, locationGroup: loc.key as any })}
                className={`flex flex-col items-start rounded p-2 text-left transition border ${
                  isSelected
                    ? 'border-[#5E6AD2] bg-[#1F2024] text-[#EEEEEE] font-medium'
                    : 'border-transparent bg-[#111215] text-[#8A8F98] hover:bg-[#1F2024] hover:text-[#EEEEEE]'
                }`}
              >
                <span className="text-xs">{loc.label}</span>
                <span className="text-[10px] text-[#8A8F98] font-mono">{loc.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="rounded-md bg-[#151619] border border-[rgba(255,255,255,0.08)] p-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#EEEEEE]">
          <Briefcase className="h-3 w-3 text-[#8A8F98]" />
          <span>Experience</span>
        </div>

        <div className="flex flex-col space-y-0.5">
          {[
            { key: 'all', label: 'Any Experience', count: totalJobs },
            { key: 'junior', label: 'Junior (0–2 yrs)', count: experienceCounts.junior },
            { key: 'mid', label: 'Mid-Level (3–5 yrs)', count: experienceCounts.mid },
            { key: 'senior', label: 'Senior (5+ yrs)', count: experienceCounts.senior },
          ].map((exp) => {
            const isSelected = filters.experience === exp.key;
            return (
              <button
                key={exp.key}
                onClick={() => onChange({ ...filters, experience: exp.key as any })}
                className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition ${
                  isSelected
                    ? 'bg-[#1F2024] text-[#EEEEEE] font-medium border border-[rgba(255,255,255,0.12)]'
                    : 'text-[#8A8F98] hover:bg-[#1F2024] hover:text-[#EEEEEE]'
                }`}
              >
                <span>{exp.label}</span>
                <span className="text-[10px] font-mono text-[#8A8F98]">{exp.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Posted */}
      <div className="rounded-md bg-[#151619] border border-[rgba(255,255,255,0.08)] p-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#EEEEEE]">
          <Calendar className="h-3 w-3 text-[#8A8F98]" />
          <span>Date Posted</span>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {[
            { key: 'all', label: 'All' },
            { key: '24h', label: 'Past 24h' },
            { key: '1week', label: 'Past 7d' },
            { key: 'older', label: 'Older' },
          ].map((time) => {
            const isSelected = filters.ageBucket === time.key;
            return (
              <button
                key={time.key}
                onClick={() => onChange({ ...filters, ageBucket: time.key as any })}
                className={`rounded py-1.5 px-2 text-xs transition text-center border ${
                  isSelected
                    ? 'border-[#5E6AD2] bg-[#1F2024] text-[#EEEEEE] font-medium'
                    : 'border-transparent bg-[#111215] text-[#8A8F98] hover:bg-[#1F2024] hover:text-[#EEEEEE]'
                }`}
              >
                {time.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
