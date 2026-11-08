#!/usr/bin/env node
/* Agent export: builds the machine-readable surface of the system from the live catalog.
     node tools/agent-export.mjs            writes llms.txt, agent/northstar.md, agent/components.json, agent/tokens.json
     node tools/agent-export.mjs --check    exits 1 if the committed files are out of date
   Runs the docs site in headless Chrome (same launcher as fit-probe) with tools/agent-export-page.js injected,
   so the export always matches js/components.js, css/tokens.css and the page registry. No npm install. */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const fail = (m) => { console.error(m); process.exit(1); };
const findChrome = () => {
  if (process.env.CHROME && existsSync(process.env.CHROME)) return process.env.CHROME;
  const mac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(mac)) return mac;
  for (const n of ["google-chrome", "chromium", "chromium-browser"]) { try { return execFileSync("which", [n], { encoding: "utf8" }).trim(); } catch {} }
  return null;
};
const chrome = findChrome();
if (!chrome) fail("agent export skipped: no Chrome found (set CHROME=/path/to/chrome).");

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/__agent-export.js") { res.setHeader("content-type", "text/javascript"); return res.end(readFileSync(join(ROOT, "tools/agent-export-page.js"))); }
  const p = join(ROOT, url === "/" ? "index.html" : url);
  if (!p.startsWith(ROOT) || !existsSync(p) || !statSync(p).isFile()) { res.statusCode = 404; return res.end("not found"); }
  let body = readFileSync(p);
  if (p.endsWith("index.html")) body = Buffer.from(String(body).replace("</body>", '<script src="/__agent-export.js"></script></body>'));
  res.setHeader("content-type", TYPES[extname(p)] || "application/octet-stream"); res.end(body);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const dom = await new Promise((resolve) => {
  const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1400,900", "--virtual-time-budget=30000", "--dump-dom", `http://127.0.0.1:${port}/index.html`], { stdio: ["ignore", "pipe", "ignore"] });
  let out = ""; p.stdout.on("data", (d) => (out += d));
  const t = setTimeout(() => p.kill(), 120000);
  p.on("close", () => { clearTimeout(t); resolve(out); });
});
server.close();
const m = dom.match(/<script type="application\/json" id="ns-agent-export">([\s\S]*?)<\/script>/);
if (!m) fail("agent export produced no result (the page did not finish rendering).");
const data = JSON.parse(m[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));

