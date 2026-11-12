#!/usr/bin/env node
/* Behavior script check: proves js/ns-behavior.js works on the documented markup.
     node tools/behavior-script-check.mjs
   Builds a page from the markup in agent/components.json (plus the modal, tabs and table patterns the agent
   files describe), loads css/tokens.css, css/components.css and js/ns-behavior.js, runs every interaction in
   headless Chrome and fails on any broken behavior. Nothing is written to the repo. */
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, execFileSync } from "node:child_process";
import { createServer } from "node:http";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const fail = (m) => { console.error(m); process.exit(1); };
const findChrome = () => {
  if (process.env.CHROME && existsSync(process.env.CHROME)) return process.env.CHROME;
  const mac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(mac)) return mac;
  for (const n of ["google-chrome", "chromium", "chromium-browser"]) { try { return execFileSync("which", [n], { encoding: "utf8" }).trim(); } catch {} }
  return null;
};
const chrome = findChrome();
if (!chrome) fail("behavior script check skipped: no Chrome found (set CHROME=/path/to/chrome).");

const comps = Object.fromEntries(JSON.parse(readFileSync(join(ROOT, "agent/components.json"), "utf8")).components.map((c) => [c.id, c]));
const doc = (id, variant) => { const c = comps[id]; if (!c) fail(`no component ${id} in agent/components.json`); return variant === undefined ? c.html : c.variants[variant].html; };
const section = (name, html) => `<section data-test="${name}">${html}</section>`;

