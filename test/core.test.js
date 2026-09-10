'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { parseExperience, experienceDecision } = require('@jobscrapper/core/experience-filter');
const { classify } = require('@jobscrapper/core/classifier');
const { canonicalizeUrl } = require('@jobscrapper/core/url-normalizer');
const { Deduplicator } = require('@jobscrapper/core/deduplicator');
const { normalize } = require('@jobscrapper/core/normalizer');
const { jobFingerprint } = require('@jobscrapper/core/fingerprint');
const { classifyError } = require('@jobscrapper/core/retry');

test('experience parser accepts 0-2, rejects 3+', () => {
  assert.equal(parseExperience('0-2 years experience').max, 2);
  assert.equal(parseExperience('5+ years required').min, 5);
  assert.equal(experienceDecision({ title: 'Junior .NET Developer', description: '0-2 years .NET' }).accept, true);
  assert.equal(experienceDecision({ title: 'Senior .NET Developer', description: '5+ years experience' }).accept, false);
  assert.equal(experienceDecision({ title: '.NET Developer', description: 'no description' }).accept, true);
});

test('classifier high/medium/reject', () => {
  assert.equal(classify({ title: '.NET Backend Developer', description: 'ASP.NET Core C# Web API Entity Framework SQL Server' }).relevance, 'high');
  assert.equal(classify({ title: 'Backend Developer', description: 'ASP.NET Core C# backend' }).relevance, 'medium');
  assert.equal(classify({ title: 'Frontend Developer', description: 'React only CSS' }).relevance, 'reject');
  assert.equal(classify({ title: 'PHP Developer', description: 'Laravel PHP' }).relevance, 'reject');
});

test('strict filter: mid-level, talent pool, generic titles rejected', () => {
  assert.equal(classify({ title: 'Mid .NET Developer', description: 'ASP.NET Core 2-4 years' }).relevance, 'reject');
  assert.equal(classify({ title: 'Software Engineer - Mid Level', description: 'ASP.NET Core backend' }).relevance, 'reject');
  assert.equal(classify({ title: 'Banco de Talentos Desenvolvedor .NET', description: '.NET' }).relevance, 'reject');
  assert.equal(classify({ title: 'AI-native Software Engineer', description: 'AI platform Python' }).relevance, 'reject');
  assert.equal(experienceDecision({ title: '.NET Developer', description: '2+ years experience required' }).accept, false);
  assert.equal(experienceDecision({ title: '.NET Developer', description: '2-4 years experience' }).accept, false);
  assert.equal(experienceDecision({ title: 'Junior .NET Developer', description: '0-2 years experience' }).accept, true);
});

test('url canonicalizer strips tracking', () => {
  assert.equal(canonicalizeUrl('https://example.com/job/123?utm_source=x&trk=abc'), 'https://example.com/job/123');
  assert.equal(canonicalizeUrl('https://example.com/job/123?skills=dotnet'), 'https://example.com/job/123?skills=dotnet');
});

test('deduplicator catches dupes, avoids false merge', () => {
  const d = new Deduplicator();
  const a = normalize({ title: '.NET Developer', company: 'Acme', location: 'Cairo', description: 'x'.repeat(300), url: 'https://example.com/j/1?utm_source=x', source: 'wuzzuf', sourceJobId: '1' });
  assert.equal(d.key(a).duplicate, false); d.add(a);
  const b = { ...a };
  assert.equal(d.key(b).duplicate, true);
  const c = { ...a, title: 'Python Developer', description: 'y'.repeat(300), fingerprint: 'diff', sourceJobId: '2', url: 'https://example.com/j/2', canonicalUrl: 'https://example.com/j/2' };
  assert.equal(d.key(c).duplicate, false);
});

