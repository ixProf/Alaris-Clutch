import { NextRequest, NextResponse } from 'next/server';
import { dbBridge } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const categoryParam = searchParams.get('category') || searchParams.get('categories');
    const categories = categoryParam ? categoryParam.split(',').map((c) => c.trim()).filter(Boolean) : undefined;
    const locationGroup = (searchParams.get('location') as any) || 'all';
    const experience = (searchParams.get('experience') as any) || 'all';
    const ageBucket = (searchParams.get('posted') as any) || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const sortBy = (searchParams.get('sort') as any) || 'newest';

    const result = await dbBridge.getJobs({
      search,
      categories,
      locationGroup,
      experience,
      ageBucket,
      page,
      limit,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('API /api/jobs error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
