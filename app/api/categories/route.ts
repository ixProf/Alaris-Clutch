import { NextResponse } from 'next/server';
import { dbBridge } from '@/lib/db';
import { CATEGORY_DEFINITIONS } from '@/lib/multi-classifier';

export async function GET() {
  try {
    const { categoryCounts, total } = await dbBridge.getJobs({ limit: 1 });

    const categoriesWithCounts = CATEGORY_DEFINITIONS.map((cat) => ({
      ...cat,
      count: categoryCounts[cat.id] || 0,
    }));

    return NextResponse.json({
      success: true,
      totalJobs: total,
      categories: categoriesWithCounts,
    });
  } catch (error: any) {
    console.error('API /api/categories error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
