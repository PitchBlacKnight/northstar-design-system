/* Injected by tools/behavior-check.mjs. Drives the live behaviors with synthetic events and records
   pass or fail per check. Docs mode tests components (ui.js); app mode tests the React dashboards.
   Writes <script type="application/json" id="ns-behavior-result">. */
(async () => {
  const W = (ms) => new Promise((r) => setTimeout(r, ms));
  await new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)));
  await W(800);
  const results = [];
  const check = async (name, fn) => { try { const v = await fn(); results.push({ name, ok: v === true, detail: v === true ? "" : String(v) }); } catch (e) { results.push({ name, ok: false, detail: String(e).slice(0, 160) }); } };
  const key = (el, k, o = {}) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...o }));
  const type = (el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); };
  const go = async (hash, ms = 600) => { location.hash = hash; await W(ms); };
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const expect = (cond, msg) => (cond ? true : msg);

  if (window.__behaviorMode === "app") {
    const views = ["finance", "commerce", "observe", "crm", "projects", "deployments", "support", "people"];
    for (const v of views) {
      await check(`app ${v}: renders, row opens sheet, action confirms with toast`, async () => {
        await go(v, 700);
        if (!$("main h1")) return "no heading";
        if (document.documentElement.scrollWidth - innerWidth > 1) return "page scrolls sideways";
        const rows = $$("main tbody tr[tabindex]"); if (!rows.length) return "no table row";
        const isAction = (b) => { const t = b.textContent.trim(); return t.length > 2 && t !== "Close" && t !== "Cancel"; };
        let act = null;
        for (const row of rows.slice(0, 6)) { /* some rows, such as a build in progress, have no action by design */
          row.click(); await W(400);
          const sheet = $("[data-slot=sheet-content]"); if (!sheet) return "row did not open a sheet";
          act = $$("button", sheet).find(isAction); if (act) break;
          key(document, "Escape"); await W(300);
        }
        if (!act) return "no row in the first six has an action";
        act.click(); await W(400);
        const dlg = $("[data-slot=dialog-content]"); if (!dlg) return "action did not open a dialog";
        const confirm = $$("[data-slot=dialog-footer] button", dlg).pop(); /* footer: Cancel, then the confirm */
        if (!confirm) return "dialog has no confirm button";
        confirm.click(); await W(500);
        const ok = !!$("[data-sonner-toast]");
        key(document, "Escape"); await W(300);
        return expect(ok, "confirm did not show a toast");
      });
    }
    await check("app: period control changes the data", async () => {
      await go("finance", 700);
      const before = $("main section .tnum")?.textContent;
      const seg = $$("main [aria-label=Period] button"); seg[seg.length - 1].click(); await W(800);
      return expect($("main section .tnum")?.textContent !== before, "figure did not change");
    });
    await check("app: filter narrows the table", async () => {
      await go("finance", 700);
      const n = $$("main tbody tr").length; const inp = $("main input[placeholder^=Filter]");
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set; setter.call(inp, "zzzz"); inp.dispatchEvent(new Event("input", { bubbles: true })); await W(300);
      const empty = $$("main tbody tr").length === 1 && /No rows match/.test($("main tbody").textContent);
      setter.call(inp, ""); inp.dispatchEvent(new Event("input", { bubbles: true }));
      return expect(n > 1 && empty, "filter did not narrow");
    });
    await check("app: Cmd K opens the palette and jumps", async () => {
      key(document, "k", { metaKey: true }); await W(400);
      const item = $$("[cmdk-item]").find((i) => /Inbox/.test(i.textContent)); if (!item) return "palette did not open";
      item.click(); await W(500);
      return expect(location.hash === "#support", "did not jump, hash " + location.hash);
    });
    await check("app: theme and density toggles", async () => {
      $("button[aria-label='Light theme']").click(); $("button[aria-label='Compact density']").click(); await W(200);
      const ok = document.documentElement.dataset.theme === "light" && document.documentElement.dataset.density === "compact";
      $("button[aria-label='Dark theme']").click(); $("button[aria-label='Comfortable density']").click();
      return expect(ok, "toggles did not set data-theme and data-density");
    });
  } else {
    await check("combobox: filter, Enter adds tag, Backspace removes, Escape closes", async () => {
      await go("#/components/combobox");
      const box = $("[data-canvas] .ns-combobox"), inp = $("input", box);
      inp.focus(); type(inp, "rep"); await W(50);
      const vis = $$("[role=option]", box).filter((o) => !o.hidden).length;
      if (vis !== 1) return "expected 1 match, got " + vis;
      if (!inp.getAttribute("aria-activedescendant")) return "no aria-activedescendant";
      key(inp, "Enter");
      const tags = () => $$(".ns-combobox__control .ns-tag", box).length, n = tags();
      type(inp, ""); key(inp, "Backspace");
      if (tags() !== n - 1) return "Backspace did not remove a tag";
      key(inp, "Escape");
      return expect(!box.classList.contains("is-open") && inp.getAttribute("aria-expanded") === "false", "Escape did not close");
    });
    await check("command palette: filter, groups, arrows, empty state", async () => {
      await go("#/components/command-palette");
      const c = $("[data-canvas] .ns-cmdk"), inp = $("input", c);
      type(inp, "ex"); await W(50);
      const shown = $$("[role=option]", c).filter((o) => !o.hidden).length;
      if (shown !== 2) return "expected 2 matches, got " + shown;
      if (!$("mark", c)) return "match not highlighted";
      const first = inp.getAttribute("aria-activedescendant"); key(inp, "ArrowDown");
      if (inp.getAttribute("aria-activedescendant") === first) return "ArrowDown did not move";
      type(inp, "zzz"); await W(50);
      return expect($(".ns-list-empty", c) && !$(".ns-list-empty", c).hidden, "no empty state");
    });
    await check("dropdown: arrow opens, Escape closes and returns focus", async () => {
      await go("#/components/select");
      const dd = $("[data-dd]"); if (!dd) return "no live dropdown";
      const tr = $(".ns-dd__trigger", dd); tr.focus(); key(tr, "ArrowDown");
      if (!dd.classList.contains("is-open") || !document.activeElement.matches(".ns-dd__item")) return "did not open to an item";
      key(document.activeElement, "Escape");
      return expect(!dd.classList.contains("is-open") && document.activeElement === tr && tr.getAttribute("aria-expanded") === "false", "Escape did not close and refocus");
    });
    await check("toast: three at most, newest on top, errors use role=alert", async () => {
      document.querySelectorAll(".ns-toast-stack").forEach((s) => s.remove());
      for (let i = 0; i < 4; i++) NS.toast("T" + i, "", "info"); NS.toast("Err", "", "error");
      const s = $(".ns-toast-stack");
      const ok = s.children.length === 3 && s.firstElementChild.getAttribute("role") === "alert";
      s.remove();
      return expect(ok, `stack had ${s.children.length}, top role ${s.firstElementChild?.getAttribute("role")}`);
    });
    await check("toast: pauses while hovered", async () => {
      document.querySelectorAll(".ns-toast-stack").forEach((s) => s.remove());
      NS.toast("Hold", "", "info", { duration: 300 }); const s = $(".ns-toast-stack");
      s.dispatchEvent(new PointerEvent("pointerenter")); await W(700);
      const kept = s.children.length === 1; s.dispatchEvent(new PointerEvent("pointerleave")); await W(900);
      return expect(kept && s.children.length === 0, "did not pause and then clear");
    });
    await check("modal: focus moves in, Tab wraps, Escape closes and restores focus", async () => {
      const opener = document.createElement("button"); opener.textContent = "opener"; document.body.appendChild(opener); opener.focus();
      NS.demoModal(); await W(50);
      const bd = $(".ns-modal-backdrop"); if (!bd || !bd.contains(document.activeElement)) return "focus not inside";
      const f = $$("button", bd); f[f.length - 1].focus(); key(document.activeElement, "Tab");
      if (document.activeElement !== f[0]) return "Tab did not wrap";
      key(document.activeElement, "Escape"); await W(50);
      const ok = !$(".ns-modal-backdrop") && document.activeElement === opener; opener.remove();
      return expect(ok, "Escape did not close or restore focus");
    });
    await check("tabs: arrow keys move focus", async () => {
      await go("#/components/tabs");
      const t = $("[data-canvas] [role=tab]"); t.focus(); key(t, "ArrowRight");
      return expect(document.activeElement !== t && document.activeElement.matches("[role=tab]"), "ArrowRight did not move");
    });
    await check("data table: sort and select all", async () => {
      await go("#/components/data-table");
      const th = $("[data-canvas] th[data-sort]"); th.click();
      if (!th.getAttribute("aria-sort")) return "no aria-sort";
      const all = $("[data-canvas] [data-select-all]"); if (!all) return true;
      all.checked = true; all.dispatchEvent(new Event("input", { bubbles: true }));
      return expect($$("[data-canvas] [data-row-select]").every((c) => c.checked), "select all did not check rows");
    });
    await check("folded routes redirect to the parent page", async () => {
      const pairs = Object.entries(NS.MERGED || {});
      for (const [child, parent] of pairs) { await go("#/components/" + child, 300); const want = NS.componentById(parent).name; if (!document.title.startsWith(want)) return `${child} shows "${document.title}"`; }
      return true;
    });
  }
  const o = document.createElement("script"); o.type = "application/json"; o.id = "ns-behavior-result";
  o.textContent = JSON.stringify({ mode: window.__behaviorMode || "docs", results });
  document.body.appendChild(o);
})();
