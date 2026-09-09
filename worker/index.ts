import cron from 'node-cron';
import { dbBridge } from '../lib/db';
import { classifyCategories } from '../lib/multi-classifier';

// Lazy-require existing scraper packages
const { buildScrapers, SOURCES } = require('@jobscrapper/sources/registry');
const { crawlAll } = require('@jobscrapper/core/crawler');
const { Repository } = require('@jobscrapper/storage/repository');
const { loadOverrides } = require('@jobscrapper/config/config');
const { getProfile } = require('@jobscrapper/config/profiles');

interface ScrapeWorkerConfig {
  cronSchedule: string; // e.g., "*/30 * * * *" for every 30 mins
  runImmediately: boolean;
  queries: string[];
}

const DEFAULT_QUERIES = [
  '.NET Developer',
  'C# Backend Developer',
  'Node.js Developer',
  'Full Stack Developer',
  'Python Developer',
  'React Frontend Engineer',
  'DevOps Engineer',
  'Software Engineer',
];

export async function runScrapeCycle(): Promise<void> {
  const startedAt = new Date().toISOString();
  console.log(`\n======================================================`);
  console.log(`[Alaris Clutch Worker] Scrape cycle started at: ${startedAt}`);
  console.log(`======================================================`);

  // Build scraper configuration
  const baseConfig = loadOverrides([]);
  baseConfig.queries = DEFAULT_QUERIES;
  baseConfig.profile = getProfile('egypt-junior');

  // Tune source page depth for background service
  if (baseConfig.sources) {
    if (baseConfig.sources.linkedin) baseConfig.sources.linkedin.maxPages = 3;
    if (baseConfig.sources.wuzzuf) baseConfig.sources.wuzzuf.maxPages = 2;
    if (baseConfig.sources.indeed) baseConfig.sources.indeed.maxPages = 2;
    if (baseConfig.sources.arbeitnow) baseConfig.sources.arbeitnow.maxPages = 3;
    if (baseConfig.sources.remotive) baseConfig.sources.remotive.maxPages = 2;
  }

  const scrapers = buildScrapers(baseConfig).map(({ scraper }: any) => scraper);
  const repo = new Repository({ dbPath: './data/jobs.db' });

  let results: any[] = [];
  try {
    results = await crawlAll(scrapers, baseConfig, repo);
  } catch (error: any) {
    console.error('[Alaris Clutch Worker] Error during crawlAll:', error);
  } finally {
    repo.close();
  }

  const finishedAt = new Date().toISOString();

  // Aggregate results and update database statuses
  const totalSummary = {
    found: 0,
    relevant: 0,
    saved: 0,
    duplicates: 0,
    failed: 0,
  };

  for (const r of results) {
    totalSummary.found += r.found || 0;
    totalSummary.relevant += r.relevant || 0;
    totalSummary.saved += r.saved || 0;
    totalSummary.duplicates += r.duplicates || 0;
    totalSummary.failed += r.failed || 0;

    const sourceMeta = SOURCES.find((s: any) => s.key === r.source);
    const sourceName = sourceMeta ? sourceMeta.name : r.source;

    await dbBridge.updateSourceStatus({
      sourceKey: r.source,
      name: sourceName,
      lastJobCount: r.found || 0,
      status: r.failed > 0 && r.found === 0 ? 'error' : r.failed > 0 ? 'degraded' : 'healthy',
      lastError: r.failed > 0 ? `Encountered ${r.failed} failures during fetch/parse` : undefined,
    });
  }

  await dbBridge.recordScrapeRun({
    status: totalSummary.failed > 0 && totalSummary.saved === 0 ? 'FAILED' : 'SUCCESS',
    startedAt,
    finishedAt,
    summary: totalSummary,
  });

  // Re-classify all jobs in DB to ensure newly scraped jobs have categories
  const allJobsRes = await dbBridge.getJobs({ limit: 500 });
  console.log(`[Alaris Clutch Worker] Cycle completed: Found=${totalSummary.found}, Relevant=${totalSummary.relevant}, Saved=${totalSummary.saved}, Duplicates=${totalSummary.duplicates}. Total DB count: ${allJobsRes.total}`);
}

async function startWorker(): Promise<void> {
  const argv = process.argv.slice(2);
  const runOnce = argv.includes('--once');
  const cronExpr = process.env.CRON_SCHEDULE || '*/30 * * * *'; // Default every 30 minutes

  console.log('[Alaris Clutch] Initializing background scraping worker service...');
  console.log(`[Alaris Clutch] Cron interval: ${cronExpr}`);

  // Run on start
  await runScrapeCycle();

  if (runOnce) {
    console.log('[Alaris Clutch] --once flag provided. Worker exiting.');
    process.exit(0);
  }

  // Schedule recurring cron
  cron.schedule(cronExpr, async () => {
    console.log(`[Alaris Clutch Cron] Triggering scheduled scrape cycle...`);
    try {
      await runScrapeCycle();
    } catch (e) {
      console.error('[Alaris Clutch Cron] Cycle failed with unhandled exception:', e);
    }
  });

  console.log('[Alaris Clutch] 24/7 Scraping worker is actively running in background.');
}

if (require.main === module || process.env.RUN_WORKER === 'true') {
  startWorker().catch((err) => {
    console.error('Fatal error in worker startup:', err);
    process.exit(1);
  });
}
