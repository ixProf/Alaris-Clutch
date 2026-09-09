import { NextRequest, NextResponse } from 'next/server';
import { dbBridge } from '@/lib/db';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    const { jobs } = await dbBridge.getJobs({ limit: 10000 });

    const rows = jobs.map((j) => ({
      Title: j.title,
      Company: j.company || '',
      Location: j.location || '',
      Remote: j.remote ? 'Yes' : 'No',
      'Min Experience': j.experienceMin ?? '',
      'Max Experience': j.experienceMax ?? '',
      Categories: j.categories.join(', '),
      Technologies: j.technologies.join(', '),
      Salary: j.salary || '',
      Source: j.source,
      'Posted At': j.postedAt || '',
      'Scraped At': j.scrapedAt || '',
      URL: j.url || '',
    }));

    const stamp = new Date().toISOString().slice(0, 10);

    if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Jobs');
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      return new Response(buf, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="alaris-clutch-jobs-${stamp}.xlsx"`,
        },
      });
    }

    // Default CSV
    const ws = XLSX.utils.json_to_sheet(rows);
    const csv = '\uFEFF' + XLSX.utils.sheet_to_csv(ws);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="alaris-clutch-jobs-${stamp}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('API /api/export error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Export failed' },
      { status: 500 }
    );
  }
}
