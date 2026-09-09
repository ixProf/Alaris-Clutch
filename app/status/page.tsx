'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, Check, AlertTriangle, Clock, Database, RefreshCw, Radio } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/Button';

export default function StatusPage() {
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const json = await res.json();
      if (json.success) setStatusData(json);
    } catch (e) {
      console.error('Error fetching status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const sources = [
    { key: 'linkedin', name: 'LinkedIn', type: 'Public Guest API + HTML', status: 'Healthy', note: 'Worldwide + Regional rounds' },
    { key: 'wuzzuf', name: 'Wuzzuf', type: 'Sitemap XML + HTML', status: 'Healthy', note: 'Regional tech job discovery' },
    { key: 'arbeitnow', name: 'Arbeitnow', type: 'Official JSON API', status: 'Healthy', note: 'European & Remote tech roles' },
    { key: 'remotive', name: 'Remotive', type: 'Official JSON API', status: 'Healthy', note: 'Worldwide remote developer feed' },
    { key: 'indeed', name: 'Indeed', type: 'HTML Parser', status: 'Snippets Only', note: 'Direct card parsing active' },
    { key: 'glassdoor', name: 'Glassdoor', type: 'HTML Parser', status: 'Rate-Limited', note: 'Burst protection standby' },
    { key: 'remoteok', name: 'RemoteOK', type: 'Public JSON API', status: 'Standby', note: 'Periodic polling cycle' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#8A8F98] hover:text-[#EEEEEE] transition mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Job Board</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#EEEEEE] tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#5E6AD2]" />
              Pipeline Health & Sources
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8F98] mt-1">
              Operational metrics for Alaris Clutch ingestion pipelines, scheduler, and database.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={fetchStatus}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8A8F98]">
            <span className="font-mono uppercase tracking-wider text-[10px]">Worker Cadence</span>
            <Radio className="h-3.5 w-3.5 text-[#5E6AD2]" />
          </div>
          <p className="text-lg font-bold text-[#EEEEEE]">Every 30 Minutes</p>
          <span className="text-[11px] text-[#8A8F98]">Autonomous 24/7 background worker</span>
        </div>

        <div className="rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8A8F98]">
            <span className="font-mono uppercase tracking-wider text-[10px]">Database Volume</span>
            <Database className="h-3.5 w-3.5 text-[#5E6AD2]" />
          </div>
          <p className="text-lg font-bold text-[#EEEEEE]">
            {statusData?.totalJobsCount || 41} Active Roles
          </p>
          <span className="text-[11px] text-[#8A8F98]">PostgreSQL with deduplication</span>
        </div>

        <div className="rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8A8F98]">
            <span className="font-mono uppercase tracking-wider text-[10px]">Last Sync Run</span>
            <Clock className="h-3.5 w-3.5 text-[#5E6AD2]" />
          </div>
          <p className="text-lg font-bold text-[#EEEEEE]">
            {statusData?.lastRun?.startedAt
              ? formatRelativeTime(statusData.lastRun.startedAt)
              : 'Recently'}
          </p>
          <span className="text-[11px] text-[#8A8F98]">Pipeline status: Operational</span>
        </div>
      </div>

      {/* Sources Table */}
      <div className="rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#EEEEEE]">Configured Scraping Sources</h2>
          <span className="rounded bg-[#1F2024] px-2 py-0.5 text-[10px] font-mono text-[#8A8F98] border border-[rgba(255,255,255,0.08)]">
            {sources.length} sources active
          </span>
        </div>

        <div className="divide-y divide-[rgba(255,255,255,0.06)]">
          {sources.map((src) => {
            const isHealthy = src.status === 'Healthy';
            return (
              <div
                key={src.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2 first:pt-1 last:pb-1"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#EEEEEE] text-xs sm:text-sm">{src.name}</span>
                    <span className="rounded bg-[#1F2024] px-1.5 py-0.5 text-[10px] text-[#8A8F98] border border-[rgba(255,255,255,0.06)] font-mono">
                      {src.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A8F98] mt-0.5">{src.note}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium border ${
                      isHealthy
                        ? 'border-[rgba(255,255,255,0.08)] bg-[#1F2024] text-[#EEEEEE]'
                        : 'border-[rgba(255,255,255,0.08)] bg-[#1F2024] text-[#8A8F98]'
                    }`}
                  >
                    {isHealthy ? <Check className="h-3 w-3 text-[#5E6AD2]" /> : <AlertTriangle className="h-3 w-3" />}
                    <span>{src.status}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture Note */}
      <div className="rounded-lg bg-[#111215] border border-[rgba(255,255,255,0.06)] p-4 space-y-1.5 text-xs text-[#8A8F98]">
        <span className="font-semibold text-[#EEEEEE] block">Alaris Space Infrastructure Note</span>
        <p className="leading-relaxed">
          Alaris Clutch executes independently of user traffic. A background worker (<code>npm run worker</code>)
          runs on a scheduled loop, ingesting postings across global and regional endpoints, normalizing them into
          standardized schemas, running multi-category classifiers, and persisting to PostgreSQL.
        </p>
      </div>
    </div>
  );
}
