/* Injected by tools/a11y-check.mjs. For each theme, renders every component state (docs mode) or every
   dashboard (app mode) and checks WCAG 2.2 AA:
     contrast   text against its composited background: 4.5:1, or 3:1 for large text (24px, or 18.66px bold)
     name       buttons, links, inputs and role=button/tab/option/checkbox without an accessible name
     focus      focusable controls whose :focus-visible style shows no outline, ring or border change
   Text over gradients or images is skipped (cannot be measured from styles). Disabled controls are exempt.
   Writes <script type="application/json" id="ns-a11y-result">. */
(async () => {
  const W = (ms) => new Promise((r) => setTimeout(r, ms));
  await new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)));
  await W(800);
  /* Headless virtual time does not finish CSS transitions, so measure end states only */
  const still = document.createElement("style"); still.textContent = "*, *::before, *::after { transition: none !important; animation: none !important; }"; document.head.appendChild(still);
  const issues = [], seen = new Set();
  const add = (where, kind, detail) => { const k = where + kind + detail; if (!seen.has(k)) { seen.add(k); issues.push({ where, kind, detail }); } };

  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const rgba = (c) => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = "#000"; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1); const d = ctx.getImageData(0, 0, 1, 1).data; const a = (c.match(/\/\s*([\d.]+%?)\s*\)|,\s*([\d.]+)\s*\)$/) || []); let al = 1; if (/transparent/.test(c)) al = 0; else if (a[1]) al = a[1].endsWith("%") ? parseFloat(a[1]) / 100 : parseFloat(a[1]); else if (a[2] && /rgba|hsla/.test(c)) al = parseFloat(a[2]); return [d[0], d[1], d[2], al]; };
  const over = (top, bot) => [0, 1, 2].map((i) => top[i] * top[3] + bot[i] * (1 - top[3])).concat(1);
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  /* Composite background from the element up; null when a gradient or image sits behind the text */
  const bgOf = (el) => {
    const layers = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      /* Tiles carry --ns-chart-sheen over their own color. The sheen only darkens under light text and only
         lightens under dark ink (STYLE-RULES.md), so the flat tile color is the worst case: measure against it. */
      const sheen = n.matches(".t, .bt, .ns-w");
      if (cs.backgroundImage && cs.backgroundImage !== "none" && !sheen) return null;
      const c = rgba(cs.backgroundColor); if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    let base = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return base;
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); if (!r.width || !r.height) return false; for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.1) return false; if (n.hasAttribute("aria-hidden") && n.getAttribute("aria-hidden") === "true") return false; } return true; };
  const disabled = (el) => !!el.closest("[disabled], [aria-disabled=true], .is-disabled, .is-muted");
  const hasName = (el) => !!(el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.getAttribute("title") || (el.labels && el.labels.length) || (el.textContent || "").trim() || el.querySelector("img[alt], svg[aria-label], [role=img][aria-label]") || (el.placeholder && el.tagName === "INPUT") || el.closest("label"));

  const scan = (root, where) => {
    root.querySelectorAll("*").forEach((el) => {
      if (!visible(el) || el.closest("svg, .sr-only, .visually-hidden, code, pre, .code")) return;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (own && !disabled(el)) {
        const cs = getComputedStyle(el), bg = bgOf(el);
        if (bg) {
          let fg = rgba(cs.color);
          let o = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
          fg = over([fg[0], fg[1], fg[2], fg[3] * o], bg);
          const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
          const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5, r = ratio(fg, bg);
          if (r < need - 0.05) add(where, "contrast", `${r.toFixed(2)}:1 (needs ${need}) "${el.textContent.trim().slice(0, 32)}" ${cs.color} on rgb(${bg.slice(0, 3).map(Math.round).join(",")})`);
        }
      }
      const role = el.getAttribute("role");
      const ctl = el.matches("button, a[href], input:not([type=hidden]), select, textarea") || /^(button|tab|option|checkbox|radio|switch|menuitem|combobox|slider)$/.test(role || "");
      if (ctl && !hasName(el)) add(where, "name", `${el.tagName.toLowerCase()}${role ? "[role=" + role + "]" : ""}.${(el.className && el.className.baseVal === undefined ? el.className : "").toString().split(" ")[0]} has no accessible name`);
    });
  };

  const themes = ["dark", "light"];
  if (window.__a11yMode === "layout") {
    /* one dashboard layout page (dashboards/*.html): every tile title, caption, legend and label */
    const name = location.pathname.split("/").pop().replace(".html", "");
    for (const t of themes) { document.documentElement.dataset.theme = t; await W(150); scan(document.body, `layout ${name} (${t})`); }
  } else if (window.__a11yMode === "app") {
    const views = ["finance", "commerce", "observe", "crm", "projects", "deployments", "support", "people", "kit"];
    for (const t of themes) {
      const btn = document.querySelector(t === "light" ? "button[aria-label='Light theme']" : "button[aria-label='Dark theme']"); if (btn) { btn.click(); await W(600); } /* let color transitions finish */
      for (const v of views) { location.hash = v; await W(700); scan(document.body, `app ${v} (${t})`); }
    }
  } else {
    const host = document.createElement("div"); host.className = "ns"; host.style.cssText = "position:absolute;left:0;top:0;width:960px;background:var(--ns-background-primary);padding:24px";
    document.body.appendChild(host);
    for (const t of themes) {
      document.documentElement.dataset.theme = t; await W(100);
      for (const c of NS.COMPONENTS) {
        const pcs = [c, ...(c.parts || [])];
        for (const pc of pcs) {
          const st = {}; (pc.playground?.controls || []).forEach((k) => (st[k.key] = k.default ?? (k.options ? k.options[0] : k.type === "bool" ? false : "")));
          const htmls = [];
          try { if (pc.playground?.render) htmls.push(["demo", pc.playground.render(st)]); } catch {}
          (pc.variants || []).forEach((v) => typeof v[2] === "string" && htmls.push([v[0], v[2]]));
          for (const [lab, h] of htmls) { host.innerHTML = `<div class="stage__canvas ns">${h}</div>`; await W(0); scan(host, `${c.id}${pc === c ? "" : "/" + pc.id} [${lab}] (${t})`); }
        }
      }
    }
    /* floorplans: color blocks remap text and chart tokens to one ink, so they are measured as assembled */
    for (const t of themes) {
      document.documentElement.dataset.theme = t; await W(100);
      for (const [k, fp] of Object.entries(NS.FLOORPLANS || {})) { try { host.innerHTML = fp[2](); } catch { continue; } await W(0); scan(host, `floorplan ${k} (${t})`); }
    }
    host.remove();
  }
  const o = document.createElement("script"); o.type = "application/json"; o.id = "ns-a11y-result";
  o.textContent = JSON.stringify({ mode: window.__a11yMode || "docs", issues });
  document.body.appendChild(o);
})();
