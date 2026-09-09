'use strict';

// Single production gate: every job passes relevance + experience + profile
// rules here, using the FULL description when available.
const { classify } = require('./classifier');
const { experienceDecision } = require('./experience-filter');

const EGYPT_RE = /\b(egypt|cairo|giza|alexandria|mansoura|luxor|aswan|tanta|zagazig|ismailia|port\s*said|suez|assiut|asyut|fayoum|beni\s*suef|minya|sohag|qena|sharqia|gharbia|monufia|beheira|kafr|damietta|matrouh|sinai|red\s*sea|new\s*valley|qalyubia|banha|shibin|october|ramadan|hurghada|sharm|el\s*gouna|smart\s*village|maadi|nasr\s*city|heliopolis|dokki|mohandessin|tagamoa|5th\s*settlement)\b/i;

const FOREIGN_LOC_RE = /\b(united states|usa|\bus\b|\buk\b|united kingdom|germany|deutschland|india|poland|brazil|brasil|spain|españa|espana|france|canada|australia|italy|italia|saudi arabia|uae|dubai|riyadh|singapore|netherlands|sweden|switzerland|turkey|mexico|colombia|argentina|philippines|vietnam|indonesia|pakistan|bangladesh|nigeria|kenya|south africa)\b/i;

function isEgyptOrRemote(job) {
  if (job.remote === true) return true;
  if (job.source === 'wuzzuf') return true;
  const loc = String(job.location || '').trim();
  if (!loc) return true;
  if (EGYPT_RE.test(loc)) return true;
  if (FOREIGN_LOC_RE.test(loc)) return false;
  return true;
}

function passesFilters(job, profile = {}) {
  const p = {
    experience: { min: 0, max: 2 },
    requireFullDescription: false,
    remoteOnly: false,
    requireEgyptOrRemote: true,
    ...profile,
  };
  const cls = classify(job, p);
  if (cls.relevance === 'reject') return { accept: false, reason: cls.reason, stage: 'relevance' };
  const exp = experienceDecision(job, p.experience.max, p);
  if (!exp.accept) return { accept: false, reason: exp.reason, stage: 'experience' };
  if (p.requireFullDescription && job.descriptionComplete !== true) {
    return { accept: false, reason: 'description not fully verified', stage: 'verification' };
  }
  if (p.maxAgeDays && job.postedAt) {
    const t = Date.parse(job.postedAt);
    if (!Number.isNaN(t) && (Date.now() - t) / 86400000 > p.maxAgeDays) {
      return { accept: false, reason: `posted over ${p.maxAgeDays} days ago`, stage: 'recency' };
    }
  }
  if (p.remoteOnly && job.remote !== true) return { accept: false, reason: 'not remote', stage: 'location' };
  if (p.requireEgyptOrRemote !== false && !isEgyptOrRemote(job)) {
    return { accept: false, reason: 'location not in Egypt or Remote', stage: 'location' };
  }
  return { accept: true, reason: `${cls.relevance} + within ${p.experience.min}-${p.experience.max}y`, stage: 'ok', relevance: cls.relevance };
}

module.exports = { passesFilters, isEgyptOrRemote };
