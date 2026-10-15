#!/usr/bin/env node
/* NorthStar spec extractor: turns one "NORTHSTAR DS / <Name> specification" frame in the
   NORTHSTAR DS Figma file into an NS.SPECS entry and writes it into js/specs.js.
   Read-only on the Figma side. Run it when a spec frame is added or edited:

     node tools/figma-spec-extract.mjs <nodeId> [--id <spec-id>] [--from <dump.json>] [--dry]

   <nodeId>   the spec frame, e.g. 4444:979 (also accepts 4444-979)
   --id       the NS.SPECS key; defaults to the frame name, lowercased and hyphenated
   --from     read the frame from a JSON dump instead of the REST API. The dump has the
              REST nodes shape: { document, components, componentSets } where document is
              the frame tree (id, name, type, characters, children, componentId,
              componentProperties). tools/figma-spec-dump.js produces it from the Figma
              MCP when no REST token is at hand.
   --dry      print the entry as JSON and leave js/specs.js alone

   FIGMA_TOKEN comes from the environment or a gitignored .env file in the repo root
   (a Figma personal access token with file_content:read). The file is re-serialised
   with JSON.stringify(specs, null, 1), the same shape tools/figma-sync-check.mjs parses. */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE_KEY = "VZxmDNQiosTN6gqnvEQ65Z";
const SPECS_PATH = join(ROOT, "js/specs.js");

const args = process.argv.slice(2);
const nodeId = (args.find((a) => !a.startsWith("--")) || "").replace("-", ":");
const dry = args.includes("--dry");
const idArg = args.includes("--id") ? args[args.indexOf("--id") + 1] : "";
const fromArg = args.includes("--from") ? args[args.indexOf("--from") + 1] : "";
if (!nodeId) { console.error("Usage: node tools/figma-spec-extract.mjs <nodeId> [--id <spec-id>] [--dry]"); process.exit(2); }

