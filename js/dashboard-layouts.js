/* Dashboard layouts: 24 full-screen layout recipes plus the chart parts they use.
   Layouts are static pages in dashboards/ built on css/dashboards.css and js/dashboards.js (NS.dash).
   The docs show each one in a scaled frame. Data in every layout is placeholder. */
(function () {
  const NS = window.NS;
  const { h2, h3, table, codeBlock, notice } = NS;
  const P = (path, def) => (NS.PAGES[path] = def);
  const LAYOUTS = [
 {
  "id": "campaign-command",
  "num": "01",
  "name": "Campaign command",
  "group": "General",
  "theme": "dark",
  "summary": "One hero metric over a full-height trend, with channel, funnel and hour-pattern tiles.",
  "use": "Marketing and paid media performance.",
  "cols": "repeat(12, 1fr)",
  "rows": "repeat(3, 1fr)",
  "parts": [
   "area",
   "bars",
   "bullet",
   "heat",
   "ring",
   "spark"
  ],
  "fills": [
   "blue",
   "teal"
  ]
 },
 {
  "id": "launch-day-live",
  "num": "02",
  "name": "Launch day live",
  "group": "General",
  "theme": "dark",
  "summary": "Dot-matrix map as the hero, reach rings, a live feed and a timeline.",
  "use": "Real-time event or release monitoring.",
  "cols": "repeat(12, 1fr)",
  "rows": "repeat(3, 1fr)",
  "parts": [
   "bars",
   "dotmap",
   "rings",
   "spark"
  ],
  "fills": [
   "bruise",
   "teal"
  ]
 },
 {
  "id": "portfolio",
  "num": "03",
  "name": "Portfolio",
  "group": "General",
  "theme": "dark",
  "summary": "An inverted summary column against a performance chart, with holdings, candles and cash flow.",
  "use": "Finance, accounts and holdings.",
  "cols": "repeat(12, 1fr)",
  "rows": "repeat(3, 1fr)",
  "parts": [
   "area",
   "bullet",
   "candles",
   "donut",
   "gauge",
   "spark",
   "stack"
  ],
  "fills": [
   "bruise",
   "ink",
   "paper"
  ]
 },
 {
  "id": "status-wall",
  "num": "04",
  "name": "Status wall",
  "group": "General",
  "theme": "dark",
  "summary": "Six-up KPI strip, 60-day uptime strips, cluster gauges and an incident log.",
  "use": "Operations and reliability screens.",
  "cols": "repeat(12, 1fr)",
  "rows": "142px 1fr 1fr",
  "parts": [
   "area",
   "gauge",
   "spark"
  ],
  "fills": [
   "amber",
   "green",
   "ink"
  ]
 },
 {
  "id": "growth-retention",
  "num": "05",
  "name": "Growth and retention",
  "group": "General",
  "theme": "light",
  "summary": "Light theme. A cohort matrix as the hero beside a stacked weekly-users chart.",
  "use": "Product analytics.",
  "cols": "repeat(12, 1fr)",
  "rows": "repeat(3, 1fr)",
  "parts": [
   "ring",
   "stack"
  ],
  "fills": [
   "navy",
   "teal"
  ]
 },
 {
  "id": "board-report",
  "num": "06",
  "name": "Board report",
  "group": "General",
  "theme": "light",
  "summary": "Light theme. A headline sentence as the hero, with a revenue bridge, objectives and a roadmap.",
  "use": "Executive and board reporting.",
  "cols": "repeat(12, 1fr)",
  "rows": "1.05fr 1fr 1fr",
  "parts": [
   "bullet",
   "waterfall"
  ],
  "fills": [
   "blue",
   "paper",
   "teal"
  ]
 },
 {
  "id": "pipeline-forecast",
  "num": "07",
  "name": "Pipeline and forecast",
  "group": "General",
  "theme": "dark",
  "summary": "Forecast with a confidence band, a ranked people column, stage bars and items at risk.",
  "use": "Sales operations.",
  "cols": "repeat(12, 1fr)",
  "rows": "repeat(3, 1fr)",
  "parts": [
   "area",
   "bars",
   "gauge",
   "ring"
  ],
  "fills": [
   "bruise",
   "teal"
  ]
 },
 {
  "id": "brand-health",
  "num": "08",
  "name": "Brand health",
  "group": "General",
  "theme": "dark",
  "summary": "A perception radar column, index tile, share of voice, theme words and a verbatim.",
  "use": "Research and brand tracking.",
  "cols": "repeat(12, 1fr)",
  "rows": "repeat(3, 1fr)",
  "parts": [
   "area",
   "radar",
   "spark"
  ],
  "fills": [
   "blue",
   "bruise",
   "paper"
  ]
 },
 {
  "id": "deal-home",
  "num": "09",
  "name": "Deal home",
  "group": "Stepped workflow",
  "theme": "dark",
  "summary": "Items by stage, a waiting-on status list, and a table with a mini stage bar.",
  "use": "The entry screen for a record that moves through stages.",
  "cols": "repeat(12, 1fr)",
  "rows": "repeat(3, 1fr)",
  "parts": [
   "spark",
   "stack"
  ],
  "fills": [
   "amber",
   "blue",
   "teal"
  ]
 },
 {
  "id": "stage-project",
  "num": "10",
  "name": "Stage 1, project",
  "group": "Stepped workflow",
  "theme": "dark",
  "summary": "Stepper and side rail, with site tiles, demand bars and a contact summary.",
  "use": "First stage of a stepped workflow.",
  "cols": "repeat(12, 1fr)",
  "rows": "96px 1fr 1fr",
  "parts": [
   "bars"
  ],
  "fills": []
 },
 {
  "id": "stage-configuration",
  "num": "11",
  "name": "Stage 2, configuration",
  "group": "Stepped workflow",
  "theme": "dark",
  "summary": "One row per option with a score column, a radar for why, and a version trend.",
  "use": "Comparing and choosing among options.",
  "cols": "repeat(12, 1fr)",
  "rows": "96px 1fr 1fr",
  "parts": [
   "area",
   "radar"
  ],
  "fills": []
 },
 {
  "id": "stage-discovery",
  "num": "12",
  "name": "Stage 3, discovery",
  "group": "Stepped workflow",
  "theme": "dark",
  "summary": "Requests and status, a status donut, time against target and a timeline with a now marker.",
  "use": "Tracking requests that other people owe.",
  "cols": "repeat(12, 1fr)",
  "rows": "96px 1fr 1fr",
  "parts": [
   "bullet",
   "donut"
  ],
  "fills": []
 },
 {
  "id": "stage-registration",
  "num": "13",
  "name": "Stage 4, confirmation",
  "group": "Stepped workflow",
  "theme": "dark",
  "summary": "A conflict alert in the error tokens, protection rings and lifecycle steps.",
  "use": "Confirming a decision and resolving conflicts.",
  "cols": "repeat(12, 1fr)",
  "rows": "96px 1fr 1fr",
  "parts": [
   "bars",
   "ring"
  ],
  "fills": []
 },
 {
  "id": "stage-contract",
  "num": "14",
  "name": "Stage 5, contract",
  "group": "Stepped workflow",
  "theme": "dark",
  "summary": "Contract value, a deployment plan by provider and a billing ramp.",
  "use": "Final stage: delivery and billing.",
  "cols": "repeat(12, 1fr)",
  "rows": "96px 1fr 1fr",
  "parts": [
   "ring",
   "stack"
  ],
  "fills": [
   "blue",
   "teal"
  ]
 },
 {
  "id": "editorial-stat-wall",
  "num": "15",
  "name": "Editorial stat wall",
  "group": "Creative",
  "theme": "dark",
  "summary": "An asymmetric, printed-style page with a giant numeral, rules instead of boxes and ruler gauges.",
  "use": "Statements and offsite decks.",
  "cols": "1.15fr 1fr 1fr",
  "rows": "1fr 1fr",
  "parts": [
   "area",
   "stack"
  ],
  "fills": []
 },
 {
  "id": "milestone-spine",
  "num": "16",
  "name": "Milestone spine",
  "group": "Creative",
  "theme": "dark",
  "summary": "A vertical timeline with milestone cards, progress bars and a spend strip.",
  "use": "Program and launch tracking.",
  "cols": "1fr 360px",
  "rows": "1.5fr 1fr 1fr",
  "parts": [
   "bars",
   "bullet",
   "ring"
  ],
  "fills": [
   "teal"
  ]
 },
 {
  "id": "radial-hub",
  "num": "17",
  "name": "Radial hub",
  "group": "Creative",
  "theme": "dark",
  "summary": "Concentric rings as the hero, with satellite metrics around the core.",
  "use": "One health number with four drivers.",
  "cols": "1fr 484px 1fr",
  "rows": "1fr 1fr",
  "parts": [
   "area",
   "bars",
   "heat",
   "rings"
  ],
  "fills": [
   "ink"
  ]
 },
 {
  "id": "kanban-board",
  "num": "18",
  "name": "Kanban board",
  "group": "Creative",
  "theme": "dark",
  "summary": "Five columns of cards with progress bars and due flags.",
  "use": "Content and work queues.",
  "cols": "repeat(5, 1fr)",
  "rows": "auto auto 1fr auto",
  "parts": [],
  "fills": []
 },
 {
  "id": "lead-flow",
  "num": "19",
  "name": "Lead flow",
  "group": "Creative",
  "theme": "dark",
  "summary": "A flow diagram from channel to stage to outcome, with a win-rate panel.",
  "use": "Funnels with several sources.",
  "cols": "1fr 360px",
  "rows": "1fr auto",
  "parts": [
   "flow"
  ],
  "fills": [
   "blue",
   "teal"
  ]
 },
 {
  "id": "small-multiples",
  "num": "20",
  "name": "Small multiples",
  "group": "Creative",
  "theme": "dark",
  "summary": "Twelve markets on one scale, each with its own trend and a colored top rule.",
  "use": "Comparing many similar units.",
  "cols": "repeat(4, 1fr)",
  "rows": "repeat(3, 1fr)",
  "parts": [
   "area"
  ],
  "fills": []
 },
 {
  "id": "year-calendar",
  "num": "21",
  "name": "Year calendar",
  "group": "Creative",
  "theme": "dark",
  "summary": "A year heat grid, a best-week tile, weekday rhythm and incident trend.",
  "use": "Activity over a year.",
  "cols": "repeat(4, 1fr)",
  "rows": "auto 1fr",
  "parts": [
   "area",
   "bars",
   "spark",
   "year"
  ],
  "fills": [
   "bruise"
  ]
 },
 {
  "id": "customer-journey",
  "num": "22",
  "name": "Customer journey",
  "group": "Creative",
  "theme": "dark",
  "summary": "Swimlanes by team across stages, each cell tinted by score.",
  "use": "Journey and service-blueprint views.",
  "cols": "170px repeat(5, 1fr)",
  "rows": "auto repeat(4, 1fr)",
  "parts": [],
  "fills": []
 },
 {
  "id": "annotated-briefing",
  "num": "23",
  "name": "Annotated briefing",
  "group": "Creative",
  "theme": "dark",
  "summary": "One hero chart with dated callouts and a short narrative column.",
  "use": "Weekly briefings with a decision.",
  "cols": "1fr 370px",
  "rows": "auto",
  "parts": [
   "area",
   "bullet"
  ],
  "fills": [
   "ink",
   "teal"
  ]
 },
 {
  "id": "diverging-matrix",
  "num": "24",
  "name": "Diverging matrix",
  "group": "Creative",
  "theme": "dark",
  "summary": "A department-by-month matrix colored red over and green under budget.",
  "use": "Variance and budget reviews.",
  "cols": "1.25fr 1fr",
  "rows": "auto",
  "parts": [
   "bars",
   "donut"
  ],
  "fills": [
   "paper"
  ]
 }
];
  NS.DASHBOARDS = LAYOUTS;
  const FILL = {"blue": "interactive-primary", "bruise": "gradient-bruise", "teal": "teal-500", "green": "green-500", "amber": "yellow-500", "paper": "background-inverse", "ink": "widget-inset", "line": "border-default", "navy": "navy-900", "glow": "gradient-glow"};
  const GROUPS = [["General", "Eight layouts for common reporting jobs. Two are light theme."], ["Stepped workflow", "Six screens for a record that moves through five stages. Each stage screen carries the same stepper on top and the same side rail."], ["Creative", "Ten layouts that break the equal-card grid: editorial, timeline, radial, board, flow, small multiples, calendar, swimlane, annotated and matrix."]];

  /* Nav: a group after the Graphics framework */
  const gi = NS.NAV.findIndex((g) => g.group === "Graphics framework");
  NS.NAV.splice(gi + 1, 0, { group: "Dashboard layouts", items: [["dashboards", "Overview", String(LAYOUTS.length)], ["dashboards/chart-parts", "Chart parts", "New"], ...LAYOUTS.map((d) => ["dashboards/" + d.id, d.name])] });

  const frame = (src, title, h = 1000) => `<div class="dl-frame" style="aspect-ratio:1600/${h}"><iframe src="${src}" title="${title}" loading="lazy" width="1600" height="${h}" style="height:${h}px" tabindex="-1"></iframe></div>`;
  const STYLE = `<style>
.dl-frame{position:relative;width:100%;border-radius:var(--ns-radius-xl);overflow:hidden;box-shadow:0 0 0 1px var(--ns-border-default);background:var(--ns-black);margin:0 0 var(--ns-space-7)}
.dl-frame iframe{position:absolute;left:0;top:0;width:1600px;border:0;transform-origin:0 0}
.dl-actions{display:flex;gap:var(--ns-space-4);flex-wrap:wrap;margin:0 0 var(--ns-space-5)}
.dl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--ns-space-6);margin:0 0 var(--ns-space-9)}
.dl-card{display:grid;gap:var(--ns-space-3);color:inherit;text-decoration:none}
.dl-card img{width:100%;height:auto;aspect-ratio:16/10;border-radius:var(--ns-radius-lg);box-shadow:0 0 0 1px var(--ns-border-default);display:block;transition:transform var(--ns-duration-slow) var(--ns-easing-standard)}
.dl-card:hover img{transform:translateY(-3px)}
.dl-card b{font:700 15px/20px var(--ns-font-sans)}
.dl-card span{font:400 13px/18px var(--ns-font-sans);color:var(--ns-text-secondary)}
.dl-chip{display:inline-block;font:600 11px/1 var(--ns-font-sans);padding:4px 8px;border-radius:var(--ns-radius-full);background:var(--ns-background-selected);color:var(--ns-text-primary);margin:0 4px 4px 0}
</style>`;
  const fit = () => document.querySelectorAll(".dl-frame").forEach((f) => { const s = f.clientWidth / 1600; const i = f.querySelector("iframe"); if (i) i.style.transform = "scale(" + s + ")"; });
  const init = () => { fit(); const ro = new ResizeObserver(fit); document.querySelectorAll(".dl-frame").forEach((f) => ro.observe(f)); const prev = NS.pageCleanup; NS.pageCleanup = () => { ro.disconnect(); prev && prev(); }; };
  const usage = (extra) => codeBlock(`<link rel="stylesheet" href="css/tokens.css">\n<link rel="stylesheet" href="css/dashboards.css">\n<script src="js/dashboards.js"></script>\n<div class="art" id="a"></div>\n<script>\nconst D = NS.dash;\nconst s = D.shell({ active: "chart", title: "Quarter", sub: "Q3", right: D.seg(["Q1", "Q2", "Q3"], 2) });\ndocument.getElementById("a").innerHTML = s.open + \`<div class="grid">${extra}</div>\` + s.close;\n</script>`, "html");

  /* ---------- Overview ---------- */
  P("dashboards", {
    title: "Dashboard layouts", status: "New", wide: true,
    lede: `${LAYOUTS.length} full-screen dashboard layouts built from NorthStar tokens, the widget kit and Open Sans, plus the chart parts they share. Pick a layout, copy its page, and replace the data.`,
    body: () => `${STYLE}
${GROUPS.map(([g, d]) => `${h2(g)}<p>${d}</p><div class="dl-grid">${LAYOUTS.filter((x) => x.group === g).map((x) => `<a class="dl-card" href="#/dashboards/${x.id}"><img src="assets/dashboards/${x.id}.jpg" alt="${x.name} layout" loading="lazy" width="960" height="600"><b>${x.name}</b><span>${x.summary}</span></a>`).join("")}</div>`).join("")}
${h2("Anatomy")}${table(["Part", "Class or call", "Role"], [["Artboard", "<code>.art</code>", "A fixed 1600 by 1000 canvas with the brand glow behind it. Light layouts turn the glow off."], ["Rail and top bar", "<code>NS.dash.shell()</code>", "Icon rail, page title, a segmented control and a live pill."], ["Grid", "<code>.grid</code>", "A 12-column CSS grid. Each layout sets its own columns and rows."], ["Tile", "<code>.t</code>", "Widget surface, 16px radius. Fills: " + Object.keys(FILL).map((k) => "<code>t--" + k + "</code>").join(", ") + "."], ["Display type", "<code>.d-mega</code> to <code>.d-sm</code>", "Open Sans 800 numerals from 168px down to 20px."], ["Stepper and side rail", "<code>NS.dash.spine()</code>, <code>railPanel()</code>", "Used by the stepped workflow set."]])}
${h2("Rules the layouts follow")}<ul><li>One tile, one job. Detail lives inside the tile.</li><li>Color blocks carry the hierarchy. Use at most three filled tiles on a screen.</li><li>Every color is a token, so a layout follows theme and token edits.</li><li>Chart text is 10px or larger and meets the chart label contrast token.</li></ul>
${notice("info", "Placeholder data", "Names, figures and dates inside the layouts are sample data. Replace them before use.")}
${h2("Use in code")}<p>Each layout is one HTML file in <code>dashboards/</code>. Load the kit, then build the screen from tiles.</p>${usage('<section class="t t--blue"><div class="o">Revenue</div><div class="d-xl">$48.2M</div></section>')}`,
    init,
  });

  /* ---------- Chart parts ---------- */
  P("dashboards/chart-parts", {
    title: "Chart parts", status: "New", wide: true,
    lede: "Sixteen functions on NS.dash that return SVG or HTML strings: area, spark, bars, stack, ring, rings, donut, gauge, radar, heat, year, dotmap, candles, bullet, waterfall and flow, plus the shell and stepper helpers. Each part takes token colors.",
    body: () => `${STYLE}${frame("dashboards/chart-parts.html", "Chart parts reference", 1560)}
${h2("Reference")}${table(["Part", "Call", "Notes"], [["area", "<code>D.area({ w, h, sets, labels, min, max, fmt, glow })</code>", "Smooth lines with gradient fill. A set can be dashed, banded or offset with <code>from</code> and <code>n</code>."], ["spark", "<code>D.spark({ w, h, data, color })</code>", "An area with no axes, for tiles and tables."], ["bars", "<code>D.bars({ w, h, data, color, hi, labels, track, grid })</code>", "Vertical bars. Pass an array of colors for per-bar fills."], ["stack", "<code>D.stack({ w, h, sets, labels })</code>", "Stacked columns with a 2px gap between segments."], ["ring", "<code>D.ring({ size, stroke, pct, label, grad })</code>", "A single progress ring with a round cap."], ["rings", "<code>D.rings({ size, items })</code>", "Concentric three-quarter rings."], ["donut", "<code>D.donut({ size, parts, center })</code>", "Part-to-whole with a gap between segments."], ["gauge", "<code>D.gauge({ w, pct, color, label })</code>", "Semicircle meter."], ["radar", "<code>D.radar({ size, axes, sets, m, px })</code>", "Use <code>m</code> for the label margin and <code>px</code> to widen the canvas."], ["heat", "<code>D.heat({ rows, cols, cell, ch, fn })</code>", "Rectangular intensity grid on one sequential color."], ["year", "<code>D.year({ vals, cell })</code>", "A 53 by 7 calendar grid."], ["dotmap", "<code>D.dotmap({ w, h, spots })</code>", "Dot-matrix world with glowing hotspots."], ["candles", "<code>D.candles({ w, h, n })</code>", "Candlesticks in success and error tokens."], ["bullet", "<code>D.bullet({ pct, target, color })</code>", "A bar with a target tick."], ["waterfall", "<code>D.waterfall({ w, h, steps, base })</code>", "Bridge chart. Set <code>base</code> to truncate the axis and say so in the label."], ["flow", "<code>D.flow({ w, h, cols, links })</code>", "Sankey-style flow. Column totals should match."]])}
${h2("Shell helpers")}${table(["Helper", "Call", "Role"], [["shell", "<code>D.shell({ active, title, sub, right })</code>", "Returns <code>open</code> and <code>close</code> strings that wrap the grid."], ["seg", "<code>D.seg(items, on)</code>", "Segmented control."], ["live", "<code>D.live(text)</code>", "A pill with a pulsing dot. Motion stops under reduced motion."], ["spine, miniSpine, railPanel", "<code>D.spine(n)</code>, <code>D.miniSpine(n)</code>, <code>D.railPanel()</code>", "Stepper, five-dot progress and the side rail used by the stepped workflow set."], ["series, rng", "<code>D.series(n, from, to, vol, seed)</code>", "Seeded sample data for demos."]])}
${notice("info", "Parts versus widgets", "The widget kit in the Graphics framework is the Figma-matched set. These parts draw the larger, screen-scale charts that dashboard layouts need. Both use the same chart tokens.")}
${h2("Use in code")}${usage("")}`,
    init,
  });

  /* ---------- One page per layout ---------- */
  LAYOUTS.forEach((d) => {
    P("dashboards/" + d.id, {
      title: d.name, status: "New", wide: true,
      lede: d.summary,
      body: () => `${STYLE}<div class="dl-actions"><a class="ns ns-btn ns-btn--secondary ns-btn--sm" href="dashboards/${d.id}.html" target="_blank" rel="noopener">Open full size</a><a class="ns ns-btn ns-btn--ghost ns-btn--sm" href="#/dashboards">All layouts</a></div>${frame("dashboards/" + d.id + ".html", d.name + " layout")}
${h2("Recipe")}${table(["Property", "Value"], [["Group", d.group], ["Theme", d.theme === "light" ? "Light" : "Dark"], ["Best for", d.use], ["Grid columns", "<code>" + d.cols + "</code>"], ["Grid rows", "<code>" + d.rows + "</code>"], ["Tile fills", d.fills.length ? d.fills.map((f) => '<span class="dl-chip"><code>t--' + f + "</code> " + FILL[f] + "</span>").join("") : "Default surface only"], ["Chart parts", d.parts.length ? d.parts.map((p) => '<a class="dl-chip" href="#/dashboards/chart-parts">' + p + "</a>").join("") : "None"], ["File", "<code>dashboards/" + d.id + ".html</code>"]])}
${h2("Use in code")}<p>Copy <code>dashboards/${d.id}.html</code>, keep the three includes, and replace the data in the script. The layout styles sit in the page's own style block.</p>${codeBlock(`<link rel="stylesheet" href="css/tokens.css">\n<link rel="stylesheet" href="css/dashboards.css">\n<script src="js/dashboards.js"></script>`, "html")}
${d.theme === "light" ? notice("info", "Light theme", "This layout sets data-theme to light on the page. Tile fills and chart colors come from the light token modes.") : ""}`,
      init,
    });
  });
})();
