/* NorthStar dashboard kit: chart parts and shell helpers. Pure functions that return SVG or HTML strings.
   Every color is a NorthStar token (var(--ns-...)), so parts follow theme. Exposed as NS.dash.
   Pair with css/dashboards.css. Layout recipes live in dashboards/*.html. */
(function () {
  const NS = (window.NS = window.NS || {});
  const D = (NS.dash = {});
  let n = 0;
  const uid = (p) => `${p}${++n}`;
  const T = (t) => `var(--ns-${t})`;
  D.T = T;

  D.rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  /* series: n points, start..end drift with noise */
  D.series = (len, a, b, vol = .08, seed = 1) => {
    const r = D.rng(seed); const span = b - a; let wob = 0;
    return Array.from({ length: len }, (_, i) => { wob = wob * .6 + (r() - .5) * vol * Math.abs(span || a); return a + span * (i / (len - 1)) + wob + Math.sin(i * .9 + seed) * vol * .5 * Math.abs(span || a); });
  };

  const smooth = (pts) => {
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  };
  D.smooth = smooth;

  const text = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || T("chart-label-text")}" font-size="${o.size || 11}" font-weight="${o.weight || 400}" text-anchor="${o.anchor || "start"}" ${o.ls ? `letter-spacing="${o.ls}"` : ""}>${s}</text>`;

  /* ---------- area / line ---------- */
  D.area = ({ w = 600, h = 220, sets, labels = [], ticks = 4, min, max, grid = true, pad = [8, 8, 22, 34], fmt = (v) => v, dots, ink, gridColor, labelFill, last = true, glow = false }) => {
    const [pt, pr, pb, pl] = pad; const iw = w - pl - pr, ih = h - pt - pb;
    const all = sets.flatMap((s) => s.data); const lo = min ?? Math.min(...all), hi = max ?? Math.max(...all);
    const X = (i, len) => pl + (iw * i) / (len - 1), Y = (v) => pt + ih - ((v - lo) / (hi - lo || 1)) * ih;
    const gc = gridColor || T("widget-grid"); const lf = labelFill || T("chart-label-text");
    let defs = "", out = "";
    if (grid) for (let i = 0; i < ticks; i++) { const y = pt + (ih * i) / (ticks - 1); out += `<line x1="${pl}" x2="${w - pr}" y1="${y}" y2="${y}" stroke="${gc}" stroke-width="1" ${i === ticks - 1 ? "" : 'stroke-dasharray="2 5"'} opacity="${i === ticks - 1 ? 1 : .8}"/>`; out += text(pl - 8, y + 4, fmt(hi - ((hi - lo) * i) / (ticks - 1)), { anchor: "end", size: 10, fill: lf }); }
    sets.forEach((s, si) => {
      const N = s.n || s.data.length, F = s.from || 0; const pts = s.data.map((v, i) => [X(i + F, N), Y(v)]);
      const c = s.color || T("chart-series-1"); const line = s.step ? "M" + pts.map((p) => p.join(",")).join(" L") : smooth(pts);
      if (s.fill !== false) { const g = uid("ag"); defs += `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="${s.fillTop ?? .38}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`; out += `<path d="${line} L${pts.at(-1)[0]},${pt + ih} L${pts[0][0]},${pt + ih} Z" fill="url(#${g})"/>`; }
      if (s.band) { const hi2 = s.band.map((b, i) => [X(i + F, N), Y(b[1])]), lo2 = s.band.map((b, i) => [X(i + F, N), Y(b[0])]).reverse(); out += `<path d="${smooth(hi2)} L${lo2[0][0]},${lo2[0][1]} ${smooth(lo2).replace(/^M[^C]*/, "")} Z" fill="${c}" opacity=".16"/>`; }
      if (glow) out += `<path d="${line}" fill="none" stroke="${c}" stroke-width="${(s.sw || 2.5) + 5}" opacity=".18" stroke-linecap="round" stroke-linejoin="round"/>`;
      out += `<path d="${line}" fill="none" stroke="${c}" stroke-width="${s.sw || 2.5}" ${s.dash ? `stroke-dasharray="${s.dash}"` : ""} stroke-linecap="round" stroke-linejoin="round"/>`;
      if (last && s.last !== false) { const p = pts.at(-1); out += `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${c}" opacity=".18"/><circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="${ink || T("widget-bg")}" stroke="${c}" stroke-width="2.5"/>`; }
    });
    labels.forEach((l, i) => { out += text(pl + (iw * i) / (labels.length - 1), h - 4, l, { anchor: i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle", size: 10, fill: lf }); });
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img"><defs>${defs}</defs>${out}</svg>`;
  };

  D.spark = ({ w = 120, h = 36, data, color = T("chart-series-1"), fill = true, sw = 2 }) => D.area({ w, h, sets: [{ data, color, fill, sw, last: false }], grid: false, pad: [3, 3, 3, 3] });

  /* ---------- bars ---------- */
  D.bars = ({ w = 600, h = 220, data, color = T("chart-series-1"), hi, hiColor, gap = 6, r = 4, labels = [], pad = [8, 4, 22, 4], track = false, vmax, fmt, labelFill, gridColor, grid = false, ticks = 4, pl }) => {
    const [pt, pr, pb, pl0] = pad; const L = pl ?? pl0; const iw = w - L - pr, ih = h - pt - pb; const m = vmax ?? Math.max(...data); const bw = (iw - gap * (data.length - 1)) / data.length;
    let o = "";
    if (grid) for (let i = 0; i < ticks; i++) { const y = pt + (ih * i) / (ticks - 1); o += `<line x1="${L}" x2="${w - pr}" y1="${y}" y2="${y}" stroke="${gridColor || T("widget-grid")}" stroke-dasharray="2 5"/>`; if (fmt) o += text(L - 8, y + 4, fmt(m - (m * i) / (ticks - 1)), { anchor: "end", size: 10, fill: labelFill }); }
    data.forEach((v, i) => {
      const bh = Math.max(2, (v / m) * ih), x = L + i * (bw + gap), y = pt + ih - bh; const c = hi === i ? (hiColor || T("chart-target")) : (Array.isArray(color) ? color[i] : color);
      if (track) o += `<rect x="${x}" y="${pt}" width="${bw}" height="${ih}" rx="${r}" fill="${T("chart-track")}"/>`;
      o += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="${r}" fill="${c}"/>`;
      if (labels[i] != null) o += text(x + bw / 2, h - 5, labels[i], { anchor: "middle", size: 10, fill: labelFill });
    });
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img">${o}</svg>`;
  };

  /* stacked bars: sets = [{data,color}] */
  D.stack = ({ w = 600, h = 220, sets, gap = 6, r = 3, labels = [], pad = [8, 4, 22, 4], labelFill, gap2 = 2 }) => {
    const [pt, pr, pb, pl] = pad; const len = sets[0].data.length; const iw = w - pl - pr, ih = h - pt - pb; const bw = (iw - gap * (len - 1)) / len;
    const tot = Array.from({ length: len }, (_, i) => sets.reduce((a, s) => a + s.data[i], 0)); const m = Math.max(...tot); let o = "";
    for (let i = 0; i < len; i++) { let y = pt + ih; const x = pl + i * (bw + gap); sets.forEach((s, si) => { const bh = (s.data[i] / m) * ih; y -= bh; o += `<rect x="${x}" y="${y}" width="${bw}" height="${Math.max(0, bh - gap2)}" rx="${r}" fill="${s.color}"/>`; }); if (labels[i] != null) o += text(x + bw / 2, h - 5, labels[i], { anchor: "middle", size: 10, fill: labelFill }); }
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img">${o}</svg>`;
  };

  /* ---------- rings ---------- */
  D.ring = ({ size = 120, stroke = 12, pct = 60, color = T("chart-series-1"), track = T("chart-track"), label, sub, labelFill, subFill, fs, grad }) => {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, g = uid("rg");
    const def = grad ? `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${grad[0]}"/><stop offset="1" stop-color="${grad[1]}"/></linearGradient></defs>` : "";
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" role="img" aria-label="${label ?? pct}">${def}<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${grad ? `url(#${g})` : color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(c * pct) / 100} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/>${label != null ? text(size / 2, size / 2 + (sub ? 2 : (fs || size * .22) * .36), label, { anchor: "middle", size: fs || size * .22, weight: 800, fill: labelFill || T("text-primary") }) : ""}${sub ? text(size / 2, size / 2 + 16, sub, { anchor: "middle", size: 10, fill: subFill }) : ""}</svg>`;
  };

  D.rings = ({ size = 260, stroke = 14, gap = 8, items }) => {
    let o = "";
    items.forEach((it, i) => { const r = size / 2 - stroke / 2 - i * (stroke + gap), c = 2 * Math.PI * r; o += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${it.track || T("chart-track")}" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${it.color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(c * it.pct * .75) / 100} ${c}" transform="rotate(135 ${size / 2} ${size / 2})" opacity="1"/>`; });
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" role="img">${o}</svg>`;
  };

  D.donut = ({ size = 180, stroke = 26, parts, gap = 3, center, sub, centerFill }) => {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, tot = parts.reduce((a, p) => a + p.v, 0); let off = 0, o = "";
    parts.forEach((p) => { const len = (p.v / tot) * c; o += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${p.color}" stroke-width="${stroke}" stroke-dasharray="${Math.max(0, len - gap)} ${c}" stroke-dashoffset="${-off}" transform="rotate(-90 ${size / 2} ${size / 2})"/>`; off += len; });
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" role="img">${o}${center ? text(size / 2, size / 2 + (sub ? 2 : 9), center, { anchor: "middle", size: 26, weight: 800, fill: centerFill || T("text-primary") }) : ""}${sub ? text(size / 2, size / 2 + 20, sub, { anchor: "middle", size: 10 }) : ""}</svg>`;
  };

  D.gauge = ({ w = 220, pct = 60, color = T("chart-series-1"), stroke = 16, label, sub, track = T("chart-track"), labelFill, bands }) => {
    const r = (w - stroke) / 2, cx = w / 2, cy = w / 2 + 4, len = Math.PI * r; const arc = `M${stroke / 2},${cy} A${r},${r} 0 0 1 ${w - stroke / 2},${cy}`;
    return `<svg viewBox="0 0 ${w} ${cy + 22}" width="${w}" role="img"><path d="${arc}" fill="none" stroke="${track}" stroke-width="${stroke}" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(len * pct) / 100} ${len}"/>${label != null ? text(cx, cy - 4, label, { anchor: "middle", size: w * .2, weight: 800, fill: labelFill || T("text-primary") }) : ""}${sub ? text(cx, cy + 16, sub, { anchor: "middle", size: 10 }) : ""}</svg>`;
  };

  /* ---------- radar ---------- */
  D.radar = ({ size = 320, axes, sets, rings = 4, labelFill, gridColor, m = 80, px = 0 }) => {
    const c = size / 2, R = size / 2 - m, N = axes.length; const P = (i, k) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N; return [c + Math.cos(a) * R * k, c + Math.sin(a) * R * k]; };
    let o = ""; for (let k = 1; k <= rings; k++) o += `<polygon points="${axes.map((_, i) => P(i, k / rings).join(",")).join(" ")}" fill="none" stroke="${gridColor || T("widget-grid")}" stroke-width="1"/>`;
    axes.forEach((a, i) => { const [x, y] = P(i, 1); o += `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="${gridColor || T("widget-grid")}"/>`; const [lx, ly] = P(i, 1.2); o += text(lx, ly + 4, a, { anchor: lx < c - 4 ? "end" : lx > c + 4 ? "start" : "middle", size: 11, fill: labelFill }); });
    sets.forEach((s) => { const pts = s.data.map((v, i) => P(i, v / 100)); o += `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${s.color}" fill-opacity="${s.fill ?? .16}" stroke="${s.color}" stroke-width="2.2" stroke-linejoin="round" ${s.dash ? 'stroke-dasharray="4 4"' : ""}/>`; if (!s.dash) pts.forEach((p) => (o += `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${s.color}"/>`)); });
    return `<svg viewBox="${-px} 0 ${size + 2 * px} ${size}" width="${size + 2 * px}" role="img">${o}</svg>`;
  };

  /* ---------- heat grid ---------- */
  D.heat = ({ rows = 7, cols = 24, cell = 18, ch, gap = 3, seed = 3, color = T("viz-1"), fn, round = 4 }) => {
    const r = D.rng(seed); let h = "";
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const v = fn ? fn(x, y, r) : r(); h += `<i style="--_o:${Math.max(0, Math.min(1, v)).toFixed(2)};--_c:${color};width:${cell}px;height:${ch || cell}px;border-radius:${round}px"></i>`; }
    return `<div class="hm" style="grid-template-columns:repeat(${cols},${cell}px);gap:${gap}px">${h}</div>`;
  };

  /* ---------- dot field "map": hotspots over a dot matrix ---------- */
  D.dotmap = ({ w = 560, h = 300, step = 11, spots = [], seed = 5, color = T("viz-1") }) => {
    const r = D.rng(seed); let o = "";
    const blobs = [[.2, .38, .17, .26], [.29, .72, .07, .22], [.5, .34, .08, .2], [.52, .62, .08, .24], [.7, .38, .2, .26], [.84, .74, .06, .12]];
    for (let y = step; y < h - step / 2; y += step) for (let x = step; x < w - step / 2; x += step) {
      const nx = x / w, ny = y / h; let inl = 0; blobs.forEach(([bx, by, rx, ry]) => { const d = ((nx - bx) / rx) ** 2 + ((ny - by) / ry) ** 2; if (d < 1) inl = Math.max(inl, 1 - d); });
      if (inl > .08 && r() < .35 + inl * .75) o += `<circle cx="${x}" cy="${y}" r="${(1.5 + inl * .9).toFixed(2)}" fill="${T("widget-muted")}" opacity="${(.28 + inl * .5).toFixed(2)}"/>`;
    }
    spots.forEach(([sx, sy, mag, lab]) => { const x = sx * w, y = sy * h; o += `<circle cx="${x}" cy="${y}" r="${12 + mag * 20}" fill="${color}" opacity=".12"/><circle cx="${x}" cy="${y}" r="${6 + mag * 8}" fill="${color}" opacity=".28"/><circle cx="${x}" cy="${y}" r="3.5" fill="${color}"/>`; if (lab) o += text(x + 12 + mag * 6, y + 4, lab, { size: 11, weight: 700, fill: T("text-primary") }); });
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img">${o}</svg>`;
  };

  /* ---------- candles ---------- */
  D.candles = ({ w = 600, h = 220, n = 36, seed = 7, up = T("status-success"), down = T("status-error"), grid = true }) => {
    const r = D.rng(seed); let p = 100, o = ""; const cs = []; for (let i = 0; i < n; i++) { const op = p, cl = p + (r() - .46) * 7 + .35; const hi = Math.max(op, cl) + r() * 3.5, lo = Math.min(op, cl) - r() * 3.5; cs.push([op, cl, hi, lo]); p = cl; }
    const mx = Math.max(...cs.map((c) => c[2])), mn = Math.min(...cs.map((c) => c[3])); const Y = (v) => 8 + (h - 24) - ((v - mn) / (mx - mn)) * (h - 24); const bw = (w - 6) / n;
    if (grid) for (let i = 0; i < 4; i++) o += `<line x1="0" x2="${w}" y1="${8 + ((h - 24) * i) / 3}" y2="${8 + ((h - 24) * i) / 3}" stroke="${T("widget-grid")}" stroke-dasharray="2 5"/>`;
    cs.forEach(([op, cl, hi, lo], i) => { const x = 3 + i * bw + bw / 2, c = cl >= op ? up : down; o += `<line x1="${x}" x2="${x}" y1="${Y(hi)}" y2="${Y(lo)}" stroke="${c}" stroke-width="1.5"/><rect x="${x - bw * .32}" y="${Y(Math.max(op, cl))}" width="${bw * .64}" height="${Math.max(2, Math.abs(Y(op) - Y(cl)))}" rx="1.5" fill="${c}"/>`; });
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img">${o}</svg>`;
  };

  /* ---------- bullet / progress ---------- */
  D.bullet = ({ pct = 70, target = 85, color = T("chart-series-1"), h = 10 }) => `<div style="position:relative;height:${h}px;border-radius:${h / 2}px;background:var(--faint,var(--ns-chart-track))"><i style="position:absolute;inset:0 auto 0 0;width:${pct}%;border-radius:inherit;background:${color}"></i><b style="position:absolute;left:${target}%;top:-4px;bottom:-4px;width:2px;background:var(--ink,var(--ns-chart-target));border-radius:1px"></b></div>`;

  /* ---------- waterfall ---------- */
  D.waterfall = ({ w = 700, h = 240, steps, labels = [], labelFill, base = 0 }) => {
    let run = 0, o = ""; const pts = steps.map((s) => { const a = run; run = s.total ? s.v : run + s.v; return { a: s.total ? base : a, b: run, s }; });
    const mx = Math.max(...pts.map((p) => Math.max(p.a, p.b))) * 1.08, bw = (w - 8) / steps.length * .64, st = (w - 8) / steps.length; const Y = (v) => 6 + (h - 30) - ((v - base) / (mx - base)) * (h - 30);
    pts.forEach((p, i) => { const x = 4 + i * st + (st - bw) / 2, y1 = Y(Math.max(p.a, p.b)), y2 = Y(Math.min(p.a, p.b)); const c = p.s.total ? T("chart-series-2") : p.s.v >= 0 ? T("chart-series-1") : T("status-error"); o += `<rect x="${x}" y="${y1}" width="${bw}" height="${Math.max(3, y2 - y1)}" rx="4" fill="${c}"/>`; if (i < pts.length - 1) o += `<line x1="${x + bw}" x2="${x + st}" y1="${Y(p.b)}" y2="${Y(p.b)}" stroke="${T("widget-grid")}" stroke-dasharray="2 3"/>`; o += text(x + bw / 2, h - 6, labels[i] ?? p.s.l, { anchor: "middle", size: 11, fill: labelFill }); o += text(x + bw / 2, y1 - 7, (p.s.v >= 0 && !p.s.total ? "+" : "") + p.s.v, { anchor: "middle", size: 11, weight: 700, fill: T("text-primary") }); });
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img">${o}</svg>`;
  };

  /* ---------- icons ---------- */
  const IC = {
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 010 6.4M18 14.8c2 .6 3.3 2.3 3.6 5.2"/>',
    bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.6 3.6 5.4 3.6 8.5s-1 5.9-3.6 8.5c-2.6-2.6-3.6-5.4-3.6-8.5s1-5.9 3.6-8.5z"/>',
    wallet: '<path d="M4 7.5A2.5 2.5 0 016.5 5H19v14H6.5A2.5 2.5 0 014 16.5z"/><path d="M19 9.5h-4a2 2 0 000 4h4"/>',
    pulse: '<path d="M3 12h4l2.5-6 4 12L16 12h5"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    star: '<path d="M12 2.5l2.7 6.2 6.8.6-5.1 4.5 1.5 6.7L12 17l-5.9 3.5 1.5-6.7L2.5 9.3l6.8-.6z"/>',
  };
  D.icon = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;
  D.star = '<svg viewBox="0 0 24 24"><path d="M12 1.5l2.9 7.6 8.1.5-6.3 5.1 2.1 7.8L12 18l-6.8 4.5 2.1-7.8L1 9.6l8.1-.5z"/></svg>';

  /* shell: rail + top bar. active = icon key. Returns {open, close} strings. */
  D.shell = ({ active = "grid", title, sub, right = "" }) => {
    const items = ["grid", "chart", "users", "globe", "bolt", "wallet", "pulse"]; if (!items.includes(active)) items[4] = active;
    const rail = `<nav class="rail" aria-label="Primary"><div class="rail__logo">${D.star}</div>${items.map((k) => `<a class="${k === active ? "on" : ""}">${D.icon(k)}</a>`).join("")}<span class="sp"></span><a>${D.icon("cog")}</a><div class="av">MR</div></nav>`;
    return { open: `${rail}<div class="main"><header class="top"><div><h1 class="top__ttl">${title}</h1><div class="top__sub">${sub}</div></div><span class="top__sp"></span>${right}</header>`, close: `</div>` };
  };
  D.seg = (items, on = 0) => `<div class="seg">${items.map((s, i) => `<b class="${i === on ? "on" : ""}">${s}</b>`).join("")}</div>`;
  D.live = (s = "Live") => `<span class="pill"><i></i>${s}</span>`;
  D.fmt = (v) => v.toLocaleString("en-US");

  /* ---------- NorthStar: five-state spine + project rail ---------- */
  const STATES = [["Project", "Client, contact, technologies", "3 technologies"], ["Configuration", "Compare, score, choose", "3 of 6 chosen"], ["Discovery", "Assessments and status", "4 of 6 returned"], ["Registration", "Confirm what step 2 decided", "2 of 3 approved"], ["Contract", "Deployments and billing", "0 of 14 sites live"]];
  D.STATES = STATES;
  D.spine = (cur) => `<section class="t spine">${STATES.map(([n, sub, st], i) => { const k = i < cur ? "done" : i === cur ? "cur" : "todo"; return `<div class="stp ${k}"><span class="sp__n">${k === "done" ? "&#10003;" : i + 1}</span><div><b>${n}</b><small>${sub}</small></div><em>${st}</em></div>`; }).join("")}</section>`;
  D.miniSpine = (cur, w = 5) => `<span class="ms">${Array.from({ length: w }, (_, i) => `<i class="${i < cur ? "d" : i === cur ? "c" : ""}"></i>`).join("")}</span>`;
  D.railPanel = () => `<aside class="t t--ink prail">
    <div class="o">Project rail <em>Travels with the deal</em></div>
    <div class="pr__s"><span class="pr__h">Research files</span>${[["Site survey, 14 locations", "PDF"], ["Current circuit inventory", "XLS"], ["Call notes, Oct 9", "DOC"]].map(([n, k]) => `<div class="pr__r"><span>${n}</span><span class="tag">${k}</span></div>`).join("")}</div>
    <div class="pr__s"><span class="pr__h">Quote versions</span><div class="row sb" style="gap:10px"><div><b class="d-sm num">v4</b><div class="cap">$12.9K / mo</div></div>${D.spark({ w: 118, h: 38, data: [14.2, 13.8, 13.5, 13.9, 13.1, 12.9], color: "var(--ns-teal-500)", sw: 2.2 })}</div></div>
    <div class="pr__s"><span class="pr__h">Watch list</span>${[["Kestrel price hold ends", "Oct 31", "var(--ns-status-warning)"], ["Altus install window", "Nov 12", "var(--ns-viz-4)"]].map(([n, d, c]) => `<div class="pr__r"><span class="row" style="gap:8px"><i class="dot" style="--_c:${c}"></i>${n}</span><span class="cap">${d}</span></div>`).join("")}</div>
    <div class="pr__s"><span class="pr__h">Recent activity</span>${[["Quote v4 sent", "Today, 9:12"], ["Site survey uploaded", "Yesterday"], ["Call with client contact", "Oct 20"]].map(([n, d]) => `<div class="pr__r"><span>${n}</span><span class="cap">${d}</span></div>`).join("")}</div>
    <div class="pr__s"><span class="pr__h">Ruled out, and why</span>${[["Pinecrest Telecom", "No coverage, 5 sites"], ["Orrin Cloud", "SLA below 99.9%"], ["Vantage Wireless", "Client declined 5G"]].map(([n, w]) => `<div class="pr__x"><b>${n}</b><span>${w}</span></div>`).join("")}</div>
  </aside>`;

  /* ---------- flow (sankey-style). cols = [[{l,v,c}], ...] with equal totals per column; links = [[srcCol, srcNode, dstNode, v, color]] */
  D.flow = ({ w = 760, h = 300, cols, links, colW = 16, labelFill, gapY = 12 }) => {
    const pad = 8; const k = Math.min(...cols.map(col => (h - 2 * pad - gapY * (col.length - 1)) / col.reduce((a, n) => a + n.v, 0)));
    const xs = cols.map((_, i) => 150 + i * ((w - 300) / (cols.length - 1))); let o = "", pos = {};
    cols.forEach((col, ci) => { const bh = col.reduce((a, n) => a + n.v * k, 0) + gapY * (col.length - 1); let y = (h - bh) / 2; col.forEach((n, ni) => { const hh = n.v * k; pos[ci + ":" + ni] = { y, hh, used: 0 }; o += `<rect x="${xs[ci]}" y="${y}" width="${colW}" height="${hh}" rx="3" fill="${n.c}"/>`; const last = ci === cols.length - 1, first = ci === 0; const lbl = `${n.l} ${n.v.toLocaleString("en-US")}`; if (first) o += text(xs[ci] - 10, y + hh / 2 + 4, lbl, { anchor: "end", size: 12, weight: 600, fill: labelFill }); else if (last) o += text(xs[ci] + colW + 10, y + hh / 2 + 4, lbl, { anchor: "start", size: 12, weight: 600, fill: labelFill }); else o += text(xs[ci] + colW / 2, y - 6, lbl, { anchor: "middle", size: 11, weight: 600, fill: labelFill }); y += hh + gapY; }); });
    (links || []).forEach(([ci, a, b, v, c]) => { const A = pos[ci + ":" + a], B = pos[(ci + 1) + ":" + b]; const hh = v * k; const y1 = A.y + A.used, y2 = B.y + B.used; A.used += hh; B.used += hh; const x1 = xs[ci] + colW, x2 = xs[ci + 1]; const mx = (x1 + x2) / 2; o += `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2} L${x2},${y2 + hh} C${mx},${y2 + hh} ${mx},${y1 + hh} ${x1},${y1 + hh} Z" fill="${c}" opacity=".3"/>`; });
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img">${o}</svg>`;
  };

  /* ---------- year calendar: 53 cols x 7 rows of cells, vals 0..1 ---------- */
  D.year = ({ vals, cell = 11, gap = 3, color = T("viz-1") }) => {
    let h = ""; vals.forEach((v, i) => { h += `<i style="--_o:${Math.max(.08, v).toFixed(2)};--_c:${color};width:${cell}px;height:${cell}px;border-radius:2px;grid-column:${Math.floor(i / 7) + 1};grid-row:${(i % 7) + 1}"></i>`; });
    const cols = Math.ceil(vals.length / 7);
    return `<div class="hm" style="display:grid;grid-template-columns:repeat(${cols},${cell}px);grid-template-rows:repeat(7,${cell}px);gap:${gap}px">${h}</div>`;
  };
})();
