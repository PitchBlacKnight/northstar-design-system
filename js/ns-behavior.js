/* NorthStar behavior script, for pages built with NorthStar markup outside the docs site.
   Load it once, after the two stylesheets:
     <script src="https://mikelrosenthal.com/northstar/js/ns-behavior.js" defer></script>
   It wires the documented markup and data-* hooks with keyboard and ARIA behavior. It does not change how
   anything looks: every visual state is a class or attribute that components.css already styles.
   The docs site runs its own copy of these behaviors in js/ui.js; do not load this file there.

   What it handles
   - Tabs: [role=tablist] > [role=tab] with aria-controls. Click or arrows select; panels toggle hidden.
   - Menus: [role=menu] arrows, Home, End. Radio groups (segmented control): [role=radiogroup] > [role=radio].
   - Tree view: [role=tree] arrows, Home, End, Enter and click expand, collapse and select.
   - Dropdown: [data-dd] with .ns-dd__trigger and .ns-dd__item. Popover: .ns-popover with a [data-popover] trigger.
   - Modal: a trigger with data-open-modal="ID" opens the .ns-modal-backdrop (or dialog element) with that id.
     Focus moves in and is trapped; Escape, a click on the backdrop or any [data-close] closes it and focus returns.
   - Dismiss: .ns-alert__close, .ns-notice__close and [data-dismiss] remove their alert, notice or tag.
   - Table: [data-select-all], [data-row-select] (rows get is-selected; the bar gets is-batch and its
     [data-batch-label] shows the count), th[data-sort] sorts the body and sets aria-sort.
   - Pagination: a numbered .ns-page gets aria-current. Stepper: .ns-stepper buttons step the number input.
   - Slider: .ns-slider keeps its fill (--_pct) and output in sync. Textarea: a helper reading "0 / 280" counts.
   - Combobox (.ns-combobox) and command palette (.ns-cmdk): typing filters, arrows move, Enter picks.
   - Toasts: NorthStar.toast(title, body, kind) or a [data-toast] button (data-toast-body, data-toast-kind).

   Events: it dispatches ns:tab, ns:select, ns:sort, ns:page, ns:pick, ns:modal-open and ns:modal-close
   (bubbling CustomEvents with a detail object) so an app can respond. */
