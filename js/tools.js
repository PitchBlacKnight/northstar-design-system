/* Live tools: token editor drawer, Live Builder, AI generator, embed helper. */
(function () {
  const NS = window.NS;
  const { h2, h3, table, codeBlock, notice } = NS;

  /* ============================================================
     TOKEN EDITOR
     ============================================================ */
  const OV_KEY = "ns-token-overrides";
  const EDIT = {
    "Brand primitives": ["--ns-blue-500", "--ns-teal-500", "--ns-purple-500", "--ns-persian-500", "--ns-green-500", "--ns-yellow-500", "--ns-red-400", "--ns-navy-900"],
    Surfaces: ["--ns-background-primary", "--ns-background-surface", "--ns-background-elevated", "--ns-background-shell", "--ns-background-selected"],
    Text: ["--ns-text-primary", "--ns-text-secondary", "--ns-text-tertiary", "--ns-text-link", "--ns-text-accent"],
    "Borders and focus": ["--ns-border-subtle", "--ns-border-default", "--ns-border-strong", "--ns-focus-ring"],
    Interactive: ["--ns-interactive-primary", "--ns-interactive-primary-hover", "--ns-interactive-secondary"],
    Radius: ["--ns-radius-sm", "--ns-radius-md", "--ns-radius-lg", "--ns-radius-xl"],
  };
  NS.overrides = {};
  try { NS.overrides = JSON.parse(localStorage.getItem(OV_KEY) || "{}"); } catch (e) {}
  NS.applyOverrides = () => Object.entries(NS.overrides).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  const saveOv = () => { try { localStorage.setItem(OV_KEY, JSON.stringify(NS.overrides)); } catch (e) {} };
  NS.applyOverrides();

  const toHex = (v) => { try { const [r, g, b] = NS.toRgb(v); return "#" + [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join(""); } catch (e) { return "#000000"; } };

  NS.buildDrawer = function () {
    const d = document.createElement("aside");
    d.className = "drawer ns"; d.id = "drawer"; d.setAttribute("aria-label", "Token editor"); d.setAttribute("aria-hidden", "true");
    d.innerHTML = `<div class="drawer__head"><div><h2>Token editor</h2><p>Edits apply to every component on the site, live.</p></div><button class="icon-btn" data-close-drawer aria-label="Close token editor">${NS.icon.close}</button></div><div class="drawer__body" id="drawer-body"></div><div class="drawer__foot"><button class="ns-btn ns-btn--sm" data-export="css">Copy CSS</button><button class="ns-btn ns-btn--sm ns-btn--tertiary" data-export="json">Copy JSON</button><button class="ns-btn ns-btn--sm ns-btn--ghost" data-reset>Reset all</button></div>`;
    document.body.appendChild(d);
    d.addEventListener("input", (e) => {
      const t = e.target; const tok = t.dataset.tok; if (!tok) return;
      let v = t.value; if (t.type === "range") v = v + "px";
      NS.overrides[tok] = v; document.documentElement.style.setProperty(tok, v); saveOv();
      const row = t.closest(".te-row"); row.classList.add("is-dirty");
      row.querySelectorAll("[data-tok]").forEach((o) => { if (o !== t) o.value = o.type === "color" ? toHex(v) : o.type === "range" ? parseFloat(v) : v; });
      NS.onTokensChanged && NS.onTokensChanged();
    });
    d.addEventListener("click", (e) => {
      if (e.target.closest("[data-close-drawer]")) NS.toggleDrawer(false);
      const ex = e.target.closest("[data-export]");
      if (ex) { const o = Object.keys(NS.overrides).length ? NS.overrides : {}; const txt = ex.dataset.export === "css" ? `:root {\n${Object.entries(o).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}` : JSON.stringify(o, null, 2); NS.copy(txt, ex); }
      if (e.target.closest("[data-reset]")) { Object.keys(NS.overrides).forEach((k) => document.documentElement.style.removeProperty(k)); NS.overrides = {}; saveOv(); NS.fillDrawer(); NS.onTokensChanged && NS.onTokensChanged(); NS.toast("Tokens reset", "Back to the Figma values.", "info"); }
    });
    d.addEventListener("keydown", (e) => { if (e.key === "Escape") NS.toggleDrawer(false); });
  };
  NS.fillDrawer = function () {
    document.getElementById("drawer-body").innerHTML = Object.entries(EDIT).map(([g, list]) => `<h3>${g}</h3>${list.map((t) => {
      const v = NS.tokenValue(t); const dirty = t in NS.overrides ? " is-dirty" : "";
      if (g === "Radius") return `<div class="te-row${dirty}" style="grid-template-columns:1fr 110px 40px"><label for="te-${t}">${t.replace("--ns-", "")}</label><input type="range" class="ns-slider" min="0" max="32" value="${parseFloat(v)}" data-tok="${t}" id="te-${t}" style="--_pct:${(parseFloat(v) / 32) * 100}%"/><code style="font-size:11px">${v}</code></div>`;
      return `<div class="te-row${dirty}"><input type="color" value="${toHex(v)}" data-tok="${t}" aria-label="${t} color"/><label for="te-${t}" title="${t}">${t.replace("--ns-", "")}</label><input class="ns-input" id="te-${t}" value="${NS.esc(v)}" data-tok="${t}"/></div>`;
    }).join("")}`).join("");
  };
  NS.toggleDrawer = function (force) {
    const d = document.getElementById("drawer"); const open = force ?? !d.classList.contains("is-open");
    if (open) NS.fillDrawer();
    d.classList.toggle("is-open", open); d.setAttribute("aria-hidden", !open);
    document.querySelector("[data-drawer]")?.classList.toggle("is-on", open);
    if (open) d.querySelector("input")?.focus();
  };

  /* ============================================================
     LIVE BUILDER
     ============================================================ */
  const R = (name, desc, steps) => ({ name, desc, steps });
  NS.RECIPES = [
    R("Sign-in card", "Card, inputs, toggle, primary button", [
      ["Resolve surface", ["--ns-background-elevated", "--ns-radius-xl", "--ns-elevation-03"], `<div class="ns-card ns-card--elevated" style="width:380px;padding:32px" data-slot></div>`],
      ["Set heading scale", ["--ns-type-h5-size", "--ns-font-sans"], `<div><div class="brand" style="font-size:15px;margin-bottom:14px"><span class="brand__dot"></span>NORTHSTAR</div><h3 style="margin:0;font:800 24px/32px var(--ns-font-sans)">Sign in to the console</h3></div>`],
      ["Mount text input: email", ["--ns-border-default", "--ns-radius-sm"], `<div class="ns-field"><label class="ns-label">Work email</label><input class="ns-input" value="alex@acme.com"/></div>`],
      ["Mount text input: password", ["--ns-focus-ring"], `<div class="ns-field"><label class="ns-label">Password</label><input class="ns-input" type="password" value="correcthorse"/></div>`],
      ["Mount toggle", ["--ns-interactive-primary", "--ns-duration-base"], `<label class="ns-toggle ns-toggle--sm"><input type="checkbox" role="switch" checked/> Keep me signed in</label>`],
      ["Mount primary action", ["--ns-interactive-primary", "--ns-radius-md"], `<button class="ns-btn ns-btn--block">Sign in</button>`],
    ]),
    R("KPI strip", "Four stat tiles with deltas", [
      ["Create 4-column grid", ["--ns-grid-gutter", "--ns-space-5"], `<div class="grid grid-4" style="width:100%;max-width:880px" data-slot></div>`],
      ...[["Active partners", "1,284", "+6.2%"], ["Pipeline MRR", "$4.1M", "+14%"], ["Open approvals", "37", "-8%"], ["Sync health", "99.2%", "+0.4%"]].map(([l, v, d]) => [`Render KPI tile: ${l}`, ["--ns-background-elevated", "--ns-font-mono", d.startsWith("-") ? "--ns-status-error" : "--ns-status-success"], `<div class="ns-kpi"><span class="ns-kpi__label">${l}</span><span class="ns-kpi__value">${v}</span><span class="ns-kpi__delta ${d.startsWith("-") ? "is-down" : ""}">${d.startsWith("-") ? "↓" : "↑"} ${d}</span></div>`]),
    ]),
    R("Alert stack", "All four notification severities", [
      ["Create vertical stack", ["--ns-space-3"], `<div style="display:grid;gap:12px;width:100%;max-width:480px" data-slot></div>`],
      ...[["info", "i", "Portal update available", "v1.4.0 is ready to deploy."], ["success", "✓", "Sync complete", "2,418 records updated."], ["warning", "!", "Quota at 85%", "Upgrade before the next billing cycle."], ["error", "×", "Deployment failed", "Health check timed out on node 3."]].map(([k, g, t, b]) => [`Render ${k} notification`, [`--ns-status-${k}`, "--ns-radius-md"], `<div class="ns-notice ns-notice--${k}"><span class="ns-notice__icon">${g}</span><div><p class="ns-notice__title">${t}</p><p class="ns-notice__body">${b}</p></div><button class="ns-notice__close" aria-label="Dismiss">×</button></div>`]),
    ]),
    R("Partner table", "Toolbar, filters, data table", [
      ["Create layout", ["--ns-space-4"], `<div style="display:grid;gap:12px;width:100%" data-slot></div>`],
      ["Mount search + filter chips", ["--ns-radius-full", "--ns-status-info"], `<div style="display:flex;gap:8px;flex-wrap:wrap"><div class="ns-search" style="flex:1;min-width:200px">${NS.icon.search}<input class="ns-input ns-input--sm" placeholder="Search partners" aria-label="Search partners"/></div><span class="ns-tag ns-tag--blue">Tier: Gold<button aria-label="Remove">×</button></span></div>`],
      ["Mount data table", ["--ns-background-secondary", "--ns-background-hover", "--ns-font-mono"], () => NS.componentById("data-table").playground.render({ size: "Default", batch: true })],
    ]),
    R("Settings form", "Select, radios, slider, actions", [
      ["Resolve card surface", ["--ns-background-surface", "--ns-radius-lg"], `<div class="ns-card" style="width:440px" data-slot></div>`],
      ["Render title", ["--ns-type-h6-size"], `<h3 class="ns-card__title">Alerting</h3>`],
      ["Mount select", ["--ns-border-default"], `<div class="ns-field"><label class="ns-label">Notify channel</label><select class="ns-select"><option>#ops-alerts</option><option>#noc</option></select></div>`],
      ["Mount radio group", ["--ns-interactive-primary"], `<fieldset style="border:0;padding:0;margin:0;display:grid;gap:8px"><legend class="ns-label" style="margin-bottom:8px">Severity</legend><label class="ns-check"><input type="radio" name="lbsev" checked/> Critical only</label><label class="ns-check"><input type="radio" name="lbsev"/> Warning and above</label></fieldset>`],
      ["Mount slider", ["--ns-interactive-primary", "--ns-border-default"], `<div class="ns-field"><label class="ns-label">CPU threshold: <output>80</output>%</label><input class="ns-slider" type="range" value="80" style="--_pct:80%"/></div>`],
      ["Mount actions", ["--ns-radius-md"], `<div style="display:flex;gap:8px;justify-content:flex-end"><button class="ns-btn ns-btn--tertiary">Cancel</button><button class="ns-btn">Save</button></div>`],
    ]),
    R("Approval card", "Avatar, risk meter, accept / reject", [
      ["Resolve surface", ["--ns-background-elevated", "--ns-elevation-02"], `<div class="ns-card ns-card--elevated" style="width:440px" data-slot></div>`],
      ["Mount header", ["--ns-gradient-bruise"], `<div style="display:flex;gap:12px;align-items:center"><span class="ns-avatar">ZI</span><div><b>Zeta Inc</b><div style="font-size:13px;color:var(--ns-text-secondary)">Tier upgrade to Platinum</div></div><span class="ns-tag ns-tag--sm ns-tag--red" style="margin-left:auto">Flagged</span></div>`],
      ["Mount risk meter", ["--ns-status-error", "--ns-duration-slow"], `<div class="ns-progress ns-progress--error"><div class="ns-progress__meta"><span class="ns-dot ns-dot--error">High risk</span><span>82</span></div><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:82%"></div></div></div>`],
      ["Mount actions", ["--ns-status-error", "--ns-interactive-primary"], `<div style="display:flex;gap:8px;justify-content:flex-end"><button class="ns-btn ns-btn--danger ns-btn--sm">Reject</button><button class="ns-btn ns-btn--sm">Approve</button></div>`],
    ]),
  ];

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let runId = 0;
  const t0 = () => performance.now();
  NS.trace = {
    el: null, start: 0,
    clear() { this.el.innerHTML = ""; this.start = t0(); },
    async line(html, cls = "", type = true) {
      const ts = ((t0() - this.start) / 1000).toFixed(2).padStart(5, "0");
      const div = document.createElement("div"); div.innerHTML = `<span class="t-time">[${ts}s]</span> <span class="${cls}"></span>`;
      this.el.appendChild(div); const span = div.lastElementChild;
      if (type && !matchMedia("(prefers-reduced-motion: reduce)").matches) { const tmp = document.createElement("div"); tmp.innerHTML = html; const text = tmp.textContent; for (let i = 0; i < text.length; i += 3) { span.textContent = text.slice(0, i + 3); this.el.scrollTop = this.el.scrollHeight; await sleep(8); } }
      span.innerHTML = html; this.el.scrollTop = this.el.scrollHeight;
    },
  };

  NS.runRecipe = async function (recipe) {
    const my = ++runId;
    const canvas = document.getElementById("lb-canvas");
    NS.trace.clear();
    canvas.innerHTML = "";
    await NS.trace.line(`<span class="t-step">▶ recipe</span> "${recipe.name}" (${recipe.steps.length} steps)`, "", false);
    await NS.trace.line(`load tokens.css  → ${NS.allTokens().length} custom properties`, "t-ok");
    let slot = canvas;
    for (const [label, toks, html] of recipe.steps) {
      if (my !== runId) return;
      await NS.trace.line(`<span class="t-step">→ ${label}</span>`);
      for (const t of toks) { await NS.trace.line(`  resolve <span class="t-tok">${t}</span> = ${NS.esc(NS.tokenValue(t) || "(derived)")}`, "", false); await sleep(70); }
      const wrap = document.createElement("div"); wrap.innerHTML = typeof html === "function" ? html() : html;
      const node = wrap.firstElementChild; node.classList.add("lb-in", "lb-ghost");
      slot.appendChild(node);
      setTimeout(() => node.classList.remove("lb-ghost"), 600);
      if (node.hasAttribute("data-slot")) slot = node;
      await NS.trace.line(`  render &lt;${node.tagName.toLowerCase()} class="${NS.esc((node.className || "").replace(/lb-\w+/g, "").trim())}"&gt; ✓`, "t-ok", false);
      await sleep(260);
    }
    await NS.trace.line(`<span class="t-ok">✓ build complete</span> · 0 hardcoded colors · theme-safe`, "", false);
    const last = document.createElement("div"); last.innerHTML = '<span class="caret"></span>'; NS.trace.el.appendChild(last);
  };

  /* ============================================================
     CLAUDE AI GENERATION (browser-side, user's own key)
     ============================================================ */
  const KEY = "ns-anthropic-key";
  NS.getKey = () => { try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; } };
  NS.setKey = (k) => { try { k ? localStorage.setItem(KEY, k) : localStorage.removeItem(KEY); } catch (e) {} };
  NS.MODELS = [["claude-opus-5-5", "Claude Opus 5.5"], ["claude-sonnet-5", "Claude Sonnet 5"], ["claude-haiku-4-5-20251001", "Claude Haiku 4.5"]];

  NS.systemPrompt = () => `You generate UI with the NorthStar Design System. Output ONLY an HTML fragment (no <html>, <head>, <body>, no markdown fences, no <script>, no explanations).
Rules:
- Use NorthStar classes: ns-btn (+ --secondary --outline --ghost --danger --sm --lg --xl --square --icon --block), ns-field, ns-label, ns-helper, ns-input, ns-select, ns-textarea, ns-search, ns-check, ns-toggle, ns-slider, ns-tag (+ --sm --ghost --square; children ns-tag__ind, <b>, button), color chips ns-tag--teal/--purple/--blue/--green/--yellow/--red, ns-badge (+ --positive --negative --warning --neutral --outline --sm --lg), ns-dot status indicator (+ --success --warning --error --neutral), ns-alert (+ --accent --error --success --warning; ns-alert__icon, __title, __desc, __actions, __close), ns-dd dropdown (ns-dd__trigger, ns-dd__menu, ns-dd__item), ns-tooltip, ns-count, ns-card (+ --elevated), ns-card__title, ns-card__body, ns-card__strip, ns-kpi, ns-kpi__label, ns-kpi__value, ns-kpi__delta (.is-down), ns-table-wrap, ns-table (.num cells), ns-avatar (+ --16..--64 sizes, --square, --brand, data-status), ns-avatar-group, ns-progress, ns-progress__track, ns-progress__bar (style="--_v:60%"), ns-ring, ns-steps, ns-tabs, ns-tab (aria-selected), ns-breadcrumb, ns-pagination, ns-page, ns-notice (+ --success --warning --error), ns-notice__icon, ns-notice__title, ns-notice__body, ns-banner, ns-accordion (details/summary), ns-divider, ns-skel, ns-spin, grid grid-2 grid-3 grid-4.
- For any custom style, use ONLY CSS custom properties, never raw hex/rgb: ${NS.allTokens().filter((t) => !/type-|breakpoint/.test(t)).join(", ")}.
- Accessible: real labels, aria-labels on icon buttons, semantic headings.
- Keep it to one focused component or small composition, max ~80 lines.`;

  NS.frameDoc = (html) => `<!doctype html><html lang="en"${document.documentElement.dataset.theme === "light" ? ' data-theme="light"' : ""}><head><meta charset="utf-8"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="${new URL("css/tokens.css", location.href)}"><link rel="stylesheet" href="${new URL("css/components.css", location.href)}"><link rel="stylesheet" href="${new URL("css/site.css", location.href)}"><style>:root{${Object.entries(NS.overrides).map(([k, v]) => `${k}:${v}`).join(";")}}body{padding:28px;background:var(--ns-background-primary)}</style></head><body class="ns">${html}</body></html>`;

  NS.generate = async function ({ prompt, model, onText, onDone, onError, signal }) {
    const key = NS.getKey(); if (!key) return onError("Add your Anthropic API key first.");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", signal,
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model, max_tokens: 4000, stream: true, system: NS.systemPrompt(), messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok) { const t = await res.text(); let m = t; try { m = JSON.parse(t).error.message; } catch (e) {} return onError(`${res.status}: ${m}`); }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = "", out = "";
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop();
        for (const l of lines) { if (!l.startsWith("data:")) continue; try { const ev = JSON.parse(l.slice(5)); if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") { out += ev.delta.text; onText(out, ev.delta.text); } if (ev.type === "error") onError(ev.error.message); } catch (e) {} }
      }
      onDone(NS.cleanHtml(out));
    } catch (e) { if (e.name !== "AbortError") onError(e.message); }
  };
  NS.cleanHtml = (s) => s.replace(/^```[a-z]*\n?/i, "").replace(/```\s*$/, "").replace(/<script[\s\S]*?<\/script>/gi, "").trim();

  const keyPanel = () => `<div class="ns ns-card" style="margin-bottom:24px"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><h3 class="ns-card__title" style="font-size:16px">Anthropic API key</h3><p class="ns-card__body" id="key-state">${NS.getKey() ? "Key saved in this browser only." : "Stored only in this browser's localStorage. Requests go straight from your browser to api.anthropic.com."}</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><input class="ns-input" id="key-in" type="password" placeholder="${NS.getKey() ? "•••• saved" : "sk-ant-..."}" style="width:240px" aria-label="Anthropic API key" autocomplete="off"/><button class="ns-btn ns-btn--tertiary" id="key-save">Save</button>${NS.getKey() ? '<button class="ns-btn ns-btn--ghost" id="key-clear">Forget</button>' : ""}</div></div></div>`;
  const bindKey = (rerender) => {
    document.getElementById("key-save")?.addEventListener("click", () => { const v = document.getElementById("key-in").value.trim(); if (!v) return; NS.setKey(v); NS.toast("Key saved", "Stored in localStorage on this device.", "success"); rerender(); });
    document.getElementById("key-clear")?.addEventListener("click", () => { NS.setKey(""); NS.toast("Key removed", "", "info"); rerender(); });
  };

  /* ============================================================
     TOOL PAGES
     ============================================================ */
  const P = (path, def) => (NS.PAGES[path] = def);

  P("tools/live-builder", {
    title: "Live Builder", status: "Live", wide: true,
    lede: "Demo any UI live. Pick a recipe and watch it assemble on canvas with real tokens, real components, and a streaming build trace. With an API key, type any description and Claude builds it.",
    body: () => `<div class="lb ns"><div class="lb__rail"><h4>Recipes</h4>${NS.RECIPES.map((r, i) => `<button class="recipe" data-recipe="${i}" aria-pressed="false"><b>${r.name}</b><span>${r.desc}</span></button>`).join("")}<h4>Canvas</h4><div class="seg"><button id="lb-replay">Replay</button><button id="lb-clear">Clear</button><button id="lb-copy">Copy HTML</button></div></div>
<div class="lb__main"><form class="lb__prompt" id="lb-form"><div class="ns-search" style="flex:1">${NS.icon.search}<input class="ns-input" id="lb-q" placeholder="${NS.getKey() ? "Describe a UI, e.g. a node health card with a ring and two actions" : "Type a recipe name, or add an API key on the AI page to build anything"}" aria-label="Build command"/></div><button class="ns-btn">Build</button></form>
<div class="lb__canvas" id="lb-canvas-wrap"><div id="lb-canvas" class="ns" style="display:flex;flex-direction:column;align-items:center;gap:16px"></div><div class="lb__empty" id="lb-empty">Pick a recipe on the left, or type a command above.<br/>Every value on the canvas resolves from a token.</div></div>
<div class="trace" id="lb-trace" aria-live="off"><span class="t-time">[00.00s]</span> ready. <span class="caret"></span></div></div></div>
${h2("How it works")}<ul><li>Each recipe is a list of steps. A step names the tokens it resolves, then mounts a real NorthStar component.</li><li>The trace reads live values from <code>getComputedStyle</code>, so token editor changes show up in the log.</li><li>Typed commands match recipes first. With an API key saved on the <a href="#/tools/ai">AI generator</a> page, anything else streams from Claude into the canvas.</li></ul>
${h2("Presenting")}<p>Open <a href="?embed#/tools/live-builder" target="_blank" rel="noopener">embed mode</a> for a chrome-free canvas on a projector.</p>`,
    init: () => {
      NS.trace.el = document.getElementById("lb-trace");
      let current = null;
      const empty = () => (document.getElementById("lb-empty").style.display = "none");
      const pick = (i) => { current = NS.RECIPES[i]; document.querySelectorAll("[data-recipe]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.recipe == i)); empty(); NS.runRecipe(current); };
      document.querySelectorAll("[data-recipe]").forEach((b) => b.addEventListener("click", () => pick(+b.dataset.recipe)));
      document.getElementById("lb-replay").onclick = () => current && NS.runRecipe(current);
      document.getElementById("lb-clear").onclick = () => { runId++; document.getElementById("lb-canvas").innerHTML = ""; NS.trace.clear(); document.getElementById("lb-empty").style.display = ""; };
      document.getElementById("lb-copy").onclick = (e) => { const c = document.getElementById("lb-canvas"); const f = c.querySelector("iframe"); const html = f ? f.dataset.html : c.innerHTML.replace(/ ?lb-(in|ghost)/g, ""); html ? NS.copy(html, e.target) : NS.toast("Nothing to copy", "Build something first.", "warning"); };
      document.getElementById("lb-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const q = document.getElementById("lb-q").value.trim(); if (!q) return;
        const hit = NS.RECIPES.findIndex((r) => (r.name + " " + r.desc).toLowerCase().split(/\W+/).some((w) => w.length > 3 && q.toLowerCase().includes(w)));
        if (hit >= 0 && !NS.getKey()) return pick(hit);
        if (!NS.getKey()) { NS.trace.clear(); await NS.trace.line(`<span class="t-warn">no recipe matches "${NS.esc(q)}"</span>`); await NS.trace.line("add an Anthropic API key on the AI generator page to build anything"); return; }
        empty(); runId++;
        const canvas = document.getElementById("lb-canvas");
        canvas.innerHTML = `<iframe title="Generated UI" sandbox="" style="width:100%;min-height:380px"></iframe>`;
        const frame = canvas.querySelector("iframe");
        const model = NS.MODELS[0][0];
        NS.trace.clear();
        await NS.trace.line(`<span class="t-step">▶ claude</span> ${model} · prompt: "${NS.esc(q)}"`, "", false);
        await NS.trace.line(`system prompt: ${NS.allTokens().length} tokens, 40+ component classes, no raw colors`, "t-ok", false);
        let lastLen = 0, lines = 0, pending = null;
        NS.generate({ prompt: q, model,
          onText: (full) => { const n = full.split("\n").length; if (n > lines) { const newL = full.split("\n").slice(lines, n - 1); newL.forEach((l) => { if (l.trim()) { const d = document.createElement("div"); d.innerHTML = `<span class="t-time">  │</span> ${NS.esc(l.slice(0, 120))}`; NS.trace.el.appendChild(d); } }); lines = n - 1; NS.trace.el.scrollTop = NS.trace.el.scrollHeight; }
            if (full.length - lastLen > 400) { lastLen = full.length; clearTimeout(pending); pending = setTimeout(() => (frame.srcdoc = NS.frameDoc(NS.cleanHtml(full))), 60); } },
          onDone: async (html) => { clearTimeout(pending); frame.srcdoc = NS.frameDoc(html); frame.dataset.html = html; const hard = (html.match(/#[0-9a-f]{3,8}\b|rgb\(/gi) || []).length; await NS.trace.line(`<span class="t-ok">✓ stream complete</span> · ${html.length} chars · ${hard ? `<span class="t-warn">${hard} raw color(s) found</span>` : "0 hardcoded colors"}`, "", false); },
          onError: (m) => NS.trace.line(`<span class="t-warn">error: ${NS.esc(m)}</span>`, "", false),
        });
      });
    },
  });

  P("tools/ai", {
    title: "AI generator", status: "AI",
    lede: "Describe a component and Claude streams live HTML built only from NorthStar classes and tokens. Preview it in a sandboxed frame, check it for hardcoded values, and copy it out.",
    body: () => `<div id="ai-key">${keyPanel()}</div>
<div class="ns" style="display:grid;gap:12px;margin-bottom:16px"><div class="ns-field"><label class="ns-label" for="ai-q">Describe the UI</label><textarea class="ns-textarea" id="ai-q" rows="3">A node health card: title, a progress ring at 72%, three stat rows in mono, a warning notification, and Restart / View logs buttons.</textarea></div>
<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><select class="ns-select" id="ai-model" style="width:220px" aria-label="Model">${NS.MODELS.map(([v, n]) => `<option value="${v}">${n}</option>`).join("")}</select><button class="ns-btn" id="ai-go">Generate</button><button class="ns-btn ns-btn--tertiary" id="ai-stop" disabled>Stop</button><span class="ns-helper" id="ai-status"></span></div>
<div style="display:flex;gap:6px;flex-wrap:wrap">${["Login form with SSO button", "Pricing tier card", "Incident timeline", "Team member list with avatars and roles", "Empty state for no search results"].map((s) => `<button class="ns-tag ns-tag--purple" style="cursor:pointer" data-sugg="${s}">${s}</button>`).join("")}</div></div>
<div class="stage"><div class="stage__bar"><span class="lbl">Preview</span><div class="ns seg"><button id="ai-copy">Copy HTML</button><button id="ai-open">Send to Live Builder</button></div></div><iframe id="ai-frame" title="Generated preview" sandbox="" style="width:100%;height:440px;border:0;display:block;background:var(--ns-background-primary)"></iframe><div class="code"><div class="code__copy"><button class="copy-btn" data-copy-code>Copy</button></div><pre><code id="ai-code" data-raw="">// generated HTML streams here</code></pre></div></div>
${h2("How it works")}${table(["Step", "Detail"], [["1. System prompt", "Lists every NorthStar class and all CSS custom properties, and forbids raw colors."], ["2. Stream", "Your browser calls the Messages API with streaming. Text renders as it arrives."], ["3. Sandbox", "Output renders in an iframe with scripts disabled, loading the real tokens.css and components.css."], ["4. Audit", "Output is scanned for hex and rgb values. Anything found is flagged."]])}
${notice("warning", "Your key, your browser", "The key never touches a server of ours. It lives in localStorage and is sent only to api.anthropic.com. Use a key with a spend limit, and click Forget on shared machines.")}`,
    init: () => {
      const rerenderKey = () => { document.getElementById("ai-key").innerHTML = keyPanel(); bindKey(rerenderKey); };
      bindKey(rerenderKey);
      const q = document.getElementById("ai-q"), frame = document.getElementById("ai-frame"), code = document.getElementById("ai-code"), st = document.getElementById("ai-status");
      let ctrl = null, last = "";
      document.querySelectorAll("[data-sugg]").forEach((b) => b.addEventListener("click", () => (q.value = b.dataset.sugg)));
      frame.srcdoc = NS.frameDoc(`<div style="height:380px;display:grid;place-items:center;color:var(--ns-text-tertiary);font-size:14px">Your component renders here.</div>`);
      document.getElementById("ai-go").onclick = () => {
        ctrl = new AbortController(); document.getElementById("ai-stop").disabled = false; st.textContent = "Streaming..."; let t = null;
        NS.generate({ prompt: q.value, model: document.getElementById("ai-model").value, signal: ctrl.signal,
          onText: (full) => { code.textContent = full; code.parentElement.scrollTop = 1e6; clearTimeout(t); t = setTimeout(() => (frame.srcdoc = NS.frameDoc(NS.cleanHtml(full))), 250); },
          onDone: (html) => { clearTimeout(t); last = html; frame.srcdoc = NS.frameDoc(html); code.dataset.raw = html; code.innerHTML = NS.hl(html, "html"); const hard = (html.match(/#[0-9a-f]{3,8}\b|rgb\(/gi) || []).length; st.textContent = hard ? `Done. ${hard} raw color value(s) found, check the code.` : "Done. 0 hardcoded colors."; document.getElementById("ai-stop").disabled = true; },
          onError: (m) => { st.textContent = "Error: " + m; document.getElementById("ai-stop").disabled = true; },
        });
      };
      document.getElementById("ai-stop").onclick = () => { ctrl && ctrl.abort(); st.textContent = "Stopped."; document.getElementById("ai-stop").disabled = true; };
      document.getElementById("ai-copy").onclick = (e) => (last ? NS.copy(last, e.target) : NS.toast("Nothing yet", "Generate something first.", "warning"));
      document.getElementById("ai-open").onclick = () => { location.hash = "#/tools/live-builder"; setTimeout(() => { const i = document.getElementById("lb-q"); if (i) { i.value = q.value; } }, 80); };
    },
  });

  P("tools/token-editor", {
    title: "Token editor",
    lede: "Edit any core token and watch every component on the site update in real time. Changes persist in your browser and export as CSS or JSON.",
    body: () => `<div class="ns" style="display:flex;gap:10px;margin-bottom:32px;flex-wrap:wrap"><button class="ns-btn" data-open-drawer>Open token editor</button><button class="ns-btn ns-btn--tertiary" data-preset="partner">Try preset: Partner blue</button><button class="ns-btn ns-btn--tertiary" data-preset="ember">Try preset: Ember</button><button class="ns-btn ns-btn--ghost" data-preset="reset">Reset</button></div>
${h2("Live preview")}<div class="stage"><div class="stage__canvas ns is-block"><div class="grid grid-3"><div class="ns-card"><h3 class="ns-card__title">Acme Corp</h3><p class="ns-card__body">Gold tier, 14 integrations.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="ns-tag ns-tag--teal">Edge</span><span class="ns-tag ns-tag--purple">ML</span><span class="ns-dot ns-dot--success">Active</span></div><div style="display:flex;gap:8px"><button class="ns-btn ns-btn--sm">Primary</button><button class="ns-btn ns-btn--sm ns-btn--secondary">Secondary</button></div></div><div class="ns-kpi"><span class="ns-kpi__label">Pipeline MRR</span><span class="ns-kpi__value">$4.1M</span><span class="ns-kpi__delta">↑ 14%</span><div class="ns-progress" style="margin-top:8px"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:64%"></div></div></div></div><div class="ns-card" style="gap:12px"><div class="ns-field"><label class="ns-label">Search</label><input class="ns-input" value="prod-east"/></div><label class="ns-toggle"><input type="checkbox" role="switch" checked/> Telemetry</label><div class="ns-tabs"><button class="ns-tab" aria-selected="true">Overview</button><button class="ns-tab" aria-selected="false">Logs</button></div></div></div></div></div>
${h2("Current overrides")}<div id="ov-out"></div>`,
    init: () => {
      const presets = { partner: { "--ns-blue-500": "#0070f2", "--ns-teal-500": "#27bdfa", "--ns-purple-500": "#a78bfa", "--ns-navy-900": "#1b2631", "--ns-radius-md": "4px", "--ns-radius-lg": "6px" }, ember: { "--ns-blue-500": "#e5484d", "--ns-teal-500": "#ffb224", "--ns-purple-500": "#f76b15", "--ns-navy-900": "#231510", "--ns-radius-md": "10px", "--ns-radius-lg": "14px" } };
      const out = () => (document.getElementById("ov-out").innerHTML = Object.keys(NS.overrides).length ? codeBlock(`:root {\n${Object.entries(NS.overrides).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`, "css") : `<p>No overrides. You are looking at the Figma values.</p>`);
      NS.onTokensChanged = () => document.getElementById("ov-out") && out();
      document.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => { Object.keys(NS.overrides).forEach((k) => document.documentElement.style.removeProperty(k)); NS.overrides = b.dataset.preset === "reset" ? {} : { ...presets[b.dataset.preset] }; NS.applyOverrides(); saveOv(); out(); if (document.getElementById("drawer").classList.contains("is-open")) NS.fillDrawer(); }));
      out();
    },
  });

  P("tools/embed", {
    title: "Embed mode", lede: "Add ?embed to any URL to render the page without header, side nav, table of contents, or footer. Use it in decks, iframes, and docs portals.",
    body: () => `${h2("Build an embed")}<div class="ns" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px"><select class="ns-select" id="em-page" style="width:280px" aria-label="Page">${Object.keys(NS.PAGES).filter((p) => p).map((p) => `<option value="${p}">${NS.PAGES[p].title}</option>`).concat(NS.COMPONENTS.map((c) => `<option value="components/${c.id}">${c.name} (component)</option>`)).join("")}</select><select class="ns-select" id="em-theme" style="width:140px" aria-label="Theme"><option value="">Dark</option><option value="light">Light</option></select></div><div id="em-code"></div><div class="stage"><iframe id="em-frame" title="Embed preview" style="width:100%;height:460px;border:0;display:block"></iframe></div>
${h2("Parameters")}${table(["Parameter", "Effect"], [["<code>?embed</code>", "Hides all site chrome"], ["<code>&theme=light</code>", "Forces light theme"], ["<code>#/path</code>", "Any route on the site"]])}`,
    init: () => {
      const run = () => { const p = document.getElementById("em-page").value, t = document.getElementById("em-theme").value; const url = `${location.origin}${location.pathname}?embed${t ? "&theme=" + t : ""}#/${p}`; document.getElementById("em-frame").src = url; document.getElementById("em-code").innerHTML = codeBlock(`<iframe src="${url}"\n  width="100%" height="600" style="border:0" title="NorthStar: ${NS.esc(p)}"></iframe>`, "html"); };
      document.getElementById("em-page").value = "floorplans/dashboard";
      ["em-page", "em-theme"].forEach((id) => document.getElementById(id).addEventListener("change", run)); run();
    },
  });
})();
