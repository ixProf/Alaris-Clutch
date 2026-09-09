'use strict';

// One-time repair tool for jobs.db records whose Arabic text got corrupted
// by being decoded as Windows-1256 instead of UTF-8 somewhere in the scraper
// pipeline (LinkedIn locations/titles/descriptions are the usual victims).
//
// Safe by construction: for any field, it re-encodes the current string as
// win1256 bytes, then decodes those bytes as UTF-8. If the field was never
// corrupted (clean English, or clean Arabic that was always valid UTF-8),
// that round-trip fails to produce valid UTF-8 and the field is left
// untouched. Only strings that really were "UTF-8 bytes misread as
// win1256" will round-trip cleanly back to the original correct text.
//
// Requires iconv-lite as a one-off dev tool (not a runtime dependency of
// the scraper itself):   npm install iconv-lite --save-dev
//
// Usage:
//   node apps/cli/repair-arabic-encoding.js                # dry run, prints a report
//   node apps/cli/repair-arabic-encoding.js --apply         # writes the fixes
//   node apps/cli/repair-arabic-encoding.js --apply --no-backup
//   node apps/cli/repair-arabic-encoding.js --db ./data/jobs.db --apply

const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const TEXT_FIELDS = ['title', 'company', 'location', 'description', 'requirements', 'salary', 'employmentType'];

function tryRepair(str) {
    if (!str || typeof str !== 'string') return null;
    if (!/[\u0600-\u06FF\u0750-\u077F]/.test(str)) return null; // nothing Arabic-looking, skip
    let fixed;
    try {
        const bytes = iconv.encode(str, 'win1256');
        fixed = iconv.decode(bytes, 'utf8');
    } catch {
        return null;
    }
    if (fixed.includes('\uFFFD')) return null; // failed clean round-trip -> leave alone
    if (fixed === str) return null; // no change
    return fixed;
}

function repairTechnologies(raw) {
    let arr;
    try {
        arr = JSON.parse(raw || '[]');
    } catch {
        return null;
    }
    if (!Array.isArray(arr) || !arr.length) return null;
    let changed = false;
    const out = arr.map((t) => {
        const r = tryRepair(t);
        if (r !== null) { changed = true; return r; }
        return t;
    });
    return changed ? JSON.stringify(out) : null;
}

function tryRecomputeFingerprint(job) {
    try {
        // Only touch fingerprint if the project's fingerprint module is reachable;
        // if not, leave it as-is (safe — just means dedup treats it as "changed"
        // once more on the next incremental scrape, which is harmless).
        const { jobFingerprint } = require('@jobscrapper/core/fingerprint');
        return jobFingerprint(job);
    } catch {
        return null;
    }
}

function main() {
    const argv = process.argv.slice(2);
    const apply = argv.includes('--apply');
    const noBackup = argv.includes('--no-backup');
    const dbIdx = argv.indexOf('--db');
    const dbPath = dbIdx >= 0 && argv[dbIdx + 1] ? argv[dbIdx + 1] : './data/jobs.db';

    if (!fs.existsSync(dbPath)) {
        console.error(`Database not found at ${dbPath}`);
        process.exit(1);
    }

    if (apply && !noBackup) {
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `${dbPath}.bak-${stamp}`;
        fs.copyFileSync(dbPath, backupPath);
        console.log(`Backed up ${dbPath} -> ${backupPath}`);
    }

    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync(dbPath);

    const rows = db.prepare('SELECT * FROM jobs').all();
    console.log(`Scanning ${rows.length} rows...`);

    const fieldCounts = {};
    let rowsChanged = 0;
    const updateStmt = db.prepare(
        `UPDATE jobs SET title=?, company=?, location=?, description=?, requirements=?, salary=?, employmentType=?, technologies=?, fingerprint=? WHERE id=?`
    );

    const updates = [];

    for (const row of rows) {
        const patch = {};
        let rowChanged = false;

        for (const field of TEXT_FIELDS) {
            const fixed = tryRepair(row[field]);
            if (fixed !== null) {
                patch[field] = fixed;
                rowChanged = true;
                fieldCounts[field] = (fieldCounts[field] || 0) + 1;
                console.log(`[row ${row.id}] ${field}:`);
                console.log(`  before: ${row[field]}`);
                console.log(`  after : ${fixed}`);
            }
        }

        const fixedTech = repairTechnologies(row.technologies);
        if (fixedTech !== null) {
            patch.technologies = fixedTech;
            rowChanged = true;
            fieldCounts.technologies = (fieldCounts.technologies || 0) + 1;
            console.log(`[row ${row.id}] technologies:`);
            console.log(`  before: ${row.technologies}`);
            console.log(`  after : ${fixedTech}`);
        }

        if (rowChanged) {
            rowsChanged++;
            const merged = { ...row, ...patch };
            const newFingerprint = tryRecomputeFingerprint(merged) || row.fingerprint;
            updates.push({
                id: row.id,
                title: merged.title,
                company: merged.company,
                location: merged.location,
                description: merged.description,
                requirements: merged.requirements,
                salary: merged.salary,
                employmentType: merged.employmentType,
                technologies: merged.technologies,
                fingerprint: newFingerprint,
            });
        }
    }

    console.log('\n--- Summary ---');
    console.log(`Rows scanned : ${rows.length}`);
    console.log(`Rows to fix  : ${rowsChanged}`);
    console.log('By field     :', fieldCounts);

    if (!apply) {
        console.log('\nDry run only — nothing written. Re-run with --apply to write these fixes.');
        db.close();
        return;
    }

    db.exec('BEGIN');
    try {
        for (const u of updates) {
            updateStmt.run(u.title, u.company, u.location, u.description, u.requirements, u.salary, u.employmentType, u.technologies, u.fingerprint, u.id);
        }
        db.exec('COMMIT');
        console.log(`\nApplied fixes to ${updates.length} rows.`);
    } catch (err) {
        db.exec('ROLLBACK');
        console.error('Failed, rolled back:', err);
        process.exit(1);
    }

    db.close();
}

if (require.main === module) main();
module.exports = { tryRepair, repairTechnologies };