let entry;
if (fromArg) {
  entry = JSON.parse(readFileSync(fromArg, "utf8"));
  if (entry.nodes) entry = entry.nodes[nodeId];
} else {
  let token = process.env.FIGMA_TOKEN;
  if (!token && existsSync(join(ROOT, ".env"))) token = (readFileSync(join(ROOT, ".env"), "utf8").match(/^FIGMA_TOKEN=(.+)$/m) || [])[1]?.trim();
  if (!token) { console.error("FIGMA_TOKEN is not set. Add it to .env or the environment, or pass --from <dump.json>."); process.exit(2); }
  const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(nodeId)}`, { headers: { "X-Figma-Token": token } });
  if (!res.ok) { console.error(`Figma API ${res.status}: ${await res.text()}`); process.exit(2); }
  entry = (await res.json()).nodes[nodeId];
}
if (!entry || !entry.document) { console.error(`Node ${nodeId} not found${fromArg ? " in " + fromArg : " in " + FILE_KEY}.`); process.exit(2); }
if (entry.document.id !== nodeId) { console.error(`Dump is for node ${entry.document.id}, not ${nodeId}.`); process.exit(2); }
const frame = entry.document, components = entry.components || {}, componentSets = entry.componentSets || {};
const m = frame.name.match(/^NORTHSTAR DS \/ (.+?) specification$/i);
if (!m) { console.error(`Node ${nodeId} is "${frame.name}", not a "NORTHSTAR DS / <Name> specification" frame.`); process.exit(2); }
const frameTitle = m[1];
const specId = (idArg && !idArg.startsWith("--") ? idArg : frameTitle).toLowerCase().replace(/\s+/g, "-");

/* ---------- helpers ---------- */
const kids = (n) => n.children || [];
const texts = (n) => kids(n).filter((c) => c.type === "TEXT");
const byName = (n, ...names) => kids(n).find((c) => names.includes(c.name));
const chars = (n) => (n && n.characters ? n.characters.trim() : "");
const findText = (n, ...names) => chars(byName(n, ...names));
const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

/* ---------- document header ---------- */
const header = byName(frame, "Document header") || { children: [] };
let category = findText(header, "Document category"), revision = findText(header, "Revision");
const metaFrame = byName(header, "Document metadata");
if (metaFrame) {
  category = category || findText(metaFrame, "Document category");
  revision = revision || findText(metaFrame, "Revision");
  const one = texts(metaFrame).find((t) => t.name === "Document metadata");
  if (one && (!category || !revision)) {
    const [cat, rev] = chars(one).split(/\s+·\s+(?=Reviewed\b)/);
    category = category || cat; revision = revision || rev || "";
  }
}
const title = findText(header, "Document title") || titleCase(frameTitle);
const summary = findText(header, "Document summary");
const meta = {};
for (const c of kids(byName(header, "Evidence status") || {})) {
  if (c.type === "TEXT") meta[c.name] = chars(c);
  else if (c.children) { const k = findText(c, "Key").replace(/:$/, ""), v = findText(c, "Value"); if (k) meta[k] = v; }
}

/* ---------- blocks ---------- */
const instanceDescription = (inst) => {
  const comp = components[inst.componentId] || {};
  const setName = comp.componentSetId && componentSets[comp.componentSetId]?.name;
  const base = (setName || comp.name || inst.name).split(" / ").pop();
  const order = { VARIANT: 0, TEXT: 1, BOOLEAN: 2 };
  const props = Object.entries(inst.componentProperties || {}).filter(([, p]) => p.type in order)
    .sort((a, b) => order[a[1].type] - order[b[1].type]).map(([k, p]) => {
      const key = k.replace(/#.*$/, "");
      return p.type === "TEXT" ? `${key} '${p.value}'` : `${key}=${p.value}`;
    });
  return `${base} instance${props.length ? ", " + props.join(", ") : ""}.`;
};
const tableBlock = (n) => {
  const rows = kids(n).filter((r) => r.children).map((r) => texts(r).map(chars));
  if (!rows.length) return null;
  const head = byName(n, "Table header") ? rows[0] : rows[0];
  return { type: "table", columns: head, rows: rows.slice(1) };
};
const blocksOf = (n, out = []) => {
  for (const c of kids(n)) {
    if (c.name === "Section header") continue;
    if (c.type === "TEXT") {
      const t = chars(c); if (!t) continue;
      out.push(c.name === "Technical label" ? { type: "label", text: t } : { type: "text", text: t });
    } else if (c.type === "INSTANCE") {
      out.push({ type: "example", label: c.name.replace(/^Specimen\s*·\s*/, ""), description: instanceDescription(c) });
    } else if (c.name === "Review note") {
      out.push({ type: "note", heading: findText(c, "Note heading", "Heading"), text: findText(c, "Documentation copy", "Body") });
    } else if (c.name === "Property table" || byName(c, "Table header", "Table row")) {
      const t = tableBlock(c); if (t) out.push(t);
    } else if (c.name === "Acceptance checklist") {
      out.push({ type: "checklist", items: texts(c).map((t) => chars(t).replace(/^[☐☑✓]\s*/, "")) });
    } else if (c.name === "Component specimen") {
      const inst = kids(byName(c, "Instance area") || {}).find((x) => x.type === "INSTANCE");
      out.push({ type: "example", label: findText(c, "Technical label"), description: inst ? instanceDescription(inst) : "Figma specimen." });
    } else if (c.children) blocksOf(c, out);
  }
  return out;
};

const sections = kids(frame).filter((c) => c.children && !/^Document (header|footer)$/.test(c.name)).map((s) => {
  const sh = byName(s, "Section header") || {};
  return { nodeId: s.id, number: findText(sh, "Section number", "Number"), heading: findText(sh, "Section heading", "Heading") || s.name, blocks: blocksOf(s) };
});
const footer = texts(byName(frame, "Document footer") || {}).map(chars).filter(Boolean);
const spec = { nodeId, title, category, revision, summary, meta, sections, ...(footer.length ? { footer } : {}) };

if (dry) { console.log(JSON.stringify({ [specId]: spec }, null, 1)); process.exit(0); }

/* ---------- write js/specs.js ---------- */
const src = readFileSync(SPECS_PATH, "utf8");
const start = src.indexOf("NS.SPECS = ") + 11, end = src.indexOf(";\n  NS.WORKFLOWS");
if (start < 11 || end < 0) { console.error("js/specs.js does not have the expected NS.SPECS / NS.WORKFLOWS layout."); process.exit(2); }
const specs = JSON.parse(src.slice(start, end));
const existed = specId in specs;
specs[specId] = spec;
const d = new Date(), today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const out = src.slice(0, start) + JSON.stringify(specs, null, 1) + src.slice(end);
writeFileSync(SPECS_PATH, out.replace(/(synced from NORTHSTAR DS \([^)]+\) on )\d{4}-\d{2}-\d{2}/, `$1${today}`));
console.log(`${existed ? "Updated" : "Added"} NS.SPECS["${specId}"] from ${frame.name} (${nodeId}): ${sections.length} sections, ${sections.reduce((n, s) => n + s.blocks.length, 0)} blocks.`);
