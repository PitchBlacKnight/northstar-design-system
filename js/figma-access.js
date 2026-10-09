/* Figma access interstitial.
   Any <a data-figma-access="Name of file" href="https://www.figma.com/..."> opens a short
   card before the link. The Figma file itself is invite-only, so Figma's own
   "Request access" screen does the gating; this card just sets expectations. */
(function () {
  if (window.__figmaAccess) return;
  window.__figmaAccess = true;

  var css = [
    "dialog.fa{border:0;padding:0;background:transparent;max-width:min(460px,calc(100vw - 32px));color:#f3efe6;font:inherit}",
    "dialog.fa::backdrop{background:rgba(8,8,10,.72);backdrop-filter:blur(3px)}",
    ".fa__card{background:#141418;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:28px 28px 24px;box-shadow:0 30px 80px rgba(0,0,0,.5)}",
    ".fa__k{display:block;font-family:ui-monospace,'JetBrains Mono',Menlo,monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#9ea0a8;margin:0 0 12px}",
    ".fa__h{font-size:22px;line-height:1.2;font-weight:600;margin:0 0 12px;letter-spacing:-.01em}",
    ".fa__p{font-size:15px;line-height:1.55;color:#c9c6bd;margin:0 0 8px}",
    ".fa__p b{color:#f3efe6;font-weight:600}",
    ".fa__row{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px;align-items:center}",
    ".fa__go,.fa__no{font:inherit;font-size:14px;font-weight:600;border-radius:999px;padding:11px 18px;cursor:pointer;text-decoration:none;line-height:1}",
    ".fa__go{background:#f3efe6;color:#141418;border:1px solid #f3efe6}",
    ".fa__go:hover{background:#fff}",
    ".fa__no{background:transparent;color:#c9c6bd;border:1px solid rgba(255,255,255,.22)}",
    ".fa__no:hover{color:#fff;border-color:rgba(255,255,255,.5)}",
    ".fa__go:focus-visible,.fa__no:focus-visible{outline:2px solid #6fd6c2;outline-offset:3px}"
  ].join("");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var dlg = document.createElement("dialog");
  dlg.className = "fa";
  dlg.innerHTML =
    '<div class="fa__card">' +
    '<span class="fa__k">Private Figma file</span>' +
    '<h2 class="fa__h">Request access to the <span data-fa-name>Figma library</span></h2>' +
    '<p class="fa__p">This file is invite-only. On the next screen, Figma will ask you to <b>request access</b>. Add a line about who you are and what you want to see.</p>' +
    '<p class="fa__p">I approve most requests within a day, with view access.</p>' +
    '<div class="fa__row">' +
    '<a class="fa__go" data-fa-go href="#" target="_blank" rel="noopener">Continue to Figma ↗</a>' +
    '<button class="fa__no" type="button" data-fa-close>Not now</button>' +
    "</div></div>";
  document.body.appendChild(dlg);

  var nameEl = dlg.querySelector("[data-fa-name]");
  var goEl = dlg.querySelector("[data-fa-go]");

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-figma-access]");
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (typeof dlg.showModal !== "function") return;
    e.preventDefault();
    nameEl.textContent = a.getAttribute("data-figma-access") || "Figma library";
    goEl.href = a.href;
    dlg.showModal();
  });

  dlg.querySelector("[data-fa-close]").addEventListener("click", function () { dlg.close(); });
  goEl.addEventListener("click", function () { setTimeout(function () { dlg.close(); }, 0); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
})();