(function () {
  if (window.NorthStar && window.NorthStar.behavior) return;
  const doc = document;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* ---------- tabs ---------- */
  const selectTab = (tab, focus) => {
    const list = tab.closest("[role=tablist]"); if (!list) return;
    const tabs = [...list.querySelectorAll("[role=tab]")];
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
      const id = t.getAttribute("aria-controls"), panel = id && doc.getElementById(id);
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    emit(tab, "ns:tab", { tab, index: tabs.indexOf(tab) });
  };

  /* ---------- tree ---------- */
  const treeSelect = (tree, row) => { tree.querySelectorAll("[role=treeitem]").forEach((x) => x.setAttribute("aria-selected", String(x === row))); emit(row, "ns:select", { item: row }); };
  const treeToggle = (row, open) => { row.setAttribute("aria-expanded", String(open)); const g = row.parentElement.querySelector(":scope > [role=group]"); if (g) g.hidden = !open; };

  /* ---------- layers: dropdown and popover ---------- */
  const closeLayer = (layer, refocus) => {
    layer.classList.remove("is-open");
    const trig = layer.querySelector(".ns-dd__trigger, [data-popover]");
    if (trig) { trig.setAttribute("aria-expanded", "false"); if (refocus) trig.focus(); }
  };

  /* ---------- modal ---------- */
  const openStack = [];
  const openModal = (target, opener) => {
    const layer = typeof target === "string" ? doc.getElementById(target) : target; if (!layer) return;
    const prev = opener || doc.activeElement;
    if (layer.tagName === "DIALOG") { if (!layer.open) layer.showModal(); } else layer.hidden = false;
    openStack.push({ layer, prev });
    doc.body.style.overflow = "hidden";
    const first = layer.querySelector("[autofocus]") || layer.querySelector(FOCUSABLE);
    if (first) first.focus();
    emit(layer, "ns:modal-open", { modal: layer });
  };
  const closeModal = (layer) => {
    const i = openStack.findIndex((m) => m.layer === layer); if (i < 0) return;
    const { prev } = openStack.splice(i, 1)[0];
    if (layer.tagName === "DIALOG") layer.close(); else layer.hidden = true;
    if (!openStack.length) doc.body.style.overflow = "";
    if (prev && prev.focus) prev.focus();
    emit(layer, "ns:modal-close", { modal: layer });
  };

  /* ---------- table ---------- */
  const updateBatch = (wrap) => {
    if (!wrap) return;
    const boxes = [...wrap.querySelectorAll("[data-row-select]")], n = boxes.filter((c) => c.checked).length;
    const all = wrap.querySelector("[data-select-all]");
    if (all) { all.checked = n > 0 && n === boxes.length; all.indeterminate = n > 0 && n < boxes.length; }
    const bar = wrap.querySelector(".ns-table-bar"); if (!bar) return;
    bar.classList.toggle("is-batch", n > 0);
    const lbl = bar.querySelector("[data-batch-label]");
    if (lbl) { if (lbl.dataset.default === undefined) lbl.dataset.default = lbl.textContent; lbl.textContent = n ? `${n} selected` : lbl.dataset.default; }
    emit(wrap, "ns:select", { count: n });
  };
  const sortTable = (th) => {
    const table = th.closest("table"); if (!table || !table.tBodies[0]) return;
    const idx = [...th.parentElement.children].indexOf(th);
    const dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
    th.parentElement.querySelectorAll("th").forEach((x) => { if (x !== th) x.removeAttribute("aria-sort"); x.classList.remove("is-sorted"); const s = x.querySelector(".ns-sort"); if (s && x.hasAttribute("data-sort")) s.textContent = "↕"; });
    th.setAttribute("aria-sort", dir); th.classList.add("is-sorted");
    const s = th.querySelector(".ns-sort"); if (s) s.textContent = dir === "ascending" ? "↑" : "↓";
    const val = (r) => { const c = r.cells[idx]; const t = (c ? c.dataset.value || c.textContent : "").trim(); const n = parseFloat(t.replace(/[$,%\s]/g, "")); return isNaN(n) ? t.toLowerCase() : n; };
    const rows = [...table.tBodies[0].rows];
    rows.sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * (dir === "ascending" ? 1 : -1));
    rows.forEach((r) => table.tBodies[0].appendChild(r));
    emit(th, "ns:sort", { column: idx, direction: dir });
  };

  /* ---------- toast ---------- */
  const toast = (title, body = "", kind = "info", o = {}) => {
    let stack = doc.querySelector(".ns-toast-stack");
    if (!stack) {
      stack = doc.createElement("div"); stack.className = "ns-toast-stack"; stack.setAttribute("aria-label", "Notifications");
      const pause = (on) => () => stack.classList.toggle("is-paused", on);
      stack.addEventListener("pointerenter", pause(true)); stack.addEventListener("pointerleave", pause(false));
      stack.addEventListener("focusin", pause(true)); stack.addEventListener("focusout", (e) => { if (!stack.contains(e.relatedTarget)) stack.classList.remove("is-paused"); });
      doc.body.appendChild(stack);
    }
    const k = ["success", "warning", "error", "info"].includes(kind) ? kind : "info";
    const el = doc.createElement("div");
    el.className = `ns-notice ns-notice--toast ns-notice--${k}`;
    el.setAttribute("role", k === "error" ? "alert" : "status");
    el.innerHTML = `<span class="ns-notice__icon" aria-hidden="true">${{ success: "✓", warning: "!", error: "×", info: "i" }[k]}</span><div><p class="ns-notice__title">${esc(title)}</p>${body ? `<p class="ns-notice__body">${esc(body)}</p>` : ""}</div><button class="ns-notice__close" type="button" aria-label="Dismiss notification">×</button>`;
    const close = () => { if (el.classList.contains("is-leaving")) return; el.classList.add("is-leaving"); const done = () => el.remove(); if (reduced()) done(); else { el.addEventListener("animationend", done, { once: true }); setTimeout(done, 400); } };
    el.querySelector("button").addEventListener("click", close);
    stack.prepend(el);
    [...stack.children].slice(3).forEach((x) => x.remove());
    if (k !== "error") {
      let left = o.duration || 4000, last = Date.now();
      const tick = setInterval(() => { const now = Date.now(); if (!stack.classList.contains("is-paused")) left -= now - last; last = now; if (left <= 0 || !el.isConnected) { clearInterval(tick); close(); } }, 100);
    }
    return el;
  };

  /* ---------- listbox engine: combobox and command palette ---------- */
  let lbId = 0;
  const optText = (o) => (o.dataset.label || (o.dataset.label = (o.querySelector("span") || o).textContent.trim()));
  const shownOpts = (list) => [...list.querySelectorAll("[role=option]")].filter((o) => !o.hidden);
  const setActive = (input, list, opt) => {
    list.querySelectorAll("[role=option].is-active").forEach((o) => o.classList.remove("is-active"));
    if (!opt) { input.removeAttribute("aria-activedescendant"); return; }
    if (!opt.id) opt.id = "ns-opt-" + ++lbId;
    opt.classList.add("is-active"); input.setAttribute("aria-activedescendant", opt.id);
    if (list.closest(".ns-cmdk")) list.querySelectorAll("[role=option]").forEach((o) => o.setAttribute("aria-selected", String(o === opt)));
    opt.scrollIntoView({ block: "nearest" });
  };
  const mark = (o, q) => {
    const label = optText(o), host = o.querySelector("span") || o, i = q ? label.toLowerCase().indexOf(q) : -1;
    host.innerHTML = i < 0 ? esc(label) : esc(label.slice(0, i)) + "<mark>" + esc(label.slice(i, i + q.length)) + "</mark>" + esc(label.slice(i + q.length));
  };
  const filterList = (input) => {
    const box = input.closest(".ns-combobox, .ns-cmdk"), list = box && box.querySelector("[role=listbox]"); if (!list) return;
    const q = input.value.trim().toLowerCase(), opts = [...list.querySelectorAll("[role=option]")];
    opts.forEach((o) => { o.hidden = !!q && !optText(o).toLowerCase().includes(q); mark(o, q); });
    list.querySelectorAll(".ns-cmdk__group").forEach((g) => { let n = g.nextElementSibling, any = false; while (n && !n.matches(".ns-cmdk__group")) { if (n.matches("[role=option]") && !n.hidden) any = true; n = n.nextElementSibling; } g.hidden = !any; });
    const shown = shownOpts(list);
    let empty = list.querySelector(".ns-list-empty");
    if (!shown.length && !empty) { empty = doc.createElement("p"); empty.className = "ns-helper ns-list-empty"; list.prepend(empty); }
    if (empty) { empty.hidden = !!shown.length; empty.textContent = `No results for "${input.value.trim()}"`; }
    const count = box.querySelector(".ns-combobox__count"); if (count) count.textContent = `${shown.length} of ${opts.length} match`;
    const cur = list.querySelector(".is-active");
    setActive(input, list, box.matches(".ns-cmdk") ? shown[0] : shown.includes(cur) ? cur : shown[0]);
  };
  const comboOpen = (box, open) => {
    box.classList.toggle("is-open", open);
    const input = box.querySelector("input"); if (!input) return;
    input.setAttribute("aria-expanded", String(open));
    if (open) filterList(input); else setActive(input, box.querySelector("[role=listbox]") || box, null);
  };
  const comboSync = (box) => {
    const picked = [...box.querySelectorAll(".ns-combobox__control .ns-tag")].map((g) => g.dataset.value || g.firstChild.textContent.trim());
    box.querySelectorAll("[role=option]").forEach((o) => o.setAttribute("aria-selected", String(picked.includes(optText(o)))));
  };
  const comboRemove = (tag) => { const box = tag.closest(".ns-combobox"), input = box.querySelector("input"); tag.remove(); comboSync(box); emit(box, "ns:pick", { value: tag.dataset.value || tag.firstChild.textContent.trim(), selected: false }); if (input) input.focus(); };
  const pick = (box, opt) => {
    if (!opt) return;
    const label = optText(opt);
    if (box.matches(".ns-combobox")) {
      const ctrl = box.querySelector(".ns-combobox__control"), input = ctrl && ctrl.querySelector("input"); if (!input) return;
      const existing = [...ctrl.querySelectorAll(".ns-tag")].find((g) => (g.dataset.value || g.firstChild.textContent.trim()) === label);
      if (existing) existing.remove();
      else input.insertAdjacentHTML("beforebegin", `<span class="ns-tag ns-tag--sm" data-value="${esc(label)}">${esc(label)} <button type="button" aria-label="Remove ${esc(label)}">×</button></span>`);
      comboSync(box);
      emit(box, "ns:pick", { value: label, selected: !existing });
    } else emit(box, "ns:pick", { value: label, option: opt });
  };

  /* ---------- events ---------- */
  doc.addEventListener("click", (e) => {
    const t = e.target; if (!t.closest) return;
    const tab = t.closest("[role=tablist] [role=tab]");
    if (tab && !tab.disabled) { selectTab(tab); return; }
    const row = t.closest("[role=tree] [role=treeitem]");
    if (row) { const tree = row.closest("[role=tree]"); treeSelect(tree, row); tree.querySelectorAll("[role=treeitem]").forEach((x) => (x.tabIndex = x === row ? 0 : -1)); if (row.hasAttribute("aria-expanded")) treeToggle(row, row.getAttribute("aria-expanded") !== "true"); return; }
    const radio = t.closest("[role=radiogroup] [role=radio]");
    if (radio && !radio.disabled) { radio.closest("[role=radiogroup]").querySelectorAll("[role=radio]").forEach((b) => { b.setAttribute("aria-checked", String(b === radio)); b.tabIndex = b === radio ? 0 : -1; }); emit(radio, "ns:select", { item: radio }); return; }
    const opener = t.closest("[data-open-modal]");
    if (opener) { e.preventDefault(); openModal(opener.getAttribute("data-open-modal"), opener); return; }
    const top = openStack[openStack.length - 1];
    if (top && (t === top.layer || t.closest("[data-close]"))) { if (top.layer.contains(t)) { closeModal(top.layer); return; } }
    const comboTag = t.closest(".ns-combobox .ns-combobox__control .ns-tag button");
    if (comboTag) { comboRemove(comboTag.closest(".ns-tag")); return; }
    const dismiss = t.closest(".ns-alert__close, .ns-notice__close, [data-dismiss]");
    if (dismiss && !dismiss.closest(".ns-toast-stack")) { const target = dismiss.closest(".ns-alert, .ns-notice, .ns-tag, [data-dismissible]"); if (target) { target.remove(); return; } }
    const toastBtn = t.closest("[data-toast]");
    if (toastBtn) { toast(toastBtn.dataset.toast, toastBtn.dataset.toastBody || "", toastBtn.dataset.toastKind || "info"); return; }
    const ddTrig = t.closest("[data-dd] .ns-dd__trigger");
    if (ddTrig) { const dd = ddTrig.closest("[data-dd]"); const o = dd.classList.toggle("is-open"); ddTrig.setAttribute("aria-expanded", String(o)); return; }
    const ddItem = t.closest("[data-dd] .ns-dd__item");
    if (ddItem) { const dd = ddItem.closest("[data-dd]"); dd.querySelectorAll(".ns-dd__item").forEach((i) => i.setAttribute("aria-selected", String(i === ddItem))); const trig = dd.querySelector(".ns-dd__trigger"); if (trig && trig.firstChild && trig.firstChild.nodeType === 3) trig.firstChild.textContent = ddItem.textContent.trim(); closeLayer(dd, true); emit(dd, "ns:select", { item: ddItem, value: ddItem.textContent.trim() }); return; }
    const pop = t.closest(".ns-popover [data-popover]");
    if (pop) { const o = pop.closest(".ns-popover").classList.toggle("is-open"); pop.setAttribute("aria-expanded", String(o)); return; }
    const sortTh = t.closest("th[data-sort]");
    if (sortTh) { sortTable(sortTh); return; }
    const page = t.closest(".ns-pagination .ns-page");
    if (page && !page.disabled && /^\d+$/.test(page.textContent.trim())) { page.parentElement.querySelectorAll(".ns-page").forEach((p) => p.removeAttribute("aria-current")); page.setAttribute("aria-current", "page"); emit(page, "ns:page", { page: +page.textContent.trim() }); return; }
    const step = t.closest(".ns-stepper button");
    if (step) { const input = step.closest(".ns-stepper").querySelector("input"); if (input) { const up = /increase/i.test(step.getAttribute("aria-label") || "") || step === step.parentElement.lastElementChild; up ? input.stepUp() : input.stepDown(); input.dispatchEvent(new Event("input", { bubbles: true })); input.dispatchEvent(new Event("change", { bubbles: true })); } return; }
    if (!t.closest("[data-dd]")) doc.querySelectorAll("[data-dd].is-open").forEach((d) => closeLayer(d));
    if (!t.closest(".ns-popover")) doc.querySelectorAll(".ns-popover.is-open").forEach((p) => closeLayer(p));
    if (!t.closest(".ns-combobox")) doc.querySelectorAll(".ns-combobox.is-open").forEach((c) => comboOpen(c, false));
  });

  doc.addEventListener("input", (e) => {
    const t = e.target; if (!t.matches) return;
    if (t.matches("[data-row-select]")) { const tr = t.closest("tr"); if (tr) tr.classList.toggle("is-selected", t.checked); updateBatch(t.closest(".ns-table-wrap")); }
    else if (t.matches("[data-select-all]")) { const wrap = t.closest(".ns-table-wrap"); if (!wrap) return; wrap.querySelectorAll("[data-row-select]").forEach((c) => { c.checked = t.checked; const tr = c.closest("tr"); if (tr) tr.classList.toggle("is-selected", t.checked); }); updateBatch(wrap); }
    else if (t.matches(".ns-slider")) { const p = ((t.value - t.min) / (t.max - t.min)) * 100; t.style.setProperty("--_pct", p + "%"); const out = t.parentElement.querySelector("output"); if (out) out.textContent = t.value; }
    else if (t.matches("textarea[maxlength]")) { const h = t.closest(".ns-field") && t.closest(".ns-field").querySelector(".ns-helper"); if (h && /^\d+ \/ \d+$/.test(h.textContent.trim())) h.textContent = `${t.value.length} / ${t.maxLength}`; }
    const box = t.closest && t.closest(".ns-combobox, .ns-cmdk");
    if (box && t.matches("input")) { if (box.matches(".ns-combobox") && !box.classList.contains("is-open")) comboOpen(box, true); else filterList(t); }
  });
  doc.addEventListener("focusin", (e) => {
    const box = e.target.closest && e.target.closest(".ns-combobox");
    if (box && e.target.matches("input")) { comboSync(box); comboOpen(box, true); }
  });

  doc.addEventListener("mousedown", (e) => {
    const opt = e.target.closest && e.target.closest(".ns-combobox [role=option], .ns-cmdk [role=option]"); if (!opt) return;
    e.preventDefault();
    const box = opt.closest(".ns-combobox, .ns-cmdk"), input = box.querySelector("input");
    if (input) setActive(input, box.querySelector("[role=listbox]"), opt);
    pick(box, opt);
  });

  doc.addEventListener("keydown", (e) => {
    const t = e.target; if (!t.closest) return;
    /* modal: Escape and focus trap */
    const top = openStack[openStack.length - 1];
    if (top) {
      if (e.key === "Escape" && top.layer.tagName !== "DIALOG") { e.preventDefault(); closeModal(top.layer); return; }
      if (e.key === "Tab") {
        const f = [...top.layer.querySelectorAll(FOCUSABLE)].filter((x) => x.offsetParent !== null || x === doc.activeElement);
        if (f.length) { const i = f.indexOf(doc.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
        return;
      }
    }
    /* listbox inputs */
    if (t.matches("input") && t.closest(".ns-combobox, .ns-cmdk")) {
      const box = t.closest(".ns-combobox, .ns-cmdk"), list = box.querySelector("[role=listbox]");
      if (box.matches(".ns-combobox") && e.key === "Backspace" && !t.value) { const tags = box.querySelectorAll(".ns-combobox__control .ns-tag"); if (tags.length) { e.preventDefault(); comboRemove(tags[tags.length - 1]); } return; }
      if (e.key === "Escape") { if (box.matches(".ns-combobox") && box.classList.contains("is-open")) { e.preventDefault(); comboOpen(box, false); } else if (t.value) { e.preventDefault(); t.value = ""; filterList(t); } return; }
      if (!list) return;
      if (box.matches(".ns-combobox") && !box.classList.contains("is-open") && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); comboOpen(box, true); return; }
      const shown = shownOpts(list), cur = shown.indexOf(list.querySelector(".is-active"));
      let j = null;
      if (e.key === "ArrowDown") j = Math.min(cur + 1, shown.length - 1);
      else if (e.key === "ArrowUp") j = Math.max(cur - 1, 0);
      else if (e.key === "Home" && box.matches(".ns-cmdk")) j = 0;
      else if (e.key === "End" && box.matches(".ns-cmdk")) j = shown.length - 1;
      else if (e.key === "Enter") { e.preventDefault(); pick(box, shown[cur]); return; }
      else return;
      e.preventDefault(); if (shown[j]) setActive(t, list, shown[j]);
      return;
    }
    /* dropdown and popover */
    if (e.key === "Escape") {
      const layer = t.closest("[data-dd].is-open, .ns-popover.is-open") || doc.querySelector("[data-dd].is-open, .ns-popover.is-open");
      if (layer) { e.preventDefault(); closeLayer(layer, true); return; }
    }
    const dd = t.closest("[data-dd]");
    if (dd) {
      const items = [...dd.querySelectorAll(".ns-dd__item:not([disabled])")];
      if (t.matches(".ns-dd__trigger") && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault(); dd.classList.add("is-open"); t.setAttribute("aria-expanded", "true");
        const sel = items.find((i) => i.getAttribute("aria-selected") === "true");
        const go = sel || (e.key === "ArrowUp" ? items[items.length - 1] : items[0]); if (go) go.focus();
        return;
      }
      if (t.matches(".ns-dd__item")) {
        const i = items.indexOf(t); let j = null;
        if (e.key === "ArrowDown") j = Math.min(i + 1, items.length - 1);
        else if (e.key === "ArrowUp") j = Math.max(i - 1, 0);
        else if (e.key === "Home") j = 0;
        else if (e.key === "End") j = items.length - 1;
        else if (e.key === "Tab") closeLayer(dd);
        if (j !== null) { e.preventDefault(); items[j].focus(); }
        return;
      }
    }
    /* tree */
    if (t.matches("[role=treeitem]")) {
      const tree = t.closest("[role=tree]"); if (!tree) return;
      const items = [...tree.querySelectorAll("[role=treeitem]")].filter((x) => !x.closest("[role=group][hidden]"));
      const i = items.indexOf(t), group = t.parentElement.querySelector(":scope > [role=group]");
      const expandable = t.hasAttribute("aria-expanded"), open = t.getAttribute("aria-expanded") === "true";
      let next = null;
      if (e.key === "ArrowDown") next = items[i + 1];
      else if (e.key === "ArrowUp") next = items[i - 1];
      else if (e.key === "Home") next = items[0];
      else if (e.key === "End") next = items[items.length - 1];
      else if (e.key === "ArrowRight") { if (expandable && !open) treeToggle(t, true); else if (expandable && open && group) next = group.querySelector("[role=treeitem]"); }
      else if (e.key === "ArrowLeft") { if (expandable && open) treeToggle(t, false); else { const pg = t.closest("[role=group]"); next = pg && pg.parentElement.querySelector(":scope > [role=treeitem]"); } }
      else if (e.key === "Enter" || e.key === " ") treeSelect(tree, t);
      else return;
      e.preventDefault();
      if (next) { tree.querySelectorAll("[role=treeitem]").forEach((x) => (x.tabIndex = -1)); next.tabIndex = 0; next.focus(); }
      return;
    }
    /* tabs, menus and radio groups: roving focus */
    const isTab = t.matches("[role=tab]"), isItem = t.matches("[role=menuitem]"), isRadio = t.matches("[role=radiogroup] [role=radio]");
    const group = isTab ? t.closest("[role=tablist]") : isItem ? t.closest("[role=menu]") : isRadio ? t.closest("[role=radiogroup]") : null;
    if (!group) {
      if (e.key === "Enter" || e.key === " ") { const ie = t.matches(".ns-inline-edit[role=button]") ? t : null; if (ie) { e.preventDefault(); ie.click(); } }
      return;
    }
    const sel = isTab ? "[role=tab]" : isItem ? "[role=menuitem]" : "[role=radio]";
    const items = [...group.querySelectorAll(sel)].filter((x) => !x.disabled && x.getAttribute("aria-disabled") !== "true");
    const horizontal = isTab || isRadio;
    const fwd = horizontal ? ["ArrowRight"] : ["ArrowDown"], back = horizontal ? ["ArrowLeft"] : ["ArrowUp"];
    if (isRadio) { fwd.push("ArrowDown"); back.push("ArrowUp"); }
    const i = items.indexOf(t);
    let j;
    if (fwd.includes(e.key)) j = (i + 1) % items.length;
    else if (back.includes(e.key)) j = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = items.length - 1;
    else return;
    e.preventDefault();
    if (isTab) selectTab(items[j], true);
    else if (isRadio) { items.forEach((b, k) => { b.setAttribute("aria-checked", String(k === j)); b.tabIndex = k === j ? 0 : -1; }); items[j].focus(); emit(items[j], "ns:select", { item: items[j] }); }
    else items[j].focus();
  });

  /* native dialog: Escape fires cancel; keep the focus return and event */
  doc.addEventListener("close", (e) => { const d = e.target; if (d.tagName === "DIALOG" && openStack.some((m) => m.layer === d)) { const i = openStack.findIndex((m) => m.layer === d); const { prev } = openStack.splice(i, 1)[0]; if (!openStack.length) doc.body.style.overflow = ""; if (prev && prev.focus) prev.focus(); emit(d, "ns:modal-close", { modal: d }); } }, true);

  /* ---------- initial state ---------- */
  const init = (root = doc) => {
    root.querySelectorAll("[role=tablist]").forEach((list) => { const cur = list.querySelector('[role=tab][aria-selected="true"]') || list.querySelector("[role=tab]"); if (cur) list.querySelectorAll("[role=tab]").forEach((t) => { t.tabIndex = t === cur ? 0 : -1; const id = t.getAttribute("aria-controls"), p = id && doc.getElementById(id); if (p) p.hidden = t !== cur; }); });
    root.querySelectorAll(".ns-table-wrap").forEach((w) => { if (w.querySelector("[data-row-select]")) updateBatch(w); });
    root.querySelectorAll(".ns-slider").forEach((s) => { const p = ((s.value - s.min) / (s.max - s.min)) * 100; s.style.setProperty("--_pct", p + "%"); });
    root.querySelectorAll(".ns-cmdk input").forEach((i) => filterList(i));
  };
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", () => init()); else init();

  window.NorthStar = Object.assign(window.NorthStar || {}, { behavior: true, init, toast, openModal, closeModal, sortTable, selectTab });
})();
