/* Guide pages: AI agent guide, agentic commands, element reference, downloads, component status.
   The command helper is rule based. It matches keywords on the page and calls no model. */
(function () {
  const NS = window.NS;
  const { h2, h3, table, notice, codeBlock } = NS;
  const x = NS.esc;

  /* ---------- AI agent guide ---------- */
  const RULE_GROUPS = [
    { name: "Build", intro: "What to start from.", rules: [
      ["Components first", "Read the component page before writing markup. Follow every Do and Do not, and treat Do not rules as hard limits."],
      ["Start from a page template", "Copy the closest floorplan and change the content, not the structure. Floorplans cover dashboards, lists, detail pages, wizards and approval queues."],
      ["Use the class names", "Each component page names its ns- classes. If a component has no class yet, build it from tokens and say so in the handoff."],
    ] },
    { name: "Style", intro: "How it should look.", rules: [
      ["Tokens only", "Never use raw hex values, pixel colors or font names in components. Use the --ns- semantic roles."],
      ["Modes on the root", "Set theme and density once on the html element with data-theme and data-density. Never recolor a component to fake a mode."],
    ] },
    { name: "Content", intro: "What it should say.", rules: [
      ["Generated content", "Label anything a model wrote as generated, and cite the record it came from. Actions that change records or move money go through a confirmation step."],
      ["Sample data", "Mark invented names and numbers as sample data. Never present them as real records."],
      ["Words", "Use sentence case and verb-first button labels. Skip exclamation marks."],
    ] },
  ];
  const PROMPTS = [
    ["Create account workflow", "Build a create account form from the Forms pattern. Use Input, Select and Button, validate on blur, and summarize errors on submit."],
    ["Dashboard", "Build a dashboard from the Dashboard floorplan. One color-blocked tile per metric, with a table tile for the detail."],
    ["Bulk actions", "Add a bulk action bar to the account table. Show the selected count, keep destructive actions last, and confirm them."],
    ["Generated answer", "Draft a generated answer for the account detail page. Include a generated label, two record citations, and a suggested edit that the person must accept."],
  ];
  const componentLinks = () => {
    const cats = [...new Set(NS.COMPONENTS.map((c) => c.cat))];
    return cats.map((cat) => `<h4>${cat}</h4><p>${NS.COMPONENTS.filter((c) => c.cat === cat).map((c) => `<a href="#/components/${c.id}">${c.name}</a>`).join(" · ")}</p>`).join("");
  };
  NS.PAGES["getting-started/agent-guide"] = {
    title: "AI agent guide",
    status: "New",
    lede: "Rules for AI coding and design agents that build with NorthStar, including tools that read the Figma file or this site. It is also the short version of the system for people.",
    body: () => `${h2("Quick start")}<ol>
<li><strong>Find the page.</strong> Pick the closest page template in the Patterns and Floorplans sections.</li>
<li><strong>Fill it with components.</strong> Use the component pages for markup, states and rules.</li>
<li><strong>Style with tokens.</strong> Set theme and density on the html element, and use only semantic tokens.</li>
</ol>${RULE_GROUPS.map((g) => `${h2(g.name)}<p>${g.intro}</p>${g.rules.map(([t, b]) => `<h4>${t}</h4><p>${b}</p>`).join("")}`).join("")}${h2("Components")}<p>Each component page names its classes, states and rules.</p>${componentLinks()}${h2("Prompt starters")}<p>Paste one into an agent that can read the Figma file or this site. Each names the pattern and components it expects.</p><div style="display:grid;gap:var(--ns-space-3)">${PROMPTS.map(([label, text]) => `<div class="ns-card"><div style="display:flex;justify-content:space-between;align-items:center;gap:var(--ns-space-4);margin-bottom:var(--ns-space-2)"><span class="ns-label">${x(label)}</span><button class="ns-btn ns-btn--ghost ns-btn--sm" data-copy="${x(text)}">Copy</button></div><p style="margin:0">${x(text)}</p></div>`).join("")}</div>`,
  };

  /* ---------- Agentic commands (command studio) ---------- */
  const RECIPES = [
    { id: "status-dashboard", name: "Status dashboard", prompt: "compose status-dashboard --scope sample --include risks,owners", parts: ["Stat tiles", "Data table", "Status dot"], asset: "Sample accounts dataset",
      preview: '<div class="grid grid-3"><div class="ns-kpi"><span class="ns-kpi__label">Accounts</span><span class="ns-kpi__value">24</span></div><div class="ns-kpi"><span class="ns-kpi__label">At risk</span><span class="ns-kpi__value">3</span></div><div class="ns-kpi"><span class="ns-kpi__label">Renewed</span><span class="ns-kpi__value">91%</span></div></div><table class="ns-table ns-table--compact"><thead><tr><th>Account</th><th>Status</th></tr></thead><tbody><tr><td>Sample account A</td><td><span class="ns-status-dot ns-status-dot--positive">Active</span></td></tr><tr><td>Sample account B</td><td><span class="ns-status-dot ns-status-dot--critical">At risk</span></td></tr></tbody></table>' },
    { id: "confirmation", name: "Confirmation moment", prompt: "compose confirmation --risk medium --owner sample-user", parts: ["Card", "Alert", "Button group"], asset: "Sample approval copy",
      preview: '<div class="ns-notice ns-notice--warning"><span class="ns-notice__icon" aria-hidden="true">!</span><div><p class="ns-notice__title">This changes 2 sample settings</p><p class="ns-notice__body">Review both before you publish.</p></div></div><div class="ns-card"><h3 class="ns-card__title">Publish this change?</h3><p class="ns-card__body">The change updates the settings for every account in the sample group.</p><div style="display:flex;gap:var(--ns-space-3);justify-content:flex-end"><button class="ns-btn ns-btn--ghost">Cancel</button><button class="ns-btn">Publish change</button></div></div>' },
    { id: "guided-setup", name: "Guided setup", prompt: "compose guided-setup --steps 4 --progress 2", parts: ["Steps", "Form fields", "Progress bar"], asset: "Sample profile dataset",
      preview: '<ol class="ns-steps"><li class="is-done"><b>1. Account</b></li><li class="is-current"><b>2. Workspace</b></li><li><b>3. Team</b></li><li><b>4. Review</b></li></ol><div class="ns-field" style="max-width:320px"><label class="ns-label">Workspace name</label><input class="ns-input" value="Sample workspace"/></div><div class="ns-progress"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:50%"></div></div></div><div style="display:flex;gap:var(--ns-space-3)"><button class="ns-btn ns-btn--outline">Back</button><button class="ns-btn">Next</button></div>' },
  ];
  const ASSETS = [
    { name: "Sample accounts dataset", kind: "Data", detail: "Sample rows only" },
    { name: "Sample approval copy", kind: "Copy", detail: "Placeholder wording" },
    { name: "Sample profile dataset", kind: "Data", detail: "Sample profiles only" },
    { name: "NorthStar icon set", kind: "Asset", detail: "Listed in assets/icons/manifest.json" },
  ];
  const INTENTS = [
    { words: ["table", "dashboard", "data"], answer: "For an overview, start with stat tiles for scanning and a data table for the detail. The Status dashboard recipe shows that pairing.", recipe: "status-dashboard" },
    { words: ["approve", "confirm", "delete", "risk"], answer: "For a consequential action, put the consequence in an alert and the decision in a card with a clear button group. The Confirmation moment recipe shows that pattern.", recipe: "confirmation" },
    { words: ["form", "setup", "onboard", "step"], answer: "Use a guided flow: steps show progress, one field group is visible at a time, and one primary action moves the person forward. The Guided setup recipe shows that pattern.", recipe: "guided-setup" },
  ];
  const FALLBACK = "I can point to components and patterns, or load a recipe. Try asking for a dashboard, a confirmation, or a setup flow.";
  const answerFor = (text) => {
    const t = text.toLowerCase();
    return INTENTS.find((i) => i.words.some((w) => t.includes(w))) || { answer: FALLBACK, recipe: null };
  };
  NS.PAGES["tools/agentic-commands"] = {
    title: "Agentic commands",
    status: "Beta",
    lede: "Compose a demo from a fixed set of components, sample data and assets. Commands run on this page only. Nothing is sent to a model.",
    body: () => `${h2("Command studio")}<div class="ns-guide-split">
<aside><p class="ns-label">Recipes</p><div id="cmd-recipes" style="display:grid;gap:var(--ns-space-2)"></div></aside>
<div>
<label class="ns-label" for="cmd-input">Command</label>
<div style="display:flex;gap:var(--ns-space-3);margin:var(--ns-space-2) 0 var(--ns-space-4)"><input class="ns-input" id="cmd-input" aria-label="Agent command"/><button class="ns-btn" id="cmd-run" type="button">Run command</button></div>
<div id="cmd-resolve" style="display:flex;flex-wrap:wrap;gap:var(--ns-space-2);margin-bottom:var(--ns-space-4)"></div>
<div class="ns-cmd-preview" id="cmd-preview" aria-live="polite"></div>
</div></div>
${h2("Execution trace")}<ol class="ns-steps" id="cmd-trace"></ol>
${h2("Command helper")}<p>A rule based helper on this page. It matches keywords to recipes and does not call a model.</p>
<div class="ns-card"><div id="cmd-chat" aria-live="polite" style="display:grid;gap:var(--ns-space-3);margin-bottom:var(--ns-space-4)"></div>
<form id="cmd-ask" style="display:flex;gap:var(--ns-space-3)"><input class="ns-input" id="cmd-q" placeholder="Ask for a dashboard, a confirmation or a setup flow" aria-label="Ask the command helper"/><button class="ns-btn" type="submit">Send</button></form></div>
${h2("Callable assets")}<p>Name an asset in a command to keep sample content consistent. Select one to make it the active input.</p>
<div id="cmd-assets" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:var(--ns-space-3)"></div>`,
    init: () => {
      const $ = (id) => document.getElementById(id);
      const state = { active: 0, asset: ASSETS[0].name, runs: 0, running: false, messages: [{ q: "What should I use for a decision that cannot be undone?", a: "Use a confirmation moment: a card for context, an alert for the consequence, and a clear button group.", recipe: "confirmation" }] };
      const recipe = () => RECIPES[state.active];
      const drawRecipes = () => {
        $("cmd-recipes").innerHTML = RECIPES.map((r, i) => `<button type="button" class="ns-card" data-recipe="${i}" aria-pressed="${i === state.active}" style="width:100%;text-align:left;cursor:pointer;font:inherit;color:inherit;${i === state.active ? "border-color:var(--ns-focus-field)" : ""}"><strong style="display:block;font:600 var(--ns-type-body2-size)/1.3 var(--ns-font-sans);color:var(--ns-text-primary)">${x(r.name)}</strong><small style="color:var(--ns-text-tertiary)">${x(r.parts.join(" · "))}</small></button>`).join("");
      };
      const drawResolve = () => {
        $("cmd-input").value = recipe().prompt;
        $("cmd-resolve").innerHTML = `<span class="ns-helper">Resolves to</span>${recipe().parts.map((p) => `<span class="ns-tag ns-tag--sm">${x(p)}</span>`).join("")}<span class="ns-tag ns-tag--sm ns-tag--purple">${x(state.asset)}</span>`;
        $("cmd-preview").innerHTML = `<p class="ns-label" style="margin:0">Sample data</p>${recipe().preview}`;
      };
      const drawAssets = () => {
        $("cmd-assets").innerHTML = ASSETS.map((a) => `<button type="button" class="ns-card" data-asset="${x(a.name)}" aria-pressed="${a.name === state.asset}" style="text-align:left;cursor:pointer;font:inherit;color:inherit;${a.name === state.asset ? "border-color:var(--ns-focus-field)" : ""}"><span class="ns-label">${x(a.kind)}</span><strong style="display:block;font:600 var(--ns-type-body2-size)/1.3 var(--ns-font-sans);color:var(--ns-text-primary)">${x(a.name)}</strong><small style="color:var(--ns-text-tertiary)">${x(a.detail)}</small></button>`).join("");
      };
      const drawTrace = (busy) => {
        const steps = ["Read command intent", "Bind recipe", "Attach " + state.asset, "Render preview"];
        $("cmd-trace").innerHTML = steps.map((s, i) => `<li class="${busy && i === steps.length - 1 ? "is-current" : "is-done"}"><b>${String(i + 1).padStart(2, "0")}. ${x(s)}</b></li>`).join("") + `<li><b>Run ${String(state.runs).padStart(3, "0")} ${busy ? "building" : "completed"}</b></li>`;
      };
      const drawChat = () => {
        $("cmd-chat").innerHTML = state.messages.map((m) => `<div><p style="margin:0 0 var(--ns-space-2);font-weight:600;color:var(--ns-text-primary)">${x(m.q)}</p><p style="margin:0 0 var(--ns-space-2);color:var(--ns-text-secondary)">${x(m.a)}</p>${m.recipe ? `<button type="button" class="ns-btn ns-btn--ghost ns-btn--sm" data-load="${m.recipe}">Load demo</button>` : ""}</div>`).join("");
      };
      const drawAll = () => { drawRecipes(); drawResolve(); drawAssets(); drawTrace(false); drawChat(); };
      $("cmd-recipes").addEventListener("click", (e) => { const b = e.target.closest("[data-recipe]"); if (!b) return; state.active = Number(b.dataset.recipe); state.asset = recipe().asset; drawAll(); });
      $("cmd-assets").addEventListener("click", (e) => { const b = e.target.closest("[data-asset]"); if (!b) return; state.asset = b.dataset.asset; drawAll(); });
      $("cmd-chat").addEventListener("click", (e) => { const b = e.target.closest("[data-load]"); if (!b) return; state.active = RECIPES.findIndex((r) => r.id === b.dataset.load); state.asset = recipe().asset; drawAll(); });
      $("cmd-run").addEventListener("click", () => {
        if (state.running) return;
        state.running = true; drawTrace(true);
        setTimeout(() => { state.runs += 1; state.running = false; drawTrace(false); }, 650);
      });
      $("cmd-ask").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = $("cmd-q"); const text = input.value.trim();
        if (!text) return;
        const hit = answerFor(text);
        state.messages.push({ q: text, a: hit.answer, recipe: hit.recipe });
        input.value = "";
        drawChat();
      });
      drawAll();
    },
  };

  /* ---------- Element reference ---------- */
  const ALIASES = {
    button: ["call to action", "submit", "primary button", "ghost button"],
    checkbox: ["check", "tick box", "multi-select option"],
    "date-picker": ["calendar", "date input", "date field"],
    "file-uploader": ["drag and drop", "file input", "attachment", "drop zone"],
    "text-input": ["text field", "form field", "entry field"],
    select: ["dropdown", "picker", "chooser"],
    dropdown: ["menu select", "picker", "single choice list"],
    toggle: ["switch", "on off", "boolean toggle"],
    slider: ["range", "range input"],
    search: ["search field", "filter input", "find"],
    "radio-button": ["option", "single choice"],
    tag: ["keyword", "chip", "filter chip", "topic"],
    badge: ["status badge", "label", "pill", "count"],
    card: ["tile", "panel", "surface", "container"],
    "data-table": ["table", "grid", "list table", "data grid"],
    avatar: ["profile picture", "initials", "user icon"],
    progress: ["progress bar", "loader", "meter"],
    loading: ["skeleton", "spinner", "loading screen", "shimmer"],
    tabs: ["tab bar", "section tabs"],
    breadcrumb: ["breadcrumbs", "location trail", "path"],
    pagination: ["pager", "page controls", "next previous"],
    "side-navigation": ["navigation", "sidebar", "side menu", "nav rail"],
    modal: ["dialog", "popup", "overlay", "lightbox"],
    tooltip: ["hint", "hover tip", "info tip"],
    popover: ["flyout", "floating panel", "context panel"],
    notification: ["toast", "alert", "snackbar", "banner", "message"],
    "alert-banner": ["banner", "inline alert", "warning banner"],
    accordion: ["collapse", "disclosure", "expander"],
    divider: ["separator", "rule", "section break"],
    "icon-button": ["icon only", "glyph button", "more button"],
    link: ["hyperlink", "anchor"],
    menu: ["actions menu", "dropdown menu", "more actions"],
    "bulk-action-bar": ["batch bar", "selection toolbar", "bulk toolbar"],
    textarea: ["multi-line input", "notes field", "description field"],
    combobox: ["autocomplete", "filter list", "multi-select"],
    "number-stepper": ["stepper", "counter input", "quantity"],
    "inline-edit": ["in-place edit", "click to edit"],
    "segmented-control": ["toggle group", "view switcher", "segmented"],
    "tree-view": ["tree", "hierarchy", "nested list"],
    "command-palette": ["search palette", "launcher", "cmd k"],
    toast: ["snackbar", "notification toast", "message"],
    "status-dot": ["status indicator", "dot"],
  };
  const PATTERNS = [
    { name: "Forms", href: "#/patterns/forms", aliases: ["form layout", "input group", "field group"], desc: "Single-column forms that validate on blur and summarize errors on submit." },
    { name: "Create account workflow", href: "#/patterns/create-account", aliases: ["account form", "sign up flow"], desc: "A composed form with entry, validation and a success outcome on one surface." },
    { name: "Modal dialogs", href: "#/patterns/modal-dialogs", aliases: ["dialog", "confirmation", "popup"], desc: "When to interrupt with a dialog, and how to size and label one." },
    { name: "Table views", href: "#/patterns/table-views", aliases: ["table", "filter bar", "bulk actions"], desc: "How search, filters, bulk actions and pagination combine around a table." },
    { name: "Empty states", href: "#/patterns/empty-states", aliases: ["blank state", "zero state", "no results"], desc: "What to show when a view has no content yet, and what to do next." },
    { name: "Loading", href: "#/patterns/loading", aliases: ["skeleton", "spinner", "shimmer"], desc: "Skeletons and spinners for content that is still arriving." },
    { name: "Search and filter", href: "#/patterns/search-filter", aliases: ["filter bar", "faceted filter", "refine"], desc: "Search and filter controls that narrow a data set." },
    { name: "Data visualization", href: "#/data-viz", aliases: ["chart", "graph", "sparkline", "stat tile"], desc: "Charts, sparklines and stat tiles for numeric data." },
  ];
  const FLOORPLANS = [
    { name: "Dashboard", href: "#/floorplans/dashboard", aliases: ["home", "overview page", "summary page"], desc: "Stat tiles, a trend, a mix chart and a table, one job per tile." },
    { name: "Analytical list", href: "#/floorplans/analytical-list", aliases: ["list page", "master list", "index page"], desc: "A searchable, sortable list with filters, bulk actions and pagination." },
    { name: "Object detail", href: "#/floorplans/object-detail", aliases: ["detail page", "record view", "account page"], desc: "A full record with a header, status, tabs and structured sections." },
    { name: "Guided wizard", href: "#/floorplans/wizard", aliases: ["stepper", "multi-step form", "onboarding flow", "setup flow"], desc: "A linear multi-step flow with validation at each step and a review." },
    { name: "Approval queue", href: "#/floorplans/approval-queue", aliases: ["review queue", "task queue", "decision queue"], desc: "A queue of items to approve, escalate or reject, with the reason beside each." },
  ];
  const FOUNDATIONS = [
    { name: "Color", href: "#/foundations/color", aliases: ["palette", "color system", "semantic color"], desc: "Primitive ramps mapped to semantic roles for text, surfaces and status." },
    { name: "Typography", href: "#/foundations/typography", aliases: ["type scale", "font", "heading", "body text"], desc: "The type scale, the text styles and how they map to roles." },
    { name: "Spacing and layout", href: "#/foundations/spacing", aliases: ["margin", "padding", "gap", "spacing scale"], desc: "The spacing scale that governs gaps, padding and rhythm." },
    { name: "Radius", href: "#/foundations/radius", aliases: ["corner", "rounded", "border radius"], desc: "Corner treatments from precise controls to fully rounded status elements." },
    { name: "Elevation", href: "#/foundations/elevation", aliases: ["shadow", "depth", "box shadow"], desc: "Four levels of elevation that show layer depth." },
    { name: "Motion", href: "#/foundations/motion", aliases: ["animation", "transition", "easing", "duration"], desc: "Duration and easing tokens, and the rules for enter and exit." },
    { name: "Iconography", href: "#/foundations/iconography", aliases: ["icon set", "glyphs", "symbols"], desc: "Icon sizes, stroke rules and where the icon set lives." },
    { name: "Themes", href: "#/foundations/themes", aliases: ["dark mode", "light mode", "theme", "color scheme"], desc: "Dark and light themes, and how brand overrides change primitives only." },
    { name: "Tokens", href: "#/foundations/tokens", aliases: ["design tokens", "CSS variables", "custom properties"], desc: "Every token as a CSS custom property, with live values." },
    { name: "Accessibility", href: "#/accessibility", aliases: ["a11y", "WCAG", "screen reader", "focus", "contrast"], desc: "Principles, the checklist and the WCAG mapping for every component." },
  ];
  const ENTRIES = [
    ...NS.COMPONENTS.map((c) => ({ name: c.name, kind: "Component", status: c.status, desc: (c.desc || "").split(". ")[0] + ".", href: "#/components/" + c.id, aliases: ALIASES[c.id] || [] })),
    ...PATTERNS.map((p) => ({ ...p, kind: "Pattern", status: "Stable" })),
    ...FLOORPLANS.map((p) => ({ ...p, kind: "Floorplan", status: "Stable" })),
    ...FOUNDATIONS.map((p) => ({ ...p, kind: "Foundation", status: "Stable" })),
  ].sort((a, b) => a.name.localeCompare(b.name));
  const KINDS = ["All", "Component", "Pattern", "Floorplan", "Foundation"];
  const row = (e) => `<div class="ns-ref-row"><div class="ns-ref-row__name">${x(e.name)}</div><div><p class="ns-ref-row__desc">${x(e.desc)}</p><div class="ns-ref-row__aliases">${e.aliases.map((a) => `<span>${x(a)}</span>`).join("")}</div></div><div class="ns-ref-row__meta"><span class="ns-tag ns-tag--sm">${e.kind}</span><span class="ns-tag ns-tag--sm">${x(e.status)}</span><a href="${e.href}">View</a></div></div>`;
  NS.PAGES["getting-started/element-reference"] = {
    title: "Element reference",
    status: "New",
    lede: "Every named element in the system, with the aliases people actually use. Look up a name, and use it in a request to an agent or a teammate.",
    body: () => `<div style="display:flex;gap:var(--ns-space-3);flex-wrap:wrap;align-items:center;margin-bottom:var(--ns-space-5)"><input class="ns-input" id="ref-q" type="search" placeholder="Search by name or alias" aria-label="Search elements" style="max-width:360px;flex:1 1 240px"/><div class="ns-segmented" role="radiogroup" aria-label="Kind" id="ref-kind">${KINDS.map((k, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-kind="${k}">${k}</button>`).join("")}</div><span id="ref-count" class="ns-helper"></span></div><div id="ref-list"></div><p class="ns-helper" style="margin-top:var(--ns-space-6)">Tip: say the name or any alias when you describe a component to an agent or a teammate.</p>`,
    init: () => {
      let kind = "All", q = "";
      const list = document.getElementById("ref-list");
      const count = document.getElementById("ref-count");
      const input = document.getElementById("ref-q");
      const kinds = document.getElementById("ref-kind");
      const draw = () => {
        const needle = q.trim().toLowerCase();
        const hits = ENTRIES.filter((e) => (kind === "All" || e.kind === kind) && (!needle || e.name.toLowerCase().includes(needle) || e.aliases.some((a) => a.toLowerCase().includes(needle)) || e.desc.toLowerCase().includes(needle)));
        count.textContent = `${hits.length} element${hits.length === 1 ? "" : "s"}`;
        list.innerHTML = hits.length ? hits.map(row).join("") : `<p>No elements match "${x(q)}". Try a shorter term or a common alias.</p>`;
      };
      input.addEventListener("input", () => { q = input.value; draw(); });
      kinds.addEventListener("click", (e) => {
        const b = e.target.closest("[data-kind]"); if (!b) return;
        kind = b.dataset.kind;
        kinds.querySelectorAll("[data-kind]").forEach((n) => n.setAttribute("aria-checked", String(n === b)));
        draw();
      });
      draw();
    },
  };

  /* ---------- Downloads ---------- */
  const FILE_GROUPS = [
    ["Tokens and styles", ["css/tokens.css", "css/components.css", "css/widgets.css", "css/site.css"]],
    ["Components, specs and widgets", ["js/components.js", "js/specs.js", "js/widgets.js"]],
    ["Docs site", ["index.html", "js/ui.js", "js/app.js", "js/pages.js", "js/guides.js", "js/roadmap.js", "js/tools.js", "js/graphics.js", "js/home.js", "js/rays.js"]],
    ["Icons and tooling", ["assets/icons/manifest.json", "tools/figma-sync-check.mjs"]],
  ];
  NS.PAGES["getting-started/downloads"] = {
    title: "Downloads",
    lede: "The source files for the NorthStar design system and docs site. Each file downloads on its own.",
    body: () => `${h2("Source files")}<p>A single ZIP of the set is not built yet, so download the files you need.</p>${FILE_GROUPS.map(([label, files]) => `${h3(label)}<ul>${files.map((f) => `<li><a href="${f}" download><code>${f}</code></a></li>`).join("")}</ul>`).join("")}${h2("Figma library")}<p>The library is invite-only. <a href="${NS.FIGMA}" target="_blank" rel="noopener">Open the NorthStar Figma file</a>.</p>${h2("Run the docs locally")}${codeBlock("python3 -m http.server 8910", "bash")}`,
  };

  /* ---------- Component status ---------- */
  NS.PAGES["getting-started/component-status"] = {
    title: "Component status",
    status: "New",
    lede: "Which components are documented here, and which are linked to a node in the Figma library.",
    body: () => {
      const total = NS.COMPONENTS.length;
      const linked = NS.COMPONENTS.filter((c) => c.figma).length;
      const fresh = NS.COMPONENTS.filter((c) => c.status === "New").length;
      return `${h2("Summary")}${table(["Measure", "Count"], [["Components documented", String(total)], ["Linked to a Figma node", `${linked} of ${total}`], ["Waiting for Figma sync", String(total - linked)], ["Marked New", String(fresh)]])}${notice("info", "What the Figma column means", "A component with no Figma node (<code>figma: null</code> in <code>js/components.js</code>) is built and documented in code first and waits for the next batch sync to the library. Do not claim Figma parity until its node is linked.")}${h2("All components")}${table(["Component", "Category", "Status", "Figma node"], NS.COMPONENTS.map((c) => [`<a href="#/components/${c.id}">${c.name}</a>`, c.cat, c.status, c.figma ? `<code>${c.figma}</code>` : "Waiting for sync"]))}`;
    },
  };

  /* ---------- Content and voice ---------- */
  const VOICE = [
    ["Plain", "Use the words people use in their work. \"Export failed\", not \"Data serialization error\"."],
    ["Specific", "Lead with the object and the number. \"3 accounts need review\", not \"Some items need attention\"."],
    ["Calm", "State the problem and the next step. No exclamation marks, no \"Oops\", no \"Awesome\"."],
  ];
  const TERMS = [
    ["Component", "A reusable UI element with states and rules, such as Button or Toast.", "Component, the component name", "Widget, control (unless the control type is the point)"],
    ["Pattern", "A tested way to solve a recurring task, such as a form or a bulk action.", "Pattern, the pattern name", "Template, recipe"],
    ["Floorplan", "A full page layout built from patterns and components.", "Floorplan", "Screen design, mockup"],
    ["Token", "A named value, such as a color or a spacing step.", "Token, semantic role", "Variable, style (unless you mean the tool)"],
    ["Mode", "A setting on the root element: theme or density.", "Theme, density", "Skin, layout mode"],
    ["Sample data", "Invented names and numbers used to demonstrate a layout.", "Sample data, sample account", "Dummy data, fake data"],
    ["Generated text", "Text written by a model and shown with a label.", "Generated, draft", "AI, bot, chatbot"],
  ];
  const MECHANICS = [
    ["Sentence case", "Buttons, titles, menus and tabs use sentence case: \"Add account\", not \"Add Account\". Product names keep their capitals."],
    ["Numbers and money", "Use numerals for counts and figures: 1,250 and $1,250. Write percentages without a space: 62%."],
    ["Dates and times", "Use a full date in tables and records, such as Oct 6, 2026. Use relative time such as 2h ago only in feeds, with the full date on hover."],
    ["Verb-first buttons", "Name the action and the object: \"Send invoice\", \"Approve request\"."],
    ["Generated text", "Label it, cite its source, and write it as a draft. Say \"Here is a summary\", not \"I have determined\". Never promise an outcome."],
    ["Empty states", "Say why the view is empty and give one next step: \"No accounts yet. Add your first account.\""],
  ];
  NS.PAGES["foundations/content-voice"] = {
    title: "Content and voice",
    status: "New",
    lede: "How NorthStar writes labels, errors, empty states and generated text. Apply these rules to anything a product or this site shows.",
    body: () => `${h2("Voice")}<p>Three traits shape every label, message and empty state.</p>${table(["Trait", "What it means"], VOICE)}${h2("Terms")}<p>Use these words the same way everywhere, and avoid the words in the last column.</p>${table(["Term", "Meaning", "Use", "Avoid"], TERMS)}${h2("Errors")}<p>Say what happened, why, and what to do next. Put the message where the problem is.</p>${NS.dd(
      '<div class="ns-notice ns-notice--error" role="alert"><span class="ns-notice__icon" aria-hidden="true">!</span><div><p class="ns-notice__title">The account could not be saved</p><p class="ns-notice__body">The billing email is missing. Add an email, then save again.</p></div></div>',
      "Name what failed, why, and the next step.",
      '<div class="ns-notice ns-notice--error" role="alert"><span class="ns-notice__icon" aria-hidden="true">!</span><div><p class="ns-notice__title">Error 503</p><p class="ns-notice__body">Oops, something went wrong.</p></div></div>',
      "A code with no cause and no next step, plus an exclamation mark for comfort. Neither helps the person."
    )}${h2("Mechanics")}${table(["Rule", "How to apply it"], MECHANICS)}`,
  };

  /* ---------- Navigation ---------- */
  const group = (name) => NS.NAV.find((g) => g.group === name);
  group("Getting started").items.push(
    ["getting-started/agent-guide", "AI agent guide", "New"],
    ["getting-started/element-reference", "Element reference"],
    ["getting-started/component-status", "Component status", "New"],
    ["getting-started/downloads", "Downloads"]
  );
  group("Live tools").items.push(["tools/agentic-commands", "Agentic commands", "Beta"]);
  group("Foundations").items.push(["foundations/content-voice", "Content and voice", "New"]);
})();
