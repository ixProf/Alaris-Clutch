import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EGYPT_RE = /egypt|cairo|giza|alexandria|mansoura|luxor|aswan|tanta|zagazig|ismailia|port said|suez|assiut|fayoum|beni suef|minya|sohag|qena|sharqia|gharbia|monufia|beheira|kafr|damietta|matrouh|sinai|red sea|new valley|qalyubia/i;

export function getLocationGroup(job: { remote?: boolean | number | null; location?: string | null }): 'remote' | 'egypt-onsite' | 'other' {
  if (job.remote === true || job.remote === 1) return 'remote';
  if (EGYPT_RE.test(String(job.location || ''))) return 'egypt-onsite';
  return 'other';
}

export function getAgeBucket(postedAt?: string | Date | null): '24h' | '1week' | 'older' | 'unknown' {
  if (!postedAt) return 'unknown';
  const t = typeof postedAt === 'string' ? Date.parse(postedAt) : postedAt.getTime();
  if (Number.isNaN(t)) return 'unknown';
  const hours = (Date.now() - t) / 3600000;
  if (hours <= 24) return '24h';
  if (hours <= 24 * 7) return '1week';
  return 'older';
}

export function formatRelativeTime(dateInput?: string | Date | null): string {
  if (!dateInput) return 'Recently';
  const t = typeof dateInput === 'string' ? Date.parse(dateInput) : dateInput.getTime();
  if (Number.isNaN(t)) return 'Recently';
  const diffSec = Math.floor((Date.now() - t) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  return new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatExperience(min?: number | null, max?: number | null): string {
  if (min === null || min === undefined) {
    if (max === null || max === undefined) return 'Not specified';
    return `Up to ${max} yrs`;
  }
  if (max === null || max === undefined) {
    return `${min}+ yrs`;
  }
  if (min === max) {
    return `${min} yrs`;
  }
  return `${min}–${max} yrs`;
}
