/* Dimension overlay for playground stages: height, width, left padding and the gap to the next item,
   read from computed styles and drawn as dimension lines. Toggle with the Dimensions button in the stage
   bar. On by default in the Instrument mode, off elsewhere. Ink is --ns-measure-ink. */
(function () {
  const NS = window.NS;
  const SVG = "http://www.w3.org/2000/svg";
  const r = (n) => Math.round(n);
  const el = (tag, attrs, text) => { const n = document.createElementNS(SVG, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (text != null) n.textContent = text; return n; };
  const tick = 4;

  /* The first real thing on the canvas. Wrappers with no box of their own are skipped. */
  const target = (canvas) => {
    let t = [...canvas.children].find((c) => !c.classList.contains("ns-dim") && c.getBoundingClientRect().width > 0);
    for (let i = 0; t && i < 3 && !t.matches(".ns-btn, .ns-tag, .ns-input, .ns-select, .ns-chip, [class*='ns-']") && t.firstElementChild; i++) t = t.firstElementChild;
    return t;
  };

  const hLine = (g, x1, x2, y, label, below) => {
    g.append(el("line", { x1, y1: y, x2, y2: y }), el("line", { x1, y1: y - tick, x2: x1, y2: y + tick }), el("line", { x1: x2, y1: y - tick, x2, y2: y + tick }));
    g.append(el("text", { x: x1, y: below ? y + 14 : y - 6 }, label));
  };
  const vLine = (g, x, y1, y2, label) => {
    g.append(el("line", { x1: x, y1, x2: x, y2 }), el("line", { x1: x - tick, y1, x2: x + tick, y2: y1 }), el("line", { x1: x - tick, y1: y2, x2: x + tick, y2 }));
    g.append(el("text", { x: x - 8, y: (y1 + y2) / 2 + 3, "text-anchor": "end" }, label));
  };

  NS.measure = function (canvas) {
    canvas.querySelectorAll(":scope > .ns-dim").forEach((n) => n.remove());
    const stage = canvas.closest(".stage");
    const btn = stage && stage.querySelector("[data-measure]");
    if (!btn || btn.getAttribute("aria-pressed") !== "true") return;
    const t = target(canvas); if (!t) return;
    const c = canvas.getBoundingClientRect(), b = t.getBoundingClientRect(), cs = getComputedStyle(t);
    if (b.width < 8 || b.height < 8) return;
    const x = b.left - c.left, y = b.top - c.top, w = b.width, h = b.height;
    const svg = el("svg", { class: "ns-dim", width: c.width, height: c.height, "aria-hidden": "true" });
    const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth);
    if (pad >= 4) svg.append(el("rect", { x, y, width: pad, height: h }));
    hLine(svg, x, x + w, y - 12, `W ${r(w)}`);
    vLine(svg, x - 12, y, y + h, `H ${r(h)}`);
    if (pad >= 4) hLine(svg, x, x + pad, y + h + 12, `PAD ${r(pad)}`, true);
    const next = t.nextElementSibling && !t.nextElementSibling.classList.contains("ns-dim") ? t.nextElementSibling.getBoundingClientRect() : null;
    if (next && next.width > 0 && Math.abs(next.top - b.top) < h) {
      const gap = next.left - b.right;
      if (gap >= 2) hLine(svg, x + w, x + w + gap, y + h + 12 + (pad >= 4 ? 18 : 0), `GAP ${r(gap)}`, true);
    }
    canvas.append(svg);
  };

  NS.measureAll = (root = document) => root.querySelectorAll(".stage [data-canvas]").forEach(NS.measure);
  NS.measureDefault = () => document.documentElement.dataset.theme === "instrument";

  const refresh = NS.refreshPlayground;
  NS.refreshPlayground = function (id) { refresh.apply(this, arguments); const c = document.querySelector(`#${id} [data-canvas]`); if (c) NS.measure(c); };

  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-measure]"); if (!b) return;
    b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
    const c = document.querySelector(`#${b.dataset.measure} [data-canvas]`); if (c) NS.measure(c);
  });
  let raf = 0;
  window.addEventListener("resize", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => NS.measureAll()); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => NS.measureAll());
})();
