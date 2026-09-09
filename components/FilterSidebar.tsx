'use client';

import React from 'react';
import { CATEGORY_DEFINITIONS } from '@/lib/multi-classifier';
import { Search, MapPin, Briefcase, Calendar, X, SlidersHorizontal, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

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
  const { t, isRtl } = useI18n();

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
          <span>{t.dashboard.filters}</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-1 text-xs text-[#8A8F98] hover:text-[#EEEEEE] transition"
          >
            <X className="h-3 w-3" />
            <span>{t.dashboard.resetFilters}</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8F98] ${isRtl ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder={t.dashboard.searchPlaceholder}
          className={`w-full rounded-md bg-[#151619] border border-[rgba(255,255,255,0.08)] py-2 text-xs text-[#EEEEEE] placeholder-[#8A8F98] focus:border-[#5E6AD2] focus:outline-none focus:ring-1 focus:ring-[#5E6AD2] transition-colors ${
            isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
          }`}
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            type="button"
            className={`absolute top-1/2 -translate-y-1/2 text-[#8A8F98] hover:text-[#EEEEEE] ${isRtl ? 'left-2.5' : 'right-2.5'}`}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Technology Categories (Multi-select) */}
      <div className="rounded-md bg-[#151619] border border-[rgba(255,255,255,0.08)] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#EEEEEE]">
          <span>{t.filters.categories}</span>
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
            const localizedCatName = (t.categories as any)[cat.id] || cat.name;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition ${isRtl ? 'text-right' : 'text-left'} ${
                  isSelected
                    ? 'bg-[#1F2024] text-[#EEEEEE] font-medium border border-[rgba(255,255,255,0.12)]'
                    : 'text-[#8A8F98] hover:bg-[#1F2024] hover:text-[#EEEEEE]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border transition ${
                      isSelected
                        ? 'border-[#5E6AD2] bg-[#5E6AD2] text-white'
                        : 'border-[rgba(255,255,255,0.2)] bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                  <span className="truncate">{localizedCatName}</span>
                </div>
                <span className="text-[10px] font-mono text-[#8A8F98] shrink-0">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location / Remote Grouping */}
      <div className="rounded-md bg-[#151619] border border-[rgba(255,255,255,0.08)] p-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#EEEEEE]">
          <MapPin className="h-3 w-3 text-[#8A8F98]" />
          <span>{t.filters.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {[
            { key: 'all', label: t.filters.all, count: totalJobs },
            { key: 'remote', label: t.filters.remote, count: locationCounts.remote },
            { key: 'egypt-onsite', label: t.filters.egyptOnsite, count: locationCounts.egyptOnsite },
            { key: 'other', label: t.filters.otherLocation, count: locationCounts.other },
          ].map((loc) => {
            const isSelected = filters.locationGroup === loc.key;
            return (
              <button
                key={loc.key}
                type="button"
                onClick={() => onChange({ ...filters, locationGroup: loc.key as any })}
                className={`flex flex-col items-start rounded p-2 transition border ${isRtl ? 'text-right' : 'text-left'} ${
                  isSelected
                    ? 'border-[#5E6AD2] bg-[#1F2024] text-[#EEEEEE] font-medium'
                    : 'border-transparent bg-[#111215] text-[#8A8F98] hover:bg-[#1F2024] hover:text-[#EEEEEE]'
                }`}
              >
                <span className="text-xs truncate w-full">{loc.label}</span>
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
          <span>{t.filters.experience}</span>
        </div>

        <div className="flex flex-col space-y-0.5">
          {[
            { key: 'all', label: t.filters.all, count: totalJobs },
            { key: 'junior', label: t.filters.junior, count: experienceCounts.junior },
            { key: 'mid', label: t.filters.mid, count: experienceCounts.mid },
            { key: 'senior', label: t.filters.senior, count: experienceCounts.senior },
          ].map((exp) => {
            const isSelected = filters.experience === exp.key;
            return (
              <button
                key={exp.key}
                type="button"
                onClick={() => onChange({ ...filters, experience: exp.key as any })}
                className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition ${
                  isSelected
                    ? 'bg-[#1F2024] text-[#EEEEEE] font-medium border border-[rgba(255,255,255,0.12)]'
                    : 'text-[#8A8F98] hover:bg-[#1F2024] hover:text-[#EEEEEE]'
                }`}
              >
                <span className="truncate">{exp.label}</span>
                <span className="text-[10px] font-mono text-[#8A8F98] shrink-0">{exp.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Posted */}
      <div className="rounded-md bg-[#151619] border border-[rgba(255,255,255,0.08)] p-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#EEEEEE]">
          <Calendar className="h-3 w-3 text-[#8A8F98]" />
          <span>{t.filters.posted}</span>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {[
            { key: 'all', label: t.filters.all },
            { key: '24h', label: t.filters.age24h },
            { key: '1week', label: t.filters.age1week },
            { key: 'older', label: t.filters.ageOlder },
          ].map((time) => {
            const isSelected = filters.ageBucket === time.key;
            return (
              <button
                key={time.key}
                type="button"
                onClick={() => onChange({ ...filters, ageBucket: time.key as any })}
                className={`rounded py-1.5 px-2 text-xs transition text-center border truncate ${
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
