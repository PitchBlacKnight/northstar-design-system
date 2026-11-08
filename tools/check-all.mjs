#!/usr/bin/env node
/* Runs NorthStar checks in parallel and prints one summary. The pre-commit hook passes only the checks
   the staged files touch; with no names it runs everything, which is the pre-publish gate.

     node tools/check-all.mjs                      every check, including the online Figma drift check
     node tools/check-all.mjs fit behavior a11y    a subset

   Exit 1 if any check fails. A check that cannot run (no Chrome, no network) is reported, not failed.
   Also warns, without failing, when the Figma token in .env has expired. */
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECKS = {
  tokens: ["Token lint", "tools/token-lint.mjs"],
  drift: ["Token drift vs Figma snapshot", "tools/token-drift.mjs"],
  fit: ["Fit probe", "tools/fit-probe.mjs"],
  behavior: ["Behavior check", "tools/behavior-check.mjs"],
  a11y: ["Accessibility check", "tools/a11y-check.mjs"],
  visual: ["Visual check", "tools/visual-check.mjs"],
  parity: ["React kit parity with docs", "tools/parity-check.mjs"],
  charts: ["Chart check (values vs drawing)", "tools/chart-check.mjs"],
  figma: ["Figma drift (online)", "tools/figma-sync-check.mjs", "--strict"],
};
const picked = process.argv.slice(2).filter((a) => CHECKS[a]);
const names = picked.length ? picked : Object.keys(CHECKS);

const tokenWarning = async () => {
  if (!existsSync(join(ROOT, ".env"))) return null;
  const t = (readFileSync(join(ROOT, ".env"), "utf8").match(/^FIGMA_TOKEN=(.+)$/m) || [])[1]?.trim();
  if (!t) return null;
  try {
    const r = await fetch("https://api.figma.com/v1/files/VZxmDNQiosTN6gqnvEQ65Z?depth=1", { headers: { "X-Figma-Token": t }, signal: AbortSignal.timeout(5000) });
    if (r.status === 403 || r.status === 401) return "The Figma token in .env has expired or is invalid. Replace it: sh tools/set-figma-token.sh (in a real terminal).";
  } catch { /* offline: say nothing */ }
  return null;
};

const run = (key) => new Promise((resolve) => {
  const [label, file, ...extra] = CHECKS[key];
  const t0 = Date.now();
  const p = spawn("node", [join(ROOT, file), ...extra], { cwd: ROOT });
  let out = ""; p.stdout.on("data", (d) => (out += d)); p.stderr.on("data", (d) => (out += d));
  p.on("close", (code) => resolve({ key, label, code, out, s: ((Date.now() - t0) / 1000).toFixed(0) }));
});

const t0 = Date.now();
const [warn, ...results] = await Promise.all([tokenWarning(), ...names.map(run)]);
let failed = 0;
for (const r of results) {
  const tag = r.code === 0 ? "pass" : r.code === 2 ? "skip" : "FAIL";
  console.log(`${tag.padEnd(4)}  ${r.label} (${r.s}s)`);
  if (r.code === 1) { failed++; console.log(r.out.trim().split("\n").map((l) => "      " + l).join("\n")); }
  if (r.code === 2) console.log("      " + r.out.trim().split("\n").slice(-1)[0]);
}
if (warn) console.log(`\nwarn  ${warn}`);
console.log(`\n${failed ? failed + " check(s) failed" : "All checks passed"} in ${((Date.now() - t0) / 1000).toFixed(0)}s.`);
process.exit(failed ? 1 : 0);
