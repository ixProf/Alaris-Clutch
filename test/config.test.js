'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { applyFile, resolveProfileName } = require('@jobscrapper/config/store');
const { loadEnv } = require('@jobscrapper/config/env');
const { buildConfig, HELP } = require('../apps/cli/index.js');

test('config file merges over defaults', () => {
  const base = { queries: ['a'], sources: { linkedin: { enabled: true, maxPages: 10 } }, experience: { min: 0, max: 2 }, scraping: { maxRetries: 5 } };
  const out = applyFile(base, { sources: { linkedin: { maxPages: 3 }, glassdoor: { enabled: true } }, experience: { max: 1 }, profile: 'strict' });
  assert.equal(out.sources.linkedin.maxPages, 3);
  assert.equal(out.sources.linkedin.enabled, true);
  assert.equal(out.sources.glassdoor.enabled, true);
  assert.equal(out.experience.max, 1);
  assert.equal(out.profileName, 'strict');
  assert.equal(base.sources.linkedin.maxPages, 10);
});

test('profile resolution: cli > file > env > default', () => {
  assert.equal(resolveProfileName(['--profile', 'strict'], {}), 'strict');
  assert.equal(resolveProfileName([], { profileName: 'standard' }), 'standard');
  process.env.JOB_PROFILE = 'remote-strict';
  assert.equal(resolveProfileName([], {}), 'remote-strict');
  delete process.env.JOB_PROFILE;
  assert.equal(resolveProfileName([], {}), 'egypt-junior');
});

test('env loader parses pairs, respects existing vars', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-'));
  const fp = path.join(dir, '.env');
  fs.writeFileSync(fp, '# comment\nA=1\nB=\"two\"\nEMPTY=\nBADLINE\n');
  process.env.A = 'keep';
  loadEnv(fp);
  assert.equal(process.env.A, 'keep');
  assert.equal(process.env.B, 'two');
  delete process.env.A; delete process.env.B;
});

test('cli buildConfig honors flags and help text', () => {
  const cfg = buildConfig(['--source', 'wuzzuf', '--query', 'X', '--max-pages', '2', '--profile', 'strict', '--remote-only', '--max-age-days', '30', '--dry-run']);
  assert.equal(cfg.sources.wuzzuf.enabled, true);
  assert.equal(cfg.sources.linkedin.enabled, false);
  assert.deepEqual(cfg.queries, ['X']);
  assert.equal(cfg.profile.name, 'strict');
  assert.equal(cfg.profile.remoteOnly, true);
  assert.equal(cfg.profile.maxAgeDays, 30);
  assert.equal(cfg.dryRun, true);
  assert.ok(HELP.includes('--profile'));
});
