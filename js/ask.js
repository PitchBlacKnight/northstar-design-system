/* Ask NorthStar: a docs assistant built on the ns-chat component.
   Runs in the browser on the visitor's own Anthropic key (NS.getKey from tools.js).
   Context is built from the live catalog, so it never drifts from the docs. */
(function () {
  const NS = window.NS;
  const MODEL = "claude-sonnet-5-5";
  const SUGGEST = ["Which button do I use to delete something?", "What token sets the focus ring?", "Toast or alert banner?", "How do I build a filter bar?"];
  const strip = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const list = (a, f = (x) => x) => (a || []).map(f).filter(Boolean).join("; ");

  let ctxCache = "";
  const context = () => {
    if (ctxCache) return ctxCache;
    const comps = (NS.COMPONENTS || []).map((c) => [
      `### ${c.name} (#/components/${c.id}) [${c.cat}${c.status ? ", " + c.status : ""}]`,
      strip(c.desc),
      c.when && "Use: " + list(c.when),
      c.whenNot && "Avoid: " + list(c.whenNot),
      c.variants && "Variants: " + list(c.variants, (v) => `${v[0]}: ${strip(v[1])} Markup: ${String(v[2] || "").slice(0, 160)}`),
      c.tokens && "Tokens: " + list(c.tokens, (t) => `${t[0]} (${t[1]})`),
      c.keyboard && "Keyboard: " + list(c.keyboard, (k) => `${k[0]}: ${k[1]}`),
      c.aria && "Accessibility: " + list(c.aria),
    ].filter(Boolean).join("\n")).join("\n\n");
    const pages = Object.entries(NS.PAGES || {}).map(([p, d]) => `#/${p}${d && d.title ? " " + strip(d.title) : ""}`).join(", ");
    const tokens = NS.allTokens ? NS.allTokens().join(", ") : "";
    ctxCache = `# Components\n${comps}\n\n# Tokens\n${tokens}\n\n# Pages\n${pages}`;
    return ctxCache;
  };

  const system = () => [
    { type: "text", text: `You are Ask NorthStar, the assistant on the NorthStar Design System docs site. Answer questions about NorthStar components, tokens, patterns and accessibility using only the reference below. Be brief and direct: two to six sentences, or a short list. Name exact ns- classes and --ns- tokens in backticks. Link to docs pages as markdown links with hash routes, such as [Button](#/components/button). When showing markup, use a short html code block with NorthStar classes only and no raw colors. If the reference does not cover something, say so plainly and suggest the closest documented option. Never invent components, tokens or numbers. Do not use em dashes.` },
    { type: "text", text: context(), cache_control: { type: "ephemeral" } },
  ];

  /* Tiny, safe markdown: escape first, then code blocks, inline code, bold, links (hash or https), lists, paragraphs. */
  const md = (src) => {
    const esc = NS.esc || ((s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]));
    const blocks = [];
    let s = esc(src).replace(/```[a-z]*\n?([\s\S]*?)(```|$)/g, (_, code) => { blocks.push(`<pre><code>${code.replace(/\n$/, "")}</code></pre>`); return `\u0000${blocks.length - 1}\u0000`; });
    const inline = (t) => t
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(((?:#\/|https:\/\/)[^)\s]+)\)/g, (_, l, h) => `<a href="${h}"${h[0] === "#" ? "" : ' target="_blank" rel="noopener"'}>${l}</a>`);
    return s.split(/\n{2,}/).map((para) => {
      if (/^\u0000\d+\u0000$/.test(para.trim())) return para.trim();
      const lines = para.split("\n");
      if (lines.every((l) => /^\s*([-*]|\d+\.)\s+/.test(l))) {
        const tag = /^\s*\d+\./.test(lines[0]) ? "ol" : "ul";
        return `<${tag}>${lines.map((l) => `<li>${inline(l.replace(/^\s*([-*]|\d+\.)\s+/, ""))}</li>`).join("")}</${tag}>`;
      }
      return `<p>${inline(para).replace(/\n/g, "<br>")}</p>`;
    }).join("").replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[+i]);
  };

  const history = [];
  let busy = null;
  const $ = (id) => document.getElementById(id);

  const mount = () => {
    if ($("ask-fab")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
<button class="ns-btn ns-ask-fab" id="ask-fab" type="button" aria-expanded="false" aria-controls="ask-panel">Ask NorthStar</button>
<section class="ns-chat ns-ask-panel" id="ask-panel" role="dialog" aria-labelledby="ask-title" hidden>
  <div class="ns-chat__head"><h2 class="ns-chat__title" id="ask-title">Ask NorthStar</h2><span class="ns-chat__meta">Answers from the docs</span><button class="ns-btn ns-btn--ghost ns-btn--sm" id="ask-new" type="button">New</button><button class="ns-btn ns-btn--ghost ns-btn--sm ns-btn--square" id="ask-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>
  <div class="ns-chat__log" id="ask-log" role="log" aria-label="Conversation" aria-live="polite"></div>
  <div id="ask-foot"></div>
</section>`;
    document.body.append(...wrap.children);
    $("ask-fab").addEventListener("click", () => toggle());
    $("ask-close").addEventListener("click", () => toggle(false));
    $("ask-new").addEventListener("click", () => { busy?.abort(); history.length = 0; render(); $("ask-in")?.focus(); });
    $("ask-panel").addEventListener("keydown", (e) => { if (e.key === "Escape") { e.stopPropagation(); toggle(false); } });
    $("ask-log").addEventListener("click", (e) => {
      const b = e.target.closest("[data-ask]"); if (b) send(b.dataset.ask);
      if (e.target.closest("a[href^='#/']") && innerWidth <= 600) toggle(false);
    });
    render();
  };

  const toggle = (open) => {
    const p = $("ask-panel"), f = $("ask-fab");
    open = open ?? p.hidden;
    p.hidden = !open; f.setAttribute("aria-expanded", String(open));
    if (open) { render(); setTimeout(() => ($("ask-in") || $("ask-key"))?.focus(), 0); } else f.focus();
  };

  const bubble = (m) => m.role === "user"
    ? `<div class="ns-chat__msg ns-chat__msg--user"><div class="ns-chat__bubble">${NS.esc(m.content)}</div></div>`
    : `<div class="ns-chat__msg ns-chat__msg--bot${m.error ? " ns-chat__msg--error" : ""}"><span class="ns-chat__who">NorthStar</span><div class="ns-chat__bubble">${m.pending && !m.content ? '<span class="ns-chat__typing" aria-label="NorthStar is thinking"><i></i><i></i><i></i></span>' : m.error ? `${NS.esc(m.content)} <button class="ns-btn ns-btn--ghost ns-btn--sm" type="button" data-ask="${NS.esc(m.retry || "")}">Retry</button>` : md(m.content)}</div></div>`;

  const render = () => {
    const log = $("ask-log"), foot = $("ask-foot"); if (!log) return;
    const hasKey = !!NS.getKey();
    log.innerHTML = history.length ? history.map(bubble).join("")
      : bubble({ role: "assistant", content: hasKey ? "Ask about components, tokens, patterns or accessibility. Answers come from this site's catalog." : "Ask NorthStar runs on your own Anthropic key. It stays in this browser and is sent only to api.anthropic.com. Add one below to start." })
        + (hasKey ? `<div class="ns-chat__suggest">${SUGGEST.map((q) => `<button class="ns-tag ns-tag--sm" type="button" data-ask="${NS.esc(q)}">${NS.esc(q)}</button>`).join("")}</div>` : "");
    log.scrollTop = log.scrollHeight;
    if (hasKey) {
      if (!$("ask-in")) {
        foot.innerHTML = `<form class="ns-chat__composer" id="ask-form"><textarea class="ns-textarea" id="ask-in" rows="1" placeholder="Ask a question" aria-label="Message"></textarea><button class="ns-btn ns-btn--square" type="submit" aria-label="Send">${NS.chatSend}</button></form><p class="ns-chat__note">Generated by Claude from the docs. Check anything you ship.</p>`;
        const ta = $("ask-in");
        const grow = () => { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px"; };
        ta.addEventListener("input", grow);
        ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); $("ask-form").requestSubmit(); } });
        $("ask-form").addEventListener("submit", (e) => { e.preventDefault(); const v = ta.value.trim(); if (!v || busy) return; ta.value = ""; grow(); send(v); });
      }
    } else {
      foot.innerHTML = `<form class="ns-chat__composer" id="ask-keyform"><input class="ns-input" id="ask-key" type="password" placeholder="sk-ant-..." aria-label="Anthropic API key" autocomplete="off" style="flex:1"/><button class="ns-btn" type="submit">Save key</button></form><p class="ns-chat__note">Use a key with a spend limit. Forget it any time on the Live Builder page.</p>`;
      $("ask-keyform").addEventListener("submit", (e) => { e.preventDefault(); const v = $("ask-key").value.trim(); if (!v) return; NS.setKey(v); NS.toast?.("Key saved", "Stored in this browser only.", "success"); render(); $("ask-in")?.focus(); });
    }
  };

  async function send(text) {
    if (!text || busy) return;
    if (history.at(-1)?.error) history.pop();
    if (history.at(-1)?.role === "user") history.pop();
    history.push({ role: "user", content: text });
    const reply = { role: "assistant", content: "", pending: true };
    history.push(reply); render();
    busy = new AbortController();
    const page = location.hash.replace(/^#/, "") || "/";
    const messages = history.filter((m) => !m.pending && !m.error).map(({ role, content }) => ({ role, content }));
    messages[messages.length - 1] = { role: "user", content: `${text}\n\n(The reader is on ${page}.)` };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", signal: busy.signal,
        headers: { "content-type": "application/json", "x-api-key": NS.getKey(), "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: MODEL, max_tokens: 1200, stream: true, system: system(), messages }),
      });
      if (!res.ok) { const t = await res.text(); let m = t; try { m = JSON.parse(t).error.message; } catch (e) {} throw new Error(res.status === 401 ? "That key was not accepted. Add a new one." : `${res.status}: ${m}`); }
      const reader = res.body.getReader(), dec = new TextDecoder(); let buf = "", raf = 0;
      const paint = () => { raf = 0; const b = $("ask-log")?.lastElementChild?.querySelector(".ns-chat__bubble"); if (b) { b.innerHTML = md(reply.content); const l = $("ask-log"); l.scrollTop = l.scrollHeight; } };
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop();
        for (const l of lines) {
          if (!l.startsWith("data:")) continue;
          let ev; try { ev = JSON.parse(l.slice(5)); } catch (e) { continue; }
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") { reply.content += ev.delta.text; reply.pending = false; if (!raf) raf = requestAnimationFrame(paint); }
          if (ev.type === "error") throw new Error(ev.error.message);
        }
      }
      reply.pending = false;
      if (!reply.content) throw new Error("No answer came back.");
    } catch (e) {
      if (e.name === "AbortError") { history.splice(history.indexOf(reply) - 1, 2); }
      else { reply.pending = false; reply.error = true; reply.content = e.message; reply.retry = text; if (/not accepted/.test(e.message)) NS.setKey(""); }
    }
    busy = null; render();
  }

  NS.ask = { open: () => toggle(true), send };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
