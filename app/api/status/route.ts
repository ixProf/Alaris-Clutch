import { NextResponse } from 'next/server';
import { dbBridge } from '@/lib/db';

export async function GET() {
  try {
    const status = await dbBridge.getScraperStatus();
    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error: any) {
    console.error('API /api/status error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
