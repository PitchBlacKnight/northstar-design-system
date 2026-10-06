/* App shell: router, header, side nav, search, TOC, theme, embed, prev/next, feedback. */
(function () {
  const NS = window.NS;
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const EMBED = params.has("embed");
  if (EMBED) root.classList.add("embed");

  /* ---------- theme ---------- */
  const THEME_KEY = "ns-theme";
  const getTheme = () => params.get("theme") || (() => { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } })() || "dark";
  NS.setTheme = (t, persist = true) => {
    if (t === "light") root.dataset.theme = "light"; else delete root.dataset.theme;
    if (persist && !params.get("theme")) try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    const b = document.getElementById("theme-btn");
    if (b) { b.innerHTML = t === "light" ? NS.icon.moon : NS.icon.sun; b.setAttribute("aria-label", t === "light" ? "Switch to dark theme" : "Switch to light theme"); }
  };
  NS.setTheme(getTheme(), false);

  /* ---------- flat page order for prev/next + search ---------- */
  const FLAT = NS.NAV.flatMap((g) => g.items.map(([path, label, tag]) => ({ path, label, tag, group: g.group })));

  /* ---------- shell ---------- */
  document.getElementById("app").innerHTML = `
<a class="skip" href="#main-content">Skip to content</a>
<header class="hdr" role="banner">
  <button class="icon-btn hdr__menu" id="menu-btn" aria-label="Open navigation" aria-expanded="false" aria-controls="side">${NS.icon.menu}</button>
  <a class="brand" href="#/" aria-label="NorthStar DS home">${NS.logoSvg("brand__logo")}NORTHSTAR <span>DS</span></a>
  <span class="ver">${NS.VERSION}</span>
  <nav class="hdr__nav" aria-label="Primary">${[["foundations", "Foundations"], ["components", "Components"], ["patterns/forms", "Patterns"], ["graphics", "Graphics"], ["floorplans", "Floorplans"], ["tools/live-builder", "Live tools"]].map(([p, l]) => `<a href="#/${p}" data-top="${p.split("/")[0]}">${l}</a>`).join("")}</nav>
  <span class="hdr__spacer"></span>
  <button class="hdr__search" data-open-search aria-label="Search documentation">${NS.icon.search}<span class="label">Search docs...</span><kbd>⌘K</kbd></button>
  <button class="icon-btn" data-drawer aria-label="Open token editor" title="Token editor">${NS.icon.sliders}</button>
  <button class="icon-btn" id="theme-btn"></button>
  <a class="icon-btn hide-sm" href="${NS.FIGMA}" target="_blank" rel="noopener" aria-label="Open Figma library" title="Figma library"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8Zm-4-12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Zm0-8a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Zm8-4h4a4 4 0 0 1 0 8h-4V0Zm8 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/></svg></a>
  <a class="hdr__back hide-sm" href="../" title="Back to mikelrosenthal.com">← mikelrosenthal.com</a>
</header>
<div class="shell">
  <nav class="side" id="side" aria-label="Documentation">${NS.NAV.map((g, gi) => `<div class="side__group" data-g="${gi}"><button class="side__head" aria-expanded="true">${g.group}</button><ul class="side__list">${g.items.map(([p, l, tag]) => `<li><a href="#/${p}" data-path="${p}">${l}${tag ? `<span class="ns ns-tag ns-tag--sm ${tag === "New" ? "ns-tag--teal" : tag === "AI" ? "ns-tag--purple" : tag === "Live" ? "ns-tag--green" : "ns-tag--blue"}">${tag}</span>` : ""}</a></li>`).join("")}</ul></div>`).join("")}</nav>
  <div class="main" id="main"><main class="content" id="main-content" tabindex="-1"></main><aside class="toc" id="toc" aria-label="On this page"></aside></div>
</div>
<div class="palette" id="palette" role="dialog" aria-modal="true" aria-label="Search"><div class="palette__box"><div class="palette__in">${NS.icon.search}<input id="pal-q" placeholder="Search pages, components, sections, tokens" aria-label="Search" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="pal-list"/><kbd>esc</kbd></div><ul class="palette__list" id="pal-list" role="listbox"></ul><div class="palette__foot"><span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>/</kbd> or <kbd>⌘K</kbd> search</span></div></div></div>`;
  NS.setTheme(getTheme(), false);
  NS.buildDrawer();

  /* collapsed side groups persist */
  const COLL_KEY = "ns-side-collapsed";
  let collapsed = []; try { collapsed = JSON.parse(localStorage.getItem(COLL_KEY) || "[]"); } catch (e) {}
  document.querySelectorAll(".side__group").forEach((g) => { if (collapsed.includes(+g.dataset.g)) { g.classList.add("is-collapsed"); g.querySelector(".side__head").setAttribute("aria-expanded", "false"); } });
  document.getElementById("side").addEventListener("click", (e) => {
    const h = e.target.closest(".side__head"); if (!h) { if (e.target.closest("a")) closeSide(); return; }
    const g = h.parentElement; const c = g.classList.toggle("is-collapsed"); h.setAttribute("aria-expanded", !c);
    collapsed = [...document.querySelectorAll(".side__group.is-collapsed")].map((x) => +x.dataset.g); try { localStorage.setItem(COLL_KEY, JSON.stringify(collapsed)); } catch (e) {}
  });
  const side = document.getElementById("side"), menuBtn = document.getElementById("menu-btn");
  const closeSide = () => { side.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); };
  menuBtn.onclick = () => { const o = side.classList.toggle("is-open"); menuBtn.setAttribute("aria-expanded", o); };

  document.getElementById("theme-btn").onclick = () => { NS.setTheme(root.dataset.theme === "light" ? "dark" : "light"); render(true); };

  /* ---------- router ---------- */
  const parse = () => {
    const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const [route, anchor] = raw.split("#");
    return { route: route.replace(/\/$/, ""), anchor };
  };
  let lastRoute = null;

  function render(keepScroll) {
    const { route, anchor } = parse();
    const main = document.getElementById("main-content");
    const mainWrap = document.getElementById("main");
    if (NS.pageCleanup) { NS.pageCleanup(); NS.pageCleanup = null; }
    let page, html = "", tabsHtml = "", path = route, compTab = null;

    const m = route.match(/^components\/([\w-]+)(?:\/(\w+))?$/);
    const comp = m && NS.componentById(m[1]);
    if (comp) {
      const r = NS.renderComponent(comp, m[2]);
      compTab = r.tab; path = "components/" + comp.id;
      page = { title: comp.name, lede: comp.desc, status: comp.status, figma: true, figmaNode: comp.figma };
      tabsHtml = `<nav class="page-tabs ns"><div class="ns-tabs" role="tablist" aria-label="${comp.name} documentation">${r.tabs.map((t) => `<a class="ns-tab" role="tab" href="#/components/${comp.id}/${t}" aria-selected="${t === r.tab}">${t[0].toUpperCase() + t.slice(1)}</a>`).join("")}</div></nav>`;
      html = r.body;
    } else {
      page = NS.PAGES[route];
      if (!page) page = { title: "Page not found", lede: `Nothing lives at <code>/${NS.esc(route)}</code>. Try search (⌘K) or head home.`, body: () => `<a class="ns ns-btn" href="#/">Go home</a>` };
      html = page.body();
    }

    const statusColor = { New: "var(--ns-teal-500)", Stable: "var(--ns-status-success)", Live: "var(--ns-status-success)", AI: "var(--ns-purple-500)", Beta: "var(--ns-status-warning)" };
    const header = page.noTitle ? "" : `<div class="eyebrow">${page.status ? `<span class="status-pill" style="--_c:${statusColor[page.status] || "var(--ns-teal-500)"}">${page.status}</span>` : ""}<span>Last updated: Oct 2026</span>${page.figma || route.startsWith("foundations") ? `<a href="${NS.FIGMA}${page.figmaNode ? "?node-id=" + page.figmaNode.replace(":", "-") : ""}" target="_blank" rel="noopener" style="color:var(--ns-text-tertiary)">View in Figma ↗</a>` : ""}</div><h1 class="page-title">${page.title}</h1>${page.lede ? `<p class="page-lede">${page.lede}</p>` : ""}`;

    const idx = FLAT.findIndex((f) => f.path === path);
    const prev = FLAT[idx - 1], next = FLAT[idx + 1];
    const pn = idx >= 0 ? `<nav class="pn" aria-label="Previous and next">${prev ? `<a href="#/${prev.path}"><small>Previous</small>← ${prev.label}</a>` : "<span></span>"}${next ? `<a href="#/${next.path}"><small>Next</small>${next.label} →</a>` : ""}</nav>` : "";
    const fbKey = "ns-fb-" + path;
    let fb = null; try { fb = localStorage.getItem(fbKey); } catch (e) {}
    const feedback = `<div class="feedback ns" data-fb="${fbKey}"><span class="grow">${fb ? "Thanks for the feedback." : "Was this page helpful?"}</span>${fb ? "" : '<button class="ns-btn ns-btn--sm ns-btn--tertiary" data-vote="yes">Yes</button><button class="ns-btn ns-btn--sm ns-btn--tertiary" data-vote="no">No</button>'}<a class="ns-btn ns-btn--sm ns-btn--ghost" href="#/community/contributing">Suggest an edit</a></div>`;
    const footer = `<footer class="ftr"><div><h4>NORTHSTAR DESIGN SYSTEM</h4><p>An enterprise-grade UI architecture crafted for secure, high-density telemetry dashboards, command panels, and distributed cloud systems.</p></div><div><h5>Resources</h5><ul><li><a href="${NS.FIGMA}" target="_blank" rel="noopener">Figma library</a></li><li><a href="#/getting-started/developers">Developer guide</a></li><li><a href="#/foundations/tokens">Token reference</a></li></ul></div><div><h5>Community</h5><ul><li><a href="#/community/support">Slack channel</a></li><li><a href="#/community/contributing">Contribution guide</a></li><li><a href="#/community/governance">Security board</a></li></ul></div><p class="legal">© 2026 NorthStar Enterprise Solutions. Code licensed under Apache 2.0. Documentation licensed under CC BY 4.0.</p></footer>`;

    main.innerHTML = `${header}${tabsHtml}<div class="prose">${html}</div>${idx >= 0 && !page.home ? feedback : ""}${pn}${footer}`;
    document.title = `${page.title === "Home" ? "NorthStar Design System" : page.title + " | NorthStar DS"}`;

    // side + top nav state
    document.querySelectorAll(".side__list a").forEach((a) => { const on = a.dataset.path === path; on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"); if (on) { const g = a.closest(".side__group"); g.classList.remove("is-collapsed"); if (!keepScroll && lastRoute !== route) a.scrollIntoView({ block: "nearest" }); } });
    document.querySelectorAll(".hdr__nav a").forEach((a) => a.classList.toggle("is-active", !!path && path.split("/")[0] === a.dataset.top));

    // post-render hooks
    main.querySelectorAll("[data-indet]").forEach((c) => (c.indeterminate = true));
    Object.keys(NS.playgrounds).forEach((id) => { const el = document.getElementById(id); if (el) NS.playgrounds[id].spec.init?.(el); else delete NS.playgrounds[id]; });
    page.init && page.init();
    const tokStat = main.querySelector('[data-count="tokens"]'); if (tokStat) countUp(tokStat, NS.allTokens().length);
    buildToc(page.wide || page.home);

    if (anchor) { const t = document.getElementById(anchor); t && t.scrollIntoView(); }
    else if (!keepScroll && lastRoute !== route) { window.scrollTo(0, 0); if (lastRoute !== null) main.focus({ preventScroll: true }); }
    lastRoute = route;
  }

  function countUp(el, n) { const t = performance.now(); const tick = (now) => { const p = Math.min(1, (now - t) / 900); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + "+"; if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }

  /* ---------- TOC + scrollspy ---------- */
  let spy;
  function buildToc(hide) {
    const toc = document.getElementById("toc"), wrap = document.getElementById("main");
    const hs = [...document.querySelectorAll("#main-content .prose h2[id]")];
    spy && spy.disconnect();
    if (hide || hs.length < 2) { toc.innerHTML = ""; wrap.classList.add("no-toc"); return; }
    wrap.classList.remove("no-toc");
    const { route } = parse();
    toc.innerHTML = `<h2>On this page</h2><ol>${hs.map((h) => `<li><a href="#/${route}#${h.id}" data-id="${h.id}">${h.childNodes[0].textContent}</a></li>`).join("")}</ol><div class="toc__extra"><a href="${NS.FIGMA}" target="_blank" rel="noopener">Open in Figma ↗</a><a href="?embed#/${route}" target="_blank" rel="noopener">Open in embed mode ↗</a><a href="#" data-copy-link>Copy page link</a></div>`;
    spy = new IntersectionObserver((ents) => { ents.forEach((e) => { if (e.isIntersecting) { toc.querySelectorAll("a[data-id]").forEach((a) => a.classList.toggle("is-active", a.dataset.id === e.target.id)); } }); }, { rootMargin: "-90px 0px -70% 0px" });
    hs.forEach((h) => spy.observe(h));
  }

  /* ---------- global clicks ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if (a && !a.getAttribute("href").startsWith("#/")) {
      e.preventDefault(); const id = a.getAttribute("href").slice(1);
      if (a.hasAttribute("data-copy-link")) { NS.copy(location.href.split("#")[0] + "#/" + parse().route, a, "Link copied"); return; }
      const t = document.getElementById(id); if (t) { t.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", `#/${parse().route}#${id}`); }
      return;
    }
    if (a && a.getAttribute("href").includes("#", 2) && a.closest(".toc")) { e.preventDefault(); const id = a.dataset.id; document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", a.getAttribute("href")); return; }
    if (e.target.closest("[data-open-search]")) { openSearch(); return; }
    if (e.target.closest("[data-drawer], [data-open-drawer]")) { NS.toggleDrawer(); return; }
    const st = e.target.closest("[data-set-theme]"); if (st) { NS.setTheme(st.dataset.setTheme); render(true); return; }
    const v = e.target.closest("[data-vote]");
    if (v) { const box = v.closest("[data-fb]"); try { localStorage.setItem(box.dataset.fb, v.dataset.vote); } catch (e) {} box.querySelector(".grow").textContent = v.dataset.vote === "yes" ? "Thanks. Glad it helped." : "Thanks. Tell us what was missing in #northstar-design-system."; box.querySelectorAll("[data-vote]").forEach((b) => b.remove()); return; }
  });

  /* ---------- search palette ---------- */
  let INDEX = null, sel = 0, results = [];
  function buildIndex() {
    const idx = [];
    FLAT.forEach((f) => idx.push({ title: f.label, sub: f.group, href: "#/" + f.path, kind: f.group === "Components" && f.path !== "components" ? "Component" : "Page" }));
    NS.COMPONENTS.forEach((c) => { ["style", "code", "accessibility"].forEach((t) => idx.push({ title: `${c.name}: ${t}`, sub: c.desc, href: `#/components/${c.id}/${t}`, kind: "Tab", weak: true })); });
    Object.entries(NS.PAGES).forEach(([p, pg]) => { try { const tmp = document.createElement("div"); tmp.innerHTML = pg.body(); tmp.querySelectorAll("h2[id]").forEach((h) => idx.push({ title: h.childNodes[0].textContent, sub: pg.title, href: `#/${p}#${h.id}`, kind: "Section", weak: true })); } catch (e) {} });
    NS.allTokens().forEach((t) => idx.push({ title: t, sub: NS.tokenValue(t), copy: `var(${t})`, kind: "Token", weak: true }));
    return idx;
  }
  const pal = document.getElementById("palette"), palQ = document.getElementById("pal-q"), palList = document.getElementById("pal-list");
  let palPrev = null;
  function openSearch() { INDEX = INDEX || buildIndex(); palPrev = document.activeElement; pal.classList.add("is-open"); palQ.value = ""; runSearch(); setTimeout(() => palQ.focus(), 10); }
  function closeSearch() { pal.classList.remove("is-open"); palPrev && palPrev.focus && palPrev.focus(); }
  function score(item, q) { const t = item.title.toLowerCase(), s = (item.sub || "").toLowerCase(); if (t === q) return 100; if (t.startsWith(q)) return 80; if (t.includes(q)) return 60 - (item.weak ? 15 : 0); if (q.split(" ").every((w) => t.includes(w) || s.includes(w))) return 30 - (item.weak ? 10 : 0); return 0; }
  function runSearch() {
    const q = palQ.value.trim().toLowerCase();
    results = q ? INDEX.map((i) => [i, score(i, q)]).filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 30).map((x) => x[0]) : INDEX.filter((i) => ["Home", "Color", "Button", "Data table", "Live Builder", "AI generator", "Token reference", "Dashboard"].includes(i.title) && !i.weak);
    sel = 0;
    const mark = (s) => (q ? NS.esc(s).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), (m) => `<mark>${m}</mark>`) : NS.esc(s));
    palList.innerHTML = results.length ? results.map((r, i) => `<li role="option" id="pal-${i}" class="${i === 0 ? "is-active" : ""}" aria-selected="${i === 0}"><a href="${r.href || "#"}" ${r.copy ? `data-pal-copy="${r.copy}"` : ""}><span>${mark(r.title)}</span><small>${NS.esc((r.sub || "").slice(0, 90))}</small><span class="ns ns-tag ns-tag--sm ${r.kind === "Token" ? "ns-tag--teal" : r.kind === "Component" ? "ns-tag--purple" : ""}">${r.kind}</span></a></li>`).join("") : `<li class="palette__empty">No results for "${NS.esc(q)}"</li>`;
    palQ.setAttribute("aria-activedescendant", results.length ? "pal-0" : "");
  }
  const move = (d) => { const items = palList.querySelectorAll("li[role=option]"); if (!items.length) return; items[sel].classList.remove("is-active"); items[sel].setAttribute("aria-selected", "false"); sel = (sel + d + items.length) % items.length; items[sel].classList.add("is-active"); items[sel].setAttribute("aria-selected", "true"); items[sel].scrollIntoView({ block: "nearest" }); palQ.setAttribute("aria-activedescendant", "pal-" + sel); };
  palQ.addEventListener("input", runSearch);
  palQ.addEventListener("keydown", (e) => { if (e.key === "ArrowDown") { e.preventDefault(); move(1); } if (e.key === "ArrowUp") { e.preventDefault(); move(-1); } if (e.key === "Enter") { e.preventDefault(); palList.querySelectorAll("li[role=option] a")[sel]?.click(); } if (e.key === "Tab") e.preventDefault(); });
  pal.addEventListener("click", (e) => { if (e.target === pal) return closeSearch(); const a = e.target.closest("a"); if (!a) return; if (a.dataset.palCopy) { e.preventDefault(); NS.copy(a.dataset.palCopy); } closeSearch(); });
  pal.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSearch(); });

  document.addEventListener("keydown", (e) => {
    const typing = /input|textarea|select/i.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.classList.contains("is-open") ? closeSearch() : openSearch(); }
    else if (e.key === "/" && !typing && !pal.classList.contains("is-open")) { e.preventDefault(); openSearch(); }
    else if (e.key === "Escape") { closeSide(); }
  });

  window.addEventListener("hashchange", () => { const { route } = parse(); render(route === lastRoute); });
  render();
})();
