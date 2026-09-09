'use strict';

const DOTNET_STACK = [
  'c#',
  'csharp',
  '.net',
  'dotnet',
  'asp.net',
  'aspnet',
  'asp.net core',
  'aspnet core',
  'web api',
  'rest api',
  'entity framework',
  'entity framework core',
  'ef core',
  'sql server',
  'postgresql',
  'postgres',
  'linq',
  'jwt',
  'redis',
  'signalr',
];

const BACKEND_CTX = [
  'backend',
  'back-end',
  'back end',
  'rest api',
  'restful',
  'web api',
  'graphql',
  'microservice',
  'microservices',
  'server-side',
  'server side',
  'api developer',
  'api engineer',
  'asp.net core',
  'aspnet core',
  'web services',
];

const SENIOR_RE =
  /\b(senior|sênior|sénior|sr\.?|staff|lead|principal|architect|manager|director|head of|sme|subject matter expert|iii|iv)\b/i;

const TALENT_POOL_RE =
  /talent pool|talent network|banco de talentos|future opportunit|join our (talent|team|pool)|evergreen|general application|jobs at$/i;

const MID_RE =
  /\b(mid([\s-]?level|[\s-]?senior)?|middle|intermediate|intermedio|pleno|semi[\s-]?senior|semi[\s-]?sr)\b/i;

const DOTNET_RE =
  /(?:\.net|dotnet|asp\.?net|csharp|c#)/i;

const TITLE_DOTNET_RE =
  /(?:\.net|dotnet|asp\.?net|c#|csharp)/i;

const TITLE_ROLE_RE =
  /backend|back[\s-]?end|\bapi\b|software engineer|software developer|web developer|web engineer|developer|engineer|programmer/i;


// Technologies that should not be the primary stack.
const OTHER_STACK_PATTERNS = {
  java: /\bjava\b(?!script)|spring(?: boot)?/i,

  php: /\bphp\b|laravel/i,

  node: /node\.?js|nodejs|express(?:\.js)?|nestjs|nest\.js|fastify|koa|hapi(?:js)?/i,

  python: /\bpython\b|django|flask|fastapi/i,

  ruby: /ruby on rails|\bruby\b/i,

  go: /golang|\bgo\b/i,
};


function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}


function containsToken(hay, token) {
  const t = normalizeText(token);

  if (!t) {
    return false;
  }

  if (t === 'c#') {
    return /(?:^|[^a-z0-9])c#(?:$|[^a-z0-9])/i.test(hay);
  }

  if (t === '.net') {
    return /(?:^|[^a-z0-9])\.net(?:$|[^a-z0-9])/i.test(hay);
  }

  return hay.includes(t);
}


function classify(job, profile = {}) {
  const p = {
    rejectSeniorTitles: true,
    rejectMidTitles: true,
    rejectTalentPools: true,

    titleScope: 'dotnet-backend',

    techAny: DOTNET_STACK,

    ...profile,
  };

  const stack =
    Array.isArray(p.techAny) && p.techAny.length
      ? p.techAny
      : DOTNET_STACK;

  const title = String(job.title || '');

  const low = normalizeText(title);

  const desc = normalizeText(
    `${job.description || ''}\n${job.requirements || ''}`
  );

  const hay = `${low}\n${desc}`;


  // Technologies found in the complete job text.
  const stackHits = stack.filter((tech) =>
    containsToken(hay, tech)
  );


  // Core .NET signals.
  const dotnetHits = stackHits.filter((tech) =>
    /c#|csharp|\.net|dotnet|aspnet|asp\.net|web api|rest api|entity framework|ef core/i.test(
      tech
    )
  );


  const backendCtx = BACKEND_CTX.some((term) =>
    hay.includes(term)
  );


  const titleDotnet = TITLE_DOTNET_RE.test(low);

  const titleRole = TITLE_ROLE_RE.test(low);


  // Detect other ecosystems in the title.
  const otherStacks = Object.entries(OTHER_STACK_PATTERNS)
    .filter(([, regex]) => regex.test(low))
    .map(([name]) => name);


  // -----------------------------------------
  // Senior rejection
  // -----------------------------------------

  if (
    p.rejectSeniorTitles !== false &&
    SENIOR_RE.test(title)
  ) {
    return result(
      'reject',
      'senior-level title',
      stackHits,
      0
    );
  }


  // -----------------------------------------
  // Mid-level rejection
  // -----------------------------------------

  if (
    p.rejectMidTitles !== false &&
    MID_RE.test(title) &&
    !/\b(intern|internship|entry|graduate|trainee)\b/i.test(low)
  ) {
    return result(
      'reject',
      'mid-level title',
      stackHits,
      0
    );
  }


  // -----------------------------------------
  // Talent pool rejection
  // -----------------------------------------

  if (
    p.rejectTalentPools !== false &&
    TALENT_POOL_RE.test(title)
  ) {
    return result(
      'reject',
      'talent-pool/generic post',
      stackHits,
      0
    );
  }


  // -----------------------------------------
  // All Tech Scope (multi-category platform)
  // -----------------------------------------

  if (p.allowAllTech === true || p.titleScope === 'all-tech') {
    const NON_TECH_RE = /\b(sales|account executive|copywriter|writer|writing|recruiter|customer support|support jedi|call center|telemarketer|cashier|waiter|driver|administrative|office manager)\b/i;
    const DEV_OVERRIDE_RE = /\b(developer|engineer|programmer|architect|coder|devops|sre|full[\s-]?stack|backend|frontend|data scientist)\b/i;
    if (NON_TECH_RE.test(title) && !DEV_OVERRIDE_RE.test(title)) {
      return result('reject', 'non-tech job role', stackHits, 0);
    }
    const TECH_TITLE_RE = /developer|engineer|programmer|architect|coder|specialist|devops|sre|analyst|full[\s-]?stack|backend|frontend|front[\s-]?end|mobile|data|qa|tester|software|web developer/i;
    if (TECH_TITLE_RE.test(low) || otherStacks.length > 0 || stackHits.length > 0 || titleDotnet || titleRole) {
      return result('high', 'software/tech role', stackHits, 90, dotnetHits);
    }
  }

  // -----------------------------------------
  // Title relevance
  // -----------------------------------------

  if (
    p.titleScope === 'dotnet-backend' &&
    !titleDotnet &&
    !titleRole
  ) {
    return result(
      'reject',
      'title not .NET/backend focused',
      stackHits,
      0
    );
  }


  // -----------------------------------------
  // Other backend ecosystems
  // -----------------------------------------

  if (
    otherStacks.length &&
    !titleDotnet &&
    dotnetHits.length < 2
  ) {
    return result(
      'reject',
      `primarily non-.NET stack (${otherStacks.join(', ')})`,
      stackHits,
      0
    );
  }


  // -----------------------------------------
  // Strong .NET title
  // -----------------------------------------

  if (
    titleDotnet &&
    (backendCtx || titleRole)
  ) {
    const score = scoreJob({
      title,
      hay,
      stackHits,
      dotnetHits,
      backendCtx,
      otherStacks,
    });

    return result(
      score >= 85
        ? 'high'
        : 'medium',

      'strong .NET title + backend context',

      stackHits,

      score,

      dotnetHits
    );
  }


  // -----------------------------------------
  // Backend title + strong .NET description
  // -----------------------------------------

  if (
    titleRole &&
    dotnetHits.length >= 2 &&
    backendCtx
  ) {
    const score = scoreJob({
      title,
      hay,
      stackHits,
      dotnetHits,
      backendCtx,
      otherStacks,
    });

    return result(
      score >= 75
        ? 'high'
        : 'medium',

      'backend title with strong .NET stack',

      stackHits,

      score,

      dotnetHits
    );
  }


  // -----------------------------------------
  // Backend title + at least one .NET signal
  // -----------------------------------------

  if (
    titleRole &&
    dotnetHits.length >= 1 &&
    (
      backendCtx ||
      /developer|engineer|programmer/i.test(low)
    )
  ) {
    const score = scoreJob({
      title,
      hay,
      stackHits,
      dotnetHits,
      backendCtx,
      otherStacks,
    });

    return result(
      'medium',

      'backend/software title with .NET signal',

      stackHits,

      score,

      dotnetHits
    );
  }


  return result(
    'reject',
    'no .NET backend signal',
    stackHits,
    0,
    dotnetHits
  );
}


