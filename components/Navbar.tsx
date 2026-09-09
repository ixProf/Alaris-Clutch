'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Download, Layers, Briefcase, Home } from 'lucide-react';
import { Button } from './Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '@/lib/i18n/context';

export function Navbar() {
  const { t, isRtl } = useI18n();
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isJobs = pathname === '/dashboard';
  const isStatus = pathname === '/status';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#0E0F11]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Context */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[rgba(255,255,255,0.08)] bg-[#1F2024]">
            <img
              src="/logo.png"
              alt="Alaris Clutch"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-[#EEEEEE]">
              {t.nav.brand}
            </span>
            <span className="text-[11px] tracking-normal text-[#8A8F98]">
              {t.nav.brandSub}
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              isHome
                ? 'bg-[#1F2024] text-[#EEEEEE] font-medium'
                : 'text-[#8A8F98] hover:text-[#EEEEEE] hover:bg-[#151619]'
            }`}
          >
            {t.nav.home}
          </Link>
          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              isJobs
                ? 'bg-[#1F2024] text-[#EEEEEE] font-medium'
                : 'text-[#8A8F98] hover:text-[#EEEEEE] hover:bg-[#151619]'
            }`}
          >
            {t.nav.jobs}
          </Link>
          <Link
            href="/status"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              isStatus
                ? 'bg-[#1F2024] text-[#EEEEEE] font-medium'
                : 'text-[#8A8F98] hover:text-[#EEEEEE] hover:bg-[#151619]'
            }`}
          >
            {t.nav.status}
          </Link>
        </nav>

        {/* Right Actions: Export, Live Indicator & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile nav quick link to Jobs */}
          <Link href="/dashboard" className="md:hidden">
            <Button variant={isJobs ? 'secondary' : 'ghost'} size="sm">
              <Briefcase className="h-3.5 w-3.5" />
            </Button>
          </Link>

          <Link href="/status" className="hidden sm:inline-block">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#8A8F98]" />
              <span>{t.nav.status}</span>
            </Button>
          </Link>

          <a href="/api/export?format=xlsx" className="hidden sm:inline-block">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>{t.nav.export}</span>
            </Button>
          </a>

          {/* App-Wide Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
