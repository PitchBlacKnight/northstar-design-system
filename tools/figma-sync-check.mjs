#!/usr/bin/env node
/* NorthStar drift check: compares the NORTHSTAR DS Figma file with this site.
   Read-only on both sides. Run it yourself when you want a report:

     node tools/figma-sync-check.mjs            full check (needs FIGMA_TOKEN)
     node tools/figma-sync-check.mjs --offline  site-side checks only

   FIGMA_TOKEN comes from the environment or a gitignored .env file in the repo root
   (a Figma personal access token with file_content:read). Exit code 1 means drift. */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE_KEY = "VZxmDNQiosTN6gqnvEQ65Z";
const SITE = "https://mikelrosenthal.com/northstar/#/";
const SCAN_PAGE = (name) => /^❖|^0[12] /.test(name.trim()) && !/Widgets|Informers/.test(name);
const offline = process.argv.includes("--offline");

const read = (p) => readFileSync(join(ROOT, p), "utf8");
const problems = [], notes = [];
const bad = (m) => problems.push(m), note = (m) => notes.push(m);

/* ---------- site side ---------- */
const compSrc = read("js/components.js");
const site = [...compSrc.matchAll(/id: "([\w-]+)", name: "([^"]+)", cat: "[^"]+", status: "[^"]+"(?:, figma: "([\d:]+)")?/g)]
  .map(([, id, name, figma]) => ({ id, name, figma }));
const pages = new Set([...read("js/pages.js").matchAll(/\b(?:P|pattern)\("([\w/-]*)"/g)].map((m) => m[1]));
const routes = new Set([...site.map((c) => "components/" + c.id), ...[...pages].map((p) => (p.includes("/") || p === "" ? p : "patterns/" + p))]);
const specSrc = read("js/specs.js");
const specs = JSON.parse(specSrc.slice(specSrc.indexOf("NS.SPECS = ") + 11, specSrc.indexOf(";\n  NS.WORKFLOWS")));
const syncedOn = (specSrc.match(/on (\d{4}-\d{2}-\d{2})/) || [])[1];

if (!site.length) bad("Could not parse any components from js/components.js; the regex needs updating.");
site.filter((c) => !c.figma).forEach((c) => bad(`Site component "${c.name}" has no Figma node (add figma: "<node id>" in js/components.js).`));

if (offline) report();
else await online();

/* ---------- Figma side ---------- */
async function online() {
  let token = process.env.FIGMA_TOKEN;
  if (!token && existsSync(join(ROOT, ".env"))) token = (read(".env").match(/^FIGMA_TOKEN=(.+)$/m) || [])[1]?.trim();
  if (!token) { console.error("FIGMA_TOKEN is not set. Add it to .env or the environment, or run with --offline."); process.exit(2); }
  const api = async (path) => {
    const r = await fetch("https://api.figma.com/v1/" + path, { headers: { "X-Figma-Token": token } });
    if (!r.ok) { console.error(`Figma API ${r.status} on ${path}: ${await r.text()}`); process.exit(2); }
    return r.json();
  };

  const file = await api(`files/${FILE_KEY}`);
  note(`Figma file "${file.name}", last modified ${file.lastModified}${syncedOn ? `; specs.js last synced ${syncedOn}` : ""}.`);
  if (syncedOn && file.lastModified.slice(0, 10) > syncedOn) note("Figma has changed since the last spec sync. Re-run the spec extraction if spec frames were edited.");

  // Walk scanned pages for component sets and standalone components.
  const figma = [], specFrames = [];
  const walk = (n, page, inSet) => {
    if (n.type === "COMPONENT_SET") figma.push({ id: n.id, name: n.name, page });
    else if (n.type === "COMPONENT" && !inSet) figma.push({ id: n.id, name: n.name, page });
    if (n.type === "FRAME" && /^NORTHSTAR DS \/ .+ specification$/.test(n.name)) specFrames.push({ id: n.id, name: n.name.replace(/^NORTHSTAR DS \/ | specification$/g, "") });
    (n.children || []).forEach((c) => walk(c, page, inSet || n.type === "COMPONENT_SET"));
  };
  file.document.children.filter((p) => SCAN_PAGE(p.name)).forEach((p) => walk(p, p.name.trim(), false));
  const meta = { ...file.componentSets, ...file.components };

  // Figma -> site: every component needs a doc link to a real site route.
  for (const c of figma) {
    const links = (meta[c.id] && meta[c.id].documentationLinks) || [];
    const uri = links[0] && links[0].uri;
    if (!uri) {
      if (site.some((s) => s.figma === c.id)) bad(`Figma "${c.name}" (${c.page}, ${c.id}) is on the site but has no documentation link back.`);
      else note(`Figma-only: "${c.name}" on ${c.page} (${c.id}) is not documented on the site.`);
      continue;
    }
    if (!uri.startsWith(SITE)) { bad(`Figma "${c.name}" links outside the site: ${uri}`); continue; }
    const route = uri.slice(SITE.length);
    if (!routes.has(route)) bad(`Figma "${c.name}" links to #/${route}, which is not a site page.`);
  }

  // Site -> Figma: every node ID must still exist.
  const ids = [...new Set(site.filter((c) => c.figma).map((c) => c.figma))];
  const nodes = (await api(`files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids.join(","))}&depth=1`)).nodes;
  for (const c of site.filter((c) => c.figma)) {
    const n = nodes[c.figma];
    if (!n || !n.document) bad(`Site "${c.name}" points at Figma node ${c.figma}, which no longer exists.`);
  }

  // Spec frames vs Spec tabs.
  for (const f of specFrames) {
    const id = f.name.toLowerCase().replace(/\s+/g, "-");
    const s = specs[id];
    if (!s) bad(`Figma has a "${f.name}" specification (${f.id}) but the site has no Spec tab for it.`);
    else if (s.nodeId !== f.id) bad(`Spec "${f.name}" moved in Figma: site has ${s.nodeId}, Figma has ${f.id}.`);
  }
  Object.entries(specs).filter(([, s]) => !specFrames.some((f) => f.id === s.nodeId)).forEach(([id]) => bad(`Site Spec tab "${id}" has no matching specification frame in Figma.`));

  report(figma.length);
}

function report(figmaCount, siteCount = site.length) {
  console.log(`NorthStar drift check${offline ? " (offline: site side only)" : ""}`);
  console.log(`Site components: ${siteCount}${figmaCount != null ? ` | Figma components scanned: ${figmaCount}` : ""} | Spec tabs: ${Object.keys(specs).length}\n`);
  notes.forEach((m) => console.log("  note  " + m));
  if (notes.length) console.log("");
  if (!problems.length) console.log("In sync. No drift found.");
  else { console.log(`${problems.length} issue(s):`); problems.forEach((m) => console.log("  drift " + m)); }
  process.exit(problems.length ? 1 : 0);
}
