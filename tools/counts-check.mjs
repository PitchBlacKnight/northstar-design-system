/* Counts check: every typed count must match the system.
     node tools/counts-check.mjs
   The home page reads its counts from the data. Other places have them typed in (the share
   description, the agent export, the case study page on the portfolio site), and those drift.
   This counts the real tokens, components, patterns, dashboards and spec tabs, then fails on
   any typed number that disagrees. The case study is checked when its folder is on this machine. */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const drift = execFileSync("node", [join(ROOT, "tools/figma-sync-check.mjs"), "--offline"], { encoding: "utf8" });
const [, components, specs] = drift.match(/Site components: (\d+).*Spec tabs: (\d+)/) || [];
const patternLine = (read("js/pages.js").match(/group: "Patterns", items: \[(.*)\] \}/) || [])[1] || "";
const real = {
  tokens: new Set(read("css/tokens.css").match(/--ns-[a-z0-9-]+(?=\s*:)/g)).size,
  components: +components,
  specs: +specs,
  patterns: (patternLine.match(/\["patterns\//g) || []).length,
  dashboards: readdirSync(join(ROOT, "dashboards")).filter((f) => f.endsWith(".html") && f !== "chart-parts.html").length,
};
for (const [k, v] of Object.entries(real)) if (!v) { console.error(`Could not count ${k}; the parser needs updating.`); process.exit(1); }

const bad = [];
/* each rule: a pattern with one captured number, and the count it must equal */
const scan = (label, text, rules) => {
  for (const [re, key] of rules) for (const m of text.matchAll(re)) {
    const n = +m[1].replace(/\D/g, "");
    if (n !== real[key]) bad.push(`${label}: says ${m[1]} ${key}, the system has ${real[key]}`);
  }
};
const prose = [[/(\d+)\+? components\b/g, "components"], [/(\d+)\+? (?:design )?tokens\b/g, "tokens"]];
scan("index.html", (read("index.html").match(/<meta[^>]+description[^>]+>/g) || []).join("\n"), prose);
scan("llms.txt", read("llms.txt").split("\n").slice(0, 6).join("\n"), prose);
scan("agent/northstar.md", read("agent/northstar.md").split("\n").slice(0, 8).join("\n"), prose);

const study = join(ROOT, "..", "_pathfinder-live", "northstar-case-study.html");
if (existsSync(study)) {
  const stat = (word, key) => [new RegExp(`<b>([\\d,]+\\+?)</b><(?:span|small)>${word}`, "g"), key];
  scan("case study", readFileSync(study, "utf8"), [
    stat("Tokens", "tokens"), stat("Components", "components"), stat("Patterns", "patterns"), stat("Dashboards", "dashboards"),
    [/Site components: (\d+)/g, "components"], [/Spec tabs: (\d+)/g, "specs"], [/(\d+) dashboard layouts/g, "dashboards"],
  ]);
}

console.log(`Counts: ${real.tokens} tokens, ${real.components} components, ${real.patterns} patterns, ${real.dashboards} dashboards, ${real.specs} spec tabs${existsSync(study) ? "" : " (case study folder not found, skipped)"}`);
if (bad.length) { console.error(bad.map((b) => "  " + b).join("\n")); process.exit(1); }
console.log("Every typed count matches.");