/* ---------- Markdown ---------- */
const SITE = "https://mikelrosenthal.com/northstar/";
const RULES = [
  ["Build", [
    ["Components first", "Read the component entry before writing markup. Treat every Avoid line as a hard limit."],
    ["Start from a page template", "Copy the closest floorplan and change the content, not the structure."],
    ["Use the class names", "Each component lists its ns- classes. If a component has no class, build it from tokens and say so in the handoff."],
  ]],
  ["Style", [
    ["Tokens only", "Never write raw hex, rgb, pixel colors or font names in components. Use the --ns- semantic roles. Primitives (--ns-gray-*, --ns-blue-500 and so on) are for the token sheet, not for components."],
    ["Modes on the root", "Set theme and density once on the html element: data-theme=\"light\" (dark is the default) and data-density=\"compact\". Never recolor a component to fake a mode."],
    ["Load the sheets", `Link ${SITE}css/tokens.css then ${SITE}css/components.css, and the fonts: <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">. No framework is required.`],
    ["Spacing, text and surfaces", "Gaps and padding use --ns-space-1 to --ns-space-12 (the scale is in the Semantic tokens section). Text color comes from --ns-text-primary, -secondary, -tertiary; surfaces from --ns-background-primary, -surface, -elevated. Error text uses --ns-status-error. Keep forms single column, max-width 480px (a px max-width is acceptable for page layout only, never inside a component)."],
    ["States", "Field errors: add is-error to the ns-field wrapper; it styles the input, select or textarea inside and turns the ns-helper red, so repeat the message in the helper and add aria-invalid=\"true\" and aria-describedby on the control. Control states (is-hover, is-focus, is-pressed, is-open) go on the control itself. A page-level error summary is an ns-alert ns-alert--error with a list of ns-link anchors to the fields, placed above the form and focused on submit."],
    ["Button emphasis", "ns-btn is primary (one per view). ns-btn--secondary, ns-btn--outline and ns-btn--ghost step down. ns-btn--tertiary is the low-emphasis text button for Cancel and dialog dismissals. ns-btn--danger is for destructive actions and is always confirmed."],
    ["Two status indicators", "ns-dot is the small uppercase chip for table cells (--success, --warning, --error, --neutral). ns-status-dot is the body-text indicator for lists and detail pages (--positive, --critical, --negative, --informative). Do not mix them in one view."],
  ]],
  ["Content", [
    ["Generated content", "Label anything a model wrote as generated, and cite the record it came from. Actions that change records or move money go through a confirmation step."],
    ["Sample data", "Mark invented names and numbers as sample data: one <p class=\"ns-helper\">Sample data</p> line above the view. Never present them as real records."],
    ["Words", "Sentence case, verb-first button labels, no exclamation marks."],
  ]],
  ["Check", [
    ["Run the checker", "node tools/agent-check.mjs <file.html> fails on unknown ns- classes, raw colors, unknown tokens and icon buttons without a name."],
  ]],
];
const md = [];
md.push(`# NorthStar Design System ${data.version}`, "",
  `> Machine-readable guide for AI coding and design agents. Generated ${data.generated} from the live catalog by tools/agent-export.mjs; do not edit by hand. Site: ${SITE} · Figma file VZxmDNQiosTN6gqnvEQ65Z.`, "",
  `NorthStar is a design language and development kit for dense, dark, data-heavy enterprise consoles: ${data.counts.components} components, ${data.counts.tokens} tokens, dark and light themes, comfortable and compact density. Markup is framework-free HTML with ns- classes; style comes only from CSS custom properties.`, "",
  "## Files", "",
  `- ${SITE}agent/northstar.md this file`,
  `- ${SITE}agent/components.json every component: classes, variants with markup, use and avoid rules, tokens, props, keyboard, accessibility`,
  `- ${SITE}agent/tokens.json every --ns- token with its dark and light value`,
  `- ${SITE}css/tokens.css and ${SITE}css/components.css the stylesheets to link`,
  `- ${SITE}#/getting-started/agent-guide the human version of these rules`, "");
md.push("## Quick start", "", "1. Find the page. Pick the closest floorplan or pattern below.", "2. Fill it with components. Use the component entries for markup, states and rules.", "3. Style with tokens. Set theme and density on the html element and use only semantic tokens.", "");
for (const [name, rules] of RULES) { md.push(`## ${name}`, ""); rules.forEach(([t, b]) => md.push(`- **${t}.** ${b}`)); md.push(""); }
const list = (title, items) => { if (!items.length) return; md.push(`## ${title}`, ""); items.forEach((p) => md.push(`- **${p.title}** (${SITE}${p.route}) ${p.summary}`)); md.push(""); };
const detail = (title, items) => { if (!items.length) return; md.push(`## ${title}`, ""); items.forEach((p) => { md.push(`### ${p.title}`, "", `${SITE}${p.route}`, "", p.summary, ""); if (p.body) md.push(p.body, ""); }); };
list("Floorplans (page templates)", data.floorplans);
list("Patterns", data.patterns);
list("Foundations", data.foundations);

md.push("## Semantic tokens", "", "Use these roles in components. Values are the dark theme; light overrides are in tokens.json.", "");
const semantic = data.tokens.filter((t) => !/^--ns-(gray|navy|blue|persian|purple|teal|green|yellow|red|magenta|violet|cyan|sky|orange|periwinkle)-\d|^--ns-(black|white)$/.test(t.name));
const groups = {};
semantic.forEach((t) => { const g = t.name.replace(/^--ns-/, "").split("-")[0]; (groups[g] = groups[g] || []).push(t); });
for (const [g, ts] of Object.entries(groups)) { md.push(`### ${g}`, "", "| Token | Dark | Light |", "|---|---|---|"); ts.forEach((t) => md.push(`| \`${t.name}\` | ${t.dark} | ${t.light ?? "same"} |`)); md.push(""); }

