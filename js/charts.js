/* NorthStar chart library. Each chart is a plain description (kpi copy and a prims function that returns
   rectangles, circles, arcs, paths and text in a w x h box). The same description drives the Figma
   component set (every primitive becomes a rectangle, ellipse, vector or text layer bound to
   Semantic / Colors) and the SVG on the docs site, so the two cannot drift.
   Token keys map to --ns-chart-* and friends; see TOKV. Demo values are generic. */
(function () {
  const NS = (window.NS = window.NS || {});

  /* shared drawing helpers: identical in the Figma builder */
  const H = {
    hgrid: (x0, x1, y0, y1, n) => Array.from({ length: n }, (_, i) => ({ k: "rect", x: x0, y: y0 + ((y1 - y0) * i) / (n - 1) - 0.5, w: x1 - x0, h: 1, f: "grid", n: "Gridline" })),
    ylab: (x, y0, y1, L) => L.map((s, i) => ({ k: "text", x, y: y0 + ((y1 - y0) * i) / (L.length - 1), s, a: "end", n: "Axis label" })),
    xlab: (x0, x1, y, L) => L.map((s, i) => ({ k: "text", x: x0 + (x1 - x0) * (L.length === 1 ? 0.5 : i / (L.length - 1)), y, s, a: "middle", n: "Axis label" })),
    poly: (P) => P.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" "),
  };

  const DEFS = {};
  /* @defs-start */
  DEFS.bubble = {
    name: "Bubble",
    alt: "Bubble chart: eight points, bubble size shows the third measure",
    kpi: ["Accounts", "1,240", "+2.4%", "Bubble size shows active seats", "Size is seats"],
    sum: [["Largest", "312", "+1.2%", "Top account", "Top account"], ["Smallest", "18", "+0.4%", "Lowest tier", "Lowest tier"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb, R = Math.min(pw, ph) * 0.16;
      const P = [[0.10, 0.62, 0.28, "s1"], [0.22, 0.30, 0.5, "s2"], [0.35, 0.72, 0.2, "s1"], [0.47, 0.46, 0.62, "s3"], [0.60, 0.22, 0.34, "s2"], [0.70, 0.60, 0.42, "s1"], [0.82, 0.32, 0.26, "s3"], [0.92, 0.68, 0.5, "s2"]];
      const g = c ? [] : [...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["40", "30", "20", "10"]), ...H.xlab(ml + 10, w - 10, h - 8, ["Jan", "Mar", "May", "Jul"])];
      return [...g, ...P.map((p, i) => ({ k: "circle", cx: ml + p[0] * pw, cy: Math.min(ph - R * p[2] - 1, Math.max(R * p[2] + 1, p[1] * ph)), r: R * p[2], f: p[3], o: 0.85, n: "Bubble " + (i + 1) }))];
    },
  };
  DEFS.candle = {
    name: "Candlestick",
    alt: "Candlestick chart: ten sessions, green candles close higher and red candles close lower",
    kpi: ["Index", "4,820", "+0.8%", "Open, close, high and low", "Daily range"],
    sum: [["Highest", "4,910", "+1.1%", "Session high", "Session high"], ["Lowest", "4,610", "+0.2%", "Session low", "Session low"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb;
      const D = [[0.40, 0.52, 0.34, 0.58], [0.52, 0.46, 0.40, 0.60], [0.46, 0.60, 0.42, 0.66], [0.60, 0.70, 0.55, 0.74], [0.70, 0.62, 0.56, 0.78], [0.62, 0.55, 0.50, 0.68], [0.55, 0.68, 0.50, 0.72], [0.68, 0.80, 0.64, 0.86], [0.80, 0.74, 0.70, 0.88], [0.74, 0.84, 0.70, 0.90]].slice(0, c ? 8 : 10);
      const step = pw / D.length, bw = Math.max(4, step * 0.5), Y = (v) => ph - 4 - v * (ph - 8);
      const g = c ? [] : [...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["120", "110", "100", "90"]), ...H.xlab(ml + step / 2, w - step / 2, h - 8, ["Mon", "Wed", "Fri"])];
      const out = [];
      D.forEach((d, i) => {
        const cx = ml + step * (i + 0.5), f = d[1] >= d[0] ? "ok" : "err", top = Y(Math.max(d[0], d[1])), bot = Y(Math.min(d[0], d[1]));
        out.push({ k: "rect", x: cx - 0.5, y: Y(d[3]), w: 1, h: Y(d[2]) - Y(d[3]), f, n: "Wick " + (i + 1) });
        out.push({ k: "rect", x: cx - bw / 2, y: top, w: bw, h: Math.max(2, bot - top), r: 1, f, n: "Candle " + (i + 1) });
      });
      return [...g, ...out];
    },
  };
  DEFS.funnel = {
    name: "Funnel",
    alt: "Funnel chart: five stages from visits to active, each narrower than the last",
    kpi: ["Signups", "8,420", "+3.2%", "From first visit to active", "Visit to active"],
    sum: [["Trial", "2,100", "+1.4%", "Started a trial", "Started trial"], ["Active", "640", "+0.9%", "Active at day 30", "Active day 30"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 72, pw = w - ml, n = 5, gap = c ? 3 : 6, bh = (h - gap * (n - 1)) / n;
      const V = [1, 0.78, 0.56, 0.38, 0.22], L = ["Visits", "Signups", "Trial", "Paid", "Active"], out = [];
      V.forEach((v, i) => {
        const bw = pw * v, y = i * (bh + gap);
        out.push({ k: "rect", x: ml + (pw - bw) / 2, y, w: bw, h: bh, r: Math.min(4, bh / 2), f: "s1", o: 1 - i * 0.16, n: "Stage " + (i + 1) });
        if (!c) out.push({ k: "text", x: 0, y: y + bh / 2, s: L[i], a: "start", n: "Stage label" });
      });
      return out;
    },
  };
  DEFS.dumbbell = {
    name: "Dumbbell",
    alt: "Dumbbell chart: five rows, each joining a before value and an after value",
    kpi: ["Satisfaction", "4.6", "+0.3%", "Before and after the change", "Before vs after"],
    sum: [["Largest gap", "0.7", "+0.2%", "Biggest improvement", "Biggest gain"], ["Smallest gap", "0.1", "+0.1%", "Least movement", "Least movement"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 64, n = c ? 4 : 5, pw = w - ml - 8, rh = h / n;
      const V = [[0.20, 0.62], [0.35, 0.80], [0.10, 0.45], [0.40, 0.70], [0.25, 0.90]].slice(0, n), L = ["North", "South", "East", "West", "Central"], out = [];
      V.forEach((v, i) => {
        const cy = rh * (i + 0.5), x1 = ml + 4 + pw * v[0], x2 = ml + 4 + pw * v[1], r = c ? 4 : 6;
        if (!c) out.push({ k: "text", x: 0, y: cy, s: L[i], a: "start", n: "Row label" });
        out.push({ k: "rect", x: x1, y: cy - 1, w: x2 - x1, h: 2, r: 1, f: "grid", n: "Link " + (i + 1) });
        out.push({ k: "circle", cx: x1, cy, r, f: "s2", n: "Before " + (i + 1) });
        out.push({ k: "circle", cx: x2, cy, r, f: "s1", n: "After " + (i + 1) });
      });
      return out;
    },
  };
  DEFS.heatmap = {
    name: "Heatmap",
    alt: "Heatmap: activity by weekday and time, darker cells mean more events",
    kpi: ["Activity", "3,260", "+5.1%", "Events by weekday and hour", "By day and hour"],
    sum: [["Busiest", "Wed", "+2.0%", "Peak weekday", "Peak weekday"], ["Quietest", "Fri", "+0.6%", "Lowest weekday", "Lowest weekday"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 34, mb = c ? 0 : 22, cols = c ? 8 : 12, rows = c ? 4 : 5, gap = c ? 2 : 3, pw = w - ml, ph = h - mb;
      const cw = (pw - gap * (cols - 1)) / cols, ch = (ph - gap * (rows - 1)) / rows, D = ["Mon", "Tue", "Wed", "Thu", "Fri"], out = [];
      for (let r = 0; r < rows; r++) {
        if (!c) out.push({ k: "text", x: ml - 8, y: r * (ch + gap) + ch / 2, s: D[r], a: "end", n: "Row label" });
        for (let k = 0; k < cols; k++) {
          const v = ((r * 7 + k * 5 + r * k) % 10) / 9;
          out.push({ k: "rect", x: ml + k * (cw + gap), y: r * (ch + gap), w: cw, h: ch, r: c ? 1 : 3, f: "s1", o: 0.12 + 0.88 * v, n: "Cell " + (r + 1) + "-" + (k + 1) });
        }
      }
      if (!c) out.push(...H.xlab(ml + cw / 2, w - cw / 2, h - 8, ["6a", "12p", "6p"]));
      return out;
    },
  };
  DEFS.parallel = {
    name: "Parallel coordinates",
    alt: "Parallel coordinates: four profiles across five measures, one line per profile",
    kpi: ["Profiles", "128", "+4.0%", "Five measures per profile", "Five measures"],
    sum: [["Strongest", "Reach", "+1.2%", "Highest average", "Highest avg"], ["Weakest", "Cost", "+0.5%", "Lowest average", "Lowest avg"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 6 : 16, mb = c ? 0 : 22, pw = w - ml * 2, ph = h - mb, n = c ? 4 : 5;
      const D = [[0.20, 0.70, 0.40, 0.80, 0.50], [0.60, 0.30, 0.70, 0.20, 0.60], [0.80, 0.50, 0.20, 0.60, 0.90], [0.40, 0.90, 0.60, 0.40, 0.20]];
      const X = (i) => ml + (pw * i) / (n - 1), out = [];
      for (let i = 0; i < n; i++) out.push({ k: "rect", x: X(i) - 0.5, y: 0, w: 1, h: ph, f: "grid", n: "Axis " + (i + 1) });
      D.forEach((d, j) => out.push({ k: "path", d: H.poly(d.slice(0, n).map((v, i) => [X(i), ph - 4 - v * (ph - 8)])), sk: "s" + (j + 1), sw: 2, n: "Profile " + (j + 1) }));
      if (!c) out.push(...H.xlab(ml, ml + pw, h - 8, ["Speed", "Cost", "Reach", "Rate", "Score"]));
      return out;
    },
  };
  DEFS.stepped = {
    name: "Stepped line",
    alt: "Stepped line chart: two series that change only at set points in time",
    kpi: ["Plan limit", "2,400", "+2.0%", "Changes only on a date", "Changes by date"],
    sum: [["Previous", "2,000", "+1.0%", "Before the last change", "Before change"], ["Next", "2,800", "+1.5%", "Planned change", "Planned"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb;
      const A = [0.30, 0.30, 0.50, 0.45, 0.70, 0.60, 0.80, 0.75], B = [0.20, 0.35, 0.30, 0.50, 0.40, 0.55, 0.50, 0.65];
      const dx = pw / (A.length - 1), Y = (v) => ph - 4 - v * (ph - 8);
      const step = (V) => { let d = "M" + ml + " " + Y(V[0]).toFixed(1); for (let i = 1; i < V.length; i++) { const x = (ml + dx * i).toFixed(1); d += "L" + x + " " + Y(V[i - 1]).toFixed(1) + "L" + x + " " + Y(V[i]).toFixed(1); } return d; };
      const g = c ? [] : [...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["3k", "2k", "1k", "0"]), ...H.xlab(ml, w, h - 8, ["Jan", "Apr", "Jul", "Oct"])];
      return [...g, { k: "path", d: step(B), sk: "s3", sw: 2, n: "Series 2" }, { k: "path", d: step(A), sk: "s1", sw: 2, n: "Series 1" }];
    },
  };
  DEFS.scatter = {
    name: "Scatter",
    alt: "Scatter plot: samples on two measures with a rising trend line",
    kpi: ["Samples", "240", "+6.2%", "Two measures per sample", "Two measures"],
    sum: [["Trend", "Up", "+1.0%", "Positive relationship", "Positive"], ["Outliers", "7", "+0.3%", "Far from the trend", "Far from trend"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb;
      const g = c ? [] : [...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["100", "75", "50", "25"]), ...H.xlab(ml + 6, w - 6, h - 8, ["0", "5", "10"])];
      const pts = Array.from({ length: c ? 12 : 18 }, (_, i) => { const x = ((i * 37) % 100) / 100; return [x, Math.max(0.06, Math.min(0.94, 0.2 + 0.6 * x + ((((i * 53) % 17) / 17) - 0.5) * 0.35)), i % 3 === 0 ? "s2" : "s1"]; });
      return [...g, { k: "path", d: "M" + (ml + 4) + " " + (ph - 0.2 * ph).toFixed(1) + "L" + (w - 4) + " " + (ph - 0.8 * ph).toFixed(1), sk: "target", sw: 1.5, n: "Trend line" },
        ...pts.map((p, i) => ({ k: "circle", cx: ml + 4 + p[0] * (pw - 8), cy: ph - p[1] * ph, r: c ? 3 : 4, f: p[2], o: 0.85, n: "Point " + (i + 1) }))];
    },
  };
  /* @defs-end */

  const TOKV = { s1: "--ns-chart-series-1", s2: "--ns-chart-series-2", s3: "--ns-chart-series-3", s4: "--ns-chart-series-4", s5: "--ns-chart-series-5", track: "--ns-chart-track", target: "--ns-chart-target", label: "--ns-widget-muted", text: "--ns-text-primary", text2: "--ns-text-secondary", ok: "--ns-status-success", err: "--ns-status-error", warn: "--ns-status-warning", grid: "--ns-widget-grid", bg: "--ns-widget-bg", line: "--ns-border-subtle", band: "--ns-widget-band", muted: "--ns-widget-muted" };
  const fill = (t, o) => `fill:var(${TOKV[t]})${o != null && o < 1 ? `;fill-opacity:${o}` : ""}`;
  const stroke = (t, o) => `stroke:var(${TOKV[t]})${o != null && o < 1 ? `;stroke-opacity:${o}` : ""}`;
  const n1 = (v) => +v.toFixed(1);
  const pt = (cx, cy, r, a) => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
  const arcPath = (p) => {
    const sweep = p.a1 - p.a0;
    if (sweep >= 359.99) {
      const ring = (r) => `M${n1(p.cx)} ${n1(p.cy - r)}A${r} ${r} 0 1 1 ${n1(p.cx)} ${n1(p.cy + r)}A${r} ${r} 0 1 1 ${n1(p.cx)} ${n1(p.cy - r)}Z`;
      return ring(p.ro) + (p.ri > 0 ? ring(p.ri) : "");
    }
    const [x0, y0] = pt(p.cx, p.cy, p.ro, p.a0), [x1, y1] = pt(p.cx, p.cy, p.ro, p.a1), big = sweep > 180 ? 1 : 0;
    if (p.ri <= 0) return `M${n1(p.cx)} ${n1(p.cy)}L${n1(x0)} ${n1(y0)}A${p.ro} ${p.ro} 0 ${big} 1 ${n1(x1)} ${n1(y1)}Z`;
    const [x2, y2] = pt(p.cx, p.cy, p.ri, p.a1), [x3, y3] = pt(p.cx, p.cy, p.ri, p.a0);
    return `M${n1(x0)} ${n1(y0)}A${p.ro} ${p.ro} 0 ${big} 1 ${n1(x1)} ${n1(y1)}L${n1(x2)} ${n1(y2)}A${p.ri} ${p.ri} 0 ${big} 0 ${n1(x3)} ${n1(y3)}Z`;
  };
  const prim = (p) => {
    if (p.k === "rect") return `<rect x="${n1(p.x)}" y="${n1(p.y)}" width="${n1(p.w)}" height="${n1(p.h)}"${p.r ? ` rx="${p.r}"` : ""} style="${fill(p.f, p.o)}${p.sk ? ";" + stroke(p.sk) + ";stroke-width:" + (p.sw || 1) : ""}"/>`;
    if (p.k === "circle") return `<circle cx="${n1(p.cx)}" cy="${n1(p.cy)}" r="${n1(p.r)}" style="${p.f ? fill(p.f, p.o) : "fill:none"}${p.sk ? ";" + stroke(p.sk) + ";stroke-width:" + (p.sw || 1) : ""}"/>`;
    if (p.k === "arc") return `<path d="${arcPath(p)}" fill-rule="evenodd" style="${fill(p.f, p.o)}"/>`;
    if (p.k === "path") return `<path d="${p.d}" stroke-linecap="round" stroke-linejoin="round" style="${p.f ? fill(p.f, p.o) : "fill:none"}${p.sk ? ";" + stroke(p.sk, p.so) + ";stroke-width:" + (p.sw || 1.5) : ""}"/>`;
    if (p.k === "text") return `<text x="${n1(p.x)}" y="${n1(p.y)}" text-anchor="${p.a === "end" ? "end" : p.a === "middle" ? "middle" : "start"}" dominant-baseline="middle" font-size="${p.size || 11}"${p.w === "Bold" ? ' font-weight="700"' : ""} style="${fill(p.f || "label")}">${p.s}</text>`;
    return "";
  };

  const SIZES = { Small: [330, 120, 64], "Vertical small": [192, 160, 140], Medium: [375, 327, 200], Large: [375, 327, 260], XL: [800, 752, 240] };

  /* the plot on its own, for use inside another card */
  const svg = (id, size = "Medium", o = {}) => {
    const d = DEFS[id], s = SIZES[size], w = o.width || s[1], h = o.height || s[2];
    const compact = size === "Small" || size === "Vertical small";
    return `<svg class="ns-chart__plot" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${d.alt}">${d.prims(w, h, { compact, size }).map(prim).join("")}</svg>`;
  };

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const barIcon = `<span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span>`;
  const kpi = (k, o = {}) => `<div class="ns-chart__kpi"><span class="ns-chart__title${o.lg ? " ns-chart__title--lg" : ""}${o.sm ? " ns-chart__title--sm" : ""}">${o.dot ? `<span class="ns-chart__dot" style="background:var(--ns-chart-series-${o.dot})"></span>` : ""}${esc(k[0])}</span>${o.titleOnly ? "" : `<span class="ns-chart__value${o.sm ? " ns-chart__value--sm" : ""}">${esc(k[1])}<span class="ns-chart__trend">${esc(k[2])}</span></span><span class="ns-chart__desc${o.sm ? " ns-chart__desc--sm" : ""}">${esc(o.compact && k[4] ? k[4] : k[3])}</span>`}</div>`;

  const card = (id, size = "Medium", icon = true) => {
    const d = DEFS[id], K = d.kpi, S = d.sum, ic = icon ? barIcon : "", w = SIZES[size][0], plot = svg(id, size);
    if (size === "Small") return `<div class="ns-chart ns-chart--small" style="width:${w}px">${kpi(K, { sm: true, compact: true })}${plot}${ic}</div>`;
    if (size === "Vertical small") return `<div class="ns-chart ns-chart--vertical" style="width:${w}px"><div class="ns-chart__head">${kpi(K, { sm: true, compact: true })}${ic}</div>${plot}</div>`;
    if (size === "Large") return `<div class="ns-chart" style="width:${w}px"><div class="ns-chart__head">${kpi(K, { lg: true, titleOnly: true })}${ic}</div>${plot}<div class="ns-chart__summary">${kpi(K, { dot: 1, sm: true })}${kpi(S[0], { dot: 3, sm: true })}</div></div>`;
    if (size === "XL") return `<div class="ns-chart" style="width:${w}px"><div class="ns-chart__head"><div class="ns-chart__kpis">${kpi(K, { dot: 1 })}${kpi(S[0], { dot: 3 })}${kpi(S[1], { dot: 2 })}</div>${ic}</div>${plot}</div>`;
    return `<div class="ns-chart" style="width:${w}px"><div class="ns-chart__head">${kpi(K)}${ic}</div>${plot}</div>`;
  };

  NS.chartKit = { H, defs: DEFS, svg, card, sizes: SIZES };
})();
