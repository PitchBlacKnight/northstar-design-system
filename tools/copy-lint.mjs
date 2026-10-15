#!/usr/bin/env node
/* NorthStar copy lint: fails on em dashes and on claims that must not appear in site copy.
   Scans index.html and js/*.js, or the files passed as arguments. No dependencies.

     node tools/copy-lint.mjs [--json] [file ...]

   Divider labels made of three or more em dashes (the component index separators) are allowed.
   Demo company names (Acme Corp, Beta LLC) are fictional sample data and are not checked. */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EM = "—";
const DIVIDER = new RegExp(EM + "{3,}", "g");
const BANNED = [
  ["Founder", "titles: say 'working independently as PBK Studio'"],
  ["marketers", "say 'Trusted Advisors' (350+)"],
  ["2.5 years", "use the dates, May 2021 to Aug 2024"],
  ["71%", "unapproved adoption number"],
  ["11 to 4", "unapproved claim, remove"],
  ["2.0 to 3.0", "unapproved claim, remove"],
];

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const named = args.filter((a) => !a.startsWith("--"));
const targets = named.length
  ? named.map((f) => resolve(f))
  : [join(ROOT, "index.html"), ...readdirSync(join(ROOT, "js")).filter((f) => f.endsWith(".js")).map((f) => join(ROOT, "js", f))];

const hits = [];
for (const path of targets) {
  const file = relative(ROOT, path);
  readFileSync(path, "utf8").split("\n").forEach((line, i) => {
    if (line.replace(DIVIDER, "").includes(EM)) hits.push({ file, line: i + 1, kind: "em-dash", detail: line.trim().slice(0, 120) });
    for (const [s, why] of BANNED) if (line.includes(s)) hits.push({ file, line: i + 1, kind: "banned", detail: `"${s}": ${why}` });
  });
}

if (asJson) {
  console.log(JSON.stringify({ scanned: targets.length, hits }));
} else if (!hits.length) {
  console.log(`Copy lint: ${targets.length} file(s) clean.`);
} else {
  console.log(`Copy lint: ${hits.length} problem(s)\n`);
  hits.forEach((h) => console.log(`  ${h.file}:${h.line}  ${h.kind}  ${h.detail}`));
}
process.exit(hits.length ? 1 : 0);
