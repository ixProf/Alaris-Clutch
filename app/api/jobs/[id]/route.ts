import { NextRequest, NextResponse } from 'next/server';
import { dbBridge } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const job = await dbBridge.getJobById(id);

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error: any) {
    console.error('API /api/jobs/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch job' },
      { status: 500 }
    );
  }
}
