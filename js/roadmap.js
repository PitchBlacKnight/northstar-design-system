/* Carbon parity checklist: what NorthStar adds or improves to match IBM Carbon v11.
   Each item: [id, text, priority, state]  state: "" todo, "partial", "done". Ids are stable, never reuse. */
(function () {
  const NS = window.NS;
  const { h2, notice } = NS;

  NS.ROADMAP = [
    { phase: "Phase 1: Token architecture", why: "Everything else sits on this. Carbon's layering and theme tokens are what make it scale.", items: [
      ["tk-layer", "Layering tokens: layer-01/02/03, layer-hover, layer-selected, layer-accent (Carbon's surface stack)", "P1", ""],
      ["tk-field", "Field tokens per layer: field-01/02/03, border-subtle and border-strong per layer", "P1", "partial"],
      ["tk-themes", "Four theme modes instead of two: Light, Light-alt, Dark, Dark-high (Carbon: White, G10, G90, G100)", "P1", "partial"],
      ["tk-component", "Component token tier (button-primary-bg etc.) between semantic and component CSS", "P1", ""],
      ["tk-ramps", "Full 10-step ramps for every hue (10-100), not single 500 values", "P1", "partial"],
      ["tk-density", "Density modes: compact / default / comfortable as a variable mode", "P2", ""],
      ["tk-type-sets", "Productive vs expressive type sets, fluid heading sizes", "P2", ""],
      ["tk-export", "Token export pipeline: Figma Variables to CSS / JSON (Tokens Studio or Tokens Out)", "P1", ""],
      ["tk-names", "One naming grammar documented: category-role-variant-state, used in Figma and code", "P1", "partial"],
    ]},
    { phase: "Phase 2: Missing components", why: "Carbon ships about 45 components. NorthStar has 29.", items: [
      ["c-link", "Link (inline, standalone, visited, disabled)", "P1", ""],
      ["c-number", "Number input", "P1", ""],
      ["c-combobox", "Combo box and multiselect (filterable dropdown)", "P1", ""],
      ["c-overflow", "Overflow menu and Menu", "P1", ""],
      ["c-menubtn", "Menu button and combo button", "P2", ""],
      ["c-switcher", "Content switcher (segmented control)", "P1", ""],
      ["c-stepper", "Progress indicator (stepper, used by the wizard floorplan)", "P1", "partial"],
      ["c-skeleton", "Skeleton states for every data component", "P1", ""],
      ["c-inline-loading", "Inline loading (button and form submit state)", "P2", ""],
      ["c-code", "Code snippet (inline, single-line, multi-line, copy)", "P2", ""],
      ["c-structured", "Structured list and contained list", "P2", ""],
      ["c-tile", "Tile variants: clickable, selectable, expandable (card today)", "P2", "partial"],
      ["c-tree", "Tree view", "P2", ""],
      ["c-toggletip", "Toggletip (click-to-open help, unlike tooltip)", "P2", ""],
      ["c-shell", "UI shell: header, header panel, left and right side panels, switcher", "P1", "partial"],
      ["c-textarea", "Text area and password input", "P1", ""],
      ["c-timepicker", "Time picker", "P3", ""],
      ["c-fluid", "Fluid form inputs (label-inside variant for dense forms)", "P3", ""],
      ["c-layout", "Layout primitives: Grid, Stack, Layer components", "P2", ""],
    ]},
    { phase: "Phase 3: AI layer (Carbon for AI)", why: "The 2026 differentiator. Carbon added AI label, AI presence styling, and chat.", items: [
      ["ai-label", "AI label component: marks AI-generated content, opens an explainability popover", "P1", ""],
      ["ai-presence", "AI presence styling tokens: gradient border, glow, ai-* layer tokens", "P1", ""],
      ["ai-chat", "Chat / assistant components: message, prompt input, streaming state, feedback", "P2", ""],
      ["ai-patterns", "AI patterns page: disclosure, human review, confidence, undo, error and refusal states", "P1", ""],
      ["ai-mcp", "Figma MCP readiness: every component has a description, clean layer names, no detached styles", "P1", ""],
      ["ai-codeconnect", "Code Connect mapping for every Figma component", "P1", ""],
      ["ai-agentdocs", "Machine-readable docs: llms.txt and a DESIGN.md that agents read before generating UI", "P2", ""],
      ["ai-generator", "AI generator constrained to NorthStar components and tokens only", "P2", "partial"],
    ]},
    { phase: "Phase 4: Documentation depth", why: "Carbon's real strength. Every component page answers the same questions.", items: [
      ["d-tabs", "Usage / Style / Code / Accessibility tabs on every component", "P1", "done"],
      ["d-anatomy", "Anatomy diagram with numbered parts on every component", "P1", ""],
      ["d-dodont", "Do / Don't image pairs on every component", "P1", ""],
      ["d-status", "Component status: experimental, stable, deprecated, with a status page", "P1", "partial"],
      ["d-content", "Content guidelines: voice, tone, action labels, grammar, error messages", "P1", ""],
      ["d-keyboard", "Keyboard interaction table per component", "P1", "partial"],
      ["d-related", "Related components and 'when not to use' on every page", "P2", ""],
      ["d-i18n", "Internationalization: RTL, text expansion, date and number formats", "P2", ""],
      ["d-pictograms", "Pictogram and illustration guidelines (icons only today)", "P3", ""],
      ["d-motion", "Motion: productive vs expressive curves with live demos", "P2", "partial"],
    ]},
    { phase: "Phase 5: Patterns and data", why: "Carbon for IBM Products covers the enterprise flows.", items: [
      ["p-common", "Common actions pattern (create, edit, delete, bulk)", "P1", ""],
      ["p-disclosure", "Disclosure and overflow content patterns", "P2", ""],
      ["p-readonly", "Read-only and disabled states pattern", "P2", ""],
      ["p-status", "Status indicators pattern (shape + color + text)", "P1", ""],
      ["p-login", "Login and session timeout pattern", "P2", ""],
      ["p-tearsheet", "Tearsheet and side panel (create flows)", "P2", ""],
      ["p-notifications", "Notification center pattern", "P3", ""],
      ["p-dt-advanced", "Data table: sort, expand, inline edit, column settings, sticky header", "P1", "partial"],
      ["p-viz-a11y", "Data viz accessibility: patterns and textures, table fallback", "P2", ""],
    ]},
    { phase: "Phase 6: Engineering and governance", why: "What makes it enterprise instead of a style guide.", items: [
      ["e-package", "Published package (npm) with semantic versioning", "P1", ""],
      ["e-react", "React components matching the CSS classes", "P1", "partial"],
      ["e-storybook", "Storybook with every state, linked from each component page", "P2", ""],
      ["e-tests", "Visual regression and automated a11y tests (axe) in CI", "P2", ""],
      ["e-lint", "Lint rule: no raw hex or px outside tokens", "P2", ""],
      ["e-deprecation", "Deprecation and migration policy with codemods", "P2", "partial"],
      ["e-contrib", "Contribution flow: proposal, review, build, release, with templates", "P1", "partial"],
      ["e-metrics", "Adoption metrics: Figma library analytics + code usage scan", "P3", ""],
      ["e-figma-file", "Figma file structure: Cover, Getting started, Foundations, one page per component, Patterns, Changelog", "P1", ""],
    ]},
  ];

  const ALL = NS.ROADMAP.flatMap((g) => g.items);
  const KEY = "ns-roadmap";
  const pr = { P1: "red", P2: "yellow", P3: "purple" };

  NS.PAGES["community/carbon-parity"] = {
    title: "Carbon parity checklist",
    lede: "What NorthStar adds or improves to reach IBM Carbon's enterprise level. Work top to bottom: tokens first, then components, AI, docs, patterns, and engineering.",
    body: () => `${notice("info", "How to read this", "P1 is needed for enterprise parity. P2 closes the gap. P3 is polish. Items marked Partial exist but fall short of Carbon's version. Your checks are saved in this browser.")}
<p id="rm-score" style="color:var(--ns-text-tertiary)"></p>
${NS.ROADMAP.map((g) => `${h2(g.phase)}<p>${g.why}</p><div class="ns" style="display:grid;gap:10px">${g.items.map(([id, t, p, s]) => `<label class="ns-check"><input type="checkbox" data-rm="${id}" data-p="${p}" data-default="${s === "done" ? 1 : 0}"/> <span class="ns-tag ns-tag--${pr[p]}">${p}</span>${s === "partial" ? ' <span class="ns-tag ns-tag--blue">Partial</span>' : ""} ${t}</label>`).join("")}</div>`).join("")}`,
    init: () => {
      let saved = null; try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
      const boxes = [...document.querySelectorAll("[data-rm]")];
      const score = () => { const done = boxes.filter((b) => b.checked); const p1 = done.filter((b) => b.dataset.p === "P1").length; const p1all = ALL.filter((i) => i[2] === "P1").length; document.getElementById("rm-score").textContent = `${done.length} of ${boxes.length} done. P1: ${p1} of ${p1all}.`; };
      boxes.forEach((b) => { b.checked = saved ? saved.includes(b.dataset.rm) : b.dataset.default === "1"; b.addEventListener("change", () => { try { localStorage.setItem(KEY, JSON.stringify(boxes.filter((x) => x.checked).map((x) => x.dataset.rm))); } catch (e) {} score(); }); });
      score();
    },
  };
})();
