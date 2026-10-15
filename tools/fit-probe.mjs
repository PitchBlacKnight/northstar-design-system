#!/usr/bin/env node
/* NorthStar fit probe: renders every component state at dashboard tile widths in headless Chrome and
   reports overflow, small targets, unnamed controls and tiny chart labels. No npm dependencies.

     node tools/fit-probe.mjs [--json] [--widths 320,240,192]

   Chrome is found from $CHROME, the macOS app, or google-chrome / chromium on PATH. Exit code 1 means
   issues were found, 2 means the probe could not run (no Chrome, no result). tools/figma-sync-check.mjs
   --fit runs this and folds the result into its report. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const widths = args.includes("--widths") ? args[args.indexOf("--widths") + 1].split(",").map(Number) : [320, 240, 192];

const findChrome = () => {
  const c = [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].filter(Boolean);
  for (const p of c) if (existsSync(p)) return p;
  for (const n of ["google-chrome", "chromium", "chromium-browser"]) { try { return execFileSync("which", [n], { encoding: "utf8" }).trim(); } catch {} }
  return null;
};
const chrome = findChrome();
const fail = (m, code = 2) => { if (asJson) console.log(JSON.stringify({ error: m })); else console.error(m); process.exit(code); };
if (!chrome) fail("fit probe skipped: no Chrome found (set CHROME=/path/to/chrome).");

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/__fit-probe.js") { const mode = /[?&]mode=page/.test(req.url || "") ? "page" : "components"; res.setHeader("content-type", "text/javascript"); return res.end(`window.__fitWidths=${JSON.stringify(widths)};window.__fitMode=${JSON.stringify(mode)};\n` + readFileSync(join(ROOT, "tools/fit-probe-page.js"))); }
  const p = join(ROOT, url === "/" ? "index.html" : url);
  if (!p.startsWith(ROOT) || !existsSync(p) || !statSync(p).isFile()) { res.statusCode = 404; return res.end("not found"); }
  let body = readFileSync(p);
  if (p.endsWith("index.html")) { const pm = /[?&]fit=page/.test(req.url || "") ? "?mode=page" : ""; body = Buffer.from(String(body).replace("</body>", `<script src="/__fit-probe.js${pm}"></script></body>`)); }
  res.setHeader("content-type", TYPES[extname(p)] || "application/octet-stream"); res.end(body);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;

const runChrome = (size, query) => new Promise((resolve) => {
  const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", `--window-size=${size},900`, "--virtual-time-budget=60000", "--dump-dom", `http://127.0.0.1:${port}/index.html${query}`], { stdio: ["ignore", "pipe", "ignore"] });
  let out = ""; p.stdout.on("data", (d) => (out += d));
  const t = setTimeout(() => p.kill(), 180000);
  p.on("close", () => { clearTimeout(t); resolve(out); });
});
const grab = (dom) => { const m = dom.match(/<script type="application\/json" id="ns-fit-result">([\s\S]*?)<\/script>/); return m ? JSON.parse(m[1]) : null; };
const dom = await runChrome(1200, "");
/* Page mode: the page itself must not scroll sideways at common window widths. */
const PAGE_WIDTHS = [1920, 1440, 1280, 1024, 768, 390];
const pageRows = [];
for (const w of PAGE_WIDTHS) {
  const r = grab(await runChrome(w, "?fit=page"));
  if (r) r.rows.forEach((x) => { if (x.over > 1) pageRows.push({ id: x.route, label: "page", width: w, kind: "page-overflow", detail: `+${x.over}px sideways scroll` }); });
}
server.close();

const result = grab(dom);
if (!result) fail("fit probe produced no result (the page did not finish rendering).");
result.issues.push(...pageRows);
result.pageWidths = PAGE_WIDTHS;
if (asJson) { console.log(JSON.stringify(result)); process.exit(result.issues.length ? 1 : 0); }

console.log(`NorthStar fit probe: ${result.components} components, ${result.checked} renders at ${result.widths.join(", ")}px; page overflow at ${result.pageWidths.join(", ")}px\n`);
if (!result.issues.length) { console.log("Everything fits."); process.exit(0); }
const byKind = {};
result.issues.forEach((i) => (byKind[i.kind] = byKind[i.kind] || []).push(i));
for (const [k, list] of Object.entries(byKind)) {
  console.log(`${k} (${list.length})`);
  list.forEach((i) => console.log(`  ${i.id} [${i.label}] @${i.width}px  ${i.detail}`));
  console.log("");
}
process.exit(1);
