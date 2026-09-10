import cron from 'node-cron';
import { dbBridge } from '../lib/db';

// Lazy-require existing scraper packages
const { buildScrapers, SOURCES } = require('@jobscrapper/sources/registry');
const { crawlAll } = require('@jobscrapper/core/crawler');
const { loadOverrides } = require('@jobscrapper/config/config');
const { getProfile } = require('@jobscrapper/config/profiles');

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

export interface CycleOptions {
  depth?: number;
  triggerType?: 'cron' | 'manual' | 'export';
  triggerId?: string;
}

let isLocalRunning = false;

export async function runScrapeCycle(options: CycleOptions = {}): Promise<void> {
  const triggerType = options.triggerType || 'cron';
  const startedAt = new Date().toISOString();

  // 1. Concurrency guard check (both memory and DB)
  if (isLocalRunning) {
    console.warn(`[Worker] Scrape cycle skipped: local cycle is already in progress.`);
    return;
  }

  const currentSettings = await dbBridge.getSystemSettings();
  if (currentSettings?.isRunning) {
    // Check if the running job has timed out (older than 10 minutes)
    const runStart = currentSettings.currentRunStartedAt ? new Date(currentSettings.currentRunStartedAt).getTime() : 0;
    const isStale = Date.now() - runStart > 10 * 60 * 1000;
    if (!isStale) {
      console.warn(`[Worker] Scrape cycle skipped: database reports isRunning=true.`);
      return;
    }
    console.warn(`[Worker] Found stale isRunning flag (>10m), reclaiming lock.`);
  }

  isLocalRunning = true;
  await dbBridge.updateSystemSettings({
    isRunning: true,
    currentRunStartedAt: new Date(),
    triggerError: null,
  });

  console.log(`\n======================================================`);
  console.log(`[Alaris Clutch Worker] Scrape cycle started: type=${triggerType}, depth=${options.depth || 'default'}`);
  console.log(`[Alaris Clutch Worker] Timestamp: ${startedAt}`);
  console.log(`======================================================`);

  try {
    // 2. Fetch enabled sources dynamically
    const enabledSourceKeys = await dbBridge.getEnabledSources();
    console.log(`[Worker] Enabled sources: [${enabledSourceKeys.join(', ')}]`);

    // 3. Build scraper configuration
    const baseConfig = loadOverrides([]);
    baseConfig.queries = DEFAULT_QUERIES;
    baseConfig.profile = getProfile('all-tech');

    // Configure source availability and depth
    if (baseConfig.sources) {
      for (const s of SOURCES) {
        if (!baseConfig.sources[s.key]) baseConfig.sources[s.key] = {};
        baseConfig.sources[s.key].enabled = enabledSourceKeys.includes(s.key);

        if (options.depth && options.depth > 0) {
          baseConfig.sources[s.key].maxPages = options.depth;
        } else {
          if (s.key === 'linkedin') baseConfig.sources[s.key].maxPages = 3;
          else if (s.key === 'wuzzuf') baseConfig.sources[s.key].maxPages = 2;
          else if (s.key === 'indeed') baseConfig.sources[s.key].maxPages = 2;
          else if (s.key === 'arbeitnow') baseConfig.sources[s.key].maxPages = 3;
          else if (s.key === 'remotive') baseConfig.sources[s.key].maxPages = 2;
          else baseConfig.sources[s.key].maxPages = 2;
        }
      }
    }

    const scrapers = buildScrapers(baseConfig).map(({ scraper }: any) => scraper);

    // 4. Prisma PostgreSQL Repository Adapter
    const pgRepo = {
      isProcessed: (source: string, idOrUrl: string) => dbBridge.isProcessed(source, idOrUrl),
      upsert: (job: any) => dbBridge.upsertJob(job),
    };

    let results: any[] = [];
    try {
      results = await crawlAll(scrapers, baseConfig, pgRepo);
    } catch (error: any) {
      console.error('[Alaris Clutch Worker] Error during crawlAll:', error);
    }

    const finishedAt = new Date().toISOString();

    // 5. Aggregate results and update database statuses
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
        lastError: r.failed > 0 ? (r.lastError || `Encountered ${r.failed} failures during fetch/parse`) : undefined,
      });
    }

    await dbBridge.recordScrapeRun({
      status: totalSummary.failed > 0 && totalSummary.saved === 0 && totalSummary.found === 0 ? 'FAILED' : 'SUCCESS',
      startedAt,
      finishedAt,
      summary: totalSummary,
    });

    const statusAfter = await dbBridge.getScraperStatus();
    console.log(`[Alaris Clutch Worker] Cycle completed: Found=${totalSummary.found}, Relevant=${totalSummary.relevant}, Saved=${totalSummary.saved}, Duplicates=${totalSummary.duplicates}. Total DB count: ${statusAfter.totalJobsCount}`);

    // 6. Release lock and update completion flags
    await dbBridge.updateSystemSettings({
      isRunning: false,
      lastCompletedCycleAt: new Date(),
      lastManualTriggerAt: triggerType === 'manual' ? new Date() : undefined,
      pendingTrigger: false,
      triggerCompletedAt: new Date(),
      triggerError: null,
    });
  } catch (err: any) {
    console.error('[Alaris Clutch Worker] Fatal error in cycle:', err);
    await dbBridge.updateSystemSettings({
      isRunning: false,
      pendingTrigger: false,
      triggerCompletedAt: new Date(),
      triggerError: String(err && err.message),
    });
  } finally {
    isLocalRunning = false;
  }
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

  // 1. Recurring cron schedule
  cron.schedule(cronExpr, async () => {
    console.log(`[Alaris Clutch Cron] Triggering scheduled scrape cycle...`);
    try {
      await runScrapeCycle({ triggerType: 'cron' });
    } catch (e) {
      console.error('[Alaris Clutch Cron] Cycle failed with unhandled exception:', e);
    }
  });

  // 2. Continuous DB polling for manual/export triggers (every 4 seconds)
  setInterval(async () => {
    try {
      const settings = await dbBridge.getSystemSettings();
      if (settings && settings.pendingTrigger && !settings.isRunning && !isLocalRunning) {
        console.log(`[Worker Poll] Pending trigger detected: type=${settings.triggerType}, depth=${settings.triggerDepth}`);
        await runScrapeCycle({
          depth: settings.triggerDepth || 1,
          triggerType: (settings.triggerType as any) || 'manual',
          triggerId: settings.triggerId || undefined,
        });
      }
    } catch (pollErr) {
      console.error('[Worker Poll] Error checking pending trigger:', pollErr);
    }
  }, 4000);

  console.log('[Alaris Clutch] 24/7 Scraping worker is actively running in background.');
}

if (require.main === module || process.env.RUN_WORKER === 'true') {
  startWorker().catch((err) => {
    console.error('Fatal error in worker startup:', err);
    process.exit(1);
  });
}

