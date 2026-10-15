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
