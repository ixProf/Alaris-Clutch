'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RefreshCw, Sliders, Clock, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { Button } from './Button';
import { useI18n } from '@/lib/i18n/context';

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
}: ScraperStatusBannerProps) {
  const { t, locale, isRtl } = useI18n();
  const [triggering, setTriggering] = useState<boolean>(false);
  const [notice, setNotice] = useState<{
    type: 'cooldown' | 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  const handleManualRefresh = async () => {
    setTriggering(true);
    setNotice(null);

    try {
      const res = await fetch('/api/worker/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'manual', depth: 1 }),
      });

      const json = await res.json();

      if (json.inCooldown) {
        const msg =
          locale === 'ar'
            ? `سيتم تحديث المحتوى تلقائيًا خلال ${json.remainingMinutes} دقيقة`
            : `Content will update automatically in ${json.remainingMinutes} min`;
        setNotice({ type: 'cooldown', message: msg });
      } else if (json.isRunning) {
        setNotice({
          type: 'info',
          message:
            locale === 'ar'
              ? 'هناك عملية تحديث قيد التشغيل حالياً في الخلفية.'
              : 'A scrape cycle is already running in background.',
        });
      } else if (json.success) {
        setNotice({
          type: 'success',
          message:
            locale === 'ar'
              ? 'تم إطلاق التحديث الفوري (صفحة واحدة لكل مصدر)... جاري جلب الوظائف الجديدة.'
              : 'Fast refresh triggered! Ingesting freshly posted jobs...',
        });

        // Trigger parent jobs re-fetch after brief delay
        setTimeout(() => {
          if (onRefresh) onRefresh();
        }, 3000);
      } else {
        setNotice({
          type: 'error',
          message: json.message || json.error || 'Failed to trigger refresh',
        });
      }
    } catch (err: any) {
      setNotice({
        type: 'error',
        message: err?.message || 'Network error triggering refresh',
      });
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-[#151619] border border-[rgba(255,255,255,0.08)] p-4 sm:p-5">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1F2024]">
            <img src="/logo.png" alt="Alaris Clutch" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#EEEEEE] flex items-center gap-2">
              <span>{locale === 'ar' ? 'أنابيب الفهرسة الحية المستمرة' : 'Continuous Indexing Pipeline'}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#5E6AD2] animate-pulse"></span>
            </h2>
            <p className="text-xs text-[#8A8F98] mt-0.5">
              {locale === 'ar'
                ? 'زحف وفهرسة آلية مستمرة عبر كافة المصادر المفعلة، مع تطبيع البيانات وتصنيف التخصصات.'
                : 'Automated background crawling across all enabled sources, with schema normalization and multi-category classification.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
          <div className="flex items-center gap-4 px-3 py-1.5 rounded-md bg-[#111215] border border-[rgba(255,255,255,0.06)] text-xs">
            <div>
              <span className="text-[10px] uppercase text-[#8A8F98] block font-mono">
                {locale === 'ar' ? 'المفهرس' : 'Indexed'}
              </span>
              <span className="font-semibold text-[#EEEEEE] font-mono">
                {totalCount} {locale === 'ar' ? 'وظيفة' : 'roles'}
              </span>
            </div>
            <div className="h-6 w-[1px] bg-[rgba(255,255,255,0.08)]"></div>
            <div>
              <span className="text-[10px] uppercase text-[#8A8F98] block font-mono">
                {locale === 'ar' ? 'آخر 24 ساعة' : 'Past 24h'}
              </span>
              <span className="font-semibold text-[#EEEEEE] font-mono">
                {freshCount} {locale === 'ar' ? 'جديد' : 'new'}
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleManualRefresh}
            disabled={triggering}
            className="gap-1.5"
          >
            <Zap className={`h-3.5 w-3.5 text-amber-300 ${triggering ? 'animate-spin' : ''}`} />
            <span>{triggering ? t.refreshControl.refreshing : t.refreshControl.refreshNow}</span>
          </Button>

          <Link href="/status">
            <Button variant="ghost" size="sm" className="gap-1 text-[#8A8F98] hover:text-[#EEEEEE]">
              <Sliders className="h-3.5 w-3.5" />
              <span className="text-xs">{locale === 'ar' ? 'إدارة المصادر' : 'Sources'}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Cooldown or Success Notification Banner */}
      {notice && (
        <div
          className={`flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-xs border transition-all ${
            notice.type === 'cooldown'
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
              : notice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
              : 'bg-red-500/10 border-red-500/20 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'cooldown' && <Clock className="h-4 w-4 shrink-0 text-amber-400" />}
            {notice.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
            {notice.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />}
            <span>{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-xs opacity-75 hover:opacity-100 ps-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
