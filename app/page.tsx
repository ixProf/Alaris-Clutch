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
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
  Layers,
  Cpu,
  ShieldCheck,
  ArrowDown,
  Activity,
} from 'lucide-react';

function JobBoardContent() {
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

  // Sync state to URL params
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
      const url = query ? `/?${query}` : '/';
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
      setError(err?.message || 'Error fetching jobs');
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortBy]);

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

  const scrollToBoard = () => {
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Landing Page Hero Section */}
      <section className="rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A8F98]">
          <span className="inline-flex items-center gap-1.5 rounded bg-[#1F2024] px-2.5 py-1 text-[#EEEEEE] border border-[rgba(255,255,255,0.08)] font-medium">
            <Layers className="h-3.5 w-3.5 text-[#5E6AD2]" />
            Alaris Space Product Family
          </span>
          <span>•</span>
          <span className="text-[#8A8F98]">Alongside Orbit, Nexus & FlowX</span>
          <span>•</span>
          <span className="inline-flex items-center rounded bg-[#1F2024] px-2 py-0.5 text-[11px] font-semibold text-[#5E6AD2] border border-[rgba(255,255,255,0.08)]">
            100% Free to Use
          </span>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#EEEEEE] tracking-tight leading-tight">
            Continuous Tech Job Intelligence
          </h1>
          <p className="text-sm sm:text-base text-[#8A8F98] leading-relaxed">
            Alaris Clutch is a free, automated job board that continuously aggregates, normalizes,
            and classifies software engineering roles from LinkedIn, Wuzzuf, Indeed, Arbeitnow, and Remotive.
            No paywalls, no sponsored spam, and no recruiter noise — just clean, structured data for engineers.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={scrollToBoard} className="gap-2">
            <span>Explore Open Roles</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>

          <Link href="/status">
            <Button variant="secondary" size="md" className="gap-2">
              <Activity className="h-3.5 w-3.5 text-[#8A8F98]" />
              <span>Pipeline Health & Sources</span>
            </Button>
          </Link>
        </div>

        {/* Core Capabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="rounded-md bg-[#111215] p-3.5 border border-[rgba(255,255,255,0.06)] space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#EEEEEE]">
              <Cpu className="h-3.5 w-3.5 text-[#5E6AD2]" />
              <span>Multi-Stack Classification</span>
            </div>
            <p className="text-xs text-[#8A8F98] leading-normal">
              Roles are tagged into .NET, Node.js, Python, Java, Frontend, Mobile, and DevOps without single-stack bias.
            </p>
          </div>

          <div className="rounded-md bg-[#111215] p-3.5 border border-[rgba(255,255,255,0.06)] space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#EEEEEE]">
              <Activity className="h-3.5 w-3.5 text-[#5E6AD2]" />
              <span>24/7 Automated Refresh</span>
            </div>
            <p className="text-xs text-[#8A8F98] leading-normal">
              Autonomous background worker scans active feeds every 30 minutes to capture new roles immediately.
            </p>
          </div>

          <div className="rounded-md bg-[#111215] p-3.5 border border-[rgba(255,255,255,0.06)] space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#EEEEEE]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#5E6AD2]" />
              <span>Strict Experience Gating</span>
            </div>
            <p className="text-xs text-[#8A8F98] leading-normal">
              Full descriptions parsed for experience requirements, deduplicated by URL and content fingerprint.
            </p>
          </div>
        </div>
      </section>

      {/* Main Board Section */}
      <div ref={boardRef} className="space-y-6 pt-2">
        {/* Scraper Status Banner */}
        <ScraperStatusBanner
          totalCount={data?.total || 0}
          freshCount={freshTodayCount}
          onRefresh={fetchJobs}
          isRefreshing={loading}
        />

        {/* Grid: Filter Sidebar + Listings */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            categoryCounts={data?.categoryCounts || {}}
            locationCounts={data?.locationCounts || { remote: 0, egyptOnsite: 0, other: 0 }}
            experienceCounts={data?.experienceCounts || { junior: 0, mid: 0, senior: 0 }}
            totalJobs={data?.total || 0}
          />

          {/* Listings Column */}
          <div className="flex-1 w-full space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#EEEEEE]">
                  {data ? `${data.total} Available Positions` : 'Loading roles...'}
                </span>
                {filters.categories.length > 0 && (
                  <span className="text-xs text-[#8A8F98]">
                    ({filters.categories.length} categories active)
                  </span>
                )}
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2 text-xs text-[#8A8F98]">
                <ArrowUpDown className="h-3 w-3" />
                <span>Sort by:</span>
                <button
                  onClick={() => setSortBy(sortBy === 'newest' ? 'relevance' : 'newest')}
                  className="rounded bg-[#151619] border border-[rgba(255,255,255,0.08)] px-2.5 py-1 text-xs text-[#EEEEEE] hover:bg-[#1F2024] transition font-medium"
                >
                  {sortBy === 'newest' ? 'Newest First' : 'Relevance'}
                </button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="flex items-center gap-3 rounded-md border border-[#E05252]/30 bg-[#E05252]/10 p-3.5 text-xs text-[#E05252]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
                <button onClick={fetchJobs} className="ml-auto underline font-semibold">
                  Retry
                </button>
              </div>
            )}

            {/* Skeletons */}
            {loading && !data && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-5 h-44 flex flex-col justify-between"
                  >
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-md bg-[#1F2024]"></div>
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 w-28 bg-[#1F2024] rounded"></div>
                        <div className="h-3 w-40 bg-[#1F2024] rounded"></div>
                      </div>
                    </div>
                    <div className="h-4 w-3/4 bg-[#1F2024] rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-3.5 w-16 bg-[#1F2024] rounded"></div>
                      <div className="h-3.5 w-20 bg-[#1F2024] rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Job Grid */}
            {data && data.jobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.jobs.map((job) => (
                  <JobCard key={job.id} job={job} onSelectJob={(j) => setSelectedJob(j)} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {data && data.jobs.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#1F2024] text-[#8A8F98] mb-3">
                  <Inbox className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-[#EEEEEE]">No roles matched your criteria</h3>
                <p className="mt-1 text-xs text-[#8A8F98] max-w-sm">
                  Try broadening your keyword search or resetting category filters.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    handleFilterChange({
                      search: '',
                      categories: [],
                      locationGroup: 'all',
                      experience: 'all',
                      ageBucket: 'all',
                    })
                  }
                  className="mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.08)] text-xs text-[#8A8F98]">
                <span>
                  Page {data.page} of {data.totalPages} ({data.total} total)
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(data.page - 1)}
                    disabled={data.page <= 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    <span>Previous</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(data.page + 1)}
                    disabled={data.page >= data.totalPages}
                    className="gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Detail Modal */}
      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-[#8A8F98]">
          <p className="text-xs">Loading Alaris Clutch...</p>
        </div>
      }
    >
      <JobBoardContent />
    </Suspense>
  );
}
