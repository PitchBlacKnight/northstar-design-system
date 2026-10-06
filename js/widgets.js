/* NorthStar graphics framework.
   Every widget on the Figma "Widgets" page (427:8676), rendered as token-driven SVG + HTML.
   Usage: NS.widget("circle-table", { size: "M", table: "simple" })  -> HTML string
          <div data-ns-widget="circle-table" data-table="simple"></div> + NS.hydrate() */
(function () {
  const NS = (window.NS = window.NS || {});
  let uid = 0;
  const id = (p) => `${p}${++uid}`;
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const fmt = (n) => n.toLocaleString("en-US");
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const v = (t) => `var(--ns-${t})`;
  const stop = (o, c, a = 1) => `<stop offset="${o}" style="stop-color:${c};stop-opacity:${a}"/>`;

  /* gradient presets (Figma: Purple gradient, Light Bruise, bubble blue, orange) */
  const GRAD = {
    purple: [v("magenta-500"), v("violet-600")], bruise: [v("persian-500"), v("purple-500")], blue: [v("cyan-400"), v("sky-500")],
    orange: [v("yellow-500"), v("orange-500")], green: [v("green-500"), "#1fbf4a"], teal: [v("teal-500"), "#00b3ff"], red: [v("red-400"), v("red-500")],
  };
  const lin = (gid, name, dir = "v") => `<linearGradient id="${gid}" x1="0" y1="0" x2="${dir === "h" ? 1 : 0}" y2="${dir === "h" ? 0 : 1}">${stop(0, GRAD[name][0])}${stop(1, GRAD[name][1])}</linearGradient>`;

  /* ---------- data ---------- */
  const TABLE = [["Finance", 324, 1540, "green-500"], ["Travel", 311, 1320, "orange-500"], ["Presentation", 300, 1201, "purple-500"], ["Startup", 288, 989, "teal-500"], ["Development", 276, 944, "red-400"], ["Design", 273, 897, "yellow-500"], ["Product", 233, 843, "periwinkle-500"], ["Research", 184, 765, "blue-500"], ["Other", 143, 565, "text-primary"]];
  const IND = [["Travel", 760, 2540, 1], ["Presentation", 650, 2304, 0], ["Business", 612, 2140, 1], ["Finance", 598, 1976, 1], ["Travel", 513, 1903, 0], ["Startup", 498, 1320, 0], ["Develop", 476, 1103, 1], ["Product", 412, 1043, 1], ["Design", 389, 1001, 0], ["Illustration", 350, 870, 1], ["Prototype", 321, 820, 1]];
  const PROG = [["Sales", 72, "blue"], ["Users", 88, "orange"], ["Products", 34, "red"], ["Views", 56, "teal"]];

  /* ---------- tables ---------- */
  const tables = {
    simple: (n = 9) => `<div class="ns-wt ns-wt--dot">${TABLE.slice(0, n).map(([l, a, b, c]) => `<div class="ns-wt__row"><span class="ns-wt__dot" style="--_c:${v(c)}"></span><span>${l}</span><span class="ns-wt__mid ns-wt__num">${a}</span><span class="ns-wt__num">${fmt(b)}</span></div>`).join("")}</div>`,
    indicator: (n = 11) => `<div class="ns-wt ns-wt--ind">${IND.slice(0, n).map(([l, a, b, up]) => `<div class="ns-wt__row"><span>${l}</span><span class="ns-wt__mid ns-wt__num">${a}</span><span class="ns-wt__num">${fmt(b)}</span><span class="${up ? "ns-wt__up" : "ns-wt__down"}" role="img" aria-label="${up ? "up" : "down"}"></span></div>`).join("")}</div>`,
    progress: (n = 4) => `<div class="ns-wt ns-wt--prog">${PROG.slice(0, n).map(([l, p, g]) => `<div class="ns-wt__row"><span>${l}</span><div class="ns-wt__bar" role="img" aria-label="${p}%"><i style="--_v:${p}%;--_c:linear-gradient(90deg,${GRAD[g][1]},${GRAD[g][0]})"></i></div></div>`).join("")}</div>`,
    dynamic: (n = 4) => `<div class="ns-wt ns-wt--dyn">${IND.slice(0, n).map(([l, a, b, up]) => `<div class="ns-wt__row"><span>${l}</span><span class="ns-wt__num">${fmt(b)}</span><span class="ns-w__delta ${up ? "" : "is-down"}">${up ? "+" : "-"}${Math.round(a / 60)}%</span></div>`).join("")}</div>`,
    classic: () => `<div class="ns-wt ns-wt--classic"><div class="ns-wt__row"><span>Name</span><span>Views</span><span>Sales</span><span>Rate</span></div>${IND.slice(0, 4).map(([l, a, b]) => `<div class="ns-wt__row"><span>${l}</span><span class="ns-wt__num">${a}</span><span class="ns-wt__num">${fmt(b)}</span><span class="ns-wt__num ns-wt__mid">${(a / 10).toFixed(1)}%</span></div>`).join("")}</div>`,
  };

  /* ---------- primitives ---------- */
  const kpi = (o = {}) => `<div class="ns-w__kpi">${o.title ? `<p class="ns-w__title">${o.title}</p>` : ""}<div class="ns-w__value ${o.big ? "ns-w__value--xl" : ""}">${o.value || "$12,875"}<span class="ns-w__delta ${o.down ? "is-down" : ""}">${o.delta || "10%"}</span></div>${o.cmp === false ? "" : `<span class="ns-w__cmp">${o.cmp || "Compared to $21,490 last year"}</span>`}</div>`;

  /* Ring (circle chart). arcs: [{v:0-100, g:gradient}] drawn around one track */
  function ring({ size = 72, stroke = 8, arcs = [{ v: 32, g: "purple" }], label, unit = "%", icon = true, gap = 0 }) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    let off = 0, defs = "", paths = "";
    arcs.forEach((a) => { const g = id("g"); defs += lin(g, a.g, "h"); const len = (a.v / 100) * c; paths += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="url(#${g})" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${Math.max(len - gap, 0.01)} ${c}" stroke-dashoffset="${-off}" transform="rotate(-90 ${size / 2} ${size / 2})"/>`; off += len; });
    const fs = size * 0.26;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${label ?? arcs[0].v}${unit}"><defs>${defs}</defs><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:${v("widget-track")}" stroke-width="${stroke}"/>${paths}${icon ? `<g transform="translate(${size / 2 - 5} ${size * 0.28})" style="fill:${v("widget-muted")}"><rect x="0" y="4" width="2" height="6" rx="1"/><rect x="4" y="0" width="2" height="10" rx="1"/><rect x="8" y="2" width="2" height="8" rx="1"/></g>` : ""}<text x="50%" y="${size * 0.62}" text-anchor="middle" dominant-baseline="middle" style="fill:${v("text-primary")}" font-size="${fs}" font-weight="800">${label ?? arcs[0].v}<tspan font-size="${fs * 0.45}" font-weight="400" dx="1" dy="${-fs * 0.3}">${unit}</tspan></text></svg>`;
  }

  /* Concentric rings (compound circular / combined) */
  function concentric({ size = 300, rings = [["orange", 78], ["green", 70], ["teal", 66], ["blue", 58], ["purple", 52]], stroke = 9, gap = 6, center = "64,3", over = "Dynamics today" }) {
    let defs = "", out = "";
    rings.forEach(([g, pct], i) => { const r = size / 2 - stroke / 2 - i * (stroke + gap) - (rings.length > 2 ? 0 : 0); const c = 2 * Math.PI * r; const gid = id("cg"); defs += `<linearGradient id="${gid}" x1="1" y1="0" x2="0" y2="1">${stop(0, GRAD[g][0])}${stop(1, GRAD[g][1])}</linearGradient>`; out += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:${v("widget-track")}" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="url(#${gid})" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(pct / 100) * c} ${c}" transform="rotate(${-90 - (pct / 100) * 360 * 0.5 + 90} ${size / 2} ${size / 2}) scale(-1 1) translate(${-size} 0)"/>`; });
    const inner = size / 2 - rings.length * (stroke + gap);
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${over} ${center}%"><defs>${defs}</defs>${out}${inner > 40 ? `<circle cx="${size / 2}" cy="${size / 2 - inner * 0.42}" r="${inner * 0.22}" style="fill:${v("widget-track")}"/><g transform="translate(${size / 2 - 7} ${size / 2 - inner * 0.42 - 7})" style="fill:${v("orange-500")}"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="0" width="3" height="14" rx="1"/><rect x="11" y="3" width="3" height="11" rx="1"/></g><text x="50%" y="${size / 2 + inner * 0.02}" text-anchor="middle" style="fill:${v("widget-muted")}" font-size="${Math.max(9, inner * 0.08)}" font-weight="700" letter-spacing="1.5">${over.toUpperCase()}</text>` : ""}<text x="50%" y="${size / 2 + inner * (inner > 40 ? 0.4 : 0.12)}" text-anchor="middle" dominant-baseline="middle" style="fill:${v("text-primary")}" font-size="${inner * (inner > 40 ? 0.46 : 0.6)}" font-weight="700">${center}<tspan font-size="${inner * 0.16}" dy="${-inner * 0.12}">%</tspan></text></svg>`;
  }

  /* Smooth path through points (Catmull-Rom -> cubic bezier) */
  function smooth(pts) {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`; }
    return d;
  }
  const series = (seed, n, lo = 0.15, hi = 0.95) => { const r = rng(seed); let x = 0.5; return Array.from({ length: n }, () => (x = Math.min(hi, Math.max(lo, x + (r() - 0.5) * 0.5)))); };

  function lines({ w = 240, h = 80, sets = [["purple", 3], ["orange", 7]], n = 8, axis = false, fill = false, glow = true }) {
    const pad = axis ? 36 : 4, ph = axis ? 24 : 4;
    let defs = "", out = "";
    if (axis) { for (let i = 0; i <= 4; i++) { const y = ph + ((h - ph * 2) * i) / 4; out += `<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" style="stroke:${v("widget-grid")}" stroke-dasharray="2 4"/><text x="${pad - 8}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:${v("widget-muted")}">${["$1k", "$750", "$500", "$250", "0"][i]}</text>`; } MONTHS.forEach((m, i) => (out += `<text x="${pad + ((w - pad) * (i + 0.5)) / 12}" y="${h - 4}" text-anchor="middle" font-size="11" style="fill:${v("widget-muted")}">${m}</text>`)); }
    sets.forEach(([g, seed]) => {
      const d = series(seed, n); const pts = d.map((y, i) => [pad + ((w - pad - 4) * i) / (n - 1), ph + (h - ph * 2 - (axis ? 12 : 0)) * (1 - y)]);
      const gid = id("lg"); defs += lin(gid, g, "h");
      if (fill) { const fid = id("lf"); defs += `<linearGradient id="${fid}" x1="0" y1="0" x2="0" y2="1">${stop(0, GRAD[g][0], 0.35)}${stop(1, GRAD[g][0], 0)}</linearGradient>`; out += `<path d="${smooth(pts)} L${pts[pts.length - 1][0]},${h - ph} L${pts[0][0]},${h - ph} Z" fill="url(#${fid})"/>`; }
      out += `<path d="${smooth(pts)}" fill="none" stroke="url(#${gid})" stroke-width="${axis ? 3 : 2.5}" stroke-linecap="round"${glow ? ` style="filter:drop-shadow(0 4px 8px ${GRAD[g][1]})"` : ""}/>`;
    });
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Line chart"><defs>${defs}</defs>${out}</svg>`;
  }

  /* Column chart: paired capsules (purple bottom, teal top) */
  function columns({ w = 240, h = 80, n = 12, seed = 5, bar = 6, gap = 5, axis = false, a = "purple", b = "teal" }) {
    const r = rng(seed), step = w / n; let out = "", defs = ""; const ga = id("ca"), gb = id("cb"); defs += lin(ga, a) + lin(gb, b);
    for (let i = 0; i < n; i++) { const x = i * step + step / 2 - bar / 2; const lo = 0.2 + r() * 0.45, hi = 0.1 + r() * 0.35; const hlo = (h - 8) * lo, hhi = (h - 8) * hi; out += `<rect x="${x}" y="0" width="${bar}" height="${h}" rx="${bar / 2}" style="fill:${v("widget-track")}"/><rect x="${x}" y="${h - hlo}" width="${bar}" height="${hlo}" rx="${bar / 2}" fill="url(#${ga})"/><rect x="${x}" y="${h - hlo - gap - hhi}" width="${bar}" height="${hhi}" rx="${bar / 2}" fill="url(#${gb})"/>`; }
    return `<svg width="${w}" height="${h + (axis ? 18 : 0)}" viewBox="0 0 ${w} ${h + (axis ? 18 : 0)}" role="img" aria-label="Column chart"><defs>${defs}</defs>${out}${axis ? MONTHS.slice(0, n).map((m, i) => `<text x="${i * step + step / 2}" y="${h + 14}" text-anchor="middle" font-size="10" style="fill:${v("widget-muted")}">${m}</text>`).join("") : ""}</svg>`;
  }

  /* Month grid used by bubble, dots, stacked */
  function monthGrid(w, h, pad, bands = true, yl = ["$1k", "$800", "$600", "$400", "$200", "0"]) {
    let o = ""; const cw = (w - pad) / 12;
    if (bands) for (let i = 0; i < 12; i += 2) o += `<rect x="${pad + i * cw}" y="0" width="${cw}" height="${h - 24}" style="fill:${v("widget-band")}"/>`;
    else for (let i = 0; i < 12; i++) o += `<line x1="${pad + i * cw + cw / 2}" x2="${pad + i * cw + cw / 2}" y1="0" y2="${h - 24}" style="stroke:${v("widget-grid")}"/>`;
    yl.forEach((t, i) => (o += `<text x="${pad - 10}" y="${8 + ((h - 36) * i) / (yl.length - 1)}" text-anchor="end" dominant-baseline="middle" font-size="12" style="fill:${v("widget-muted")}">${t}</text>`));
    MONTHS.forEach((m, i) => (o += `<text x="${pad + i * cw + (bands ? 0 : cw / 2)}" y="${h - 4}" text-anchor="middle" font-size="12" style="fill:${v("widget-muted")}">${m}</text>`));
    return o;
  }

  function bubbles({ w = 820, h = 250, seed = 11, n = 30, max = 42, axis = true }) {
    const r = rng(seed), pad = axis ? 56 : 6; const gp = id("bp"), gb = id("bb");
    let out = axis ? monthGrid(w, h, pad) : "";
    for (let i = 0; i < n; i++) { const rad = r() < 0.35 ? 3 + r() * 4 : 8 + r() * (max - 8); const x = pad + 8 + r() * (w - pad - 16), y = rad + r() * (h - (axis ? 36 : 8) - rad * 2); out += `<circle cx="${x}" cy="${y}" r="${rad}" fill="url(#${r() > 0.5 ? gp : gb})"/>`; }
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Bubble chart"><defs><linearGradient id="${gp}" x1="0" y1="0" x2="0" y2="1">${stop(0, GRAD.purple[0])}${stop(1, GRAD.purple[1])}</linearGradient><linearGradient id="${gb}" x1="0" y1="0" x2="0" y2="1">${stop(0, GRAD.blue[0])}${stop(1, GRAD.blue[1])}</linearGradient></defs>${out}</svg>`;
  }

  function dots({ w = 820, h = 250 }) {
    const pad = 56, cw = (w - pad) / 12, d = series(21, 52, 0.05, 0.95), base = h - 36;
    let out = monthGrid(w, h, pad);
    out += `<rect x="${pad + 10 * cw}" y="0" width="${cw}" height="${h - 24}" style="fill:${v("purple-500")};fill-opacity:.28"/>`;
    const ty = 8 + base * (1 - 0.48); out += `<line x1="${pad}" x2="${w}" y1="${ty}" y2="${ty}" style="stroke:${v("purple-500")}" stroke-width="1.5"/>`;
    d.forEach((y, i) => { const x = pad + 8 + ((10 * cw - 16) * i) / (d.length - 1); out += `<circle cx="${x}" cy="${8 + base * (1 - y)}" r="3.6" style="fill:${v("purple-500")}"/>`; });
    for (let i = 0; i < 3; i++) out += `<circle cx="${pad + 10 * cw - 40 + i * 13}" cy="${ty}" r="3.6" style="fill:${v("purple-500")}"/>`;
    out += `<rect x="${pad + 10 * cw + cw / 2 - 18}" y="${ty - 13}" width="36" height="26" rx="8" style="fill:${v("purple-500")}"/><text x="${pad + 10 * cw + cw / 2}" y="${ty + 1}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="600" style="fill:${v("white")}">41</text>`;
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Dots line chart, threshold 41">${out}</svg>`;
  }

  function stacked({ w = 1000, h = 380 }) {
    const pad = 40, cw = (w - pad) / 12, base = h - 36, r = rng(4); const gp = id("sp"), go = id("so");
    let out = monthGrid(w, h, pad, false, ["1k", "800", "600", "400", "200", "0"]);
    MONTHS.forEach((m, i) => { const x = pad + i * cw + cw / 2 - 3; const a = 0.25 + r() * 0.55, b = 0.06 + r() * 0.1; const ha = base * a, hb = base * b; out += `<rect x="${x}" y="${base + 8 - ha}" width="6" height="${ha}" rx="3" fill="url(#${gp})"/><rect x="${x}" y="${base + 8 - ha - 6 - hb}" width="6" height="${hb}" rx="3" fill="url(#${go})"/>`; });
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Stacked column chart by month"><defs>${lin(gp, "purple")}${lin(go, "orange")}</defs>${out}</svg>`;
  }

  function globalBubbles({ w = 1000, h = 400 }) {
    const pad = 40; let out = monthGrid(w, h, pad, false, ["1k", "800", "600", "400", "200", "0"]); let defs = "";
    const B = [[0.13, 0.66, 20, "teal-500", ""], [0.2, 0.55, 7, "purple-500", ""], [0.24, 0.43, 14, "teal-500", ""], [0.3, 0.38, 66, "red-400", "$27,632"], [0.46, 0.28, 110, "periwinkle-500", "$27,632|August"], [0.52, 0.78, 11, "yellow-500", ""], [0.64, 0.6, 10, "teal-500", ""], [0.68, 0.47, 7, "purple-500", ""], [0.78, 0.63, 60, "periwinkle-500", "$27,632"], [0.8, 0.46, 32, "red-400", ""], [0.9, 0.67, 7, "teal-500", ""], [0.94, 0.7, 20, "purple-500", ""]];
    B.forEach(([x, y, r, c, l]) => { const cx = pad + x * (w - pad), cy = y * (h - 30) - 10; const fid = id("gl"); defs += `<radialGradient id="${fid}">${stop(0, v(c), 0.5)}${stop(1, v(c), 0)}</radialGradient>`; out += `<circle cx="${cx}" cy="${cy + r * 0.4}" r="${r * 1.6}" fill="url(#${fid})"/><circle cx="${cx}" cy="${cy}" r="${r}" style="fill:${v(c)};fill-opacity:.88"/>`; if (l) { const [a, b] = l.split("|"); out += `<text x="${cx}" y="${cy - (b ? 6 : 0)}" text-anchor="middle" dominant-baseline="middle" font-size="15" font-weight="700" style="fill:${v("white")}">${a}</text>${b ? `<text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="12" style="fill:${v("white")}">${b}</text>` : ""}`; } });
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Sales figures bubble chart"><defs>${defs}</defs>${out}</svg>`;
  }

  function timeline({ w = 1500, h = 44, bubble = false }) {
    const r = rng(8), n = bubble ? 90 : 60; let out = "";
    for (let i = 0; i < n; i++) { const x = (w * i) / n; if (bubble) { const rad = 2 + r() * 5; out += `<circle cx="${x + 6}" cy="${h / 2 - 6}" r="${rad}" style="fill:${v(r() > 0.5 ? "purple-500" : "cyan-400")}"/>`; } else { const bh = 12 + r() * 18; out += `<rect x="${x + 1}" y="${h - 10 - bh}" width="${w / n - 3}" height="${bh}" rx="1" style="fill:${v("widget-muted")};fill-opacity:.45"/>`; } }
    out += `<rect x="0" y="${h - 4}" width="${w * 0.15}" height="3" rx="1.5" style="fill:${v("orange-500")}"/><rect x="${w * 0.15}" y="${h - 4}" width="${w * 0.3}" height="3" rx="1.5" style="fill:${v("blue-500")}"/><rect x="${w * 0.45}" y="${h - 4}" width="${w * 0.55}" height="3" rx="1.5" style="fill:${v("teal-500")}"/>`;
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:${h}px" role="img" aria-label="Timeline">${out}</svg>`;
  }

  function heat() {
    const r = rng(3), rows = 24; let cells = "";
    for (let i = 0; i < rows; i++) { const lbl = { 0: "1500", 6: "1000", 12: "500", 18: "100", 23: "0" }[i] || ""; cells += `<span>${lbl}</span>`; for (let c = 0; c < 4; c++) { const t = r(); const col = t > 0.94 ? v("white") : t > 0.62 ? v("sky-500") : t > 0.3 ? v("persian-500") : v("widget-grid"); cells += `<i style="--_c:${col}"></i>`; } }
    return `<div class="ns-heat" role="img" aria-label="Temperature chart">${cells}</div>`;
  }

  /* ---------- widget shells ---------- */
  const shell = (cls, inner, w) => `<div class="ns ns-w ${cls}"${w ? ` style="--_w:${w}px"` : ""}>${inner}</div>`;
  const tableFor = (t, n) => (t && tables[t] ? tables[t](n) : "");

  /* ---------- v1.5 widgets: gauge, area, heatmap, ranked bar, funnel, uptime, states, parts ---------- */
  const RANK = [["North America", 4210, 100], ["Europe", 3380, 80], ["Asia Pacific", 2470, 59], ["Latin America", 1120, 27], ["Middle East", 640, 15], ["Africa", 410, 10], ["Oceania", 330, 8], ["Other", 120, 3]];
  const FUNNEL = [["Visits", "12,400", 100, "viz-2"], ["Sign-ups", "4,960", 40, "viz-7"], ["Trials", "2,108", 17, "viz-4"], ["Paid", "397", 3.2, "viz-1"]];
  const SER = [["Sales", "viz-1", "42%"], ["Product", "viz-2", "26%"], ["Marketing", "viz-3", "18%"], ["Other", "viz-4", "14%"]];

  /* Semicircle meter. pct 0-100, optional warning (70-90) and critical (90-100) bands */
  function gauge({ w = 180, pct = 64, thresholds = false, tone = "viz-2" }) {
    const sw = w * 0.08, r = w / 2 - sw / 2, cx = w / 2, cy = w / 2, h = w / 2 + sw / 2;
    const pt = (p) => { const a = Math.PI + Math.PI * (p / 100); return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; };
    const arc = (a, b, style, width = sw) => `<path d="M${pt(a)} A${r},${r} 0 0 1 ${pt(b)}" fill="none" style="stroke:${style}" stroke-width="${width}" stroke-linecap="round"/>`;
    const ro = r + sw * 0.9, pto = (p) => { const a = Math.PI + Math.PI * (p / 100); return `${(cx + ro * Math.cos(a)).toFixed(1)},${(cy + ro * Math.sin(a)).toFixed(1)}`; };
    const band = (a, b, c) => `<path d="M${pto(a)} A${ro},${ro} 0 0 1 ${pto(b)}" fill="none" style="stroke:${v(c)}" stroke-width="${sw * 0.3}"/>`;
    return `<svg width="${w}" height="${h + (thresholds ? sw : 0)}" viewBox="${thresholds ? -sw : 0} ${thresholds ? -sw : 0} ${w + (thresholds ? sw * 2 : 0)} ${h + (thresholds ? sw : 0)}" role="img" aria-label="${pct}% of capacity">${arc(0.5, 99.5, v("widget-track"))}${arc(0.5, Math.min(pct, 99.5), v(tone))}${thresholds ? band(70, 90, "status-warning") + band(90, 100, "status-error") : ""}</svg>`;
  }

  /* Filled trend with a fading gradient; axis=true adds gridlines, y ticks and months */
  function area({ w = 230, h = 72, two = false, axis = false, seed = 3 }) {
    const pad = axis ? 40 : 0, top = axis ? 8 : 4, bot = axis ? 22 : 0, iw = w - pad, ih = h - top - bot;
    const sets = two ? [["viz-2", series(seed, 12, 0.35, 0.9)], ["viz-1", series(seed + 4, 12, 0.1, 0.45)]] : [["viz-2", series(seed, 12, 0.3, 0.9)]];
    let defs = "", body = "";
    if (axis) { ["$1k", "$800", "$600", "$400", "$200", "0"].forEach((t, i) => { const y = top + (ih / 5) * i; body += `<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" style="stroke:${v("widget-grid")}" stroke-dasharray="2 4"/><text x="${pad - 10}" y="${y + 4}" text-anchor="end" font-size="11" style="fill:${v("widget-muted")}">${t}</text>`; }); MONTHS.forEach((m, i) => { body += `<text x="${pad + (iw / 11) * i}" y="${h - 4}" text-anchor="middle" font-size="11" style="fill:${v("widget-muted")}">${m}</text>`; }); }
    sets.forEach(([c, d]) => { const g = id("ag"); defs += `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">${stop(0, v(c), 0.4)}${stop(1, v(c), 0)}</linearGradient>`; const pts = d.map((y, i) => [pad + (iw / (d.length - 1)) * i, top + ih - y * ih]); const line = smooth(pts); body += `<path d="${line} L${pad + iw},${top + ih} L${pad},${top + ih} Z" fill="url(#${g})"/><path d="${line}" fill="none" style="stroke:${v(c)}" stroke-width="2" stroke-linecap="round"/>`; });
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Area chart, ${two ? "two series" : "one series"}, rising trend"><defs>${defs}</defs>${body}</svg>`;
  }

  /* Day x slot intensity grid on --ns-viz-1 */
  const OP = [0, 0.18, 0.35, 0.55, 0.78, 1];
  function heat(cols, cell, seed) {
    const r = rng(seed); let out = "";
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((d, row) => { out += `<span class="ns-hm__day">${d}</span>`; for (let c = 0; c < cols; c++) { const work = row < 5 ? 1 : 0.35, peak = Math.exp(-Math.pow((c - cols * 0.55) / (cols * 0.28), 2)); const lv = Math.min(5, Math.max(0, Math.round(work * peak * 4.2 + r() * 1.6))); out += `<i class="ns-hm__c" data-l="${lv}" style="${lv ? `--_o:${OP[lv]}` : ""}"></i>`; } });
    return `<div class="ns-hm" style="--_cols:${cols};--_cell:${cell}px" role="img" aria-label="Heatmap of activity by day and ${cols === 24 ? "hour" : "week"}">${out}</div>`;
  }
  const heatScale = () => `<div class="ns-hm__scale"><span>Less</span>${OP.map((o, i) => `<i class="ns-hm__c" data-l="${i}" style="${i ? `--_o:${o}` : ""}"></i>`).join("")}<span>More</span></div>`;

  /* Status segments: ok / warn / down */
  const strip = (n, f) => `<div class="ns-uptime" style="--_n:${n}" role="img" aria-label="${n} day status history">${Array.from({ length: n }, (_, i) => `<i class="is-${f(i)}"></i>`).join("")}</div>`;
  const legend = (items, square = false, vertical = false) => `<div class="ns-legend ${vertical ? "ns-legend--v" : ""} ${square ? "ns-legend--sq" : ""}">${items.map(([l, c]) => `<span><i style="--_c:${v(c)}"></i>${l}</span>`).join("")}</div>`;

  const R = {
    /* Circle chart family */
    "circle-S": () => shell("ns-w--S96", ring({ size: 72, stroke: 7 })),
    "circle-M": (o) => shell("ns-w--M ns-w--row", `${ring({ size: 64, stroke: 7, arcs: [{ v: o.value || 32, g: o.g || "purple" }] })}${kpi({ title: o.title || "Total earning", cmp: false })}`),
    "circle-table": (o) => shell("ns-w--M", `<div class="ns-w__side">${ring({ size: 64, stroke: 7, arcs: [{ v: 32, g: "purple" }] })}${kpi({ title: "Total earning", cmp: false })}</div>${tableFor(o.table || "simple")}`),
    "circle-big": () => shell("ns-w--M", `<div class="ns-w__side">${ring({ size: 96, stroke: 10, arcs: [{ v: 64, g: "teal" }], label: "64,3" })}${kpi({ title: "Dynamics", value: "$4,210", cmp: false })}</div>`, 268),
    "circle-wide": () => shell("ns-w--M", `<div class="ns-w__side">${ring({ size: 110, stroke: 11, arcs: [{ v: 72, g: "blue" }], label: "72" })}${kpi({ title: "Sales plan", value: "$87,240", delta: "12%" })}</div>`, 346),
    "circle-composite": (o) => { const n = o.count || 3; return shell(`ns-w--${n > 2 ? "XL" : "L"}`, `<div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:24px">${["Sales", "Users", "Views", "Orders"].slice(0, n).map((t, i) => `<div class="ns-w__side">${ring({ size: 56, stroke: 6, arcs: [{ v: [32, 68, 45, 81][i], g: ["purple", "teal", "orange", "blue"][i] }] })}${kpi({ title: t, value: ["$12,875", "8,420", "136,350", "2,904"][i], cmp: false })}</div>`).join("")}</div>`); },
    "circle-composite-S": () => shell("ns-w--S96", `${ring({ size: 64, stroke: 6 })}${ring({ size: 64, stroke: 6, arcs: [{ v: 68, g: "teal" }] })}`),

    /* Combined circle */
    "combined-S": () => shell("ns-w--S96", ring({ size: 72, stroke: 7, arcs: [{ v: 28, g: "green" }, { v: 61, g: "purple" }], label: "89", gap: 3, icon: false })),
    "combined-M": (o) => shell("ns-w--M", `<div class="ns-w__side">${ring({ size: 72, stroke: 7, arcs: [{ v: 28, g: "green" }, { v: 61, g: "purple" }], label: "89", gap: 3 })}${kpi({ title: "Foundations", cmp: false })}</div>${o.table ? "" : `<span class="ns-w__cmp">Compared to $21,504 last year</span>`}`),
    "combined-table": (o) => shell("ns-w--M", `${ring({ size: 96, stroke: 9, arcs: [{ v: 28, g: "green" }, { v: 61, g: "purple" }], label: "89", gap: 3 })}${kpi({ title: "Foundations", cmp: "Compared to $21,504 last year" })}${tableFor(o.table || "indicator")}`),
    "combined-double": () => shell("ns-w--M", `<div style="justify-self:center">${concentric({ size: 150, rings: [["purple", 72], ["teal", 54]], stroke: 9, gap: 6, center: "72" })}</div>${kpi({ title: "Double circle", cmp: false })}`),

    /* Line chart family */
    "line-S": (o) => shell("ns-w--S", `${lines({ w: 84, h: 44, sets: [[o.g || "purple", o.seed || 3]], n: 7 })}<div class="ns-w__value ns-w__value--sm">64,3<span class="ns-w__cmp">%</span></div>`),
    "line-composite-S": () => shell("ns-w--S", `${lines({ w: 84, h: 40, sets: [["purple", 3]], n: 7 })}<div class="ns-w__value ns-w__value--sm">$4.2k</div>${lines({ w: 84, h: 40, sets: [["orange", 9]], n: 7 })}<div class="ns-w__value ns-w__value--sm">$1.9k</div>`),
    "line-M": () => shell("ns-w--M ns-w--row", `${lines({ w: 96, h: 50, sets: [["purple", 3], ["orange", 7]], n: 7 })}${kpi({ title: "Total earning", cmp: false })}`),
    "lines-M": () => shell("ns-w--M", `${kpi({ title: "Total earning", cmp: false })}${lines({ w: 242, h: 90, sets: [["purple", 3], ["orange", 7]], n: 8 })}`),
    "lines-wide": () => shell("ns-w--M", `${kpi({ title: "Weekly", cmp: false })}${lines({ w: 298, h: 90, sets: [["teal", 12], ["purple", 3]], n: 9, fill: true })}`, 346),
    "big-lines": (o) => shell("ns-w--M", `${lines({ w: 242, h: 80, sets: [["purple", 3], ["orange", 7]], n: 8 })}${kpi({ title: "Total earning" })}${tableFor(o.table)}`, o.w || 294),
    "composite-line": () => shell("ns-w--M", `<div class="ns-w__side">${lines({ w: 96, h: 50, sets: [["purple", 3]], n: 7 })}${kpi({ title: "Sales", value: "$8,210", cmp: false })}</div><div class="ns-w__side">${lines({ w: 96, h: 50, sets: [["orange", 7]], n: 7 })}${kpi({ title: "Users", value: "2,140", down: true, delta: "4%", cmp: false })}</div>`),
    "lines-L": () => shell("ns-w--XL", `<div class="ns-w__head"><p class="ns-w__title">Sales Dynamics</p><div class="ns-w__legend"><span style="--_c:${v("teal-500")}"><i></i>Plan</span><span style="--_c:${v("purple-500")}"><i></i>Actual</span></div></div>${lines({ w: 820, h: 250, sets: [["teal", 12], ["purple", 3]], n: 12, axis: true, fill: true })}`),
    "dots-L": () => shell("ns-w--XL", `<p class="ns-w__title">Sales Dynamics</p>${dots({})}`),

    /* Column chart family */
    "column-S": () => shell("ns-w--S", `${columns({ w: 84, h: 44, n: 7, bar: 5, gap: 3 })}<div class="ns-w__value ns-w__value--sm">$87k</div>`),
    "column-composite-S": () => shell("ns-w--S", `${columns({ w: 84, h: 40, n: 7, bar: 5, gap: 3 })}<div class="ns-w__value ns-w__value--sm">$87k</div>${columns({ w: 84, h: 40, n: 7, bar: 5, gap: 3, seed: 9, a: "blue", b: "orange" })}<div class="ns-w__value ns-w__value--sm">$32k</div>`),
    "column-M": (o) => shell("ns-w--M", `${kpi({ title: "Overall trend", value: "$87,240", delta: "12%", cmp: false })}${columns({ w: 242, h: 90, n: 14, bar: 6, gap: 4, seed: o.seed || 5 })}${tableFor(o.table)}`),
    "column-L": (o) => shell("ns-w--L", `${kpi({ title: "Overall trend", value: "$87,240", delta: "12%", cmp: false, big: true })}${columns({ w: 528, h: 80, n: 34, bar: 6, gap: 5, seed: o.seed || 5 })}`),
    "stacked-L": () => shell("ns-w--XXL", `<div class="ns-w__head"><p class="ns-w__title ns-w__title--bold">Yearly dynamics</p><div class="ns-w__legend"><span style="--_c:${v("periwinkle-500")}"><i></i>New users</span><span style="--_c:${v("red-400")}"><i></i>Unique users</span></div></div>${stacked({})}`),

    /* Bubble family */
    "bubble-S": (o) => shell("ns-w--S", `${bubbles({ w: 84, h: 56, n: 9, max: 12, axis: false, seed: o.seed || 11 })}<div class="ns-w__value ns-w__value--sm">$12k</div>`),
    "bubble-M": (o) => shell("ns-w--M", `${kpi({ title: "Efficiency", value: "$12,875", cmp: false })}${bubbles({ w: 242, h: 96, n: 16, max: 16, axis: false })}${tableFor(o.table)}`),
    "bubble-row": () => shell("ns-w--M ns-w--row", `${bubbles({ w: 90, h: 54, n: 9, max: 11, axis: false, seed: 4 })}${kpi({ title: "Efficiency", cmp: false })}`),
    "bubble-L": () => shell("ns-w--XL", `<p class="ns-w__title">Efficiency</p>${bubbles({})}`),
    "bubble-global": () => shell("ns-w--XXL", `<div class="ns-w__head"><p class="ns-w__title ns-w__title--bold">Sales Figures</p><div class="ns-w__legend">${["periwinkle-500", "yellow-500", "red-400", "teal-500"].map((c) => `<span style="--_c:${v(c)}"><i></i>Marketing</span>`).join("")}</div></div>${globalBubbles({})}`),
    "bubble-timeline": () => shell("ns-w--full", `<div style="display:grid;grid-template-columns:120px 1fr;gap:24px;align-items:center"><div><span class="ns-w__cmp">Sales Figures</span><div class="ns-w__value ns-w__value--sm">$10,430</div></div>${timeline({ bubble: true, h: 36 })}</div>`),

    /* Other */
    "timeline-L": () => shell("ns-w--full", `<div style="display:grid;grid-template-columns:120px 1fr;gap:24px;align-items:center"><div><span class="ns-w__cmp">Sales Figures</span><div class="ns-w__value ns-w__value--sm">$10,430</div></div>${timeline({})}</div>`),
    "compound-L": () => shell("ns-w--L", `<p class="ns-w__title ns-w__title--bold">Global Statistics</p><div style="display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap"><div style="flex:1;min-width:240px">${concentric({ size: 320 })}</div><div class="ns-wt ns-wt--dot" style="min-width:170px;font-size:12px;gap:6px">${[["Sales", "1 540", "orange-500"], ["Sales Plan", "1 210", "green-500"], ["Weekly limit", "1 113", "teal-500"], ["Monthly limit", "950", "cyan-400"], ["Annual limit", "932", "purple-500"]].map(([l, n, c]) => `<div class="ns-wt__row" style="grid-template-columns:14px 1fr auto"><span class="ns-wt__dot" style="--_c:${v(c)};background:none;border:2px solid ${v(c)};box-shadow:none;width:10px;height:10px"></span><span>${l}</span><span class="ns-wt__num">${n}</span></div>`).join("")}</div></div><div class="ns-wt">${[["Sales", "1 540", "786", 45, "blue"], ["Users", "878", "539", 88, "orange"], ["Products", "878", "532", 35, "red"]].map(([l, a, b, p, g]) => `<div class="ns-wt__row" style="grid-template-columns:1fr 70px 60px 1.4fr"><span>${l}</span><span class="ns-wt__num">${a}</span><span class="ns-wt__num">${b}</span><div class="ns-wt__bar"><i style="--_v:${p}%;--_c:linear-gradient(90deg,${GRAD[g][1]},${GRAD[g][0]})"></i></div></div>`).join("")}</div>`, 539),
    "global-stat": () => shell("ns-w--L", `<p class="ns-w__title ns-w__title--bold">Global Statistics</p>${concentric({ size: 300 })}${tables.progress(3)}`, 573),
    "progress-M": () => shell("ns-w--M", `${kpi({ title: "Progress" })}<div style="justify-self:center">${concentric({ size: 150, rings: [["orange", 70], ["teal", 56], ["purple", 44]], stroke: 8, gap: 5, center: "70" })}</div>`),
    "temperature-M": () => shell("ns-w--M", `${kpi({ title: "Total earning" })}${heat()}`),
    "summary-L": () => shell("ns-w--L", `<p class="ns-w__title">Summary</p><table class="ns-sum"><thead><tr><th>Parameter</th><th>Total</th><th>Today</th><th>Status</th><th>Percent</th><th>Dynamics</th></tr></thead><tbody>${[["Views", "597 989", "120 430", 5, "green-500"], ["Sales", "543 409", "120", 4, "yellow-500"], ["Users", "467 320", "3 210", 1, "red-500"], ["Product", "320 210", "90", 3, "yellow-500"]].map(([l, a, b, s, c], i) => `<tr><td><span class="ns-wt__dot" style="--_c:${v(["green-500", "sky-500", "red-500", "orange-500"][i])};display:inline-block;width:6px;height:6px;margin-right:12px;vertical-align:2px"></span>${l}</td><td>${a}</td><td>${b}</td><td><span class="ns-seg" role="img" aria-label="${s} of 5">${Array.from({ length: 5 }, (_, k) => `<i class="${k < s ? "on" : ""}" style="--_c:${v(c)}"></i>`).join("")}</span></td><td>${[438, 321, 210, 198][i]}</td><td class="up">+10%</td></tr>`).join("")}</tbody></table>`, 708),
    "index-progress": () => shell("ns-w--M2", `${kpi({ title: "Total earning" })}<div class="ns-w__inset"><div style="display:flex;justify-content:space-between;gap:12px;font-size:13px"><span style="color:${v("widget-muted")}">Sales schedule implementation plan</span><span>$ 100 000</span></div><div class="ns-wt__bar"><i style="--_v:74%;--_c:linear-gradient(90deg,${GRAD.blue[1]},${GRAD.teal[0]})"></i></div></div>`),

    /* Tables */
    "table-simple": () => shell("ns-w--M", tables.simple(8)),
    "table-progress": () => shell("ns-w--M", tables.progress(4)),
    "table-dynamic": () => shell("ns-w--M", tables.dynamic(3)),
    "table-indicator": () => shell("ns-w--M", tables.indicator(10)),
    "table-classic": () => shell("ns-w--M", tables.classic(), 367),

    /* Simple informer */
    "index-M": () => shell("ns-w--M", kpi({ title: "Total earning" })),
    "index-composite": (o) => { const n = o.rows || 1; return shell("ns-w--M", `<p class="ns-w__title">Projects</p>${kpi({ title: "Total earning", big: true })}${Array.from({ length: n }, (_, i) => `<div class="ns-w__inset ns-w__pair"><div><span>${["Product", "Orders", "Refunds"][i]}</span><b>${["540", "1,204", "38"][i]}</b></div><div><span>${["Views", "Visitors", "Tickets"][i]}</span><b>${["136,350", "48,209", "912"][i]}</b></div></div>`).join("")}`); },
    /* Gauge (Figma: Widget / Gauge) */
    "gauge-S": (o) => shell("ns-w--S", `${gauge({ w: 84, pct: o.value || 64 })}<div class="ns-w__value ns-w__value--sm">${o.value || 64}%</div>`),
    "gauge-M": (o) => shell("ns-w--M ns-w--center", `<div class="ns-gauge">${gauge({ w: 180, pct: o.value || 64.3, thresholds: o.thresholds === true || o.thresholds === "true", tone: o.thresholds ? "viz-1" : "viz-2" })}<span class="ns-gauge__val">${String(o.value || 64.3).replace(".", ",")}%</span></div><div class="ns-gauge__scale"><span>0%</span><span>100%</span></div><div class="ns-w__kpi"><p class="ns-w__title">${o.title || "CPU load"}</p><span class="ns-w__cmp">${o.thresholds ? "Warning at 70%, critical at 90%" : "Average across 12 nodes"}</span></div>`),

    /* Area chart (Figma: Widget / Area chart) */
    "area-M": (o) => shell("ns-w--M", `${kpi({ title: o.title || "Total earning" })}${area({ w: 230, h: 72, two: o.series == 2, seed: o.seed || 3 })}`),
    "area-L": (o) => shell("ns-w--XL", `<div class="ns-w__head"><p class="ns-w__title">${o.title || "Traffic"}</p>${o.series == 2 ? legend([["Organic", "viz-2"], ["Paid", "viz-1"]]) : ""}</div>${area({ w: 764, h: 210, two: o.series == 2, axis: true, seed: o.seed || 3 })}`),

    /* Heatmap (Figma: Widget / Heatmap) */
    "heatmap-M": (o) => shell("ns-w--M", `${kpi({ title: "Active sessions", value: "48,210", delta: "6%", cmp: false })}${heat(11, 14, o.seed || 7)}${heatScale()}`),
    "heatmap-L": (o) => shell("ns-w--XL", `<div class="ns-w__head"><p class="ns-w__title">Load by hour</p>${heatScale()}</div>${heat(24, 26, o.seed || 7)}<div class="ns-hm__hours">${Array.from({ length: 8 }, (_, i) => `<span>${String(i * 3).padStart(2, "0")}:00</span>`).join("")}</div>`),

    /* Ranked bar (Figma: Widget / Ranked bar) */
    "ranked-M": () => shell("ns-w--M ns-w--fluid", `${kpi({ title: "Top regions", value: "12,580", delta: "8%", cmp: false })}<div class="ns-rank">${RANK.slice(0, 5).map(([l, n, p]) => `<div class="ns-rank__row"><span>${l}</span><span class="ns-wt__num">${fmt(n)}</span><div class="ns-rank__bar" role="img" aria-label="${l} ${fmt(n)}"><i style="--_v:${p}%;--_c:${v("viz-4")}"></i></div></div>`).join("")}</div>`),
    "ranked-L": () => shell("ns-w--L ns-w--fluid", `<div class="ns-w__head"><p class="ns-w__title">Revenue by region</p><span class="ns-w__cmp">Last 30 days</span></div><div class="ns-rank ns-rank--L">${RANK.map(([l, n, p], i) => `<div class="ns-rank__row"><span class="ns-rank__k">${String(i + 1).padStart(2, "0")}</span><span>${l}</span><div class="ns-rank__bar" role="img" aria-label="${l} $${fmt(n)}"><i style="--_v:${p}%;--_c:${v(i < 3 ? "viz-1" : i < 6 ? "viz-4" : "viz-7")}"></i></div><span class="ns-wt__num">$${fmt(n)}</span></div>`).join("")}</div>`),

    /* Funnel (Figma: Widget / Funnel) */
    "funnel-M": () => shell("ns-w--M ns-w--fluid", `${kpi({ title: "Conversion", value: "3.2%", delta: "0.4%", cmp: "Visit to paid, last 30 days" })}<div class="ns-funnel">${FUNNEL.map(([l, n, p, c]) => `<div class="ns-funnel__row"><div class="ns-funnel__lbl"><span>${l} &nbsp;${n}</span><b>${p}%</b></div><i style="--_v:${Math.max(p, 6)}%;--_c:${v(c)}" role="img" aria-label="${l} ${n}, ${p}%"></i></div>`).join("")}</div>`),
    "funnel-L": () => shell("ns-w--XL ns-w--fluid", `<div class="ns-w__head"><p class="ns-w__title">Signup funnel</p><span class="ns-w__cmp">Last 30 days</span></div><div class="ns-funnel--L">${FUNNEL.map(([l, n, p, c], i) => `<div class="ns-funnel__col"><span class="ns-w__cmp">${l}</span><b class="ns-funnel__n">${n}</b><span class="ns-funnel__share">${p}% of visits</span><div class="ns-funnel__well"><i style="--_v:${Math.max(p, 5)}%;--_c:${v(c)}" role="img" aria-label="${l} ${n}"></i></div><span class="ns-funnel__drop ${i < FUNNEL.length - 1 ? "" : "is-end"}">${i < FUNNEL.length - 1 ? `↓ ${Math.round((1 - FUNNEL[i + 1][2] / p) * 100)}% drop-off` : "End of funnel"}</span></div>`).join("")}</div>`),

    /* Uptime strip (Figma: Widget / Uptime strip) */
    "uptime-M": () => shell("ns-w--M ns-w--fluid", `${kpi({ title: "API uptime", value: "99.95%", delta: "0.02%", cmp: "Last 30 days, SLA 99.9%" })}${strip(30, (i) => (i === 23 ? "down" : i === 7 || i === 12 ? "warn" : "ok"))}<div class="ns-w__range"><span>30 days ago</span><span>Today</span></div>`),
    "uptime-L": () => shell("ns-w--XL ns-w--fluid", `<div class="ns-w__head"><p class="ns-w__title">Platform status <b class="ns-w__inline">99.95%</b></p>${legend([["Operational", "status-success"], ["Degraded", "status-warning"], ["Outage", "status-error"]], true)}</div>${[["API gateway", "99.92%", (i) => (i === 61 ? "down" : i % 23 === 9 ? "warn" : "ok")], ["Auth", "100%", () => "ok"], ["Data sync", "99.90%", (i) => (i === 18 || i === 77 ? "down" : i % 31 === 4 ? "warn" : "ok")]].map(([s, p, f]) => `<div class="ns-uptime__svc"><div class="ns-w__head"><span class="ns-w__cmp">${s}</span><span class="ns-wt__num">${p}</span></div>${strip(90, f)}</div>`).join("")}<div class="ns-w__range"><span>90 days ago</span><span>Today</span></div>`),

    /* States (Figma: Widget / State) */
    state: (o) => { const s = o.state || "empty", sz = o.size || "M"; const cls = sz === "S" ? "ns-w--S" : sz === "L" ? "ns-w--XL ns-w--fluid" : "ns-w--M ns-w--fluid"; if (s === "loading") return shell(`${cls} ns-w--state is-loading`, sz === "S" ? `<i class="ns-sk ns-sk--ring"></i><i class="ns-sk" style="width:60px"></i>` : `<i class="ns-sk" style="width:110px"></i><i class="ns-sk ns-sk--lg" style="width:150px"></i><i class="ns-sk" style="width:180px"></i><div class="ns-sk__bars">${Array.from({ length: sz === "L" ? 34 : 18 }, (_, i) => `<i class="ns-sk" style="height:${Math.round(35 + 65 * Math.abs(Math.sin(i * 0.7)))}%"></i>`).join("")}</div>`).replace('class="ns ns-w', 'aria-busy="true" class="ns ns-w'); const C = { empty: ["+", "No data yet", "Data appears after the first sync.", "widget-muted"], error: ["!", "Couldn't load", "The service did not respond.", "status-error"], none: ["?", "No results", "Try a longer date range or fewer filters.", "status-warning"] }[s]; return shell(`${cls} ns-w--state`, `<span class="ns-state__icon" style="--_c:${v(C[3])}">${C[0]}</span><p class="${sz === "S" ? "ns-w__cmp" : "ns-w__title"}">${sz === "S" && s === "error" ? "Error" : C[1]}</p>${sz === "S" ? "" : `<span class="ns-w__cmp">${C[2]}</span>`}${s === "error" && sz !== "S" ? `<a class="ns-state__retry" href="#" role="button">Retry</a>` : ""}`); },

    /* Chart parts (Figma: Chart / Legend, Chart / Tooltip) */
    legend: (o) => `<div class="ns ns-w__part">${o.layout === "values" ? `<div class="ns-legend ns-legend--values">${SER.map(([l, c, p]) => `<span><i style="--_c:${v(c)}"></i>${l}<b>${p}</b></span>`).join("")}</div>` : legend(SER, false, o.layout === "vertical")}</div>`,
    tooltip: (o) => `<div class="ns ns-w__part"><div class="ns-ctip" role="tooltip"><span class="ns-ctip__date">Mar 14, 2026</span>${o.multi ? SER.slice(0, 3).map(([l, c], i) => `<div class="ns-ctip__row"><i style="--_c:${v(c)}"></i><span>${l}</span><b>$${fmt([7655, 9117, 10579][i])}</b></div>`).join("") : `<div class="ns-ctip__val">$12,875 <span class="ns-w__delta">10%</span></div>`}</div></div>`,
  };

  NS.widget = (name, opts = {}) => (R[name] ? R[name](opts) : `<div class="ns-w">Unknown widget: ${name}</div>`);
  NS.widgetNames = Object.keys(R);
  NS.hydrate = (root = document) => root.querySelectorAll("[data-ns-widget]").forEach((el) => { const o = { ...el.dataset }; delete o.nsWidget; ["value", "count", "rows", "seed", "w"].forEach((k) => o[k] && (o[k] = +o[k])); el.innerHTML = NS.widget(el.dataset.nsWidget, o); });
  NS.charts = { ring, concentric, lines, columns, bubbles, dots, stacked, timeline };

  /* ---------- Figma catalog: every symbol on page 427:8676 ---------- */
  const F = (fam, figma, nodeId, size, w, h, name, opts = {}) => ({ fam, figma, nodeId, size, w, h, name, opts });
  NS.WIDGETS = [
    F("circle", "Widget / Circle chart · Size=S, Layout=Ring", "557:1168", "S", 96, 96, "circle-S"),
    F("circle", "Widget / Circle chart · Size=M, Layout=Row", "554:27", "M", 290, 96, "circle-M"),
    F("circle", "Widget / Circle chart · Size=M, Layout=Wide", "596:275", "M", 346, 174, "circle-wide"),
    F("circle", "Widget / Circle chart · Size=M, Layout=Big number", "596:533", "M", 268, 128, "circle-big"),
    F("circle", "Widget / Circle chart · Table=Simple", "557:1246", "M", 290, 376, "circle-table", { table: "simple" }),
    F("circle", "Widget / Circle chart · Table=Progress", "557:1237", "M", 290, 241, "circle-table", { table: "progress" }),
    F("circle", "Widget / Circle chart · Table=Dynamic", "557:1211", "M", 290, 221, "circle-table", { table: "dynamic" }),
    F("circle", "Widget / Circle chart · Table=Indicator", "557:1191", "M", 290, 496, "circle-table", { table: "indicator" }),
    F("circle", "Widget / Composite circle chart · Size=S, Layout=Vertical", "557:1176", "S", 96, 192, "circle-composite-S"),
    F("circle", "Widget / Composite circle chart · Size=M, Layout=Stacked", "557:1220", "M", 290, 194, "circle-composite", { count: 2 }),
    F("circle", "Widget / Composite circle chart · Size=L, Layout=Row", "557:983", "L", 870, 96, "circle-composite", { count: 3 }),
    F("combined", "Widget / Combined circle chart · Size=S, Layout=Ring", "559:1107", "S", 96, 96, "combined-S"),
    F("combined", "Widget / Combined circle chart · Size=M, Layout=Ring", "559:1203", "M", 290, 222, "combined-M"),
    F("combined", "Widget / Combined circle chart · Layout=Double ring", "559:1333", "M", 290, 287, "combined-double"),
    F("combined", "Widget / Combined circle chart · Ring, Table=Simple", "559:1367", "M", 290, 502, "combined-table", { table: "simple" }),
    F("combined", "Widget / Combined circle chart · Ring, Table=Progress", "559:1436", "M", 290, 367, "combined-table", { table: "progress" }),
    F("combined", "Widget / Combined circle chart · Ring, Table=Dynamic", "559:1444", "M", 290, 347, "combined-table", { table: "dynamic" }),
    F("combined", "Widget / Combined circle chart · Ring, Table=Indicator", "559:1398", "M", 290, 622, "combined-table", { table: "indicator" }),
    F("line", "Widget / Line chart · Size=S, Layout=Tile", "556:18404", "S", 116, 116, "line-S"),
    F("line", "Widget / Line chart · Size=S, Layout=Stacked", "556:18400", "S", 116, 232, "line-composite-S"),
    F("line", "Widget / Line chart · Size=M, Layout=Row", "561:1423", "M", 290, 96, "line-M"),
    F("line", "Widget / Lines chart · Style=KPI", "556:18483", "M", 294, 217, "lines-M"),
    F("line", "Widget / Lines chart · Style=Wide", "596:199", "M", 346, 178, "lines-wide"),
    F("line", "Widget / Line chart · Size=M, Layout=Stacked", "561:1316", "M", 290, 192, "composite-line"),
    F("line", "Widget / Lines chart · Style=Trend", "556:18781", "M", 290, 277, "big-lines"),
    F("line", "Widget / Lines chart · KPI, Table=Indicator", "561:1425", "M", 294, 617, "big-lines", { table: "indicator" }),
    F("line", "Widget / Lines chart · KPI, Table=Progress", "561:1545", "M", 294, 362, "big-lines", { table: "progress" }),
    F("line", "Widget / Lines chart · KPI, Table=Dynamic", "561:1544", "M", 294, 342, "big-lines", { table: "dynamic" }),
    F("line", "Widget / Line chart · Size=L, Layout=Lines", "565:1", "L", 870, 362, "lines-L"),
    F("line", "Widget / Line chart · Size=L, Layout=Dots", "565:0", "L", 870, 362, "dots-L"),
    F("column", "Widget / Column chart · Size=S, Layout=Tile", "556:21338", "S", 116, 116, "column-S"),
    F("column", "Widget / Column chart · Size=S, Layout=Stacked", "556:21339", "S", 116, 232, "column-composite-S"),
    F("column", "Widget / Column chart · Size=M, Layout=Chart top", "556:21707", "M", 290, 229, "column-M"),
    F("column", "Widget / Column chart · Chart top, Table=Simple", "563:1434", "M", 290, 509, "column-M", { table: "indicator" }),
    F("column", "Widget / Column chart · Chart top, Table=Progress", "563:1431", "M", 290, 374, "column-M", { table: "progress" }),
    F("column", "Widget / Column chart · Chart top, Table=Dynamic", "563:1433", "M", 290, 354, "column-M", { table: "dynamic" }),
    F("column", "Widget / Column chart · Size=L, Layout=Track", "563:1432", "L", 576, 217, "column-L"),
    F("column", "Widget / Column chart · Size=L, Layout=Stacked bars", "609:169", "L", 1070, 533, "stacked-L"),
    F("bubble", "Widget / Bubble chart · Size=S, Layout=Tile", "556:16232", "S", 116, 116, "bubble-S"),
    F("bubble", "Widget / Bubble chart · Size=M, Layout=Row", "560:15", "M", 290, 96, "bubble-row"),
    F("bubble", "Widget / Bubble chart · Size=M, Layout=Chart top", "556:16386", "M", 290, 218, "bubble-M"),
    F("bubble", "Widget / Bubble chart · Chart top, Table=Indicator", "560:1", "M", 290, 618, "bubble-M", { table: "indicator" }),
    F("bubble", "Widget / Bubble chart · Chart top, Table=Progress", "560:13", "M", 290, 363, "bubble-M", { table: "progress" }),
    F("bubble", "Widget / Bubble chart · Chart top, Table=Dynamic", "560:14", "M", 290, 343, "bubble-M", { table: "dynamic" }),
    F("bubble", "Widget / Bubble chart · Size=L, Layout=Chart", "556:16938", "L", 870, 362, "bubble-L"),
    F("bubble", "Widget / Other · Type=Global statistic wide", "609:170", "L", 1071, 532, "bubble-global"),
    F("bubble", "Widget / Bubble chart · Size=L, Layout=Timeline", "556:17124", "L", 1800, 96, "bubble-timeline"),
    F("other", "Widget / Other · Type=Timeline", "565:2", "L", 1800, 86, "timeline-L"),
    F("other", "Widget / Other · Type=Compound circular", "565:5", "L", 539, 639, "compound-L"),
    F("other", "Widget / Other · Type=Global statistic", "565:4", "L", 573, 558, "global-stat"),
    F("other", "Widget / Other · Type=Progress", "565:7", "M", 290, 278, "progress-M"),
    F("other", "Widget / Other · Type=Temperature", "565:8", "M", 290, 371, "temperature-M"),
    F("other", "Widget / Other · Type=Summary", "565:3", "L", 708, 229, "summary-L"),
    F("other", "Widget / Informer · Type=Index with progress", "565:6", "M", 422, 220, "index-progress"),
    F("table", "Widget / Table · Type=Simple", "554:679", "M", 290, 280, "table-simple"),
    F("table", "Widget / Table · Type=Progress", "554:743", "M", 290, 145, "table-progress"),
    F("table", "Widget / Table · Type=Dynamic", "554:765", "M", 290, 125, "table-dynamic"),
    F("table", "Widget / Table · Type=Indicator", "554:793", "M", 290, 400, "table-indicator"),
    F("table", "Widget / Table · Type=Classic", "596:78", "M", 367, 166, "table-classic"),
    F("informer", "Widget / Informer · Type=Index", "566:270", "M", 290, 128, "index-M"),
    F("informer", "Widget / Informer · Composite, Rows=1", "566:271", "M", 290, 252, "index-composite", { rows: 1 }),
    F("informer", "Widget / Informer · Composite, Rows=2", "566:272", "M", 290, 376, "index-composite", { rows: 2 }),
    F("informer", "Widget / Informer · Composite, Rows=3", "566:273", "M", 290, 300, "index-composite", { rows: 3 }),

    F("gauge", "Widget / Gauge · Size=S", "4254:3490", "S", 116, 120, "gauge-S"),
    F("gauge", "Widget / Gauge · Size=M, Thresholds=No", "4254:3495", "M", 290, 232, "gauge-M"),
    F("gauge", "Widget / Gauge · Size=M, Thresholds=Yes", "4254:3507", "M", 290, 232, "gauge-M", { thresholds: true }),
    F("area", "Widget / Area chart · Size=M, Series=One", "4254:3630", "M", 290, 200, "area-M"),
    F("area", "Widget / Area chart · Size=M, Series=Two", "4254:3643", "M", 290, 200, "area-M", { series: 2 }),
    F("area", "Widget / Area chart · Size=L, Series=One", "4254:3658", "L", 870, 354, "area-L"),
    F("area", "Widget / Area chart · Size=L, Series=Two", "4254:3692", "L", 870, 354, "area-L", { series: 2 }),
    F("heatmap", "Widget / Heatmap · Size=M", "4254:3737", "M", 290, 266, "heatmap-M"),
    F("heatmap", "Widget / Heatmap · Size=L", "4254:3849", "L", 870, 326, "heatmap-L"),
    F("ranked", "Widget / Ranked bar · Size=M", "4254:34932", "M", 290, 320, "ranked-M"),
    F("ranked", "Widget / Ranked bar · Size=L", "4254:34977", "L", 576, 344, "ranked-L"),
    F("funnel", "Widget / Funnel · Size=M", "4254:35039", "M", 290, 304, "funnel-M"),
    F("funnel", "Widget / Funnel · Size=L", "4254:35074", "L", 870, 352, "funnel-L"),
    F("uptime", "Widget / Uptime strip · Size=M", "4254:35113", "M", 290, 184, "uptime-M"),
    F("uptime", "Widget / Uptime strip · Size=L", "4254:35157", "L", 870, 310, "uptime-L"),
    F("state", "Widget / State · Size=S, State=Loading", "4254:35732", "S", 116, 116, "state", { state: "loading", size: "S" }),
    F("state", "Widget / State · Size=S, State=Empty", "4254:35735", "S", 116, 116, "state", { state: "empty", size: "S" }),
    F("state", "Widget / State · Size=S, State=Error", "4254:35739", "S", 116, 116, "state", { state: "error", size: "S" }),
    F("state", "Widget / State · Size=S, State=No results", "4254:35743", "S", 116, 116, "state", { state: "none", size: "S" }),
    F("state", "Widget / State · Size=M, State=Loading", "4254:35747", "M", 290, 200, "state", { state: "loading", size: "M" }),
    F("state", "Widget / State · Size=M, State=Empty", "4254:35770", "M", 290, 200, "state", { state: "empty", size: "M" }),
    F("state", "Widget / State · Size=M, State=Error", "4254:35775", "M", 290, 200, "state", { state: "error", size: "M" }),
    F("state", "Widget / State · Size=M, State=No results", "4254:35781", "M", 290, 200, "state", { state: "none", size: "M" }),
    F("state", "Widget / State · Size=L, State=Loading", "4254:35786", "L", 870, 362, "state", { state: "loading", size: "L" }),
    F("state", "Widget / State · Size=L, State=Empty", "4254:35825", "L", 870, 362, "state", { state: "empty", size: "L" }),
    F("state", "Widget / State · Size=L, State=Error", "4254:35830", "L", 870, 362, "state", { state: "error", size: "L" }),
    F("state", "Widget / State · Size=L, State=No results", "4254:35836", "L", 870, 362, "state", { state: "none", size: "L" }),
    F("parts", "Chart / Legend · Layout=Horizontal", "4254:35847", "S", 277, 16, "legend"),
    F("parts", "Chart / Legend · Layout=Vertical", "4254:35860", "S", 74, 88, "legend", { layout: "vertical" }),
    F("parts", "Chart / Legend · Layout=With values", "4254:35873", "S", 230, 110, "legend", { layout: "values" }),
    F("parts", "Chart / Tooltip · Type=Single", "4254:35892", "S", 140, 76, "tooltip"),
    F("parts", "Chart / Tooltip · Type=Multi-series", "4254:35897", "S", 180, 104, "tooltip", { multi: true }),
  ];
  NS.FAMILIES = [
    ["circle", "Circle charts", "Single-value progress rings with optional KPI and table.", "○"],
    ["line", "Line charts", "Trends over time: sparklines, multi-line, and dot plots with thresholds.", "∿"],
    ["combined", "Combined circle charts", "Two-part rings that split a total, plus concentric doubles.", "◔"],
    ["column", "Column charts", "Paired capsule columns and stacked monthly bars.", "❙"],
    ["bubble", "Bubble charts", "Magnitude over time: bubble grids, timelines, and labeled clusters.", "●"],
    ["other", "Other", "Compound circular, timeline, temperature, summary, and progress widgets.", "◈"],
    ["table", "Tables", "The five table types that attach under any M-size widget.", "≡"],
    ["informer", "Simple informers", "Headline KPIs with comparison and inset stat pairs.", "$"],
    ["gauge", "Gauges", "Semicircle meters for capacity and utilization, with optional warning and critical bands.", "◠"],
    ["area", "Area charts", "Filled trends that show volume over time, one or two series.", "◭"],
    ["heatmap", "Heatmaps", "Intensity by day and hour or week, on one sequential color.", "▦"],
    ["ranked", "Ranked bars", "Horizontal bars for ranked categories and long labels.", "☰"],
    ["funnel", "Funnels", "Stage-by-stage conversion with drop-off between steps.", "⏷"],
    ["uptime", "Uptime strips", "Daily status history against an SLA, per service.", "▮"],
    ["state", "Widget states", "Loading, empty, error, and no-results states for every widget size.", "◌"],
    ["parts", "Chart parts", "Legend and tooltip parts to compose custom charts.", "⋯"],
  ];
})();
