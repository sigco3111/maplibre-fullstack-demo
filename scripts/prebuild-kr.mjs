#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const TARGETS = [
  { id: 'kr-admin', url: 'https://www.data.go.kr/dataset/15149541/fileData.do', file: 'public/kr/admin.json' },
  { id: 'kr-district', url: 'https://www.data.go.kr/dataset/15149542/fileData.do', file: 'public/kr/district.json' },
  { id: 'kr-poi', url: 'https://www.data.go.kr/dataset/15021190/fileData.do', file: 'public/kr/poi.json' },
];

const GEO_NAMES = { id: 'geonames', url: 'https://raw.githubusercontent.com/datasets/geonames-all-cities-with-a-population-1000/master/data/all-cities-with-a-population-1000.csv', file: 'public/geonames/cities.json' };

async function tryDownload(target) {
  const fileUrl = target.url;
  const outFile = target.file;
  try {
    const r = await fetch(fileUrl, { mode: 'cors' });
    if (!r.ok) {
      console.warn(`[prebuild] ${target.id}: HTTP ${r.status}; skipping`);
      return false;
    }
    const buf = Buffer.from(await r.arrayBuffer());
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, buf);
    console.log(`[prebuild] ${target.id}: wrote ${outFile} (${buf.length} bytes)`);
    return true;
  } catch (e) {
    console.warn(`[prebuild] ${target.id}: CORS blocked (${e.message}); skipping — runbook: see HANDOFF §4 C-2`);
    return false;
  }
}

const all = [...TARGETS, GEO_NAMES];
let ok = 0;
for (const t of all) if (await tryDownload(t)) ok++;
console.log(`[prebuild] done: ${ok}/${all.length} succeeded`);
