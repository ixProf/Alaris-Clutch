'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/Button';
import {
  ArrowRight,
  ExternalLink,
  Network,
  Orbit,
  Workflow,
  Briefcase,
  CheckCircle2,
  Server,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building2,
  Utensils,
  ShoppingBag,
  MessageSquare,
} from 'lucide-react';

export default function LandingPage() {
  const { t, locale, isRtl } = useI18n();

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-16">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-b from-[#151619] to-[#0E0F11] border border-[rgba(255,255,255,0.08)] p-8 sm:p-14 lg:p-20 overflow-hidden text-center sm:text-start">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 end-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-[#5E6AD2]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-[#a78bfa]/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#1F2024] px-3.5 py-1 text-xs text-[#EEEEEE]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#a78bfa]"></span>
              <span>{t.landing.heroBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EEEEEE] leading-[1.15]">
              {t.landing.heroTitlePrefix}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-[#5E6AD2]">
                {t.landing.heroTitleHighlight}
              </span>
              {t.landing.heroTitleSuffix}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-sm sm:text-lg text-[#8A8F98] leading-relaxed max-w-2xl">
              {t.landing.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 pt-2">
              <Link href="/dashboard">
                <Button variant="primary" size="lg" className="gap-2">
                  <span>{t.landing.ctaJobs}</span>
                  {isRtl ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </Link>

              <a
                href="https://alaris.space"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg" className="gap-2">
                  <span>{t.landing.ctaCompany}</span>
                  <ExternalLink className="h-4 w-4 text-[#8A8F98]" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPANY OVERVIEW SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-xl bg-[#151619] border border-[rgba(255,255,255,0.08)] p-8 sm:p-12">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5E6AD2]">
              {t.landing.companyTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE] tracking-tight">
              {t.landing.companySubtitle}
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-[#8A8F98] leading-relaxed">
            <p>{t.landing.companyDescP1}</p>
            <p>{t.landing.companyDescP2}</p>
          </div>
        </div>
      </section>

      {/* 3. DETAILED SERVICES SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center sm:text-start max-w-2xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a78bfa]">
            {t.landing.servicesTitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE] tracking-tight">
            {t.landing.servicesSubtitle}
          </h2>
        </div>

        <div className="space-y-8">
          {/* SERVICE 1: ALARIS FLOWX */}
          <div className="rounded-2xl bg-[#151619] border border-[rgba(255,255,255,0.08)] p-6 sm:p-10 lg:p-12 space-y-8 transition-all hover:border-[rgba(255,255,255,0.14)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.06)]">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F2024] border border-[rgba(255,255,255,0.08)] text-[#8b5cf6]">
                    <Workflow className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-[#8b5cf6] uppercase tracking-wider">
                    {t.landing.flowX.category}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE] tracking-tight">
                  {t.landing.flowX.title}
                </h3>
                <p className="text-sm sm:text-base text-[#8A8F98] leading-relaxed">
                  {t.landing.flowX.tagline}
                </p>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center gap-3">
                <a
                  href="https://client-cyan-alpha-16.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="md" className="gap-2">
                    <span>{t.landing.flowX.ctaTry}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Core Capabilities Grid (6 items) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {t.landing.flowX.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-[#111215] border border-[rgba(255,255,255,0.06)] p-5 space-y-2 hover:border-[rgba(255,255,255,0.12)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#8b5cf6] shrink-0" />
                    <h4 className="text-sm font-semibold text-[#EEEEEE]">
                      {feat.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#8A8F98] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SERVICE 2: ALARIS NEXUS */}
          <div className="rounded-2xl bg-[#151619] border border-[rgba(255,255,255,0.08)] p-6 sm:p-10 lg:p-12 space-y-8 transition-all hover:border-[rgba(255,255,255,0.14)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.06)]">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F2024] border border-[rgba(255,255,255,0.08)] text-[#a78bfa]">
                    <Network className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-[#a78bfa] uppercase tracking-wider">
                    {t.landing.nexus.category}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE] tracking-tight">
                  {t.landing.nexus.title}
                </h3>
                <p className="text-base sm:text-lg font-medium text-[#EEEEEE] leading-relaxed">
                  {t.landing.nexus.tagline}
                </p>
                <p className="text-xs sm:text-sm text-[#8A8F98] leading-relaxed">
                  {t.landing.nexus.desc}
                </p>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center gap-3">
                <a
                  href="https://alaris-nexus.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="md" className="gap-2">
                    <span>{t.landing.nexus.ctaTry}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#8A8F98] me-2">
                {t.landing.nexus.subline}:
              </span>
              {t.landing.nexus.pills.map((pill, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-[#1F2024] border border-[rgba(255,255,255,0.08)] px-3 py-1 text-xs text-[#EEEEEE]"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Stat Cards Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {t.landing.nexus.stats.map((st, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-[#111215] border border-[rgba(255,255,255,0.06)] p-6 space-y-1.5 text-center sm:text-start"
                >
                  <span className="text-xs font-medium text-[#8A8F98]">
                    {st.label}
                  </span>
                  <p className="text-2xl sm:text-3xl font-bold font-mono text-[#EEEEEE] tracking-tight">
                    {st.val}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SERVICE 3: ALARIS ORBIT */}
          <div className="rounded-2xl bg-[#151619] border border-[rgba(255,255,255,0.08)] p-6 sm:p-10 lg:p-12 space-y-8 transition-all hover:border-[rgba(255,255,255,0.14)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.06)]">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F2024] border border-[rgba(255,255,255,0.08)] text-[#5E6AD2]">
                    <Orbit className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-[#5E6AD2] uppercase tracking-wider">
                    {t.landing.orbit.category}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE] tracking-tight">
                  {t.landing.orbit.title}
                </h3>
                <p className="text-sm sm:text-base text-[#8A8F98] leading-relaxed">
                  {t.landing.orbit.intro}
                </p>
              </div>

              {/* Action Buttons: Live Demo + Inquire */}
              <div className="shrink-0 flex flex-wrap items-center gap-3">
                <a
                  href="https://alarisorbit-one.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="md" className="gap-2">
                    <span>{t.landing.orbit.ctaTry}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>

                <a
                  href="https://alarisorbit-one.vercel.app/#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="md" className="gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-[#8A8F98]" />
                    <span>{t.landing.orbit.ctaInquire}</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Core Capabilities (4 items) */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5E6AD2]">
                {t.landing.orbit.tagline}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.landing.orbit.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-[#111215] border border-[rgba(255,255,255,0.06)] p-5 space-y-2 hover:border-[rgba(255,255,255,0.12)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#5E6AD2] shrink-0" />
                      <h5 className="text-sm font-semibold text-[#EEEEEE]">
                        {feat.title}
                      </h5>
                    </div>
                    <p className="text-xs text-[#8A8F98] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Overview Subsection */}
            <div className="rounded-xl bg-[#111215] border border-[rgba(255,255,255,0.06)] p-6 sm:p-8 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-[#a78bfa]">
                  {t.landing.orbit.overviewSub}
                </span>
                <h4 className="text-lg font-bold text-[#EEEEEE]">
                  {t.landing.orbit.overviewHeading}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#8A8F98] leading-relaxed">
                {t.landing.orbit.overviewDesc}
              </p>

              {/* Technical Specs Tags */}
              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap gap-2.5">
                {t.landing.orbit.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#1F2024] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs"
                  >
                    <span className="text-[#8A8F98]">{spec.label}:</span>
                    <span className="font-medium text-[#EEEEEE]">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ALARIS CLUTCH SPOTLIGHT & PRODUCT GATEWAY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-br from-[#1F2024] via-[#151619] to-[#0E0F11] border border-[rgba(255,255,255,0.1)] p-8 sm:p-12 lg:p-14 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5E6AD2]">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Featured Autonomous System</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE] tracking-tight">
                {t.landing.clutchSpotlightTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#8A8F98] leading-relaxed">
                {t.landing.clutchSpotlightDesc}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                  <span>{t.landing.clutchSpotlightCta}</span>
                  {isRtl ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-[rgba(255,255,255,0.08)]">
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#EEEEEE]">
                5+
              </span>
              <p className="text-xs text-[#8A8F98]">{t.landing.statsSources}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#EEEEEE]">
                24 / 7
              </span>
              <p className="text-xs text-[#8A8F98]">{t.landing.statsUptime}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#EEEEEE]">
                100%
              </span>
              <p className="text-xs text-[#8A8F98]">{t.landing.footerFree}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
