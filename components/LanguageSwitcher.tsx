'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function LanguageSwitcher({ variant = 'compact', className = '' }: LanguageSwitcherProps) {
  const { locale, toggleLocale, t } = useI18n();

  return (
    <button
      onClick={toggleLocale}
      type="button"
      aria-label="Toggle language"
      title={locale === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md border border-[rgba(255,255,255,0.08)] bg-[#151619] px-2.5 py-1.5 text-xs font-medium text-[#EEEEEE] transition-colors duration-150 hover:bg-[#1F2024] hover:border-[rgba(255,255,255,0.15)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5E6AD2] ${className}`}
    >
      <Globe className="h-3.5 w-3.5 text-[#8A8F98]" />
      <span className="font-semibold text-xs tracking-wide">
        {locale === 'en' ? 'عربي' : 'EN'}
      </span>
    </button>
  );
}
