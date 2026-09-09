export interface CategoryDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  badgeColor: string;
  borderColor: string;
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    id: 'dotnet',
    name: '.NET / C#',
    slug: 'dotnet',
    description: 'C#, ASP.NET Core, Entity Framework, Web API, Blazor',
    badgeColor: 'bg-[#1F2024] text-[#a78bfa] border-[rgba(255,255,255,0.08)]',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  {
    id: 'nodejs',
    name: 'Node.js / TypeScript',
    slug: 'nodejs',
    description: 'Node.js, Express, NestJS, TypeScript, Fastify, Next.js',
    badgeColor: 'bg-[#1F2024] text-[#EEEEEE] border-[rgba(255,255,255,0.08)]',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  {
    id: 'python',
    name: 'Python / AI',
    slug: 'python',
    description: 'Python, FastAPI, Django, PyTorch, LLMs, Machine Learning',
    badgeColor: 'bg-[#1F2024] text-[#8b5cf6] border-[rgba(255,255,255,0.08)]',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  {
    id: 'java',
    name: 'Java / Spring',
    slug: 'java',
    description: 'Java, Spring Boot, Hibernate, Microservices, JVM',
    badgeColor: 'bg-[#1F2024] text-[#EEEEEE] border-[rgba(255,255,255,0.08)]',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  {
    id: 'php',
    name: 'PHP / Laravel',
    slug: 'php',
    description: 'PHP, Laravel, Symfony, WordPress, Modern Backend',
    badgeColor: 'bg-[#1F2024] text-[#8A8F98] border-[rgba(255,255,255,0.08)]',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  {
    id: 'frontend',
    name: 'Frontend / Web',
    slug: 'frontend',
    description: 'React, Next.js, Vue, Angular, Tailwind, UI/UX Engineering',
    badgeColor: 'bg-[#1F2024] text-[#5E6AD2] border-[rgba(255,255,255,0.08)]',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    slug: 'mobile',
    description: 'Flutter, React Native, iOS, Swift, Android, Kotlin',
    badgeColor: 'bg-[#1F2024] text-[#a78bfa] border-[rgba(255,255,255,0.08)]',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  {
    id: 'data',
    name: 'Data & Databases',
    slug: 'data',
    description: 'PostgreSQL, SQL Server, Redis, Kafka, Data Engineering, ETL',
    badgeColor: 'bg-[#1F2024] text-[#EEEEEE] border-[rgba(255,255,255,0.08)]',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    slug: 'devops',
    description: 'Docker, Kubernetes, AWS, Azure, CI/CD, Terraform, SRE',
    badgeColor: 'bg-[#1F2024] text-[#9499A3] border-[rgba(255,255,255,0.08)]',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  {
    id: 'systems',
    name: 'Go / Rust / Systems',
    slug: 'systems',
    description: 'Golang, Rust, C++, Embedded Systems, Distributed Computing',
    badgeColor: 'bg-[#1F2024] text-[#7c3aed] border-[rgba(255,255,255,0.08)]',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
];

interface PatternRule {
  categoryId: string;
  titleRegex: RegExp;
  bodyKeywords: string[];
}

const CATEGORY_RULES: PatternRule[] = [
  {
    categoryId: 'dotnet',
    titleRegex: /(?:\.net|dotnet|c#|csharp|asp\.?net|blazor)/i,
    bodyKeywords: [
      'c#', 'csharp', '.net', 'dotnet', 'asp.net', 'aspnet', 'asp.net core',
      'aspnet core', 'entity framework', 'ef core', 'linq', 'signalr', 'blazor', 'wpf'
    ],
  },
  {
    categoryId: 'nodejs',
    titleRegex: /(?:node\.?js|nodejs|express|nestjs|nest\.js|typescript developer|javascript developer)/i,
    bodyKeywords: [
      'node.js', 'nodejs', 'express.js', 'express', 'nestjs', 'nest.js',
      'fastify', 'koa', 'typescript', 'deno', 'bun', 'next.js'
    ],
  },
  {
    categoryId: 'python',
    titleRegex: /(?:python|django|fastapi|machine learning|ai engineer|data scientist)/i,
    bodyKeywords: [
      'python', 'django', 'flask', 'fastapi', 'pytorch', 'tensorflow',
      'machine learning', 'deep learning', 'nlp', 'llm', 'langchain', 'scikit-learn', 'pandas'
    ],
  },
  {
    categoryId: 'java',
    titleRegex: /(?:java|spring boot)/i,
    bodyKeywords: [
      'java', 'spring boot', 'spring framework', 'hibernate', 'quarkus', 'micronaut', 'maven', 'gradle'
    ],
  },
  {
    categoryId: 'php',
    titleRegex: /(?:php|laravel|symfony|wordpress)/i,
    bodyKeywords: [
      'php', 'laravel', 'symfony', 'codeigniter', 'wordpress', 'drupal'
    ],
  },
  {
    categoryId: 'frontend',
    titleRegex: /(?:frontend|front-end|front end|react|vue|angular|svelte|web developer)/i,
    bodyKeywords: [
      'react', 'react.js', 'reactjs', 'vue', 'vue.js', 'angular', 'svelte',
      'tailwind', 'tailwindcss', 'html5', 'css3', 'redux', 'next.js', 'ui developer'
    ],
  },
  {
    categoryId: 'mobile',
    titleRegex: /(?:mobile|flutter|react native|ios|android|swift|kotlin developer)/i,
    bodyKeywords: [
      'mobile', 'flutter', 'dart', 'react native', 'ios', 'swift', 'swiftui',
      'android', 'kotlin mobile'
    ],
  },
  {
    categoryId: 'data',
    titleRegex: /(?:data engineer|database administrator|dba|bi developer|data analyst)/i,
    bodyKeywords: [
      'sql server', 'postgresql', 'postgres', 'mysql', 'mongodb', 'redis',
      'elasticsearch', 'snowflake', 'spark', 'kafka', 'airflow', 'bigquery', 'data pipeline'
    ],
  },
  {
    categoryId: 'devops',
    titleRegex: /(?:devops|sre|site reliability|cloud engineer|platform engineer|infrastructure)/i,
    bodyKeywords: [
      'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'ci/cd',
      'aws', 'azure', 'gcp', 'helm', 'jenkins', 'github actions', 'cloudformation'
    ],
  },
  {
    categoryId: 'systems',
    titleRegex: /(?:golang|\bgo developer\b|rust|c\+\+|embedded)/i,
    bodyKeywords: [
      'golang', 'go language', 'rust', 'c++', 'embedded systems', 'systems programming'
    ],
  },
];

export function classifyCategories(job: {
  title?: string | null;
  description?: string | null;
  requirements?: string | null;
  technologies?: string[] | string | null;
}): string[] {
  const title = String(job.title || '').toLowerCase();
  const desc = String(job.description || '').toLowerCase();
  const reqs = String(job.requirements || '').toLowerCase();
  const fullText = `${title}\n${desc}\n${reqs}`;

  let rawTechs: string[] = [];
  if (Array.isArray(job.technologies)) {
    rawTechs = job.technologies.map((t) => String(t).toLowerCase());
  } else if (typeof job.technologies === 'string') {
    try {
      const parsed = JSON.parse(job.technologies);
      if (Array.isArray(parsed)) rawTechs = parsed.map((t) => String(t).toLowerCase());
    } catch {
      rawTechs = job.technologies.split(/[,;]/).map((s) => s.trim().toLowerCase());
    }
  }

  const matchedCategories = new Set<string>();

  for (const rule of CATEGORY_RULES) {
    // 1. Direct title match (high confidence)
    if (rule.titleRegex.test(title)) {
      matchedCategories.add(rule.categoryId);
      continue;
    }

    // 2. Hits in extracted technologies array
    const techHits = rule.bodyKeywords.filter((kw) => rawTechs.includes(kw));
    if (techHits.length > 0) {
      matchedCategories.add(rule.categoryId);
      continue;
    }

    // 3. Keyword occurrences in body text
    let keywordCount = 0;
    for (const kw of rule.bodyKeywords) {
      // Word boundary check for short words like c#, .net, php, go
      if (kw === 'c#' || kw === '.net' || kw === 'php') {
        const regex = new RegExp(`(?:^|[^a-z0-9])${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:$|[^a-z0-9])`, 'i');
        if (regex.test(fullText)) keywordCount++;
      } else if (fullText.includes(kw)) {
        keywordCount++;
      }
      if (keywordCount >= 2) break;
    }

    if (keywordCount >= 2) {
      matchedCategories.add(rule.categoryId);
    }
  }

  // Fallback if none matched
  if (matchedCategories.size === 0) {
    if (/engineer|developer|architect|programmer|coder/i.test(title)) {
      matchedCategories.add('frontend'); // or general backend
    }
  }

  return Array.from(matchedCategories);
}