md.push("## Components", "");
const cats = [...new Set(data.components.map((c) => c.category))];
for (const cat of cats) {
  md.push(`### ${cat}`, "");
  for (const c of data.components.filter((x) => x.category === cat)) {
    md.push(`#### ${c.name} (${c.status})`, "", c.description, "", `Page: ${SITE}#/components/${c.id}${c.figma ? ` · Figma node ${c.figma}` : ""}`, "");
    if (c.classes.length) md.push(`Classes: ${c.classes.map((k) => `\`${k}\``).join(", ")}${c.helperClasses.length ? ` · helper classes in the examples: ${c.helperClasses.map((k) => `\`${k}\``).join(", ")}` : ""}`, "");
    if (c.axes.length) md.push(`Variants: ${c.axes.map((a) => `${a.axis}: ${a.values}`).join("; ")}`, "");
    if (c.use.length) { md.push("Use:"); c.use.forEach((u) => md.push(`- ${u}`)); md.push(""); }
    if (c.avoid.length) { md.push("Avoid:"); c.avoid.forEach((u) => md.push(`- ${u}`)); md.push(""); }
    if (c.guidance.length) { c.guidance.forEach((g) => md.push(`- ${g.verdict === "do" ? "Do" : "Do not"}: ${g.note}`)); md.push(""); }
    if (c.html) md.push("```html", c.html, "```", "");
    if (c.tokens.length) md.push(`Tokens: ${c.tokens.map((t) => `\`${t.token}\` (${t.role})`).join(", ")}`, "");
    if (c.keyboard.length) md.push(`Keyboard: ${c.keyboard.map((k) => `${k.key}: ${k.action}`).join("; ")}`, "");
    if (c.accessibility.length) { md.push("Accessibility:"); c.accessibility.forEach((a) => md.push(`- ${a}`)); md.push(""); }
  }
}
detail("Pattern detail", data.patterns);
detail("Floorplan detail", data.floorplans);
const markdown = md.join("\n").replace(/—/g, "-");

const llms = [
  `# NorthStar Design System`, "",
  `> Design language and development kit for dense, dark, data-heavy enterprise consoles by Mikel Rosenthal: ${data.counts.components} components, ${data.counts.tokens} tokens, dark and light themes, framework-free HTML with ns- classes. ${data.version}, exported ${data.generated}.`, "",
  "The docs site renders with JavaScript. Agents should read the files below instead of the HTML routes.", "",
  "## Agent files", "",
  `- [Agent guide](${SITE}agent/northstar.md): rules, floorplans, patterns, semantic tokens and every component with markup`,
  `- [Components](${SITE}agent/components.json): the full catalog as JSON`,
  `- [Tokens](${SITE}agent/tokens.json): every --ns- token with dark and light values`,
  `- [tokens.css](${SITE}css/tokens.css): the token sheet to link`,
  `- [components.css](${SITE}css/components.css): the component sheet to link`, "",
  "## Human pages", "",
  `- [AI agent guide](${SITE}#/getting-started/agent-guide)`,
  `- [Element reference](${SITE}#/getting-started/element-reference): names and the aliases people use`,
  `- [Component status](${SITE}#/getting-started/component-status): what is linked to Figma`,
  `- [Tokens](${SITE}#/foundations/tokens)`,
  `- [Accessibility](${SITE}#/accessibility)`, "",
].join("\n");

const files = {
  "llms.txt": llms + "\n",
  "agent/northstar.md": markdown + "\n",
  "agent/components.json": JSON.stringify({ version: data.version, generated: data.generated, site: SITE, components: data.components }, null, 1) + "\n",
  "agent/tokens.json": JSON.stringify({ version: data.version, generated: data.generated, note: "dark is the default theme; light lists only the values that change", tokens: data.tokens }, null, 1) + "\n",
};
const stale = [];
for (const [rel, body] of Object.entries(files)) {
  const p = join(ROOT, rel);
  const same = existsSync(p) && readFileSync(p, "utf8").replace(/Generated \d{4}-\d{2}-\d{2}|"generated": "\d{4}-\d{2}-\d{2}"|exported \d{4}-\d{2}-\d{2}/g, "") === body.replace(/Generated \d{4}-\d{2}-\d{2}|"generated": "\d{4}-\d{2}-\d{2}"|exported \d{4}-\d{2}-\d{2}/g, "");
  if (check) { if (!same) stale.push(rel); continue; }
  if (same) continue;
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, body);
  console.log(`wrote ${rel} (${(body.length / 1024).toFixed(0)} KB)`);
}
if (check) { if (stale.length) fail(`agent export out of date: ${stale.join(", ")}. Run node tools/agent-export.mjs`); console.log("agent export: up to date"); }
else console.log(`agent export: ${data.counts.components} components, ${data.counts.tokens} tokens, ${data.floorplans.length} floorplans, ${data.patterns.length} patterns`);
