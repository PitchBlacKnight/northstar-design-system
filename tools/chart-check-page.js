/* Injected by tools/chart-check.mjs into every page that draws charts. Checks that charts draw what they
   say: no NaN or Infinity in geometry, ring and gauge arcs match their percent label, bars with a percent
   label in their row are drawn at that width, and donut parts add up to the whole ring.
   Writes <script type="application/json" id="ns-chart-result">. */
(async () => {
  const W = (ms) => new Promise((r) => setTimeout(r, ms));
  await new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)));
  await W(1200);
  const issues = [], stats = { svgs: 0, arcs: 0, arcLabels: 0, bars: 0, donuts: 0 };
  const where = () => (location.pathname.split("/").pop() || "index") + location.hash;
  const add = (kind, detail) => issues.push({ where: where(), kind, detail });
  /* one unsigned percent in the text; signed values (+3%, -2%, arrows) are deltas, not the chart's value */
  const pctIn = (s) => { const m = [...String(s).replace(/(\d),(\d)(?!\d{2})/g, "$1.$2").matchAll(/(?<![+\-\u2212\u2191\u2193\u25b2\u25bc\d.])(\d+(?:\.\d+)?)\s*%/g)]; return m.length === 1 ? parseFloat(m[0][1]) : null; };
  /* visible text of a node with a space between text nodes, so "age 62" and "71%" never run together */
  const textOf = (node) => { const out = []; const w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT); while (w.nextNode()) out.push(w.currentNode.nodeValue); return out.join(" "); };
  const near = (a, b, tol = 1.5) => Math.abs(a - b) <= tol;

  const scan = (root) => {
    /* 1. broken geometry */
    root.querySelectorAll("svg").forEach((svg) => {
      stats.svgs++;
      for (const el of svg.querySelectorAll("*")) for (const a of el.attributes) {
        if (/^(d|x|y|x1|x2|y1|y2|cx|cy|r|rx|width|height|points|stroke-dasharray|stroke-dashoffset|transform|offset)$/.test(a.name) && /NaN|Infinity/.test(a.value)) { add("broken geometry", `<${el.tagName} ${a.name}="${a.value.slice(0, 40)}">`); break; }
      }
    });
    root.querySelectorAll("[style*='%']").forEach((el) => { if (/NaN|Infinity/.test(el.getAttribute("style"))) add("broken geometry", `style="${el.getAttribute("style").slice(0, 60)}"`); });

    /* 2. arcs: value circle or path with a dash, over a track of the same radius or path */
    root.querySelectorAll("svg").forEach((svg) => {
      /* value shapes: a circle or path with a two-number dash (length, gap) where the gap covers the rest */
      const values = [...svg.querySelectorAll("circle[stroke-dasharray], path[stroke-dasharray]")].filter((el) => {
        const dash = el.getAttribute("stroke-dasharray").trim().split(/[ ,]+/).map(Number);
        return dash.length === 2 && dash.every(Number.isFinite) && dash[1] >= dash[0];
      });
      /* donut: several value circles on one radius, laid end to end with offsets */
      const byR = {};
      values.filter((el) => el.tagName === "circle" && el.hasAttribute("stroke-dashoffset") && el.getAttribute("transform")?.includes("-90")).forEach((el) => (byR[el.getAttribute("r")] = [...(byR[el.getAttribute("r")] || []), el]));
      Object.values(byR).filter((g) => g.length >= 2).forEach((g) => {
        stats.donuts++;
        const r = +g[0].getAttribute("r"), c = 2 * Math.PI * r;
        const offs = g.map((el) => -parseFloat(el.getAttribute("stroke-dashoffset"))).sort((a, b) => a - b);
        const last = g.find((el) => -parseFloat(el.getAttribute("stroke-dashoffset")) === offs.at(-1));
        const lastLen = parseFloat(last.getAttribute("stroke-dasharray"));
        const sw = parseFloat(last.getAttribute("stroke-width")) || 0, round = last.getAttribute("stroke-linecap") === "round";
        const covered = (offs.at(-1) + lastLen + (round ? sw / 2 : 0)) / c * 100; /* a round cap reaches stroke/2 past the dash */
        /* a partial ring is fine when its center states that share (for example "89" of 100) */
        const nums = textOf(svg.parentElement || svg).match(/\d+(?:\.\d+)?/g) || [];
        const stated = nums.map(Number).some((n) => near(n, covered, 2));
        if ((covered < 93 && !stated) || covered > 100.5) add("donut does not add up", `parts cover ${covered.toFixed(1)}% of the ring`);
      });
      /* single value arcs (rings, gauges): compare with the one percent label in the chart */
      const singles = values.filter((el) => !(el.tagName === "circle" && el.hasAttribute("stroke-dashoffset") && byR[el.getAttribute("r")]?.length >= 2));
      singles.forEach((el) => {
        const sw = parseFloat(el.getAttribute("stroke-width") || getComputedStyle(el).strokeWidth) || 0;
        const round = (el.getAttribute("stroke-linecap") || getComputedStyle(el).strokeLinecap) === "round";
        const total = el.tagName === "circle" ? 2 * Math.PI * parseFloat(el.getAttribute("r")) : el.getTotalLength();
        let track = total;
        /* a track drawn as a partial arc (rings on a 270 degree scale) */
        const sibs = [...svg.querySelectorAll(el.tagName)].filter((t) => t !== el && t.getAttribute("r") === el.getAttribute("r") && t.getAttribute("d") === el.getAttribute("d"));
        const tr = sibs.find((t) => !values.includes(t) || t.getAttribute("stroke") !== el.getAttribute("stroke"));
        if (tr && tr.getAttribute("stroke-dasharray")) { const td = parseFloat(tr.getAttribute("stroke-dasharray")); track = td + ((tr.getAttribute("stroke-linecap") === "round") ? sw : 0); }
        const dashLen = parseFloat(el.getAttribute("stroke-dasharray"));
        const hidden = getComputedStyle(el).opacity === "0" || el.getAttribute("opacity") === "0";
        const drawn = hidden ? 0 : Math.min(100, ((dashLen + (round && dashLen >= 0 ? sw : 0)) / track) * 100);
        if (!(track > 0) || !tr) return; /* not a value-over-track arc */
        stats.arcs++;
        /* the label: one percent in the svg text, or in the nearest small container */
        /* several value arcs in one chart (concentric rings): a single label cannot be paired with one arc */
        if (singles.length > 1) return;
        let label = pctIn(textOf(svg)) ?? pctIn(svg.getAttribute("aria-label") || "");
        if (label === null) { let p = svg.parentElement; for (let k = 0; k < 2 && p && label === null; k++, p = p.parentElement) { if (p.querySelectorAll("svg").length === 1) label = pctIn(textOf(p)); } }
        if (label === null) return;
        stats.arcLabels++;
        if (!near(drawn, label)) add("arc does not match its label", `label ${label}%, drawn ${drawn.toFixed(1)}% (${el.tagName}, stroke ${sw}${round ? ", round caps" : ""})`);
      });
    });

    /* 3. linear bars: an element sized by width:N% inside a track, with one percent label in its row */
    root.querySelectorAll("[style*='width']").forEach((bar) => {
      const m = (bar.getAttribute("style") || "").match(/(?:^|;)\s*width:\s*(-?[\d.]+)%/);
      if (!m) return;
      const track = bar.parentElement; if (!track) return;
      const tb = track.getBoundingClientRect(), bb = bar.getBoundingClientRect();
      if (!tb.width || tb.height > 40 || bar.children.length) return; /* bars are thin leaves inside a track */
      /* the row: the nearest ancestor (up to 3 levels) that holds this bar and no other width bar, so each
         row of a list is paired with its own label */
      const isBar = (el) => /(?:^|;)\s*width:\s*-?[\d.]+%/.test(el.getAttribute("style") || "") && !el.children.length;
      let row = track.parentElement, label = null;
      for (let k = 0; k < 3 && row && label === null; k++, row = row.parentElement) {
        if ([...row.querySelectorAll("[style*='width']")].filter(isBar).length > 1) break; /* reached the list itself */
        label = pctIn([...row.childNodes].filter((n) => n !== track && !n.contains?.(track)).map((n) => (n.nodeType === 3 ? n.nodeValue : textOf(n))).join(" "));
      }
      if (label === null) return;
      if (/\d\s*to\s*\d/.test(textOf(row || track))) return; /* the row states its own scale (a band or a range), so the label is not the fill */
      stats.bars++;
      const drawn = (bb.width / tb.width) * 100;
      if (!near(drawn, label, 2)) add("bar does not match its label", `label ${label}%, drawn ${drawn.toFixed(1)}% ("${(row?.textContent || "").trim().slice(0, 40)}")`);
    });
  };

  const routes = window.__chartRoutes || [""];
  for (const r of routes) {
    if (r) { location.hash = r; await W(900); }
    scan(document.body);
  }
  const o = document.createElement("script"); o.type = "application/json"; o.id = "ns-chart-result";
  o.textContent = JSON.stringify({ issues, stats });
  document.body.appendChild(o);
})();
