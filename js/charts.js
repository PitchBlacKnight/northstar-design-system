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
    /* Overlays: marks any chart can lay over its plot. Behind the data: span (weekends, a reference area)
       and band (a goal range). Over the data: rule (a threshold), deadline, trend, projection and marker.
       Dashed strokes use da; every overlay is a plain rect, path, circle or text, so Figma draws them too. */
    span: (x0, x1, y0, y1, n = "Span", f = "band", o) => ({ k: "rect", x: Math.min(x0, x1), y: y0, w: Math.abs(x1 - x0), h: y1 - y0, f, o, n }),
    band: (x0, x1, ya, yb, n = "Reference band", f = "s2") => ({ k: "rect", x: x0, y: Math.min(ya, yb), w: x1 - x0, h: Math.abs(yb - ya), f, o: 0.14, n }),
    rule: (x0, x1, y, n = "Reference line", sk = "target") => ({ k: "path", d: `M${x0.toFixed(1)} ${y.toFixed(1)}L${x1.toFixed(1)} ${y.toFixed(1)}`, sk, sw: 1.5, da: "4 4", n }),
    deadline: (x, y0, y1, s, n = "Deadline") => [{ k: "path", d: `M${x.toFixed(1)} ${y0.toFixed(1)}L${x.toFixed(1)} ${y1.toFixed(1)}`, sk: "target", sw: 1.5, da: "3 3", n }, ...(s ? [{ k: "text", x: x - 4, y: y0 + 8, s, a: "end", n: n + " label" }] : [])],
    /* least-squares line through points [[x, y]], drawn across their x range */
    trend: (P, n = "Trend line", sk = "target") => {
      const k = P.length, mx = P.reduce((a, p) => a + p[0], 0) / k, my = P.reduce((a, p) => a + p[1], 0) / k;
      const sxx = P.reduce((a, p) => a + (p[0] - mx) ** 2, 0) || 1, m = P.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0) / sxx;
      const xa = Math.min(...P.map((p) => p[0])), xb = Math.max(...P.map((p) => p[0]));
      return { k: "path", d: H.poly([[xa, my + m * (xa - mx)], [xb, my + m * (xb - mx)]]), sk, sw: 1.5, so: 0.7, n };
    },
    projection: (P, sk = "s1", n = "Projection") => [{ k: "path", d: H.poly(P), sk, sw: 2, da: "5 5", n }, { k: "circle", cx: P[P.length - 1][0], cy: P[P.length - 1][1], r: 4, f: "bg", sk, sw: 2, n: n + " end" }],
    marker: (cx, cy, s, n = "Marker", sk = "s1") => [{ k: "circle", cx, cy, r: 5, f: "bg", sk, sw: 2, n }, ...(s ? [{ k: "text", x: cx, y: cy - 14, s, a: "middle", f: "text", n: n + " label" }] : [])],
  };

  const DEFS = {};
  /* @defs-start */
  DEFS.bubble = {
    name: "Bubble",
    alt: "Bubble chart: the top eight of 1,240 accounts, bubble size shows active seats",
    kpi: ["Accounts", "1,240", "+2.4%", "Top 8 accounts shown, size is active seats", "Top 8 shown"],
    sum: [["Largest", "312", "+1.2%", "Top account", "Top account"], ["Smallest", "32", "+0.4%", "Lowest tier", "Lowest tier"]],
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
    kpi: ["Index", "4,880", "+0.8%", "Open, close, high and low", "Daily range"],
    sum: [["Highest", "4,910", "+1.1%", "Session high", "Session high"], ["Lowest", "4,610", "+0.2%", "Session low", "Session low"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb;
      const D = [[0.40, 0.52, 0.34, 0.58], [0.52, 0.46, 0.40, 0.60], [0.46, 0.60, 0.42, 0.66], [0.60, 0.70, 0.55, 0.74], [0.70, 0.62, 0.56, 0.78], [0.62, 0.55, 0.50, 0.68], [0.55, 0.68, 0.50, 0.72], [0.68, 0.80, 0.64, 0.86], [0.80, 0.74, 0.70, 0.88], [0.74, 0.84, 0.70, 0.90]].slice(0, c ? 8 : 10);
      const step = pw / D.length, bw = Math.max(4, step * 0.5), Y = (v) => ph - 4 - v * (ph - 8);
      const g = c ? [] : [...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["5.0k", "4.8k", "4.6k", "4.4k"]), ...H.xlab(ml + step / 2, w - step / 2, h - 8, ["Mon", "Wed", "Fri"])];
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
    sum: [["Trial", "6,045", "+1.4%", "Started a trial", "Started trial"], ["Active", "2,376", "+0.9%", "Active at day 30", "Active day 30"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 72, pw = w - ml, n = 5, gap = c ? 3 : 6, bh = (h - gap * (n - 1)) / n;
      const V = [1, 0.78, 0.56, 0.38, 0.22], L = ["Visits", "Signups", "Trial", "Paid", "Active"], out = [];
      V.forEach((v, i) => {
        const bw = pw * v, y = i * (bh + gap);
        out.push({ k: "rect", x: ml + (pw - bw) / 2, y, w: bw, h: bh, r: Math.min(12, bh / 2), f: "s1", o: 1 - i * 0.16, n: "Stage " + (i + 1) });
        if (!c) out.push({ k: "text", x: 0, y: y + bh / 2, s: L[i], a: "start", n: "Stage label" });
      });
      return out;
    },
  };
  DEFS.dumbbell = {
    name: "Dumbbell",
    alt: "Dumbbell chart: five rows, each joining a before value and an after value",
    kpi: ["Satisfaction", "4.6", "+0.3%", "Before and after the change", "Before vs after"],
    sum: [["Largest gap", "0.65", "+0.2%", "Biggest improvement", "Biggest gain"], ["Smallest gap", "0.30", "+0.1%", "Least movement", "Least movement"]],
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
    sum: [["Busiest", "Wed", "+2.0%", "Peak weekday", "Peak weekday"], ["Quietest", "Mon", "+0.6%", "Lowest weekday", "Lowest weekday"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 34, mb = c ? 0 : 22, cols = c ? 8 : 12, rows = c ? 4 : 5, gap = c ? 2 : 3, pw = w - ml, ph = h - mb;
      const cw = (pw - gap * (cols - 1)) / cols, ch = (ph - gap * (rows - 1)) / rows, D = ["Mon", "Tue", "Wed", "Thu", "Fri"], out = [];
      for (let r = 0; r < rows; r++) {
        if (!c) out.push({ k: "text", x: ml - 8, y: r * (ch + gap) + ch / 2, s: D[r], a: "end", n: "Row label" });
        for (let k = 0; k < cols; k++) {
          const v = ((r * 4 + k * 5 + r * k) % 10) / 9;
          out.push({ k: "rect", x: ml + k * (cw + gap), y: r * (ch + gap), w: cw, h: ch, r: c ? 1 : 3, f: "s1", o: 0.12 + 0.88 * v, n: "Cell " + (r + 1) + "-" + (k + 1) });
        }
      }
      if (!c) out.push(...H.xlab(ml + cw / 2, w - cw / 2, h - 8, ["6a", "12p", "6p"]));
      return out;
    },
  };
  DEFS.parallel = {
    name: "Parallel coordinates",
    alt: "Parallel coordinates: four of 128 profiles across five measures, one line per profile",
    kpi: ["Profiles", "128", "+4.0%", "4 of 128 profiles shown across five measures", "4 shown"],
    sum: [["Strongest", "Cost", "+1.2%", "Highest average", "Highest avg"], ["Weakest", "Reach", "+0.5%", "Lowest average", "Lowest avg"]],
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
    sum: [["Previous", "2,000", "+1.0%", "Before the last change", "Before change"], ["Second plan", "1,950", "+1.5%", "Current limit of series 2", "Series 2"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb;
      const A = [0.30, 0.30, 0.50, 0.45, 0.70, 0.60, 0.67, 0.80], B = [0.20, 0.35, 0.30, 0.50, 0.40, 0.55, 0.50, 0.65];
      const dx = pw / (A.length - 1), Y = (v) => ph - 4 - v * (ph - 8);
      const step = (V) => { let d = "M" + ml + " " + Y(V[0]).toFixed(1); for (let i = 1; i < V.length; i++) { const x = (ml + dx * i).toFixed(1); d += "L" + x + " " + Y(V[i - 1]).toFixed(1) + "L" + x + " " + Y(V[i]).toFixed(1); } return d; };
      const g = c ? [] : [...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["3k", "2k", "1k", "0"]), ...H.xlab(ml + 12, w - 12, h - 8, ["Jan", "Apr", "Jul", "Oct"])];
      return [...g, { k: "path", d: step(B), sk: "s3", sw: 2, n: "Series 2" }, { k: "path", d: step(A), sk: "s1", sw: 2, n: "Series 1" }];
    },
  };
  DEFS.scatter = {
    name: "Scatter",
    alt: "Scatter plot: 18 of 240 samples on two measures with a rising trend line",
    kpi: ["Samples", "240", "+6.2%", "18 of 240 samples shown, two measures each", "18 shown"],
    sum: [["Trend", "Up", "+1.0%", "Positive relationship", "Positive"], ["Outliers", "6", "+0.3%", "Far from the trend", "Far from trend"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb;
      const g = c ? [] : [...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["100", "75", "50", "25"]), ...H.xlab(ml + 6, w - 6, h - 8, ["0", "5", "10"])];
      const pts = Array.from({ length: c ? 12 : 18 }, (_, i) => { const x = ((i * 37) % 100) / 100; return [x, Math.max(0.06, Math.min(0.94, 0.2 + 0.6 * x + ((((i * 53) % 17) / 17) - 0.5) * 0.35)), i % 3 === 0 ? "s2" : "s1"]; });
      return [...g, { k: "path", d: "M" + (ml + 4) + " " + (ph - 0.2 * ph).toFixed(1) + "L" + (w - 4) + " " + (ph - 0.8 * ph).toFixed(1), sk: "target", sw: 1.5, n: "Trend line" },
        ...pts.map((p, i) => ({ k: "circle", cx: ml + 4 + p[0] * (pw - 8), cy: ph - p[1] * ph, r: c ? 3 : 4, f: p[2], o: 0.85, n: "Point " + (i + 1) }))];
    },
  };
  DEFS.gauge = {
    name: "Gauge",
    alt: "Gauge: 72 percent of the limit is used",
    kpi: ["Capacity", "72%", "+4.0%", "Share of the limit used", "Of the limit"],
    sum: [["Used", "72", "+4.0%", "Units in use", "Units in use"], ["Free", "28", "+1.0%", "Units available", "Available"]],
    prims: (w, h, o) => {
      const c = o.compact, cx = w / 2, cy = h - (c ? 6 : 18), ro = Math.min(w / 2 - 4, cy - 6), ri = ro * 0.72, a = -90 + 180 * 0.72;
      const out = [{ k: "arc", cx, cy, ro, ri, a0: -90, a1: 90, f: "track", n: "Track" }, { k: "arc", cx, cy, ro, ri, a0: -90, a1: a, f: "s1", n: "Value" },
        { k: "text", x: cx, y: cy - ro * 0.3, s: "72%", a: "middle", size: c ? 14 : 24, w: "Bold", f: "text", n: "Gauge value" }];
      if (!c) out.push({ k: "text", x: cx - (ro + ri) / 2, y: cy + 10, s: "0", a: "middle", n: "Min" }, { k: "text", x: cx + (ro + ri) / 2, y: cy + 10, s: "100", a: "middle", n: "Max" });
      return out;
    },
  };
  DEFS.radialbar = {
    name: "Radial bar",
    alt: "Radial bar chart: four goals, each a ring filled toward a target",
    kpi: ["Progress", "54%", "+5.0%", "Average of four goals", "Goal average"],
    sum: [["Closest", "Goal A", "+2.0%", "Nearest to target", "Nearest"], ["Furthest", "Goal D", "+0.8%", "Furthest from target", "Furthest"]],
    prims: (w, h, o) => {
      const c = o.compact, cx = w / 2, cy = h / 2, R0 = Math.min(w, h) / 2 - 2, t = R0 * (c ? 0.14 : 0.11), gap = R0 * 0.05, V = [0.80, 0.62, 0.45, 0.30], out = [];
      V.forEach((v, i) => {
        const ro = R0 - i * (t + gap), ri = ro - t;
        out.push({ k: "arc", cx, cy, ro, ri, a0: 0, a1: 270, f: "track", round: true, n: "Track " + (i + 1) });
        out.push({ k: "arc", cx, cy, ro, ri, a0: 0, a1: 270 * v, f: "s" + (i + 1), round: true, n: "Ring " + (i + 1) });
      });
      return out;
    },
  };
  DEFS.radialhist = {
    name: "Radial histogram",
    alt: "Radial histogram: 24 bars around a circle, one per hour of the day",
    kpi: ["Requests", "1,860", "+2.2%", "By hour, around the clock", "By hour"],
    sum: [["Peak", "2 pm", "+1.5%", "Busiest hour", "Busiest"], ["Low", "4 am", "+0.3%", "Quietest hour", "Quietest"]],
    prims: (w, h, o) => {
      const c = o.compact, cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 2, r0 = R * 0.28, N = 24, out = [];
      for (let i = 0; i < N; i++) {
        const a = (i - 14 + 24) % 24, t = a <= 14 ? a / 14 : (24 - a) / 10, v = 0.3 + 0.7 * (0.5 + 0.5 * Math.cos(Math.PI * t));
        out.push({ k: "arc", cx, cy, ro: r0 + (R - r0) * v, ri: r0, a0: i * 15 + 1, a1: (i + 1) * 15 - 1, f: i % 6 === 0 ? "s2" : "s1", n: "Bar " + (i + 1) });
      }
      return out;
    },
  };
  DEFS.radar = {
    name: "Radar",
    alt: "Radar chart: two series across six measures",
    kpi: ["Coverage", "68%", "+3.0%", "Average of series 1 across six skills", "Series 1 average"],
    sum: [["Strongest", "Score", "+1.1%", "Highest in series 1", "Highest"], ["Weakest", "Rate", "+0.4%", "Lowest in series 1", "Lowest"]],
    prims: (w, h, o) => {
      const c = o.compact, cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - (c ? 4 : 18), N = 6, out = [];
      const P = (r, i) => [cx + r * Math.sin((i * 360 / N * Math.PI) / 180), cy - r * Math.cos((i * 360 / N * Math.PI) / 180)];
      const ring = (f) => H.poly(Array.from({ length: N }, (_, i) => P(R * f, i))) + "Z";
      [1, 0.66, 0.33].forEach((f, k) => out.push({ k: "path", d: ring(f), sk: "grid", sw: 1, n: "Ring " + (k + 1) }));
      for (let i = 0; i < N; i++) out.push({ k: "path", d: H.poly([[cx, cy], P(R, i)]), sk: "grid", sw: 1, n: "Axis " + (i + 1) });
      const S = [[0.80, 0.60, 0.70, 0.50, 0.90, 0.60, "s3"], [0.50, 0.80, 0.40, 0.70, 0.50, 0.40, "s1"]];
      S.forEach((s, j) => out.push({ k: "path", d: H.poly(s.slice(0, N).map((v, i) => P(R * v, i))) + "Z", f: s[N], o: 0.22, sk: s[N], sw: 2, n: "Series " + (j + 1) }));
      if (!c) ["Speed", "Cost", "Reach", "Rate", "Score", "Trust"].forEach((s, i) => { const p = P(R + 12, i); out.push({ k: "text", x: p[0], y: p[1], s, a: "middle", n: "Axis label" }); });
      return out;
    },
  };
  DEFS.convergence = {
    name: "Radial convergence",
    alt: "Radial convergence chart: twelve nodes on a ring joined by eight links",
    kpi: ["Links", "8", "+2.0%", "Twelve nodes joined across a ring", "Nodes joined"],
    sum: [["Most linked", "Node 3", "+1.0%", "Three connections", "Most links"], ["Least linked", "8 nodes", "+0.2%", "One connection each", "Fewest links"]],
    prims: (w, h, o) => {
      const c = o.compact, cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 6, N = 12, out = [];
      const P = (i) => [cx + R * Math.sin((i * 30 * Math.PI) / 180), cy - R * Math.cos((i * 30 * Math.PI) / 180)];
      [[0, 5], [1, 7], [2, 9], [3, 10], [4, 8], [6, 11], [0, 2], [2, 6]].forEach((e, i) => out.push({ k: "path", d: H.poly([P(e[0]), P(e[1])]), sk: i % 2 ? "s2" : "s1", sw: 1.5, n: "Link " + (i + 1) }));
      for (let i = 0; i < N; i++) { const p = P(i); out.push({ k: "circle", cx: p[0], cy: p[1], r: c ? 2.5 : 4, f: "text", n: "Node " + (i + 1) }); }
      return out;
    },
  };
  DEFS.sunburst = {
    name: "Sunburst",
    alt: "Sunburst chart: three groups in the inner ring, eight items in the outer ring",
    kpi: ["Categories", "11", "+2.0%", "Two levels, one ring each", "Two levels"],
    sum: [["Largest", "Group A", "+1.0%", "Biggest parent", "Biggest"], ["Smallest", "Group C", "+0.2%", "Smallest parent", "Smallest"]],
    prims: (w, h, o) => {
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 2, out = [], g = 0.8;
      const inner = [[0, 150, "s1"], [150, 260, "s2"], [260, 360, "s3"]];
      const outer = [[0, 70, "s1"], [70, 110, "s1"], [110, 150, "s1"], [150, 215, "s2"], [215, 260, "s2"], [260, 300, "s3"], [300, 330, "s3"], [330, 360, "s3"]];
      inner.forEach((s, i) => out.push({ k: "arc", cx, cy, ro: R * 0.55, ri: R * 0.2, a0: s[0] + g, a1: s[1] - g, f: s[2], n: "Group " + (i + 1) }));
      outer.forEach((s, i) => out.push({ k: "arc", cx, cy, ro: R, ri: R * 0.58, a0: s[0] + g, a1: s[1] - g, f: s[2], o: 0.6, n: "Item " + (i + 1) }));
      return out;
    },
  };
  DEFS.tree = {
    name: "Tree",
    alt: "Tree chart: one root, two branches and four leaves",
    kpi: ["Teams", "7", "+1.0%", "One root, two levels", "Two levels"],
    sum: [["Branches", "2", "+0.5%", "Second level", "Second level"], ["Leaves", "4", "+0.5%", "Third level", "Third level"]],
    prims: (w, h, o) => {
      const c = o.compact, mb = c ? 0 : 22, ph = h - mb, x0 = c ? 8 : 12, x2 = w - (c ? 8 : 12), x1 = (x0 + x2) / 2, r = c ? 4 : 6, out = [];
      const L1 = [ph * 0.28, ph * 0.72], L2 = [[ph * 0.14, 0], [ph * 0.38, 0], [ph * 0.62, 1], [ph * 0.86, 1]];
      const elbow = (xa, ya, xb, yb) => { const xm = (xa + xb) / 2; return "M" + xa + " " + ya.toFixed(1) + "L" + xm + " " + ya.toFixed(1) + "L" + xm + " " + yb.toFixed(1) + "L" + xb + " " + yb.toFixed(1); };
      L1.forEach((y, i) => out.push({ k: "path", d: elbow(x0, ph / 2, x1, y), sk: "grid", sw: 1.5, n: "Edge " + (i + 1) }));
      L2.forEach((n, i) => out.push({ k: "path", d: elbow(x1, L1[n[1]], x2, n[0]), sk: "grid", sw: 1.5, n: "Edge " + (i + 3) }));
      out.push({ k: "circle", cx: x0, cy: ph / 2, r, f: "s1", n: "Root" });
      L1.forEach((y, i) => out.push({ k: "circle", cx: x1, cy: y, r, f: "s2", n: "Branch " + (i + 1) }));
      L2.forEach((n, i) => out.push({ k: "circle", cx: x2, cy: n[0], r, f: "s3", n: "Leaf " + (i + 1) }));
      if (!c) out.push(...H.xlab(x0, x2, h - 8, ["Root", "Group", "Item"]));
      return out;
    },
  };
  DEFS.treemap = {
    name: "Treemap",
    alt: "Treemap: five tiles, each sized by its share of the whole",
    kpi: ["Storage", "640 GB", "+3.0%", "Tile size is its share", "Tile is share"],
    sum: [["Largest", "Photos", "+1.5%", "Biggest tile", "Biggest"], ["Smallest", "Docs", "+0.4%", "Smallest tile", "Smallest"]],
    prims: (w, h, o) => {
      const g = o.compact ? 2 : 3, wl = w * 0.55 - g / 2, xr = w * 0.55 + g / 2, wr = w - xr, out = [];
      out.push({ k: "rect", x: 0, y: 0, w: wl, h: h * 0.6 - g / 2, r: 4, f: "s1", o: 0.9, n: "Tile 1" });
      out.push({ k: "rect", x: 0, y: h * 0.6 + g / 2, w: wl, h: h * 0.4 - g / 2, r: 4, f: "s3", o: 0.9, n: "Tile 2" });
      let y = 0;
      [[0.4, "s2"], [0.35, "s4"], [0.25, "s5"]].forEach((t, i) => { const th = (h - 2 * g) * t[0]; out.push({ k: "rect", x: xr, y, w: wr, h: th, r: 4, f: t[1], o: 0.9, n: "Tile " + (i + 3) }); y += th + g; });
      return out;
    },
  };
  DEFS.calendar = {
    name: "Calendar",
    alt: "Calendar heatmap: five weeks of days by weekday, darker days had more activity",
    kpi: ["Active days", "31", "+3.0%", "Days with activity in five weeks", "Five weeks"],
    sum: [["Longest streak", "12", "+1.0%", "Days in a row", "In a row"], ["Quiet days", "4", "+0.5%", "Days without activity", "Quiet"]],
    prims: (w, h, o) => {
      const c = o.compact, hdr = c ? 0 : 18, gap = c ? 2 : 3, cw = (w - gap * 6) / 7, ch = (h - hdr - gap * 4) / 5, out = [];
      for (let r = 0; r < 5; r++) for (let k = 0; k < 7; k++) {
        const v = ((r * 5 + k * 3 + r * k) % 7) / 6, today = r === 2 && k === 3;
        out.push({ k: "rect", x: k * (cw + gap), y: hdr + r * (ch + gap), w: cw, h: ch, r: c ? 2 : 4, f: "s1", o: 0.1 + 0.9 * v, ...(today ? { sk: "target", sw: 2 } : {}), n: "Day " + (r * 7 + k + 1) });
      }
      if (!c) out.push(...H.xlab(cw / 2, w - cw / 2, 6, ["M", "T", "W", "T", "F", "S", "S"]));
      return out;
    },
  };
  DEFS.bar = {
    name: "Bar",
    alt: "Bar chart: monthly orders for twelve months, the latest month is the tallest",
    kpi: ["Orders", "12,480", "+4.2%", "Monthly orders over twelve months", "Last 12 months"],
    sum: [["Best month", "Dec", "+1.6%", "Highest monthly total", "Highest month"], ["Average", "1,040", "+0.8%", "Orders per month", "Per month"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb;
      const V = [0.42, 0.55, 0.48, 0.62, 0.58, 0.70, 0.52, 0.66, 0.74, 0.68, 0.80, 0.92].slice(c ? 4 : 0);
      const step = pw / V.length, bw = Math.max(3, step * 0.56);
      const g = c ? [] : [...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["1.5k", "1k", "500", "0"]), ...H.xlab(ml + step / 2, w - step / 2, h - 8, ["Jan", "Apr", "Jul", "Oct", "Dec"])];
      return [...g, ...V.map((v, i) => { const bh = v * (ph - 4); return { k: "rect", x: ml + step * i + (step - bw) / 2, y: ph - bh, w: bw, h: bh, r: Math.min(12, bw / 2), f: i === V.length - 1 ? "s1" : "s2", n: "Bar " + (i + 1) }; })];
    },
  };
  DEFS.line = {
    name: "Line",
    alt: "Line chart: revenue this year against last year, this year ends higher",
    kpi: ["Revenue", "$84,200", "+6.1%", "This year against last year", "Vs last year"],
    sum: [["Last year", "$79,350", "+2.2%", "Same period last year", "Last year"], ["Peak", "$9,800", "+1.4%", "Highest month", "Highest month"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb;
      const A = [0.30, 0.42, 0.38, 0.55, 0.50, 0.64, 0.60, 0.76], B = [0.28, 0.30, 0.40, 0.36, 0.46, 0.44, 0.52, 0.56];
      const dx = pw / (A.length - 1), Y = (v) => ph - 4 - v * (ph - 8), P = (V) => V.map((v, i) => [ml + dx * i, Y(v)]);
      const g = c ? [] : [...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["$12k", "$8k", "$4k", "0"]), ...H.xlab(ml + 12, w - 12, h - 8, ["Jan", "Apr", "Jul", "Oct"])];
      const a = P(A), end = a[a.length - 1];
      return [...g,
        { k: "path", d: H.poly([...a, [w, ph], [ml, ph]]) + " Z", f: "s1", o: 0.12, n: "Area" },
        { k: "path", d: H.poly(P(B)), sk: "s3", sw: 2, n: "Last year" },
        { k: "path", d: H.poly(a), sk: "s1", sw: 2, n: "This year" },
        { k: "circle", cx: end[0] - 4, cy: end[1], r: c ? 3 : 4, f: "s1", n: "Latest point" }];
    },
  };
  DEFS.pie = {
    name: "Pie",
    alt: "Donut chart: traffic by channel, search 42%, direct 28%, social 18%, email 12%",
    kpi: ["Visits", "48,300", "+3.4%", "Share of visits by channel", "By channel"],
    sum: [["Social", "18%", "+1.1%", "Third channel", "Third"], ["Direct", "28%", "+0.4%", "Second channel", "Second"]],
    prims: (w, h, o) => {
      const c = o.compact, key = !c && w >= 280, lw = key ? 120 : 0, R = Math.min(w - lw, h) / 2 - 2, cx = (w - lw) / 2, cy = h / 2;
      const V = [["Search", 0.42], ["Direct", 0.28], ["Social", 0.18], ["Email", 0.12]], gap = 1.5, out = [];
      let a = 0;
      V.forEach(([, v], i) => { const a1 = a + v * 360; out.push({ k: "arc", cx, cy, ro: R, ri: R * 0.62, a0: a + gap / 2, a1: a1 - gap / 2, f: "s" + (i + 1), n: "Segment " + (i + 1) }); a = a1; });
      if (!c) {
        out.push({ k: "text", x: cx, y: cy, s: "42%", a: "middle", f: "text", size: 18, w: "Bold", n: "Center value" });
        if (key) V.forEach(([l, v], i) => {
          const y = cy + (i - 1.5) * 22;
          out.push({ k: "rect", x: w - lw + 8, y: y - 4, w: 8, h: 8, r: 2, f: "s" + (i + 1), n: "Key " + (i + 1) });
          out.push({ k: "text", x: w - lw + 22, y, s: l + " " + Math.round(v * 100) + "%", a: "start", n: "Key label" });
        });
      }
      return out;
    },
  };
  DEFS.sankey = {
    name: "Sankey",
    alt: "Sankey diagram: three sources flow into paid and free plans, band width shows volume",
    kpi: ["New accounts", "6,200", "+2.8%", "Where accounts came from and which plan they chose", "Source to plan"],
    sum: [["Ads", "20%", "+1.3%", "Share of new accounts from ads", "From ads"], ["Referral", "35%", "+0.9%", "Share from referrals", "From referrals"]],
    prims: (w, h, o) => {
      const c = o.compact, nw = c ? 6 : 10, gap = c ? 4 : 8, ph = h;
      const S = [["Search", 0.45], ["Referral", 0.35], ["Ads", 0.20]], T = [["Paid", 0.6], ["Free", 0.4]];
      const F = [[0, 0, 0.30], [0, 1, 0.15], [1, 0, 0.20], [1, 1, 0.15], [2, 0, 0.10], [2, 1, 0.10]];
      const stack = (N) => { const u = ph - gap * (N.length - 1); let y = 0; return N.map(([, v]) => { const r = [y, v * u]; y += v * u + gap; return r; }); };
      const sy = stack(S), ty = stack(T), u = ph - gap * 2, ut = ph - gap, so = sy.map((r) => r[0]), to = ty.map((r) => r[0]);
      const x0 = nw, x1 = w - nw, mx = (x0 + x1) / 2, out = [];
      F.forEach(([s, t, v], i) => {
        const a0 = so[s], a1 = a0 + v * u, b0 = to[t], b1 = b0 + v * ut; so[s] = a1; to[t] = b1;
        out.push({ k: "path", d: `M${x0} ${a0.toFixed(1)}C${mx} ${a0.toFixed(1)} ${mx} ${b0.toFixed(1)} ${x1} ${b0.toFixed(1)}L${x1} ${b1.toFixed(1)}C${mx} ${b1.toFixed(1)} ${mx} ${a1.toFixed(1)} ${x0} ${a1.toFixed(1)}Z`, f: "s" + (s + 1), o: 0.35, n: "Flow " + (i + 1) });
      });
      sy.forEach(([y, hh], i) => out.push({ k: "rect", x: 0, y, w: nw, h: hh, r: 2, f: "s" + (i + 1), n: "Source " + (i + 1) }));
      ty.forEach(([y, hh], i) => out.push({ k: "rect", x: x1, y, w: nw, h: hh, r: 2, f: "target", n: "Target " + (i + 1) }));
      if (!c) {
        sy.forEach(([y, hh], i) => out.push({ k: "text", x: nw + 6, y: y + hh / 2, s: S[i][0], a: "start", f: "text", n: "Source label" }));
        ty.forEach(([y, hh], i) => out.push({ k: "text", x: x1 - 6, y: y + hh / 2, s: T[i][0], a: "end", f: "text", n: "Target label" }));
      }
      return out;
    },
  };
  DEFS.area = {
    name: "Area",
    alt: "Stacked area chart: organic and paid sessions over eight months, both rising, paid stacked on top",
    kpi: ["Sessions", "212,400", "+5.4%", "Organic below, paid stacked above", "Organic + paid"],
    sum: [["Paid", "74,300", "+1.5%", "Upper band", "Upper band"], ["Best month", "Aug", "+0.9%", "Highest total", "Highest total"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb;
      const A = [0.22, 0.26, 0.25, 0.31, 0.30, 0.36, 0.38, 0.44], B = [0.12, 0.14, 0.18, 0.16, 0.20, 0.22, 0.21, 0.26];
      const dx = pw / (A.length - 1), Y = (v) => ph - 2 - v * (ph - 6), X = (i) => ml + dx * i;
      const low = A.map((v, i) => [X(i), Y(v)]), top = A.map((v, i) => [X(i), Y(v + B[i])]);
      const g = c ? [] : [...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["30k", "20k", "10k", "0"]), ...H.xlab(ml + 12, w - 12, h - 8, ["Jan", "Mar", "May", "Aug"])];
      return [...g,
        { k: "path", d: H.poly([...low, [X(A.length - 1), Y(0)], [ml, Y(0)]]) + " Z", f: "s1", o: 0.5, n: "Organic" },
        { k: "path", d: H.poly([...top, ...low.slice().reverse()]) + " Z", f: "s3", o: 0.4, n: "Paid" },
        { k: "path", d: H.poly(low), sk: "s1", sw: 2, n: "Organic edge" },
        { k: "path", d: H.poly(top), sk: "s3", sw: 2, n: "Paid edge" }];
    },
  };
  DEFS.composed = {
    name: "Composed",
    alt: "Composed chart: monthly orders as bars and the conversion rate as a line on its own scale, both rising",
    kpi: ["Orders", "9,860", "+3.1%", "Orders as bars, conversion as a line", "Orders and rate"],
    sum: [["Conversion", "3.4%", "+0.2%", "Line, right-hand scale", "Right scale"], ["Best month", "Oct", "+1.0%", "Most orders", "Most orders"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mr = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml - mr, ph = h - mb;
      const V = [0.40, 0.52, 0.46, 0.58, 0.55, 0.64, 0.60, 0.72, 0.68, 0.80].slice(c ? 3 : 0), R = [0.55, 0.50, 0.58, 0.62, 0.57, 0.66, 0.70, 0.68, 0.76, 0.84].slice(c ? 3 : 0);
      const step = pw / V.length, bw = Math.max(3, step * 0.5), Y = (v) => ph - 4 - v * (ph - 12), X = (i) => ml + step * (i + 0.5);
      const g = c ? [] : [...H.hgrid(ml, w - mr, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["1.2k", "800", "400", "0"]), ...["4%", "3%", "2%", "1%"].map((s, i) => ({ k: "text", x: w - mr + 8, y: (ph * i) / 3, s, a: "start", n: "Right axis label" })), ...H.xlab(X(0), X(V.length - 1), h - 8, ["Jan", "Apr", "Jul", "Oct"])];
      const line = R.map((v, i) => [X(i), Y(v)]), end = line[line.length - 1];
      return [...g,
        ...V.map((v, i) => { const bh = v * (ph - 4); return { k: "rect", x: X(i) - bw / 2, y: ph - bh, w: bw, h: bh, r: Math.min(12, bw / 2), f: "s1", o: 0.85, n: "Bar " + (i + 1) }; }),
        { k: "path", d: H.poly(line), sk: "s3", sw: 2.5, n: "Conversion" },
        { k: "circle", cx: end[0], cy: end[1], r: c ? 3 : 4, f: "s3", n: "Latest rate" }];
    },
  };
  DEFS.profitloss = {
    name: "Profit and loss",
    alt: "Profit and loss line: twelve months of net result around zero, four months fall below zero",
    kpi: ["Net result", "$18,400", "+2.6%", "Monthly net, above and below zero", "Above and below zero"],
    sum: [["Best month", "$6,200", "+1.8%", "Largest gain", "Largest gain"], ["Months in profit", "8", "+1", "Of twelve months", "Of 12"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 36, mb = c ? 0 : 22, pw = w - ml, ph = h - mb, mid = ph / 2, amp = ph / 2 - 6;
      const V = [0.20, 0.35, 0.10, -0.15, -0.30, -0.05, 0.25, 0.45, 0.30, -0.10, 0.40, 0.60];
      const dx = pw / (V.length - 1), X = (i) => ml + dx * i, Y = (v) => mid - v * amp;
      /* split the line where it crosses zero, so each piece takes one color and one fill */
      const segs = []; let cur = [[X(0), Y(V[0])]], up = V[0] >= 0;
      for (let i = 1; i < V.length; i++) {
        if ((V[i] >= 0) !== up) { const t = V[i - 1] / (V[i - 1] - V[i]), cross = [X(i - 1) + t * dx, mid]; cur.push(cross); segs.push([up, cur]); cur = [cross]; up = !up; }
        cur.push([X(i), Y(V[i])]);
      }
      segs.push([up, cur]);
      const g = c ? [] : [...H.ylab(ml - 8, 6, ph - 6, ["+$6k", "0", "-$6k"]), ...H.xlab(ml + 12, w - 12, h - 8, ["Jan", "Apr", "Jul", "Oct", "Dec"])];
      const out = [...g, { k: "rect", x: ml, y: mid - 0.5, w: pw, h: 1, f: "target", n: "Zero line" }];
      segs.forEach(([u, P], i) => out.push({ k: "path", d: H.poly([...P, [P[P.length - 1][0], mid], [P[0][0], mid]]) + " Z", f: u ? "ok" : "err", o: 0.16, n: (u ? "Gain" : "Loss") + " area " + (i + 1) }));
      segs.forEach(([u, P], i) => out.push({ k: "path", d: H.poly(P), sk: u ? "ok" : "err", sw: 2, n: (u ? "Gain" : "Loss") + " line " + (i + 1) }));
      return out;
    },
  };
  DEFS.choropleth = {
    name: "Choropleth",
    alt: "Tile map choropleth: one square per US state, darker states have more active accounts, two states have no data",
    kpi: ["Active accounts", "41,200", "+2.9%", "By state, darker is more", "By state"],
    sum: [["Top state", "CA", "+1.2%", "Most accounts", "Most accounts"], ["States reporting", "48", "+2", "Of 50 states", "Of 50"]],
    /* tile grid: [state, column, row] on a 12 by 8 grid */
    tiles: [["AK", 0, 0], ["ME", 11, 0], ["WI", 6, 1], ["VT", 10, 1], ["NH", 11, 1], ["WA", 1, 2], ["ID", 2, 2], ["MT", 3, 2], ["ND", 4, 2], ["MN", 5, 2], ["IL", 6, 2], ["MI", 7, 2], ["NY", 9, 2], ["MA", 10, 2],
      ["OR", 1, 3], ["NV", 2, 3], ["WY", 3, 3], ["SD", 4, 3], ["IA", 5, 3], ["IN", 6, 3], ["OH", 7, 3], ["PA", 8, 3], ["NJ", 9, 3], ["CT", 10, 3], ["RI", 11, 3],
      ["CA", 1, 4], ["UT", 2, 4], ["CO", 3, 4], ["NE", 4, 4], ["MO", 5, 4], ["KY", 6, 4], ["WV", 7, 4], ["VA", 8, 4], ["MD", 9, 4], ["DE", 10, 4],
      ["AZ", 2, 5], ["NM", 3, 5], ["KS", 4, 5], ["AR", 5, 5], ["TN", 6, 5], ["NC", 7, 5], ["SC", 8, 5], ["OK", 4, 6], ["LA", 5, 6], ["MS", 6, 6], ["AL", 7, 6], ["GA", 8, 6], ["HI", 0, 7], ["TX", 4, 7], ["FL", 9, 7]],
    prims: (w, h, o) => {
      const c = o.compact, mb = c ? 0 : 24, gap = c ? 1.5 : 3, ph = h - mb, T = DEFS.choropleth.tiles;
      const s = Math.max(2, Math.min((w - gap * 11) / 12, (ph - gap * 7) / 8)), x0 = (w - (s * 12 + gap * 11)) / 2, y0 = (ph - (s * 8 + gap * 7)) / 2;
      const STEP = [0.18, 0.38, 0.58, 0.78, 1], none = { WY: 1, ND: 1 }, out = [];
      T.forEach(([st, col, row], i) => {
        const v = st === "CA" ? 4 : st === "TX" || st === "NY" ? 3 : (i * 7 + col * 3 + row * 5) % 5, x = x0 + col * (s + gap), y = y0 + row * (s + gap);
        out.push(none[st] ? { k: "rect", x, y, w: s, h: s, r: c ? 1 : 3, f: "track", n: st + " (no data)" } : { k: "rect", x, y, w: s, h: s, r: c ? 1 : 3, f: "s1", o: STEP[v], n: st });
      });
      if (!c) {
        /* Fewer [five steps] More, then the no-data key: about 250px in one centred row. Narrower plots drop
           the no-data key, then the words, so the legend never runs past the plot. */
        const k = 12, ly = h - 8, words = w >= 200, nd = w >= 270, lx = w / 2 - (nd ? 82 : words ? 40 : 38);
        if (words) out.push({ k: "text", x: lx - 8, y: ly, s: "Fewer", a: "end", n: "Legend low" });
        STEP.forEach((op, i) => out.push({ k: "rect", x: lx + i * (k + 4), y: ly - k / 2, w: k, h: k, r: 2, f: "s1", o: op, n: "Legend step " + (i + 1) }));
        if (words) out.push({ k: "text", x: lx + 5 * k + 16 + 8, y: ly, s: "More", a: "start", n: "Legend high" });
        if (nd) out.push({ k: "rect", x: lx + 120, y: ly - k / 2, w: k, h: k, r: 2, f: "track", n: "Legend no data" }, { k: "text", x: lx + 120 + k + 6, y: ly, s: "No data", a: "start", n: "Legend no data label" });
      }
      return out;
    },
  };
  DEFS.live = {
    name: "Live line",
    live: true,
    alt: "Live line chart: requests per second over the last 60 seconds, updating every second",
    kpi: ["Requests", "1,284/s", "+1.9%", "Last 60 seconds, updates every second", "Last 60 s"],
    sum: [["Peak", "1,460/s", "+0.6%", "Highest in the window", "Window high"], ["Errors", "0.2%", "+0.1%", "Share of failed requests", "Failed"]],
    /* the value at tick k; the window shows ticks t to t + 29, so each tick slides the line one step left */
    at: (k) => 0.48 + 0.18 * Math.sin(k * 0.3) + 0.09 * Math.sin(k * 0.85 + 1) + 0.035 * Math.sin(k * 2.2 + 2),
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mr = c ? 4 : 10, mb = c ? 0 : 22, pw = w - ml - mr, ph = h - mb, N = 30, t = o.t || 0;
      const dx = pw / (N - 1), Y = (v) => ph - 4 - v * (ph - 8);
      const P = Array.from({ length: N }, (_, i) => [ml + dx * i, Y(DEFS.live.at(t + i))]), end = P[N - 1];
      const g = c ? [] : [...H.hgrid(ml, w - mr, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["1.6k", "1.2k", "800", "400"]), ...H.xlab(ml + 14, w - mr - 10, h - 8, ["-60s", "-30s", "Now"])];
      return [...g,
        { k: "path", d: H.poly([...P, [end[0], ph], [ml, ph]]) + " Z", f: "s1", o: 0.12, n: "Area" },
        { k: "path", d: H.poly(P), sk: "s1", sw: 2, n: "Requests" },
        { k: "circle", cx: end[0], cy: end[1], r: c ? 5 : 8, f: "s1", o: 0.2, n: "Now halo" },
        { k: "circle", cx: end[0], cy: end[1], r: c ? 2.5 : 4, f: "s1", n: "Now point" }];
    },
  };
  DEFS.annotated = {
    name: "Annotated line",
    alt: "Annotated line chart: eleven days of signups with weekends shaded, a goal band, a launch deadline, a marked peak and a dashed projection to day fourteen",
    kpi: ["Signups", "1,920", "+7.4%", "Two weeks against the goal band", "Vs goal band"],
    sum: [["Projected", "2,300", "+1.9%", "Dashed line to day 14", "Projection"], ["Peak day", "212", "+0.8%", "Marked on the plot", "Marked"]],
    prims: (w, h, o) => {
      const c = o.compact, ml = c ? 0 : 30, mb = c ? 0 : 22, pw = w - ml, ph = h - mb, N = 14, pad = c ? 3 : 8;
      const V = [0.30, 0.36, 0.33, 0.42, 0.40, 0.28, 0.26, 0.48, 0.55, 0.72, 0.60], F = [0.66, 0.73, 0.80];   /* days 12 to 14 */
      const dx = (pw - pad * 2) / (N - 1), X = (i) => ml + pad + dx * i, Y = (v) => ph - 4 - v * (ph - 8), P = V.map((v, i) => [X(i), Y(v)]);
      const out = [];
      [[5, 6], [12, 13]].forEach(([a, b], i) => out.push(H.span(Math.max(ml, X(a) - dx / 2), Math.min(w, X(b) + dx / 2), 0, ph, "Weekend " + (i + 1))));
      if (!c) out.push(...H.hgrid(ml, w, 0, ph, 4), ...H.ylab(ml - 8, 0, ph, ["300", "200", "100", "0"]), ...H.xlab(ml + 20, w - 22, h - 8, ["Day 1", "Day 7", "Day 14"]));
      out.push(H.band(ml, w, Y(0.45), Y(0.62), "Goal band"));
      if (!c) out.push({ k: "text", x: ml + 6, y: Y(0.62) + 9, s: "Goal", a: "start", n: "Goal label" });
      out.push(...H.deadline(X(11), 0, ph, c ? "" : "Launch"));
      if (o.size === "XL") out.push(H.trend(P));
      out.push({ k: "path", d: H.poly(P), sk: "s1", sw: 2, n: "Signups" });
      out.push(...H.projection([P[P.length - 1], ...F.map((v, i) => [X(V.length + i), Y(v)])]));
      out.push(...H.marker(P[9][0], P[9][1], c ? "" : "Peak 212"));
      return out;
    },
  };
  DEFS.brush = {
    name: "Brush",
    alt: "Brush chart: three years of monthly throughput, a window on the overview strip picks the months shown above",
    kpi: ["Throughput", "18.6k", "+3.3%", "Drag the window to choose the months", "Pick a range"],
    sum: [["Range high", "2.1k", "+0.7%", "Highest month in the window", "Window high"], ["Range low", "1.2k", "+0.3%", "Lowest month in the window", "Window low"]],
    N: 36,
    at: (i) => 0.34 + i * 0.012 + 0.14 * Math.sin(i * 0.7) + 0.06 * Math.sin(i * 1.9 + 1),
    month: (i) => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12] + " " + (2024 + Math.floor(i / 12)),
    /* where the overview strip sits; the behavior below reads the same numbers to turn a drag into a range */
    layout: (w, h, o) => { const c = o.compact, ml = c ? 0 : 30, ov = c ? 20 : 36, gap = c ? 6 : 10, lab = c ? 0 : 20; return { ml, pw: w - ml, fh: h - ov - gap - lab, oy: h - ov, ov }; },
    range: (o) => { const r = o.range || [0.55, 0.9], n = DEFS.brush.N - 1, snap = (v) => Math.round(Math.max(0, Math.min(v, 1)) * n) / n; return [snap(r[0]), snap(r[1])]; },   /* snapped to whole months, so a pan never changes the width */
    prims: (w, h, o) => {
      const B = DEFS.brush, L = B.layout(w, h, o), c = o.compact, N = B.N, [a, b] = B.range(o);
      const i0 = Math.round(a * (N - 1)), i1 = Math.max(i0 + 1, Math.round(b * (N - 1))), n = i1 - i0;
      const FY = (v) => L.fh - 4 - v * (L.fh - 8), OY = (v) => L.oy + L.ov - 3 - v * (L.ov - 6), OX = (i) => L.ml + (L.pw * i) / (N - 1);
      const F = Array.from({ length: n + 1 }, (_, k) => [L.ml + (L.pw * k) / n, FY(B.at(i0 + k))]);
      const x0 = OX(i0), x1 = OX(i1), out = [];
      if (!c) out.push(...H.hgrid(L.ml, w, 0, L.fh, 3), ...H.ylab(L.ml - 8, 0, L.fh, ["2k", "1k", "0"]), ...H.xlab(L.ml + 28, w - 28, L.fh + 11, [B.month(i0), B.month(Math.round((i0 + i1) / 2)), B.month(i1)]));
      out.push({ k: "path", d: H.poly([...F, [w, L.fh], [L.ml, L.fh]]) + " Z", f: "s1", o: 0.12, n: "Focus area" }, { k: "path", d: H.poly(F), sk: "s1", sw: 2, n: "Focus line" });
      out.push({ k: "rect", x: L.ml, y: L.oy, w: L.pw, h: L.ov, r: 4, f: "band", n: "Overview" });
      out.push({ k: "path", d: H.poly(Array.from({ length: N }, (_, i) => [OX(i), OY(B.at(i))])), sk: "s1", sw: 1.5, so: 0.7, n: "Overview line" });
      out.push({ k: "rect", x: x0, y: L.oy, w: x1 - x0, h: L.ov, r: 4, f: "s1", o: 0.14, sk: "s1", sw: 1.5, n: "Brush window" });
      const hh = Math.min(16, L.ov - 8);
      [x0, x1].forEach((x, i) => out.push({ k: "rect", x: x - 3, y: L.oy + (L.ov - hh) / 2, w: 6, h: hh, r: 3, f: "s1", n: i ? "Handle end" : "Handle start" }));
      return out;
    },
    /* the plot is a range slider: Left and Right move the window, Shift with an arrow resizes it */
    aria: (o) => {
      const B = DEFS.brush, [a, b] = B.range(o), i0 = Math.round(a * (B.N - 1)), i1 = Math.max(i0 + 1, Math.round(b * (B.N - 1)));
      return { role: "slider", tabindex: "0", "aria-label": "Throughput range. Left and Right move the window, Shift with Left or Right resizes it", "aria-valuemin": "0", "aria-valuemax": String(B.N - 1), "aria-valuenow": String(i0), "aria-valuetext": B.month(i0) + " to " + B.month(i1) };
    },
  };
  /* @defs-end */

  const TOKV = { s1: "--ns-chart-series-1", s2: "--ns-chart-series-2", s3: "--ns-chart-series-3", s4: "--ns-chart-series-4", s5: "--ns-chart-series-5", track: "--ns-chart-track", target: "--ns-chart-target", label: "--ns-chart-label-text", text: "--ns-text-primary", text2: "--ns-text-secondary", ok: "--ns-status-success", err: "--ns-status-error", warn: "--ns-status-warning", grid: "--ns-widget-grid", bg: "--ns-widget-bg", line: "--ns-border-subtle", band: "--ns-widget-band", muted: "--ns-widget-muted" };
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
    if (p.k === "rect") return `<rect x="${n1(p.x)}" y="${n1(p.y)}" width="${n1(Math.max(0, p.w))}" height="${n1(Math.max(0, p.h))}"${p.r ? ` rx="${p.r}"` : ""} style="${fill(p.f, p.o)}${p.sk ? ";" + stroke(p.sk) + ";stroke-width:" + (p.sw || 1) : ""}"/>`;
    if (p.k === "circle") return `<circle cx="${n1(p.cx)}" cy="${n1(p.cy)}" r="${n1(p.r)}" style="${p.f ? fill(p.f, p.o) : "fill:none"}${p.sk ? ";" + stroke(p.sk) + ";stroke-width:" + (p.sw || 1) : ""}"/>`;
    if (p.k === "arc" && p.round && p.ri > 0 && p.a1 - p.a0 < 359.99) { /* round ends: a stroked centre-line arc, shortened by the cap so the drawn arc still spans a0..a1 */
      const rm = (p.ro + p.ri) / 2, sw = p.ro - p.ri, cap = ((sw / 2) / rm) * (180 / Math.PI), a0 = p.a0 + cap, a1 = Math.max(a0 + 0.01, p.a1 - cap);
      const [x0, y0] = pt(p.cx, p.cy, rm, a0), [x1, y1] = pt(p.cx, p.cy, rm, a1);
      return `<path d="M${n1(x0)} ${n1(y0)}A${n1(rm)} ${n1(rm)} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${n1(x1)} ${n1(y1)}" stroke-linecap="round" style="fill:none;${stroke(p.f, p.o)};stroke-width:${n1(sw)}"/>`;
    }
    if (p.k === "arc") return `<path d="${arcPath(p)}" fill-rule="evenodd" style="${fill(p.f, p.o)}"/>`;
    if (p.k === "path") return `<path d="${p.d}" stroke-linecap="${p.da ? "butt" : "round"}" stroke-linejoin="round"${p.da ? ` stroke-dasharray="${p.da}"` : ""} style="${p.f ? fill(p.f, p.o) : "fill:none"}${p.sk ? ";" + stroke(p.sk, p.so) + ";stroke-width:" + (p.sw || 1.5) : ""}"/>`;
    if (p.k === "text") return `<text x="${n1(p.x)}" y="${n1(p.y)}" text-anchor="${p.a === "end" ? "end" : p.a === "middle" ? "middle" : "start"}" dominant-baseline="middle" font-size="${p.size || (NS.viz ? NS.viz.m.axis : 11)}"${p.w === "Bold" ? ' font-weight="700"' : ""} style="${fill(p.f || "label")}">${p.s}</text>`;
    return "";
  };

  const SIZES = { Small: [330, 120, 64], "Vertical small": [192, 160, 140], Medium: [375, 327, 200], Large: [375, 327, 260], XL: [800, 752, 240] };

  /* the plot on its own, for use inside another card */
  /* the role and label of a plot: an image by default; a chart with aria() (the brush) is a control */
  const roleOf = (d, o) => (d.aria ? d.aria(o) : { role: "img", "aria-label": d.alt });
  const svg = (id, size = "Medium", o = {}) => {
    const d = DEFS[id], s = SIZES[size], w = o.width || s[1], h = o.height || s[2];
    const compact = size === "Small" || size === "Vertical small", opts = { compact, size, t: o.t || 0, range: o.range };
    const attrs = Object.entries(roleOf(d, opts)).map(([k, v]) => `${k}="${v}"`).join(" ");
    return `<svg class="ns-chart__plot" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" ${attrs} data-chart="${id}" data-size="${size}" data-h="${h}" data-w="${w}"${o.range ? ` data-range="${o.range.join(",")}"` : ""}>${d.prims(w, h, opts).map(prim).join("")}</svg>`;
  };
  /* redraw one plot in place at width w, from the state kept on the element (live tick, brush range) */
  const optsOf = (el) => ({ compact: el.dataset.size === "Small" || el.dataset.size === "Vertical small", size: el.dataset.size, t: +el.dataset.t || 0, range: el.dataset.range ? el.dataset.range.split(",").map(Number) : undefined });
  const paint = (el, w) => {
    const d = DEFS[el.dataset.chart], o = optsOf(el);
    el.innerHTML = d.prims(w, +el.dataset.h, o).map(prim).join("");
    if (d.aria) Object.entries(d.aria(o)).forEach(([k, v]) => el.setAttribute(k, v));
  };

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const barIcon = `<span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span>`;
  const kpi = (k, o = {}) => `<div class="ns-chart__kpi"><span class="ns-chart__title${o.lg ? " ns-chart__title--lg" : ""}${o.sm ? " ns-chart__title--sm" : ""}">${o.dot ? `<span class="ns-chart__dot" style="background:var(--ns-chart-series-${o.dot})"></span>` : ""}${esc(k[0])}</span>${o.titleOnly ? "" : `<span class="ns-chart__value${o.sm ? " ns-chart__value--sm" : ""}">${esc(k[1])}<span class="ns-chart__trend">${esc(k[2])}</span></span><span class="ns-chart__desc${o.sm ? " ns-chart__desc--sm" : ""}">${esc(o.compact && k[4] ? k[4] : k[3])}</span>`}</div>`;

  const card = (id, size = "Medium", icon = true) => {
    const d = DEFS[id], K = d.kpi, S = d.sum, w = SIZES[size][0], plot = svg(id, size);
    /* a live chart in a full-size card carries a pause control (WCAG 2.2.2); compact sizes stay still */
    const live = d.live && size !== "Small" && size !== "Vertical small";
    const ic = (live ? `<button class="ns-btn ns-btn--ghost ns-btn--sm ns-chart__pause" type="button">Pause</button>` : "") + (icon ? barIcon : "");
    const tools = live ? `<div class="ns-chart__tools">${ic}</div>` : ic, at = live ? " data-live" : "";
    if (size === "Small") return `<div class="ns-chart ns-chart--small" style="width:100%;max-width:${w}px">${kpi(K, { sm: true, compact: true })}${plot}${ic}</div>`;
    if (size === "Vertical small") return `<div class="ns-chart ns-chart--vertical" style="width:100%;max-width:${w}px"><div class="ns-chart__head">${kpi(K, { sm: true, compact: true })}${ic}</div>${plot}</div>`;
    if (size === "Large") return `<div class="ns-chart"${at} style="width:100%;max-width:${w}px"><div class="ns-chart__head">${kpi(K, { lg: true, titleOnly: true })}${tools}</div>${plot}<div class="ns-chart__summary">${kpi(K, { dot: 1, sm: true })}${kpi(S[0], { dot: 3, sm: true })}</div></div>`;
    if (size === "XL") return `<div class="ns-chart"${at} style="width:100%;max-width:${w}px"><div class="ns-chart__head"><div class="ns-chart__kpis">${kpi(K, { dot: 1 })}${kpi(S[0], { dot: 3 })}${kpi(S[1], { dot: 2 })}</div>${tools}</div>${plot}</div>`;
    return `<div class="ns-chart"${at} style="width:100%;max-width:${w}px"><div class="ns-chart__head">${kpi(K)}${tools}</div>${plot}</div>`;
  };

  /* Plots redraw at the width of their tile, so labels stay at their real size instead of scaling down.
     Works for chart plots (data-chart) and bullet rows (data-bullet); height stays fixed. */
  const redraw = (el) => {
    /* A transformed ancestor (a scaled thumbnail or embed) shrinks the bounding box; leave those plots at their drawn size. */
    for (let p = el.parentElement; p; p = p.parentElement) if (getComputedStyle(p).transform !== "none") return;
    const w = Math.max(96, Math.round(el.getBoundingClientRect().width));
    if (!w || String(w) === el.dataset.w) return;
    if (el.dataset.chart && DEFS[el.dataset.chart]) {
      el.setAttribute("viewBox", `0 0 ${w} ${+el.dataset.h}`); el.setAttribute("width", w);
      paint(el, w);
    } else if (el.dataset.bullet && NS.bulletSvg) {
      const b = JSON.parse(el.dataset.bullet), t = document.createElement("div");
      t.innerHTML = NS.bulletSvg(b.rows, { ...b.opts, width: w });
      const n = t.firstElementChild;
      ["viewBox", "width", "height"].forEach((a) => el.setAttribute(a, n.getAttribute(a)));
      el.innerHTML = n.innerHTML;
    }
    el.dataset.w = w;
  };
  if (typeof ResizeObserver !== "undefined" && typeof MutationObserver !== "undefined") {
    const ro = new ResizeObserver((es) => requestAnimationFrame(() => es.forEach((e) => redraw(e.target))));
    const sel = "svg[data-chart], svg[data-bullet]";
    const scan = (n) => { if (n.nodeType !== 1) return; if (n.matches(sel)) ro.observe(n); n.querySelectorAll(sel).forEach((x) => ro.observe(x)); };
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach(scan))).observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("DOMContentLoaded", () => scan(document.body));
  }

  const fit = (root = document) => root.querySelectorAll("svg[data-chart], svg[data-bullet]").forEach(redraw);

  if (typeof document !== "undefined" && typeof setInterval === "function") {
    const width = (el) => +el.dataset.w || el.viewBox.baseVal.width;
    /* Live line: one tick a second while the card is on screen and not paused. Still in headless captures
       and with ?motion=off, so screenshots and visual tests are stable. The update is new data, not decoration,
       so it keeps running under reduced motion; the Pause button stops it. */
    const frozen = /HeadlessChrome/.test(navigator.userAgent) || new URLSearchParams(location.search).get("motion") === "off";
    if (!frozen) setInterval(() => {
      if (document.hidden) return;
      document.querySelectorAll(".ns-chart[data-live]:not(.is-paused) svg[data-chart]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight || el.closest('[data-motion="off"]')) return;
        el.dataset.t = (+el.dataset.t || 0) + 1; paint(el, width(el));
      });
    }, 1000);
    document.addEventListener("click", (e) => {
      const b = e.target.closest && e.target.closest(".ns-chart__pause");
      if (!b) return;
      const paused = b.closest(".ns-chart").classList.toggle("is-paused");
      b.textContent = paused ? "Resume" : "Pause";
    });

    /* Brush: drag the window to move it, drag a handle to resize it, press outside it to jump there.
       Keys: Left and Right move by one month, Shift with Left or Right moves the end, Home and End jump. */
    const B = DEFS.brush, MIN = 3 / (B.N - 1);
    const setRange = (el, a, b) => {
      const span = b - a;
      if (a < 0) { a = 0; b = span; } if (b > 1) { b = 1; a = 1 - span; }
      el.dataset.range = [Math.max(0, a), Math.min(1, b)].map((v) => +v.toFixed(4)).join(","); paint(el, width(el));
    };
    const local = (el, e) => { const r = el.getBoundingClientRect(), w = width(el); return [(e.clientX - r.left) * (w / r.width), (e.clientY - r.top) * (+el.dataset.h / r.height)]; };
    let drag = null;
    document.addEventListener("pointerdown", (e) => {
      const el = e.target.closest && e.target.closest('svg[data-chart="brush"]');
      if (!el) return;
      const w = width(el), L = B.layout(w, +el.dataset.h, optsOf(el)), [x, y] = local(el, e);
      if (y < L.oy - 4) return;
      const [a, b] = B.range(optsOf(el)), f = Math.max(0, Math.min(1, (x - L.ml) / L.pw)), xa = L.ml + a * L.pw, xb = L.ml + b * L.pw;
      let mode = Math.abs(x - xa) < 8 ? "start" : Math.abs(x - xb) < 8 ? "end" : x > xa && x < xb ? "pan" : "jump";
      if (mode === "jump") { setRange(el, f - (b - a) / 2, f + (b - a) / 2); mode = "pan"; }
      drag = { el, mode, f0: f, r0: B.range(optsOf(el)), L };
      el.setPointerCapture(e.pointerId); e.preventDefault();
    });
    document.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const { el, mode, f0, r0, L } = drag, f = Math.max(0, Math.min(1, (local(el, e)[0] - L.ml) / L.pw));
      if (mode === "pan") setRange(el, r0[0] + f - f0, r0[1] + f - f0);
      else if (mode === "start") setRange(el, Math.min(f, r0[1] - MIN), r0[1]);
      else setRange(el, r0[0], Math.max(f, r0[0] + MIN));
    });
    const end = () => { drag = null; };
    document.addEventListener("pointerup", end); document.addEventListener("pointercancel", end);
    document.addEventListener("keydown", (e) => {
      const el = e.target.closest && e.target.closest('svg[data-chart="brush"]');
      if (!el) return;
      const [a, b] = B.range(optsOf(el)), s = 1 / (B.N - 1);
      const K = { ArrowLeft: -s, ArrowDown: -s, ArrowRight: s, ArrowUp: s }[e.key];
      if (K && e.shiftKey) setRange(el, a, Math.max(a + MIN, Math.min(1, b + K)));
      else if (K) setRange(el, a + K, b + K);
      else if (e.key === "Home") setRange(el, 0, b - a);
      else if (e.key === "End") setRange(el, 1 - (b - a), 1);
      else return;
      e.preventDefault();
    });
  }

  NS.chartKit = { H, defs: DEFS, svg, card, fit, sizes: SIZES };
})();
