import { PrismaClient } from '@prisma/client';
import { DatabaseSync } from 'node:sqlite';
import { classifyCategories } from '../lib/multi-classifier';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to Neon PostgreSQL and importing records from data/jobs.db...');
  const sqliteDb = new DatabaseSync(path.join(process.cwd(), 'data', 'jobs.db'));
  const rows = sqliteDb.prepare('SELECT * FROM jobs').all();
  console.log(`Found ${rows.length} jobs in local SQLite database.`);

  let inserted = 0;
  for (const row of rows as any[]) {
    let techs: string[] = [];
    try {
      techs = typeof row.technologies === 'string' ? JSON.parse(row.technologies) : row.technologies || [];
    } catch {
      techs = [];
    }

    const categories = classifyCategories({
      title: row.title,
      description: row.description,
      requirements: row.requirements,
      technologies: techs,
    });

    const postedDate = row.postedAt ? new Date(row.postedAt) : null;
    const validPostedAt = postedDate && !isNaN(postedDate.getTime()) ? postedDate : null;

    try {
      await prisma.job.upsert({
        where: {
          source_sourceJobId: {
            source: row.source || 'linkedin',
            sourceJobId: row.sourceJobId || String(row.id),
          },
        },
        update: {
          title: row.title,
          company: row.company,
          location: row.location,
          remote: Boolean(row.remote === 1),
          description: row.description,
          requirements: row.requirements,
          technologies: JSON.stringify(techs),
          categories: JSON.stringify(categories),
          salary: row.salary,
          fingerprint: row.fingerprint,
        },
        create: {
          title: row.title || 'Untitled Role',
          company: row.company,
          location: row.location,
          remote: Boolean(row.remote === 1),
          employmentType: row.employmentType,
          experienceMin: row.experienceMin !== null && row.experienceMin !== undefined ? Number(row.experienceMin) : null,
          experienceMax: row.experienceMax !== null && row.experienceMax !== undefined ? Number(row.experienceMax) : null,
          description: row.description,
          requirements: row.requirements,
          salary: row.salary,
          technologies: JSON.stringify(techs),
          categories: JSON.stringify(categories),
          source: row.source || 'linkedin',
          sourceJobId: row.sourceJobId || String(row.id),
          url: row.url,
          canonicalUrl: row.canonicalUrl,
          postedAt: validPostedAt,
          fingerprint: row.fingerprint,
          relevance: row.relevance || 'medium',
        },
      });
      inserted++;
    } catch (e: any) {
      console.warn(`Failed to insert job ${row.id}:`, e?.message);
    }
  }

  // Insert initial source statuses
  const sources = ['linkedin', 'wuzzuf', 'indeed', 'glassdoor', 'remoteok', 'arbeitnow', 'remotive'];
  for (const s of sources) {
    await prisma.sourceStatus.upsert({
      where: { sourceKey: s },
      update: { lastScrapedAt: new Date(), status: 'healthy' },
      create: {
        sourceKey: s,
        name: s.charAt(0).toUpperCase() + s.slice(1),
        lastScrapedAt: new Date(),
        lastJobCount: 15,
        status: 'healthy',
      },
    });
  }

  // Record initial scrape run
  await prisma.scrapeRun.create({
    data: {
      status: 'SUCCESS',
      summary: JSON.stringify({ imported: inserted, status: 'Initial migration complete' }),
      finishedAt: new Date(),
    },
  });

  console.log(`Successfully migrated ${inserted} jobs into Neon PostgreSQL!`);
}

main()
  .catch((e) => {
    console.error('Migration error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
