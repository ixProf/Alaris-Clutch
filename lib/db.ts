import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { classifyCategories } from './multi-classifier';
import { getLocationGroup, getAgeBucket } from './utils';

// Global PrismaClient instance for Next.js
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export interface JobRecord {
  id: string | number;
  title: string;
  company: string | null;
  location: string | null;
  remote: boolean;
  employmentType: string | null;
  experienceMin: number | null;
  experienceMax: number | null;
  description: string | null;
  requirements: string | null;
  salary: string | null;
  technologies: string[];
  categories: string[];
  source: string;
  sourceJobId: string | null;
  url: string | null;
  canonicalUrl: string | null;
  postedAt: string | null;
  scrapedAt: string;
  fingerprint: string | null;
  relevance: string | null;
}

export interface JobFilterParams {
  search?: string;
  categories?: string[];
  locationGroup?: 'all' | 'remote' | 'egypt-onsite' | 'other';
  experience?: 'all' | 'junior' | 'mid' | 'senior';
  ageBucket?: 'all' | '24h' | '1week' | 'older';
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'relevance';
}

export interface JobsQueryResult {
  jobs: JobRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categoryCounts: Record<string, number>;
  locationCounts: { remote: number; egyptOnsite: number; other: number };
  experienceCounts: { junior: number; mid: number; senior: number };
}

class DatabaseBridge {
  private hasPostgres: boolean = Boolean(process.env.DATABASE_URL);

