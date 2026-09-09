import { NextResponse } from 'next/server';
import { dbBridge } from '@/lib/db';

export async function GET() {
  try {
    const settings = await dbBridge.getSystemSettings();
    const scraperStatus = await dbBridge.getScraperStatus();

    const COOLDOWN_MS = 30 * 60 * 1000;
    const lastCompleted = settings?.lastCompletedCycleAt
      ? new Date(settings.lastCompletedCycleAt).getTime()
      : 0;

    const elapsed = Date.now() - lastCompleted;
    const cooldownRemainingMinutes =
      lastCompleted > 0 && elapsed < COOLDOWN_MS
        ? Math.max(1, Math.ceil((COOLDOWN_MS - elapsed) / 60000))
        : 0;

    return NextResponse.json({
      success: true,
      isRunning: Boolean(settings?.isRunning),
      pendingTrigger: Boolean(settings?.pendingTrigger),
      triggerId: settings?.triggerId || null,
      triggerType: settings?.triggerType || null,
      triggerDepth: settings?.triggerDepth || 1,
      triggerCompletedAt: settings?.triggerCompletedAt || null,
      triggerError: settings?.triggerError || null,
      lastCompletedCycleAt: settings?.lastCompletedCycleAt || null,
      lastManualTriggerAt: settings?.lastManualTriggerAt || null,
      cooldownRemainingMinutes,
      totalJobsCount: scraperStatus.totalJobsCount,
      lastRun: scraperStatus.lastRun,
    });
  } catch (error: any) {
    console.error('API /api/worker/status error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch worker status' },
      { status: 500 }
    );
  }
}
