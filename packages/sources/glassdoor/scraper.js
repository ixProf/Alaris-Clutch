'use strict';

const { BaseScraper } = require('@jobscrapper/core/base-scraper');
const { parseSearchPage, parseJobPage } = require('./parser');
const { normalize } = require('@jobscrapper/core/normalizer');
const { withRetry, fetchWithTimeout } = require('@jobscrapper/core/retry');
const { RateLimiter } = require('@jobscrapper/core/rate-limiter');
const { log } = require('@jobscrapper/core/logger');
const { getStealthHeaders } = require('@jobscrapper/core/headers');

class GlassdoorScraper extends BaseScraper {
  constructor(cfg = {}) {
    super('glassdoor', cfg);
    this.limiter = new RateLimiter({ delayMs: cfg.requestDelayMs || 4000, maxMs: 20000 });
    this.ua = cfg.userAgent;
  }
  buildSearchUrl(query, page = 0) {
    return `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(query)}`;
  }
  async fetchHtml(url, { isDetail = false, referer } = {}) {
    await this.limiter.wait();
    return withRetry(async () => {
      const headers = getStealthHeaders({ userAgent: this.ua, isDetail, referer, accept: 'text/html' });
      const res = await fetchWithTimeout(url, { timeoutMs: this.cfg.timeoutMs || 15000, headers });
      if (res.status === 429 || res.status === 403) { this.limiter.backoff(); const e = new Error('rate limited ' + res.status); e.status = res.status; throw e; }
      if (!res.ok) { const e = new Error(`http ${res.status}`); e.status = res.status; throw e; }
      this.limiter.relax();
      return res.text();
    }, { maxRetries: this.cfg.maxRetries || 5, onRetry: (r) => log('RETRY', { source: 'glassdoor', url, ...r, error: String(r.error && r.error.message) }) });
  }
  async search(query, { page = 0 } = {}) {
    if (page > 0) return [];
    const url = this.buildSearchUrl(query, page);
    const html = await this.fetchHtml(url, { isDetail: false });
    return parseSearchPage(html).map((j) => ({ ...j, source: 'glassdoor' }));
  }
  async scrapeJob(url) {
    const html = await this.fetchHtml(url, { isDetail: true, referer: 'https://www.glassdoor.com/' });
    return { ...parseJobPage(html, url), source: 'glassdoor' };
  }
  normalize(rawJob) { return normalize({ ...rawJob, source: 'glassdoor' }); }
}

module.exports = { GlassdoorScraper };
