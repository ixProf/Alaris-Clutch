import { NextRequest, NextResponse } from 'next/server';
import { dbBridge } from '@/lib/db';
const { SOURCES } = require('@jobscrapper/sources/registry');

export async function GET() {
  try {
    const statusData = await dbBridge.getScraperStatus();
    const sourceStatusMap = new Map<string, any>();
    for (const s of statusData.sourceStatuses || []) {
      sourceStatusMap.set(s.sourceKey.toLowerCase(), s);
    }

    const sources = SOURCES.map((src: any) => {
      const dbStatus = sourceStatusMap.get(src.key.toLowerCase());
      return {
        key: src.key,
        name: src.name,
        type: src.type,
        enabled: dbStatus ? Boolean(dbStatus.enabled) : true, // fail-open default
        status: dbStatus ? dbStatus.status : 'idle',
        lastJobCount: dbStatus ? dbStatus.lastJobCount : 0,
        lastScrapedAt: dbStatus ? dbStatus.lastScrapedAt : null,
        lastError: dbStatus ? dbStatus.lastError : null,
      };
    });

    return NextResponse.json({
      success: true,
      sources,
    });
  } catch (error: any) {
    console.error('API /api/sources GET error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch sources' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceKey, enabled } = body;

    if (!sourceKey || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'sourceKey (string) and enabled (boolean) are required' },
        { status: 400 }
      );
    }

    const validSource = SOURCES.find((s: any) => s.key.toLowerCase() === String(sourceKey).toLowerCase());
    if (!validSource) {
      return NextResponse.json(
        { success: false, error: `Unknown source key "${sourceKey}". Valid sources: ${SOURCES.map((s: any) => s.key).join(', ')}` },
        { status: 400 }
      );
    }

    const updated = await dbBridge.updateSourceEnabled(validSource.key, enabled);

    return NextResponse.json({
      success: true,
      source: {
        key: validSource.key,
        name: validSource.name,
        enabled: updated.enabled,
        status: updated.status,
      },
    });
  } catch (error: any) {
    console.error('API /api/sources PATCH error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update source' },
      { status: 500 }
    );
  }
}
