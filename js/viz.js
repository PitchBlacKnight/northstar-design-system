/* NorthStar chart style. The one place chart colors and chart text are decided, shared by
   NS.chartKit (charts.js), NS.widget (widgets.js), NS.dash (dashboards.js) and the bullet chart.
   Rules: flat fills from the chart-series tokens (no gradients, no glow), axis text 11px regular
   in --ns-chart-label-text (5.6:1 on the widget, widget-muted is 3.4:1 and fails for text),
   gridlines 1px solid --ns-widget-grid. Ends: every mark takes the same round end (round(), --ns-chart-bar-radius).
   Gradients: one ramp, low to high along the value axis (ramp()), and a fade under a line (fade()).
   Categories stay flat. Exposed as NS.viz. */
(function () {
  const NS = (window.NS = window.NS || {});

  /* palette names used by older widgets, and raw viz tokens, resolved to the series they belong to.
     viz-4 and viz-7 skip the contrast nudge that chart-series-2 and -4 carry, so they route there. */
  const ALIAS = {
    teal: "chart-series-1", blue: "chart-series-2", purple: "chart-series-3", bruise: "chart-series-4", violet: "chart-series-4", muted: "chart-series-5",
    orange: "viz-3", yellow: "viz-3", green: "viz-5", red: "viz-6",
    "viz-1": "chart-series-1", "viz-2": "chart-series-3", "viz-4": "chart-series-2", "viz-7": "chart-series-4",
    "teal-500": "chart-series-1", "blue-500": "chart-series-2", "sky-500": "chart-series-2", "cyan-400": "chart-series-1", "purple-500": "chart-series-3",
    "periwinkle-500": "chart-series-4", "persian-500": "chart-series-4", "orange-500": "viz-3", "yellow-500": "viz-3", "green-500": "viz-5", "red-400": "viz-6",
  };
  const tok = (name) => ALIAS[name] || name;
  const c = (name) => `var(--ns-${tok(name)})`;

  /* categorical order: the five chart series, then the extended viz hues */
  const SERIES = ["chart-series-1", "chart-series-2", "chart-series-3", "chart-series-4", "viz-3", "viz-5", "viz-6", "chart-series-5"];

  /* measurements come from tokens.css (--ns-chart-*); defaults cover a page that loads without it */
  const M = { axis: 11, stroke: 2.5, thin: 1.5, grid: 1, bar: 12 };
  const VAR = { axis: "chart-axis-size", stroke: "chart-stroke", thin: "chart-stroke-thin", grid: "chart-grid-stroke", bar: "chart-bar-radius" };
  if (typeof getComputedStyle === "function" && document.documentElement) {
    const cs = getComputedStyle(document.documentElement);
    for (const k in VAR) { const n = parseFloat(cs.getPropertyValue(`--ns-${VAR[k]}`)); if (!isNaN(n)) M[k] = n; }
  }

  const LABEL = { size: M.axis, weight: 400, fill: "chart-label-text" };
  const text = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.anchor || "start"}"${o.mid === false ? "" : ' dominant-baseline="middle"'} font-size="${o.size || LABEL.size}" font-weight="${o.weight || LABEL.weight}" style="fill:${c(o.fill || LABEL.fill)}">${s}</text>`;
  const grid = (x1, x2, y1, y2) => `<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" style="stroke:${c("widget-grid")}" stroke-width="${M.grid}"/>`;

  /* end radius for a bar w wide and h long: a full half-circle up to the chart-bar-radius token, the same curve beyond it */
  const round = (w, h) => Math.max(0, Math.min(M.bar, Math.min(w, h == null ? w : h) / 2));
  /* the ramp: series-1 and tile ink start at the tile's --ramp-from (blue on navy, faded ink on a block);
     any other color starts at itself, faded. attrs sets direction, e.g. 'x1="0" x2="1" y1="0" y2="0"'. */
  const LEAD = c("chart-series-1");
  const rampFrom = (col) => (col === LEAD || /var\(--ink\)/.test(col)) ? "var(--ramp-from, var(--ns-chart-ramp-from))" : `color-mix(in srgb, ${col} var(--ns-chart-ramp-fade, 42%), transparent)`;
  const ramp = (id, col, attrs) => `<linearGradient id="${id}" ${attrs}><stop offset="0" style="stop-color:${rampFrom(col)}"/><stop offset="1" style="stop-color:${col}"/></linearGradient>`;
  const fade = (id, col, top) => `<linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:${col};stop-opacity:${top}"/><stop offset="1" style="stop-color:${col};stop-opacity:0"/></linearGradient>`;

  NS.viz = { tok, c, series: SERIES, label: LABEL, m: M, text, grid, round, ramp, rampFrom, fade };
})();
