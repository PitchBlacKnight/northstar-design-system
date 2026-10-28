#!/usr/bin/env node
/* NorthStar token lint: raw values in CSS that should come from css/tokens.css. No dependencies.

     node tools/token-lint.mjs            report, fail if any count rises above the baseline
     node tools/token-lint.mjs --fix      swap spacing px that sit on the space scale for var(--ns-space-N)
     node tools/token-lint.mjs --baseline write the current counts to tools/token-lint-baseline.json
     node tools/token-lint.mjs --list     print every hit

   Checks css/*.css except tokens.css:
     hex        a color literal (#fff, #2858ff)
     space      padding, margin or gap in px (1px hairlines and 0 allowed)
     font-size  a font-size in px
   The baseline lets old debt pass while new raw values fail. Lower it after each cleanup. */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSS = join(ROOT, "css");
const BASE = join(ROOT, "tools", "token-lint-baseline.json");
const args = process.argv.slice(2);
const has = (f) => args.includes(f);

const SCALE = {};
for (const m of readFileSync(join(CSS, "tokens.css"), "utf8").matchAll(/--ns-space-(\d+):\s*(\d+)px/g)) SCALE[m[2]] = m[1];

const SPACE_PROP = /(?<![\w-])((?:padding|margin)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|gap|row-gap|column-gap)\s*:\s*([^;}]+)/g;
const swap = (val) => val.replace(/(^|[\s(,])(\d+)px\b/g, (all, pre, n) => (SCALE[n] && n !== "0" ? `${pre}var(--ns-space-${SCALE[n]})` : all));

const files = readdirSync(CSS).filter((f) => f.endsWith(".css") && f !== "tokens.css");
const counts = {}, hits = [];
let fixed = 0;
for (const f of files) {
  const path = join(CSS, f);
  const lines = readFileSync(path, "utf8").split("\n");
  const c = (counts[f] = { hex: 0, space: 0, "font-size": 0 });
  lines.forEach((line, i) => {
    if (has("--fix")) lines[i] = line.replace(SPACE_PROP, (all, prop, val) => { const v = swap(val); if (v !== val) fixed++; return all.replace(val, v); });
    const now = lines[i].replace(/\/\*.*?\*\//g, "");
    const add = (kind) => { c[kind]++; hits.push(`${f}:${i + 1}  ${kind}  ${now.trim().slice(0, 100)}`); };
    for (const m of now.matchAll(/:[^;{}]*#[0-9a-fA-F]{3,8}\b/g)) add("hex");
    for (const m of now.matchAll(SPACE_PROP)) if (/(^|[\s(,])-?([2-9]|\d{2,})px\b/.test(m[2])) add("space");
    for (const m of now.matchAll(/font-size\s*:\s*[\d.]+px/g)) add("font-size");
  });
  if (has("--fix")) writeFileSync(path, lines.join("\n"));
}

if (has("--list")) console.log(hits.join("\n"));
const total = (o) => Object.values(o).reduce((a, b) => a + b, 0);
for (const f of files) console.log(`${f.padEnd(16)} hex ${String(counts[f].hex).padStart(4)}  space ${String(counts[f].space).padStart(4)}  font-size ${String(counts[f]["font-size"]).padStart(4)}`);
if (has("--fix")) console.log(`fixed ${fixed} spacing declarations`);
if (has("--baseline")) { writeFileSync(BASE, JSON.stringify(counts, null, 2) + "\n"); console.log("baseline written"); process.exit(0); }

if (!existsSync(BASE)) { console.log("no baseline yet: run with --baseline"); process.exit(0); }
const base = JSON.parse(readFileSync(BASE, "utf8"));
const worse = [];
for (const f of files) for (const k in counts[f]) if (counts[f][k] > (base[f]?.[k] ?? 0)) worse.push(`${f} ${k}: ${base[f]?.[k] ?? 0} -> ${counts[f][k]}`);
if (worse.length) { console.error("token-lint: new raw values\n  " + worse.join("\n  ")); process.exit(1); }
const was = total(Object.fromEntries(files.map((f) => [f, total(base[f] || {})]))), is = total(Object.fromEntries(files.map((f) => [f, total(counts[f])])));
console.log(`token-lint: ok (${is} raw values, baseline ${was})`);