  private parseJsonArray(val: any): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const p = JSON.parse(val);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }

  private prismaToJobRecord(row: any): JobRecord {
    const techs = this.parseJsonArray(row.technologies);
    let cats = this.parseJsonArray(row.categories);

    if (cats.length === 0) {
      cats = classifyCategories({
        title: row.title,
        description: row.description,
        requirements: row.requirements,
        technologies: techs,
      });
    }

    return {
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      remote: Boolean(row.remote),
      employmentType: row.employmentType,
      experienceMin: row.experienceMin,
      experienceMax: row.experienceMax,
      description: row.description,
      requirements: row.requirements,
      salary: row.salary,
      technologies: techs,
      categories: cats,
      source: row.source,
      sourceJobId: row.sourceJobId,
      url: row.url,
      canonicalUrl: row.canonicalUrl,
      postedAt: row.postedAt ? new Date(row.postedAt).toISOString() : null,
      scrapedAt: row.scrapedAt ? new Date(row.scrapedAt).toISOString() : new Date().toISOString(),
      fingerprint: row.fingerprint,
      relevance: row.relevance,
    };
  }

  public async getJobs(params: JobFilterParams = {}): Promise<JobsQueryResult> {
    const {
      search,
      categories = [],
      locationGroup = 'all',
      experience = 'all',
      ageBucket = 'all',
      page = 1,
      limit = 15,
      sortBy = 'newest',
    } = params;

    // Fetch from Prisma PostgreSQL
    try {
      const rows = await prisma.job.findMany({
        orderBy: sortBy === 'newest' ? { postedAt: 'desc' } : { createdAt: 'desc' },
      });

      const allJobs = rows.map((r) => this.prismaToJobRecord(r));

      // Compute Global Aggregate Counts
      const categoryCounts: Record<string, number> = {};
      let remoteCount = 0;
      let egyptOnsiteCount = 0;
      let otherLocationCount = 0;
      let juniorCount = 0;
      let midCount = 0;
      let seniorCount = 0;

      for (const j of allJobs) {
        for (const cat of j.categories) {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }

        const loc = getLocationGroup(j);
        if (loc === 'remote') remoteCount++;
        else if (loc === 'egypt-onsite') egyptOnsiteCount++;
        else otherLocationCount++;

        const expMin = j.experienceMin ?? 0;
        const expMax = j.experienceMax ?? 99;
        if (expMax <= 2 || (expMin <= 2 && expMax <= 3)) juniorCount++;
        else if (expMin >= 5) seniorCount++;
        else midCount++;
      }

      // Apply Filters
      let filtered = allJobs;

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter((j) => {
          const t = (j.title || '').toLowerCase().includes(q);
          const c = (j.company || '').toLowerCase().includes(q);
          const l = (j.location || '').toLowerCase().includes(q);
          const tech = j.technologies.some((techItem) => techItem.toLowerCase().includes(q));
          const cat = j.categories.some((catItem) => catItem.toLowerCase().includes(q));
          return t || c || l || tech || cat;
        });
      }

      if (categories.length > 0) {
        filtered = filtered.filter((j) =>
          categories.some((selCat) => j.categories.includes(selCat))
        );
      }

      if (locationGroup && locationGroup !== 'all') {
        filtered = filtered.filter((j) => getLocationGroup(j) === locationGroup);
      }

      if (experience && experience !== 'all') {
        filtered = filtered.filter((j) => {
          const expMin = j.experienceMin ?? 0;
          const expMax = j.experienceMax ?? 99;
          if (experience === 'junior') return expMax <= 2 || (expMin <= 2 && expMax <= 3);
          if (experience === 'mid') return (expMin >= 2 && expMin < 5) || (expMax >= 3 && expMax <= 5);
          if (experience === 'senior') return expMin >= 5 || expMax > 5;
          return true;
        });
      }

      if (ageBucket && ageBucket !== 'all') {
        filtered = filtered.filter((j) => getAgeBucket(j.postedAt) === ageBucket);
      }

      const total = filtered.length;
      const startIndex = (page - 1) * limit;
      const paginatedJobs = filtered.slice(startIndex, startIndex + limit);

      return {
        jobs: paginatedJobs,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        categoryCounts,
        locationCounts: {
          remote: remoteCount,
          egyptOnsite: egyptOnsiteCount,
          other: otherLocationCount,
        },
        experienceCounts: {
          junior: juniorCount,
          mid: midCount,
          senior: seniorCount,
        },
      };
    } catch (err) {
      console.error('Prisma query error:', err);
      return {
        jobs: [],
        total: 0,
        page: 1,
        limit,
        totalPages: 1,
        categoryCounts: {},
        locationCounts: { remote: 0, egyptOnsite: 0, other: 0 },
        experienceCounts: { junior: 0, mid: 0, senior: 0 },
      };
    }
  }

  public async getJobById(id: string): Promise<JobRecord | null> {
    try {
      const row = await prisma.job.findFirst({
        where: {
          OR: [{ id: id }, { sourceJobId: id }],
        },
      });
      if (!row) return null;
      return this.prismaToJobRecord(row);
    } catch {
      return null;
    }
  }

  public async upsertJob(job: Partial<JobRecord>): Promise<'new' | 'updated' | 'duplicate'> {
    const cats =
      job.categories ||
      classifyCategories({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        technologies: job.technologies,
      });

    const techsJson = JSON.stringify(job.technologies || []);
    const catsJson = JSON.stringify(cats);

    try {
      const source = job.source || 'web';
      const sourceJobId = job.sourceJobId || String(job.id || Math.random());

      const existing = await prisma.job.findUnique({
        where: {
          source_sourceJobId: { source, sourceJobId },
        },
      });

      if (!existing) {
        await prisma.job.create({
          data: {
            title: job.title || 'Untitled',
            company: job.company,
            location: job.location,
            remote: Boolean(job.remote),
            employmentType: job.employmentType,
            experienceMin: job.experienceMin,
            experienceMax: job.experienceMax,
            description: job.description,
            requirements: job.requirements,
            salary: job.salary,
            technologies: techsJson,
            categories: catsJson,
            source,
            sourceJobId,
            url: job.url,
            canonicalUrl: job.canonicalUrl,
            postedAt: job.postedAt ? new Date(job.postedAt) : null,
            fingerprint: job.fingerprint,
            relevance: job.relevance || 'medium',
          },
        });
        return 'new';
      }

      if (existing.fingerprint !== job.fingerprint) {
        await prisma.job.update({
          where: { id: existing.id },
          data: {
            title: job.title || existing.title,
            company: job.company || existing.company,
            location: job.location || existing.location,
            description: job.description || existing.description,
            requirements: job.requirements || existing.requirements,
            technologies: techsJson,
            categories: catsJson,
            salary: job.salary || existing.salary,
            fingerprint: job.fingerprint || existing.fingerprint,
          },
        });
        return 'updated';
      }

      return 'duplicate';
    } catch (e) {
      console.error('Upsert job error:', e);
      return 'duplicate';
    }
  }

  public async getScraperStatus(): Promise<{
    lastRun: any;
    sourceStatuses: any[];
    totalJobsCount: number;
  }> {
    try {
      const totalJobsCount = await prisma.job.count();
      const lastRun = await prisma.scrapeRun.findFirst({
        orderBy: { startedAt: 'desc' },
      });
      const sourceStatuses = await prisma.sourceStatus.findMany({
        orderBy: { name: 'asc' },
      });

      return {
        lastRun,
        sourceStatuses,
        totalJobsCount,
      };
    } catch {
      return {
        lastRun: null,
        sourceStatuses: [],
        totalJobsCount: 0,
      };
    }
  }

  public async recordScrapeRun(metrics: {
    status: string;
    startedAt: string;
    finishedAt: string;
    summary: any;
  }) {
    try {
      await prisma.scrapeRun.create({
        data: {
          status: metrics.status,
          startedAt: new Date(metrics.startedAt),
          finishedAt: new Date(metrics.finishedAt),
          summary: JSON.stringify(metrics.summary),
        },
      });
    } catch (e) {
      console.error('recordScrapeRun error:', e);
    }
  }

  public async updateSourceStatus(status: {
    sourceKey: string;
    name: string;
    lastJobCount: number;
    status: string;
    lastError?: string;
  }) {
    try {
      await prisma.sourceStatus.upsert({
        where: { sourceKey: status.sourceKey },
        update: {
          lastScrapedAt: new Date(),
          lastJobCount: status.lastJobCount,
          status: status.status,
          lastError: status.lastError || null,
        },
        create: {
          sourceKey: status.sourceKey,
          name: status.name,
          lastScrapedAt: new Date(),
          lastJobCount: status.lastJobCount,
          status: status.status,
          lastError: status.lastError || null,
        },
      });
    } catch (e) {
      console.error('updateSourceStatus error:', e);
    }
  }
}

export const dbBridge = new DatabaseBridge();
