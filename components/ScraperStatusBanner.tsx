'use client';

import React from 'react';
import { RefreshCw, Database, Activity } from 'lucide-react';
import { Button } from './Button';

interface ScraperStatusBannerProps {
  totalCount: number;
  freshCount: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ScraperStatusBanner({
  totalCount,
  freshCount,
  onRefresh,
  isRefreshing,
}: ScraperStatusBannerProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-4 sm:p-5">
      <div className="flex items-center gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1F2024] border border-[rgba(255,255,255,0.08)]">
          <Activity className="h-4 w-4 text-[#EEEEEE]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#EEEEEE] flex items-center gap-2">
            Continuous Indexing Pipeline
            <span className="h-1.5 w-1.5 rounded-full bg-[#5E6AD2]"></span>
          </h2>
          <p className="text-xs text-[#8A8F98]">
            Automated background crawling across LinkedIn, Wuzzuf, Arbeitnow, Remotive, and Indeed.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        <div className="flex items-center gap-4 px-3 py-1.5 rounded-md bg-[#111215] border border-[rgba(255,255,255,0.06)] text-xs">
          <div>
            <span className="text-[10px] uppercase text-[#8A8F98] block font-mono">Indexed</span>
            <span className="font-semibold text-[#EEEEEE] font-mono">{totalCount} roles</span>
          </div>
          <div className="h-6 w-[1px] bg-[rgba(255,255,255,0.08)]"></div>
          <div>
            <span className="text-[10px] uppercase text-[#8A8F98] block font-mono">Past 24h</span>
            <span className="font-semibold text-[#EEEEEE] font-mono">{freshCount} new</span>
          </div>
        </div>

        {onRefresh && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </Button>
        )}
      </div>
    </div>
  );
}
