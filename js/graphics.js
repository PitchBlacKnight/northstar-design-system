/* Graphics framework docs: overview, gallery, one page per widget family, widget board builder.
   Source: Figma page "Widgets" (427:8676). */
(function () {
  const NS = window.NS;
  const { h2, h3, table, codeBlock, notice, cards } = NS;
  const FIG = (node) => `${NS.FIGMA}?node-id=${node.replace(":", "-")}`;
  const famName = (f) => NS.FAMILIES.find((x) => x[0] === f)[1];

  /* Nav: replace "Data visualization" with the Graphics framework group */
  const gi = NS.NAV.findIndex((g) => g.group === "Data visualization");
  NS.NAV[gi] = { group: "Graphics framework", items: [["graphics", "Overview"], ["graphics/gallery", "Widget gallery", String(NS.WIDGETS.length)], ...NS.FAMILIES.map(([k, n]) => ["graphics/" + k, n]), ["graphics/board", "Board builder", "Tool"], ["data-viz/charts", "Chart types"], ["data-viz/palettes", "Color palettes"], ["data-viz/sankey", "Sankey chart"]] };

  const code = (w) => { const o = Object.entries(w.opts).map(([k, v]) => ` data-${k}="${v}"`).join(""); return `<!-- ${w.figma} (${w.nodeId}) -->\n<div data-ns-widget="${w.name}"${o}></div>\n<script>NS.hydrate();</script>`; };
  const fig = (w, i) => `<figure data-fam="${w.fam}" data-size="${w.size}" data-q="${(w.figma + " " + w.name).toLowerCase()}">${NS.widget(w.name, w.opts)}<figcaption><b>${w.figma.replace(/^Widget \/ /, "")}</b><br>${w.size} · ${w.w}×${w.h} · <a href="${FIG(w.nodeId)}" target="_blank" rel="noopener">${w.nodeId}</a> · <a href="#" data-wcopy="${i}">copy</a></figcaption></figure>`;
  document.addEventListener("click", (e) => { const c = e.target.closest("[data-wcopy]"); if (c) { e.preventDefault(); NS.copy(code(NS.WIDGETS[+c.dataset.wcopy]), c, "copied"); } });

  const P = (path, def) => (NS.PAGES[path] = def);

  /* ---------- Overview ---------- */
  P("graphics", {
    title: "Graphics framework", status: "New", figma: true,
    lede: `A widget system for dashboards: ${NS.WIDGETS.length} widgets in ${NS.FAMILIES.length} families, three sizes, one shell, and interchangeable tables. Everything renders from tokens, so every widget follows theme and token edits.`,
    body: () => `
<div class="whero"><div class="brand"><span class="brand__dot"></span>NORTHSTAR</div><h2>Widgets</h2><p>Circle, line, combined circle, column, and bubble charts, plus timelines, compound rings, summaries, tables, and informers. Pulled 1:1 from the Figma Widgets page.</p></div>
${h2("Families")}<div class="grid grid-4">${NS.FAMILIES.map(([k, n, d, ic]) => `<a class="rcard" href="#/graphics/${k}"><span class="rcard__icon" aria-hidden="true">${ic}</span><h3 style="font-size:16px;line-height:22px">${n}</h3><p>${d}</p><span class="go">${NS.WIDGETS.filter((w) => w.fam === k).length} widgets →</span></a>`).join("")}</div>
${h2("Anatomy")}<div class="grid grid-2" style="align-items:start"><div class="wstage" style="display:grid;place-items:center">${NS.widget("big-lines", { table: "indicator" })}</div><div>${table(["Part", "Spec"], [["Shell", "<code>widget-bg</code> (navy/900), <code>widget-radius</code> 12px, 24px padding, inner 1px highlight <code>widget-shadow</code>"], ["Title", "Body 1, 16/24 (M) or Body / Title, 20/32 (L)"], ["Value", "Open Sans ExtraBold, 28 to 48px"], ["Delta", "Body 2 with triangle, <code>status-success</code> or <code>status-error</code>"], ["Comparison", "Caption 12/16, <code>text-secondary</code>"], ["Chart", "SVG. Gradients from Purple, Light Bruise, Blue, and Orange presets"], ["Table", "Optional: simple, progress, dynamic, indicator, or classic"]])}</div></div>
${h2("Size system")}${table(["Size", "Widths", "Use"], [["S", "96, 116", "Sparklines and single rings in dense rails"], ["M", "268, 290, 294, 346, 422", "Standard dashboard tile. Stack a table under it."], ["L", "539, 573, 576, 708, 870, 1070", "Primary charts with axes and legends"], ["Full", "1800", "Timeline strips across the top of a board"]])}
<p>Widgets keep their Figma width as a max and shrink to fit on smaller screens.</p>
${h2("Widget tokens")}${table(["Token", "Value", "Role"], ["widget-bg", "widget-inset", "widget-track", "widget-band", "widget-grid", "widget-muted", "widget-radius", "widget-shadow", "gradient-purple", "gradient-bubble"].map((t) => [`<code>--ns-${t}</code>`, `<code>${NS.esc(NS.tokenValue("--ns-" + t))}</code>`, { "widget-bg": "Shell fill", "widget-inset": "Inset stat boxes", "widget-track": "Ring and bar tracks", "widget-band": "Alternating month bands", "widget-grid": "Gridlines", "widget-muted": "Axis labels, secondary columns (purple/300)", "widget-radius": "Shell radius", "widget-shadow": "Inner highlight (Figma: Widget shadow)", "gradient-purple": "Primary series", "gradient-bubble": "Secondary series" }[t]]))}
${h2("Use in code")}<p>Load <code>widgets.css</code> and <code>widgets.js</code>, drop a placeholder, and hydrate. Or call the renderer directly.</p>${codeBlock('<link rel="stylesheet" href="css/tokens.css">\n<link rel="stylesheet" href="css/widgets.css">\n<script src="js/widgets.js"></script>\n\n<div data-ns-widget="circle-table" data-table="simple"></div>\n<div data-ns-widget="column-L"></div>\n<script>NS.hydrate();</script>', "html")}${codeBlock("// or render to a string\nconst html = NS.widget('combined-table', { table: 'indicator' });\n\n// low-level chart primitives\nNS.charts.ring({ size: 96, arcs: [{ v: 28, g: 'green' }, { v: 61, g: 'purple' }] });", "js")}`,
  });

  /* ---------- Gallery ---------- */
  P("graphics/gallery", {
    title: "Widget gallery", wide: true,
    lede: `Every widget symbol from the Figma Widgets page, live. Filter by family or size, search by Figma name, copy the code, or jump to the node in Figma.`,
    body: () => `<div class="ns" style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px"><div class="ns-search" style="flex:1;min-width:220px">${NS.icon.search}<input class="ns-input" id="wg-q" type="search" placeholder="Search, e.g. indicator table, bubble, 565:5" aria-label="Search widgets"/></div><div class="seg" id="wg-size">${["All", "S", "M", "L"].map((z, i) => `<button data-z="${z}" aria-pressed="${i === 0}">${z}</button>`).join("")}</div></div><div class="ns seg" id="wg-fam" style="margin-bottom:12px"><button data-f="all" aria-pressed="true">All families</button>${NS.FAMILIES.map(([k, n]) => `<button data-f="${k}" aria-pressed="false">${n}</button>`).join("")}</div><p id="wg-count" style="color:var(--ns-text-tertiary);font-size:13px"></p><div class="wstage"><div class="wgal" id="wg">${NS.WIDGETS.map(fig).join("")}</div></div>`,
    init: () => {
      let f = "all", z = "All";
      const run = () => { const q = document.getElementById("wg-q").value.toLowerCase(); let n = 0; document.querySelectorAll("#wg figure").forEach((el) => { const on = (f === "all" || el.dataset.fam === f) && (z === "All" || el.dataset.size === z) && el.dataset.q.includes(q) || (q && el.innerHTML.includes(q) && (f === "all" || el.dataset.fam === f)); el.style.display = on ? "" : "none"; n += on; }); document.getElementById("wg-count").textContent = `${n} of ${NS.WIDGETS.length} widgets`; };
      document.getElementById("wg-q").addEventListener("input", run);
      document.querySelectorAll("#wg-fam button").forEach((b) => b.addEventListener("click", () => { f = b.dataset.f; document.querySelectorAll("#wg-fam button").forEach((x) => x.setAttribute("aria-pressed", x === b)); run(); }));
      document.querySelectorAll("#wg-size button").forEach((b) => b.addEventListener("click", () => { z = b.dataset.z; document.querySelectorAll("#wg-size button").forEach((x) => x.setAttribute("aria-pressed", x === b)); run(); }));
      run();
    },
  });

  /* ---------- Family pages ---------- */
  const GUIDE = {
    circle: { when: ["A single percentage or completion value that matters on its own.", "Pair with a table when the total breaks down into categories."], whenNot: ["Comparing several values: use a column chart.", "Values without a meaningful 100%."], data: "One value from 0 to 100. Tables show up to 9 rows." },
    line: { when: ["Trends over time, especially two series compared.", "S-size sparklines in rails next to a number."], whenNot: ["Fewer than 5 points: use a column chart.", "Part-to-whole: use a combined circle."], data: "7 to 12 points per series, max two series in M, three in L." },
    combined: { when: ["Splitting one total into two parts (for example new vs returning).", "Concentric doubles for plan vs actual."], whenNot: ["More than two parts: use a compound circular chart or donut."], data: "Two values that add up to the total shown in the center." },
    column: { when: ["Comparing periods or categories side by side.", "Paired capsules for two related measures per period."], whenNot: ["Continuous trends with many points: use a line chart."], data: "7 to 34 columns. Two segments per column, bottom is the primary measure." },
    bubble: { when: ["Three dimensions at once: time, value, and magnitude.", "Spotting outliers and clusters."], whenNot: ["Precise comparison: bubble area is hard to read exactly. Add labels or a table."], data: "Up to 30 bubbles in L, 16 in M. Label the three largest." },
    other: { when: ["Compound circular: up to five limits against one metric.", "Timeline: a full-width strip that frames a board.", "Summary: a status table with segmented progress.", "Temperature: density across four buckets."], whenNot: ["Do not put more than one L-size widget from this family in the same row."], data: "See each widget for its limits." },
    table: { when: ["Attach under any M-size chart to explain the number.", "Simple: category totals. Progress: goal completion. Dynamic: change. Indicator: ranked change with arrows. Classic: multi-column."], whenNot: ["More than 11 rows: link to a full data table."], data: "Simple up to 9 rows, indicator up to 11, progress and dynamic up to 4." },
    informer: { when: ["The headline number of a board.", "Composite: pair the headline with two to six supporting stats."], whenNot: ["Numbers that need a trend to make sense: use a line or column widget."], data: "One primary value, one comparison, up to three inset stat pairs." },
  };
  NS.FAMILIES.forEach(([k, n, d]) => {
    const ws = NS.WIDGETS.map((w, i) => [w, i]).filter(([w]) => w.fam === k);
    P("graphics/" + k, {
      title: n, lede: d + ` ${ws.length} widgets on the Figma Widgets page.`, figma: true,
      body: () => {
        const g = GUIDE[k];
        const tableCapable = ws.some(([w]) => w.opts.table);
        return `${h2("Live demo")}<div class="stage" id="fam-pg"><div class="stage__bar"><span class="lbl">Playground</span><div class="ns seg"><a class="copy-btn" href="${FIG(ws[0][0].nodeId)}" target="_blank" rel="noopener" id="fam-fig">Open in Figma ↗</a></div></div><div class="stage__split"><div class="stage__canvas ns" id="fam-canvas" style="min-height:320px"></div><div class="stage__controls"><div class="ns-field"><label class="ns-label" for="fam-sel">Variant</label><select class="ns-select" id="fam-sel">${ws.map(([w, i]) => `<option value="${i}">${w.figma.replace(/^Widget \/ |^Table \/ |^Chart \/ /, "")}</option>`).join("")}</select></div>${tableCapable ? `<div><h4>Table</h4><div class="seg" id="fam-tbl">${["none", "simple", "progress", "dynamic", "indicator"].map((t) => `<button data-t="${t}" aria-pressed="false">${t}</button>`).join("")}</div></div>` : ""}<div><h4>Data</h4><div class="seg"><button id="fam-shuffle">Shuffle</button></div></div><p class="ns-helper" id="fam-meta"></p></div></div><div class="code"><div class="code__copy"><button class="copy-btn" data-copy-code>Copy</button></div><pre><code id="fam-code" data-raw=""></code></pre></div></div>
${h2("All variants")}<div class="wstage"><div class="wgal">${ws.map(([w, i]) => fig(w, i)).join("")}</div></div>
${h2("When to use")}<ul>${g.when.map((t) => `<li>${t}</li>`).join("")}</ul>${h3("When not to use")}<ul>${g.whenNot.map((t) => `<li>${t}</li>`).join("")}</ul>
${h2("Data guidance")}<p>${g.data}</p>
${h2("Accessibility")}<ul><li>Every chart SVG has <code>role="img"</code> and an <code>aria-label</code> summarizing the value.</li><li>Pair charts with the value in text (the KPI block) so the number is never chart-only.</li><li>Up and down arrows in indicator tables carry an accessible name, and the delta text repeats the direction.</li></ul>`;
      },
      init: () => {
        let cur = ws[0][1], tbl = null, seed = 0;
        const run = () => { const w = NS.WIDGETS[cur]; const o = { ...w.opts, seed: 5 + seed }; if (tbl !== null) { if (tbl === "none") delete o.table; else o.table = tbl; } document.getElementById("fam-canvas").innerHTML = NS.widget(w.name, o); const c = { ...w, opts: Object.fromEntries(Object.entries(o).filter(([k]) => k !== "seed" || seed)) }; const src = code(c); const el = document.getElementById("fam-code"); el.dataset.raw = src; el.innerHTML = NS.hl(src, "html"); document.getElementById("fam-meta").textContent = `${w.figma} · ${w.w}×${w.h} · node ${w.nodeId}`; document.getElementById("fam-fig").href = FIG(w.nodeId); document.querySelectorAll("#fam-tbl button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.t === (o.table || "none"))); };
        document.getElementById("fam-sel").addEventListener("change", (e) => { cur = +e.target.value; tbl = null; run(); });
        document.querySelectorAll("#fam-tbl button").forEach((b) => b.addEventListener("click", () => { tbl = b.dataset.t; run(); }));
        document.getElementById("fam-shuffle").addEventListener("click", () => { seed++; run(); });
        run();
      },
    });
  });

  /* ---------- Board builder ---------- */
  const BKEY = "ns-board";
  const loadBoard = () => { try { return JSON.parse(localStorage.getItem(BKEY) || "null") || [36, 7, 60, 4, 25]; } catch (e) { return [36, 7, 60, 4, 25]; } };
  P("graphics/board", {
    title: "Board builder", status: "Live", wide: true,
    lede: "Compose a dashboard from widgets. Add, reorder, and remove tiles, then copy the board as HTML. The board saves in this browser and follows theme and token edits.",
    body: () => `<div class="ns" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;align-items:end"><div class="ns-field" style="min-width:320px;flex:1"><label class="ns-label" for="bd-add">Add widget</label><select class="ns-select" id="bd-add">${NS.FAMILIES.map(([k, n]) => `<optgroup label="${n}">${NS.WIDGETS.map((w, i) => [w, i]).filter(([w]) => w.fam === k).map(([w, i]) => `<option value="${i}">${w.figma.replace(/^Widget \/ |^Table \/ |^Chart \/ /, "")}</option>`).join("")}</optgroup>`).join("")}</select></div><button class="ns-btn" id="bd-go">Add to board</button><button class="ns-btn ns-btn--outline" id="bd-copy">Copy HTML</button><button class="ns-btn ns-btn--ghost" id="bd-reset">Reset</button><a class="ns-btn ns-btn--ghost" href="?embed#/graphics/board" target="_blank" rel="noopener">Present ↗</a></div><div class="wstage" style="background:var(--ns-black)"><div class="wgal" id="bd"></div></div><p class="ns-helper">Hover a tile to move or remove it.</p>`,
    init: () => {
      let b = loadBoard();
      const save = () => { try { localStorage.setItem(BKEY, JSON.stringify(b)); } catch (e) {} };
      const draw = () => { document.getElementById("bd").innerHTML = b.map((i, k) => { const w = NS.WIDGETS[i]; return w ? `<figure style="position:relative">${NS.widget(w.name, w.opts)}<figcaption style="display:flex;gap:6px"><button class="copy-btn" data-bd="l" data-k="${k}" aria-label="Move left">←</button><button class="copy-btn" data-bd="r" data-k="${k}" aria-label="Move right">→</button><button class="copy-btn" data-bd="x" data-k="${k}" aria-label="Remove">Remove</button></figcaption></figure>` : ""; }).join("") || `<p style="color:var(--ns-text-tertiary)">Empty board. Add a widget above.</p>`; };
      document.getElementById("bd").addEventListener("click", (e) => { const t = e.target.closest("[data-bd]"); if (!t) return; const k = +t.dataset.k; if (t.dataset.bd === "x") b.splice(k, 1); if (t.dataset.bd === "l" && k > 0) [b[k - 1], b[k]] = [b[k], b[k - 1]]; if (t.dataset.bd === "r" && k < b.length - 1) [b[k + 1], b[k]] = [b[k], b[k + 1]]; save(); draw(); });
      document.getElementById("bd-go").onclick = () => { b.push(+document.getElementById("bd-add").value); save(); draw(); };
      document.getElementById("bd-reset").onclick = () => { b = [36, 7, 60, 4, 25]; save(); draw(); };
      document.getElementById("bd-copy").onclick = (e) => NS.copy(`<div style="display:flex;flex-wrap:wrap;gap:20px">\n${b.map((i) => { const w = NS.WIDGETS[i]; return `  <div data-ns-widget="${w.name}"${Object.entries(w.opts).map(([k, v]) => ` data-${k}="${v}"`).join("")}></div>`; }).join("\n")}\n</div>\n<script>NS.hydrate();</script>`, e.target);
      draw();
    },
  });

  /* ---------- Chart types: add Figma 01 Components chart descriptions ---------- */
  const base = NS.PAGES["data-viz/charts"].body;
  NS.PAGES["data-viz/charts"].body = () => `${h2("Chart components")}<p>From the Figma components page. All five share the variant axes <code>Size</code> (S, M, L), <code>Data</code> (Minimum, Maximum), and <code>Background</code> (Yes, No).</p>${table(["Component", "Guidance"], [["Line chart", "Responsive line chart for time-series and trend comparison. Use semantic data colors and provide accessible summaries."], ["Bar chart", "Vertical bar chart for categorical comparison. Start axes at zero and keep category labels readable."], ["Horizontal bar chart", "Horizontal bar chart for ranked categories and long labels. Use consistent scale and sorting."], ["Donut chart", "Donut chart for part-to-whole comparison with a small number of categories. Pair with values and labels."], ["Sankey chart", "Sankey chart for directional flow and volume relationships. Provide a tabular alternative for accessibility."]])}${h2("Horizontal bar")}${NS.stage(`<div style="display:grid;gap:10px;width:100%;max-width:520px">${[["Enterprise", 92], ["Mid-market", 71], ["Public sector", 54], ["SMB", 38], ["Education", 21]].map(([l, p], i) => `<div style="display:grid;grid-template-columns:110px 1fr 40px;gap:12px;align-items:center;font-size:13px"><span>${l}</span><div style="height:10px;border-radius:5px;background:var(--ns-widget-track)"><div style="height:100%;width:${p}%;border-radius:5px;background:var(--ns-viz-${i + 1})"></div></div><span style="font-family:var(--ns-font-mono);color:var(--ns-text-secondary)">${p}</span></div>`).join("")}</div>`, { code: false, label: "Ranked, sorted descending" })}${base()}`;

  /* Live Builder: widget recipe */
  NS.RECIPES && NS.RECIPES.push({ name: "Widget board", desc: "Graphics framework: KPI, rings, columns, bubbles", steps: [["Create board", ["--ns-black", "--ns-space-5"], `<div class="wgal" style="justify-content:center" data-slot></div>`], ["Mount informer", ["--ns-widget-bg", "--ns-widget-radius", "--ns-widget-shadow"], () => NS.widget("index-composite", { rows: 1 })], ["Mount circle chart + table", ["--ns-gradient-purple", "--ns-widget-track", "--ns-widget-muted"], () => NS.widget("circle-table", { table: "simple" })], ["Mount column chart", ["--ns-teal-500", "--ns-violet-600"], () => NS.widget("column-M", { table: "progress" })], ["Mount bubble chart", ["--ns-gradient-bubble", "--ns-widget-band"], () => NS.widget("bubble-M", {})]] });
})();
