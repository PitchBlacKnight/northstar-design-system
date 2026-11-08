#!/usr/bin/env node
/* Style lint: one set of rules for every component, widget and dashboard stylesheet (STYLE-RULES.md).
   Flags raw palette variables, hex colors, px radii, glows and gradients, px font sizes and stray weights.
   Exit 1 on any finding not listed in tokens/style-allow.json. */
import { readFileSync, existsSync } from "node:fs";
const FILES = ["css/components.css", "css/widgets.css", "css/dashboards.css"];
const allow = existsSync("tokens/style-allow.json") ? JSON.parse(readFileSync("tokens/style-allow.json", "utf8")) : [];
const RULES = [
  ["palette", /var\(--ns-(?:blue|teal|navy|purple|red|green|orange|yellow|gray|persian|magenta|violet|cyan|sky|periwinkle)-\d+\)|var\(--ns-(?:white|black)\)/g, "use a semantic token (text-, background-, interactive-, status-, chart-)"],
  ["hex", /#[0-9a-fA-F]{3,8}\b/g, "use a token, not a hex value"],
  ["radius", /border-radius:\s*[^;}]*\b\d+px/g, "use --ns-radius-*"],
  ["glow", /(?<!0 )0 0 [1-9]\d*px\s+(?!\d)|drop-shadow\(|blur\(/g, "no glow or blur"],
  ["gradient", /(?:linear|radial)-gradient\(|--ns-gradient-/g, "flat fills only"],
  ["font-size", /font-size:\s*\d+(?:\.\d+)?px/g, "use --ns-type-*-size"],
  ["weight", /font-weight:\s*(?!400|600|700)\d+/g, "weights are 400, 600, 700"],
];
const out = [];
for (const f of FILES) {
  readFileSync(f, "utf8").split("\n").forEach((line, i) => {
    if (/style-lint-ignore/.test(line)) return;
    for (const [id, re, why] of RULES) for (const m of line.matchAll(re)) {
      const key = `${f}:${id}:${m[0]}`;
      if (!allow.includes(key)) out.push(`${f}:${i + 1}  ${id.padEnd(9)} ${m[0]}  (${why})`);
    }
  });
}
if (out.length) { console.log(`Style lint: ${out.length} finding(s)\n` + out.join("\n")); process.exit(1); }
console.log("Style lint: clean");
