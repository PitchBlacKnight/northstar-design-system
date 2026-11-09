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

/* ---------- Chart motion ----------
   Every chart draws itself in once, the first time it scrolls into view: columns and bars grow from their base,
   lines draw, rings sweep, dots and cells pop, filled areas fade up after their line. One pass, under 1.5 seconds, nothing loops.
   Labels, axes and gridlines stay put so the frame never jumps.
   Still when the reader asks for reduced motion, in scaled thumbnails (.cthumb), under [data-motion="off"],
   with ?motion=off, and in headless captures (so screenshots and visual tests show finished charts).
   NS.chartMotion.play(svg) replays one chart. */
(function () {
  const NS = window.NS;
  if (!NS || typeof IntersectionObserver === "undefined" || typeof MutationObserver === "undefined" || !Element.prototype.animate) return;
  const q = new URLSearchParams(location.search).get("motion");
  const still = q !== "on" && (q === "off" || matchMedia("(prefers-reduced-motion: reduce)").matches || /HeadlessChrome/.test(navigator.userAgent));
  const M = (NS.chartMotion = { still, play: () => {} });
  if (still) return;

  const MARKS = "rect, path, circle, ellipse, polygon, polyline";
  const WAIT = "ns-motion-wait";
  const css = document.createElement("style");
  css.textContent = `svg.${WAIT} :is(${MARKS}):not(defs *) { opacity: 0; } .bar.${WAIT} > i { width: 0; } @media print { svg.${WAIT} :is(${MARKS}) { opacity: 1; } .bar.${WAIT} > i { width: var(--_v); } }`;
  document.head.appendChild(css);
  const EASE = getComputedStyle(document.documentElement).getPropertyValue("--ns-easing-standard").trim() || "cubic-bezier(0.2, 0, 0, 1)";

  /* What a mark is decides how it enters. Read from the drawn shape, so every chart gets it without its own code. */
  const kind = (el, W, H) => {
    let b; try { b = el.getBBox(); } catch (e) { return null; }
    if (!b.width && !b.height) return null;
    const tag = el.tagName.toLowerCase(), cs = getComputedStyle(el);
    const filled = cs.fill !== "none" && cs.fillOpacity !== "0";
    const stroked = cs.stroke !== "none" && parseFloat(cs.strokeWidth) > 0;
    const dash = cs.strokeDasharray && cs.strokeDasharray !== "none" ? cs.strokeDasharray.split(/[ ,]+/).map(parseFloat) : null;
    const arc = dash && dash.length === 2 && dash[0] > 12;            /* one long dash is an arc, many short ones a dotted rule */
    const moved = el.hasAttribute("transform");                         /* its own transform would fight a scale */
    if (tag === "rect") {
      if (b.width >= W * 0.9 && b.height >= H * 0.9) return null;       /* plot background */
      if (moved) return "fade";
      if (Math.abs(b.width - b.height) <= Math.max(2, b.width * 0.15)) return "dot";   /* cells and swatches */
      return b.height > b.width ? "col" : "bar";
    }
    if (tag === "circle" || tag === "ellipse") {
      if (!filled && stroked) return arc ? "ring" : "fade";
      return moved ? "fade" : "dot";
    }
    if (!filled && stroked) return arc ? "ring" : dash ? "fade" : "line";
    return "fill";
  };

  /* kind: [keyframes(el), duration, first delay, total stagger] */
  const box = (el, origin) => { el.style.transformBox = "fill-box"; el.style.transformOrigin = origin; };
  const ENTER = {
    col: [(el) => (box(el, "50% 100%"), [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }]), 700, 0, 360],
    bar: [(el) => (box(el, "0% 50%"), [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]), 700, 0, 360],
    line: [(el) => { const L = el.getTotalLength(); return [{ strokeDasharray: `${L} ${L}`, strokeDashoffset: L }, { strokeDasharray: `${L} ${L}`, strokeDashoffset: 0 }]; }, 900, 80, 240],
    ring: [(el) => { const cs = getComputedStyle(el); return [{ strokeDasharray: `0px, ${Math.ceil(el.getTotalLength())}px` }, { strokeDasharray: cs.strokeDasharray }]; }, 900, 0, 240],
    dot: [(el) => (box(el, "50% 50%"), [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1)", opacity: getComputedStyle(el).opacity }]), 420, 260, 480],
    fill: [(el) => [{ opacity: 0 }, { opacity: getComputedStyle(el).opacity }], 600, 450, 200],   /* areas follow their line */
    fade: [(el) => [{ opacity: 0 }, { opacity: getComputedStyle(el).opacity }], 420, 160, 160],
  };

  M.play = (svg) => {
    const vb = svg.viewBox && svg.viewBox.baseVal, r = svg.getBoundingClientRect();
    const W = (vb && vb.width) || r.width, H = (vb && vb.height) || r.height;
    const groups = {};
    try {
      svg.querySelectorAll(MARKS).forEach((el) => {
        if (el.closest("defs, clipPath, mask, pattern, marker")) return;
        svg.classList.remove(WAIT);                                      /* measure opacity and shape as drawn */
        const k = kind(el, W, H);
        if (k) (groups[k] = groups[k] || []).push(el);
      });
      Object.keys(groups).forEach((k) => {
        const [frames, duration, d0, spread] = ENTER[k], els = groups[k], step = els.length > 1 ? spread / (els.length - 1) : 0;
        const first = k === "dot" && groups.line ? 620 : d0;      /* points land after their line arrives */
        els.forEach((el, i) => {
          const a = el.animate(frames(el), { duration, delay: first + Math.min(step, 90) * i, easing: EASE, fill: "backwards" });
          a.onfinish = a.oncancel = () => { el.style.removeProperty("transform-box"); el.style.removeProperty("transform-origin"); };
        });
      });
    } finally { svg.classList.remove(WAIT); svg.dataset.motion = "done"; }
  };

  /* Bars drawn in CSS (.bar > i) grow to their value, a short step apart down the list. */
  const playBar = (bar) => {
    const fill = bar.firstElementChild, tile = bar.closest(".t, .ns-card, section") || document.body;
    const i = Math.max(0, [...tile.querySelectorAll(".bar")].indexOf(bar));
    bar.classList.remove(WAIT); bar.dataset.motion = "done";
    if (fill) fill.animate([{ width: "0px" }, { width: getComputedStyle(fill).width }], { duration: 700, delay: Math.min(i * 45, 360), easing: EASE, fill: "backwards" });
  };

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    if (e.target.classList.contains("bar")) return playBar(e.target);
    /* a beat, so a plot that redraws to its tile width (charts.js) has settled before its marks are measured */
    setTimeout(() => requestAnimationFrame(() => M.play(e.target)), 80);
  }), { threshold: 0.15 });

  const seen = new WeakMap();   /* host element -> chart slots already played, so a redraw in place does not replay */
  const adopt = (svg) => {
    if (svg.dataset.motion) return;
    const host = svg.parentElement;
    if (svg.closest('.cthumb, [data-motion="off"]') || (parseFloat(svg.getAttribute("width")) || svg.getBoundingClientRect().width) < 48) { svg.dataset.motion = "off"; return; }
    if (host) {
      const slot = [...host.children].filter((n) => n.tagName.toLowerCase() === "svg").indexOf(svg), set = seen.get(host) || new Set();
      seen.set(host, set);
      if (set.has(slot)) { svg.dataset.motion = "done"; return; }
      set.add(slot);
    }
    svg.dataset.motion = "wait"; svg.classList.add(WAIT); io.observe(svg);
  };
  const adoptBar = (bar) => {
    if (bar.dataset.motion || !bar.firstElementChild || bar.firstElementChild.tagName !== "I") return;
    if (bar.closest('.cthumb, [data-motion="off"]')) { bar.dataset.motion = "off"; return; }
    bar.dataset.motion = "wait"; bar.classList.add(WAIT); io.observe(bar);
  };
  const SEL = 'svg:is([role="img"], [data-chart], [data-bullet]):not(.ns-logo)';
  const scan = (n) => {
    if (n.nodeType !== 1) return;
    if (n.matches(SEL)) adopt(n); n.querySelectorAll(SEL).forEach(adopt);
    if (n.matches(".bar")) adoptBar(n); n.querySelectorAll(".bar").forEach(adoptBar);
  };
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach(scan))).observe(document.documentElement, { childList: true, subtree: true });
  if (document.body) scan(document.body); else document.addEventListener("DOMContentLoaded", () => scan(document.body));
})();
