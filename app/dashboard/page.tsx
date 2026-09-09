'use client';

import React, { useState, useEffect, useCallback, useTransition, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FilterSidebar, FilterState } from '@/components/FilterSidebar';
import { JobCard } from '@/components/JobCard';
import { JobDetailModal } from '@/components/JobDetailModal';
import { ScraperStatusBanner } from '@/components/ScraperStatusBanner';
import { Button } from '@/components/Button';
import { JobRecord, JobsQueryResult } from '@/lib/db';
import { useI18n } from '@/lib/i18n/context';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
  Activity,
  Download,
} from 'lucide-react';

function DashboardContent() {
  const { t, locale, isRtl } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const boardRef = useRef<HTMLDivElement>(null);

  // Parse filters from URL
  const initialFilters: FilterState = {
    search: searchParams.get('q') || '',
    categories: searchParams.get('cat') ? searchParams.get('cat')!.split(',').filter(Boolean) : [],
    locationGroup: (searchParams.get('loc') as any) || 'all',
    experience: (searchParams.get('exp') as any) || 'all',
    ageBucket: (searchParams.get('age') as any) || 'all',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10));
  const [sortBy, setSortBy] = useState<'newest' | 'relevance'>('newest');

  const [data, setData] = useState<JobsQueryResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);

  // Sync state to URL params for /dashboard
  const syncToUrl = useCallback(
    (newFilters: FilterState, newPage: number) => {
      const params = new URLSearchParams();
      if (newFilters.search) params.set('q', newFilters.search);
      if (newFilters.categories.length > 0) params.set('cat', newFilters.categories.join(','));
      if (newFilters.locationGroup !== 'all') params.set('loc', newFilters.locationGroup);
      if (newFilters.experience !== 'all') params.set('exp', newFilters.experience);
      if (newFilters.ageBucket !== 'all') params.set('age', newFilters.ageBucket);
      if (newPage > 1) params.set('page', String(newPage));

      const query = params.toString();
      const url = query ? `/dashboard?${query}` : '/dashboard';
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [router]
  );

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.categories.length > 0) params.set('category', filters.categories.join(','));
      if (filters.locationGroup !== 'all') params.set('location', filters.locationGroup);
      if (filters.experience !== 'all') params.set('experience', filters.experience);
      if (filters.ageBucket !== 'all') params.set('posted', filters.ageBucket);
      params.set('page', String(page));
      params.set('limit', '12');
      params.set('sort', sortBy);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to load jobs');
      setData(json);
    } catch (err: any) {
      setError(err?.message || t.dashboard.errorFetching);
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortBy, t.dashboard.errorFetching]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    syncToUrl(newFilters, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    syncToUrl(filters, newPage);
    if (boardRef.current) {
      boardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const freshTodayCount =
    data?.jobs.filter((j) => {
      if (!j.postedAt) return false;
      const hours = (Date.now() - Date.parse(j.postedAt)) / 3600000;
      return hours <= 24;
    }).length || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8" ref={boardRef}>
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EEEEEE]">
            {t.dashboard.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8F98] mt-1 max-w-2xl">
            {t.dashboard.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/status">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#8A8F98]" />
              <span>{t.nav.status}</span>
            </Button>
          </Link>
          <a href="/api/export?format=xlsx">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>{t.nav.export}</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Scraper Status Banner */}
      <ScraperStatusBanner
        totalCount={data?.total || 0}
        freshCount={freshTodayCount}
        onRefresh={fetchJobs}
        isRefreshing={loading}
      />

      {/* Main Board Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          categoryCounts={data?.categoryCounts || {}}
          locationCounts={data?.locationCounts || { remote: 0, egyptOnsite: 0, other: 0 }}
          experienceCounts={data?.experienceCounts || { junior: 0, mid: 0, senior: 0 }}
          totalJobs={data?.total || 0}
        />

        {/* Right Job Listings Grid */}
        <main className="flex-1 w-full space-y-5">
          {/* Controls Bar: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] px-4 py-2.5">
            <div className="text-xs text-[#8A8F98]">
              {loading ? (
                <span className="animate-pulse">{t.dashboard.loading}</span>
              ) : (
                <span>
                  {t.dashboard.showingResults.replace('{count}', String(data?.total || 0))}
                </span>
              )}
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-2 text-xs text-[#8A8F98]">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.dashboard.sortBy}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded bg-[#1F2024] border border-[rgba(255,255,255,0.08)] px-2.5 py-1 text-xs text-[#EEEEEE] focus:border-[#5E6AD2] focus:outline-none cursor-pointer"
              >
                <option value="newest">{t.dashboard.sortNewest}</option>
                <option value="relevance">{t.dashboard.sortRelevance}</option>
              </select>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 rounded-md bg-[#E05252]/10 border border-[#E05252]/20 p-4 text-xs text-[#E05252]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <div className="flex-1">{error}</div>
              <Button variant="secondary" size="sm" onClick={fetchJobs}>
                {t.dashboard.retry}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && data?.jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] py-16 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F2024] mb-3 text-[#8A8F98]">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#EEEEEE]">
                {t.dashboard.noJobsFound}
              </h3>
              <p className="text-xs text-[#8A8F98] max-w-md mt-1">
                {t.dashboard.noJobsHint}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() =>
                  handleFilterChange({
                    search: '',
                    categories: [],
                    locationGroup: 'all',
                    experience: 'all',
                    ageBucket: 'all',
                  })
                }
              >
                {t.dashboard.resetFilters}
              </Button>
            </div>
          )}

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelectJob={(j) => setSelectedJob(j)}
              />
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] px-4 py-3 text-xs">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => handlePageChange(page - 1)}
                className="gap-1.5"
              >
                {isRtl ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                <span>{t.dashboard.previous}</span>
              </Button>

              <span className="text-[#8A8F98]">
                {t.dashboard.page} <strong className="text-[#EEEEEE] font-mono">{page}</strong> {t.dashboard.of}{' '}
                <strong className="text-[#EEEEEE] font-mono">{data.totalPages}</strong>
              </span>

              <Button
                variant="secondary"
                size="sm"
                disabled={page >= data.totalPages || loading}
                onClick={() => handlePageChange(page + 1)}
                className="gap-1.5"
              >
                <span>{t.dashboard.next}</span>
                {isRtl ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5E6AD2]"></div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
