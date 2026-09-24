/* Shared doc-building helpers. Everything hangs off window.PF. */
(function () {
  const PF = (window.PF = window.PF || {});

  PF.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  PF.slug = (s) => String(s).toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  PF.icon = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    embed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5"/></svg>',
  };

  /* ---------- very small HTML/CSS/JS highlighter ---------- */
  PF.hl = function (code, lang) {
    let s = PF.esc(code.trim());
    if (lang === "css") {
      s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-c">$1</span>')
        .replace(/(--[\w-]+)/g, '<span class="tok-a">$1</span>')
        .replace(/(#[0-9a-fA-F]{3,8})\b/g, '<span class="tok-s">$1</span>');
    } else if (lang === "js") {
      s = s.replace(/(\/\/.*)/g, '<span class="tok-c">$1</span>')
        .replace(/(&quot;.*?&quot;|&#39;.*?&#39;|`[^`]*`)/g, '<span class="tok-s">$1</span>')
        .replace(/\b(import|from|const|let|export|default|return|function|await|async|new)\b/g, '<span class="tok-k">$1</span>');
    } else {
      s = s.replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tok-t">$2</span>')
        .replace(/([\w-:@]+)=(&quot;.*?&quot;)/g, '<span class="tok-a">$1</span>=<span class="tok-s">$2</span>')
        .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-c">$1</span>');
    }
    return s;
  };

  PF.codeBlock = (code, lang = "html", solo = true) =>
    `<div class="code ${solo ? "code--solo" : ""}"><div class="code__copy"><button class="copy-btn" data-copy-code>Copy</button></div><pre><code data-raw="${PF.esc(code.trim())}">${PF.hl(code, lang)}</code></pre></div>`;

  /* ---------- clipboard + toast ---------- */
  PF.copy = async function (text, btn, label = "Copied") {
    try { await navigator.clipboard.writeText(text); } catch (e) {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (_) {} ta.remove();
    }
    if (btn) { const o = btn.textContent; btn.textContent = label; btn.classList.add("is-done"); setTimeout(() => { btn.textContent = o; btn.classList.remove("is-done"); }, 1400); }
    else PF.toast(label, text.length > 48 ? text.slice(0, 48) + "..." : text, "success");
  };

  PF.toast = function (title, body = "", kind = "info") {
    let stack = document.querySelector(".pf-toast-stack");
    if (!stack) { stack = document.createElement("div"); stack.className = "pf-toast-stack"; stack.setAttribute("role", "status"); stack.setAttribute("aria-live", "polite"); document.body.appendChild(stack); }
    const el = document.createElement("div");
    const glyph = { success: "✓", warning: "!", error: "×", info: "i" }[kind];
    el.className = `pf pf-notice pf-notice--toast pf-notice--${kind}`;
    el.innerHTML = `<span class="pf-notice__icon">${glyph}</span><div><p class="pf-notice__title">${PF.esc(title)}</p>${body ? `<p class="pf-notice__body">${PF.esc(body)}</p>` : ""}</div><button class="pf-notice__close" aria-label="Dismiss">×</button>`;
    el.querySelector("button").onclick = () => el.remove();
    stack.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  };

  /* ---------- doc building blocks ---------- */
  PF.h2 = (t) => `<h2 id="${PF.slug(t)}">${t}<a class="anchor" href="#${PF.slug(t)}" aria-label="Link to section">#</a></h2>`;
  PF.h3 = (t) => `<h3 id="${PF.slug(t)}">${t}</h3>`;

  PF.table = (heads, rows) =>
    `<div class="dtable-wrap"><table class="dtable"><thead><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
      .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

  PF.dd = (doDemo, doTxt, dontDemo, dontTxt) =>
    `<div class="dd"><div class="do"><div class="dd__demo pf">${doDemo}</div><div class="dd__txt"><h4>Do</h4><p>${doTxt}</p></div></div>
     <div class="dont"><div class="dd__demo pf">${dontDemo}</div><div class="dd__txt"><h4>Don't</h4><p>${dontTxt}</p></div></div></div>`;

  PF.notice = (kind, title, body) =>
    `<div class="pf pf-notice pf-notice--${kind}" style="margin:0 0 24px"><span class="pf-notice__icon">${{ success: "✓", warning: "!", error: "×", info: "i" }[kind]}</span><div><p class="pf-notice__title">${title}</p><p class="pf-notice__body">${body}</p></div><span></span></div>`;

  PF.cards = (items, cols = 3) =>
    `<div class="grid grid-${cols}">${items.map((c) =>
      `<a class="rcard ${c.color ? "c-" + c.color : ""}" href="${c.href}">${c.icon ? `<span class="rcard__icon" aria-hidden="true">${c.icon}</span>` : ""}<h3>${c.title}</h3><p>${c.body}</p>${c.go ? `<span class="go">${c.go} →</span>` : ""}</a>`).join("")}</div>`;

  /* Static stage (no controls): render one or more demo snippets with code. */
  PF.stage = (html, opts = {}) =>
    `<div class="stage"><div class="stage__bar"><span class="lbl">${opts.label || "Example"}</span></div>
     <div class="stage__canvas pf ${opts.left ? "is-left" : ""} ${opts.block ? "is-block" : ""}">${html}</div>
     ${opts.code === false ? "" : PF.codeBlock(opts.code || html, "html", false)}</div>`;

  /* ---------- interactive playground ----------
     spec = { controls: [{ key, label, options:[..] | type:'bool' | type:'text' }], render(state) -> html, init(root) }
  */
  PF.playgrounds = {};
  let pgId = 0;
  PF.playground = function (spec) {
    const id = "pg" + ++pgId;
    const state = {};
    (spec.controls || []).forEach((c) => (state[c.key] = c.default ?? (c.options ? c.options[0] : c.type === "bool" ? false : "")));
    PF.playgrounds[id] = { spec, state };
    const ctrls = (spec.controls || []).map((c) => {
      if (c.options) return `<div><h4>${c.label}</h4><div class="seg" role="group" aria-label="${c.label}">${c.options.map((o) => `<button data-pg="${id}" data-k="${c.key}" data-v="${PF.esc(o)}" aria-pressed="${o === state[c.key]}">${o}</button>`).join("")}</div></div>`;
      if (c.type === "bool") return `<label class="pf pf-toggle pf-toggle--sm"><input type="checkbox" data-pg="${id}" data-k="${c.key}" ${state[c.key] ? "checked" : ""}/> ${c.label}</label>`;
      return `<div class="pf pf-field"><label class="pf-label" for="${id}-${c.key}">${c.label}</label><input class="pf-input pf-input--sm" id="${id}-${c.key}" data-pg="${id}" data-k="${c.key}" value="${PF.esc(state[c.key])}"/></div>`;
    }).join("");
    const html = spec.render(state);
    return `<div class="stage" id="${id}"><div class="stage__bar"><span class="lbl">Live playground</span><div class="pf seg"><button data-bg="${id}" aria-pressed="false" title="Toggle canvas background">Grid</button></div></div>
      <div class="${ctrls ? "stage__split" : ""}"><div class="stage__canvas pf ${spec.left ? "is-left" : ""} ${spec.block ? "is-block" : ""}" data-canvas>${html}</div>${ctrls ? `<div class="stage__controls">${ctrls}</div>` : ""}</div>
      ${PF.codeBlock(spec.code ? spec.code(state) : html, "html", false)}</div>`;
  };

  PF.refreshPlayground = function (id) {
    const pg = PF.playgrounds[id]; if (!pg) return;
    const root = document.getElementById(id);
    const html = pg.spec.render(pg.state);
    root.querySelector("[data-canvas]").innerHTML = html;
    const code = root.querySelector(".code code");
    const src = (pg.spec.code ? pg.spec.code(pg.state) : html).trim();
    code.dataset.raw = src; code.innerHTML = PF.hl(src, "html");
    pg.spec.init && pg.spec.init(root);
  };

  /* Delegated events for copy, playground, demo behaviors */
  document.addEventListener("click", (e) => {
    const t = e.target;
    const copyCode = t.closest("[data-copy-code]");
    if (copyCode) { const code = copyCode.closest(".code").querySelector("code"); PF.copy(code.dataset.raw || code.textContent, copyCode); return; }
    const copyVal = t.closest("[data-copy]");
    if (copyVal) { PF.copy(copyVal.dataset.copy, null, "Copied " + copyVal.dataset.copy.slice(0, 40)); return; }
    const seg = t.closest("button[data-pg]");
    if (seg) { const pg = PF.playgrounds[seg.dataset.pg]; pg.state[seg.dataset.k] = seg.dataset.v; seg.parentElement.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b === seg)); PF.refreshPlayground(seg.dataset.pg); return; }
    const bg = t.closest("[data-bg]");
    if (bg) { const c = document.querySelector(`#${bg.dataset.bg} [data-canvas]`); const on = bg.getAttribute("aria-pressed") !== "true"; bg.setAttribute("aria-pressed", on); c.style.backgroundImage = on ? "none" : ""; return; }
    // demo behaviors
    const dismiss = t.closest(".pf-tag button, .pf-notice__close");
    if (dismiss && dismiss.closest(".stage, .dd")) { dismiss.parentElement.style.opacity = ".25"; return; }
    const tab = t.closest(".pf-tabs .pf-tab");
    if (tab && tab.closest(".stage, .fp-frame")) { tab.parentElement.querySelectorAll(".pf-tab").forEach((x) => x.setAttribute("aria-selected", x === tab)); return; }
    const pop = t.closest("[data-popover]");
    if (pop) { pop.closest(".pf-popover").classList.toggle("is-open"); return; }
    const openModal = t.closest("[data-open-modal]");
    if (openModal) { PF.demoModal(); return; }
    const toastBtn = t.closest("[data-toast]");
    if (toastBtn) { PF.toast(toastBtn.dataset.toast, "Triggered from a live example.", toastBtn.dataset.kind || "info"); return; }
    const page = t.closest(".pf-pagination .pf-page");
    if (page && page.closest(".stage") && !page.disabled && /^\d+$/.test(page.textContent)) { page.parentElement.querySelectorAll(".pf-page").forEach((p) => p.removeAttribute("aria-current")); page.setAttribute("aria-current", "page"); return; }
    const day = t.closest(".pf-cal__day");
    if (day && !day.classList.contains("is-muted")) { day.closest(".pf-cal").querySelectorAll(".is-selected").forEach((d) => d.classList.remove("is-selected")); day.classList.add("is-selected"); return; }
    const sortTh = t.closest("th[data-sort]");
    if (sortTh) { PF.sortTable(sortTh); return; }
    if (!t.closest(".pf-popover")) document.querySelectorAll(".pf-popover.is-open").forEach((p) => p.classList.remove("is-open"));
  });

  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.matches("input[data-pg]")) { const pg = PF.playgrounds[t.dataset.pg]; pg.state[t.dataset.k] = t.type === "checkbox" ? t.checked : t.value; PF.refreshPlayground(t.dataset.pg); }
    if (t.matches(".pf-slider")) { const p = ((t.value - t.min) / (t.max - t.min)) * 100; t.style.setProperty("--_pct", p + "%"); const out = t.parentElement.querySelector("output"); if (out) out.textContent = t.value; }
    if (t.matches("[data-row-select]")) { t.closest("tr").classList.toggle("is-selected", t.checked); PF.updateBatch(t.closest(".pf-table-wrap")); }
    if (t.matches("[data-select-all]")) { const wrap = t.closest(".pf-table-wrap"); wrap.querySelectorAll("[data-row-select]").forEach((c) => { c.checked = t.checked; c.closest("tr").classList.toggle("is-selected", t.checked); }); PF.updateBatch(wrap); }
  });

  PF.updateBatch = function (wrap) {
    const bar = wrap.querySelector(".pf-table-bar"); if (!bar) return;
    const n = wrap.querySelectorAll("[data-row-select]:checked").length;
    bar.classList.toggle("is-batch", n > 0);
    const lbl = bar.querySelector("[data-batch-label]"); if (lbl) lbl.textContent = n ? `${n} selected` : lbl.dataset.default;
  };

  PF.sortTable = function (th) {
    const table = th.closest("table"); const idx = [...th.parentElement.children].indexOf(th);
    const dir = th.dataset.dir === "asc" ? "desc" : "asc";
    table.querySelectorAll("th").forEach((x) => { x.classList.remove("is-sorted"); x.removeAttribute("aria-sort"); const s = x.querySelector(".pf-sort"); if (s) s.textContent = "↕"; });
    th.dataset.dir = dir; th.classList.add("is-sorted"); th.setAttribute("aria-sort", dir === "asc" ? "ascending" : "descending");
    th.querySelector(".pf-sort").textContent = dir === "asc" ? "↑" : "↓";
    const rows = [...table.tBodies[0].rows];
    const val = (r) => { const t = r.cells[idx].textContent.trim(); const n = parseFloat(t.replace(/[$,%]/g, "")); return isNaN(n) ? t.toLowerCase() : n; };
    rows.sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * (dir === "asc" ? 1 : -1));
    rows.forEach((r) => table.tBodies[0].appendChild(r));
  };

  PF.demoModal = function () {
    const prev = document.activeElement;
    const bd = document.createElement("div");
    bd.className = "pf pf-modal-backdrop";
    bd.innerHTML = `<div class="pf-modal" role="dialog" aria-modal="true" aria-labelledby="dm-t"><div class="pf-modal__head"><div><p class="pf-modal__label">Partner access</p><h2 class="pf-modal__title" id="dm-t">Revoke API credentials?</h2></div><button class="icon-btn" aria-label="Close">${PF.icon.close}</button></div><div class="pf-modal__body">Revoking credentials for <strong>Acme Corp</strong> will stop 14 active integrations immediately. This cannot be undone.</div><div class="pf-modal__foot"><button class="pf-btn pf-btn--tertiary" data-close>Cancel</button><button class="pf-btn pf-btn--danger" data-close>Revoke credentials</button></div></div>`;
    const close = () => { bd.remove(); document.body.style.overflow = ""; prev && prev.focus(); };
    bd.addEventListener("click", (e) => { if (e.target === bd || e.target.closest("[data-close], .icon-btn")) close(); });
    bd.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") { const f = [...bd.querySelectorAll("button")]; const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
    document.body.appendChild(bd); document.body.style.overflow = "hidden";
    bd.querySelector("[data-close]").focus();
  };

  /* Read a computed token value */
  PF.tokenValue = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* WCAG contrast */
  PF.toRgb = function (c) {
    const el = document.createElement("i"); el.style.color = c; document.body.appendChild(el);
    const m = getComputedStyle(el).color.match(/[\d.]+/g).map(Number); el.remove(); return m.slice(0, 3);
  };
  PF.contrast = function (a, b) {
    const L = (rgb) => { const [r, g, bb] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * bb; };
    const l1 = L(PF.toRgb(a)), l2 = L(PF.toRgb(b));
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
})();
