#!/usr/bin/env node
/* NorthStar token drift: compares the Figma variables snapshot (tokens/figma-variables.json) with
   css/tokens.css, mode by mode. No npm dependencies, no network.

     node tools/token-drift.mjs            report; exit 1 on any value that differs
     node tools/token-drift.mjs --all      also list Figma variables with no CSS token

   Figma's REST variables API needs an Enterprise plan, so the snapshot is refreshed through the Figma
   MCP during a sync: run tools/figma-variables-dump.js in use_figma and save its output over
   tokens/figma-variables.json. Known, intended differences go in tokens/drift-allow.json with a reason. */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const snap = JSON.parse(readFileSync(join(ROOT, "tokens/figma-variables.json"), "utf8"));
const allowPath = join(ROOT, "tokens/drift-allow.json");
const allow = existsSync(allowPath) ? JSON.parse(readFileSync(allowPath, "utf8")) : {};
const css = readFileSync(join(ROOT, "css/tokens.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
/* The reduced-motion block is read separately below, so it must not merge into :root */
const cssBase = css.replace(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{[^}]*\}\s*\}/, "");

/* Parse top-level blocks into selector -> { --name: value }. Nested @media blocks keep their inner selector. */
const blocks = {};
const re = /([^{}]+)\{([^{}]*)\}/g;
let m;
while ((m = re.exec(cssBase))) {
  const sel = m[1].trim().replace(/^@media[^{]*\{?\s*/, "").replace(/\s+/g, " ");
  const decls = blocks[sel] || (blocks[sel] = {});
  for (const d of m[2].split(";")) { const i = d.indexOf(":"); if (i > 0) { const k = d.slice(0, i).trim(); if (k.startsWith("--")) decls[k] = d.slice(i + 1).trim(); } }
}
const reduced = (() => { const mm = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{([^}]*)\}/); const o = {}; if (mm) for (const d of mm[1].split(";")) { const i = d.indexOf(":"); if (i > 0) o[d.slice(0, i).trim()] = d.slice(i + 1).trim(); } return o; })();
const root = blocks[":root"] || {};
const SCOPES = {
  Dark: [root], Default: [root], Full: [root],
  Light: [blocks[':root[data-theme="light"]'] || {}, root],
  "High Contrast": [blocks[':root[data-theme="contrast"]'] || {}, root],
  Compact: [blocks[':root[data-density="compact"], [data-density="compact"]'] || {}, root],
  None: [reduced, root], /* prefers-reduced-motion sets durations to 0, which is the Figma None mode; Figma Reduced has no CSS twin */
};
const lookup = (name, scope, depth = 0) => {
  for (const b of scope) if (b[name] !== undefined) {
    const v = b[name], ref = v.match(/^var\((--[\w-]+)\)$/);
    return ref && depth < 10 ? lookup(ref[1], scope, depth + 1) : v;
  }
  return undefined;
};

const norm = (v) => {
  if (v === undefined || v === null) return v;
  v = String(v).trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(v)) v = "#" + [...v.slice(1)].map((c) => c + c).join("");
  if (/^#[0-9a-f]{8}$/.test(v) && v.endsWith("ff")) v = v.slice(0, 7);
  const px = v.match(/^(-?[\d.]+)(px|ms)?$/); if (px) return String(+px[1]);
  return v;
};
const TYPE = { "body-1": "body1", "body-2": "body2", "body-3": "body3" };
const cssName = (col, name) => {
  if (col === "Primitives / Colors") return name === "gray/black" ? "--ns-black" : name === "white" ? "--ns-white" : "--ns-" + name.replace("/", "-");
  if (col === "Primitives / Spacing") return "--ns-space-" + name.split("/")[1];
  if (col === "Primitives / Radius") return "--ns-radius-" + name.split("/")[1];
  if (col === "Primitives / Motion") return "--ns-duration-" + name.split("/")[1];
  if (col === "Primitives / Typography") { const [k, t] = name.split("/"); const key = TYPE[t] || t; return k === "font-size" ? `--ns-type-${key}-size` : k === "line-height" ? `--ns-type-${key}-line` : null; }
  return "--ns-" + name.replace("/", "-");
};

const diffs = [], missing = [], unresolved = [];
let compared = 0;
for (const [col, { vars }] of Object.entries(snap.collections)) {
  for (const [name, modes] of Object.entries(vars)) {
    const cn = cssName(col, name); if (!cn) continue;
    for (const [mode, fv] of Object.entries(modes)) {
      const scope = SCOPES[mode]; if (!scope) continue;
      if (mode !== "Dark" && mode !== "Default" && mode !== "Full" && scope[0][cn] === undefined && lookup(cn, [root]) === undefined) continue;
      const cv = lookup(cn, scope);
      if (cv === undefined) { if (mode === "Dark" || mode === "Default" || mode === "Full") missing.push(`${name} -> ${cn}`); continue; }
      const a = norm(fv), b = norm(cv);
      if (/var\(|color-mix|calc|gradient/.test(b)) { unresolved.push(`${cn} (${mode}): ${cv}`); continue; }
      compared++;
      if (a !== b) {
        const key = `${cn}|${mode}`;
        if (allow[key]) continue;
        diffs.push(`${cn} [${mode}]  Figma ${name} = ${fv}  |  CSS = ${cv}`);
      }
    }
  }
}
console.log(`NorthStar token drift: ${compared} values compared against the Figma snapshot of ${snap.captured || "unknown date"}\n`);
if (process.argv.includes("--all") && missing.length) { console.log(`Figma variables with no CSS token (${missing.length}):`); missing.forEach((x) => console.log("  " + x)); console.log(""); }
if (unresolved.length) console.log(`Skipped ${unresolved.length} CSS values computed with var(), color-mix or calc.\n`);
if (!diffs.length) { console.log("Tokens match Figma."); process.exit(0); }
console.log(`${diffs.length} difference(s):`);
diffs.forEach((d) => console.log("  " + d));
console.log("\nFix the side that is wrong, or record an intended difference in tokens/drift-allow.json as \"--ns-name|Mode\": \"reason\".");
process.exit(1);
