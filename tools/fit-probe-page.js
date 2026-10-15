/* Injected into the docs site by tools/fit-probe.mjs. Renders every component playground state and
   variant inside tiles of 320, 240 and 192px and reports what does not fit a dashboard tile:
   horizontal overflow, targets under 24px, controls with no accessible name, chart labels under 9px.
   Writes the result to <script type="application/json" id="ns-fit-result">. */
(async () => {
  await new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)));
  await new Promise((r) => setTimeout(r, 600));
  /* Page mode: does the page itself scroll sideways at this window width? Run once per width by tools/fit-probe.mjs. */
  if (window.__fitMode === "page") {
    const ROUTES = ["", "foundations/color", "foundations/logo", "components/button", "components/bubble-chart", "floorplans/dashboard", "floorplans/learner-progress", "floorplans/enrollment-health", "getting-started/downloads"];
    const de = document.documentElement, rows = [];
    for (const r of ROUTES) {
      location.hash = "#/" + r;
      await new Promise((res) => setTimeout(res, 500));
      rows.push({ route: r || "home", over: de.scrollWidth - de.clientWidth });
    }
    const o = document.createElement("script");
    o.type = "application/json"; o.id = "ns-fit-result";
    o.textContent = JSON.stringify({ width: innerWidth, rows });
    document.body.appendChild(o);
    return;
  }
  const WIDTHS = (window.__fitWidths || [320, 240, 192]);
  /* By design: fixed-size surfaces, overlays and animations. [component id, label pattern, max width it applies to] */
  const BY_DESIGN = [["modal", /./], ["side-navigation", /./], ["tooltip", /./], ["progress", /Indeterminate/], ["divider", /Vertical/], ["dropdown", /./], ["date-picker", /./, 223], ["slider", /./], ["alert-banner", /./, 200], ["search", /variant 1/]];
  /* Full-width page patterns and the app header demo are not tile content. */
  const SCROLLERS = ".ns-tabs, .ns-table-wrap, .ns-segmented, [style*='overflow']";
  const fluid = (h) => h.replace(/(^|[;"'\s])width:\s*\d+px/g, "$1width:100%");
  const host = document.createElement("div");
  host.style.cssText = "position:absolute;left:0;top:0";
  document.body.appendChild(host);
  const issues = [], seen = new Set();
  const add = (id, label, W, kind, detail) => { const k = [id, kind, W, detail].join("|"); if (!seen.has(k)) { seen.add(k); issues.push({ id, label, width: W, kind, detail }); } };
  const hasName = (el) => !!(el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.getAttribute("title") || (el.labels && el.labels.length) || (el.textContent || "").trim() || el.querySelector("img[alt]"));
  const name = (el) => el.tagName.toLowerCase() + (typeof el.className === "string" && el.className ? "." + el.className.split(" ")[0] : "");
  const states = (pg) => {
    const base = {}; (pg.controls || []).forEach((k) => (base[k.key] = k.default ?? (k.options ? k.options[0] : k.type === "bool" ? false : "")));
    const out = [["default", base]];
    (pg.controls || []).filter((k) => k.options).forEach((k) => k.options.slice(1).forEach((o) => out.push([k.key + "=" + o, { ...base, [k.key]: o }])));
    return out;
  };
  let checked = 0;
  for (const c of NS.COMPONENTS) {
    const jobs = [];
    if (c.playground && c.playground.render) states(c.playground).forEach(([lab, st]) => { try { jobs.push([lab, c.playground.render(st)]); } catch (e) { add(c.id, lab, 0, "render-error", String(e).slice(0, 80)); } });
    (c.variants || []).forEach((v, i) => { if (typeof v[2] === "string") jobs.push(["variant " + (i + 1), v[2]]); });
    for (const [lab, html0] of jobs) {
      const html = fluid(html0);
      for (const W of WIDTHS) {
        if (/max-width:800px/.test(html0) || /size=XL/.test(lab)) continue; /* XL is documented for 720px and up */
        const w = document.createElement("div");
        w.className = "ns"; w.style.cssText = "width:" + W + "px;position:relative"; w.innerHTML = html; host.appendChild(w);
        if (window.NS && NS.chartKit && NS.chartKit.fit) NS.chartKit.fit(w);
        checked++;
        const skip = BY_DESIGN.some(([id, re, max]) => id === c.id && re.test(lab) && (max === undefined || W <= max));
        const r = w.getBoundingClientRect();
        if (!skip) {
          let worst = 0, who = "";
          w.querySelectorAll("*").forEach((el) => {
            const cs = getComputedStyle(el);
            if (cs.display === "none" || cs.position === "fixed" || el.closest(SCROLLERS)) return;
            const b = el.getBoundingClientRect(); if (!b.width) return;
            const o = Math.max(b.right - r.right, r.left - b.left);
            if (o > worst) { worst = o; who = name(el.ownerSVGElement ? el.ownerSVGElement : el); }
          });
          if (worst > 4) add(c.id, lab, W, "overflow", "+" + Math.round(worst) + "px by " + who);
        }
        if (W === WIDTHS[0]) {
          w.querySelectorAll("button, a[href], [role=button], [role=tab]").forEach((el) => {
            const b = el.getBoundingClientRect(); if (!b.width || !b.height || el.classList.contains("sr-only")) return;
            let hh = b.height, ww = b.width; const af = getComputedStyle(el, "::after");
            if (af.content !== "none" && af.position === "absolute") { hh = Math.max(hh, parseFloat(af.height) || 0); ww = Math.max(ww, parseFloat(af.width) || 0); }
            if (hh < 24 || ww < 24) add(c.id, lab, W, "small-target", name(el) + " " + Math.round(ww) + "x" + Math.round(hh));
          });
          w.querySelectorAll("button, a[href], input:not([type=hidden]), select, textarea, [role=button]").forEach((el) => { if (!hasName(el) && !el.classList.contains("sr-only")) add(c.id, lab, W, "unnamed", name(el)); });
        }
        w.querySelectorAll("svg[data-chart] text, svg[data-bullet] text").forEach((t) => {
          const s = t.ownerSVGElement, px = (+t.getAttribute("font-size") || 11) * s.getBoundingClientRect().width / s.viewBox.baseVal.width;
          if (px < 9) add(c.id, lab, W, "tiny-label", px.toFixed(1) + "px");
        });
        host.removeChild(w);
      }
    }
  }
  host.remove();
  const out = document.createElement("script");
  out.type = "application/json"; out.id = "ns-fit-result";
  out.textContent = JSON.stringify({ widths: WIDTHS, components: NS.COMPONENTS.length, checked, issues });
  document.body.appendChild(out);
})();
