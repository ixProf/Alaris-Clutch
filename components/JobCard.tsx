'use client';

import React from 'react';
import { JobRecord } from '@/lib/db';
import { formatRelativeTime, formatExperience, getLocationGroup, getAgeBucket } from '@/lib/utils';
import { CATEGORY_DEFINITIONS } from '@/lib/multi-classifier';
import { ExternalLink, MapPin, Clock, Briefcase } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

interface JobCardProps {
  job: JobRecord;
  onSelectJob: (job: JobRecord) => void;
}

export function JobCard({ job, onSelectJob }: JobCardProps) {
  const { t, isRtl } = useI18n();
  const locGroup = getLocationGroup(job);
  const age = getAgeBucket(job.postedAt);
  const isFresh = age === '24h';

  // Find matching category configs
  const jobCategories = job.categories.map((catId) => {
    const localizedName = (t.categories as any)[catId];
    const def = CATEGORY_DEFINITIONS.find((d) => d.id === catId);
    return {
      id: catId,
      name: localizedName || def?.name || catId,
      badgeColor: def?.badgeColor || 'bg-[#1F2024] text-[#8A8F98] border-[rgba(255,255,255,0.08)]',
      borderColor: def?.borderColor || 'rgba(255, 255, 255, 0.08)',
    };
  });

  return (
    <div
      onClick={() => onSelectJob(job)}
      className="group cursor-pointer rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-5 transition-colors duration-150 hover:bg-[#18191E] hover:border-[rgba(255,255,255,0.14)]"
    >
      {/* Top row: Company & Meta */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#1F2024] border border-[rgba(255,255,255,0.08)] text-sm font-semibold text-[#EEEEEE]">
            {(job.company || 'J').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#EEEEEE]">
                {job.company || t.job.confidential}
              </span>
              {job.source && (
                <span className="rounded bg-[#1F2024] px-1.5 py-0.5 text-[10px] font-mono uppercase text-[#8A8F98] border border-[rgba(255,255,255,0.06)]">
                  {job.source}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5 mt-1 text-xs text-[#8A8F98]">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-[#8A8F98]" />
                {job.location || t.job.unspecifiedLocation}
              </span>
              {job.remote && (
                <span className="rounded bg-[#1F2024] px-1.5 py-0.5 text-[10px] font-medium text-[#EEEEEE] border border-[rgba(255,255,255,0.08)]">
                  {t.job.remoteBadge}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={`flex flex-col gap-1 shrink-0 ${isRtl ? 'items-start' : 'items-end'}`}>
          <div className="flex items-center gap-1 text-xs text-[#8A8F98]">
            <Clock className="h-3 w-3" />
            <span>{formatRelativeTime(job.postedAt)}</span>
          </div>
          {isFresh && (
            <span className="rounded bg-[#1F2024] px-2 py-0.5 text-[10px] font-medium text-[#5E6AD2] border border-[#5E6AD2]/30">
              {t.job.freshBadge}
            </span>
          )}
        </div>
      </div>

      {/* Main Title */}
      <h3 className="mt-3 text-base font-semibold text-[#EEEEEE] group-hover:text-white transition tracking-tight">
        {job.title}
      </h3>

      {/* Categories & Experience */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {/* Experience badge */}
        <span className="inline-flex items-center gap-1 rounded-md bg-[#1F2024] px-2 py-0.5 text-xs text-[#8A8F98] border border-[rgba(255,255,255,0.08)]">
          <Briefcase className="h-3 w-3" />
          {formatExperience(job.experienceMin, job.experienceMax)}
        </span>

        {/* Category Pills */}
        {jobCategories.slice(0, 3).map((cat) => (
          <span
            key={cat.id}
            className={`rounded-md px-2 py-0.5 text-xs font-medium border ${cat.badgeColor}`}
          >
            {cat.name}
          </span>
        ))}

        {jobCategories.length > 3 && (
          <span className="rounded-md bg-[#1F2024] px-1.5 py-0.5 text-xs text-[#8A8F98] border border-[rgba(255,255,255,0.06)]">
            +{jobCategories.length - 3}
          </span>
        )}
      </div>

      {/* Technologies preview */}
      {job.technologies && job.technologies.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-3 border-t border-[rgba(255,255,255,0.06)]">
          {job.technologies.slice(0, 5).map((tech, idx) => (
            <span
              key={idx}
              className="rounded bg-[#111215] px-2 py-0.5 text-[11px] font-mono text-[#8A8F98] border border-[rgba(255,255,255,0.06)]"
            >
              {tech}
            </span>
          ))}
          {job.technologies.length > 5 && (
            <span className="text-[11px] text-[#8A8F98] px-1 font-mono">
              +{job.technologies.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Card Action footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-[#8A8F98] pt-2">
        <span className="text-[#5E6AD2] font-medium group-hover:underline">
          {isRtl ? `← ${t.job.viewDetails}` : `${t.job.viewDetails} →`}
        </span>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[#8A8F98] hover:text-[#EEEEEE] transition p-1"
            title={t.job.applyNow}
          >
            <span>{t.job.originalSource}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
