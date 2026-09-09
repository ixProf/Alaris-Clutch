# jobscrapper

Finds **junior .NET backend jobs (0–2 years)** across LinkedIn, Wuzzuf,
Indeed, Glassdoor, RemoteOK, Arbeitnow and Remotive — then filters, dedupes
and exports them to Excel. Zero runtime dependencies (Node 18+).

```bash
npm install     # link workspaces (no external packages)
npm test        # 38 checks — keep green
npm run scrape  # run it
```

---

## 1. Configure it for you (no code)

### Step 1 — create your config file

```bash
cp jobscrapper.config.example.json jobscrapper.config.json
```

```jsonc
{
  "profile": "egypt-junior",   // which filter set to use (see §3)
  "profiles": {                // override/extend any profile, per user
    "egypt-junior": { "maxAgeDays": 90, "remoteOnly": false }
  },
  "sources": {                 // enable + tune each site independently
    "linkedin":  { "enabled": true,  "maxPages": 10 },
    "wuzzuf":    { "enabled": true,  "maxPages": 1 },
    "indeed":    { "enabled": true,  "maxPages": 1 },
    "glassdoor": { "enabled": false },   // burst rate-limits; enable occasionally
    "remoteok":  { "enabled": false },   // feed currently degraded
    "arbeitnow": { "enabled": true,  "maxPages": 5 },
    "remotive":  { "enabled": true,  "maxPages": 1 }
  },
  "experience": { "min": 0, "max": 2 },
  "email": { "to": "you@mail.com", "sendAfterScrape": false },
  "schedule": { "everyHours": 4 }
}
```

Only include keys you want to change — everything else falls back to
built-ins (`packages/config/config.js`).

### Step 2 — secrets (never in the config file)

```bash
cp .env.example .env   # then fill in:
```

```bash
GMAIL_USER=you@gmail.com                 # sender (needs an App Password)
GMAIL_APP_PASS=xxxx xxxx xxxx xxxx       # myaccount.google.com/apppasswords
JOB_PROFILE=egypt-junior                 # default profile if --profile omitted
CONFIG_PATH=./jobscrapper.config.json    # only if stored elsewhere
```

### Step 3 — run

```bash
npm run scrape                                            # everything, your profile
npm run scrape -- --profile strict --max-pages 3
npm run scrape -- --source linkedin --query ".NET Developer"
npm run scrape -- --remote-only --max-age-days 30 --dry-run
node apps/cli/index.js --help                             # all 13 flags
```

**Precedence:** built-ins `< jobscrapper.config.json < CLI flags / env`.

| flag | what it does |
|---|---|
| `--source <name>` (repeatable) | run only these sites |
| `--query "..."` (repeatable) | replace the 14 built-in + 6 remote queries |
| `--max-pages N` | pages per query per site |
| `--profile <name>` | `egypt-junior` (default) \| `standard` \| `strict` \| `remote-strict` |
| `--config <path>` | use a different config file |
| `--remote-only` | remote jobs only (overrides profile) |
| `--max-age-days N` | drop posts older than N days |
| `--max-exp N` | experience ceiling (default 2) |
| `--require-full-desc` | drop jobs whose full text couldn't be fetched |
| `--dry-run` | scrape + filter, save nothing |

---

## 2. How it works (the pipeline)

```text
queries (14 general + 6 remote, per-source search/filter)
  → fetch with retry (exponential backoff + jitter, per-source rate limits)
  → parse (source-specific, isolated per site)
  → normalize to ONE schema (null when unknown, never invented)
  → GATE (relevance → experience → verification → recency, §3)
  → deduplicate (source+id → canonical URL → company+title+location → fingerprint)
  → SQLite (+ JSON fallback), fingerprint detects edits, repeats skipped
  → export/orders: remote (≤1d, ≤1w, older) → Egypt on-site → other
```

One failing job/page/source never stops the rest (bounded worker pools,
per-source error isolation, structured JSON logs).

## 3. The filters (what “relevant” means)

Every job must pass `passesFilters()` (`packages/core/gate.js`):

1. **Relevance** — title must carry .NET/ASP.NET Core/C# **or**
   backend/API/software developer roles **plus** .NET-stack tech
   (`.net, dotnet, c#, csharp, asp.net core, entity framework, ef core`) in the text.
   Rejected: `senior/sr/staff/lead/principal/architect/manager/SME`
   (incl. `sênior/sénior`), `mid/middle/pleno/intermediate`, talent-pools,
   and Java/PHP/Node/Python/Ruby/Go-first roles.
2. **Experience** — *every* number in the **full** description is checked:
   ranges (`4-6 years`), `N+ years`, `at least/minimum N`, word forms
   (“three to five years”), in **EN/ES/PT/IT/DE/FR**
   (`4 y 5 años`, `al menos 5 años`, `3 anos de experiência`,
   `5 anni di esperienza`, `3 Jahre Erfahrung`, `2 ans d'expérience`).
   The **strictest** value wins; anything above your max is out.
   LinkedIn `Seniority level: Mid-Senior`-style fields are enforced too.
3. **Verification** — `strict`/`remote-strict` drop jobs whose full page
   couldn't be fetched (Indeed/Wuzzuf often 403 details); otherwise they're
   kept but flagged `descriptionComplete: FALSE` so you can see it.
4. **Recency/location** — `maxAgeDays` (default 90) drops stale posts;
   `remoteOnly` keeps remote roles.

## 4. Output

`exports/jobs-YYYY-MM-DD.csv` (opens in Excel) + `.html` (print → PDF):

```text
group | ageBucket | title | company | location | remote | postedAt |
experienceMin | experienceMax | employmentType | technologies | salary |
source | relevance | descriptionComplete | url | scrapedAt | description
```

## 5. Email digest every 4 hours (Windows)

```powershell
powershell -File apps/cli/notify.ps1   # recipient from email.to
schtasks /create /tn JobScraper /tr "powershell -File E:\epub-to-pdf\jobscrapper\apps\cli\notify.ps1" /sc hourly /mo 4
```

## 6. Sources — honest status

| site | method | reality |
|---|---|---|
| LinkedIn | public guest API + detail pages (incl. `f_WT=2` worldwide-remote round) | ✅ works, full text |
| Wuzzuf | /search is bot-blocked; discovery via public sitemap + detail pages | ⚠️ partial (EG/SA pool is small for .NET) |
| Indeed | cards work; details + deep pages often 403 | ⚠️ snippets only |
| Glassdoor | search parses, but burst 403s | ❌ off by default |
| RemoteOK | public API, feed currently non-tech | ❌ off by default |
| Arbeitnow / Remotive | public APIs, full text | ✅ work — but carry ~zero junior .NET roles |

No CAPTCHA/auth/ToS bypasses, ever. Blocked sources log and continue.

## 7. Contribute (monorepo)

```text
apps/cli            scrape / export / refilter / backfill / resanitize / notify
packages/config     defaults, profiles, config file, .env, flag merging
packages/core       gate, classifier, experience-filter, normalizer,
                    deduplicator, crawler, retry, rate-limit, logger
packages/sources    one folder per site: scraper + parser + selectors
packages/storage    SQLite (node:sqlite) + JSON fallback, fingerprints
test/               node:test suites, fixtures only (no live calls)
```

**New source in 4 steps:** implement `BaseScraper`
(`search(query,{page})`, `scrapeJob(url)`, `normalize(raw)`)
→ tolerant `parser.js` + fixtures → register in
`packages/sources/registry.js` → defaults in `packages/config/config.js`.
Keep site logic out of `core/`, keep `npm test` green.
