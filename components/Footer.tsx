'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  const { t, isRtl } = useI18n();

  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#0E0F11] py-8 text-xs text-[#8A8F98]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-start">
          <span className="font-semibold text-[#EEEEEE]">{t.nav.brand}</span>
          <span className="hidden sm:inline">•</span>
          <span>{t.landing.footerSub}</span>
        </div>
        <div className="flex items-center gap-4 text-[#8A8F98]">
          <span>{t.landing.footerFree}</span>
          <span>•</span>
          <a
            href="https://alaris.space"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#EEEEEE] hover:text-[#5E6AD2] transition-colors"
          >
            <span>{t.landing.footerVisitCompany}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
