#!/usr/bin/env node
/* NorthStar visual regression. Screenshots every component demo and its first two variants (folded parts
   included) on fixed-size tiles, plus the eight React dashboards, in dark and light, with headless Chrome.
   Compares against PNG baselines tile by tile and writes a diff image for each tile that changed.
   No npm dependencies: the browser decodes and compares the PNGs on a canvas.

     node tools/visual-check.mjs             compare with tests/visual/baseline (exit 1 on changes)
     node tools/visual-check.mjs --update    write new baselines (run after an intended visual change)
     node tools/visual-check.mjs --docs-only skip the dashboards

   Output: tests/visual/current (latest shots) and tests/visual/diff (red marks what changed), both
   gitignored. A tile fails when more than 0.3% of its pixels move by more than 40 in any channel.
   Fonts load from Google Fonts, so run it online; offline fallback fonts read as a full-page change. */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2), update = args.includes("--update"), docsOnly = args.includes("--docs-only");
const DIR = join(ROOT, "tests/visual"), BASE = join(DIR, "baseline"), CUR = join(DIR, "current"), DIFF = join(DIR, "diff");
const findChrome = () => {
  for (const p of [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].filter(Boolean)) if (existsSync(p)) return p;
  for (const n of ["google-chrome", "chromium", "chromium-browser"]) { try { return execFileSync("which", [n], { encoding: "utf8" }).trim(); } catch {} }
  return null;
};
const chrome = findChrome();
if (!chrome) { console.error("visual check skipped: no Chrome found (set CHROME=/path/to/chrome)."); process.exit(2); }
for (const d of [BASE, CUR, DIFF]) mkdirSync(d, { recursive: true });
for (const d of [CUR, DIFF]) for (const f of readdirSync(d)) rmSync(join(d, f));
const OUT = update ? BASE : CUR;

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/__visual.js") { res.setHeader("content-type", "text/javascript"); return res.end(readFileSync(join(ROOT, "tools/visual-page.js"))); }
  if (url === "/__compare.js") { res.setHeader("content-type", "text/javascript"); return res.end(readFileSync(join(ROOT, "tools/visual-compare.js"))); }
  if (url === "/__compare.html") { res.setHeader("content-type", "text/html"); return res.end(`<!doctype html><meta charset="utf-8"><body><script>window.__jobs=${JSON.stringify(jobs)}</script><script src="/__compare.js"></script></body>`); }
  if (url === "/__save" && req.method === "POST") {
    const name = new URL(req.url, "http://x").searchParams.get("name").replace(/[^\w.-]/g, "_");
    let body = ""; req.on("data", (d) => (body += d)); req.on("end", () => { writeFileSync(join(DIFF, name), Buffer.from(body.split(",")[1], "base64")); res.end("ok"); });
    return;
  }
  let p = join(ROOT, url === "/" ? "index.html" : url);
  if (p.endsWith("/")) p = join(p, "index.html");
  if (!p.startsWith(ROOT) || !existsSync(p) || !statSync(p).isFile()) { res.statusCode = 404; return res.end("not found"); }
  let body = readFileSync(p);
  if (p === join(ROOT, "index.html") && /[?&]visual=/.test(req.url)) body = Buffer.from(String(body).replace("</body>", `<script src="/__visual.js"></script></body>`));
  res.setHeader("content-type", TYPES[extname(p)] || "application/octet-stream"); res.end(body);
});
let jobs = [];
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port, URLB = `http://127.0.0.1:${port}/`;
const run = (argv) => new Promise((resolve) => {
  const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1", "--font-render-hinting=none", ...argv], { stdio: ["ignore", "pipe", "ignore"] });
  let out = ""; p.stdout.on("data", (d) => (out += d));
  const t = setTimeout(() => p.kill(), 180000);
  p.on("close", () => { clearTimeout(t); resolve(out); });
});
const meta = async (url) => { const dom = await run(["--window-size=1600,1200", "--virtual-time-budget=20000", "--dump-dom", url]); const m = dom.match(/<script type="application\/json" id="ns-visual-tiles">([\s\S]*?)<\/script>/); return m ? JSON.parse(m[1]) : null; };
const shot = (url, file, w, h, budget = 20000) => run([`--window-size=${w},${h}`, `--virtual-time-budget=${budget}`, `--screenshot=${file}`, url]);

const shots = [];
for (const theme of ["dark", "light"]) {
  const first = await meta(`${URLB}index.html?visual=0&theme=${theme}`);
  if (!first) { console.error("visual check: the gallery page did not render."); server.close(); process.exit(2); }
  for (let pg = 0; pg < first.pages; pg++) {
    const url = `${URLB}index.html?visual=${pg}&theme=${theme}`;
    const m = pg === 0 ? first : await meta(url);
    const name = `docs-${theme}-p${pg + 1}`;
    await shot(url, join(OUT, name + ".png"), m.width, m.height);
    writeFileSync(join(OUT, name + ".json"), JSON.stringify(m.tiles));
    shots.push(name);
  }
}
if (!docsOnly && existsSync(join(ROOT, "dashboards/live/index.html"))) {
  for (const theme of ["dark", "light"]) for (const v of ["finance", "commerce", "observe", "crm", "projects", "deployments", "support", "people"]) {
    const name = `app-${v}-${theme}`;
    await shot(`${URLB}dashboards/live/index.html?embed&theme=${theme}&still#${v}`, join(OUT, name + ".png"), 1440, 1100, 8000);
    writeFileSync(join(OUT, name + ".json"), JSON.stringify([{ name: `${v} (${theme})`, x: 0, y: 0, w: 1440, h: 1100 }]));
    shots.push(name);
  }
}
if (update) { server.close(); console.log(`Wrote ${shots.length} baseline screenshots to tests/visual/baseline.`); process.exit(0); }

jobs = shots.filter((n) => existsSync(join(BASE, n + ".png"))).map((n) => ({ name: n, base: `tests/visual/baseline/${n}.png`, cur: `tests/visual/current/${n}.png`, tiles: JSON.parse(readFileSync(join(CUR, n + ".json"), "utf8")) }));
const missing = shots.filter((n) => !existsSync(join(BASE, n + ".png")));
const dom = await run(["--window-size=800,600", "--virtual-time-budget=60000", "--dump-dom", URLB + "__compare.html"]);
server.close();
const m = dom.match(/<script type="application\/json" id="ns-visual-result">([\s\S]*?)<\/script>/);
if (!m) { console.error("visual check: the compare page produced no result."); process.exit(2); }
const res = JSON.parse(m[1]);
console.log(`NorthStar visual check: ${res.tiles} tiles in ${jobs.length} screenshots\n`);
if (missing.length) console.log(`No baseline yet for: ${missing.join(", ")}. Run with --update.\n`);
if (!res.changed.length) { console.log("No visual changes."); process.exit(missing.length ? 1 : 0); }
console.log(`${res.changed.length} tile(s) changed (diff images in tests/visual/diff):`);
res.changed.forEach((c) => console.log(`  ${c.name}  ${c.pct}% of pixels  [${c.shot}]`));
console.log("\nIf the change is intended, run: node tools/visual-check.mjs --update");
process.exit(1);
