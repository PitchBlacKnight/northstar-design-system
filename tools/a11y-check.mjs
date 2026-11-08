#!/usr/bin/env node
/* NorthStar accessibility check: WCAG 2.2 AA text contrast and accessible names for every component
   state and variant and all eight dashboards, in dark and light themes, in headless Chrome. No npm
   dependencies. Complements tools/fit-probe.mjs (targets, overflow) and tools/behavior-check.mjs (keyboard).

     node tools/a11y-check.mjs [--json] [--docs-only] [--list]

   Exit 1 means issues were found, 2 means the check could not run. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2), asJson = args.includes("--json"), docsOnly = args.includes("--docs-only"), list = args.includes("--list");
const findChrome = () => {
  for (const p of [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].filter(Boolean)) if (existsSync(p)) return p;
  for (const n of ["google-chrome", "chromium", "chromium-browser"]) { try { return execFileSync("which", [n], { encoding: "utf8" }).trim(); } catch {} }
  return null;
};
const chrome = findChrome();
const fail = (m, code = 2) => { if (asJson) console.log(JSON.stringify({ error: m })); else console.error(m); process.exit(code); };
if (!chrome) fail("a11y check skipped: no Chrome found (set CHROME=/path/to/chrome).");

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/__a11y.js") { const mode = /[?&]mode=app/.test(req.url || "") ? "app" : "docs"; res.setHeader("content-type", "text/javascript"); return res.end(`window.__a11yMode=${JSON.stringify(mode)};\n` + readFileSync(join(ROOT, "tools/a11y-check-page.js"))); }
  let p = join(ROOT, url === "/" ? "index.html" : url);
  if (p.endsWith("/")) p = join(p, "index.html");
  if (!p.startsWith(ROOT) || !existsSync(p) || !statSync(p).isFile()) { res.statusCode = 404; return res.end("not found"); }
  let body = readFileSync(p);
  if (p === join(ROOT, "index.html")) body = Buffer.from(String(body).replace("</body>", `<script src="/__a11y.js"></script></body>`));
  if (p === join(ROOT, "dashboards/live/index.html")) body = Buffer.from(String(body).replace("</body>", `<script src="/__a11y.js?mode=app"></script></body>`));
  res.setHeader("content-type", TYPES[extname(p)] || "application/octet-stream"); res.end(body);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const run = (path, size) => new Promise((resolve) => {
  const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", `--window-size=${size}`, "--virtual-time-budget=90000", "--dump-dom", `http://127.0.0.1:${port}/${path}`], { stdio: ["ignore", "pipe", "ignore"] });
  let out = ""; p.stdout.on("data", (d) => (out += d));
  const t = setTimeout(() => p.kill(), 180000);
  p.on("close", () => { clearTimeout(t); const m = out.match(/<script type="application\/json" id="ns-a11y-result">([\s\S]*?)<\/script>/); resolve(m ? JSON.parse(m[1]) : null); });
});
const runs = [await run("index.html", "1280,900")];
if (!docsOnly && existsSync(join(ROOT, "dashboards/live/index.html"))) runs.push(await run("dashboards/live/index.html#finance", "1440,900"));
server.close();
if (runs.some((r) => !r)) fail("a11y check produced no result (a page did not finish).");
const all = runs.flatMap((r) => r.issues);
if (asJson) { console.log(JSON.stringify({ issues: all })); process.exit(all.length ? 1 : 0); }
console.log(`NorthStar a11y check: contrast and names, dark and light, ${runs.length} run(s)\n`);
if (!all.length) { console.log("No contrast or naming issues."); process.exit(0); }
const byKind = {};
all.forEach((i) => (byKind[i.kind] = byKind[i.kind] || []).push(i));
for (const [k, l] of Object.entries(byKind)) {
  /* group identical details so one bad token reads as one line with where it shows up */
  const g = new Map(); l.forEach((i) => { const d = i.detail.replace(/"[^"]*" /, ""); g.set(d, [...(g.get(d) || []), i.where]); });
  console.log(`${k} (${l.length} hits, ${g.size} distinct)`);
  [...g].sort((a, b) => b[1].length - a[1].length).forEach(([d, w]) => console.log(`  ${d}\n      ${w.length}x: ${list ? w.join(", ") : w.slice(0, 4).join(", ") + (w.length > 4 ? " ..." : "")}`));
  console.log("");
}
process.exit(1);
