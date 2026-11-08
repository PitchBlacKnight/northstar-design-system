#!/usr/bin/env node
/* NorthStar parity check: the React kit must look like the docs. Renders the docs component gallery and the
   kit gallery (dashboards/live/#kit) in headless Chrome, reads the computed style of the same NorthStar
   element in both (button, input, select, checkbox, switch, tab, segmented control, badge, table header),
   and fails when height, type, weight, radius, fill, text color, border or padding differ.

     node tools/parity-check.mjs [--json]

   Exit 1 on a difference, 2 when the check cannot run (no Chrome). */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const asJson = process.argv.includes("--json");
/* [name, docs selector, kit selector]: the first match in each page is compared */
const PAIRS = [
  ["button sm (size and type)", ".ns-btn.ns-btn--sm:not(.ns-btn--icon)", "main .ns-btn.ns-btn--sm:not(.ns-btn--icon)", ["background-color", "color", "border-top-color"]],
  ["button secondary (color)", ".ns-btn.ns-btn--secondary:not(.ns-btn--icon)", "main .ns-btn.ns-btn--secondary:not(.ns-btn--icon)", ["height", "padding-left", "padding-top", "font-size", "line-height"]],
  ["text input", ".ns-field .ns-input:not(.ns-input--sm):not(.ns-input--lg):not(.ns-input--md)", "main .ns-field .ns-input"],
  ["select", ".ns-field > select.ns-select", "main select.ns-select"],
  ["checkbox box", ".ns-check input[type=checkbox]:not(:checked):not(:indeterminate):not(:disabled)", "main .ns-check input[type=checkbox]:not(:checked):not(:indeterminate)"],
  ["switch track (on)", ".ns-toggle:not(.ns-toggle--sm):not(.ns-toggle--xs) input:checked:not(:disabled)", "main .ns-toggle input:checked"],
  ["tab (selected)", ".ns-tabs:not(.ns-tabs--pill) .ns-tab[aria-selected=true]", "main .ns-tabs .ns-tab[aria-selected=true]"],
  ["segmented (selected)", ".ns-segmented button[aria-checked=true]", "main .ns-segmented button[aria-checked=true]"],
  ["badge success", ".ns-badge.ns-badge--positive:not(.ns-badge--sm):not(.ns-badge--lg):not(.ns-badge--outline)", "main .ns-badge.ns-badge--success"],
  ["table header cell", ".ns-table th", "main .ns-table th"],
  ["field label", ".ns-field > .ns-label", "main .ns-field > .ns-label"],
  ["textarea", ".ns-field > .ns-textarea", "main .ns-field > .ns-textarea"],
  ["radio (selected)", ".ns-check--radio input[type=radio]:checked:not(:disabled)", "main .ns-check--radio input[type=radio]:checked"],
  ["page (current)", ".ns-pagination .ns-page[aria-current=page]", "main .ns-pagination .ns-page[aria-current=page]"],
  ["breadcrumb link", ".ns-breadcrumb a", "main .ns-breadcrumb a"],
  ["accordion summary", ".ns-accordion summary", "main .ns-accordion summary"],
];
const PROPS = ["height", "font-size", "font-weight", "font-family", "line-height", "border-top-left-radius", "background-color", "color", "border-top-color", "border-top-width", "padding-left", "padding-top", "letter-spacing", "text-transform"];

const findChrome = () => {
  for (const p of [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].filter(Boolean)) if (existsSync(p)) return p;
  for (const n of ["google-chrome", "chromium", "chromium-browser"]) { try { return execFileSync("which", [n], { encoding: "utf8" }).trim(); } catch {} }
  return null;
};
const chrome = findChrome();
if (!chrome) { console.error("parity check skipped: no Chrome found."); process.exit(2); }

