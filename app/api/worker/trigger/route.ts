import { NextRequest, NextResponse } from 'next/server';
import { dbBridge } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const type = body.type === 'export' ? 'export' : 'manual';
    const depth = typeof body.depth === 'number' && body.depth > 0 ? body.depth : 1;

    const settings = await dbBridge.getSystemSettings();

    // 1. Check concurrency guard
    if (settings?.isRunning) {
      const startedAt = settings.currentRunStartedAt ? new Date(settings.currentRunStartedAt).getTime() : 0;
      const isStale = Date.now() - startedAt > 10 * 60 * 1000;
      if (!isStale) {
        return NextResponse.json({
          success: false,
          isRunning: true,
          message: 'جاري تحديث الوظائف بالفعل حاليًا... يرجى الانتظار لحين اكتمال الدورة الحالية.',
        });
      }
    }

    // 2. For manual refresh: Check 30-minute cooldown from last completed cycle
    if (type === 'manual') {
      const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes
      const lastCompleted = settings?.lastCompletedCycleAt
        ? new Date(settings.lastCompletedCycleAt).getTime()
        : 0;

      const elapsed = Date.now() - lastCompleted;
      if (lastCompleted > 0 && elapsed < COOLDOWN_MS) {
        const remainingMinutes = Math.max(1, Math.ceil((COOLDOWN_MS - elapsed) / 60000));
        return NextResponse.json({
          success: false,
          inCooldown: true,
          remainingMinutes,
          message: `سيتم تحديث المحتوى تلقائيًا خلال ${remainingMinutes} دقيقة`,
        });
      }
    }

    // 3. Set pending trigger in Database
    const triggerId = `trig_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await dbBridge.updateSystemSettings({
      pendingTrigger: true,
      triggerDepth: depth,
      triggerType: type,
      triggerId,
      triggerError: null,
      lastManualTriggerAt: type === 'manual' ? new Date() : undefined,
    });

    return NextResponse.json({
      success: true,
      triggerId,
      type,
      depth,
      message: type === 'manual' ? 'تم بدء التحديث السريع بنجاح' : 'تم بدء التحديث قبل التصدير',
    });
  } catch (error: any) {
    console.error('API /api/worker/trigger error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to trigger worker cycle' },
      { status: 500 }
    );
  }
}
