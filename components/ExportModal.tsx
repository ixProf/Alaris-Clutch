'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Zap, Layers, Compass, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useI18n } from '@/lib/i18n/context';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { t, locale, isRtl } = useI18n();
  const [depth, setDepth] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, loading]);

  if (!isOpen) return null;

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setStatusMessage(t.exportModal.inProgressTitle);

    try {
      // 1. Trigger export-depth scrape
      const triggerRes = await fetch('/api/worker/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'export', depth }),
      });

      const triggerJson = await triggerRes.json();
      if (!triggerJson.success && !triggerJson.isRunning) {
        throw new Error(triggerJson.message || triggerJson.error || 'Failed to trigger export crawl');
      }

      const triggerId = triggerJson.triggerId;

      // 2. Poll worker status until completed (timeout: 3 minutes)
      const startTime = Date.now();
      let completed = false;

      while (Date.now() - startTime < 180000) {
        await new Promise((resolve) => setTimeout(resolve, 2500));

        const statusRes = await fetch('/api/worker/status');
        const statusJson = await statusRes.json();

        if (statusJson.success) {
          // If trigger completed or isRunning turned false
          if (
            (triggerId && statusJson.triggerCompletedAt && statusJson.triggerId === triggerId) ||
            (!statusJson.isRunning && !statusJson.pendingTrigger)
          ) {
            completed = true;
            break;
          }
        }
      }

      setStatusMessage(t.exportModal.downloadingTitle);

      // 3. Initiate download
      const link = document.createElement('a');
      link.href = '/api/export?format=xlsx';
      link.setAttribute('download', `alaris-clutch-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      console.error('Export scrape error:', err);
      setError(err?.message || t.exportModal.errorMessage);
      setLoading(false);
    }
  };

  const handleFallbackDirectDownload = () => {
    const link = document.createElement('a');
    link.href = '/api/export?format=xlsx';
    link.setAttribute('download', `alaris-clutch-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const depthOptions = [
    {
      level: 1,
      title: t.exportModal.depth1Title,
      desc: t.exportModal.depth1Desc,
      icon: Zap,
      badgeColor: 'text-[#a78bfa] border-[rgba(167,139,250,0.2)] bg-[#a78bfa]/10',
    },
    {
      level: 2,
      title: t.exportModal.depth2Title,
      desc: t.exportModal.depth2Desc,
      icon: Compass,
      badgeColor: 'text-[#5E6AD2] border-[rgba(94,106,210,0.2)] bg-[#5E6AD2]/10',
    },
    {
      level: 3,
      title: t.exportModal.depth3Title,
      desc: t.exportModal.depth3Desc,
      icon: Layers,
      badgeColor: 'text-[#8b5cf6] border-[rgba(139,92,246,0.2)] bg-[#8b5cf6]/10',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="relative flex flex-col w-full max-w-lg rounded-xl bg-[#151619] border border-[rgba(255,255,255,0.08)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.08)] bg-[#111215]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1F2024] border border-[rgba(255,255,255,0.08)] text-[#a78bfa]">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#EEEEEE] tracking-tight">
                {t.exportModal.modalTitle}
              </h2>
              <span className="text-[11px] text-[#8A8F98] block">
                {locale === 'ar' ? 'تصدير إكسل مدعوم بزحف فوري' : 'Excel Export Powered by Live Scraping'}
              </span>
            </div>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-[#8A8F98] hover:bg-[#1F2024] hover:text-[#EEEEEE] transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {loading ? (
            /* Loading State */
            <div className="py-8 text-center space-y-4">
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1F2024] border border-[rgba(255,255,255,0.08)]">
                <Loader2 className="h-7 w-7 text-[#5E6AD2] animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-semibold text-[#EEEEEE]">
                  {statusMessage}
                </h3>
                <p className="text-xs text-[#8A8F98] max-w-xs mx-auto">
                  {t.exportModal.inProgressSubtitle}
                </p>
              </div>
            </div>
          ) : success ? (
            /* Success State */
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981]">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[#EEEEEE]">
                {t.exportModal.successMessage}
              </h3>
            </div>
          ) : (
            /* Choice State */
            <>
              <p className="text-xs sm:text-sm text-[#8A8F98] leading-relaxed">
                {t.exportModal.modalSubtitle}
              </p>

              {error && (
                <div className="flex items-start gap-2.5 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p>{error}</p>
                    <button
                      onClick={handleFallbackDirectDownload}
                      className="underline text-red-200 hover:text-white"
                    >
                      {locale === 'ar' ? 'تنزيل الوظائف المؤرشفة حالياً مباشرة' : 'Download currently stored records directly'}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <span className="text-[11px] font-mono uppercase text-[#8A8F98] tracking-wider block">
                  {t.exportModal.depthLabel}
                </span>

                <div className="grid grid-cols-1 gap-2.5">
                  {depthOptions.map((opt) => {
                    const isSelected = depth === opt.level;
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.level}
                        onClick={() => setDepth(opt.level)}
                        className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#1F2024] border-[#5E6AD2] shadow-sm'
                            : 'bg-[#111215] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-xs font-semibold ${opt.badgeColor}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-semibold text-[#EEEEEE] block">
                              {opt.title}
                            </span>
                            <span className="text-[11px] text-[#8A8F98]">
                              {opt.desc}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 ps-2">
                          <span
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-[#5E6AD2] bg-[#5E6AD2]'
                                : 'border-[rgba(255,255,255,0.2)]'
                            }`}
                          >
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white"></span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                <Button variant="secondary" size="md" onClick={onClose}>
                  {t.exportModal.cancel}
                </Button>
                <Button variant="primary" size="md" onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  <span>{t.exportModal.confirm}</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
