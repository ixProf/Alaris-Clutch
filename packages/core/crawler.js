'use strict';

const { log } = require('./logger');
const { Deduplicator } = require('./deduplicator');
const { passesFilters } = require('./gate');
const { mapPool } = require('./rate-limiter');
const { classifyError } = require('./retry');

function formatErrorSummary(errors, totalQueries) {
  if (!errors || !errors.length) return null;
  const counts = new Map();
  for (const e of errors) {
    const key = e.status ? `${e.kind || 'error'}:${e.status}` : (e.kind || 'error');
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const parts = [];
  for (const [key, count] of counts.entries()) {
    const [kind, status] = key.split(':');
    const queryRatio = totalQueries ? `${count}/${totalQueries}` : `${count}`;
    if (kind === 'blocked') {
      parts.push(`Blocked (${status || '403/999'}) on ${queryRatio} queries`);
    } else if (kind === 'rate-limited') {
      parts.push(`Rate limited (${status || '429'}) on ${queryRatio} queries`);
    } else if (kind === 'network-error') {
      parts.push(`Network error on ${queryRatio} queries`);
    } else if (status) {
      parts.push(`HTTP ${status} on ${queryRatio} queries`);
    } else {
      parts.push(`${kind} on ${queryRatio} queries`);
    }
  }
  return parts.join('; ');
}

async function crawlSource(scraper, queries, { maxPages = 10, maxJobsPerQuery = 50, concurrency = 3, repository = null, dryRun = false, maxExp = 2, remoteQueries = [], remoteLocation = 'Remote', location = 'Egypt', profile = {} } = {}) {
  const totalQueries = queries.length + (remoteQueries.length || 0);
  const stats = {
    source: scraper.source,
    queries: totalQueries,
    found: 0,
    relevant: 0,
    saved: 0,
    duplicates: 0,
    failed: 0,
    filtered: 0,
    errors: [],
    lastError: null,
    lastErrorStatus: null,
    errorKinds: [],
  };
  const dedup = new Deduplicator();
  const seenInRun = new Set();
  const rounds = [{ queries, location: location || 'Egypt', workType: '' }];
  if (remoteQueries.length) rounds.push({ queries: remoteQueries, location: '', workType: '2' });
  log('SCRAPE_STARTED', { source: scraper.source, queries: queries.length, remoteQueries: remoteQueries.length });
  for (const round of rounds) {
  for (const query of round.queries) {
    log('SEARCH_STARTED', { source: scraper.source, query, location: round.location, workType: round.workType });
    let collected = [];
    for (let page = 0; page < maxPages; page++) {
      let items;
      try {
        items = await scraper.search(query, { page, location: round.location, workType: round.workType });
        log('PAGE_FETCHED', { source: scraper.source, query, page, count: items.length });
      } catch (err) {
        log('SCRAPE_FAILED', { source: scraper.source, query, page, error: String(err && err.message) });
        stats.failed++;
        const status = (err && (err.status || err.statusCode)) || null;
        const kind = (err && err.kind) || classifyError(err);
        stats.errors.push({ stage: 'search', query, page, status, kind, message: String(err && err.message) });
        break;
      }
      if (!items.length) break;
      collected.push(...items);
      if (collected.length >= maxJobsPerQuery) { collected = collected.slice(0, maxJobsPerQuery); break; }
      if (items.length < 5) break;
    }
    stats.found += collected.length;
    await mapPool(collected, concurrency, async (item) => {
      try {
        if (repository && repository.isProcessed) {
          const processed = await repository.isProcessed(scraper.source, item.sourceJobId || item.url);
          if (processed) {
            stats.duplicates++;
            log('JOB_DUPLICATE', { source: scraper.source, url: item.url, stage: 'isProcessed_db' });
            return;
          }
        }
        const { canonicalizeUrl: _cu } = require('./url-normalizer');
        const runKey = `${scraper.source}:${item.sourceJobId ? String(item.sourceJobId) : _cu(item.url)}`;
        if (seenInRun.has(runKey)) { stats.duplicates++; log('JOB_DUPLICATE', { source: scraper.source, url: item.url, stage: 'seenInRun' }); return; }
        seenInRun.add(runKey);
        let raw;
        let fullDesc = false;
        try { raw = await scraper.scrapeJob(item.url); fullDesc = !!(raw && raw.description && raw.description.length > 500); }
        catch { raw = item; }
        raw.title = raw.title || item.title; raw.company = raw.company || item.company; raw.location = raw.location || item.location;
        raw.postedAt = raw.postedAt || item.postedAt || null; raw.salary = raw.salary || item.salary || null;
        const job = scraper.normalize({ ...raw, url: raw.url || item.url });
        job.descriptionComplete = fullDesc;
        const dup = dedup.key(job);
        if (dup.duplicate) { stats.duplicates++; log('JOB_DUPLICATE', { source: scraper.source, url: job.url, via: dup.via }); return; }
        dedup.add(job);
        const gate = passesFilters(job, { ...profile, experience: { min: 0, max: maxExp, ...(profile.experience || {}) } });
        if (!gate.accept) { stats.filtered++; log('JOB_FILTERED', { source: scraper.source, url: job.url, reason: gate.reason, stage: gate.stage }); return; }
        job.relevance = gate.relevance || job.relevance;
        stats.relevant++;
        if (!dryRun && repository) {
          const r = await repository.upsert(job);
          if (r === 'new' || r === 'updated') {
            stats.saved++;
            log('JOB_SAVED', { source: scraper.source, title: job.title, url: job.url, result: r });
          } else {
            stats.duplicates++;
            log('JOB_DUPLICATE', { source: scraper.source, url: job.url, stage: 'upsert_duplicate' });
          }
        } else if (dryRun) { stats.saved++; }
      } catch (err) {
        stats.failed++;
        console.error(`[Scraper ${scraper.source}] Item failure on ${item.url}:`, err && err.message);
        log('SCRAPE_FAILED', { source: scraper.source, url: item.url, error: String(err && err.message) });
        const status = (err && (err.status || err.statusCode)) || null;
        const kind = (err && err.kind) || classifyError(err);
        stats.errors.push({ stage: 'item', url: item.url, status, kind, message: String(err && err.message) });
      }
    });
  }
  }
  if (stats.errors.length > 0) {
    stats.lastError = formatErrorSummary(stats.errors, totalQueries);
    stats.lastErrorStatus = stats.errors[0]?.status || null;
    stats.errorKinds = [...new Set(stats.errors.map((e) => e.kind).filter(Boolean))];
  }
  log('SCRAPE_COMPLETED', { source: scraper.source, ...stats });
  return stats;
}

async function crawlAll(scrapers, cfg, repository) {
  const results = [];
  for (const s of scrapers) {
    const sc = cfg.sources[s.source];
    if (sc && sc.enabled === false) continue;
    try {
      const r = await crawlSource(s, cfg.queries, { maxPages: sc.maxPages, maxJobsPerQuery: sc.maxJobsPerQuery, concurrency: sc.concurrency, repository, dryRun: cfg.dryRun, maxExp: (cfg.profile && cfg.profile.experience && cfg.profile.experience.max) || cfg.experience.max, profile: cfg.profile || {}, remoteQueries: cfg.remoteQueries || [], remoteLocation: cfg.remoteLocation || 'Remote', location: cfg.location || 'Egypt' });
      results.push(r);
    } catch (err) {
      log('SCRAPE_FAILED', { source: s.source, error: String(err && err.message) });
      const status = (err && (err.status || err.statusCode)) || null;
      const kind = (err && err.kind) || classifyError(err);
      results.push({
        source: s.source,
        queries: 0,
        found: 0,
        relevant: 0,
        saved: 0,
        duplicates: 0,
        failed: 1,
        filtered: 0,
        disabled: true,
        lastError: `Fatal failure: ${String(err && err.message)}`,
        lastErrorStatus: status,
        errorKinds: [kind],
      });
    }
  }
  return results;
}

module.exports = { crawlSource, crawlAll, formatErrorSummary };
