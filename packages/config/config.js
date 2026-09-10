'use strict';

const SEARCH_QUERIES = [
  'Junior .NET Developer',
  'Junior ASP.NET Core Developer',
  'Junior ASP.NET Developer',
  'Junior C# Developer',
  'Junior C# Backend Developer',
  'Junior .NET Backend Developer',
  'Junior .NET Backend Engineer',
  'Junior ASP.NET Core Backend Engineer',
  'Entry Level .NET Developer',
  'Entry Level ASP.NET Core Developer',
  'C# Web API Developer',
  'ASP.NET Core Web API Developer',
  'Junior Backend Developer C#',
  'Junior Backend Engineer .NET',
];

const REMOTE_QUERIES = [
  'Remote Junior .NET Developer',
  'Remote Junior ASP.NET Core Developer',
  'Remote Junior C# Developer',
  'Remote Junior .NET Backend Developer',
  'Remote C# Web API Developer',
  'Remote ASP.NET Core Developer',
];

const config = {
  sources: {
    linkedin: {
      enabled: true,
      maxPages: 10,
      maxJobsPerQuery: 50,
      concurrency: 2,
      requestDelayMs: 1500,
      timeoutMs: 15000,
    },

    wuzzuf: {
      enabled: true,
      maxPages: 10,
      maxJobsPerQuery: 50,
      concurrency: 3,
      requestDelayMs: 1200,
      timeoutMs: 15000,
    },

    indeed: {
      enabled: true,
      maxPages: 1,
      maxJobsPerQuery: 50,
      concurrency: 3,
      requestDelayMs: 1500,
      timeoutMs: 15000,
      maxRetries: 3,
    },

    glassdoor: {
      enabled: false,
      maxPages: 1,
      maxJobsPerQuery: 30,
      concurrency: 1,
      requestDelayMs: 8000,
      timeoutMs: 15000,
      maxRetries: 2,
      note: 'Aggressively rate-limits automated clients (403 bursts); enable manually for occasional runs',
    },

    remoteok: {
      enabled: false,
      maxPages: 1,
      maxJobsPerQuery: 50,
      concurrency: 2,
      requestDelayMs: 1000,
      timeoutMs: 15000,
      note: 'API currently serves a degraded non-tech feed; re-enable when fixed',
    },

    arbeitnow: {
      enabled: true,
      maxPages: 5,
      maxJobsPerQuery: 50,
      concurrency: 2,
      requestDelayMs: 1000,
      timeoutMs: 15000,
    },

    remotive: {
      enabled: true,
      maxPages: 1,
      maxJobsPerQuery: 50,
      concurrency: 2,
      requestDelayMs: 1000,
      timeoutMs: 15000,
    },
  },

  queries: SEARCH_QUERIES,

  remoteQueries: REMOTE_QUERIES,

  location: 'Egypt',

  remoteLocation: 'Remote',

  experience: {
    min: 0,
    max: 2,
  },

  scraping: {
    maxRetries: 5,
    requestTimeout: 15000,
    baseBackoffMs: 1000,
    maxBackoffMs: 8000,

    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  },

  storage: {
    path: './data/jobs.db',
    jsonFallback: './data/jobs.json',
  },
};

function loadOverrides(argv = process.argv.slice(2)) {
  const out = JSON.parse(JSON.stringify(config));

  const get = (flag) => {
    const i = argv.indexOf(flag);

    return i >= 0
      ? argv[i + 1]
      : undefined;
  };

  const has = (flag) => argv.includes(flag);

  if (get('--source')) {
    const source = String(get('--source')).toLowerCase();

    for (const key of Object.keys(out.sources)) {
      out.sources[key].enabled = key === source;
    }
  }

  if (get('--query')) {
    out.queries = [String(get('--query'))];
  }

  if (get('--location')) {
    out.location = String(get('--location'));
  }

  if (get('--max-pages')) {
    const n = parseInt(get('--max-pages'), 10);

    if (!Number.isNaN(n)) {
      for (const key of Object.keys(out.sources)) {
        out.sources[key].maxPages = n;
      }
    }
  }

  if (has('--dry-run')) {
    out.dryRun = true;
  }

  return out;
}

module.exports = {
  config,
  loadOverrides,
  SEARCH_QUERIES,
  REMOTE_QUERIES,
};