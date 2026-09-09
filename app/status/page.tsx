'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Check,
  AlertTriangle,
  Clock,
  Database,
  RefreshCw,
  Radio,
  Zap,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/Button';
import { useI18n } from '@/lib/i18n/context';

interface SourceItem {
  key: string;
  name: string;
  type: string;
  enabled: boolean;
  status: 'healthy' | 'degraded' | 'error' | 'idle' | string;
  lastJobCount: number;
  lastScrapedAt: string | null;
  lastError: string | null;
}

export default function StatusPage() {
  const { t, locale, isRtl } = useI18n();
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  // Manual refresh state
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [refreshNotice, setRefreshNotice] = useState<{
    type: 'success' | 'cooldown' | 'error';
    message: string;
  } | null>(null);

  const fetchAllStatus = useCallback(async () => {
    setLoading(true);
    try {
      const [sourcesRes, statusRes, workerStatusRes] = await Promise.all([
        fetch('/api/sources'),
        fetch('/api/status'),
        fetch('/api/worker/status'),
      ]);

      const sourcesJson = await sourcesRes.json();
      const statusJson = await statusRes.json();
      const workerJson = await workerStatusRes.json();

      if (sourcesJson.success) setSources(sourcesJson.sources);
      if (statusJson.success) {
        setStatusData({
          ...statusJson,
          worker: workerJson.success ? workerJson : null,
        });
      }
    } catch (e) {
      console.error('Error fetching status data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStatus();
  }, [fetchAllStatus]);

  // Handle source toggle
  const handleToggleSource = async (sourceKey: string, currentEnabled: boolean) => {
    const newEnabled = !currentEnabled;
    setUpdatingKey(sourceKey);

    // Optimistic UI update
    setSources((prev) =>
      prev.map((s) => (s.key === sourceKey ? { ...s, enabled: newEnabled } : s))
    );

    try {
      const res = await fetch('/api/sources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceKey, enabled: newEnabled }),
      });

      const json = await res.json();
      if (!json.success) {
        // Revert on failure
        setSources((prev) =>
          prev.map((s) => (s.key === sourceKey ? { ...s, enabled: currentEnabled } : s))
        );
      }
    } catch (err) {
      console.error('Toggle error:', err);
      // Revert on failure
      setSources((prev) =>
        prev.map((s) => (s.key === sourceKey ? { ...s, enabled: currentEnabled } : s))
      );
    } finally {
      setUpdatingKey(null);
    }
  };

  // Handle Manual Refresh with 30-min cooldown
  const handleManualRefresh = async () => {
    setRefreshing(true);
    setRefreshNotice(null);

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
        setRefreshNotice({ type: 'cooldown', message: msg });
      } else if (json.isRunning) {
        setRefreshNotice({
          type: 'cooldown',
          message:
            locale === 'ar'
              ? 'هناك عملية تحديث قيد التشغيل حالياً في الخلفية.'
              : 'A scrape cycle is already in progress.',
        });
      } else if (json.success) {
        setRefreshNotice({
          type: 'success',
          message:
            locale === 'ar'
              ? 'تم إطلاق التحديث الفوري بنجاح! جاري سحب أحدث الإعلانات...'
              : 'Fast refresh triggered! Fetching newly posted jobs...',
        });

        // Poll for completion after 4 seconds
        setTimeout(() => {
          fetchAllStatus();
        }, 4000);
      } else {
        setRefreshNotice({
          type: 'error',
          message: json.message || json.error || 'Failed to trigger refresh',
        });
      }
    } catch (err: any) {
      setRefreshNotice({
        type: 'error',
        message: err?.message || 'Network error triggering refresh',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const enabledCount = sources.filter((s) => s.enabled).length;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-[#8A8F98] hover:text-[#EEEEEE] transition mb-3"
        >
          {isRtl ? <ArrowRight className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
          <span>{locale === 'ar' ? 'العودة إلى لوحة الوظائف' : 'Back to Job Board'}</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#EEEEEE] tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#5E6AD2]" />
              <span>{t.sources.pageTitle}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8F98] mt-1">
              {t.sources.pageSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="gap-1.5"
            >
              <Zap className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-amber-300' : ''}`} />
              <span>{refreshing ? t.refreshControl.refreshing : t.refreshControl.refreshNow}</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={fetchAllStatus}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{locale === 'ar' ? 'تحديث المقاييس' : 'Reload'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Refresh Notice / Cooldown Feedback */}
      {refreshNotice && (
        <div
          className={`flex items-center justify-between gap-3 rounded-lg p-3.5 text-xs sm:text-sm border transition-all ${
            refreshNotice.type === 'cooldown'
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
              : refreshNotice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
              : 'bg-red-500/10 border-red-500/20 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {refreshNotice.type === 'cooldown' && <Clock className="h-4 w-4 shrink-0 text-amber-400" />}
            {refreshNotice.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
            {refreshNotice.type === 'error' && <XCircle className="h-4 w-4 shrink-0 text-red-400" />}
            <span>{refreshNotice.message}</span>
          </div>

          <button
            onClick={() => setRefreshNotice(null)}
            className="text-xs opacity-75 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8A8F98]">
            <span className="font-mono uppercase tracking-wider text-[10px]">{t.sources.cadenceTitle}</span>
            <Radio className="h-3.5 w-3.5 text-[#5E6AD2]" />
          </div>
          <p className="text-lg font-bold text-[#EEEEEE]">
            {locale === 'ar' ? 'كل 30 دقيقة' : 'Every 30 Minutes'}
          </p>
          <span className="text-[11px] text-[#8A8F98]">{t.sources.cadenceDesc}</span>
        </div>

        <div className="rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8A8F98]">
            <span className="font-mono uppercase tracking-wider text-[10px]">{t.sources.volumeTitle}</span>
            <Database className="h-3.5 w-3.5 text-[#5E6AD2]" />
          </div>
          <p className="text-lg font-bold text-[#EEEEEE]">
            {statusData?.totalJobsCount ?? '...'} {locale === 'ar' ? 'وظيفة مفهرسة' : 'Roles Indexed'}
          </p>
          <span className="text-[11px] text-[#8A8F98]">{t.sources.volumeDesc}</span>
        </div>

        <div className="rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8A8F98]">
            <span className="font-mono uppercase tracking-wider text-[10px]">{t.sources.lastSyncTitle}</span>
            <Clock className="h-3.5 w-3.5 text-[#5E6AD2]" />
          </div>
          <p className="text-lg font-bold text-[#EEEEEE]">
            {statusData?.worker?.lastCompletedCycleAt || statusData?.lastRun?.startedAt
              ? formatRelativeTime(statusData?.worker?.lastCompletedCycleAt || statusData?.lastRun?.startedAt)
              : locale === 'ar'
              ? 'مؤخراً'
              : 'Recently'}
          </p>
          <span className="text-[11px] text-[#8A8F98]">
            {statusData?.worker?.isRunning
              ? locale === 'ar'
                ? 'جاري الفهرسة حالياً...'
                : 'Scrape in progress...'
              : t.sources.lastSyncDesc}
          </span>
        </div>
      </div>

      {/* Sources Table with Interactive Toggles */}
      <div className="rounded-lg bg-[#151619] border border-[rgba(255,255,255,0.08)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#EEEEEE]">{t.sources.sourcesTitle}</h2>
            <p className="text-xs text-[#8A8F98] mt-0.5">
              {locale === 'ar'
                ? 'تحكم في تشغيل أو إيقاف أي مصدر. يتم تطبيق هذا الإعداد في كافة دورات الزحف القادمة.'
                : 'Enable or disable any source. Changes apply to all upcoming cron, manual, and export scrapes.'}
            </p>
          </div>
          <span className="rounded bg-[#1F2024] px-2.5 py-1 text-[11px] font-mono text-[#EEEEEE] border border-[rgba(255,255,255,0.08)]">
            {enabledCount} / {sources.length} {locale === 'ar' ? 'مفعل' : 'enabled'}
          </span>
        </div>

        <div className="divide-y divide-[rgba(255,255,255,0.06)]">
          {sources.map((src) => {
            const isHealthy = src.status === 'healthy';
            const isDegraded = src.status === 'degraded';
            const isError = src.status === 'error';

            return (
              <div
                key={src.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 first:pt-1 last:pb-1"
              >
                {/* Source Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-[#EEEEEE] text-sm sm:text-base">
                      {src.name}
                    </span>
                    <span className="rounded bg-[#1F2024] px-2 py-0.5 text-[10px] text-[#8A8F98] border border-[rgba(255,255,255,0.06)] font-mono">
                      {src.type}
                    </span>
                    {!src.enabled && (
                      <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-300 border border-red-500/20 font-mono">
                        {locale === 'ar' ? 'معطل' : 'Disabled'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 text-xs text-[#8A8F98]">
                    <span>
                      {t.sources.lastFetchPrefix}:{' '}
                      <span className="text-[#EEEEEE] font-mono">
                        {src.lastScrapedAt ? formatRelativeTime(src.lastScrapedAt) : locale === 'ar' ? 'لم يفحص بعد' : 'Not yet'}
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      {locale === 'ar' ? 'الوظائف المكتشفة مؤخراً:' : 'Recent jobs found:'}{' '}
                      <span className="text-[#EEEEEE] font-mono font-semibold">{src.lastJobCount}</span>
                    </span>
                  </div>

                  {src.lastError && (
                    <p className="text-xs text-red-400/90 bg-red-500/5 rounded px-2 py-1 mt-1 border border-red-500/10 max-w-xl">
                      {src.lastError}
                    </p>
                  )}
                </div>

                {/* Health Badge & Enable/Disable Switch */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  {/* Health Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium border ${
                      isHealthy
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : isDegraded
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : isError
                        ? 'border-red-500/30 bg-red-500/10 text-red-300'
                        : 'border-[rgba(255,255,255,0.08)] bg-[#1F2024] text-[#8A8F98]'
                    }`}
                  >
                    {isHealthy && <Check className="h-3 w-3 text-emerald-400" />}
                    {isDegraded && <AlertTriangle className="h-3 w-3 text-amber-400" />}
                    {isError && <XCircle className="h-3 w-3 text-red-400" />}
                    <span>
                      {isHealthy
                        ? t.sources.healthHealthy
                        : isDegraded
                        ? t.sources.healthDegraded
                        : isError
                        ? t.sources.healthError
                        : t.sources.healthIdle}
                    </span>
                  </span>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    disabled={updatingKey === src.key}
                    onClick={() => handleToggleSource(src.key, src.enabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      src.enabled ? 'bg-[#5E6AD2]' : 'bg-[#2A2B30]'
                    } ${updatingKey === src.key ? 'opacity-50' : ''}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isRtl
                          ? src.enabled
                            ? '-translate-x-5'
                            : 'translate-x-0'
                          : src.enabled
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture Note */}
      <div className="rounded-lg bg-[#111215] border border-[rgba(255,255,255,0.06)] p-4 space-y-1.5 text-xs text-[#8A8F98]">
        <span className="font-semibold text-[#EEEEEE] block flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#5E6AD2]" />
          Alaris Space Infrastructure Note
        </span>
        <p className="leading-relaxed">
          Alaris Clutch worker executes 24/7 in an autonomous loop. It fetches enabled endpoints, normalizes postings
          into unified schemas, executes multi-category tech classifiers, and saves directly to PostgreSQL.
          Manual triggers and export-depth requests are automatically polled and processed without interrupting the scheduled cadence.
        </p>
      </div>
    </div>
  );
}
