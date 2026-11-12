#!/usr/bin/env node
/* Agent check: validates HTML an agent (or a person) built with NorthStar.
     node tools/agent-check.mjs <file.html> [more.html]     or pipe markup on stdin
     --json   machine-readable result
   Fails on: ns- classes that do not exist in the stylesheets, raw hex or rgb colors, var(--ns-...) tokens that
   are not defined, primitive color tokens used directly in components, and icon buttons with no accessible name. */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const files = args.filter((a) => !a.startsWith("--"));
const css = ["css/tokens.css", "css/components.css", "css/widgets.css", "css/site.css", "css/dashboards.css"].map((f) => readFileSync(join(ROOT, f), "utf8")).join("\n");
const known = new Set(css.match(/\.(ns-[a-zA-Z0-9_-]+)/g).map((s) => s.slice(1)));
const tokens = new Set(css.match(/--ns-[a-zA-Z0-9_-]+(?=\s*:)/g));
const PRIMITIVE = /^--ns-(gray|navy|blue|persian|purple|teal|green|yellow|red|magenta|violet|cyan|sky|orange|periwinkle)-\d/;

const inputs = files.length ? files.map((f) => [f, readFileSync(f, "utf8")]) : [["stdin", readFileSync(0, "utf8")]];
let total = 0;
const report = [];
for (const [name, html] of inputs) {
  const issues = [];
  const classes = new Set();
  html.replace(/class="([^"]*)"/g, (_, c) => { c.split(/\s+/).forEach((k) => k.startsWith("ns-") && classes.add(k)); return ""; });
  [...classes].filter((k) => !known.has(k)).forEach((k) => issues.push({ kind: "unknown-class", detail: k }));
  (html.match(/#[0-9a-fA-F]{3,8}\b(?![^<]*<\/code>)|rgba?\(|hsla?\(/g) || []).forEach((m) => issues.push({ kind: "raw-color", detail: m }));
  const local = new Set(html.match(/--ns-[a-zA-Z0-9_-]+(?=\s*:)/g) || []); /* set inline on the element, like --ns-tree-level */
  const used = new Set((html.match(/--ns-[a-zA-Z0-9_-]+/g) || []).filter((t) => !local.has(t)));
  [...used].filter((t) => !tokens.has(t)).forEach((t) => issues.push({ kind: "unknown-token", detail: t }));
  [...used].filter((t) => tokens.has(t) && PRIMITIVE.test(t)).forEach((t) => issues.push({ kind: "primitive-token", detail: `${t} (use a semantic role)` }));
  (html.match(/<button[^>]*class="[^"]*ns-btn--icon[^"]*"[^>]*>/g) || []).forEach((b) => { if (!/aria-label=|aria-labelledby=/.test(b)) issues.push({ kind: "unnamed-icon-button", detail: b.slice(0, 80) }); });
  (html.match(/<img\b(?![^>]*\balt=)[^>]*>/g) || []).forEach((i) => issues.push({ kind: "image-without-alt", detail: i.slice(0, 80) }));
  /* The one allowed script is the NorthStar behavior file, loaded by src with no inline code. */
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const src = (m[1].match(/\bsrc=["']([^"']+)["']/) || [])[1] || "";
    if (!/(^|\/)js\/ns-behavior\.js(\?.*)?$/.test(src) || m[2].trim()) issues.push({ kind: "script-tag", detail: "only <script src=\".../js/ns-behavior.js\" defer></script> is allowed; components are markup and CSS" });
  }
  if (/font-family\s*:/.test(html) && !/font-family\s*:\s*var\(--ns-font/.test(html)) issues.push({ kind: "raw-font", detail: "font-family without --ns-font token" });
  total += issues.length;
  report.push({ file: name, classes: classes.size, tokens: used.size, issues });
}
if (asJson) { console.log(JSON.stringify({ ok: total === 0, files: report })); process.exit(total ? 1 : 0); }
for (const r of report) {
  console.log(`${r.file}: ${r.classes} ns- classes, ${r.tokens} tokens, ${r.issues.length ? r.issues.length + " issue(s)" : "clean"}`);
  r.issues.forEach((i) => console.log(`  ${i.kind}  ${i.detail}`));
}
process.exit(total ? 1 : 0);
