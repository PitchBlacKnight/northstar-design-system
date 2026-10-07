/* Home page: four tiers (hero, start here, library bento, quiet band).
   NS.homeBody() returns markup; NS.homeInit() wires motion and returns a cleanup function. */
(function () {
  const NS = window.NS;
  const FIGMA = "https://www.figma.com/design/VZxmDNQiosTN6gqnvEQ65Z/NorthStar-Design-System";

  // 24px line icons, same 1.75 stroke language as NS.svgIcon.
  const P = {
    pen: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.6 7.6M11 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    code: "M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16",
    flag: "M4 22V4M4 4h13l-2 4 2 4H4",
    grid: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
    palette: "M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 22zM7.5 11.5h.01M10.5 7.5h.01M15.5 7.5h.01M17.5 11.5h.01",
    layers: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    chart: "M3 3v18h18M7 15l4-4 3 3 5-6",
    layout: "M3 3h18v18H3zM3 9h18M9 9v12",
    access: "M12 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5 7l7 2 7-2M12 9v5m0 0-3 7m3-7 3 7",
    token: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
    spark: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-3.5-3.5",
    arrow: "M5 12h14M13 6l6 6-6 6",
    chevron: "m6 9 6 6 6-6",
    clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5",
  };
  const ic = (n, s = 20) => `<svg class="hm-ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;
  const eye = (n, label, icon) => `<div class="hm-eye" data-reveal><span class="hm-eye__n">${n}</span>${ic(icon, 16)}<span>${label}</span><i></i></div>`;

  const patternCount = () => (NS.NAV.find((g) => g.group === "Patterns") || { items: [] }).items.length;

  NS.homeBody = () => {
    const comps = NS.COMPONENTS.length;
    const roles = [
      ["teal", "pen", "I design", "Use the Figma library", "Tokens, " + comps + " components, and dark, light and high-contrast modes.", ["Enable NORTHSTAR DS in Figma", "Read the component specs"], FIGMA, "Open Figma library", true],
      ["purple", "code", "I build", "Install the code", "Framework-free CSS and React. Every value is a token, so nothing drifts from Figma.", ["Add tokens.css and components.css", "Copy markup from any playground"], "#/getting-started/developers", "Developer guide"],
      ["blue", "flag", "I lead a team", "Roll it out", "Adoption steps, governance and contribution rules for product teams.", ["Run the adoption checklist", "Check Figma drift with the sync script"], "#/getting-started/adoption", "Adoption guide"],
    ];
    const tile = (cls, c, icon, kicker, title, body, href, extra = "", ext) =>
      `<a class="hm-tile ${cls}" style="--c:var(--hm-${c})" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""} data-reveal data-spot><span class="hm-tile__k">${ic(icon, 16)}${kicker}</span><h3>${title}</h3>${body ? `<p>${body}</p>` : ""}${extra}<span class="hm-tile__go" aria-hidden="true">${ic("arrow", 16)}</span></a>`;

    return `
<section class="hm-hero">
  <a class="hm-pill hm-in" href="#/changelog" style="--d:0"><b>${NS.VERSION}</b> Spec tabs synced from Figma · Oct 2026 ${ic("arrow", 14)}</a>
  <h1 class="hero__brand hm-in" style="--d:1">NORTHSTAR <b>DS</b></h1>
  <p class="hm-lede hm-in" style="--d:2">The design language and development kit for dense, dark, data-heavy enterprise consoles.</p>
  <button class="hm-search hm-in" style="--d:3" data-open-search aria-label="Search documentation">${ic("search", 20)}<span class="hm-search__q">Find a <span data-type>component</span><i class="hm-caret"></i></span><kbd>⌘K</kbd></button>
  <div class="hm-cta ns hm-in" style="--d:4"><a class="ns-btn" href="#/getting-started/about">Get started</a><a class="ns-btn ns-btn--tertiary" href="#/components">Browse components</a><a class="hm-link" href="#/tools/live-builder">Launch Live Builder ${ic("arrow", 16)}</a></div>
  <div class="hm-stats hm-in" style="--d:5">
    <div>${ic("token", 18)}<b data-count="tokens">0</b><span>Tokens</span></div>
    <div>${ic("grid", 18)}<b data-to="${comps}">0</b><span>Components</span></div>
    <div>${ic("layers", 18)}<b data-to="${patternCount()}">0</b><span>Patterns</span></div>
    <div>${ic("layout", 18)}<b data-to="5">0</b><span>Floorplans</span></div>
  </div>
</section>

<section class="hm-band hm-start" aria-labelledby="hm-start">
  ${eye("01", '<span id="hm-start">Start here</span>', "spark")}
  <div class="hm-roles">${roles.map(([c, icon, k, t, b, steps, href, go, ext], i) => `
    <a class="hm-role" style="--c:var(--hm-${c});--i:${i}" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""} data-reveal>
      <span class="hm-role__ic">${ic(icon, 22)}</span>
      <small>${k}</small><h3>${t}</h3><p>${b}</p>
      <ol>${steps.map((s) => `<li>${s}</li>`).join("")}</ol>
      <span class="hm-role__go">${go} ${ic("arrow", 16)}</span>
    </a>`).join("")}
  </div>
</section>

<section class="hm-lib" aria-labelledby="hm-lib">
  ${eye("02", '<span id="hm-lib">The library</span>', "grid")}
  <div class="hm-bento">
    ${tile("hm-tile--big", "teal", "grid", "Components", comps + " components, live", "Playgrounds, token tables, code, accessibility notes and Figma specs for every component.", "#/components",
      `<span class="hm-new">14 new in Figma</span>
      <div class="hm-demo ns" aria-hidden="true">
        <div><span class="ns-btn ns-btn--sm hm-demo__btn">Deploy</span></div>
        <div><span class="hm-tog"></span><span class="ns-badge ns-badge--positive ns-badge--sm">Active</span></div>
        <div><span class="hm-sel">Growth ${ic("chevron", 14)}</span></div>
        <div><span class="hm-tabs"><b>Overview</b><b>Syncs</b><b>Billing</b><i></i></span></div>
        <div><span class="hm-slide"><i></i></span></div>
        <div class="hm-demo__toast"><span>${ic("spark", 14)}</span>Sync complete</div>
      </div>`)}
    ${tile("", "teal", "palette", "Foundations", "Color, type, space", "Radius, elevation, motion, icons and themes.", "#/foundations",
      `<div class="hm-sw" aria-hidden="true">${["blue-500", "teal-500", "purple-500", "navy-900", "yellow-500"].map((v, i) => `<i style="background:var(--ns-${v});--i:${i}"></i>`).join("")}</div>`)}
    ${tile("", "blue", "layers", "Patterns", "Forms to errors", "Dialogs, tables, empty states and the Create partner workflow.", "#/patterns/forms")}
    ${tile("", "green", "chart", "Graphics", "60+ dashboard widgets", "", "#/graphics",
      `<div class="hm-bars" aria-hidden="true">${[40, 70, 55, 90, 65, 82].map((h, i) => `<i style="--h:${h}%;--i:${i}"></i>`).join("")}</div>`)}
    ${tile("", "red", "access", "Accessibility", "WCAG 2.2 AA", "Principles, checklist, criteria mapping and a contrast checker.", "#/accessibility")}
    ${tile("hm-tile--live", "violet", "spark", "Live Builder", "Watch a UI assemble from real tokens", "Pick a recipe, or describe one and let Claude build it.", "#/tools/live-builder", `<span class="ns-btn hm-live__btn">Launch</span>`)}
    ${tile("", "yellow", "layout", "Floorplans", "5 page templates", "Dashboard, list, detail, wizard and approval queue.", "#/floorplans")}
    ${tile("", "gray", "token", "Token reference", "Every variable", "Searchable, one click to copy.", "#/foundations/tokens")}
  </div>
</section>

<section class="hm-band hm-quiet" aria-label="Updates and resources">
  <div data-reveal>
    <h2 class="hm-h">${ic("clock", 16)}What's new</h2>
    <ol class="hm-rel">
      <li><time datetime="2026-10-06">Oct 06</time><a href="#/components/button/spec">Spec tabs for 5 components, synced from Figma</a></li>
      <li><time datetime="2026-10-06">Oct 06</time><a href="#/components">14 new components in the Figma library</a></li>
      <li><time datetime="2026-10-06">Oct 06</time><a href="#/patterns/create-partner">Create partner workflow pattern</a></li>
      <li><time datetime="2026-09-24">Sep 24</time><a href="#/changelog">${NS.VERSION}: light theme layer and token renames</a></li>
    </ol>
  </div>
  <div data-reveal>
    <h2 class="hm-h">${ic("book", 16)}Resources</h2>
    <ul class="hm-links">
      <li><a href="${FIGMA}" target="_blank" rel="noopener">Figma library</a></li><li><a href="#/changelog">Changelog</a></li>
      <li><a href="#/tools/embed">Embed mode</a></li><li><a href="#/community/contributing">Contributing</a></li>
      <li><a href="#/community/governance">Governance</a></li><li><a href="#/community/support">Support</a></li>
    </ul>
  </div>
</section>`;
  };

  NS.homeInit = (main) => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = [];

    // Stat counters (tokens handled by app.js data-count).
    main.querySelectorAll("[data-to]").forEach((el) => {
      const n = +el.dataset.to;
      if (still) { el.textContent = n; return; }
      const t0 = performance.now() + 250;
      const tick = (now) => { const p = Math.max(0, Math.min(1, (now - t0) / 900)); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });

    // Scroll reveal.
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    main.querySelectorAll("[data-reveal]").forEach((el, i) => { el.style.setProperty("--ri", i % 4); if (still) el.classList.add("is-in"); else io.observe(el); });

    // Cursor spotlight on bento tiles.
    const onMove = (e) => { const t = e.target.closest("[data-spot]"); if (!t) return; const r = t.getBoundingClientRect(); t.style.setProperty("--mx", e.clientX - r.left + "px"); t.style.setProperty("--my", e.clientY - r.top + "px"); };
    main.addEventListener("pointermove", onMove);

    // Search placeholder cycles through what you can find.
    const typed = main.querySelector("[data-type]");
    if (typed && !still) {
      const words = ["component", "token", "pattern", "Data table", "--ns-blue-500", "Date picker", "focus ring"];
      let w = 0, c = typed.textContent.length, dir = -1;
      const step = () => {
        const word = words[w];
        c += dir; typed.textContent = word.slice(0, Math.max(0, c));
        if (dir < 0 && c <= 0) { dir = 1; w = (w + 1) % words.length; }
        else if (dir > 0 && c >= words[w].length) { dir = -1; timers.push(setTimeout(step, 1600)); return; }
        timers.push(setTimeout(step, dir > 0 ? 70 : 35));
      };
      timers.push(setTimeout(step, 2200));
    }

    return () => { io.disconnect(); main.removeEventListener("pointermove", onMove); timers.forEach(clearTimeout); };
  };
})();
