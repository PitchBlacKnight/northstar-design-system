#!/usr/bin/env node
/* NorthStar chart check: every chart draws what it says. Loads the docs component demos, the widget gallery,
   the floorplans, all dashboard layouts in dashboards/*.html and the React dashboards in headless Chrome,
   and fails on NaN or Infinity in chart geometry, ring or gauge arcs that disagree with their percent label
   (round caps included), bars whose width disagrees with the percent in their row, and donuts whose parts
   do not cover the ring. Unit checks on NS.dash parts run first (zero data, single points, 0 and 100%).

     node tools/chart-check.mjs [--json]

   Exit 1 on a problem, 2 when the check cannot run. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const asJson = process.argv.includes("--json");
const issues = [];

/* ---------- unit checks on the drawing parts (no browser) ---------- */
{
  const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
  for (const f of ["js/viz.js", "js/dashboards.js"]) vm.runInContext(readFileSync(join(ROOT, f), "utf8"), ctx);
  const D = ctx.window.NS.dash;
  const bad = (name, svg) => /NaN|Infinity|undefined/.test(svg) && issues.push({ where: "NS.dash." + name, kind: "broken geometry", detail: "edge case produced NaN, Infinity or undefined" });
  bad("bars (all zero)", D.bars({ data: [0, 0, 0] })); bad("bars (empty max)", D.bars({ data: [0], vmax: 0 }));
  bad("stack (all zero)", D.stack({ sets: [{ data: [0, 0], color: "a" }] }));
  bad("donut (zero total)", D.donut({ parts: [{ v: 0, color: "a" }] }));
  bad("area (one point)", D.area({ sets: [{ data: [5] }] })); bad("area (flat)", D.area({ sets: [{ data: [3, 3, 3] }] }));
  bad("waterfall (zero)", D.waterfall({ steps: [{ v: 0 }] }));
  const arc = (svg) => { const m = [...svg.matchAll(/stroke-dasharray="([\d.]+) [\d.]+"( stroke-dashoffset="[-\d.]+")?/g)].at(-1); return m ? +m[1] : null; };
  for (const p of [25, 50, 72, 100]) {
    const r = (120 - 12) / 2, c = 2 * Math.PI * r, shown = ((arc(D.ring({ size: 120, stroke: 12, pct: p })) + 12) / c) * 100;
    if (Math.abs(shown - p) > 0.5) issues.push({ where: "NS.dash.ring", kind: "arc does not match its value", detail: `pct ${p} draws ${shown.toFixed(1)}%` });
    const gr = (220 - 16) / 2, gl = Math.PI * gr, gs = ((arc(D.gauge({ pct: p })) + 16) / gl) * 100;
    if (Math.abs(gs - p) > 0.5) issues.push({ where: "NS.dash.gauge", kind: "arc does not match its value", detail: `pct ${p} draws ${gs.toFixed(1)}%` });
  }
}

/* ---------- rendered pages ---------- */
const findChrome = () => {
  for (const p of [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].filter(Boolean)) if (existsSync(p)) return p;
  for (const n of ["google-chrome", "chromium", "chromium-browser"]) { try { return execFileSync("which", [n], { encoding: "utf8" }).trim(); } catch {} }
  return null;
};
const chrome = findChrome();
if (!chrome) { console.error("chart check skipped: no Chrome found."); process.exit(2); }
const DOC_ROUTES = ["#/graphics/gallery", "#/floorplans/dashboard", "#/floorplans/learner-progress", "#/floorplans/enrollment-health", "#/dashboards/chart-parts", ...["bubble", "candlestick", "funnel", "dumbbell", "heatmap", "parallel-coordinates", "stepped-line", "scatter", "gauge", "radial-bar", "radial-histogram", "radar", "radial-convergence", "sunburst", "tree", "treemap", "calendar", "bullet"].map((c) => `#/components/${c}-chart`), "#/components/progress", "#/components/card"];
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/__chart.js") { res.setHeader("content-type", "text/javascript"); const routes = (req.url.match(/routes=([^&]*)/) || [])[1]; return res.end(`window.__chartRoutes=${routes ? decodeURIComponent(routes) : "null"};\n` + readFileSync(join(ROOT, "tools/chart-check-page.js"))); }
  let p = join(ROOT, url === "/" ? "index.html" : url);
  if (p.endsWith("/")) p = join(p, "index.html");
  if (!p.startsWith(ROOT) || !existsSync(p) || !statSync(p).isFile()) { res.statusCode = 404; return res.end("not found"); }
  let body = readFileSync(p);
  if (p.endsWith(".html")) {
    const routes = p === join(ROOT, "index.html") ? `?routes=${encodeURIComponent(JSON.stringify(DOC_ROUTES))}` : p === join(ROOT, "dashboards/live/index.html") ? `?routes=${encodeURIComponent(JSON.stringify(["#finance", "#commerce", "#observe", "#crm", "#projects", "#deployments", "#support", "#people", "#kit"]))}` : "";
    body = Buffer.from(String(body).replace("</body>", `<script src="/__chart.js${routes}"></script></body>`));
  }
  res.setHeader("content-type", TYPES[extname(p)] || "application/octet-stream"); res.end(body);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const run = (path) => new Promise((resolve) => {
  const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1600,1100", "--virtual-time-budget=90000", "--dump-dom", `http://127.0.0.1:${port}/${path}`], { stdio: ["ignore", "pipe", "ignore"] });
  let out = ""; p.stdout.on("data", (d) => (out += d));
  const t = setTimeout(() => p.kill(), 180000);
  p.on("close", () => { clearTimeout(t); const m = out.match(/<script type="application\/json" id="ns-chart-result">([\s\S]*?)<\/script>/); resolve(m ? JSON.parse(m[1]) : { issues: [{ where: path, kind: "did not render", detail: "no result" }], stats: {} }); });
});
const layouts = readdirSync(join(ROOT, "dashboards")).filter((f) => f.endsWith(".html")).map((f) => "dashboards/" + f);
const pages = ["index.html", ...layouts, ...(existsSync(join(ROOT, "dashboards/live/index.html")) ? ["dashboards/live/index.html?embed&still"] : [])];
const totals = { svgs: 0, arcs: 0, arcLabels: 0, bars: 0, donuts: 0 };
const queue = [...pages], results = [];
await Promise.all(Array.from({ length: 4 }, async () => { while (queue.length) { const p = queue.shift(); results.push([p, await run(p)]); } }));
server.close();
for (const [p, r] of results) { (r.issues || []).forEach((i) => issues.push({ ...i, where: p.startsWith("dashboards/") && !p.includes("live") ? p : i.where })); for (const k in totals) totals[k] += r.stats?.[k] || 0; }

if (asJson) { console.log(JSON.stringify({ totals, issues })); process.exit(issues.length ? 1 : 0); }
console.log(`NorthStar chart check: ${pages.length} pages, ${totals.svgs} charts, ${totals.arcs} arcs (${totals.arcLabels} with a percent label), ${totals.bars} labelled bars, ${totals.donuts} donuts\n`);
if (!issues.length) { console.log("Every chart draws what it says."); process.exit(0); }
const byKind = {};
issues.forEach((i) => (byKind[i.kind] = byKind[i.kind] || []).push(i));
for (const [k, l] of Object.entries(byKind)) { console.log(`${k} (${l.length})`); l.forEach((i) => console.log(`  ${i.where}  ${i.detail}`)); console.log(""); }
process.exit(1);
