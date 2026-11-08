/* Injected into the docs site by tools/agent-export.mjs. Reads the live catalog (NS.COMPONENTS, NS.PAGES,
   the token sheet in both themes) and writes one JSON blob to <script type="application/json" id="ns-agent-export">.
   The node side turns it into llms.txt, agent/northstar.md, agent/components.json and agent/tokens.json. */
(async () => {
  await new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)));
  await new Promise((r) => setTimeout(r, 400));
  const NS = window.NS;
  const text = (h) => { const d = document.createElement("div"); d.innerHTML = String(h ?? ""); return d.textContent.replace(/\s+/g, " ").trim(); };
  const classesIn = (html, helpers) => { const out = new Set(); String(html || "").replace(/class="([^"]*)"/g, (_, c) => { c.split(/\s+/).forEach((k) => { if (!k) return; if (/^ns-/.test(k) || /^is-/.test(k)) out.add(k); else if (helpers) helpers.add(k); }); return ""; }); return out; };
  const defaults = (c) => Object.fromEntries((c.playground?.controls || []).map((k) => [k.key, k.default ?? (k.options ? k.options[0] : k.type === "bool" ? false : "")]));

  const components = NS.COMPONENTS.map((c) => {
    let html = "";
    try { html = c.playground?.render ? c.playground.render(defaults(c)) : ""; } catch (e) { html = ""; }
    (c.parts || []).forEach((pc) => { try { html += "\n" + pc.playground.render(defaults(pc)); } catch (e) {} });
    const helpers = new Set();
    const cls = classesIn(html, helpers);
    (c.variants || []).forEach((v) => classesIn(v[2], helpers).forEach((k) => cls.add(k)));
    (c.dd || []).forEach((d, i) => { if (i % 2 === 0) classesIn(d, helpers).forEach((k) => cls.add(k)); });
    const dd = [];
    for (let i = 0; i + 1 < (c.dd || []).length; i += 2) dd.push({ verdict: i / 2 % 2 === 0 ? "do" : "do not", note: text(c.dd[i + 1]) });
    return {
      id: c.id, name: c.name, category: c.cat, status: c.status, figma: c.figma || null,
      description: text(c.desc),
      classes: [...cls].sort(),
      helperClasses: [...helpers].sort(),
      axes: (c.axes || []).map(([k, v]) => ({ axis: k, values: v })),
      use: (c.when || []).map(text),
      avoid: (c.whenNot || []).map(text),
      guidance: dd,
      variants: (c.variants || []).map((v) => ({ name: v[0], note: text(v[1]), html: String(v[2] || "").trim() })),
      tokens: (c.tokens || []).map(([t, n]) => ({ token: t, role: n })),
      sizes: (c.sizes || []).map((s) => ({ size: s[0], value: s[1], use: s[2] })),
      props: (c.props || []).map((p) => ({ prop: p[0], type: p[1], default: p[2], note: p[3] })),
      keyboard: (c.keyboard || []).map(([k, v]) => ({ key: k, action: v })),
      accessibility: (c.aria || []).map(text),
      html: html.trim(),
      react: c.react || null,
      parts: (c.parts || []).map((pc) => ({ id: pc.id, name: pc.name, figma: pc.figma || null, description: text(pc.desc), react: pc.react || null })),
    };
  });

  /* Pattern and floorplan pages: headings, prose, lists and the example markup of each stage, as markdown. */
  const pageBody = (p) => {
    let html = ""; try { html = typeof p.body === "function" ? p.body() : String(p.body || ""); } catch (e) { return ""; }
    const d = document.createElement("div"); d.innerHTML = html;
    const out = [];
    d.querySelectorAll("h2, h3, p, li, .stage").forEach((el) => {
      if (el.closest(".stage") && !el.classList.contains("stage")) return;
      if (el.matches("h2")) out.push(`\n**${text(el.textContent).replace(/#$/, "")}**\n`);
      else if (el.matches("h3")) out.push(`\n${text(el.textContent).replace(/#$/, "")}\n`);
      else if (el.matches("li")) out.push(`- ${text(el.textContent)}`);
      else if (el.matches("p")) { const t = text(el.textContent); if (t) out.push(t); }
      else { const c = el.querySelector(".stage__canvas"); const label = text(el.querySelector(".lbl")?.textContent || "Example"); if (c && c.innerHTML.trim().length < 6000) out.push(`\nExample (${label}):\n\`\`\`html\n${c.innerHTML.trim()}\n\`\`\``); }
    });
    return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  };
  const pageList = (prefix, withBody) => Object.keys(NS.PAGES).filter((k) => k.startsWith(prefix)).map((k) => { const p = NS.PAGES[k]; return { route: "#/" + k, title: p.title, summary: text(p.lede || p.desc || ""), body: withBody ? pageBody(p) : undefined }; });

  const readTokens = () => Object.fromEntries(NS.allTokens().map((t) => [t, NS.tokenValue(t)]));
  const de = document.documentElement;
  const prevTheme = de.dataset.theme;
  de.dataset.theme = "dark"; const dark = readTokens();
  de.dataset.theme = "light"; const light = readTokens();
  if (prevTheme) de.dataset.theme = prevTheme; else delete de.dataset.theme;
  const tokens = Object.keys(dark).sort().map((name) => ({ name, dark: dark[name], light: light[name] === dark[name] ? undefined : light[name] }));

  const out = {
    version: NS.VERSION, generated: new Date().toISOString().slice(0, 10),
    counts: { components: components.length, tokens: tokens.length },
    components, tokens,
    patterns: pageList("patterns/", true), floorplans: pageList("floorplans/", true), foundations: pageList("foundations/"),
  };
  const s = document.createElement("script");
  s.type = "application/json"; s.id = "ns-agent-export"; s.textContent = JSON.stringify(out);
  document.body.appendChild(s);
})();
