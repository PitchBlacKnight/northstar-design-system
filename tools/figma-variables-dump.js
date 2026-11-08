/* Paste into the Figma MCP use_figma tool (read-only) on file VZxmDNQiosTN6gqnvEQ65Z. It returns every
   local COLOR and FLOAT variable resolved per mode. Save the returned JSON over tokens/figma-variables.json
   (add "captured": "YYYY-MM-DD"), then run node tools/token-drift.mjs. Figma's REST variables API needs an
   Enterprise plan, which is why this goes through the MCP. */
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const byId = {};
for (const c of cols) for (const id of c.variableIds) byId[id] = await figma.variables.getVariableByIdAsync(id);
const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("") + (c.a !== undefined && c.a < 1 ? Math.round(c.a * 255).toString(16).padStart(2, "0") : "");
const colOf = {}; cols.forEach((c) => c.variableIds.forEach((id) => (colOf[id] = c)));
const resolve = (v, modeName, depth = 0) => {
  const col = colOf[v.id];
  const mode = col.modes.find((m) => m.name === modeName) || col.modes[0];
  const val = v.valuesByMode[mode.modeId];
  if (val && val.type === "VARIABLE_ALIAS") { const t = byId[val.id]; return t && depth < 8 ? resolve(t, modeName, depth + 1) : null; }
  return v.resolvedType === "COLOR" ? hex(val) : val;
};
const out = { file: "VZxmDNQiosTN6gqnvEQ65Z", collections: {} };
for (const c of cols) {
  const vars = {};
  for (const id of c.variableIds) {
    const v = byId[id];
    if (!["COLOR", "FLOAT"].includes(v.resolvedType)) continue;
    const per = {}; for (const m of c.modes) { const r = resolve(v, m.name); per[m.name] = typeof r === "number" ? +r.toFixed(3) : r; }
    vars[v.name] = per;
  }
  out.collections[c.name] = { modes: c.modes.map((m) => m.name), vars };
}
return JSON.stringify(out);
