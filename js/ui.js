/* Shared doc-building helpers. Everything hangs off window.NS. */
(function () {
  const NS = (window.NS = window.NS || {});

  /* NorthStar mark from Figma "Logo / Northstar" (4057:30836): gray chevron + cyan diamond. */
  NS.logoSvg = (cls = "", label = "") => `<svg class="${cls}" viewBox="40 30 374 390" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} xmlns="http://www.w3.org/2000/svg"><path d="M227 46.1094L393.703 328.086L290.844 281.977L227 170.25L163.156 281.977L60.2969 328.086L227 46.1094Z" fill="#C5C5C5"/><path d="M227 255.375L289.07 360.008L227 404.344L164.93 360.008L227 255.375Z" fill="#27BDFA"/></svg>`;
  NS.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  NS.slug = (s) => String(s).toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  NS.icon = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    contrast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    embed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5"/></svg>',
  };

  /* ---------- very small HTML/CSS/JS highlighter ---------- */
  NS.hl = function (code, lang) {
    let s = NS.esc(code.trim());
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

  NS.codeBlock = (code, lang = "html", solo = true) =>
    `<div class="code ${solo ? "code--solo" : ""}"><div class="code__copy"><button class="copy-btn" data-copy-code>Copy</button></div><pre><code data-raw="${NS.esc(code.trim())}">${NS.hl(code, lang)}</code></pre></div>`;

  /* ---------- clipboard + toast ---------- */
  NS.copy = async function (text, btn, label = "Copied") {
    try { await navigator.clipboard.writeText(text); } catch (e) {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (_) {} ta.remove();
    }
    if (btn) { const o = btn.textContent; btn.textContent = label; btn.classList.add("is-done"); setTimeout(() => { btn.textContent = o; btn.classList.remove("is-done"); }, 1400); }
    else NS.toast(label, text.length > 48 ? text.slice(0, 48) + "..." : text, "success");
  };

  /* Toasts follow Sonner: newest on top, three visible at most, timers pause while hovered or focused,
     errors stay until dismissed and use role=alert. */
  NS.toast = function (title, body = "", kind = "info", o = {}) {
    let stack = document.querySelector(".ns-toast-stack");
    if (!stack) {
      stack = document.createElement("div"); stack.className = "ns ns-toast-stack"; stack.setAttribute("aria-label", "Notifications");
      stack.addEventListener("pointerenter", () => stack.classList.add("is-paused"));
      stack.addEventListener("pointerleave", () => stack.classList.remove("is-paused"));
      stack.addEventListener("focusin", () => stack.classList.add("is-paused"));
      stack.addEventListener("focusout", (e) => { if (!stack.contains(e.relatedTarget)) stack.classList.remove("is-paused"); });
      document.body.appendChild(stack);
    }
    const el = document.createElement("div");
    const glyph = { success: "✓", warning: "!", error: "×", info: "i" }[kind];
    el.className = `ns-notice ns-notice--toast ns-notice--${kind}`;
    el.setAttribute("role", kind === "error" ? "alert" : "status");
    el.innerHTML = `<span class="ns-notice__icon" aria-hidden="true">${glyph}</span><div><p class="ns-notice__title">${NS.esc(title)}</p>${body ? `<p class="ns-notice__body">${NS.esc(body)}</p>` : ""}</div><button class="ns-notice__close" aria-label="Dismiss notification">×</button>`;
    const close = () => { if (el.classList.contains("is-leaving")) return; el.classList.add("is-leaving"); const done = () => el.remove(); matchMedia("(prefers-reduced-motion: reduce)").matches ? done() : (el.addEventListener("animationend", done, { once: true }), setTimeout(done, 400)); };
    el.querySelector("button").onclick = close;
    stack.prepend(el);
    [...stack.children].slice(3).forEach((x) => x.remove());
    if (kind !== "error") {
      let left = o.duration || 4000, last = Date.now();
      const tick = setInterval(() => {
        const now = Date.now(); if (!stack.classList.contains("is-paused")) left -= now - last; last = now;
        if (left <= 0 || !el.isConnected) { clearInterval(tick); close(); }
      }, 100);
    }
    return el;
  };

  /* ---------- doc building blocks ---------- */
  NS.h2 = (t) => `<h2 id="${NS.slug(t)}">${t}<a class="anchor" href="#${NS.slug(t)}" aria-label="Link to section">#</a></h2>`;
  NS.h3 = (t) => `<h3 id="${NS.slug(t)}">${t}</h3>`;

  NS.table = (heads, rows) =>
    `<div class="dtable-wrap"><table class="dtable"><thead><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
      .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

  NS.dd = (doDemo, doTxt, dontDemo, dontTxt) =>
    `<div class="dd"><div class="do"><div class="dd__demo ns">${doDemo}</div><div class="dd__txt"><h4>Do</h4><p>${doTxt}</p></div></div>
     <div class="dont"><div class="dd__demo ns">${dontDemo}</div><div class="dd__txt"><h4>Don't</h4><p>${dontTxt}</p></div></div></div>`;

  NS.notice = (kind, title, body) =>
    `<div class="ns ns-notice ns-notice--${kind}" style="margin:0 0 24px"><span class="ns-notice__icon">${{ success: "✓", warning: "!", error: "×", info: "i" }[kind]}</span><div><p class="ns-notice__title">${title}</p><p class="ns-notice__body">${body}</p></div><span></span></div>`;

  NS.cards = (items, cols = 3) =>
    `<div class="grid grid-${cols}">${items.map((c) =>
      `<a class="rcard ${c.color ? "c-" + c.color : ""}" href="${c.href}">${c.icon ? `<span class="rcard__icon" aria-hidden="true">${c.icon}</span>` : ""}<h3>${c.title}</h3><p>${c.body}</p>${c.go ? `<span class="go">${c.go} →</span>` : ""}</a>`).join("")}</div>`;

  /* Animated foundation icons. Keys match the Foundations overview cards; motion is in site.css (.fi). */
  const FI = {
    color: `<g data-a="hue"><circle cx="12" cy="8.5" r="4.5" fill="currentColor" fill-opacity=".9" stroke="none"/><circle cx="8.5" cy="14.5" r="4.5" fill="currentColor" fill-opacity=".45" stroke="none"/><circle cx="15.5" cy="14.5" r="4.5" fill="currentColor" fill-opacity=".2" stroke="none"/></g>`,
    type: `<path d="M4 5h6M7 5v8"/><rect data-a="line" x="4" y="15" width="16" height="2.4" rx="1.2" fill="currentColor" stroke="none"/><rect data-a="line" x="4" y="19" width="11" height="1.6" rx=".8" fill="currentColor" fill-opacity=".55" stroke="none"/><rect data-a="line" x="13" y="6" width="7" height="1.6" rx=".8" fill="currentColor" fill-opacity=".55" stroke="none"/>`,
    spacing: `<rect x="3" y="6" width="6" height="12" rx="1.5"/><g data-a="gap"><rect x="13" y="6" width="6" height="12" rx="1.5"/></g><path d="M9 21h4M9 20v2M13 20v2" stroke-opacity=".6"/>`,
    radius: `<rect data-a="corner" x="4" y="4" width="16" height="16" rx="1"/><path d="M4 9V4h5" stroke-opacity=".35" stroke-dasharray="1.5 2"/>`,
    elevation: `<path d="M12 19 4 15.5 12 12l8 3.5z" stroke-opacity=".4"/><path data-a="lift1" d="M12 15.5 4 12l8-3.5 8 3.5z" stroke-opacity=".7"/><path data-a="lift2" d="M12 12 4 8.5 12 5l8 3.5z" fill="currentColor" fill-opacity=".2"/>`,
    motion: `<path d="M5 12h14" stroke-opacity=".3"/><circle data-a="trail" cx="9" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle data-a="ease" cx="5" cy="12" r="2.6" fill="currentColor" stroke="none"/><path d="M5 18c4 0 4-12 14-12" stroke-opacity=".35"/>`,
  };
  NS.fIcon = (k) => `<svg class="fi" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${FI[k]}</svg>`;

  /* Cursor spotlight for resource cards, same as the home tiles. */
  document.addEventListener("pointermove", (e) => {
    const t = e.target.closest && e.target.closest(".rcard");
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", e.clientX - r.left + "px");
    t.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });

  /* Static stage (no controls): render one or more demo snippets with code. */
  NS.stage = (html, opts = {}) =>
    `<div class="stage"><div class="stage__bar"><span class="lbl">${opts.label || "Example"}</span></div>
     <div class="stage__canvas ns ${opts.left ? "is-left" : ""} ${opts.block ? "is-block" : ""}">${html}</div>
     ${opts.code === false ? "" : NS.codeBlock(opts.code || html, "html", false)}</div>`;

  /* ---------- interactive playground ----------
     spec = { controls: [{ key, label, options:[..] | type:'bool' | type:'text' }], render(state) -> html, init(root) }
  */
  NS.playgrounds = {};
  let pgId = 0;
  NS.playground = function (spec) {
    const id = "pg" + ++pgId;
    const state = {};
    (spec.controls || []).forEach((c) => (state[c.key] = c.default ?? (c.options ? c.options[0] : c.type === "bool" ? false : "")));
    NS.playgrounds[id] = { spec, state };
    const ctrls = (spec.controls || []).map((c) => {
      if (c.options) return `<div><h4>${c.label}</h4><div class="seg" role="group" aria-label="${c.label}">${c.options.map((o) => `<button data-pg="${id}" data-k="${c.key}" data-v="${NS.esc(o)}" aria-pressed="${o === state[c.key]}">${o}</button>`).join("")}</div></div>`;
      if (c.type === "bool") return `<label class="ns ns-toggle ns-toggle--sm"><input type="checkbox" data-pg="${id}" data-k="${c.key}" ${state[c.key] ? "checked" : ""}/> ${c.label}</label>`;
      return `<div class="ns ns-field"><label class="ns-label" for="${id}-${c.key}">${c.label}</label><input class="ns-input ns-input--sm" id="${id}-${c.key}" data-pg="${id}" data-k="${c.key}" value="${NS.esc(state[c.key])}"/></div>`;
    }).join("");
    const html = spec.render(state);
    return `<div class="stage" id="${id}"><div class="stage__bar"><span class="lbl">Live playground</span><div class="ns seg"><button data-bg="${id}" aria-pressed="false" title="Toggle canvas background">Grid</button></div></div>
      <div class="${ctrls ? "stage__split" : ""}"><div class="stage__canvas ns ${spec.left ? "is-left" : ""} ${spec.block ? "is-block" : ""}" data-canvas>${html}</div>${ctrls ? `<div class="stage__controls">${ctrls}</div>` : ""}</div>
      ${NS.codeBlock(spec.code ? spec.code(state) : html, "html", false)}</div>`;
  };

  NS.refreshPlayground = function (id) {
    const pg = NS.playgrounds[id]; if (!pg) return;
    const root = document.getElementById(id);
    const html = pg.spec.render(pg.state);
    root.querySelector("[data-canvas]").innerHTML = html;
    const code = root.querySelector(".code code");
    const src = (pg.spec.code ? pg.spec.code(pg.state) : html).trim();
    code.dataset.raw = src; code.innerHTML = NS.hl(src, "html");
    pg.spec.init && pg.spec.init(root);
  };

  /* Tree view: roving tabindex, arrows to move, Right and Left to expand and collapse, Enter to select. */
  const initTrees = (root) => root.querySelectorAll && root.querySelectorAll("[role=tree]").forEach((t) => {
    const rows = [...t.querySelectorAll("[role=treeitem]")];
    if (!rows.length || rows.some((r) => r.tabIndex === 0)) return;
    const start = rows.find((r) => r.getAttribute("aria-selected") === "true") || rows[0];
    rows.forEach((r) => (r.tabIndex = r === start ? 0 : -1));
  });
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) { initTrees(n.matches("[role=tree]") ? n.parentNode : n); if (n.querySelector && n.querySelector(".ns-cmdk input, .ns-combobox.is-open input")) NS.initListboxes(n); } }))).observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("DOMContentLoaded", () => initTrees(document));
  }
  const treeSelect = (tree, row) => tree.querySelectorAll("[role=treeitem]").forEach((x) => x.setAttribute("aria-selected", String(x === row)));
  const treeToggle = (row, open) => { row.setAttribute("aria-expanded", String(open)); const g = row.parentElement.querySelector(":scope > [role=group]"); if (g) g.hidden = !open; };
  document.addEventListener("keydown", (e) => {
    const row = e.target;
    if (!row.matches || !row.matches("[role=treeitem]")) return;
    const tree = row.closest("[role=tree]");
    if (!tree) return;
    const items = [...tree.querySelectorAll("[role=treeitem]")].filter((x) => !x.closest("[role=group][hidden]"));
    const i = items.indexOf(row), group = row.parentElement.querySelector(":scope > [role=group]");
    const expandable = row.hasAttribute("aria-expanded"), open = row.getAttribute("aria-expanded") === "true";
    let next = null;
    if (e.key === "ArrowDown") next = items[i + 1];
    else if (e.key === "ArrowUp") next = items[i - 1];
    else if (e.key === "Home") next = items[0];
    else if (e.key === "End") next = items[items.length - 1];
    else if (e.key === "ArrowRight") { if (expandable && !open) treeToggle(row, true); else if (expandable && open && group) next = group.querySelector("[role=treeitem]"); }
    else if (e.key === "ArrowLeft") { if (expandable && open) treeToggle(row, false); else { const pg = row.closest("[role=group]"); next = pg && pg.parentElement.querySelector(":scope > [role=treeitem]"); } }
    else if (e.key === "Enter" || e.key === " ") treeSelect(tree, row);
    else return;
    e.preventDefault();
    if (next) { tree.querySelectorAll("[role=treeitem]").forEach((x) => (x.tabIndex = -1)); next.tabIndex = 0; next.focus(); }
  });
  document.addEventListener("click", (e) => {
    const row = e.target.closest && e.target.closest(".ns-tree__row[role=treeitem]");
    if (!row) return;
    const tree = row.closest("[role=tree]");
    treeSelect(tree, row);
    tree.querySelectorAll("[role=treeitem]").forEach((x) => (x.tabIndex = x === row ? 0 : -1));
    if (row.hasAttribute("aria-expanded")) treeToggle(row, row.getAttribute("aria-expanded") !== "true");
  });

  /* Tabs and menus: arrows, Home and End move focus between items; button tabs in demos also activate. */
  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (!t.matches) return;
    const isTab = t.matches("[role=tab]"), isItem = t.matches("[role=menuitem]");
    const group = isTab ? t.closest("[role=tablist]") : isItem ? t.closest("[role=menu]") : null;
    if (!group) return;
    const items = [...group.querySelectorAll(isTab ? "[role=tab]" : "[role=menuitem]")].filter((x) => !x.disabled && x.getAttribute("aria-disabled") !== "true");
    const fwd = isTab ? "ArrowRight" : "ArrowDown", back = isTab ? "ArrowLeft" : "ArrowUp", i = items.indexOf(t);
    let j;
    if (e.key === fwd) j = (i + 1) % items.length;
    else if (e.key === back) j = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = items.length - 1;
    else return;
    e.preventDefault();
    items[j].focus();
    if (isTab && items[j].tagName === "BUTTON") items[j].click();
  });

  /* Roving focus for button-based radio groups (segmented control): arrows and Home/End move and select. */
  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (!t.matches || !t.matches("[role=radio]")) return;
    const group = t.closest("[role=radiogroup]");
    if (!group) return;
    const items = [...group.querySelectorAll("[role=radio]:not([disabled])")];
    const i = items.indexOf(t);
    let j;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % items.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = items.length - 1;
    else return;
    e.preventDefault();
    items.forEach((b, k) => { b.setAttribute("aria-checked", String(k === j)); b.tabIndex = k === j ? 0 : -1; });
    items[j].focus();
  });

  /* Delegated events for copy, playground, demo behaviors */
  document.addEventListener("click", (e) => {
    const t = e.target;
    const copyCode = t.closest("[data-copy-code]");
    if (copyCode) { const code = copyCode.closest(".code").querySelector("code"); NS.copy(code.dataset.raw || code.textContent, copyCode); return; }
    const copyVal = t.closest("[data-copy]");
    if (copyVal) { NS.copy(copyVal.dataset.copy, null, "Copied " + copyVal.dataset.copy.slice(0, 40)); return; }
    const seg = t.closest("button[data-pg]");
    if (seg) { const pg = NS.playgrounds[seg.dataset.pg]; pg.state[seg.dataset.k] = seg.dataset.v; seg.parentElement.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b === seg)); NS.refreshPlayground(seg.dataset.pg); return; }
    const bg = t.closest("[data-bg]");
    if (bg) { const c = document.querySelector(`#${bg.dataset.bg} [data-canvas]`); const on = bg.getAttribute("aria-pressed") !== "true"; bg.setAttribute("aria-pressed", on); c.style.backgroundImage = on ? "none" : ""; return; }
    // demo behaviors
    const comboTag = t.closest(".ns-combobox .ns-tag button");
    if (comboTag) { NS.comboRemove(comboTag.closest(".ns-tag")); return; }
    const dismiss = t.closest(".ns-tag button, .ns-notice__close, .ns-alert__close");
    if (dismiss && dismiss.closest(".stage, .dd")) { dismiss.parentElement.style.opacity = ".25"; return; }
    const tab = t.closest(".ns-tabs .ns-tab");
    if (tab && tab.closest(".stage, .fp-frame")) { tab.parentElement.querySelectorAll(".ns-tab").forEach((x) => x.setAttribute("aria-selected", x === tab)); return; }
    const ddTrig = t.closest("[data-dd] .ns-dd__trigger");
    if (ddTrig) { const dd = ddTrig.closest("[data-dd]"); const o = dd.classList.toggle("is-open"); ddTrig.setAttribute("aria-expanded", o); return; }
    const ddItem = t.closest("[data-dd] .ns-dd__item");
    if (ddItem) { const dd = ddItem.closest("[data-dd]"); dd.querySelectorAll(".ns-dd__item").forEach((i) => i.setAttribute("aria-selected", i === ddItem)); dd.querySelector(".ns-dd__trigger").firstChild.textContent = ddItem.textContent; dd.classList.remove("is-open"); return; }
    const pop = t.closest("[data-popover]");
    if (pop) { const o = pop.closest(".ns-popover").classList.toggle("is-open"); pop.setAttribute("aria-expanded", o); return; }
    const openModal = t.closest("[data-open-modal]");
    if (openModal) { NS.demoModal(); return; }
    const toastBtn = t.closest("[data-toast]");
    if (toastBtn) { NS.toast(toastBtn.dataset.toast, "Triggered from a live example.", toastBtn.dataset.kind || "info"); return; }
    const page = t.closest(".ns-pagination .ns-page");
    if (page && page.closest(".stage") && !page.disabled && /^\d+$/.test(page.textContent)) { page.parentElement.querySelectorAll(".ns-page").forEach((p) => p.removeAttribute("aria-current")); page.setAttribute("aria-current", "page"); return; }
    const day = t.closest(".ns-cal__day");
    if (day && !day.classList.contains("is-muted")) { day.closest(".ns-cal").querySelectorAll(".is-selected").forEach((d) => d.classList.remove("is-selected")); day.classList.add("is-selected"); return; }
    const sortTh = t.closest("th[data-sort]");
    if (sortTh) { NS.sortTable(sortTh); return; }
    if (!t.closest("[data-dd]")) document.querySelectorAll("[data-dd].is-open").forEach((d) => NS.closeLayer(d));
    if (!t.closest(".ns-popover")) document.querySelectorAll(".ns-popover.is-open").forEach((p) => NS.closeLayer(p));
    if (!t.closest(".ns-combobox")) document.querySelectorAll(".ns-combobox.is-open[data-live]").forEach((c) => NS.comboOpen(c, false));
  });

  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.matches("input[data-pg]")) { const pg = NS.playgrounds[t.dataset.pg]; pg.state[t.dataset.k] = t.type === "checkbox" ? t.checked : t.value; NS.refreshPlayground(t.dataset.pg); }
    if (t.matches(".ns-slider")) { const p = ((t.value - t.min) / (t.max - t.min)) * 100; t.style.setProperty("--_pct", p + "%"); const out = t.parentElement.querySelector("output"); if (out) out.textContent = t.value; }
    if (t.matches("[data-row-select]")) { t.closest("tr").classList.toggle("is-selected", t.checked); NS.updateBatch(t.closest(".ns-table-wrap")); }
    if (t.matches("[data-select-all]")) { const wrap = t.closest(".ns-table-wrap"); wrap.querySelectorAll("[data-row-select]").forEach((c) => { c.checked = t.checked; c.closest("tr").classList.toggle("is-selected", t.checked); }); NS.updateBatch(wrap); }
  });

  NS.updateBatch = function (wrap) {
    const bar = wrap.querySelector(".ns-table-bar"); if (!bar) return;
    const n = wrap.querySelectorAll("[data-row-select]:checked").length;
    bar.classList.toggle("is-batch", n > 0);
    const lbl = bar.querySelector("[data-batch-label]"); if (lbl) lbl.textContent = n ? `${n} selected` : lbl.dataset.default;
  };

  NS.sortTable = function (th) {
    const table = th.closest("table"); const idx = [...th.parentElement.children].indexOf(th);
    const dir = th.dataset.dir === "asc" ? "desc" : "asc";
    table.querySelectorAll("th").forEach((x) => { x.classList.remove("is-sorted"); x.removeAttribute("aria-sort"); const s = x.querySelector(".ns-sort"); if (s) s.textContent = "↕"; });
    th.dataset.dir = dir; th.classList.add("is-sorted"); th.setAttribute("aria-sort", dir === "asc" ? "ascending" : "descending");
    th.querySelector(".ns-sort").textContent = dir === "asc" ? "↑" : "↓";
    const rows = [...table.tBodies[0].rows];
    const val = (r) => { const t = r.cells[idx].textContent.trim(); const n = parseFloat(t.replace(/[$,%]/g, "")); return isNaN(n) ? t.toLowerCase() : n; };
    rows.sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * (dir === "asc" ? 1 : -1));
    rows.forEach((r) => table.tBodies[0].appendChild(r));
  };

  NS.demoModal = function () {
    const prev = document.activeElement;
    const bd = document.createElement("div");
    bd.className = "ns ns-modal-backdrop";
    bd.innerHTML = `<div class="ns-modal" role="dialog" aria-modal="true" aria-labelledby="dm-t"><div class="ns-modal__head"><div><p class="ns-modal__label">Account access</p><h2 class="ns-modal__title" id="dm-t">Revoke API credentials?</h2></div><button class="icon-btn" aria-label="Close">${NS.icon.close}</button></div><div class="ns-modal__body">Revoking credentials for <strong>Acme Corp</strong> will stop 14 active integrations immediately. This cannot be undone.</div><div class="ns-modal__foot"><button class="ns-btn ns-btn--tertiary" data-close>Cancel</button><button class="ns-btn ns-btn--danger" data-close>Revoke credentials</button></div></div>`;
    const close = () => { bd.remove(); document.body.style.overflow = ""; prev && prev.focus(); };
    bd.addEventListener("click", (e) => { if (e.target === bd || e.target.closest("[data-close], .icon-btn")) close(); });
    bd.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") { const f = [...bd.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]; const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
    document.body.appendChild(bd); document.body.style.overflow = "hidden";
    bd.querySelector("[data-close]").focus();
  };


  /* ---------- layers: dropdown, popover (Radix behavior) ---------- */
  NS.closeLayer = function (layer, refocus) {
    layer.classList.remove("is-open");
    const trig = layer.querySelector(".ns-dd__trigger, [data-popover]");
    if (trig) { trig.setAttribute("aria-expanded", "false"); if (refocus) trig.focus(); }
  };
  document.addEventListener("keydown", (e) => {
    const t = e.target; if (!t.closest) return;
    if (e.key === "Escape") {
      const layer = t.closest("[data-dd].is-open, .ns-popover.is-open") || document.querySelector("[data-dd].is-open, .ns-popover.is-open");
      if (layer) { e.preventDefault(); NS.closeLayer(layer, true); return; }
    }
    const dd = t.closest("[data-dd]"); if (!dd) return;
    const items = [...dd.querySelectorAll(".ns-dd__item:not([disabled])")];
    if (t.matches(".ns-dd__trigger") && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault(); dd.classList.add("is-open"); t.setAttribute("aria-expanded", "true");
      const sel = items.find((i) => i.getAttribute("aria-selected") === "true");
      (sel || (e.key === "ArrowUp" ? items[items.length - 1] : items[0]))?.focus();
    } else if (t.matches(".ns-dd__item")) {
      const i = items.indexOf(t); let j = null;
      if (e.key === "ArrowDown") j = Math.min(i + 1, items.length - 1);
      else if (e.key === "ArrowUp") j = Math.max(i - 1, 0);
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = items.length - 1;
      else if (e.key === "Tab") NS.closeLayer(dd);
      if (j !== null) { e.preventDefault(); items[j].focus(); }
    }
  });

  /* ---------- listbox engine: combobox and command palette (cmdk behavior) ----------
     Typing filters options and marks the match, arrows move the active option, Enter picks it.
     The active option is announced through aria-activedescendant, so focus stays in the input. */
  let lbId = 0;
  const optText = (o) => (o.dataset.label || (o.dataset.label = (o.querySelector("span") || o).textContent.trim()));
  const visible = (list) => [...list.querySelectorAll("[role=option]")].filter((o) => !o.hidden);
  const setActive = (input, list, opt) => {
    list.querySelectorAll("[role=option].is-active").forEach((o) => o.classList.remove("is-active"));
    if (!opt) { input.removeAttribute("aria-activedescendant"); return; }
    if (!opt.id) opt.id = "ns-opt-" + ++lbId;
    opt.classList.add("is-active"); input.setAttribute("aria-activedescendant", opt.id);
    if (list.closest(".ns-cmdk")) list.querySelectorAll("[role=option]").forEach((o) => o.setAttribute("aria-selected", String(o === opt)));
    opt.scrollIntoView({ block: "nearest" });
  };
  const highlight = (o, q) => {
    const label = optText(o), host = o.querySelector("span") || o, i = q ? label.toLowerCase().indexOf(q) : -1;
    host.innerHTML = i < 0 ? NS.esc(label) : NS.esc(label.slice(0, i)) + "<mark>" + NS.esc(label.slice(i, i + q.length)) + "</mark>" + NS.esc(label.slice(i + q.length));
  };
  NS.filterList = function (input) {
    const box = input.closest(".ns-combobox, .ns-cmdk"); const list = box.querySelector("[role=listbox]"); if (!list) return;
    const q = input.value.trim().toLowerCase();
    const opts = [...list.querySelectorAll("[role=option]")];
    opts.forEach((o) => { o.hidden = !!q && !optText(o).toLowerCase().includes(q); highlight(o, q); });
    list.querySelectorAll(".ns-cmdk__group").forEach((g) => {
      let n = g.nextElementSibling, any = false;
      while (n && !n.matches(".ns-cmdk__group")) { if (n.matches("[role=option]") && !n.hidden) any = true; n = n.nextElementSibling; }
      g.hidden = !any;
    });
    const shown = visible(list);
    let empty = list.querySelector(".ns-list-empty");
    if (!shown.length && !empty) { empty = document.createElement("p"); empty.className = "ns-helper ns-list-empty"; list.prepend(empty); }
    if (empty) { empty.hidden = !!shown.length; empty.textContent = `No results for "${input.value.trim()}"`; }
    const count = box.querySelector(".ns-combobox__count"); if (count) count.textContent = `${shown.length} of ${opts.length} match`;
    if (box.matches(".ns-cmdk")) setActive(input, list, shown[0]);
    else setActive(input, list, shown.includes(list.querySelector(".is-active")) ? list.querySelector(".is-active") : shown[0]);
  };
  NS.comboOpen = function (box, open) {
    box.classList.toggle("is-open", open);
    const input = box.querySelector("input"); input.setAttribute("aria-expanded", String(open));
    if (open) NS.filterList(input); else setActive(input, box.querySelector("[role=listbox]") || box, null);
  };
  const comboSync = (box) => {
    const picked = [...box.querySelectorAll(".ns-combobox__control .ns-tag")].map((g) => g.dataset.value || g.firstChild.textContent.trim());
    box.querySelectorAll("[role=option]").forEach((o) => o.setAttribute("aria-selected", String(picked.includes(optText(o)))));
  };
  NS.comboRemove = function (tag) { const box = tag.closest(".ns-combobox"); const input = box.querySelector("input"); tag.remove(); comboSync(box); input.focus(); };
  const comboToggle = (box, opt) => {
    const label = optText(opt), ctrl = box.querySelector(".ns-combobox__control"), input = ctrl.querySelector("input");
    const existing = [...ctrl.querySelectorAll(".ns-tag")].find((g) => (g.dataset.value || g.firstChild.textContent.trim()) === label);
    if (existing) existing.remove();
    else input.insertAdjacentHTML("beforebegin", `<span class="ns-tag ns-tag--sm" data-value="${NS.esc(label)}">${NS.esc(label)} <button type="button" aria-label="Remove ${NS.esc(label)}">×</button></span>`);
    comboSync(box);
  };
  const pick = (box, opt) => {
    if (!opt) return;
    if (box.matches(".ns-combobox")) { comboToggle(box, opt); return; }
    NS.toast("Opened " + optText(opt), "Command palette demo", "success");
  };
  document.addEventListener("focusin", (e) => {
    const box = e.target.closest && e.target.closest(".ns-combobox");
    if (box && e.target.matches("input")) { box.dataset.live = ""; comboSync(box); NS.comboOpen(box, true); }
  });
  document.addEventListener("input", (e) => {
    const t = e.target; if (!t.closest) return;
    const box = t.closest(".ns-combobox, .ns-cmdk"); if (!box || !t.matches("input")) return;
    if (box.matches(".ns-combobox") && !box.classList.contains("is-open")) NS.comboOpen(box, true); else NS.filterList(t);
  });
  document.addEventListener("keydown", (e) => {
    const t = e.target; if (!t.closest || !t.matches("input")) return;
    const box = t.closest(".ns-combobox, .ns-cmdk"); if (!box) return;
    const list = box.querySelector("[role=listbox]");
    if (box.matches(".ns-combobox") && e.key === "Backspace" && !t.value) { const tags = box.querySelectorAll(".ns-combobox__control .ns-tag"); if (tags.length) { e.preventDefault(); NS.comboRemove(tags[tags.length - 1]); } return; }
    if (e.key === "Escape") {
      if (box.matches(".ns-combobox") && box.classList.contains("is-open")) { e.preventDefault(); NS.comboOpen(box, false); }
      else if (t.value) { e.preventDefault(); t.value = ""; NS.filterList(t); }
      return;
    }
    if (!list) return;
    if (box.matches(".ns-combobox") && !box.classList.contains("is-open") && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); NS.comboOpen(box, true); return; }
    const shown = visible(list), cur = shown.indexOf(list.querySelector(".is-active"));
    let j = null;
    if (e.key === "ArrowDown") j = Math.min(cur + 1, shown.length - 1);
    else if (e.key === "ArrowUp") j = Math.max(cur - 1, 0);
    else if (e.key === "Home" && box.matches(".ns-cmdk")) j = 0;
    else if (e.key === "End" && box.matches(".ns-cmdk")) j = shown.length - 1;
    else if (e.key === "Enter") { e.preventDefault(); pick(box, shown[cur]); return; }
    else return;
    e.preventDefault(); if (shown[j]) setActive(t, list, shown[j]);
  });
  document.addEventListener("mousedown", (e) => {
    const opt = e.target.closest && e.target.closest(".ns-combobox [role=option], .ns-cmdk [role=option]");
    if (!opt) return;
    e.preventDefault();
    const box = opt.closest(".ns-combobox, .ns-cmdk"); const input = box.querySelector("input");
    if (input) setActive(input, box.querySelector("[role=listbox]"), opt);
    pick(box, opt);
  });
  NS.initListboxes = (root) => root.querySelectorAll(".ns-cmdk input, .ns-combobox.is-open input").forEach((i) => NS.filterList(i));

  /* Read a computed token value */
  NS.tokenValue = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* WCAG contrast */
  NS.toRgb = function (c) {
    const el = document.createElement("i"); el.style.color = c; document.body.appendChild(el);
    const m = getComputedStyle(el).color.match(/[\d.]+/g).map(Number); el.remove(); return m.slice(0, 3);
  };
  NS.contrast = function (a, b) {
    const L = (rgb) => { const [r, g, bb] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * bb; };
    const l1 = L(NS.toRgb(a)), l2 = L(NS.toRgb(b));
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
})();