const probe = (mode) => `(async()=>{await new Promise(r=>document.readyState==="complete"?r():addEventListener("load",r));await new Promise(r=>setTimeout(r,2500));
const P=${JSON.stringify(PAIRS)},K=${JSON.stringify(PROPS)},out={};
for(const [n,d,k] of P){const el=document.querySelector(${mode === "docs" ? "d" : "k"});if(!el){out[n]=null;continue}const cs=getComputedStyle(el);const o={};for(const p of K)o[p]=p==="height"?Math.round(el.getBoundingClientRect().height)+"px":cs.getPropertyValue(p);out[n]=o}
const s=document.createElement("script");s.type="application/json";s.id="ns-parity";s.textContent=JSON.stringify(out);document.body.appendChild(s)})();`;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/__visual.js") { res.setHeader("content-type", "text/javascript"); return res.end(readFileSync(join(ROOT, "tools/visual-page.js"))); }
  if (url.startsWith("/__parity-")) { res.setHeader("content-type", "text/javascript"); return res.end(probe(url.includes("docs") ? "docs" : "kit")); }
  let p = join(ROOT, url === "/" ? "index.html" : url);
  if (p.endsWith("/")) p = join(p, "index.html");
  if (!p.startsWith(ROOT) || !existsSync(p) || !statSync(p).isFile()) { res.statusCode = 404; return res.end("not found"); }
  let body = readFileSync(p);
  if (p === join(ROOT, "index.html")) body = Buffer.from(String(body).replace("</body>", `<script src="/__visual.js"></script><script src="/__parity-docs.js"></script></body>`));
  if (p === join(ROOT, "dashboards/live/index.html")) body = Buffer.from(String(body).replace("</body>", `<script src="/__parity-kit.js"></script></body>`));
  res.setHeader("content-type", TYPES[extname(p)] || "application/octet-stream"); res.end(body);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const run = (path) => new Promise((resolve) => {
  const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1600,1200", "--virtual-time-budget=20000", "--dump-dom", `http://127.0.0.1:${port}/${path}`], { stdio: ["ignore", "pipe", "ignore"] });
  let out = ""; p.stdout.on("data", (d) => (out += d));
  p.on("close", () => { const m = out.match(/<script type="application\/json" id="ns-parity">([\s\S]*?)<\/script>/); resolve(m ? JSON.parse(m[1]) : null); });
});
/* the docs gallery page (?visual=N) renders every component demo; scan pages until each selector is found */
const docs = {};
for (let pg = 0; pg < 6 && PAIRS.some(([n]) => !docs[n]); pg++) {
  const r = await run(`index.html?visual=${pg}&theme=dark`);
  if (r) for (const [n, v] of Object.entries(r)) if (v && !docs[n]) docs[n] = v;
}
const kit = await run("dashboards/live/index.html?embed&theme=dark&still#kit");
server.close();
if (!kit) { console.error("parity check: the kit gallery did not render."); process.exit(2); }

const diffs = [], missing = [];
for (const [n] of PAIRS) {
  if (!docs[n] || !kit[n]) { missing.push(`${n}: ${!docs[n] ? "not found in docs" : "not found in kit"}`); continue; }
  const skip = new Set((PAIRS.find((x) => x[0] === n) || [])[3] || []);
  const noText = /checkbox|switch|radio/.test(n), noBorder = docs[n]["border-top-width"] === "0px" && kit[n]["border-top-width"] === "0px";
  for (const p of PROPS) {
    if (noText && /^(font|line-height|letter-spacing|text-transform|color$)/.test(p)) continue; /* text styles on a control that shows no text */
    if (noBorder && p === "border-top-color") continue; /* invisible: no border drawn */
    if (skip.has(p)) continue; /* this pair compares size only, or color only */
    if (docs[n][p] !== kit[n][p]) diffs.push(`${n}  ${p}: docs ${docs[n][p]}  |  kit ${kit[n][p]}`);
  }
}
if (asJson) { console.log(JSON.stringify({ diffs, missing })); process.exit(diffs.length || missing.length ? 1 : 0); }
console.log(`NorthStar parity check: ${PAIRS.length} elements x ${PROPS.length} properties, docs vs React kit\n`);
missing.forEach((m) => console.log("  missing  " + m));
diffs.forEach((d) => console.log("  differs  " + d));
if (!diffs.length && !missing.length) console.log("The React kit matches the docs.");
process.exit(diffs.length || missing.length ? 1 : 0);
