'use client';

import React, { useEffect } from 'react';
import { JobRecord } from '@/lib/db';
import { formatRelativeTime, formatExperience } from '@/lib/utils';
import { CATEGORY_DEFINITIONS } from '@/lib/multi-classifier';
import { X, ExternalLink, MapPin, Clock } from 'lucide-react';
import { Button } from './Button';

interface JobDetailModalProps {
  job: JobRecord | null;
  onClose: () => void;
}

export function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  const jobCategories = job.categories.map((catId) => {
    return (
      CATEGORY_DEFINITIONS.find((def) => def.id === catId) || {
        id: catId,
        name: catId,
        badgeColor: 'bg-[#1F2024] text-[#8A8F98] border-[rgba(255,255,255,0.08)]',
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[85vh] rounded-lg bg-[#1C1D21] border border-[rgba(255,255,255,0.08)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[rgba(255,255,255,0.08)] bg-[#151619]">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#1F2024] border border-[rgba(255,255,255,0.08)] text-base font-bold text-[#EEEEEE]">
              {(job.company || 'J').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#EEEEEE] tracking-tight">
                  {job.title}
                </h2>
                {job.remote && (
                  <span className="rounded bg-[#1F2024] px-2 py-0.5 text-xs font-medium text-[#EEEEEE] border border-[rgba(255,255,255,0.08)]">
                    Remote
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#8A8F98]">
                <span className="font-semibold text-[#EEEEEE]">{job.company || 'Confidential'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location || 'Unspecified'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(job.postedAt)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#8A8F98] hover:bg-[#1F2024] hover:text-[#EEEEEE] transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs sm:text-sm">
          {/* Key Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-md bg-[#151619] p-3 border border-[rgba(255,255,255,0.08)]">
              <span className="text-[10px] text-[#8A8F98] uppercase font-mono tracking-wider">Experience</span>
              <p className="mt-0.5 text-xs font-semibold text-[#EEEEEE]">
                {formatExperience(job.experienceMin, job.experienceMax)}
              </p>
            </div>
            <div className="rounded-md bg-[#151619] p-3 border border-[rgba(255,255,255,0.08)]">
              <span className="text-[10px] text-[#8A8F98] uppercase font-mono tracking-wider">Workplace</span>
              <p className="mt-0.5 text-xs font-semibold text-[#EEEEEE]">
                {job.remote ? 'Remote' : 'On-site'}
              </p>
            </div>
            <div className="rounded-md bg-[#151619] p-3 border border-[rgba(255,255,255,0.08)]">
              <span className="text-[10px] text-[#8A8F98] uppercase font-mono tracking-wider">Source</span>
              <p className="mt-0.5 text-xs font-semibold text-[#EEEEEE] capitalize">
                {job.source}
              </p>
            </div>
            <div className="rounded-md bg-[#151619] p-3 border border-[rgba(255,255,255,0.08)]">
              <span className="text-[10px] text-[#8A8F98] uppercase font-mono tracking-wider">Employment</span>
              <p className="mt-0.5 text-xs font-semibold text-[#EEEEEE]">
                {job.employmentType || 'Full-time'}
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider mb-2">
              Classified Categories
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {jobCategories.map((cat) => (
                <span
                  key={cat.id}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium border ${cat.badgeColor}`}
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          {job.technologies && job.technologies.length > 0 && (
            <div>
              <h4 className="text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider mb-2">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {job.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-[#151619] px-2 py-0.5 text-xs font-mono text-[#EEEEEE] border border-[rgba(255,255,255,0.08)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider mb-2">
              Description
            </h4>
            <div className="rounded-md bg-[#151619] p-4 border border-[rgba(255,255,255,0.08)] text-[#8A8F98] leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto text-xs">
              {job.description || 'No detailed description available for this role.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#151619]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>

          {job.url ? (
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="sm" className="gap-1.5">
                <span>Apply on {job.source ? job.source.toUpperCase() : 'Site'}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          ) : (
            <span className="text-xs text-[#8A8F98]">Original URL not available</span>
          )}
        </div>
      </div>
    </div>
  );
}