const fixture = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>ns-behavior check</title>
<link rel="stylesheet" href="/css/tokens.css"><link rel="stylesheet" href="/css/components.css"><script src="/js/ns-behavior.js" defer></script></head>
<body class="ns-body">
${section("tabs", `<div class="ns-tabs" role="tablist" aria-label="Sections"><button class="ns-tab" role="tab" id="t1" aria-controls="p1" aria-selected="true">One</button><button class="ns-tab" role="tab" id="t2" aria-controls="p2" aria-selected="false">Two</button><button class="ns-tab" role="tab" id="t3" aria-controls="p3" aria-selected="false">Three</button></div>
<div class="ns-card" role="tabpanel" id="p1" aria-labelledby="t1">Panel one</div><div class="ns-card" role="tabpanel" id="p2" aria-labelledby="t2" hidden>Panel two</div><div class="ns-split" role="tabpanel" id="p3" aria-labelledby="t3" hidden>Panel three</div>`)}
${section("segmented", doc("segmented-control"))}
${section("menu", doc("menu"))}
${section("tree", doc("tree-view"))}
${section("dropdown", doc("select", 3))}
${section("popover", doc("popover"))}
${section("modal", `<button class="ns-btn" id="open-m" data-open-modal="m1">Delete</button>
<div class="ns-modal-backdrop" id="m1" hidden><div class="ns-modal ns-modal--sm" role="dialog" aria-modal="true" aria-labelledby="m1-t"><div class="ns-modal__head"><div><h2 class="ns-modal__title" id="m1-t">Delete?</h2></div><button class="ns-btn ns-btn--ghost ns-btn--icon ns-btn--sm" id="m1-x" type="button" aria-label="Close" data-close>×</button></div><div class="ns-modal__body">Gone for good.</div><div class="ns-modal__foot"><button class="ns-btn ns-btn--tertiary" id="m1-cancel" type="button" data-close>Cancel</button><button class="ns-btn ns-btn--danger" id="m1-ok" type="button">Delete</button></div></div></div>`)}
${section("alert", `<div class="ns-alert" role="status"><div><p class="ns-alert__title">Saved</p></div><div class="ns-alert__end"><button class="ns-alert__close" aria-label="Dismiss">×</button></div></div>`)}
${section("table", `<div class="ns-table-wrap"><div class="ns-table-bar"><b data-batch-label data-default="Accounts">Accounts</b></div><table class="ns-table"><thead><tr><th><label class="ns-check"><input type="checkbox" data-select-all aria-label="Select all"></label></th><th data-sort>Name <span class="ns-sort">↕</span></th><th data-sort class="num">Revenue <span class="ns-sort">↕</span></th></tr></thead><tbody>
<tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select B"></label></td><td>Beta</td><td class="num">$5,200</td></tr>
<tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select A"></label></td><td>Acme</td><td class="num">$38,900</td></tr>
<tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Z"></label></td><td>Zeta</td><td class="num">$12,400</td></tr></tbody></table></div>`)}
${section("pagination", doc("pagination"))}
${section("stepper", doc("number-stepper"))}
${section("slider", doc("slider"))}
${section("textarea", `<div class="ns-field"><label class="ns-label" for="ta">Notes</label><textarea class="ns-textarea" id="ta" maxlength="280"></textarea><span class="ns-helper">0 / 280</span></div>`)}
${section("combobox", doc("combobox"))}
${section("cmdk", doc("command-palette"))}
${section("toast", `<button class="ns-btn" data-toast="Saved" data-toast-body="All changes saved" data-toast-kind="success">Save</button>`)}
<pre id="results"></pre>
<script>
window.addEventListener("load", () => setTimeout(async () => {
  const R = [], ok = (name, cond, info) => R.push([name, !!cond, info === undefined ? "" : String(info)]);
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sec = (n) => $('[data-test="' + n + '"]');
  const key = (el, k, o = {}) => el.dispatchEvent(new KeyboardEvent("keydown", Object.assign({ key: k, bubbles: true, cancelable: true }, o)));
  const click = (el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  const down = (el) => el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  const input = (el) => el.dispatchEvent(new Event("input", { bubbles: true }));
  const shown = (el) => el && getComputedStyle(el).display !== "none";
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  try {
    ok("script loaded", window.NorthStar && window.NorthStar.behavior);
    /* tabs */
    const tabs = $$('[data-test=tabs] [role=tab]');
    ok("tabs: init hides other panels", shown($("#p1")) && !shown($("#p2")) && !shown($("#p3")));
    click(tabs[1]);
    ok("tabs: click selects", tabs[1].getAttribute("aria-selected") === "true" && tabs[0].getAttribute("aria-selected") === "false");
    ok("tabs: click shows its panel and hides the rest", shown($("#p2")) && !shown($("#p1")));
    tabs[1].focus(); key(tabs[1], "ArrowRight");
    ok("tabs: ArrowRight moves and selects", document.activeElement === tabs[2] && tabs[2].getAttribute("aria-selected") === "true" && shown($("#p3")));
    key(tabs[2], "Home");
    ok("tabs: Home goes to first", tabs[0].getAttribute("aria-selected") === "true" && tabs[0].tabIndex === 0 && tabs[2].tabIndex === -1);
    /* segmented */
    const radios = $$('[data-test=segmented] [role=radio]'); radios[0].focus(); key(radios[0], "ArrowRight");
    ok("segmented: arrow moves selection", radios[1].getAttribute("aria-checked") === "true" && document.activeElement === radios[1]);
    click(radios[2]); ok("segmented: click selects", radios[2].getAttribute("aria-checked") === "true" && radios[1].getAttribute("aria-checked") === "false");
    /* menu */
    const items = $$('[data-test=menu] [role=menu]')[0].querySelectorAll("[role=menuitem]"); items[0].focus(); key(items[0], "ArrowDown");
    ok("menu: ArrowDown moves focus", document.activeElement === items[1]);
    /* tree */
    const tree = $('[data-test=tree] [role=tree]'); const rows = $$("[role=treeitem]", tree);
    const parent = rows.find((r) => r.getAttribute("aria-expanded") === "true");
    parent.focus(); key(parent, "ArrowLeft");
    ok("tree: ArrowLeft collapses", parent.getAttribute("aria-expanded") === "false");
    key(parent, "ArrowRight"); ok("tree: ArrowRight expands", parent.getAttribute("aria-expanded") === "true");
    click(rows[1]); ok("tree: click selects", rows[1].getAttribute("aria-selected") === "true");
    /* dropdown */
    const dd = $('[data-test=dropdown] [data-dd]'), trig = $(".ns-dd__trigger", dd);
    dd.classList.remove("is-open"); $(".ns-dd__menu", dd).classList.remove("is-static");
    click(trig); ok("dropdown: trigger opens", dd.classList.contains("is-open") && trig.getAttribute("aria-expanded") === "true");
    const ddItems = $$(".ns-dd__item", dd); click(ddItems[1]);
    ok("dropdown: item selects and closes", ddItems[1].getAttribute("aria-selected") === "true" && !dd.classList.contains("is-open"));
    trig.focus(); key(trig, "ArrowDown"); ok("dropdown: ArrowDown opens and focuses an item", dd.classList.contains("is-open") && ddItems.includes(document.activeElement));
    key(document.activeElement, "Escape"); ok("dropdown: Escape closes and refocuses", !dd.classList.contains("is-open") && document.activeElement === trig);
    /* popover */
    const pop = $('[data-test=popover] .ns-popover'), pt = $("[data-popover]", pop);
    click(pt); ok("popover: opens", pop.classList.contains("is-open"));
    click(document.body); ok("popover: outside click closes", !pop.classList.contains("is-open"));
    /* modal */
    const m = $("#m1"), opener = $("#open-m");
    ok("modal: hidden in markup is not shown", !shown(m));
    opener.focus(); click(opener); await wait(20);
    ok("modal: opens", shown(m) && !m.hidden);
    ok("modal: focus moves inside", m.contains(document.activeElement), document.activeElement && document.activeElement.id);
    $("#m1-ok").focus(); key($("#m1-ok"), "Tab"); ok("modal: Tab wraps to the first control", document.activeElement === $("#m1-x"));
    key($("#m1-x"), "Tab", { shiftKey: true }); ok("modal: Shift+Tab wraps to the last control", document.activeElement === $("#m1-ok"));
    key(document.activeElement, "Escape"); ok("modal: Escape closes and returns focus", !shown(m) && document.activeElement === opener);
    click(opener); click($("#m1-cancel")); ok("modal: data-close closes", !shown(m));
    click(opener); click(m); ok("modal: backdrop click closes", !shown(m));
    /* dismiss */
    click($('[data-test=alert] .ns-alert__close')); ok("alert: close removes it", !$('[data-test=alert] .ns-alert'));
    /* table */
    const wrap = $('[data-test=table] .ns-table-wrap'), all = $("[data-select-all]", wrap), boxes = $$("[data-row-select]", wrap), bar = $(".ns-table-bar", wrap), lbl = $("[data-batch-label]", wrap);
    all.checked = true; input(all);
    ok("table: select all selects every row", boxes.every((b) => b.checked && b.closest("tr").classList.contains("is-selected")));
    ok("table: bar shows the count", bar.classList.contains("is-batch") && lbl.textContent === "3 selected", lbl.textContent);
    boxes[0].checked = false; input(boxes[0]);
    ok("table: partial selection is indeterminate", all.indeterminate && !all.checked && lbl.textContent === "2 selected");
    boxes.forEach((b) => { b.checked = false; input(b); });
    ok("table: no selection restores the bar", !bar.classList.contains("is-batch") && lbl.textContent === "Accounts");
    let sortEvt = null; wrap.addEventListener("ns:sort", (e) => (sortEvt = e.detail), { once: true });
    const rev = $$("th[data-sort]", wrap)[1]; click(rev);
    const order = () => $$("tbody tr", wrap).map((r) => r.cells[1].textContent);
    ok("table: sort ascending by number", order().join() === "Beta,Zeta,Acme" && rev.getAttribute("aria-sort") === "ascending", order().join());
    click(rev); ok("table: sort descending", order().join() === "Acme,Zeta,Beta" && rev.getAttribute("aria-sort") === "descending");
    ok("table: ns:sort event", sortEvt && sortEvt.direction === "ascending");
    /* pagination */
    const two = $$('[data-test=pagination] .ns-page').find((p) => p.textContent.trim() === "2"); click(two);
    ok("pagination: number becomes current", two.getAttribute("aria-current") === "page");
    /* stepper */
    const st = $('[data-test=stepper] .ns-stepper'), si = $("input", st), before = +si.value;
    click($('button[aria-label="Increase"]', st)); ok("stepper: Increase steps up", +si.value === before + 1, si.value);
    click($('button[aria-label="Decrease"]', st)); ok("stepper: Decrease steps down", +si.value === before);
    /* slider */
    const sl = $('[data-test=slider] .ns-slider'); sl.value = sl.max; input(sl);
    ok("slider: fill follows value", sl.style.getPropertyValue("--_pct") === "100%");
    /* textarea */
    const ta = $("#ta"); ta.value = "hello"; input(ta); ok("textarea: counter updates", $('[data-test=textarea] .ns-helper').textContent === "5 / 280");
    /* combobox */
    const cb = $('[data-test=combobox] .ns-combobox'), ci = $("input", cb);
    ci.focus(); await wait(10); ok("combobox: focus opens", cb.classList.contains("is-open") && ci.getAttribute("aria-expanded") === "true");
    const tagsBefore = $$(".ns-combobox__control .ns-tag", cb).length;
    ci.value = "bil"; input(ci);
    const vis = $$("[role=option]", cb).filter((o) => !o.hidden);
    ok("combobox: typing filters", vis.length >= 1 && vis.every((o) => /bil/i.test(o.textContent)), vis.length);
    key(ci, "Enter"); ok("combobox: Enter toggles the option", $$(".ns-combobox__control .ns-tag", cb).length !== tagsBefore);
    ci.value = ""; input(ci); const n1 = $$(".ns-combobox__control .ns-tag", cb).length; key(ci, "Backspace");
    ok("combobox: Backspace removes the last tag", $$(".ns-combobox__control .ns-tag", cb).length === n1 - 1);
    key(ci, "Escape"); ok("combobox: Escape closes", !cb.classList.contains("is-open"));
    /* command palette */
    const ck = $('[data-test=cmdk] .ns-cmdk'), ki = $("input", ck);
    const allOpts = $$("[role=option]", ck).length; ki.value = "zz-no-match"; input(ki);
    ok("cmdk: no match shows empty state", $$("[role=option]", ck).every((o) => o.hidden) && shown($(".ns-list-empty", ck)));
    ki.value = ""; input(ki); const first = $(".is-active", ck); key(ki, "ArrowDown");
    ok("cmdk: ArrowDown moves the active option", $(".is-active", ck) && $(".is-active", ck) !== first && ki.getAttribute("aria-activedescendant") === $(".is-active", ck).id, allOpts);
    let picked = null; ck.addEventListener("ns:pick", (e) => (picked = e.detail), { once: true }); key(ki, "Enter");
    ok("cmdk: Enter fires ns:pick", picked && picked.value);
    /* toast */
    click($('[data-test=toast] [data-toast]'));
    const t = $(".ns-toast-stack .ns-notice"); ok("toast: data-toast shows a notice", t && /Saved/.test(t.textContent) && t.classList.contains("ns-notice--success"));
    click($(".ns-notice__close", t)); await wait(450); ok("toast: close removes it", !t.isConnected);
  } catch (err) { R.push(["runner error", false, err && err.stack]); }
  document.getElementById("results").textContent = JSON.stringify(R);
}, 50));
</script></body></html>`;

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/__fixture.html") { res.setHeader("content-type", "text/html"); return res.end(fixture); }
  const p = join(ROOT, url);
  if (!p.startsWith(ROOT) || !existsSync(p) || !statSync(p).isFile()) { res.statusCode = 404; return res.end("not found"); }
  res.setHeader("content-type", TYPES[extname(p)] || "application/octet-stream"); res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const dom = await new Promise((resolve) => {
  const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1280,900", "--virtual-time-budget=15000", "--dump-dom", `http://127.0.0.1:${port}/__fixture.html`], { stdio: ["ignore", "pipe", "ignore"] });
  let out = ""; p.stdout.on("data", (d) => (out += d));
  const t = setTimeout(() => p.kill(), 90000);
  p.on("close", () => { clearTimeout(t); resolve(out); });
});
server.close();
const m = dom.match(/<pre id="results">([\s\S]*?)<\/pre>/);
if (!m || !m[1].trim()) fail("behavior script check: the test page produced no results.");
const results = JSON.parse(m[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"'));
const bad = results.filter((r) => !r[1]);
results.forEach(([n, pass, info]) => { if (!pass) console.log(`  FAIL ${n}${info ? `  (${info})` : ""}`); });
if (bad.length) fail(`Behavior script: ${bad.length} of ${results.length} checks failed.`);
console.log(`Behavior script: ${results.length} checks pass.`);
