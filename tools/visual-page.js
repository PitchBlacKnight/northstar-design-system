/* Injected by tools/visual-check.mjs. Lays out component tiles on a fixed grid so one screenshot holds
   one gallery page. Query: ?visual=<page index>&theme=dark|light. Writes the tile list (id and rect)
   to <script type="application/json" id="ns-visual-tiles"> so the compare step can name each region. */
(async () => {
  const q = new URLSearchParams(location.search);
  const W = (ms) => new Promise((r) => setTimeout(r, ms));
  await new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)));
  await W(600);
  const TILE_W = 400, TILE_H = 320, COLS = 4, PER_PAGE = 48;
  const theme = q.get("theme") || "dark";
  document.documentElement.dataset.theme = theme;
  const still = document.createElement("style");
  still.textContent = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
    body>*{visibility:hidden!important} #ns-visual,#ns-visual *{visibility:visible!important}
    #ns-visual{position:fixed;left:0;top:0;z-index:2147483647;display:grid;grid-template-columns:repeat(${COLS},${TILE_W}px);grid-auto-rows:${TILE_H}px;background:var(--ns-background-primary);width:${TILE_W * COLS}px}
    #ns-visual .vt{position:relative;overflow:hidden;box-sizing:border-box;border:1px solid var(--ns-border-subtle);padding:16px;display:flex;align-items:flex-start;justify-content:flex-start}
    #ns-visual .vt>.stage__canvas{width:100%;min-height:0;padding:0;background:none;display:block}`;
  document.head.appendChild(still);
  /* Every demo and the first two variants of each component and each folded part */
  const items = [];
  for (const c of NS.COMPONENTS) {
    for (const pc of [c, ...(c.parts || [])]) {
      const st = {}; (pc.playground?.controls || []).forEach((k) => (st[k.key] = k.default ?? (k.options ? k.options[0] : k.type === "bool" ? false : "")));
      try { if (pc.playground?.render) items.push([`${pc.id} demo`, pc.playground.render(st), pc]); } catch {}
      (pc.variants || []).slice(0, 2).forEach((v) => typeof v[2] === "string" && items.push([`${pc.id} ${v[0]}`, v[2], pc]));
    }
  }
  const page = +(q.get("visual") || 0), slice = items.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const host = document.createElement("div"); host.id = "ns-visual"; host.className = "ns";
  host.innerHTML = slice.map(([, h]) => `<div class="vt"><div class="stage__canvas ns">${h}</div></div>`).join("");
  document.body.appendChild(host);
  slice.forEach(([, , pc], i) => { try { pc.playground?.init?.(host.children[i]); } catch {} });
  window.scrollTo(0, 0);
  await W(800);
  const tiles = slice.map(([name], i) => ({ name, x: (i % COLS) * TILE_W, y: Math.floor(i / COLS) * TILE_H, w: TILE_W, h: TILE_H }));
  const o = document.createElement("script"); o.type = "application/json"; o.id = "ns-visual-tiles";
  o.textContent = JSON.stringify({ total: items.length, pages: Math.ceil(items.length / PER_PAGE), width: TILE_W * COLS, height: Math.ceil(slice.length / COLS) * TILE_H, tiles });
  document.body.appendChild(o);
})();
