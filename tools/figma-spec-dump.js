/* Paste into the Figma MCP use_figma tool (read-only) to dump one spec frame in the REST
   nodes shape that tools/figma-spec-extract.mjs --from expects. Set NODE_ID and PAGE_ID
   first. Instance subtrees are collapsed to componentId + componentProperties. */
const NODE_ID = "4444:979", PAGE_ID = "4038:29816";
const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);
const frame = await figma.getNodeByIdAsync(NODE_ID);
const components = {}, componentSets = {};
const dump = (n) => {
  const o = { id: n.id, name: n.name, type: n.type };
  if (n.type === "TEXT") o.characters = n.characters;
  if (n.type === "INSTANCE") {
    const mc = n.mainComponent;
    if (mc) {
      o.componentId = mc.id;
      const set = mc.parent && mc.parent.type === "COMPONENT_SET" ? mc.parent : null;
      components[mc.id] = { name: mc.name, componentSetId: set ? set.id : undefined };
      if (set) componentSets[set.id] = { name: set.name };
    }
    o.componentProperties = {};
    for (const [k, v] of Object.entries(n.componentProperties || {})) o.componentProperties[k] = { type: v.type, value: v.value };
    return o;
  }
  if (n.children) o.children = n.children.map(dump);
  return o;
};
return { document: dump(frame), components, componentSets };
