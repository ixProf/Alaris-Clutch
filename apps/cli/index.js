'use strict';

const { loadEnv } = require('@jobscrapper/config/env');
const { loadOverrides } = require('@jobscrapper/config/config');
const { PROFILES, getProfile } = require('@jobscrapper/config/profiles');
const { findConfigFile, loadConfigFile, applyFile, resolveProfileName } = require('@jobscrapper/config/store');
const { buildScrapers } = require('@jobscrapper/sources/registry');
const { crawlAll } = require('@jobscrapper/core/crawler');
const { Repository } = require('@jobscrapper/storage/repository');

const HELP = `jobscrapper — junior .NET backend job scraper
Usage:
  npm run scrape -- [flags]
  node apps/cli/index.js [flags]

Flags:
  --source <name>      linkedin | wuzzuf | indeed | glassdoor (repeatable)
  --query "..."        search query (repeatable; default: built-in set)
  --location "..."     search location (default: Egypt)
  --max-pages N        pages per query per source
  --profile <name>     filter profile (default: egypt-junior; or JOB_PROFILE env)
  --config <path>      config file (default: jobscrapper.config.json if present)
  --remote-only        only remote jobs (profile override)
  --max-age-days N     drop jobs posted more than N days ago (profile override)
  --max-exp N          maximum years of experience (profile override)
  --require-full-desc  drop jobs whose full description could not be verified
  --dry-run            scrape + filter without saving
  --help               this text

Config file:
  Copy jobscrapper.config.example.json to jobscrapper.config.json and edit.
  Secrets go in .env (see .env.example), never in the config file.
  Precedence: built-in defaults < jobscrapper.config.json < CLI flags / env.

Profiles (packages/config/profiles.js, overridable per user in the config file):
  egypt-junior   0-2y, no senior/mid, .NET-backend titles, Egypt (all governorates) + Remote
  standard       0-2y, no senior/mid, .NET-backend titles, Egypt + Remote
  strict         standard + full description required
  remote-strict  strict + remote only
`;

function multi(argv, flag) {
  return argv.reduce((a, v, i, arr) => (v === flag && arr[i + 1] ? [...a, arr[i + 1]] : a), []);
}

function numAfter(argv, flag) {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? parseInt(argv[i + 1], 10) : undefined;
}

function buildConfig(argv) {
  let cfg = loadOverrides(argv);
  const cfgPath = findConfigFile(argv);
  let file = {};
  if (cfgPath) {
    file = loadConfigFile(cfgPath);
    cfg = applyFile(cfg, file);
    cfg.configPath = cfgPath;
  }
  const onlySources = multi(argv, '--source').map((s) => String(s).toLowerCase());
  if (onlySources.length) {
    for (const k of Object.keys(cfg.sources)) cfg.sources[k] = { ...cfg.sources[k], enabled: onlySources.includes(k) };
  }
  const queries = multi(argv, '--query');
  if (queries.length) cfg.queries = queries;
  const locIndex = argv.indexOf('--location');
  if (locIndex >= 0 && argv[locIndex + 1]) cfg.location = argv[locIndex + 1];
  const profileName = resolveProfileName(argv, cfg);
  const fileProfile = (cfg.profiles && cfg.profiles[profileName]) || {};
  const profile = getProfile(profileName, { ...(PROFILES[profileName] || {}), ...fileProfile });
  if (argv.includes('--remote-only')) profile.remoteOnly = true;
  if (argv.includes('--require-full-desc')) profile.requireFullDescription = true;
  const maxAge = numAfter(argv, '--max-age-days');
  if (maxAge !== undefined && !Number.isNaN(maxAge)) profile.maxAgeDays = maxAge;
  const maxExp = numAfter(argv, '--max-exp');
  if (maxExp !== undefined && !Number.isNaN(maxExp)) profile.experience = { ...(profile.experience || {}), max: maxExp };
  cfg.profile = profile;
  return cfg;
}

async function main(argv = process.argv.slice(2)) {
  loadEnv();
  const cfg = buildConfig(argv);
  console.log(`Profile: ${cfg.profile.name} (0-${cfg.profile.experience.max}y, scope=${cfg.profile.titleScope}, location=${cfg.location || 'Egypt'}, maxAge=${cfg.profile.maxAgeDays || 'any'})`);
  const repo = new Repository({ dbPath: cfg.storage.path, jsonFallback: cfg.storage.jsonFallback });
  const scrapers = buildScrapers(cfg).map(({ scraper }) => scraper);
  const results = await crawlAll(scrapers, cfg, repo);
  const total = results.reduce((a, r) => ({ found: a.found + r.found, relevant: a.relevant + r.relevant, saved: a.saved + r.saved, duplicates: a.duplicates + r.duplicates, failed: a.failed + r.failed }), { found: 0, relevant: 0, saved: 0, duplicates: 0, failed: 0 });
  console.log('\nScraping completed\n');
  for (const r of results) {
    console.log(`${r.source}:\n  Queries: ${r.queries}\n  Jobs found: ${r.found}\n  Relevant: ${r.relevant}\n  New: ${r.saved}\n  Duplicates: ${r.duplicates}\n  Failed: ${r.failed}\n`);
  }
  console.log(`Total:\n  Found: ${total.found}\n  Relevant: ${total.relevant}\n  New: ${total.saved}\n  Duplicates: ${total.duplicates}\n  Failed: ${total.failed}`);
  repo.close();
  return { results, total };
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) { console.log(HELP); process.exit(0); }
  main(argv).catch((e) => { console.error(JSON.stringify({ event: 'SYSTEM_FAILED', error: String(e && e.message) })); process.exit(1); });
}

module.exports = { main, buildConfig, HELP };