function scoreJob({
  title,
  hay,
  stackHits,
  dotnetHits,
  backendCtx,
  otherStacks,
}) {
  let score = 45;


  // .NET appears in title.
  if (TITLE_DOTNET_RE.test(title)) {
    score += 25;
  }


  // ASP.NET Core.
  if (/asp\.?net core|aspnet core/i.test(hay)) {
    score += 10;
  }


  // C#.
  if (
    /(?:^|[^a-z])c#(?:$|[^a-z])|csharp/i.test(hay)
  ) {
    score += 7;
  }


  // Web API / REST.
  if (/web api|rest api/i.test(hay)) {
    score += 6;
  }


  // Entity Framework.
  if (/entity framework|ef core/i.test(hay)) {
    score += 4;
  }


  // SQL.
  if (/sql server|postgresql|postgres/i.test(hay)) {
    score += 2;
  }


  // Redis.
  if (/redis/i.test(hay)) {
    score += 1;
  }


  // SignalR.
  if (/signalr/i.test(hay)) {
    score += 1;
  }


  if (backendCtx) {
    score += 5;
  }


  // Additional .NET-related technologies.
  score += Math.min(dotnetHits.length, 5) * 2;


  // Penalize other ecosystems.
  score -= otherStacks.length * 8;


  return Math.max(
    0,
    Math.min(100, score)
  );
}


function result(
  relevance,
  reason,
  tech,
  score,
  matchedSkills = tech
) {
  return {
    relevance,

    reason,

    tech,

    matchedSkills,

    score,
  };
}


function isRelevant(job, profile) {
  return (
    classify(job, profile).relevance !== 'reject'
  );
}


module.exports = {
  classify,
  isRelevant,
  BACKEND_TECH: DOTNET_STACK,
  DOTNET_STACK,
};