#!/usr/bin/env node
/* NorthStar behavior check: drives the live component behaviors (combobox, command palette, dropdown,
   toasts, modal, tabs, table, folded routes) and the eight React dashboards (sheet, dialog, toast,
   filter, period, palette, theme and density) in headless Chrome. No npm dependencies.

     node tools/behavior-check.mjs [--json] [--docs-only]

   Exit 1 means a behavior broke, 2 means the check could not run. The pre-commit hook runs it when
   js/ui.js, js/components.js, css/components.css or dashboards/live change. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2), asJson = args.includes("--json"), docsOnly = args.includes("--docs-only");
const findChrome = () => {
  for (const p of [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].filter(Boolean)) if (existsSync(p)) return p;
  for (const n of ["google-chrome", "chromium", "chromium-browser"]) { try { return execFileSync("which", [n], { encoding: "utf8" }).trim(); } catch {} }
  return null;
};
const chrome = findChrome();
const fail = (m, code = 2) => { if (asJson) console.log(JSON.stringify({ error: m })); else console.error(m); process.exit(code); };
if (!chrome) fail("behavior check skipped: no Chrome found (set CHROME=/path/to/chrome).");

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/__behavior.js") { const mode = /[?&]mode=app/.test(req.url || "") ? "app" : "docs"; res.setHeader("content-type", "text/javascript"); return res.end(`window.__behaviorMode=${JSON.stringify(mode)};\n` + readFileSync(join(ROOT, "tools/behavior-check-page.js"))); }
  let p = join(ROOT, url === "/" ? "index.html" : url);
  if (p.endsWith("/")) p = join(p, "index.html");
  if (!p.startsWith(ROOT) || !existsSync(p) || !statSync(p).isFile()) { res.statusCode = 404; return res.end("not found"); }
  let body = readFileSync(p);
  if (p === join(ROOT, "index.html")) body = Buffer.from(String(body).replace("</body>", `<script src="/__behavior.js"></script></body>`));
  if (p === join(ROOT, "dashboards/live/index.html")) body = Buffer.from(String(body).replace("</body>", `<script src="/__behavior.js?mode=app"></script></body>`));
  res.setHeader("content-type", TYPES[extname(p)] || "application/octet-stream"); res.end(body);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const run = (path, size) => new Promise((resolve) => {
  const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", `--window-size=${size}`, "--virtual-time-budget=90000", "--dump-dom", `http://127.0.0.1:${port}/${path}`], { stdio: ["ignore", "pipe", "ignore"] });
  let out = ""; p.stdout.on("data", (d) => (out += d));
  const t = setTimeout(() => p.kill(), 180000);
  p.on("close", () => { clearTimeout(t); const m = out.match(/<script type="application\/json" id="ns-behavior-result">([\s\S]*?)<\/script>/); resolve(m ? JSON.parse(m[1]) : null); });
});
const runs = [await run("index.html", "1280,900")];
if (!docsOnly && existsSync(join(ROOT, "dashboards/live/index.html"))) runs.push(await run("dashboards/live/index.html#finance", "1440,900"), await run("dashboards/live/index.html#finance", "390,844"));
server.close();
if (runs.some((r) => !r)) fail("behavior check produced no result (a page did not finish).");
const labels = ["docs", "app 1440", "app 390"];
const all = runs.flatMap((r, i) => r.results.map((x) => ({ ...x, run: labels[i] })));
const failed = all.filter((x) => !x.ok);
if (asJson) { console.log(JSON.stringify({ checks: all.length, failed })); process.exit(failed.length ? 1 : 0); }
console.log(`NorthStar behavior check: ${all.length} checks across ${runs.length} run(s)\n`);
if (!failed.length) { console.log("Every behavior works."); process.exit(0); }
failed.forEach((x) => console.log(`  fail  [${x.run}] ${x.name}: ${x.detail}`));
process.exit(1);
