'use strict';
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { Repository } = require('@jobscrapper/storage/repository');

const EGYPT_RE = /egypt|cairo|giza|alexandria|mansoura|luxor|aswan|tanta|zagazig|ismailia|port said| suez|assiut|fayoum|beni suef|minya|sohag|qena|sharqia|gharbia|monufia|beheira|kafr|damietta|matrouh|sinai|red sea|new valley|qalyubia/i;

function groupOf(j) {
  if (j.remote === true) return '1-remote';
  if (EGYPT_RE.test(String(j.location || ''))) return '2-egypt-onsite';
  return '3-other';
}

function ageBucket(postedAt) {
  if (!postedAt) return 'unknown';
  const t = Date.parse(postedAt);
  if (Number.isNaN(t)) return 'unknown';
  const days = (Date.now() - t) / 86400000;
  if (days <= 1) return '1-day';
  if (days <= 7) return '1-week';
  return 'older';
}

function guardFormula(s) {
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
}

function esc(v) {
  let s = String(v ?? '');
  s = guardFormula(s);
  return /[",\n\r;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function safeWriteFileSync(fp, content, encoding) {
  try {
    fs.writeFileSync(fp, content, encoding);
    return fp;
  } catch (err) {
    if (err && err.code === 'EBUSY') {
      const ext = path.extname(fp);
      const base = path.basename(fp, ext);
      const fallback = path.join(path.dirname(fp), `${base}_latest${ext}`);
      fs.writeFileSync(fallback, content, encoding);
      return fallback;
    }
    throw err;
  }
}

function main() {
  const r = new Repository({});
  const jobs = r.all().map((j) => ({ ...j, group: groupOf(j), ageBucket: ageBucket(j.postedAt) }));
  r.close();
  const ts = (j) => { const t = Date.parse(j.postedAt); return Number.isNaN(t) ? -1 : t; };
  jobs.sort((a, b) => a.group.localeCompare(b.group) || ts(b) - ts(a) || String(a.title).localeCompare(String(b.title)));
  const dir = path.join(process.cwd(), 'exports');
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const cols = ['group', 'ageBucket', 'title', 'company', 'location', 'remote', 'postedAt', 'experienceMin', 'experienceMax', 'employmentType', 'technologies', 'salary', 'source', 'relevance', 'descriptionComplete', 'url', 'scrapedAt', 'description'];

  // --- CSV (kept for tools that want plain text; open the .xlsx instead if
  // Excel ever mangles Arabic again — see below) ---
  const EOL = '\r\n';
  const lines = ['sep=,', cols.join(',')];
  for (const j of jobs) lines.push(cols.map((c) => esc(Array.isArray(j[c]) ? j[c].join('; ') : j[c])).join(','));
  const csvPath = safeWriteFileSync(path.join(dir, `jobs-${stamp}.csv`), '\uFEFF' + lines.join(EOL) + EOL, 'utf8');

  // --- XLSX: a real Excel binary file. Text is stored as native XML string
  // values inside the workbook, not as delimited bytes Excel has to guess an
  // encoding for — so Arabic (and any other script) always renders correctly
  // regardless of the machine's regional/codepage settings. This is the
  // recommended file to open. ---
  const cellValue = (v) => (Array.isArray(v) ? v.join('; ') : v ?? '');
  const aoa = [cols, ...jobs.map((j) => cols.map((c) => cellValue(j[c])))];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = cols.map((c) => ({ wch: c === 'description' ? 60 : c === 'location' || c === 'title' ? 28 : 16 }));
  ws['!autofilter'] = { ref: ws['!ref'] };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Jobs');
  const xlsxPath = path.join(dir, `jobs-${stamp}.xlsx`);
  XLSX.writeFile(wb, xlsxPath);

  // --- HTML (grouped, printable) ---
  let lastGroup = '';
  const rows = jobs.map((j) => {
    const h = j.group !== lastGroup ? `<tr><th colspan="${cols.length}" style="background:#eee">${j.group === '1-remote' ? 'REMOTE' : j.group === '2-egypt-onsite' ? 'EGYPT ON-SITE' : 'OTHER LOCATIONS'}</th></tr>` : '';
    lastGroup = j.group;
    return h + `<tr>${cols.map((c) => `<td>${String(Array.isArray(j[c]) ? j[c].join(', ') : (j[c] ?? '')).replace(/</g, '&lt;').slice(0, 2000)}</td>`).join('')}</tr>`;
  }).join('');
  const html = `<html><head><meta charset="utf-8"><title>Jobs ${stamp}</title><style>table{border-collapse:collapse}td,th{border:1px solid #999;padding:6px;font-size:12px}</style></head><body><h1>Scraped Jobs (${jobs.length}) — ${stamp}</h1><p>Order: remote (newest first) → Egypt on-site → other. Print to PDF from browser for PDF.</p><table><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows}</table></body></html>`;
  const htmlPath = safeWriteFileSync(path.join(dir, `jobs-${stamp}.html`), html);

  const counts = {};
  for (const j of jobs) counts[j.group + '/' + j.ageBucket] = (counts[j.group + '/' + j.ageBucket] || 0) + 1;
  console.log(`Exported ${jobs.length} jobs:\n${xlsxPath}  <-- open this one, guaranteed correct Arabic\n${csvPath}\n${htmlPath}`, counts);
}
if (require.main === module) main();
module.exports = { main, groupOf, ageBucket };