test('normalizer schema + fingerprint stable', () => {
  const j = normalize({ title: ' Junior .NET Developer ', company: 'Acme', location: 'Cairo', description: 'ASP.NET Core Web API role', url: 'https://example.com/j/1', source: 'indeed', sourceJobId: 'abc' });
  assert.ok(j.id === null && j.title === 'Junior .NET Developer');
  assert.equal(j.fingerprint, jobFingerprint(j));
  assert.ok(j.canonicalUrl === 'https://example.com/j/1');
});

test('repository persists updates to file', () => {
  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const { Repository } = require('@jobscrapper/storage/repository');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-'));
  const r = new Repository({ dbPath: ':memory:', jsonFallback: path.join(dir, 'jobs.json') });
  if (r.useSqlite) { r.close(); return; }
  const { normalize } = require('@jobscrapper/core/normalizer');
  const j = normalize({ title: '.NET Developer', company: 'Acme', location: 'Cairo', description: 'ASP.NET Core Web API role with REST API', url: 'https://example.com/j/9', source: 'indeed', sourceJobId: 'z9' });
  assert.equal(r.upsert(j), 'new');
  const [saved] = r.all();
  saved.title = '.NET Developer (Remote)';
  const { jobFingerprint } = require('@jobscrapper/core/fingerprint');
  saved.fingerprint = jobFingerprint(saved);
  assert.equal(r.upsert(saved), 'updated');
  r.close();
  const fromFile = JSON.parse(fs.readFileSync(path.join(dir, 'jobs.json'), 'utf8'));
  assert.equal(fromFile[0].title, '.NET Developer (Remote)');
});

test('retry classifier', () => {
  assert.equal(classifyError(Object.assign(new Error('timeout'), {})), 'network-error');
  assert.equal(classifyError(Object.assign(new Error('x'), { status: 429 })), 'rate-limited');
  assert.equal(classifyError(Object.assign(new Error('x'), { status: 404 })), 'non-retryable');
});

test('stealth headers builder', () => {
  const { getStealthHeaders } = require('@jobscrapper/core/headers');
  const searchHeaders = getStealthHeaders({ isDetail: false });
  assert.ok(searchHeaders['User-Agent'].includes('Mozilla/5.0'));
  assert.ok(!searchHeaders['User-Agent'].includes('jobscrapper'));
  assert.equal(searchHeaders['Accept-Language'], 'en-US,en;q=0.9');
  assert.equal(searchHeaders['Sec-Fetch-Site'], 'none');
  assert.equal(searchHeaders['Sec-Fetch-Dest'], 'document');
  assert.equal(searchHeaders['Referer'], undefined);

  const detailHeaders = getStealthHeaders({ isDetail: true, referer: 'https://example.com/search' });
  assert.equal(detailHeaders['Sec-Fetch-Site'], 'same-origin');
  assert.equal(detailHeaders['Referer'], 'https://example.com/search');

  const jsonHeaders = getStealthHeaders({ accept: 'application/json' });
  assert.ok(jsonHeaders['Accept'].includes('application/json'));
  assert.equal(jsonHeaders['Sec-Fetch-Dest'], 'empty');
});

test('crawler formatErrorSummary', () => {
  const { formatErrorSummary } = require('@jobscrapper/core/crawler');
  assert.equal(formatErrorSummary([], 14), null);
  
  const blockedErrors = Array.from({ length: 14 }, () => ({
    stage: 'search', status: 403, kind: 'blocked', message: 'blocked 403'
  }));
  assert.equal(formatErrorSummary(blockedErrors, 14), 'Blocked (403) on 14/14 queries');

  const mixedErrors = [
    { stage: 'search', status: 429, kind: 'rate-limited', message: 'rate limited 429' },
    { stage: 'search', status: 429, kind: 'rate-limited', message: 'rate limited 429' },
    { stage: 'search', status: null, kind: 'network-error', message: 'timeout' },
  ];
  assert.equal(formatErrorSummary(mixedErrors, 14), 'Rate limited (429) on 2/14 queries; Network error on 1/14 queries');
});

