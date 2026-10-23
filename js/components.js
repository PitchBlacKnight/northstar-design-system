/* Component catalog. Each entry feeds the Usage / Style / Code / Accessibility template. */
(function () {
  const NS = window.NS;
  const x = NS.esc;

  const rows = [
    ["Acme Corp", "Gold", 12400, "active"], ["Beta LLC", "Silver", 5200, "pending"], ["Zeta Inc", "Platinum", 38900, "active"],
    ["Northwind", "Silver", 7300, "error"], ["Globex", "Gold", 19850, "active"],
  ];
  const statusBadge = (s) => `<span class="ns-dot ns-dot--${{ active: "success", pending: "warning", error: "error" }[s]}">${s}</span>`;
  const tableHtml = (o = {}) => `<div class="ns-table-wrap" style="width:100%">${o.batch ? `<div class="ns-table-bar"><b data-batch-label data-default="Accounts">Accounts</b><div style="display:flex;gap:8px"><button class="ns-btn ns-btn--sm ns-btn--tertiary">Export</button><button class="ns-btn ns-btn--sm">Add account</button></div></div>` : ""}
<table class="ns-table ${o.size === "Compact" ? "ns-table--compact" : ""} ${o.zebra ? "ns-table--zebra" : ""}">
  <thead><tr>${o.batch ? '<th><label class="ns-check"><input type="checkbox" data-select-all aria-label="Select all rows"/></label></th>' : ""}<th data-sort>Account <span class="ns-sort">↕</span></th><th data-sort>Tier <span class="ns-sort">↕</span></th><th data-sort class="num">Revenue <span class="ns-sort">↕</span></th><th>Status</th></tr></thead>
  <tbody>${rows.map((r) => `<tr>${o.batch ? `<td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select ${r[0]}"/></label></td>` : ""}<td>${r[0]}</td><td>${r[1]}</td><td class="num">$${r[2].toLocaleString()}</td><td>${statusBadge(r[3])}</td></tr>`).join("")}</tbody>
</table></div>`;

  const cal = () => {
    let d = "";
    ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].forEach((w) => (d += `<span class="ns-cal__dow">${w}</span>`));
    for (let i = 29; i <= 31; i++) d += `<button class="ns-cal__day is-muted" tabindex="-1">${i}</button>`;
    for (let i = 1; i <= 30; i++) d += `<button class="ns-cal__day ${i === 24 ? "is-today" : ""} ${i === 10 || i === 16 ? "is-selected" : ""} ${i > 10 && i < 16 ? "is-range" : ""}">${i}</button>`;
    for (let i = 1; i <= 2; i++) d += `<button class="ns-cal__day is-muted" tabindex="-1">${i}</button>`;
    return `<div class="ns-cal" role="group" aria-label="September 2026"><div class="ns-cal__head"><button class="icon-btn" aria-label="Previous month">‹</button>September 2026<button class="icon-btn" aria-label="Next month">›</button></div><div class="ns-cal__grid">${d}</div></div>`;
  };

  const CMP_ICON_PATHS = {
    more: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
  };
  const cmpIcon = (n, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CMP_ICON_PATHS[n]}</svg>`;

  /* Bullet chart: rows render as SVG from a data array (segments and target as percent of the track) */
  let bulletUid = 0;
  const BULLET_ROWS = [
    { label: "500", segments: [40, 10, 10, 14], target: 98 },
    { label: "400", segments: [38, 10, 12, 20], target: 88 },
    { label: "300", segments: [15, 8, 8, 10], target: 50 },
    { label: "200", segments: [15, 10, 12, 12], target: 64 },
    { label: "100", segments: [40, 14, 15, 15], target: 98 },
  ];
  const BULLET_ROWS_XL = [
    { label: "600", segments: [20, 20, 20, 20], target: 99 },
    { label: "500", segments: [12, 12, 12, 12, 10], target: 57 },
    { label: "400", segments: [20, 20, 20, 20], target: 91 },
    { label: "300", segments: [9, 9, 9, 9], target: 45 },
    { label: "200", segments: [16, 16, 16, 16, 14], target: 75 },
    { label: "100", segments: [48, 20, 12, 15], target: 99 },
  ];
  NS.bulletSvg = (rows, o = {}) => {
    const id = "nsb" + ++bulletUid, h = o.track ?? 10, gap = o.gap ?? 16, labelW = o.labels === false ? 0 : 40, w = o.width ?? 327;
    const trackW = w - labelW, rowH = Math.max(h, 14), H = rows.length * rowH + (rows.length - 1) * gap, th = h >= 10 ? h - 4 : h;
    const body = rows.map((r, i) => {
      const cy = i * (rowH + gap) + rowH / 2, top = (cy - h / 2).toFixed(1); let x = 0;
      const segs = r.segments.map((p, j) => { const sw = Math.max(2, (trackW * p) / 100); const el = `<rect x="${(labelW + x).toFixed(1)}" y="${top}" width="${sw.toFixed(1)}" height="${h}" style="fill:var(--ns-chart-series-${j + 1})"/>`; x += sw + 2; return el; }).join("");
      const label = `${r.label ? r.label + ": " : ""}${r.segments.join(" + ")} of ${r.segments.reduce((a, b) => a + b, 0)}, target ${r.target}`;
      const tick = r.target > 0 ? `<rect x="${(labelW + (trackW * r.target) / 100 - 2).toFixed(1)}" y="${(cy - th / 2).toFixed(1)}" width="2" height="${th}" rx="1" style="fill:var(--ns-chart-target)"/>` : "";
      return `<g role="listitem" aria-label="${label}">${labelW ? `<text x="0" y="${cy.toFixed(1)}" dominant-baseline="middle" font-size="11" style="fill:var(--ns-widget-muted)">${r.label}</text>` : ""}<clipPath id="${id}-${i}"><rect x="${labelW}" y="${top}" width="${trackW}" height="${h}" rx="${h / 2}"/></clipPath><rect x="${labelW}" y="${top}" width="${trackW}" height="${h}" rx="${h / 2}" style="fill:var(--ns-chart-track)"/><g clip-path="url(#${id}-${i})">${segs}</g>${tick}</g>`;
    }).join("");
    const data = NS.esc ? NS.esc(JSON.stringify({ rows, opts: { track: o.track, gap: o.gap, labels: o.labels, label: o.label } })) : "";
    return `<svg class="ns-bullet__rows" width="${w}" height="${H}" viewBox="0 0 ${w} ${H}" style="width:100%;max-width:${w}px" role="list" aria-label="${o.label || "Bullet chart"}" data-w="${w}" data-bullet="${data}">${body}</svg>`;
  };
  const bulletIcon = () => `<span class="ns-bullet__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span>`;
  const bulletKpi = (series, title, value, trend, desc, big) => `<div class="ns-bullet__kpi"><span class="ns-bullet__title"><span class="ns-bullet__dot" style="background:var(--ns-chart-series-${series})"></span>${title}</span><span class="ns-bullet__value${big ? "" : " ns-bullet__value--sm"}">${value}<span class="ns-bullet__trend">${trend}</span></span><span class="ns-bullet__desc">${desc}</span></div>`;
  const bulletCard = (size = "Medium", icon = true) => {
    const ic = icon ? bulletIcon() : "";
    if (size === "Small") return `<div class="ns-bullet ns-bullet--small" style="width:100%;max-width:330px"><div class="ns-bullet__text"><span class="ns-bullet__title">Revenue</span><span class="ns-bullet__value ns-bullet__value--sm">$42,180<span class="ns-bullet__trend">+3.1%</span></span><span class="ns-bullet__desc">vs. $40,900 last month</span></div>${NS.bulletSvg(BULLET_ROWS.slice(0, 4), { width: 120, track: 6, gap: 10, labels: false })}${ic}</div>`;
    if (size === "Vertical small") return `<div class="ns-bullet ns-bullet--vertical" style="width:100%;max-width:192px"><div class="ns-bullet__head"><div class="ns-bullet__text"><span class="ns-bullet__title">Income</span><span class="ns-bullet__value ns-bullet__value--sm">$18,420</span><span class="ns-bullet__desc"><span class="ns-bullet__trend">+1.8%</span> this quarter</span></div>${ic}</div>${NS.bulletSvg(BULLET_ROWS.slice(0, 4), { width: 160, track: 6, gap: 12, labels: false })}</div>`;
    if (size === "Large") return `<div class="ns-bullet" style="width:100%;max-width:375px"><div class="ns-bullet__head"><span class="ns-bullet__title ns-bullet__title--lg">Sales report</span>${ic}</div>${NS.bulletSvg(BULLET_ROWS, { width: 327 })}<div class="ns-bullet__summary">${bulletKpi(1, "Monthly", "$8,097", "+1.6%", "44,214 units")}${bulletKpi(3, "Yearly", "$96,310", "+2.5%", "301,002 units")}</div></div>`;
    if (size === "XL") return `<div class="ns-bullet" style="width:100%;max-width:800px"><div class="ns-bullet__head"><div class="ns-bullet__kpis">${bulletKpi(1, "Weekly", "$2,310", "+4.2%", "Compared with $2,217 last week", true)}${bulletKpi(3, "Monthly", "$9,480", "+1.9%", "Compared with $9,300 last month", true)}${bulletKpi(2, "Yearly", "$104,200", "+2.7%", "Compared with $101,460 last year", true)}</div>${ic}</div>${NS.bulletSvg(BULLET_ROWS_XL, { width: 752, gap: 20 })}</div>`;
    return `<div class="ns-bullet" style="width:100%;max-width:375px"><div class="ns-bullet__head"><div class="ns-bullet__text"><span class="ns-bullet__title">Income</span><span class="ns-bullet__value">$18,420<span class="ns-bullet__trend">+1.8%</span></span><span class="ns-bullet__desc">Compared with $18,090 last month</span></div>${ic}</div>${NS.bulletSvg(BULLET_ROWS, { width: 327 })}</div>`;
  };

  /* Chart entries share one shell: five sizes, Title / Value / Show icon, plots from NS.chartKit */
  const CHART_SIZES = [["Small", "100px", "KPI tile: text left, mini plot right, no axes"], ["Vertical small", "256px", "Narrow column or sidebar, no axes"], ["Medium", "350px", "Default card with axis labels"], ["Large", "465px", "Card with divider and two-KPI summary"], ["XL", "390px", "Wide panel, three KPIs"]];
  const chartEntry = (id, key, o) => ({
    id, name: o.name, cat: "Data viz", status: "New", figma: o.figma, desc: o.desc,
    axes: [["Size", "Small, Vertical small, Medium, Large, XL"], ["Title", "Text"], ["Value", "Text"], ["Show icon", "Boolean"]],
    doc: o.doc,
    playground: { controls: [{ key: "size", label: "Size", options: ["Medium", "Small", "Vertical small", "Large", "XL"] }, { key: "icon", label: "Show icon", type: "bool", default: true }], render: (s) => NS.chartKit.card(key, s.size, s.icon) },
    when: o.when, whenNot: o.whenNot,
    variants: [
      ["Sizes", "Five sizes from the same data. Small and Vertical small drop the axes and labels.", `<div style="display:grid;gap:24px;justify-items:start">${["Small", "Vertical small", "Medium", "Large"].map((z) => NS.chartKit.card(key, z, false)).join("")}</div>`],
      ["XL", "Three KPIs above the plot.", NS.chartKit.card(key, "XL", true)],
      ["Plot only", "The SVG on its own, for use inside another card.", `<div style="width:327px">${NS.chartKit.svg(key, "Medium")}</div>`],
    ],
    dd: o.dd || [`<div style="width:260px">${NS.chartKit.svg(key, "Medium", { width: 260, height: 160 })}</div>`, "Axis labels and gridlines on the Medium plot.", `<div style="width:120px">${NS.chartKit.svg(key, "Small")}</div>`, "The compact plot drops axes and labels."],
    tokens: [...o.tokens, ["--ns-widget-bg", "Card surface"], ["--ns-border-subtle", "Card stroke and summary divider"], ["--ns-widget-muted", "Axis labels and description"], ["--ns-status-success", "Trend"], ["--ns-radius-xl", "Card radius"]],
    sizes: CHART_SIZES,
    props: [["size", "'small' | 'vertical-small' | 'medium' | 'large' | 'xl'", "'medium'", "Layout and plot size"], ["title", "string", "-", "Header title"], ["value", "string", "-", "Headline figure"], ["trend", "string", "-", "Signed change, for example +2.4%"], ["data", o.dataType, "[]", o.dataNote], ["showIcon", "boolean", "false", "Icon in the header"]],
    keyboard: [["-", "Not interactive"]],
    aria: o.aria,
    react: o.react,
  });

  NS.COMPONENTS = [
    {
      id: "button", name: "Button", cat: "Actions", status: "Stable", figma: "4038:31741",
      desc: "The button component gives users the ability to perform an action or navigate to another page. They have multiple styles and states for different needs.",
      axes: [["Hierarchy", "Primary, Secondary, Outline, Ghost"], ["State", "Default, Hover, Pressed, Focus, Disabled"], ["Size", "S (32), M (40), L (48)"], ["Icons", "Show leading icon, Show trailing icon (booleans with instance swaps)"], ["Label", "Text property"]],
      doc: [["Label and icon", "Buttons should always have an inscription. Also, some cases use buttons only with an icon that is clear and understandable to the user. Use the icon only when necessary and when it has a strong association with the label text."], ["Accent", "An accent button has a strong accent and is intended for important actions. When using buttons in your project, remember to design a clear semantic hierarchy."], ["Style", "Buttons can be filled or outline style. A fill-style button has a solid background, because it must be intentionally more prominent than an outline-style button. An outline-style button has a visible border and no background color, and is usually used for secondary actions."], ["Size", "Buttons come in three different sizes: small, medium and large. The medium size is the most commonly used size. Avoid using three different button sizes on the same page."], ["Focus", "Keyboard focus shows a 2px focus ring with a 2px offset. The ring is never removed."], ["Disabled", "A button in a disabled state shows that an action exists, but is not available in that circumstance."]],
      playground: {
        controls: [
          { key: "kind", label: "Hierarchy", options: ["Primary", "Secondary", "Outline", "Ghost"] },
          { key: "icons", label: "Icons", options: ["None", "Leading icon", "Trailing icon", "Both icons"] },
          { key: "state", label: "State", options: ["Default", "Hover", "Pressed", "Focus", "Disabled"] },
          { key: "size", label: "Size", options: ["M", "S", "L"] },
          { key: "label", label: "Label", type: "text", default: "Button" },
        ],
        render: (s) => {
          const k = s.kind === "Primary" ? "" : ` ns-btn--${s.kind.toLowerCase()}`;
          const z = { S: " ns-btn--sm", L: " ns-btn--lg", M: "" }[s.size];
          const st = { Hover: " is-hover", Pressed: " is-pressed", Focus: " is-focus", Default: "", Disabled: "" }[s.state];
          const ico = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
          const inner = `${/Leading|Both/.test(s.icons) ? ico : ""}${x(s.label)}${/Trailing|Both/.test(s.icons) ? ico : ""}`;
          return `<button class="ns-btn${k}${z}${st}"${s.state === "Disabled" ? " disabled" : ""}>${inner}</button>`;
        },
      },
      when: ["Primary: actions that require maximum attention. Use only one per page.", "Secondary: secondary actions, or interfaces with low contrast.", "Outline and Ghost: actions that need the least attention on the page.", "Danger (NorthStar extension): destructive actions, always confirmed."],
      whenNot: ["Do not use a button for navigation to another page. Use a link.", "Avoid three or more button sizes on one page."],
      variants: [
        ["Hierarchy", "Primary, Secondary, Outline, Ghost.", '<button class="ns-btn">Primary</button><button class="ns-btn ns-btn--secondary">Secondary</button><button class="ns-btn ns-btn--outline">Outline</button><button class="ns-btn ns-btn--ghost">Ghost</button>'],
        ["States", "Default, Hover, Pressed, Focus, Disabled.", '<button class="ns-btn">Default</button><button class="ns-btn is-hover">Hover</button><button class="ns-btn is-pressed">Pressed</button><button class="ns-btn is-focus">Focus</button><button class="ns-btn" disabled>Disabled</button>'],
        ["Sizes", "S 32, M 40, L 48.", '<button class="ns-btn ns-btn--sm">Small</button><button class="ns-btn">Medium</button><button class="ns-btn ns-btn--lg">Large</button>'],
        ["Icons", "Leading, trailing, or both. Swap the icon instance.", '<button class="ns-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Leading</button><button class="ns-btn">Trailing<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button><button class="ns-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Both<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>'],
      ],
      dd: ['<button class="ns-btn ns-btn--outline">Cancel</button><button class="ns-btn">Save changes</button>', "Pair one primary action with an outline action, primary on the right.",
        '<button class="ns-btn">Cancel</button><button class="ns-btn">Save</button><button class="ns-btn">Export</button>', "Stack several primary buttons. Users cannot tell which action matters."],
      tokens: [["--ns-interactive-primary", "Primary default (blue/500)"], ["--ns-interactive-primary-hover", "Primary hover (blue/700)"], ["--ns-interactive-primary-active", "Primary pressed (purple/500)"], ["--ns-interactive-secondary-bg", "Secondary fill (gray/8)"], ["--ns-interactive-secondary-hover", "Secondary hover (gray/7)"], ["--ns-gray-4", "Disabled fill"], ["--ns-radius-lg", "Corner radius (8px)"], ["--ns-focus-ring", "Focus ring, 2px with 2px offset"]],
      sizes: [["S", "32px", "Dense tables, toolbars"], ["M", "40px", "Default, most common"], ["L", "48px", "Forms, dialogs with space"]],
      props: [["hierarchy", "'primary' | 'secondary' | 'outline' | 'ghost'", "'primary'", "Visual emphasis"], ["size", "'s' | 'm' | 'l'", "'m'", "Height"], ["iconLeading / iconTrailing", "ReactNode", "-", "Icons"], ["disabled", "boolean", "false", "Prevents interaction"]],
      keyboard: [["Tab", "Moves focus to the button"], ["Enter / Space", "Activates the button"]],
      aria: ["Use a native <code>&lt;button&gt;</code>. Icon-only buttons need <code>aria-label</code>.", "Disabled buttons use the <code>disabled</code> attribute so they leave the tab order.", "Focus shows a 2px ring with a 2px offset. Never remove it."],
      react: "import { Button } from '@northstar/react';\n\n<Button hierarchy=\"primary\" size=\"m\" onClick={deploy}>\n  Deploy pipeline\n</Button>",
    },
    {
      id: "text-input", name: "Text input", cat: "Inputs", status: "Stable", figma: "1846:24421",
      desc: "Text inputs enable the user to interact with and input content and data. This component can be used for long and short form entries.",
      axes: [["Size", "Small (32), Medium (36), Large (48)"], ["State", "Default, Focus, Error, Warning, Disabled"]],
      doc: [["Placeholder", "Placeholder shows a user's entered text."], ["Width", "The width of a text field can be customized appropriately for its context."], ["Size", "We use three basic sizes of text boxes: small, medium and large. The medium size is the standard and most commonly used option."]],
      playground: {
        controls: [{ key: "state", label: "State", options: ["Default", "Focus", "Error", "Warning", "Disabled"] }, { key: "size", label: "Size", options: ["Medium", "Small", "Large"] }, { key: "label", label: "Label", type: "text", default: "Cluster name" }],
        render: (s) => {
          const helper = { Default: "Lowercase, 3 to 24 characters.", Focus: "Lowercase, 3 to 24 characters.", Error: "Name already exists in this region.", Warning: "Names over 20 characters get truncated.", Disabled: "Locked by policy." }[s.state];
          const z = { Small: " ns-input--sm", Large: " ns-input--lg", Medium: " ns-input--md" }[s.size];
          return `<div class="ns-field${s.state === "Error" || s.state === "Warning" ? " is-" + s.state.toLowerCase() : ""}" style="width:220px"><label class="ns-label" for="ti-1">${x(s.label)}</label><input class="ns-input${z}${s.state === "Focus" ? " is-focus" : ""}" id="ti-1" placeholder="Placeholder"${s.state === "Disabled" ? " disabled" : ""}${s.state === "Error" ? ' aria-invalid="true"' : ""} aria-describedby="ti-1-h"/><span class="ns-helper" id="ti-1-h">${helper}</span></div>`;
        },
      },
      when: ["Collect short free-form text such as names, IDs, and hostnames.", "Use helper text to set format expectations before an error happens."],
      whenNot: ["Long text: use a textarea.", "A fixed set of values: use a dropdown or radio group."],
      variants: [["States", "Default, Focus, Error, Warning, Disabled.", '<div class="ns-field" style="width:180px"><input class="ns-input ns-input--md" aria-label="Default" placeholder="Default"/></div><div class="ns-field" style="width:180px"><input class="ns-input ns-input--md is-focus" aria-label="Focus" placeholder="Focus"/></div><div class="ns-field is-error" style="width:180px"><input class="ns-input ns-input--md" aria-label="Error" placeholder="Error"/></div><div class="ns-field is-warning" style="width:180px"><input class="ns-input ns-input--md" aria-label="Warning" placeholder="Warning"/></div><div class="ns-field" style="width:180px"><input class="ns-input ns-input--md" aria-label="Disabled" placeholder="Disabled" disabled/></div>'], ["Sizes", "32, 36, 48.", '<input class="ns-input ns-input--sm" style="width:220px" placeholder="Small" aria-label="Small"/><input class="ns-input ns-input--md" style="width:220px" placeholder="Medium" aria-label="Medium"/><input class="ns-input ns-input--lg" style="width:220px" placeholder="Large" aria-label="Large"/>'], ["Textarea", "Multi-line text.", '<div class="ns-field" style="width:260px"><label class="ns-label">Notes</label><textarea class="ns-textarea">Rotating keys on Friday.</textarea></div>']],
      dd: ['<div class="ns-field" style="width:220px"><label class="ns-label">Email</label><input class="ns-input" aria-label="name@company.com" placeholder="name@company.com"/></div>', "Keep a visible label above the field at all times.", '<input class="ns-input" style="width:220px" placeholder="Email"/>', "Rely on placeholder text as the only label. It disappears on input."],
      tokens: [["--ns-field-bg", "Field fill (no border at rest)"], ["--ns-focus-field", "Focus border + 3px glow (blue/700)"], ["--ns-status-error", "Error border and placeholder"], ["--ns-status-warning", "Warning border and placeholder"], ["--ns-radius-sm", "Corner radius"]],
      sizes: [["Small", "32px", "Filters, table cells"], ["Medium", "36px", "Default"], ["Large", "48px", "Sign-in, primary search"]],
      props: [["label", "string", "-", "Visible label (required)"], ["size", "'s' | 'm' | 'l'", "'m'", "Height"], ["state", "'default' | 'error' | 'warning'", "'default'", "Validation"], ["helperText", "string", "-", "Guidance under the field"], ["disabled", "boolean", "false", "Disable"]],
      keyboard: [["Tab", "Moves focus into the field"], ["Esc", "Clears the field when a clear button is present"]],
      aria: ["Link helper and error text with <code>aria-describedby</code>.", "Set <code>aria-invalid=\"true\"</code> on error.", "Never remove the visible label. Placeholders are not labels."],
      react: "<TextInput id=\"cluster\" label=\"Cluster name\" size=\"m\" state={exists ? 'error' : 'default'}\n  helperText={exists ? 'Name already exists in this region.' : 'Lowercase, 3 to 24 characters.'} />",
    },
    {
      id: "select", name: "Select", cat: "Inputs", status: "Stable", figma: "4207:955",
      desc: "Select lets people choose one option from a list of 4 to 15 predefined values.",
      playground: {
        controls: [{ key: "state", label: "State", options: ["Default", "Error", "Disabled"] }],
        render: (s) => `<div class="ns-field${s.state === "Error" ? " is-error" : ""}" style="width:300px"><label class="ns-label" for="sel-1">Region</label><select class="ns-select" id="sel-1"${s.state === "Disabled" ? " disabled" : ""}><option>us-east-1</option><option>us-west-2</option><option>eu-central-1</option><option>ap-south-1</option></select><span class="ns-helper">${s.state === "Error" ? "Region is at capacity." : "Where new workloads are scheduled."}</span></div>`,
      },
      when: ["Choose one option from a medium-length list.", "Space is tight and options do not need comparison."],
      whenNot: ["Two or three options: use radio buttons.", "Over 15 options: use a searchable combo box."],
      variants: [["Default", "Native select with custom chevron.", '<div class="ns-field" style="width:220px"><label class="ns-label">Tier</label><select class="ns-select"><option>Gold</option><option>Silver</option></select></div>'], ["Inline", "Label beside field for toolbars.", '<label class="ns-label" style="display:flex;gap:8px;align-items:center">Show <select class="ns-select ns-input--sm" style="width:90px;min-height:32px"><option>25</option><option>50</option></select></label>']],
      dd: ['<div class="ns-field" style="width:200px"><label class="ns-label">Priority</label><select class="ns-select"><option>High</option><option>Medium</option><option>Low</option></select></div>', "Order options logically: severity, alphabetical, or frequency.", '<div class="ns-field" style="width:200px"><label class="ns-label">Enabled</label><select class="ns-select"><option>Yes</option><option>No</option></select></div>', "Use select for a binary choice. Use a toggle."],
      tokens: [["--ns-background-surface", "Field background"], ["--ns-border-default", "Border"], ["--ns-focus-ring", "Focus"]],
      sizes: [["Small", "32px", "Toolbars"], ["Medium", "40px", "Default"]],
      props: [["label", "string", "-", "Visible label"], ["options", "Option[]", "[]", "Values"], ["value", "string", "-", "Controlled value"], ["onChange", "(v) => void", "-", "Change handler"]],
      keyboard: [["Space / Enter", "Opens the list"], ["Arrow up / down", "Moves through options"], ["Type-ahead", "Jumps to matching option"]],
      aria: ["Native <code>&lt;select&gt;</code> gives full screen reader support for free.", "Associate the label with <code>for</code> / <code>id</code>."],
      react: "<Select id=\"region\" label=\"Region\" value={region} onChange={setRegion}>\n  <SelectItem value=\"us-east-1\" />\n  <SelectItem value=\"eu-central-1\" />\n</Select>",
    },
    {
      id: "dropdown", name: "Dropdown", cat: "Inputs", status: "New", figma: "1840:22807",
      desc: "Dropdowns present a list of options from which a user can select one option, or several. A selected option can represent a value in a form, or can be used as an action to filter or sort existing content.",
      axes: [["Trigger / Content", "Text (150x42), Icon (36x36), Two icons (176x42)"], ["Trigger / State", "Default, Hover, Disabled"], ["Menu / Items", "4, 5, 6, 7 (200 wide, +42 per item)"], ["List item", "Icon: No, Yes · Hovered: No, Yes (200x40)"]],
      doc: [["Placeholder", "A drop-down list should always have a label."], ["Width", "The width of the button can be customized appropriately for its context."], ["Icon", "Sometimes the icon next to the placeholder can be used to enhance the effect."], ["Disabled", "Button in a disabled state shows that an input field exists, but is not available in that circumstance. Usually this state is used to show the user that the action may become available later."]],
      playground: {
        controls: [{ key: "content", label: "Content", options: ["Text", "Two icons", "Icon"] }, { key: "state", label: "State", options: ["Default", "Hover", "Disabled"] }, { key: "items", label: "Items", options: ["4", "5", "6", "7"] }, { key: "icons", label: "Item icons", type: "bool", default: true }],
        render: (s) => {
          const gear = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>';
          const items = ["Newest first", "Oldest first", "Highest load", "Lowest load", "Region A to Z", "Status", "Owner"].slice(0, +s.items);
          const trig = s.content === "Icon" ? `<button class="ns-dd__trigger ns-dd__trigger--icon${s.state === "Hover" ? " is-hover" : ""}" aria-haspopup="listbox" aria-expanded="true" aria-label="Sort"${s.state === "Disabled" ? " disabled" : ""}>${gear}</button>` : `<button class="ns-dd__trigger${s.state === "Hover" ? " is-hover" : ""}" aria-haspopup="listbox" aria-expanded="true"${s.state === "Disabled" ? " disabled" : ""} style="min-width:${s.content === "Two icons" ? 176 : 150}px">${s.content === "Two icons" ? gear : ""}Sort by<span class="caret"></span></button>`;
          return `<div style="display:grid;gap:6px;justify-items:start">${trig}<ul class="ns-dd__menu is-static" role="listbox" aria-label="Sort by">${items.map((t, i) => `<li><button class="ns-dd__item${i === 1 ? " is-hover" : ""}" role="option" aria-selected="${i === 0}">${s.icons ? gear : ""}${t}</button></li>`).join("")}</ul></div>`;
        },
      },
      when: ["Sorting, filtering, and choosing one value from 4 to 7 options.", "Toolbars where a visible radio group would take too much room."],
      whenNot: ["Two or three options: use radio buttons.", "Long lists: use a searchable combo box."],
      variants: [["Trigger states", "Default, Hover, Disabled.", '<button class="ns-dd__trigger">Label<span class="caret"></span></button><button class="ns-dd__trigger is-hover">Label<span class="caret"></span></button><button class="ns-dd__trigger" disabled>Label<span class="caret"></span></button>'], ["Live", "Click to open.", '<div class="ns-dd" data-dd><button class="ns-dd__trigger" aria-haspopup="listbox" aria-expanded="false">Region<span class="caret"></span></button><ul class="ns-dd__menu" role="listbox"><li><button class="ns-dd__item" role="option" aria-selected="true">us-east-1</button></li><li><button class="ns-dd__item" role="option">eu-central-1</button></li><li><button class="ns-dd__item" role="option">ap-south-1</button></li><li><button class="ns-dd__item" role="option">sa-east-1</button></li></ul></div>']],
      dd: ['<button class="ns-dd__trigger">Sort by<span class="caret"></span></button>', "Always show a label on the trigger.", '<button class="ns-dd__trigger"><span class="caret"></span></button>', "Show an empty trigger with only a caret."],
      tokens: [["--ns-interactive-secondary-bg", "Trigger and menu fill (gray/8)"], ["--ns-interactive-secondary-hover", "Hover (gray/7)"], ["--ns-blue-700", "Selected item indicator"], ["--ns-radius-sm", "Radius"]],
      sizes: [["Trigger", "42px", "Text and two-icon triggers"], ["Icon trigger", "36px", "Toolbars"], ["List item", "40px", "Menu rows"]],
      props: [["label", "string", "-", "Trigger text"], ["items", "Item[]", "[]", "Options"], ["icon", "ReactNode", "-", "Leading icon"], ["multiple", "boolean", "false", "Multi-select"], ["onChange", "(v) => void", "-", "Handler"]],
      keyboard: [["Specimen", "The demo is static. These keys are the behavior to build."], ["Enter / Space", "Open menu"], ["Arrow up / down", "Move between items"], ["Enter", "Select item"], ["Esc", "Close and return focus"]],
      aria: ["Trigger has <code>aria-haspopup=\"listbox\"</code> and <code>aria-expanded</code>.", "Menu uses <code>role=\"listbox\"</code>, items <code>role=\"option\"</code> with <code>aria-selected</code>."],
      react: "<Dropdown label=\"Sort by\" icon={<Settings />} items={sorts} onChange={setSort} />",
    },
    {
      id: "checkbox", name: "Checkbox", cat: "Inputs", status: "Stable", figma: "1841:21803",
      desc: "Checkboxes select one or more options from a list, or toggle a single setting that applies on submit.",
      playground: {
        controls: [{ key: "state", label: "State", options: ["Group", "Indeterminate", "Disabled"] }],
        render: (s) => s.state === "Indeterminate"
          ? `<fieldset style="border:0;padding:0;margin:0;display:grid;gap:10px"><label class="ns-check"><input type="checkbox" data-indet/> All regions</label><div style="display:grid;gap:10px;padding-left:28px"><label class="ns-check"><input type="checkbox" checked/> us-east-1</label><label class="ns-check"><input type="checkbox"/> eu-central-1</label></div></fieldset>`
          : `<fieldset style="border:0;padding:0;margin:0;display:grid;gap:10px"><legend class="ns-label" style="margin-bottom:10px">Alert channels</legend><label class="ns-check"><input type="checkbox" checked${s.state === "Disabled" ? " disabled" : ""}/> Email</label><label class="ns-check"><input type="checkbox"${s.state === "Disabled" ? " disabled" : ""}/> Slack</label><label class="ns-check"><input type="checkbox" checked${s.state === "Disabled" ? " disabled" : ""}/> PagerDuty</label></fieldset>`,
        init: (root) => root.querySelectorAll("[data-indet]").forEach((c) => (c.indeterminate = true)),
      },
      when: ["Select several options from a list.", "Confirm a single agreement or setting that applies on submit."],
      whenNot: ["Choose exactly one option: use radio buttons.", "Settings that apply instantly: use a toggle."],
      variants: [["Checked / unchecked", "Standard.", '<label class="ns-check"><input type="checkbox" checked/> Checked</label><label class="ns-check"><input type="checkbox"/> Unchecked</label>'], ["Indeterminate", "Parent of a partially selected group.", '<label class="ns-check"><input type="checkbox" data-indet/> Partial</label>']],
      dd: ['<div style="display:grid;gap:8px"><label class="ns-check"><input type="checkbox" checked/> Email</label><label class="ns-check"><input type="checkbox"/> SMS</label></div>', "Stack options vertically for easy scanning.", '<label class="ns-check"><input type="checkbox"/> Do not not disable alerts</label>', "Write negative or double-negative labels."],
      tokens: [["--ns-interactive-primary", "Checked fill"], ["--ns-border-strong", "Unchecked border"], ["--ns-focus-ring", "Focus"], ["--ns-radius-xs", "Box radius"]],
      props: [["checked", "boolean", "false", "Selected"], ["indeterminate", "boolean", "false", "Partial state"], ["labelText", "string", "-", "Label"], ["disabled", "boolean", "false", "Disable"]],
      keyboard: [["Tab", "Moves between checkboxes"], ["Space", "Toggles the focused checkbox"]],
      aria: ["Wrap groups in <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code>.", "Indeterminate is set via the DOM property, exposed as <code>aria-checked=\"mixed\"</code>."],
      react: "<Checkbox id=\"email\" labelText=\"Email\" checked={email} onChange={setEmail} />",
    },
    {
      id: "radio-button", name: "Radio button", cat: "Inputs", status: "Stable", figma: "1842:24303",
      desc: "Radio buttons allow users to select a single option from a list of mutually exclusive options. All possible options are exposed up front for users to compare.",
      axes: [["Hovered", "No, Yes"], ["Selected", "Yes, No"], ["Disabled", "No, Yes"], ["Show label", "No (16x16), Yes"]],
      doc: [["Label", "Radio buttons should always have a label. When the label is not defined, a checkbox becomes standalone."], ["Selection", "Radio buttons can be selected, not selected and disabled."], ["Disabled", "Radio buttons in a disabled state show that a selection exists, but is not available in that circumstance. Usually this state is used to show the user that the action may become available later."]],
      playground: {
        controls: [{ key: "dir", label: "Orientation", options: ["Vertical", "Horizontal"] }, { key: "disabled", label: "Disabled", type: "bool" }],
        render: (s) => `<fieldset style="border:0;padding:0;margin:0"><legend class="ns-label" style="margin-bottom:10px">Deployment strategy</legend><div style="display:flex;gap:${s.dir === "Horizontal" ? "24px" : "12px"};flex-direction:${s.dir === "Horizontal" ? "row" : "column"};flex-wrap:wrap">${["Rolling", "Blue / green", "Canary"].map((l, i) => `<label class="ns-check ns-check--radio"><input type="radio" name="rb"${i === 0 ? " checked" : ""}${s.disabled ? " disabled" : ""}/> ${l}</label>`).join("")}</div></fieldset>`,
      },
      when: ["Two to five mutually exclusive options that benefit from being visible together."],
      whenNot: ["More than five options: use a dropdown.", "Multiple choices: use checkboxes."],
      variants: [["States", "Selected, unselected, disabled.", '<label class="ns-check ns-check--radio"><input type="radio" name="v1" checked/> Selected</label><label class="ns-check ns-check--radio"><input type="radio" name="v1"/> Not selected</label><label class="ns-check ns-check--radio"><input type="radio" disabled checked/> Disabled</label>']],
      dd: ['<div style="display:grid;gap:8px"><label class="ns-check ns-check--radio"><input type="radio" name="d1" checked/> Standard (recommended)</label><label class="ns-check ns-check--radio"><input type="radio" name="d1"/> Custom</label></div>', "Preselect the safest or most common option.", '<label class="ns-check ns-check--radio"><input type="radio" name="d2"/></label>', "Use a radio button without a label."],
      tokens: [["--ns-interactive-primary", "Selected ring (blue/500)"], ["--ns-blue-700", "Selected + hover ring"], ["--ns-gray-5", "Unselected ring"], ["--ns-text-secondary", "Label (white + semibold on hover)"]],
      props: [["name", "string", "-", "Group name"], ["value", "string", "-", "Option value"], ["checked", "boolean", "false", "Selected"], ["showLabel", "boolean", "true", "Label visibility"]],
      keyboard: [["Tab", "Moves into and out of the group"], ["Arrow keys", "Move selection within the group"]],
      aria: ["Group with <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code>.", "All radios in a group share one <code>name</code>."],
      react: "<RadioGroup legend=\"Deployment strategy\" name=\"strategy\" defaultValue=\"rolling\">\n  <Radio label=\"Rolling\" value=\"rolling\" />\n  <Radio label=\"Canary\" value=\"canary\" />\n</RadioGroup>",
    },
    {
      id: "toggle", name: "Switch", cat: "Inputs", status: "Stable", figma: "1842:24379",
      desc: "Switches allow users to turn an individual option on or off. They are usually used to activate or deactivate a specific setting.",
      axes: [["Selected", "On, Off"], ["Show label", "Yes, No"], ["State", "Default, Hover"], ["Disabled", "No, Yes"]],
      doc: [],
      playground: {
        controls: [{ key: "size", label: "Size", options: ["Figma 29x16", "Default", "Small"] }, { key: "on", label: "On", type: "bool", default: true }, { key: "disabled", label: "Disabled", type: "bool" }],
        render: (s) => `<label class="ns-toggle${s.size === "Small" ? " ns-toggle--sm" : s.size === "Default" ? "" : " ns-toggle--xs"}"><input type="checkbox" role="switch"${s.on ? " checked" : ""}${s.disabled ? " disabled" : ""}/> Real-time telemetry</label>`,
      },
      when: ["Binary settings that take effect immediately."], whenNot: ["Settings that need a Save action: use a checkbox."],
      variants: [["Sizes", "29x16 (Figma), 40x22, 32x18.", '<label class="ns-toggle ns-toggle--xs"><input type="checkbox" role="switch" checked/> 29x16</label><label class="ns-toggle"><input type="checkbox" role="switch" checked/> 40x22</label><label class="ns-toggle ns-toggle--sm"><input type="checkbox" role="switch"/> 32x18</label>']],
      dd: ['<label class="ns-toggle"><input type="checkbox" role="switch" checked/> Auto-scaling</label>', "Label the setting, not the state.", '<label class="ns-toggle"><input type="checkbox" role="switch"/> Off</label>', "Use On / Off as the label."],
      tokens: [["--ns-interactive-primary", "On track"], ["--ns-gray-6", "Off track"], ["--ns-duration-base", "Knob travel"]],
      props: [["checked", "boolean", "false", "On state"], ["size", "'xs' | 'sm' | 'md'", "'xs'", "Size"], ["label", "string", "-", "Setting name"]],
      keyboard: [["Tab", "Focus"], ["Space", "Toggle"]], aria: ["Use <code>role=\"switch\"</code> so screen readers say on/off."],
      react: "<Switch label=\"Real-time telemetry\" checked={on} onChange={setOn} />",
    },
    {
      id: "slider", name: "Slider", cat: "Inputs", status: "Stable", figma: "4207:1097",
      desc: "Sliders pick a value or range from a continuous or stepped scale.",
      playground: {
        controls: [{ key: "step", label: "Step", options: ["1", "10", "25"] }],
        render: (s) => `<div class="ns-field" style="width:360px"><label class="ns-label" for="sl-1">Alert threshold: <output>60</output>%</label><input class="ns-slider" id="sl-1" type="range" min="0" max="100" step="${s.step}" value="60" style="--_pct:60%"/><div class="ns-slider-ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div></div>`,
      },
      when: ["Adjust values where the relative position matters more than exact input: thresholds, opacity, zoom."],
      whenNot: ["Exact values are required: pair with or use a number input."],
      variants: [["With ticks", "Labeled scale.", '<div style="width:260px"><input class="ns-slider" type="range" value="30" style="--_pct:30%" aria-label="Value"/><div class="ns-slider-ticks"><span>0</span><span>100</span></div></div>']],
      dd: ['<div style="width:220px"><input class="ns-slider" type="range" value="40" style="--_pct:40%" aria-label="Opacity"/><div class="ns-slider-ticks"><span>0%</span><span>100%</span></div></div>', "Show the min, max, and current value.", '<input class="ns-slider" type="range" style="width:220px" aria-label="Value"/>', "Hide the scale when precision matters."],
      tokens: [["--ns-interactive-primary", "Filled track and thumb ring"], ["--ns-border-default", "Empty track"]],
      props: [["min", "number", "0", "Minimum"], ["max", "number", "100", "Maximum"], ["step", "number", "1", "Increment"], ["value", "number", "-", "Current value"]],
      keyboard: [["Arrow keys", "Move by one step"], ["Page up / down", "Move by 10 steps"], ["Home / End", "Jump to min / max"]],
      aria: ["Native range input exposes <code>aria-valuenow</code>, min, and max.", "Add <code>aria-valuetext</code> when units matter, e.g. \"60 percent\"."],
      react: "<Slider labelText=\"Alert threshold\" min={0} max={100} step={1} value={60} />",
    },
    {
      id: "date-picker", name: "Date picker", cat: "Inputs", status: "New", figma: "4215:37",
      desc: "Date pickers select a single date or a range from a calendar overlay, with typed input as an alternative.",
      playground: { controls: [{ key: "mode", label: "Mode", options: ["Range", "Single"] }], render: (s) => `<div style="display:grid;gap:12px"><div class="ns-field" style="width:280px"><label class="ns-label">${s.mode === "Range" ? "Reporting window" : "Start date"}</label><input class="ns-input" aria-label="${s.mode === "Range" ? "Reporting window" : "Start date"}" value="${s.mode === "Range" ? "09/10/2026 - 09/16/2026" : "09/10/2026"}"/></div>${cal()}</div>` },
      when: ["Choosing dates near today, or ranges where seeing the week helps."],
      whenNot: ["Dates far in the past like birthdays: use a typed input."],
      variants: [["Calendar", "Month grid with range fill.", cal()]],
      dd: ['<div class="ns-field" style="width:200px"><label class="ns-label">Date (MM/DD/YYYY)</label><input class="ns-input" value="09/24/2026"/></div>', "Show the expected format in the label.", '<div class="ns-field" style="width:200px"><label class="ns-label">Date</label><input class="ns-input" value="24.9.26"/></div>', "Leave the format ambiguous."],
      tokens: [["--ns-background-elevated", "Calendar surface"], ["--ns-interactive-primary", "Selected day"], ["--ns-background-selected", "Range fill"], ["--ns-teal-500", "Today ring"]],
      props: [["mode", "'single' | 'range'", "'single'", "Selection mode"], ["minDate / maxDate", "Date", "-", "Bounds"], ["onChange", "(dates) => void", "-", "Handler"]],
      keyboard: [["Arrow keys", "Move between days"], ["Page up / down", "Previous / next month"], ["Enter", "Select day"], ["Esc", "Close calendar"]],
      aria: ["Calendar grid uses <code>role=\"grid\"</code>; days are buttons with full date labels.", "The typed input is always available, so the calendar is never the only path."],
      react: "<DatePicker datePickerType=\"range\" onChange={setRange}>\n  <DatePickerInput id=\"start\" labelText=\"Start\" />\n  <DatePickerInput id=\"end\" labelText=\"End\" />\n</DatePicker>",
    },
    {
      id: "file-uploader", name: "File uploader", cat: "Inputs", status: "New", figma: "4217:37",
      desc: "File uploaders accept files by drag-and-drop or browse, and show progress and validation per file.",
      playground: { controls: [], block: true, render: () => `<div style="display:grid;gap:12px;max-width:460px;margin:0 auto"><label class="ns-drop" id="drop-demo"><span style="font-size:22px">↑</span><span>Drag files here or <b>browse</b></span><span class="ns-helper">CSV, JSON up to 25 MB</span><input type="file" class="sr-only" multiple/></label><div class="ns-file"><span class="ns-file__ext">CSV</span><div><b>accounts-q3.csv</b><div class="ns-progress" style="margin-top:6px"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:72%"></div></div></div></div><span class="ns-helper">72%</span></div><div class="ns-file"><span class="ns-file__ext" style="color:var(--ns-status-error)">PDF</span><div><b>contract.pdf</b><div class="ns-helper" style="color:var(--ns-status-error)">File type not supported</div></div><button class="ns-notice__close" aria-label="Remove">×</button></div></div>`,
        init: (root) => { const d = root.querySelector(".ns-drop"); if (!d) return; ["dragenter", "dragover"].forEach((e) => d.addEventListener(e, (ev) => { ev.preventDefault(); d.classList.add("is-over"); })); ["dragleave", "drop"].forEach((e) => d.addEventListener(e, (ev) => { ev.preventDefault(); d.classList.remove("is-over"); if (e === "drop") NS.toast("Files received", ev.dataTransfer.files.length + " file(s) dropped", "success"); })); } },
      when: ["Importing data files, attachments, and assets."],
      whenNot: ["Pasting short text: use a textarea."],
      variants: [],
      dd: ['<span class="ns-helper">CSV, JSON up to 25 MB</span>', "State accepted types and size limits before upload.", '<span class="ns-helper">Upload failed</span>', "Show generic errors without telling people how to fix them."],
      tokens: [["--ns-border-strong", "Drop zone border"], ["--ns-teal-500", "Drag-over highlight"], ["--ns-status-error", "Invalid file"]],
      props: [["accept", "string[]", "-", "MIME types"], ["maxSize", "number", "-", "Bytes"], ["multiple", "boolean", "false", "Multi-file"], ["onUpload", "(files) => void", "-", "Handler"]],
      keyboard: [["Tab", "Focus the drop zone"], ["Enter / Space", "Open the file browser"]],
      aria: ["The drop zone wraps a real file input, so keyboard and screen reader users never need drag-and-drop.", "Announce upload completion through a live region."],
      react: "<FileUploaderDropContainer accept={['.csv','.json']} multiple onAddFiles={upload} />",
    },
    {
      id: "search", name: "Search", cat: "Inputs", status: "Stable", figma: "4207:1033",
      desc: "Search lets people find content by keyword, inline in a page or globally from the header.",
      playground: { controls: [{ key: "size", label: "Size", options: ["Medium", "Large", "Small"] }], render: (s) => `<div class="ns-search" role="search" style="width:360px">${NS.icon.search}<input class="ns-input${s.size === "Large" ? " ns-input--lg" : s.size === "Small" ? " ns-input--sm" : ""}" type="search" placeholder="Search accounts, nodes, tickets" aria-label="Search"/><kbd>/</kbd></div>` },
      when: ["Large collections where browsing is slow.", "Filtering a table or list in place."],
      whenNot: ["Fewer than ~10 items: show them all."],
      variants: [["Global", "Opens a command palette. Try ⌘K on this site.", '<button class="hdr__search" style="min-width:260px" data-open-search>' + NS.icon.search + '<span class="label">Search docs</span><kbd>⌘K</kbd></button>']],
      dd: ['<div class="ns-search" style="width:220px">' + NS.icon.search + '<input class="ns-input" placeholder="Search nodes" aria-label="Search nodes"/></div>', "Say what is searchable in the placeholder.", '<div class="ns-search" style="width:220px">' + NS.icon.search + '<input class="ns-input" placeholder="Search" aria-label="Search"/></div>', "Use a generic placeholder when scope is narrow."],
      tokens: [["--ns-radius-full", "Pill shape"], ["--ns-text-tertiary", "Icon"], ["--ns-focus-ring", "Focus"]],
      props: [["placeholder", "string", "-", "Hint"], ["size", "'sm' | 'md' | 'lg'", "'md'", "Height"], ["onSearch", "(q) => void", "-", "Handler"]],
      keyboard: [["/ or ⌘K", "Open global search"], ["Esc", "Clear or close"], ["Arrow keys + Enter", "Pick a result"]],
      aria: ["Wrap in <code>role=\"search\"</code> and give the input an <code>aria-label</code>.", "Announce result counts in a polite live region."],
      react: "<Search size=\"md\" labelText=\"Search\" placeholder=\"Search accounts\" onChange={filter} />",
    },
    {
      id: "tag", name: "Tag", cat: "Status", status: "Stable", figma: "1840:22808",
      desc: "Tags allow users to categorize content. They can represent keywords or people, and are grouped to describe an item or a search request.",
      axes: [["Size", "Medium (36), Small (28)"], ["Emphasis", "Primary, Ghost"], ["Shape", "Rounded, Square"], ["State", "Informer & icon, Informer, Text, Icon"]],
      doc: [["Label", "Tags should always include a label. These can represent search terms, filters, or keywords etc."], ["Icon", "A tag can include an icon that can be used as an x-close icon or for additional actions."], ["Indicator", "Indicator allows you to identify tags."]],
      playground: {
        controls: [{ key: "state", label: "State", options: ["Informer & icon", "Informer", "Text", "Icon"] }, { key: "emph", label: "Emphasis", options: ["Primary", "Ghost"] }, { key: "shape", label: "Shape", options: ["Rounded", "Square"] }, { key: "size", label: "Size", options: ["Medium", "Small"] }, { key: "label", label: "Label", type: "text", default: "Training" }],
        render: (s) => { const more = '<button aria-label="More actions">⋮</button>'; const inf = /Informer/.test(s.state); const ico = /icon|Icon/.test(s.state); return `<span class="ns-tag${s.size === "Small" ? " ns-tag--sm" : ""}${s.emph === "Ghost" ? " ns-tag--ghost" : ""}${s.shape === "Square" ? " ns-tag--square" : ""}"><span class="ns-tag__ind"></span>${x(s.label)}${inf && s.size === "Medium" ? " <b>$650</b>" : ""}${ico ? more : ""}</span>`; },
      },
      when: ["Label metadata like environment, team, or tier.", "Show active filters that can be removed (icon as x-close)."],
      whenNot: ["System status like Active or Failed: use a badge."],
      variants: [["States", "Informer & icon, Informer, Text, Icon.", '<span class="ns-tag"><span class="ns-tag__ind"></span>Training <b>$650</b><button aria-label="More">⋮</button></span><span class="ns-tag"><span class="ns-tag__ind"></span>Training <b>$650</b></span><span class="ns-tag"><span class="ns-tag__ind"></span>Training</span><span class="ns-tag"><span class="ns-tag__ind"></span>Training<button aria-label="More">⋮</button></span>'], ["Emphasis and shape", "Primary or Ghost; Rounded or Square.", '<span class="ns-tag"><span class="ns-tag__ind"></span>Primary</span><span class="ns-tag ns-tag--ghost"><span class="ns-tag__ind"></span>Ghost</span><span class="ns-tag ns-tag--square"><span class="ns-tag__ind"></span>Square</span><span class="ns-tag ns-tag--ghost ns-tag--square ns-tag--sm"><span class="ns-tag__ind"></span>Small</span>'], ["Filter", "Dismissible.", '<span class="ns-tag ns-tag--sm"><span class="ns-tag__ind" style="--_c:var(--ns-status-info)"></span>Region: EU<button aria-label="Remove Region: EU">×</button></span><span class="ns-tag ns-tag--sm"><span class="ns-tag__ind" style="--_c:var(--ns-yellow-500)"></span>Tier: Gold<button aria-label="Remove Tier: Gold">×</button></span>'], ["Color chips", "Categorical chips for docs and dense tables.", '<span class="ns-tag ns-tag--teal">Teal</span><span class="ns-tag ns-tag--purple">Purple</span><span class="ns-tag ns-tag--blue">Blue</span><span class="ns-tag ns-tag--green">Green</span><span class="ns-tag ns-tag--yellow">Yellow</span><span class="ns-tag ns-tag--red">Red</span>']],
      dd: ['<span class="ns-tag"><span class="ns-tag__ind"></span>ML team</span>', "Keep labels to one or two words.", '<span class="ns-tag"><span class="ns-tag__ind"></span>This node is part of the legacy fleet and needs review</span>', "Put sentences in tags."],
      tokens: [["--ns-interactive-secondary-bg", "Primary fill"], ["--ns-gray-5", "Ghost border"], ["--ns-teal-500", "Indicator"], ["--ns-radius-full", "Rounded"], ["--ns-radius-sm", "Square"]],
      sizes: [["Medium", "36px", "Default"], ["Small", "28px", "Filters, dense rows"]],
      props: [["emphasis", "'primary' | 'ghost'", "'primary'", "Fill or outline"], ["shape", "'rounded' | 'square'", "'rounded'", "Radius"], ["size", "'m' | 's'", "'m'", "Height"], ["indicator", "color", "teal", "Leading dot"], ["value", "string", "-", "Informer value"], ["onAction", "() => void", "-", "Trailing icon action"]],
      keyboard: [["Tab", "Focus the trailing action"], ["Enter / Space", "Run the action or remove the filter"]],
      aria: ["Trailing buttons need a label that names the tag, e.g. <code>aria-label=\"Remove Region: EU\"</code>.", "The indicator color is never the only signal; the label carries meaning."],
      react: "<Tag emphasis=\"primary\" shape=\"rounded\" value=\"$650\" onAction={openMenu}>Training</Tag>",
    },
    {
      id: "badge", name: "Badge", cat: "Status", status: "Stable", figma: "1840:21692",
      desc: "Badges are designed to display a small amount of information for statuses and labels with color categorization.",
      axes: [["Size", "Small (20), Medium (24), Large (28)"], ["Icon", "Icon only, Icon left, Icon right, None"], ["Type", "Informative (violet), Positive (green), Negative (red)"], ["State", "Solid, Outline with icon, Outline"]],
      doc: [["Label", "Badges should always be as clear and quickly readable for the user. If the label is not defined, it is better to use only the icon."], ["Icon", "A badge can have an optional icon. The use of an icon adds an additional reinforcing meaning."], ["Size", "Three different sizes of badges: small, medium, large. The medium size is the standard and most commonly used option."], ["Semantic", "Informative, violet (active, in use, live, published). Positive, green (approved, complete, success, purchased, licensed). Negative, red (error, alert, rejected, failed)."]],
      playground: {
        controls: [{ key: "type", label: "Type", options: ["Informative", "Positive", "Negative"] }, { key: "style", label: "State", options: ["Solid", "Outline with icon", "Outline"] }, { key: "icon", label: "Icon", options: ["None", "Left", "Right", "Only"] }, { key: "size", label: "Size", options: ["Medium", "Small", "Large"] }],
        render: (s) => { const t = { Informative: "", Positive: " ns-badge--positive", Negative: " ns-badge--negative" }[s.type]; const lbl = { Informative: "Live", Positive: "Approved", Negative: "Failed" }[s.type]; const ic = { Informative: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="5"/></svg>', Positive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>', Negative: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>' }[s.type]; const icon = s.style === "Outline with icon" && s.icon === "None" ? "Left" : s.icon; return `<span class="ns-badge${t}${s.style !== "Solid" ? " ns-badge--outline" : ""}${s.size === "Small" ? " ns-badge--sm" : s.size === "Large" ? " ns-badge--lg" : ""}${icon === "Only" ? " ns-badge--icon" : ""}"${icon === "Only" ? ` role="img" aria-label="${lbl}"` : ""}>${icon === "Left" || icon === "Only" ? ic : ""}${icon === "Only" ? "" : lbl}${icon === "Right" ? ic : ""}</span>`; },
      },
      when: ["Object status in tables, cards, and headers.", "Short labels with semantic meaning."], whenNot: ["Categories and filters: use a tag."],
      variants: [["Types x state", "Solid, outline with icon, outline.", ["", " ns-badge--positive", " ns-badge--negative"].map((t) => `<span class="ns-badge${t}">Label</span><span class="ns-badge${t} ns-badge--outline">● Label</span><span class="ns-badge${t} ns-badge--outline">Label</span>`).join("")], ["Sizes", "20, 24, 28.", '<span class="ns-badge ns-badge--sm">Small</span><span class="ns-badge">Medium</span><span class="ns-badge ns-badge--lg">Large</span>'], ["Status dot", "Table-friendly indicator.", '<span class="ns-dot ns-dot--success">Active</span><span class="ns-dot ns-dot--warning">Pending</span><span class="ns-dot ns-dot--error">Critical</span><span class="ns-dot">Info</span>'], ["Count", "Numeric.", '<span style="display:inline-flex;gap:8px;align-items:center">Alerts <span class="ns-count">12</span></span>']],
      dd: ['<span class="ns-badge ns-badge--negative">Failed</span>', "Pair color with a clear word.", '<span class="ns-badge ns-badge--negative ns-badge--icon"></span>', "Use an empty colored badge to carry status."],
      tokens: [["--ns-purple-400", "Informative"], ["--ns-status-success", "Positive"], ["--ns-status-error", "Negative"], ["--ns-radius-sm", "Radius"]],
      sizes: [["Small", "20px", "Dense tables"], ["Medium", "24px", "Default"], ["Large", "28px", "Headers"]],
      props: [["type", "'informative' | 'positive' | 'negative'", "'informative'", "Semantic color"], ["variant", "'solid' | 'outline'", "'solid'", "Fill"], ["size", "'s' | 'm' | 'l'", "'m'", "Height"], ["icon", "ReactNode", "-", "Optional icon"]],
      keyboard: [["-", "Not interactive"]],
      aria: ["Badges are text, so screen readers read the label. Icon-only badges need <code>role=\"img\"</code> and <code>aria-label</code>."],
      react: "<Badge type=\"positive\" variant=\"outline\" icon={<Check />}>Approved</Badge>",
    },
    {
      id: "card", name: "Card", cat: "Containers", status: "Stable", figma: "4207:1138",
      desc: "Cards group related content and actions about a single subject. Clickable cards navigate as a whole.",
      playground: {
        controls: [{ key: "kind", label: "Kind", options: ["Default", "Elevated", "Clickable", "With strip"] }],
        render: (s) => `<div class="ns-card${s.kind === "Elevated" ? " ns-card--elevated" : s.kind === "Clickable" ? " ns-card--clickable" : ""}" style="width:320px">${s.kind === "With strip" ? '<div class="ns-card__strip">Account</div>' : ""}<h3 class="ns-card__title">Acme Corp</h3><p class="ns-card__body">Gold tier. 14 active integrations across 3 regions. Renewal in 42 days.</p><div style="display:flex;gap:8px"><span class="ns-dot ns-dot--success">Active</span></div>${s.kind === "Clickable" ? "" : '<div><button class="ns-btn ns-btn--sm ns-btn--tertiary">View details</button></div>'}</div>`,
      },
      when: ["Collections of similar objects to scan and compare.", "Dashboard tiles with one job each."],
      whenNot: ["Dense tabular data: use a data table."],
      variants: [["KPI tile", "Metric card for dashboards.", '<div class="ns-kpi" style="width:200px"><span class="ns-kpi__label">Active accounts</span><span class="ns-kpi__value">1,284</span><span class="ns-kpi__delta">↑ +6.2%</span></div>']],
      dd: ['<div class="ns-card" style="width:220px"><h3 class="ns-card__title">Acme</h3><p class="ns-card__body">One subject per card.</p></div>', "Keep one subject and one primary action per card.", '<div class="ns-card" style="width:220px"><button class="ns-btn ns-btn--sm">Edit</button><button class="ns-btn ns-btn--sm">Share</button><button class="ns-btn ns-btn--sm">Delete</button></div>', "Pack many primary actions into one card."],
      tokens: [["--ns-background-surface", "Default fill"], ["--ns-background-elevated", "Elevated fill"], ["--ns-elevation-02", "Elevated shadow"], ["--ns-radius-lg", "Radius"], ["--ns-space-7", "Padding"]],
      props: [["kind", "'default' | 'elevated' | 'clickable'", "'default'", "Style"], ["href", "string", "-", "Makes the card a link"]],
      keyboard: [["Tab", "Focus a clickable card"], ["Enter", "Open"]],
      aria: ["A clickable card is one <code>&lt;a&gt;</code>. Do not nest other interactive elements inside it."],
      react: "<Card kind=\"elevated\">\n  <CardTitle>Acme Corp</CardTitle>\n  <CardBody>Gold tier.</CardBody>\n</Card>",
    },
    {
      id: "data-table", name: "Data table", cat: "Data", status: "Stable", figma: "4213:46",
      desc: "Data tables organize large sets of records into rows and columns with sorting, selection, and batch actions.",
      playground: { block: true, controls: [{ key: "size", label: "Row size", options: ["Default", "Compact"] }, { key: "batch", label: "Selectable", type: "bool", default: true }, { key: "zebra", label: "Zebra", type: "bool" }], render: (s) => tableHtml(s) },
      when: ["Comparing many records across the same attributes.", "Bulk actions across selected rows."],
      whenNot: ["A handful of items with rich content: use cards."],
      variants: [["Simple table", "No toolbar or selection.", tableHtml({ size: "Compact" })]],
      dd: ['<span class="ns-helper">Revenue column right-aligned, monospace</span>', "Right-align numbers so magnitudes line up.", '<span class="ns-helper">Revenue column centered, proportional</span>', "Center numeric columns."],
      tokens: [["--ns-background-secondary", "Header row"], ["--ns-background-hover", "Row hover"], ["--ns-background-selected", "Selected row"], ["--ns-interactive-primary", "Batch action bar"], ["--ns-font-mono", "Numeric cells"]],
      sizes: [["Compact", "32px", "Monitoring, logs"], ["Default", "48px", "General data"]],
      props: [["rows", "Row[]", "[]", "Data"], ["headers", "Header[]", "[]", "Columns"], ["isSortable", "boolean", "true", "Sorting"], ["radio / selectable", "boolean", "false", "Selection"], ["size", "'compact' | 'default'", "'default'", "Row height"]],
      keyboard: [["Tab", "Moves between interactive cells"], ["Enter / Space on header", "Sorts the column"], ["Space on row checkbox", "Selects the row"]],
      aria: ["Sortable headers set <code>aria-sort</code>.", "Select-all checkbox is labeled and reflects mixed state.", "Batch bar announces the selected count."],
      react: "<DataTable rows={rows} headers={headers} isSortable>\n  {({ rows, headers, getTableProps }) => (\n    <Table {...getTableProps()}>...</Table>\n  )}\n</DataTable>",
    },
    {
      id: "avatar", name: "Avatar", cat: "Data", status: "Stable", figma: "1747:21338",
      desc: "Component for visual identification of users and companies.",
      axes: [["Shape", "Round, Square"], ["Avatar", "Photo, Initials, Memoji"], ["Size", "16, 20, 24, 28, 32, 36, 40, 48, 64"], ["Status", "Yes, No"]],
      doc: [["Shape", "The main type of component is the avatar in a circle. Additionally, you can use a square shape to cover all your design needs. The status icon is used to display various statuses."], ["Size", "The avatar can also be customized to fit your context. We offer nine different sizes."], ["Image", "Avatars can have a specific image, which is usually uploaded by the user or moderator. If the avatar does not have a photo or it is not uploaded, the Initials component is used instead. In rare cases, a company logo can be used."]],
      playground: { controls: [{ key: "type", label: "Avatar", options: ["Initials", "Memoji", "Photo"] }, { key: "shape", label: "Shape", options: ["Round", "Square"] }, { key: "size", label: "Size", options: ["16", "20", "24", "28", "32", "36", "40", "48", "64"], default: "64" }, { key: "status", label: "Status", type: "bool", default: true }], render: (s) => `<span class="ns-avatar ns-avatar--${s.size}${s.shape === "Square" ? " ns-avatar--square" : ""}${s.type === "Memoji" ? " ns-avatar--memoji" : ""}"${s.type === "Photo" ? ' style="background-image:linear-gradient(135deg,#ffb38a,#b36bff 60%,#2b1a55)"' : ""}${s.status ? ' data-status="online"' : ""} role="img" aria-label="Alex Park${s.status ? ", online" : ""}">${s.type === "Initials" ? "AP" : s.type === "Memoji" ? "\u{1F9D1}‍\u{1F4BB}" : ""}</span>` },
      when: ["Ownership, assignees, and presence."], whenNot: ["Decoration with no meaning."],
      variants: [["Sizes", "Nine sizes.", ["16", "20", "24", "28", "32", "36", "40", "48", "64"].map((z) => `<span class="ns-avatar ns-avatar--${z}">${+z >= 24 ? "AP" : ""}</span>`).join("")], ["Shape + status", "Round and square with presence.", '<span class="ns-avatar ns-avatar--48" data-status>AP</span><span class="ns-avatar ns-avatar--48 ns-avatar--square" data-status>AP</span><span class="ns-avatar ns-avatar--48 ns-avatar--memoji" style="--_m:#d9ccff">\u{1F469}‍\u{1F680}</span><span class="ns-avatar ns-avatar--48 ns-avatar--memoji ns-avatar--square" style="--_m:#c8f5dc">\u{1F9D4}</span>'], ["Group", "Stacked with overflow count.", '<div class="ns-avatar-group"><span class="ns-avatar">AK</span><span class="ns-avatar ns-avatar--brand">BM</span><span class="ns-avatar">CJ</span><span class="ns-avatar ns-avatar--brand">DL</span><span class="ns-avatar ns-avatar--more">+12</span></div>']],
      dd: ['<span class="ns-avatar" role="img" aria-label="Alex Park">AP</span>', "Fall back to initials when there is no photo.", '<span class="ns-avatar">?</span>', "Show a question mark for unknown people."],
      tokens: [["--ns-persian-500", "Initials fill (Accents/Persian blue)"], ["--ns-green-2", "Status dot (Green 2)"], ["--ns-radius-full", "Round"]],
      sizes: [["16 to 28", "16-28px", "Inline, tables"], ["32 to 40", "32-40px", "Lists, headers"], ["48 to 64", "48-64px", "Profiles, object headers"]],
      props: [["name", "string", "-", "Used for initials and label"], ["src", "string", "-", "Photo"], ["shape", "'round' | 'square'", "'round'", "Shape"], ["size", "16 ... 64", "40", "Size"], ["status", "'online' | 'away' | 'busy'", "-", "Presence"]],
      keyboard: [["-", "Not interactive unless wrapped in a button"]],
      aria: ["Use <code>role=\"img\"</code> with an <code>aria-label</code> that includes presence."],
      react: "<Avatar name=\"Alex Park\" shape=\"round\" size={40} status=\"online\" />",
    },
    {
      id: "progress", name: "Progress", cat: "Status", status: "Stable", figma: "4038:31350",
      desc: "Progress indicators show completion of a task: linear bars, rings for single metrics, and step indicators for flows.",
      playground: { controls: [{ key: "kind", label: "Kind", options: ["Bar", "Ring", "Steps", "Indeterminate"] }, { key: "value", label: "Value", options: ["30", "65", "80", "100"] }], render: (s) => s.kind === "Ring" ? `<div class="ns-ring" style="--_v:${s.value}" role="progressbar" aria-valuenow="${s.value}" aria-valuemin="0" aria-valuemax="100"><span>${s.value}%</span></div>` : s.kind === "Steps" ? `<ol class="ns-steps" style="width:520px"><li class="is-done"><b>Details</b>Complete</li><li class="is-done"><b>Access</b>Complete</li><li class="is-current" aria-current="step"><b>Review</b>In progress</li><li><b>Deploy</b>Not started</li></ol>` : `<div class="ns-progress${s.kind === "Indeterminate" ? " ns-progress--indeterminate" : ""}" style="width:360px"><div class="ns-progress__meta"><span>Migrating records</span><span>${s.kind === "Indeterminate" ? "" : s.value + "%"}</span></div><div class="ns-progress__track" role="progressbar" aria-label="Migrating records"${s.kind === "Indeterminate" ? "" : ` aria-valuenow="${s.value}" aria-valuemin="0" aria-valuemax="100"`}><div class="ns-progress__bar" style="--_v:${s.value}%"></div></div></div>` },
      when: ["Operations that take more than about a second.", "Multi-step flows."], whenNot: ["Instant actions."],
      variants: [["Colors", "Semantic bars.", '<div style="display:grid;gap:12px;width:260px"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:70%"></div></div><div class="ns-progress ns-progress--purple"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:30%"></div></div></div><div class="ns-progress ns-progress--warning"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:85%"></div></div></div></div>']],
      dd: ['<span class="ns-helper">Uploading 3 of 12 files</span>', "Say what is progressing.", '<span class="ns-helper">Please wait...</span>', "Leave people guessing."],
      tokens: [["--ns-gradient-brand", "Bar fill"], ["--ns-border-default", "Track"], ["--ns-duration-slow", "Fill transition"]],
      props: [["value", "number", "-", "0 to 100; omit for indeterminate"], ["label", "string", "-", "Accessible label"], ["kind", "'bar' | 'ring' | 'steps'", "'bar'", "Type"]],
      keyboard: [["-", "Not interactive"]],
      aria: ["Use <code>role=\"progressbar\"</code> with value attributes; omit values when indeterminate.", "Step indicators mark the current step with <code>aria-current=\"step\"</code>."],
      react: "<ProgressBar label=\"Migrating records\" value={65} />",
    },
    {
      id: "loading", name: "Loading", cat: "Status", status: "Stable", figma: "4038:31327",
      desc: "Spinners and skeletons show that content is loading and keep layout stable while it arrives.",
      playground: { controls: [{ key: "kind", label: "Kind", options: ["Skeleton", "Spinner"] }], render: (s) => s.kind === "Spinner" ? `<span class="ns-spin" role="status" aria-label="Loading"></span>` : `<div style="width:360px;display:grid;gap:10px" aria-busy="true" aria-label="Loading accounts"><div class="ns-skel" style="height:20px;width:60%"></div><div class="ns-skel" style="height:12px"></div><div class="ns-skel" style="height:12px;width:85%"></div><div class="ns-skel" style="height:80px;margin-top:6px"></div></div>` },
      when: ["Skeletons for page and card loads; spinners for small, local waits."], whenNot: ["Waits under 300ms: show nothing."],
      variants: [],
      dd: ['<div style="width:200px;display:grid;gap:8px"><div class="ns-skel" style="height:14px"></div><div class="ns-skel" style="height:14px;width:70%"></div></div>', "Match the skeleton to the real layout.", '<span class="ns-spin"></span><span class="ns-spin"></span><span class="ns-spin"></span>', "Show a spinner in every card at once."],
      tokens: [["--ns-background-elevated", "Skeleton base"], ["--ns-teal-500", "Spinner arc"]],
      props: [["kind", "'skeleton' | 'spinner'", "'skeleton'", "Type"]], keyboard: [["-", "Not interactive"]],
      aria: ["Containers set <code>aria-busy=\"true\"</code> while loading.", "Spinners use <code>role=\"status\"</code> with a label."],
      react: "<SkeletonText lines={3} />\n<Loading small withOverlay={false} />",
    },
    {
      id: "tabs", name: "Tabs", cat: "Navigation", status: "Stable", figma: "1842:24465",
      desc: "Use tabs to allow users to navigate easily between views within the same context.",
      axes: [["Icon", "Without, With"], ["Items", "2, 3, 4"]],
      doc: [["Anatomy", "Tab item (selected), Tab item, Tabs, Selection indicator, Divider, Tab view."], ["Label & Icons", "Tabs always use a label. Tabs use icons to enhance the effect and read quickly."], ["Selected", "The tab element has two states. The active (selected) tab is highlighted by the selection indicator at the bottom."]],
      playground: { controls: [{ key: "items", label: "Items", options: ["2", "3", "4"], default: "3" }, { key: "icon", label: "Icon", type: "bool" }, { key: "kind", label: "Style", options: ["Figma", "Pill"] }], render: (s) => { const star = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/></svg>'; return `<div class="ns-tabs ns-tabs--fill${s.kind === "Pill" ? " ns-tabs--pill" : ""}" role="tablist" style="width:${s.kind === "Pill" ? "auto" : "375px"}">${["Overview", "Nodes", "Access", "Audit log"].slice(0, +s.items).map((t, i) => `<button class="ns-tab" role="tab" aria-selected="${i === 0}">${s.icon ? star : ""}${t}</button>`).join("")}</div>`; } },
      when: ["Two to four peer views of the same object."], whenNot: ["Sequential steps: use a progress indicator.", "Top-level navigation: use side navigation."],
      variants: [["With count", "Badges inside tabs.", '<div class="ns-tabs" role="tablist"><button class="ns-tab" role="tab" aria-selected="true">Overview</button><button class="ns-tab" role="tab" aria-selected="false">Nodes <span class="ns-count">4</span></button></div>']],
      dd: ['<div class="ns-tabs" role="tablist"><button class="ns-tab" aria-selected="true">Overview</button><button class="ns-tab">Logs</button></div>', "Use short, parallel nouns.", '<div class="ns-tabs"><button class="ns-tab" aria-selected="true">Click here to see overview</button></div>', "Write long or action-style tab labels."],
      tokens: [["--ns-blue-700", "Selection indicator (3px)"], ["--ns-gray-8", "Divider"], ["--ns-gray-4", "Inactive label"], ["--ns-text-primary", "Selected label"]],
      props: [["items", "{label, icon}[]", "[]", "2 to 4 tabs"], ["selectedIndex", "number", "0", "Active tab"], ["onChange", "(i) => void", "-", "Handler"]],
      keyboard: [["Arrow left / right", "Move between tabs"], ["Home / End", "First / last tab"], ["Tab", "Moves into the panel"]],
      aria: ["<code>role=\"tablist\"</code>, <code>role=\"tab\"</code>, <code>aria-selected</code>, and <code>aria-controls</code> pointing at each <code>role=\"tabpanel\"</code>."],
      react: "<Tabs items={[{ label: 'Overview', icon: <Star /> }, { label: 'Nodes' }]} />",
    },
    {
      id: "breadcrumb", name: "Breadcrumb", cat: "Navigation", status: "Stable", figma: "4208:1020",
      desc: "Breadcrumbs show where the current page sits in the hierarchy and let people move up levels.",
      playground: { controls: [{ key: "sep", label: "Separator", options: ["Slash", "Chevron"] }], render: (s) => `<nav aria-label="Breadcrumb"><ol class="ns-breadcrumb${s.sep === "Chevron" ? " ns-breadcrumb--chevron" : ""}"><li><a href="#/">Accounts</a></li><li><a href="#/">Acme Corp</a></li><li><a href="#/">Integrations</a></li><li aria-current="page">CRM sync</li></ol></nav>` },
      when: ["Hierarchies three or more levels deep."], whenNot: ["Flat sites or single-level apps."],
      variants: [], dd: ['<ol class="ns-breadcrumb"><li><a href="#/">Accounts</a></li><li aria-current="page">Acme</li></ol>', "End with the current page, not a link.", '<ol class="ns-breadcrumb"><li><a href="#/">Home</a></li></ol>', "Show a breadcrumb with one item."],
      tokens: [["--ns-text-link", "Links"], ["--ns-text-disabled", "Separator"]],
      props: [["items", "{label, href}[]", "[]", "Trail"], ["noTrailingSlash", "boolean", "true", "Separator after last"]],
      keyboard: [["Tab", "Moves between links"]], aria: ["Wrap in <code>&lt;nav aria-label=\"Breadcrumb\"&gt;</code>; mark the last item <code>aria-current=\"page\"</code>."],
      react: "<Breadcrumb>\n  <BreadcrumbItem href=\"/accounts\">Accounts</BreadcrumbItem>\n  <BreadcrumbItem isCurrentPage>Acme Corp</BreadcrumbItem>\n</Breadcrumb>",
    },
    {
      id: "pagination", name: "Pagination", cat: "Navigation", status: "Stable", figma: "4038:31293",
      desc: "Pagination splits long collections into pages with page size control and position feedback.",
      playground: { controls: [{ key: "kind", label: "Kind", options: ["Numbered", "Prev / next"] }], render: (s) => s.kind === "Numbered" ? `<nav class="ns-pagination" aria-label="Pagination"><span style="margin-right:12px">Rows <select class="ns-select" style="width:72px;min-height:32px;display:inline-block"><option>25</option><option>50</option></select></span><button class="ns-page" disabled aria-label="Previous page">‹</button><button class="ns-page" aria-current="page">1</button><button class="ns-page">2</button><button class="ns-page">3</button><span>…</span><button class="ns-page">12</button><button class="ns-page" aria-label="Next page">›</button><span style="margin-left:12px">1-25 of 288</span></nav>` : `<nav class="ns-pagination" aria-label="Pagination"><button class="ns-btn ns-btn--sm ns-btn--tertiary" disabled>Previous</button><span style="margin:0 12px">Page 1 of 12</span><button class="ns-btn ns-btn--sm ns-btn--tertiary">Next</button></nav>` },
      when: ["Tables and lists over ~50 items."], whenNot: ["Feeds where infinite scroll fits better."],
      variants: [], dd: ['<span class="ns-helper">1-25 of 288</span>', "Show position and total.", '<span class="ns-helper">Page 1</span>', "Hide how much content exists."],
      tokens: [["--ns-interactive-primary", "Current page"], ["--ns-background-hover", "Hover"]],
      props: [["page", "number", "1", "Current"], ["pageSize", "number", "25", "Rows per page"], ["totalItems", "number", "-", "Total"]],
      keyboard: [["Tab", "Moves across controls"], ["Enter", "Go to page"]], aria: ["Wrap in <code>&lt;nav aria-label=\"Pagination\"&gt;</code>; current page uses <code>aria-current=\"page\"</code>."],
      react: "<Pagination page={1} pageSize={25} pageSizes={[25, 50, 100]} totalItems={288} />",
    },
    {
      id: "side-navigation", name: "Side navigation", cat: "Navigation", status: "Stable", figma: "4212:37",
      desc: "Side navigation is the primary way to move through an app, with collapsible groups for large information spaces.",
      playground: { controls: [], render: () => `<nav class="ns-sidenav" aria-label="App"><div class="brand" style="padding:6px 12px 10px"><span class="brand__dot"></span>NORTHSTAR</div><div class="ns-sidenav__group">Operate</div><a href="#/" aria-current="page">Dashboard</a><a href="#/">Accounts <span class="ns-count">3</span></a><a href="#/">Approvals</a><div class="ns-sidenav__group">Configure</div><a href="#/">Integrations</a><a href="#/">Access</a><a href="#/">Settings</a></nav>` },
      when: ["Apps with five or more top-level destinations."], whenNot: ["Two or three destinations: use tabs or header links."],
      variants: [], dd: ['<span class="ns-helper">Groups: Operate, Configure</span>', "Group items by task.", '<span class="ns-helper">Groups: Misc, Other, More</span>', "Use vague group names."],
      tokens: [["--ns-background-shell", "Rail"], ["--ns-background-selected", "Current item"], ["--ns-text-accent", "Current label"]],
      props: [["items", "NavItem[]", "[]", "Tree"], ["expanded", "boolean", "true", "Rail state"]],
      keyboard: [["Tab", "Moves through links"], ["Enter", "Opens link or toggles group"]],
      aria: ["Use <code>&lt;nav&gt;</code> with a label; current link sets <code>aria-current=\"page\"</code>."],
      react: "<SideNav aria-label=\"App\">\n  <SideNavLink href=\"/\" isActive>Dashboard</SideNavLink>\n</SideNav>",
    },
    {
      id: "modal", name: "Modal", cat: "Overlays", status: "Stable", figma: "4211:201",
      desc: "Modals focus attention on a single task or decision and block the rest of the page until dismissed.",
      playground: { controls: [{ key: "size", label: "Size", options: ["Medium", "Small", "Large"] }], render: (s) => `<div style="display:grid;gap:20px;justify-items:center;width:100%"><div class="ns-modal ns-modal--inline${s.size === "Small" ? " ns-modal--sm" : s.size === "Large" ? " ns-modal--lg" : ""}" role="dialog" aria-labelledby="mdl-t"><div class="ns-modal__head"><div><p class="ns-modal__label">Account access</p><h2 class="ns-modal__title" id="mdl-t">Revoke API credentials?</h2></div><button class="icon-btn" aria-label="Close">×</button></div><div class="ns-modal__body">Revoking credentials for Acme Corp stops 14 active integrations immediately.</div><div class="ns-modal__foot"><button class="ns-btn ns-btn--tertiary">Cancel</button><button class="ns-btn ns-btn--danger">Revoke</button></div></div><button class="ns-btn ns-btn--tertiary" data-open-modal>Open live modal</button></div>` },
      when: ["Confirming destructive or irreversible actions.", "Short, focused tasks that need an answer now."], whenNot: ["Long forms: use a full page or side panel.", "Non-blocking info: use a notification."],
      variants: [], dd: ['<button class="ns-btn ns-btn--tertiary">Cancel</button><button class="ns-btn ns-btn--danger">Revoke</button>', "Label actions with the verb: Revoke, Delete, Publish.", '<button class="ns-btn ns-btn--tertiary">No</button><button class="ns-btn">Yes</button>', "Use Yes / No. People skim buttons, not questions."],
      tokens: [["--ns-background-elevated", "Surface"], ["--ns-elevation-04", "Shadow"], ["--ns-radius-xl", "Radius"], ["--ns-duration-slow + --ns-easing-enter", "Entrance"]],
      sizes: [["Small", "400px", "Confirmations"], ["Medium", "520px", "Default"], ["Large", "760px", "Short forms"]],
      props: [["open", "boolean", "false", "Visibility"], ["danger", "boolean", "false", "Destructive styling"], ["primaryButtonText", "string", "-", "Action"], ["onRequestClose", "() => void", "-", "Close"]],
      keyboard: [["Tab / Shift+Tab", "Cycles within the modal (focus trap)"], ["Esc", "Closes"], ["Enter", "Activates focused button"]],
      aria: ["<code>role=\"dialog\"</code>, <code>aria-modal=\"true\"</code>, <code>aria-labelledby</code> the title.", "Focus moves in on open and returns to the trigger on close. Try the live modal."],
      react: "<Modal open={open} danger modalHeading=\"Revoke API credentials?\" primaryButtonText=\"Revoke\" secondaryButtonText=\"Cancel\" onRequestClose={close} />",
    },
    {
      id: "tooltip", name: "Tooltip", cat: "Overlays", status: "Stable", figma: "1846:24506",
      desc: "Tooltips show contextual help or information about specific components when a user hovers or focuses on them.",
      axes: [["Placement", "N, NW, NE, S, E, W"], ["Icon", "Yes, No"]],
      doc: [],
      playground: { controls: [{ key: "place", label: "Placement", options: ["nw", "n", "ne", "s", "e", "w"] }, { key: "icon", label: "Icon", type: "bool", default: true }], render: (s) => `<span class="ns-tooltip" role="tooltip" data-place="${s.place}">${s.icon ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>' : ""}This is a tooltip on the ${{ nw: "North West", n: "North", ne: "North East", s: "South", e: "East", w: "West" }[s.place]} side</span>` },
      when: ["Labeling icon-only buttons.", "Brief definitions of terms."], whenNot: ["Essential info or anything interactive: use a popover."],
      variants: [["Live hover", "Hover or focus the button.", '<span class="ns-tip"><button class="ns-btn ns-btn--outline ns-btn--icon" aria-describedby="tt-1" aria-label="Refresh">↻</button><span class="ns-tip__bubble" role="tooltip" id="tt-1">Refresh telemetry</span></span>']],
      dd: ['<span class="ns-tooltip" data-place="n">Copy ID</span>', "Keep it to a few words.", '<span class="ns-helper">Tooltip with a link and a button inside</span>', "Put interactive content in a tooltip."],
      tokens: [["--ns-background-inverse", "Bubble"], ["--ns-text-inverse", "Text"], ["--ns-radius-sm", "Radius"]],
      sizes: [["Max width", "264px", "Wraps to two lines"]],
      props: [["label", "string", "-", "Text"], ["placement", "'n' | 'nw' | 'ne' | 's' | 'e' | 'w'", "'n'", "Placement"], ["icon", "boolean", "false", "Leading info icon"]],
      keyboard: [["Tab", "Focusing the trigger shows the tooltip"], ["Esc", "Dismisses"]], aria: ["Trigger references the bubble with <code>aria-describedby</code>; bubble has <code>role=\"tooltip\"</code>."],
      react: "<Tooltip label=\"Refresh telemetry\" placement=\"nw\" icon>\n  <IconButton icon={<Renew />} />\n</Tooltip>",
    },
    {
      id: "popover", name: "Popover", cat: "Overlays", status: "Stable", figma: "4210:129",
      desc: "Popovers show richer, interactive content anchored to a trigger, such as menus and quick filters.",
      playground: { controls: [], render: () => `<div class="ns-popover"><button class="ns-btn ns-btn--tertiary" data-popover aria-haspopup="menu">Actions ▾</button><div class="ns-popover__panel" style="padding:4px"><ul class="ns-menu" role="menu"><li><button role="menuitem">Duplicate</button></li><li><button role="menuitem">Export CSV</button></li><li><button role="menuitem" style="color:var(--ns-status-error)">Archive</button></li></ul></div></div>` },
      when: ["Overflow menus, quick filters, small forms."], whenNot: ["Blocking decisions: use a modal."],
      variants: [], dd: ['<span class="ns-helper">3 to 7 menu items</span>', "Keep menus short and grouped.", '<span class="ns-helper">20 ungrouped menu items</span>', "Hide your whole navigation in a popover."],
      tokens: [["--ns-background-elevated", "Panel"], ["--ns-elevation-02", "Shadow"], ["--ns-radius-lg", "Radius"]],
      props: [["open", "boolean", "false", "Visibility"], ["align", "string", "'bottom-start'", "Placement"]],
      keyboard: [["Enter / Space", "Open"], ["Arrow keys", "Move between items"], ["Esc", "Close and return focus"]], aria: ["Trigger has <code>aria-haspopup</code> and <code>aria-expanded</code>; menus use <code>role=\"menu\"</code>."],
      react: "<OverflowMenu>\n  <OverflowMenuItem itemText=\"Duplicate\" />\n  <OverflowMenuItem itemText=\"Archive\" isDelete />\n</OverflowMenu>",
    },
    {
      id: "notification", name: "Notification", cat: "Feedback", status: "Stable", figma: "4209:150",
      desc: "Notifications communicate system messages: inline in context, or as toasts that appear and dismiss themselves.",
      playground: { controls: [{ key: "kind", label: "Severity", options: ["Info", "Success", "Warning", "Error"] }], render: (s) => { const k = s.kind.toLowerCase(); const m = { info: ["Portal update available", "v1.4.0 is ready to deploy."], success: ["Sync complete", "2,418 records updated."], warning: ["Quota at 85%", "Upgrade before the next billing cycle."], error: ["Deployment failed", "Health check timed out on node 3."] }[k]; return `<div style="display:grid;gap:16px;justify-items:center;width:100%"><div class="ns-notice ns-notice--${k}" role="${k === "error" ? "alert" : "status"}" style="width:440px"><span class="ns-notice__icon">${{ info: "i", success: "✓", warning: "!", error: "×" }[k]}</span><div><p class="ns-notice__title">${m[0]}</p><p class="ns-notice__body">${m[1]}</p></div><button class="ns-notice__close" aria-label="Dismiss">×</button></div><button class="ns-btn ns-btn--tertiary ns-btn--sm" data-toast="${m[0]}" data-kind="${k}">Fire as toast</button></div>`; } },
      when: ["Inline: messages tied to a section.", "Toast: confirmation of a completed action."], whenNot: ["Critical, blocking issues: use a modal."],
      variants: [], dd: ['<span class="ns-helper">"Sync failed. Check the API key in Settings."</span>', "Say what happened and what to do next.", '<span class="ns-helper">"Error 0x80004005"</span>', "Show raw error codes alone."],
      tokens: [["--ns-status-info / success / warning / error", "Accent, border, tint"], ["--ns-elevation-03", "Toast shadow"]],
      props: [["kind", "'info' | 'success' | 'warning' | 'error'", "'info'", "Severity"], ["title", "string", "-", "Heading"], ["subtitle", "string", "-", "Body"], ["timeout", "number", "0", "Auto-dismiss (toast)"]],
      keyboard: [["Tab", "Focus dismiss or action"], ["Enter", "Dismiss"]], aria: ["Errors use <code>role=\"alert\"</code>; others use <code>role=\"status\"</code> so they are announced politely."],
      react: "<InlineNotification kind=\"warning\" title=\"Quota at 85%\" subtitle=\"Upgrade before the next billing cycle.\" />",
    },
    {
      id: "alert-banner", name: "Alert banner", cat: "Feedback", status: "Stable", figma: "1727:18329",
      desc: "In-line alerts display a non-modal message associated with objects in a view.",
      axes: [["Type", "Default, Accent, Error, Success, Warning"], ["Buttons", "Yes, No"], ["Description", "Yes, No"]],
      doc: [["Message text", "To be as clear and quick to read as possible, the messages in Alerts should be short."], ["Dismissible", "The banner can be closed at any time. Therefore, it contains a close button."], ["Semantic variants", "The alert banner always has a meaning, so we use color coding. We suggest using five options for different situations."]],
      playground: {
        block: true,
        controls: [{ key: "type", label: "Type", options: ["Default", "Accent", "Error", "Success", "Warning"] }, { key: "buttons", label: "Buttons", type: "bool", default: true }, { key: "desc", label: "Description", type: "bool", default: true }],
        render: (s) => { const t = s.type.toLowerCase(); const ic = { default: "M12 16v-4M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", accent: "M12 16v-4M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", error: "M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", success: "m8 12 3 3 5-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", warning: "M12 9v4m0 4h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" }[t]; const btns = `<button class="ns-btn ns-btn--outline">Button example</button><button class="ns-btn ns-btn--ghost">Button example</button>`; return `<div class="ns-alert ns-alert--${t}${s.desc ? "" : " ns-alert--compact"}" role="${t === "error" ? "alert" : "status"}" style="max-width:1152px"><span class="ns-alert__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="${ic}"/></svg></span><div><p class="ns-alert__title">The title identifies what happened</p>${s.desc ? `<p class="ns-alert__desc">The body content lets the user know why, and how to remedy or proceed.</p>` : ""}${s.buttons && s.desc ? `<div class="ns-alert__actions">${btns}</div>` : ""}</div><div class="ns-alert__end">${s.buttons && !s.desc ? btns : ""}<button class="ns-alert__close" aria-label="Dismiss">×</button></div></div>`; },
      },
      when: ["Messages tied to a view or object.", "App-wide notices when placed above the content."], whenNot: ["Transient confirmations: use a toast notification."],
      variants: [["All types", "Default, Accent, Error, Success, Warning.", ["default", "accent", "error", "success", "warning"].map((t) => `<div class="ns-alert ns-alert--${t} ns-alert--compact" style="width:100%"><span class="ns-alert__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg></span><p class="ns-alert__title">${t[0].toUpperCase() + t.slice(1)}: the title identifies what happened</p><div class="ns-alert__end"><button class="ns-alert__close" aria-label="Dismiss">×</button></div></div>`).join("")]],
      dd: ['<span class="ns-helper">"Sync failed. Check the API key in Settings."</span>', "Say what happened and how to proceed.", '<span class="ns-helper">Three stacked banners</span>', "Stack several banners."],
      tokens: [["--ns-navy-900", "Default fill"], ["--ns-blue-500", "Accent fill"], ["--ns-red-400", "Error accent"], ["--ns-green-500", "Success accent"], ["--ns-purple-500", "Warning accent"], ["--ns-radius-sm", "Radius"]],
      sizes: [["Buttons + description", "120px", "Full message with actions"], ["Description only", "76px", "Default"], ["Buttons, no description", "56px", "Inline actions"], ["Title only", "52px", "Compact"]],
      props: [["type", "'default' | 'accent' | 'error' | 'success' | 'warning'", "'default'", "Semantic type"], ["title", "string", "-", "What happened"], ["description", "string", "-", "Why, and how to proceed"], ["actions", "Action[]", "[]", "Up to two buttons"], ["onClose", "() => void", "-", "Dismiss"]],
      keyboard: [["Tab", "Focus actions and close"], ["Enter", "Activate"]], aria: ["Errors use <code>role=\"alert\"</code>; others use <code>role=\"status\"</code>."],
      react: "<AlertBanner type=\"error\" title=\"The title identifies what happened\"\n  description=\"The body content lets the user know why, and how to remedy or proceed.\"\n  actions={[{ label: 'Retry' }, { label: 'Details', kind: 'ghost' }]} onClose={dismiss} />",
    },
    {
      id: "accordion", name: "Accordion", cat: "Containers", status: "Stable", figma: "4208:871",
      desc: "Accordions stack sections of content that expand and collapse to save space.",
      playground: { block: true, controls: [], render: () => `<div class="ns-accordion" style="max-width:640px;margin:0 auto"><details open><summary>What counts as an active account?</summary><div class="ns-accordion__body">Any account with at least one integration that synced in the last 30 days.</div></details><details><summary>How are tiers calculated?</summary><div class="ns-accordion__body">Tier is based on trailing twelve-month revenue, recalculated nightly.</div></details><details><summary>Can I export audit logs?</summary><div class="ns-accordion__body">Yes. Admins can export CSV or stream to a SIEM.</div></details></div>` },
      when: ["FAQs, settings groups, long forms split by topic."], whenNot: ["Content everyone needs: show it."],
      variants: [], dd: ['<span class="ns-helper">Headers phrased as questions or topics</span>', "Make headers scannable.", '<span class="ns-helper">An accordion inside an accordion</span>', "Nest accordions."],
      tokens: [["--ns-border-subtle", "Dividers"], ["--ns-text-accent", "Open indicator"], ["--ns-duration-base", "Indicator rotation"]],
      props: [["align", "'start' | 'end'", "'end'", "Indicator side"], ["open", "boolean", "false", "Per item"]],
      keyboard: [["Tab", "Moves between headers"], ["Enter / Space", "Toggle section"]], aria: ["Native <code>&lt;details&gt;/&lt;summary&gt;</code> exposes expanded state automatically."],
      react: "<Accordion>\n  <AccordionItem title=\"How are tiers calculated?\">...</AccordionItem>\n</Accordion>",
    },
    {
      id: "divider", name: "Divider", cat: "Containers", status: "Stable", figma: "4205:883",
      desc: "Dividers separate groups of content horizontally, vertically, or with a label.",
      playground: { block: true, controls: [{ key: "kind", label: "Kind", options: ["Horizontal", "Labeled", "Vertical"] }], render: (s) => s.kind === "Vertical" ? `<div style="display:flex;height:40px;align-items:center;justify-content:center">Nodes<hr class="ns-divider ns-divider--v"/>Pods<hr class="ns-divider ns-divider--v"/>Services</div>` : s.kind === "Labeled" ? `<div class="ns-divider-label" style="max-width:480px;margin:0 auto">Or continue with</div>` : `<div style="max-width:480px;margin:0 auto"><p style="margin:0">Section one</p><hr class="ns-divider"/><p style="margin:0">Section two</p></div>` },
      when: ["Separating groups when spacing alone is not enough."], whenNot: ["Between every list item: use spacing."],
      variants: [], dd: ['<span class="ns-helper">Spacing first, divider second</span>', "Try whitespace first.", '<span class="ns-helper">Dividers between every row</span>', "Overuse dividers."],
      tokens: [["--ns-border-subtle", "Line"], ["--ns-space-5", "Margin"]], props: [["orientation", "'horizontal' | 'vertical'", "'horizontal'", "Direction"]], keyboard: [["-", "Not interactive"]], aria: ["Use <code>&lt;hr&gt;</code> for semantic breaks; purely visual lines can be CSS borders."],
      react: "<Divider />",
    },
    {
      id: "icon-button", name: "Icon button", cat: "Actions", status: "New", figma: "4466:661",
      desc: "A square, icon-only button for toolbars, table rows and dense headers. Every icon button needs an accessible name. Add a tooltip for any icon that is not widely understood.",
      axes: [["Hierarchy", "Primary, Secondary, Ghost, Danger"], ["Size", "S (32), M (40), L (48)"], ["Icon", "Swap the glyph"], ["State", "Default, Hover, Pressed, Focus, Disabled"]],
      doc: [["Choosing the icon", "Use an icon only when most people already read its meaning, such as edit, more or close. Pair anything less clear with a label."], ["Where it fits", "Ghost icon buttons suit table rows and toolbars. Use a labeled Button for page-level actions."]],
      playground: {
        controls: [
          { key: "hierarchy", label: "Hierarchy", options: ["Primary", "Secondary", "Ghost", "Danger"] },
          { key: "size", label: "Size", options: ["M", "S", "L"] },
          { key: "state", label: "State", options: ["Default", "Hover", "Pressed", "Focus", "Disabled"] },
          { key: "icon", label: "Icon", options: ["More", "Edit", "Send"] },
        ],
        render: (s) => {
          const k = { Primary: "", Secondary: " ns-btn--secondary", Ghost: " ns-btn--ghost", Danger: " ns-btn--danger" }[s.hierarchy];
          const z = { S: " ns-btn--sm", L: " ns-btn--lg", M: "" }[s.size];
          const st = { Hover: " is-hover", Pressed: " is-pressed", Focus: " is-focus", Default: "", Disabled: "" }[s.state];
          const g = { More: "more", Edit: "edit", Send: "send" }[s.icon];
          return `<button class="ns-btn ns-btn--icon${k}${z}${st}" aria-label="${s.icon} action"${s.state === "Disabled" ? " disabled" : ""}>${cmpIcon(g, s.size === "L" ? 20 : 16)}</button>`;
        },
      },
      when: ["Use Ghost in table rows and toolbars where space is tight.", "Show a tooltip with the action name on hover and focus.", "Use the L size on touch surfaces so the target stays at 48px."],
      whenNot: ["Do not use for primary page actions. Use a Button with a label.", "Do not drop the accessible name. Icon-only buttons need aria-label."],
      variants: [
        ["Hierarchy", "Primary, Secondary, Ghost and Danger share one square shape.", `<div style="display:flex;gap:8px;align-items:center"><button class="ns-btn ns-btn--icon" aria-label="Edit">${cmpIcon("edit")}</button><button class="ns-btn ns-btn--secondary ns-btn--icon" aria-label="Edit">${cmpIcon("edit")}</button><button class="ns-btn ns-btn--ghost ns-btn--icon" aria-label="Edit">${cmpIcon("edit")}</button><button class="ns-btn ns-btn--danger ns-btn--icon" aria-label="Delete">${cmpIcon("close")}</button></div>`],
        ["Sizes", "S 32, M 40, L 48. Square at every size.", `<div style="display:flex;gap:8px;align-items:center"><button class="ns-btn ns-btn--secondary ns-btn--icon ns-btn--sm" aria-label="More actions">${cmpIcon("more")}</button><button class="ns-btn ns-btn--secondary ns-btn--icon" aria-label="More actions">${cmpIcon("more")}</button><button class="ns-btn ns-btn--secondary ns-btn--icon ns-btn--lg" aria-label="More actions">${cmpIcon("more", 20)}</button></div>`],
      ],
      dd: [`<button class="ns-btn ns-btn--ghost ns-btn--icon ns-btn--sm" aria-label="Edit row">${cmpIcon("edit")}</button>`, "Use Ghost for row actions, with a tooltip that names the action.", `<button class="ns-btn ns-btn--icon" aria-label="Send">${cmpIcon("send")}</button>`, "A primary icon-only button in a page header leaves the action unclear."],
      tokens: [["--ns-interactive-primary", "Primary background"], ["--ns-interactive-ghost-hover", "Ghost hover"], ["--ns-status-error", "Danger background"], ["--ns-density-control", "Height in compact density"]],
      sizes: [["S", "32px", "Dense toolbars and table rows"], ["M", "40px", "Default"], ["L", "48px", "Touch surfaces and dialogs"]],
      props: [["icon", "ReactNode", "-", "Glyph. Required"], ["hierarchy", "'primary' | 'secondary' | 'ghost' | 'danger'", "'secondary'", "Visual emphasis"], ["size", "'s' | 'm' | 'l'", "'m'", "Square height"], ["aria-label", "string", "-", "Required. Names the action"], ["disabled", "boolean", "false", "Removes the button from the tab order"]],
      keyboard: [["Tab", "Moves focus to the button"], ["Enter / Space", "Activates the button"]],
      aria: ["Use a native button. Icon-only buttons need an aria-label that names the action, such as Edit contact.", "Pair the icon with a tooltip so sighted users hear the same name.", "Disabled buttons use the disabled attribute so they leave the tab order."],
      react: '<IconButton icon={<MoreIcon />} hierarchy="ghost" aria-label="More actions" />',
    },
    {
      id: "link", name: "Link", cat: "Actions", status: "New", figma: "4465:92",
      desc: "A text link for navigation. Links go to a destination, and buttons run an action. External links open in a new tab and say so to screen readers.",
      axes: [["Type", "Default, External"], ["State", "Default, Hover, Focus, Disabled"]],
      doc: [["Link text", "Write the destination in the label, such as View billing history. Avoid generic labels like click here."], ["External destinations", "Mark links that leave the product. They open in a new tab, and the link text says so for screen readers."]],
      playground: {
        controls: [
          { key: "type", label: "Type", options: ["Default", "External"] },
          { key: "state", label: "State", options: ["Default", "Hover", "Focus", "Disabled"] },
          { key: "label", label: "Label", type: "text", default: "View billing history" },
        ],
        render: (s) => {
          const ext = s.type === "External";
          const st = { Hover: " is-hover", Focus: " is-focus" }[s.state] || "";
          const dis = s.state === "Disabled";
          return `<a class="ns-link${ext ? " ns-link--external" : ""}${st}" href="#"${dis ? ' aria-disabled="true"' : ""}${ext ? ' target="_blank" rel="noopener"' : ""}>${x(s.label)}${ext ? '<span class="ns-link__arrow" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>' : ""}</a>`;
        },
      },
      when: ["Use for navigation, not for actions that change data.", "Write the destination as the label.", "Mark external destinations, and say they open in a new tab."],
      whenNot: ["Do not use click here or more here as the label.", "Do not style a button as a link for a destructive action.", "Do not rely on color alone. Keep the underline on hover and focus."],
      variants: [
        ["Default", "Inline in body text. The underline always shows.", '<p style="margin:0">Review the <a class="ns-link" href="#">billing history</a> before you confirm.</p>'],
        ["External", "Adds an arrow and a hidden note. Opens in a new tab.", '<a class="ns-link ns-link--external" href="#" target="_blank" rel="noopener">Product documentation<span class="ns-link__arrow" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>'],
      ],
      dd: ['<a class="ns-link" href="#">View billing history</a>', "Name the destination in the label.", '<a class="ns-link" href="#">Click here</a>', "Click here tells a screen reader user nothing about the destination."],
      tokens: [["--ns-text-link", "Default link color"], ["--ns-text-accent", "Hover color"], ["--ns-focus-field", "Focus ring"], ["--ns-text-disabled", "Disabled link"]],
      props: [["href", "string", "-", "Destination. A real URL or route"], ["external", "boolean", "false", "Opens in a new tab with a hidden note"], ["disabled", "boolean", "false", "Sets aria-disabled and removes the link from interaction"]],
      keyboard: [["Tab", "Moves focus to the link"], ["Enter", "Follows the link"]],
      aria: ["Use a native a element with href. Do not use a div with a click handler.", "External links set target and rel=noopener, and include a hidden note that the link opens in a new tab.", "Disabled links use aria-disabled and lose their href."],
      react: '<Link href="/billing">View billing history</Link>',
    },
    {
      id: "menu", name: "Menu", cat: "Actions", status: "New", figma: "4466:90",
      desc: "A list of actions that opens from a trigger, such as a row's more button. Use it for secondary actions. Keep primary actions out of the menu, and put destructive actions last.",
      axes: [["Item", "Label, Icon, Shortcut, Type"], ["Type", "Default, Destructive"], ["State", "Default, Hover, Focus, Disabled"]],
      doc: [["Ordering", "Group related actions. Put the most common first and destructive actions last, behind a divider."], ["Keyboard", "Arrow keys move between items. Escape closes the menu and returns focus to the trigger."]],
      playground: {
        controls: [
          { key: "shortcut", label: "Shortcut", options: ["On", "Off"] },
          { key: "destructive", label: "Destructive", options: ["Show", "Hide"] },
        ],
        render: (s) => `<div class="ns-menu ns-menu--panel" role="menu" aria-label="Row actions" style="width:240px"><button role="menuitem">Edit details${s.shortcut === "On" ? "<kbd>⌘E</kbd>" : ""}</button><button role="menuitem">Duplicate</button><button role="menuitem" aria-disabled="true">Archive</button>${s.destructive === "Show" ? '<div class="ns-menu__sep" role="separator"></div><button role="menuitem" class="is-destructive">Delete</button>' : ""}</div>`,
      },
      when: ["Use for secondary actions on a row or object.", "Group related actions and put destructive ones last.", "Show a shortcut only when the same shortcut works outside the menu."],
      whenNot: ["Do not put a primary action only in a menu.", "Do not nest more than one level.", "Do not use a menu to choose a value. Use Select."],
      variants: [
        ["Basic", "Edit, duplicate and archive. A disabled item stays visible so people know it exists.", '<div class="ns-menu ns-menu--panel" role="menu" aria-label="Row actions" style="width:240px"><button role="menuitem">Edit details<kbd>⌘E</kbd></button><button role="menuitem">Duplicate</button><button role="menuitem" aria-disabled="true">Archive</button></div>'],
        ["Destructive", "A divider, then the destructive action last.", '<div class="ns-menu ns-menu--panel" role="menu" aria-label="Row actions" style="width:240px"><button role="menuitem">Duplicate</button><div class="ns-menu__sep" role="separator"></div><button role="menuitem" class="is-destructive">Delete</button></div>'],
      ],
      dd: ['<div class="ns-menu ns-menu--panel" role="menu" style="width:200px"><button role="menuitem">Edit details</button><button role="menuitem">Duplicate</button><div class="ns-menu__sep" role="separator"></div><button role="menuitem" class="is-destructive">Delete</button></div>', "Destructive actions last, behind a divider.", '<div class="ns-menu ns-menu--panel" role="menu" style="width:200px"><button role="menuitem" class="is-destructive">Delete</button><button role="menuitem">Edit details</button></div>', "A destructive action at the top sits one click from the most common action."],
      tokens: [["--ns-background-elevated", "Menu surface"], ["--ns-elevation-03", "Menu shadow"], ["--ns-background-hover", "Item hover"], ["--ns-status-error", "Destructive text"]],
      props: [["trigger", "ReactNode", "-", "Element that opens the menu"], ["items", "{ label, icon, shortcut, destructive, disabled }[]", "[]", "Menu items in order"], ["onSelect", "(id) => void", "-", "Called with the chosen item"]],
      keyboard: [["Enter / Space", "Opens the menu from the trigger, or activates the focused item"], ["Arrow up / down", "Moves between items"], ["Escape", "Closes the menu and returns focus to the trigger"]],
      aria: ["The trigger has aria-haspopup=menu and aria-expanded.", "The list uses role=menu and each item uses role=menuitem.", "Disabled items keep aria-disabled so screen readers can announce them."],
      react: '<Menu trigger={<IconButton icon={<MoreIcon />} aria-label="Row actions" />} items={[{ id: "edit", label: "Edit details", shortcut: "⌘E" }, { id: "delete", label: "Delete", destructive: true }]} />',
    },
    {
      id: "bulk-action-bar", name: "Bulk action bar", cat: "Actions", status: "New", figma: "4466:131",
      desc: "A toolbar that appears above a table when rows are selected. It shows the count and the actions that apply to every selected row.",
      axes: [["Count", "Text, such as 3 selected"], ["Actions", "Up to four buttons. Extras move into a Menu"], ["State", "Hidden, Visible"]],
      doc: [["Show only valid actions", "Show an action only when it applies to every selected row. Keep the order fixed across the table."], ["Confirm destructive actions", "A destructive action opens a Modal that repeats the count, such as Delete 3 accounts."]],
      playground: {
        controls: [
          { key: "count", label: "Count", options: ["3", "1", "12"] },
          { key: "destructive", label: "Destructive", options: ["Show", "Hide"] },
        ],
        render: (s) => `<div class="ns-bulkbar" role="region" aria-label="Bulk actions"><span class="ns-bulkbar__count" aria-live="polite">${x(s.count)} selected</span><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Approve</button><button class="ns-btn ns-btn--ghost ns-btn--sm">Export</button>${s.destructive === "Show" ? '<button class="ns-btn ns-btn--danger ns-btn--sm">Delete</button>' : ""}<span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Clear</button></div>`,
      },
      when: ["Show it when at least one row is selected.", "Keep the count visible, and announce it when it changes.", "Put destructive actions last, and confirm them."],
      whenNot: ["Do not show more than four actions. Move extras into a Menu.", "Do not hide the selection after an action. Show a Toast with the result.", "Do not cover the last table row. Add bottom padding to the table."],
      variants: [
        ["Default", "Count, three actions and a clear control.", '<div class="ns-bulkbar" role="region" aria-label="Bulk actions"><span class="ns-bulkbar__count">3 selected</span><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Approve</button><button class="ns-btn ns-btn--ghost ns-btn--sm">Export</button><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Clear</button></div>'],
        ["Destructive", "Adds a danger action after the neutral ones.", '<div class="ns-bulkbar" role="region" aria-label="Bulk actions"><span class="ns-bulkbar__count">3 selected</span><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Approve</button><button class="ns-btn ns-btn--danger ns-btn--sm">Delete</button></div>'],
      ],
      dd: ['<div class="ns-bulkbar"><span class="ns-bulkbar__count">3 selected</span><button class="ns-btn ns-btn--ghost ns-btn--sm">Approve</button><button class="ns-btn ns-btn--danger ns-btn--sm">Delete</button></div>', "Only actions valid for every selected row, with destructive last.", '<div class="ns-bulkbar"><span class="ns-bulkbar__count">3 selected</span><button class="ns-btn ns-btn--ghost ns-btn--sm">Approve</button><button class="ns-btn ns-btn--ghost ns-btn--sm">Export</button><button class="ns-btn ns-btn--ghost ns-btn--sm">Tag</button><button class="ns-btn ns-btn--ghost ns-btn--sm">Assign</button><button class="ns-btn ns-btn--ghost ns-btn--sm">Move</button></div>', "Five actions crowd the bar. Keep four and move the rest into a Menu."],
      tokens: [["--ns-background-elevated", "Bar surface"], ["--ns-elevation-03", "Bar shadow"], ["--ns-border-default", "Bar border"], ["--ns-density-control-sm", "Button height"]],
      props: [["count", "number", "0", "Selected rows. Announced politely"], ["actions", "{ label, onClick, destructive }[]", "[]", "Up to four actions"], ["onClear", "() => void", "-", "Clears the selection"]],
      keyboard: [["Tab", "Moves through the bar's actions"], ["Escape", "Clears the selection when focus is in the table"]],
      aria: ["The bar is a named region, such as Bulk actions.", "The count sits in a polite live region, so changes are announced without interrupting.", "Each action is a button with its full label, such as Delete 3 accounts."],
      react: '<BulkActionBar count={3} actions={[{ label: "Approve" }, { label: "Delete", destructive: true }]} onClear={clear} />',
    },
    {
      id: "textarea", name: "Textarea", cat: "Inputs", status: "New", figma: "4466:309",
      desc: "A multi-line text field for free text. It follows the same states as Input. Show a counter when the field has a hard limit, and let the field grow to about eight lines.",
      axes: [["State", "Default, Hover, Focus, Error, Warning, Success, Disabled, Read only"], ["Counter", "Shown or hidden"], ["Rows", "Starts at three, grows to eight"]],
      doc: [["Limits", "Show a counter such as 0 / 1000 when the user nears a hard limit. Past the limit, the counter turns to error color and the message says what to fix."], ["Size", "Start at three rows. Let the field grow with the text up to about eight lines, then scroll."]],
      playground: {
        controls: [
          { key: "state", label: "State", options: ["Default", "Focus", "Error", "Disabled"] },
          { key: "counter", label: "Counter", options: ["On", "Off"] },
        ],
        render: (s) => {
          const err = s.state === "Error";
          const dis = s.state === "Disabled";
          const focus = s.state === "Focus" ? " is-focus" : "";
          const helper = err ? '<span class="ns-helper">Add a description to continue.</span>' : s.counter === "On" ? '<span class="ns-helper">0 / 1000</span>' : "";
          return `<div class="ns-field${err ? " is-error" : ""}" style="width:360px"><label class="ns-label" for="pg-ta">Description</label><textarea class="ns-textarea${focus}" id="pg-ta" placeholder="Services, regions and size"${dis ? " disabled" : ""} maxlength="1000"></textarea>${helper}</div>`;
        },
      },
      when: ["Use for free text longer than one line, such as notes or descriptions.", "Show a counter when there is a hard character limit.", "Let the field grow with the content up to about eight lines."],
      whenNot: ["Do not use for single values such as names or IDs. Use Input.", "Do not hide the limit until the user reaches it.", "Do not use placeholder text as the label."],
      variants: [
        ["Default", "Three rows, with a counter below.", '<div class="ns-field" style="width:360px"><label class="ns-label">Company overview</label><textarea class="ns-textarea" aria-label="Company overview" placeholder="Services, regions and size" maxlength="1000"></textarea><span class="ns-helper">0 / 1000</span></div>'],
        ["Error", "Error color on the border and the message.", '<div class="ns-field is-error" style="width:360px"><label class="ns-label">Company overview</label><textarea class="ns-textarea" aria-label="Company overview" aria-invalid="true" aria-describedby="ta-err"></textarea><span class="ns-helper" id="ta-err">Add a description to continue.</span></div>'],
      ],
      dd: ['<div class="ns-field" style="width:300px"><label class="ns-label">Notes</label><textarea class="ns-textarea" maxlength="500"></textarea><span class="ns-helper">0 / 500</span></div>', "Label above the field, limit shown below it.", '<div class="ns-field" style="width:300px"><textarea class="ns-textarea" placeholder="Notes"></textarea></div>', "A placeholder used as the label disappears as soon as the user types."],
      tokens: [["--ns-border-default", "Default border"], ["--ns-focus-field", "Focus border and ring"], ["--ns-status-error", "Error border and message"], ["--ns-text-disabled", "Placeholder and disabled text"]],
      props: [["label", "string", "-", "Visible label. Required"], ["value", "string", "''", "Controlled value"], ["maxLength", "number", "-", "Hard limit. Turns on the counter"], ["rows", "number", "3", "Starting height in lines"], ["helper", "string", "-", "Hint or error message"], ["state", "'default' | 'error' | 'warning' | 'success' | 'disabled' | 'readonly'", "'default'", "Visual and semantic state"]],
      keyboard: [["Tab", "Moves focus into and out of the field"], ["Enter", "Adds a new line. It does not submit the form"]],
      aria: ["Associate the label with for and id.", "Link helper and error text with aria-describedby.", "Set aria-invalid=true on error. Announce the counter at the limit, not on every key press."],
      react: '<Textarea label="Description" maxLength={1000} helper="Services, regions and size" />',
    },
    {
      id: "combobox", name: "Combobox", cat: "Inputs", status: "New", figma: "4466:34",
      desc: "A filterable multi-select for long lists. Typing filters the options, Enter toggles the active option, and chosen values stay visible as removable tags. Use it when the list is longer than about ten items.",
      axes: [["State", "Default, Focus, Open, Disabled"], ["Selection", "Zero, one or many tags"]],
      doc: [["Long lists", "Use a combobox for lists longer than about ten items. For two to six options, use Checkbox or Radio."], ["Keep picks", "Keep selected values as tags so people can see and remove them. Do not clear the query after each pick, so they can keep filtering."]],
      playground: {
        controls: [{ key: "state", label: "State", options: ["Default", "Open", "Disabled"] }],
        render: (s) => {
          const open = s.state === "Open";
          const dis = s.state === "Disabled";
          return `<div class="ns-combobox${open ? " is-open" : ""}${dis ? " is-disabled" : ""}" style="width:340px"><div class="ns-combobox__control"><span class="ns-tag ns-tag--sm">Analytics <button type="button" aria-label="Remove Analytics">×</button></span><input role="combobox" aria-expanded="${open}" aria-label="Add tag" placeholder="Add tag"${dis ? " disabled" : ""}/></div>${open ? '<div class="ns-menu ns-menu--panel ns-combobox__list" role="listbox" aria-multiselectable="true"><button role="option" aria-selected="false">Billing</button><button role="option" aria-selected="true">Analytics</button><button role="option" aria-selected="false">Compliance</button><span class="ns-helper ns-combobox__count">3 of 32 match</span></div>' : ""}</div>`;
        },
      },
      when: ["Use for lists longer than about ten items.", "Show the match count while the user filters.", "Keep chosen values visible as removable tags."],
      whenNot: ["Do not use for two to six options. Use Checkbox or Radio.", "Do not clear the query after each pick.", "Do not use for a single choice from a short list. Use Select."],
      variants: [
        ["Empty", "Placeholder text with nothing chosen.", '<div class="ns-combobox" style="width:340px"><div class="ns-combobox__control"><input role="combobox" aria-expanded="false" aria-label="Add tag" placeholder="Add tag"/></div></div>'],
        ["With picks", "Tags for chosen values, and the filtered list with its count.", '<div class="ns-combobox is-open" style="width:340px"><div class="ns-combobox__control"><span class="ns-tag ns-tag--sm">Reporting <button type="button" aria-label="Remove Reporting">×</button></span><input role="combobox" aria-expanded="true" aria-label="Add tag" value="se"/></div><div class="ns-menu ns-menu--panel ns-combobox__list" role="listbox" aria-multiselectable="true"><button role="option" aria-selected="false">Billing</button><button role="option" aria-selected="true">Analytics</button><span class="ns-helper ns-combobox__count">2 of 32 match</span></div></div>'],
      ],
      dd: ['<div class="ns-combobox is-open" style="width:300px"><div class="ns-combobox__control"><span class="ns-tag ns-tag--sm">Analytics <button type="button" aria-label="Remove Analytics">×</button></span><input role="combobox" aria-expanded="true" aria-label="Add tag"/></div></div>', "Filters as you type, keeps picks as tags, and shows the match count.", '<div class="ns-combobox" style="width:300px"><div class="ns-combobox__control"><input aria-label="Approved" placeholder="Yes or no"/></div></div>', "Two options are better as Radio buttons or a Toggle."],
      tokens: [["--ns-border-default", "Control border"], ["--ns-focus-field", "Focus ring"], ["--ns-background-elevated", "List surface"], ["--ns-background-selected", "Selected option"]],
      props: [["options", "{ value, label }[]", "[]", "Full list, filtered by the query"], ["value", "string[]", "[]", "Picked values, shown as tags"], ["onChange", "(value[]) => void", "-", "Called on every pick or removal"], ["placeholder", "string", "-", "Shown when nothing is chosen"]],
      keyboard: [["Specimen", "The demo is static. These keys are the behavior to build."], ["Arrow up / down", "Moves the active option"], ["Enter", "Toggles the active option"], ["Backspace", "On an empty query, removes the last tag"], ["Escape", "Closes the list and keeps the query"]],
      aria: ["The input has role=combobox, aria-expanded, and aria-controls pointing at the list.", "The list has role=listbox with aria-multiselectable=true, and each option has aria-selected.", "Announce the match count in a polite live region as the query changes."],
      react: '<Combobox label="Tags" options={tags} value={chosen} onChange={setPicked} placeholder="Add tag" />',
    },
    {
      id: "number-stepper", name: "Number stepper", cat: "Inputs", status: "New", figma: "4466:261",
      desc: "An integer field with decrement and increment buttons, for small counts with a clear minimum and maximum. People can also type the number directly.",
      axes: [["State", "Default, Focus, At minimum, At maximum, Disabled"]],
      doc: [["Range", "State the allowed range in the label or helper text, such as Sites (1 to 50). Disable a button when it cannot go further."], ["Other controls", "Money and large numbers belong in Input. Use Slider when the range is visual and approximate."]],
      playground: {
        controls: [
          { key: "value", label: "Value", options: ["3", "1", "50"] },
          { key: "state", label: "State", options: ["Default", "At minimum", "At maximum", "Disabled"] },
        ],
        render: (s) => {
          const v = s.state === "At minimum" ? 1 : s.state === "At maximum" ? 50 : Number(s.value);
          const dis = s.state === "Disabled";
          const decOff = dis || v <= 1;
          const incOff = dis || v >= 50;
          return `<div class="ns-stepper${dis ? " is-disabled" : ""}" role="group" aria-label="Sites"><button type="button" aria-label="Decrease"${decOff ? " disabled" : ""}>${cmpIcon("minus")}</button><input type="number" inputmode="numeric" value="${v}" min="1" max="50" aria-label="Sites"${dis ? " disabled" : ""}/><button type="button" aria-label="Increase"${incOff ? " disabled" : ""}>${cmpIcon("plus")}</button></div>`;
        },
      },
      when: ["Use for small counts with a clear minimum and maximum.", "Let people type the number as well as step it.", "Disable a button when the value is at its limit."],
      whenNot: ["Do not use for money or large numbers. Use Input.", "Do not hide the minimum and maximum.", "Do not use when the value is better chosen from a list. Use Select."],
      variants: [
        ["Default", "A value between the minimum and maximum.", '<div class="ns-stepper" role="group" aria-label="Sites"><button type="button" aria-label="Decrease">' + cmpIcon("minus") + '</button><input type="number" value="3" min="1" max="50" aria-label="Sites"/><button type="button" aria-label="Increase">' + cmpIcon("plus") + '</button></div>'],
        ["At minimum", "The decrement button is disabled and stays visible.", '<div class="ns-stepper" role="group" aria-label="Sites"><button type="button" aria-label="Decrease" disabled>' + cmpIcon("minus") + '</button><input type="number" value="1" min="1" max="50" aria-label="Sites"/><button type="button" aria-label="Increase">' + cmpIcon("plus") + '</button></div>'],
      ],
      dd: ['<div class="ns-field" style="width:240px"><label class="ns-label">Sites (1 to 50)</label><div class="ns-stepper" role="group" aria-label="Sites"><button type="button" aria-label="Decrease">' + cmpIcon("minus") + '</button><input type="number" value="3" min="1" max="50" aria-label="Sites"/><button type="button" aria-label="Increase">' + cmpIcon("plus") + '</button></div></div>', "State the range in the label. The buttons disable at the limits.", '<div class="ns-field" style="width:240px"><label class="ns-label">Amount</label><div class="ns-stepper" role="group" aria-label="Amount"><button type="button" aria-label="Decrease">' + cmpIcon("minus") + '</button><input type="number" value="12500" aria-label="Amount"/><button type="button" aria-label="Increase">' + cmpIcon("plus") + '</button></div></div>', "Money does not belong in a stepper. Use Input."],
      tokens: [["--ns-border-default", "Outline"], ["--ns-background-hover", "Button hover"], ["--ns-text-disabled", "Disabled buttons"], ["--ns-density-control", "Height"]],
      props: [["value", "number", "-", "Current value"], ["min", "number", "-", "Lower limit. Decrement disables at it"], ["max", "number", "-", "Upper limit. Increment disables at it"], ["step", "number", "1", "Amount per click"], ["onChange", "(n) => void", "-", "Called with the new value"]],
      keyboard: [["Arrow up / down", "Steps by 1"], ["Page up / down", "Steps by 10"], ["Home / End", "Jumps to the minimum or maximum"]],
      aria: ["The input is a native number input with aria-label, min and max, so screen readers announce the range.", "Buttons have names such as Decrease and Increase, and use the disabled attribute at the limits.", "The group has a name, such as Sites, so the buttons are announced in context."],
      react: '<NumberStepper label="Sites" min={1} max={50} value={sites} onChange={setSites} />',
    },
    {
      id: "inline-edit", name: "Inline edit", cat: "Inputs", status: "New", figma: "4466:54",
      desc: "Edit one field in place on a detail page. Enter or the check saves, Escape cancels, and a failed save keeps the typed value and shows a Toast.",
      axes: [["State", "Read, Hover, Editing, Saving"]],
      doc: [["When to use", "Use it on detail pages for single fields that change often. For fields that depend on each other, use a form so they save together."], ["Saving", "Show a spinner while saving. If the save fails, keep the typed value, show the error in a Toast, and let the person retry."]],
      playground: {
        controls: [{ key: "state", label: "State", options: ["Read", "Hover", "Editing", "Saving"] }],
        render: (s) => {
          if (s.state === "Editing") return `<div style="width:280px"><span class="ns-label">Account manager</span><div class="ns-inline-edit is-editing"><input class="ns-inline-edit__input" value="Sara Kim" aria-label="Account manager"/><button class="ns-inline-edit__btn" aria-label="Save">${cmpIcon("check", 14)}</button><button class="ns-inline-edit__btn" aria-label="Cancel">${cmpIcon("close", 14)}</button></div></div>`;
          const cls = s.state === "Hover" ? " is-hover" : "";
          const busy = s.state === "Saving" ? '<span class="ns-spin" role="status" aria-label="Saving"></span>' : "";
          return `<div style="width:280px"><span class="ns-label">Account manager</span><div class="ns-inline-edit${cls}" tabindex="0" role="button" aria-label="Edit account manager">Sara Kim${busy}</div></div>`;
        },
      },
      when: ["Use on detail pages for single fields that change often.", "Save one field at a time.", "Show the value as plain text until it is hovered or focused."],
      whenNot: ["Do not use for fields with dependencies. Use a form.", "Do not use inline edit in tables with sorting active.", "Do not hide that the field is editable. Show the pencil on hover and focus."],
      variants: [
        ["Read", "Plain text with a pencil on hover and focus.", '<div style="width:280px"><span class="ns-label">Account manager</span><div class="ns-inline-edit" tabindex="0" role="button" aria-label="Edit account manager">Sara Kim</div></div>'],
        ["Editing", "A labeled input with Save and Cancel.", '<div style="width:280px"><span class="ns-label">Account manager</span><div class="ns-inline-edit is-editing"><input class="ns-inline-edit__input" value="Sara Kim" aria-label="Account manager"/><button class="ns-inline-edit__btn" aria-label="Save">' + cmpIcon("check", 14) + '</button><button class="ns-inline-edit__btn" aria-label="Cancel">' + cmpIcon("close", 14) + '</button></div></div>'],
      ],
      dd: ['<div class="ns-inline-edit" tabindex="0" role="button" aria-label="Edit contact phone">+1 312 555 0140</div>', "Edit one field at a time, and show the saved state.", '<div class="ns-field"><label class="ns-label">Street</label><input class="ns-input" value="12 Main St"/><label class="ns-label">City</label><input class="ns-input" value="Chicago"/></div>', "Dependent fields such as address parts belong in a form that saves together."],
      tokens: [["--ns-background-hover", "Hover surface"], ["--ns-focus-field", "Editing border"], ["--ns-text-primary", "Value text"], ["--ns-text-tertiary", "Pencil icon"]],
      props: [["value", "string", "-", "Current value"], ["onSave", "(value) => Promise", "-", "Resolves on success. Rejects to keep editing"], ["state", "'read' | 'editing' | 'saving'", "'read'", "Controlled state"]],
      keyboard: [["Enter", "Saves the value"], ["Escape", "Cancels and restores the value"], ["Tab", "Moves to the next editable field"]],
      aria: ["The read state is a button with an aria-label that names the field, such as Edit account manager.", "Editing uses a labeled input and two named buttons, Save and Cancel.", "Announce the save result in a polite live region."],
      react: '<InlineEdit label="Account manager" value={manager} onSave={saveManager} />',
    },
    {
      id: "segmented-control", name: "Segmented control", cat: "Inputs", status: "New", figma: "4466:175",
      desc: "Switches between two to five views of the same content. Exactly one segment is selected at a time, and arrow keys move the selection.",
      axes: [["Segments", "2 to 5"], ["Icon", "Optional, shown with the label"], ["State", "Default, Hover, Selected, Focus, Disabled"]],
      doc: [["Views, not pages", "Use it to change the view of the same data, such as Table or Board. Moving between pages is a job for Tabs."], ["Keep labels short", "One word per segment. Pair an icon with the label only when the icon is widely understood."]],
      playground: {
        controls: [
          { key: "count", label: "Segments", options: ["3", "2", "4"] },
          { key: "disabled", label: "Disabled", options: ["None", "Last"] },
        ],
        render: (s) => {
          const labels = ["Table", "Board", "Map", "List"].slice(0, Number(s.count));
          const off = s.disabled === "Last" ? labels.length - 1 : -1;
          return `<div class="ns-segmented" role="radiogroup" aria-label="View">${labels.map((l, i) => `<button type="button" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}"${i === off ? ' disabled aria-disabled="true"' : ""}>${l}</button>`).join("")}</div>`;
        },
      },
      when: ["Switching views of the same data, such as Table, Board or Map.", "Keeping each label to one word.", "Using an icon with the label for view switchers."],
      whenNot: ["Do not use for navigation between pages. Use Tabs.", "Do not use for form choices that apply on save. Use Radio.", "Do not exceed five segments."],
      variants: [
        ["Default", "Three views with one selected.", '<div class="ns-segmented" role="radiogroup" aria-label="View"><button role="radio" aria-checked="true" tabindex="0">Table</button><button role="radio" aria-checked="false" tabindex="-1">Board</button><button role="radio" aria-checked="false" tabindex="-1">Map</button></div>'],
        ["Disabled segment", "A single segment can be disabled while the rest stay usable.", '<div class="ns-segmented" role="radiogroup" aria-label="Range"><button role="radio" aria-checked="true" tabindex="0">Day</button><button role="radio" aria-checked="false" tabindex="-1">Week</button><button role="radio" aria-checked="false" tabindex="-1" disabled aria-disabled="true">Year</button></div>'],
      ],
      dd: ['<div class="ns-segmented" role="radiogroup" aria-label="View"><button role="radio" aria-checked="true" tabindex="0">Table</button><button role="radio" aria-checked="false" tabindex="-1">Board</button></div>', "Switch the view of the same data.", '<div class="ns-segmented" role="radiogroup" aria-label="Section"><button role="radio" aria-checked="true" tabindex="0">Home</button><button role="radio" aria-checked="false" tabindex="-1">Billing</button></div>', "Moving between pages belongs in Tabs, not a segmented control."],
      tokens: [["--ns-background-secondary", "Track"], ["--ns-background-elevated", "Selected segment"], ["--ns-text-primary", "Selected label"], ["--ns-focus-field", "Focus ring"]],
      props: [["items", "{ label, icon, disabled }[]", "[]", "Two to five segments"], ["value", "string", "-", "Selected segment"], ["onChange", "(value) => void", "-", "Called when the selection changes"]],
      keyboard: [["Tab", "Moves focus into the selected segment and out of the group"], ["Arrow left / right", "Moves the selection to the previous or next segment"]],
      aria: ["The group is a radiogroup with a name, such as View.", "Each segment is a radio with aria-checked. Only the selected segment is in the tab order.", "Disabled segments keep aria-disabled so screen readers can announce them."],
      react: '<SegmentedControl label="View" items={[{ label: "Table" }, { label: "Board" }]} value={view} onChange={setView} />',
    },
    {
      id: "tree-view", name: "Tree view", cat: "Navigation", status: "New", figma: "4466:335",
      desc: "Browses a hierarchy such as account, location and device. Each level indents 20px. Parents expand and collapse, and leaves keep the chevron space so labels line up.",
      axes: [["Depth", "Up to four levels"], ["Row", "Collapsed, Expanded, Leaf"], ["State", "Default, Hover, Selected, Focus"]],
      doc: [["Real hierarchies", "Use a tree for hierarchies two to four levels deep. Show child counts on parents, and remember the expanded state for each person."]],
      playground: {
        controls: [{ key: "expanded", label: "Chicago, IL", options: ["Expanded", "Collapsed"] }],
        render: (s) => {
          const open = s.expanded === "Expanded";
          const chev = (leaf) => `<span class="ns-tree__chev${leaf ? " is-leaf" : ""}" aria-hidden="true">${cmpIcon("chevron", 14)}</span>`;
          const leaves = open ? `<ul role="group"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="3" aria-selected="true" style="--ns-tree-level:2">${chev(true)}<span>Site 0042</span></div></li><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="3" aria-selected="false" style="--ns-tree-level:2">${chev(true)}<span>Site 0187</span></div></li></ul>` : "";
          return `<ul class="ns-tree" role="tree" aria-label="Locations" style="width:320px"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="1" aria-expanded="true" aria-selected="false" style="--ns-tree-level:0">${chev()}<span>Acme Corp</span><span class="ns-tree__count">2</span></div><ul role="group"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="2" aria-expanded="${open}" aria-selected="false" style="--ns-tree-level:1">${chev()}<span>Chicago, IL</span><span class="ns-tree__count">2</span></div>${leaves}</li></ul></li></ul>`;
        },
      },
      when: ["Real hierarchies two to four levels deep.", "Child counts on parents, so people know what is inside before they open it.", "Remembering the expanded state for each person."],
      whenNot: ["Do not use for flat lists. Use a plain list.", "Do not put actions on every row. Use a Menu on hover or focus.", "Do not go deeper than four levels."],
      variants: [
        ["Expanded", "A parent open, with its children visible and one selected.", '<ul class="ns-tree" role="tree" aria-label="Locations" style="width:320px"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="1" aria-expanded="true" aria-selected="false" style="--ns-tree-level:0">' + cmpIcon("chevron", 14) + '<span>Acme Corp</span><span class="ns-tree__count">2</span></div><ul role="group"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="2" aria-expanded="true" aria-selected="true" style="--ns-tree-level:1">' + cmpIcon("chevron", 14) + '<span>Chicago, IL</span><span class="ns-tree__count">2</span></div></li></ul></li></ul>'],
        ["Collapsed", "The parent stays visible with its count, so the contents are known before opening.", '<ul class="ns-tree" role="tree" aria-label="Locations" style="width:320px"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="1" aria-expanded="false" aria-selected="false" style="--ns-tree-level:0">' + cmpIcon("chevron", 14) + '<span>Acme Corp</span><span class="ns-tree__count">2</span></div></li></ul>'],
      ],
      dd: ['<ul class="ns-tree" role="tree" aria-label="Locations" style="width:280px"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="1" aria-expanded="false" aria-selected="false" style="--ns-tree-level:0">' + cmpIcon("chevron", 14) + '<span>Acme Corp</span><span class="ns-tree__count">14</span></div></li></ul>', "Parents show child counts, so the contents are known before opening.", '<ul class="ns-tree" role="tree" aria-label="Items" style="width:280px"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="1" aria-selected="false" style="--ns-tree-level:0"><span class="ns-tree__chev is-leaf"></span><span>Item 1</span></div></li><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="1" aria-selected="false" style="--ns-tree-level:0"><span class="ns-tree__chev is-leaf"></span><span>Item 2</span></div></li></ul>', "A flat list has no hierarchy. Use a plain list."],
      tokens: [["--ns-background-hover", "Row hover"], ["--ns-background-selected", "Selected row"], ["--ns-text-tertiary", "Chevron and count"], ["--ns-focus-field", "Focus ring"]],
      props: [["items", "{ id, label, count, children }[]", "[]", "Nested nodes"], ["expanded", "string[]", "[]", "Expanded node ids"], ["selected", "string", "-", "Selected node id"], ["onSelect", "(id) => void", "-", "Called when a node is activated"]],
      keyboard: [["Arrow down / up", "Moves to the next or previous visible row"], ["Arrow right", "Expands a parent, or moves into its first child"], ["Arrow left", "Collapses a parent, or moves to its parent"], ["Enter", "Selects the focused row"]],
      aria: ["The list has role=tree with a name. Each row is a treeitem with aria-level.", "Parents set aria-expanded. Children sit in a group inside the parent.", "The selected row sets aria-selected=true."],
      react: '<TreeView label="Locations" items={locations} selected={selected} onSelect={setSelected} />',
    },
    {
      id: "command-palette", name: "Command palette", cat: "Navigation", status: "New", figma: "4466:359",
      desc: "A global launcher for finding records, pages and actions. Open it with Cmd K or Ctrl K. Results group by type, and the active row follows the keyboard.",
      axes: [["Result", "Label, meta, icon, shortcut"], ["Group", "Up to four groups"], ["State", "Empty query, Results, Active row"]],
      doc: [["What to search", "Search the records and actions people use most. Show recent items before the person types anything."]],
      playground: {
        controls: [{ key: "query", label: "Query", options: ["Empty", "acme"] }],
        render: (s) => {
          const q = s.query === "acme";
          const results = q
            ? '<div class="ns-cmdk__group">Accounts</div><div class="ns-cmdk__item" role="option" aria-selected="true"><span><mark>Acme</mark> Corp</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span><mark>Acme</mark> Holdings</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__group">Actions</div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Create account</span><span class="ns-cmdk__meta">Action</span></div>'
            : '<div class="ns-cmdk__group">Recent</div><div class="ns-cmdk__item" role="option" aria-selected="true"><span>Acme Corp</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Billing history</span><span class="ns-cmdk__meta">Page</span></div>';
          return `<div class="ns-cmdk" role="dialog" aria-label="Command palette"><div class="ns-cmdk__query">${NS.icon.search}<input role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-label="Search" placeholder="Search accounts, pages and actions" value="${q ? "acme" : ""}"/><kbd>Esc</kbd></div><div class="ns-cmdk__list" id="cmdk-list" role="listbox">${results}</div><div class="ns-cmdk__foot"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>Esc</kbd> Close</span></div></div>`;
        },
      },
      when: ["Finding records, pages and actions across the product.", "Showing recent items before the person types.", "Keeping each result to one line."],
      whenNot: ["Do not make it the only way to reach a feature.", "Do not open it when a page search field gets focus.", "Do not show more than four groups."],
      variants: [
        ["Recent", "What people see before they type.", '<div class="ns-cmdk" role="dialog" aria-label="Command palette"><div class="ns-cmdk__query">' + NS.icon.search + '<input role="combobox" aria-expanded="true" aria-label="Search" placeholder="Search accounts, pages and actions"/></div><div class="ns-cmdk__list" role="listbox"><div class="ns-cmdk__group">Recent</div><div class="ns-cmdk__item" role="option" aria-selected="true"><span>Acme Corp</span><span class="ns-cmdk__meta">Account</span></div></div></div>'],
        ["Results", "Grouped by type, with the active row highlighted.", '<div class="ns-cmdk" role="dialog" aria-label="Command palette"><div class="ns-cmdk__query">' + NS.icon.search + '<input role="combobox" aria-expanded="true" aria-label="Search" value="acme"/></div><div class="ns-cmdk__list" role="listbox"><div class="ns-cmdk__group">Accounts</div><div class="ns-cmdk__item" role="option" aria-selected="true"><span><mark>Acme</mark> Corp</span><span class="ns-cmdk__meta">Account</span></div></div></div>'],
      ],
      dd: ['<div class="ns-cmdk" role="dialog" aria-label="Command palette"><div class="ns-cmdk__list" role="listbox"><div class="ns-cmdk__group">Accounts</div><div class="ns-cmdk__item" role="option" aria-selected="true"><span><mark>Acme</mark> Corp</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__group">Actions</div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Create account</span><span class="ns-cmdk__meta">Action</span></div></div></div>', "Results grouped by type, with a meta label on each row.", '<div class="ns-cmdk" role="dialog" aria-label="Command palette"><div class="ns-cmdk__list" role="listbox"><div class="ns-cmdk__item" role="option" aria-selected="true"><span>Acme Corp</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Create account</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Billing history</span></div></div></div>', "Mixed results with no group or type label leave people guessing what each row opens."],
      tokens: [["--ns-background-elevated", "Palette surface"], ["--ns-elevation-04", "Palette shadow"], ["--ns-background-selected", "Active row"], ["--ns-text-accent", "Matched text"]],
      props: [["items", "{ id, label, group, meta, icon, shortcut }[]", "[]", "Results, grouped"], ["query", "string", "''", "Controlled query"], ["onSelect", "(id) => void", "-", "Called with the chosen result"], ["open", "boolean", "false", "Shows or hides the palette"]],
      keyboard: [["Specimen", "The demo is static. These keys are the behavior to build."], ["Cmd K / Ctrl K", "Opens the palette from anywhere"], ["Arrow up / down", "Moves the active row"], ["Enter", "Opens the active result"], ["Escape", "Closes the palette and returns focus to the previous element"]],
      aria: ["The palette is a dialog with a name. The input is a combobox that points at the list with aria-controls.", "Results form a listbox, and the active row is set with aria-activedescendant.", "Announce the result count in a polite live region as the query changes."],
      react: '<CommandPalette items={items} onSelect={openItem} />',
    },
    {
      id: "toast", name: "Toast", cat: "Feedback", status: "New", figma: "4465:138",
      desc: "A short message after an action, such as Account archived. Toasts stack in a corner and clear on their own. Errors the person must fix belong inline, not in a toast.",
      axes: [["Status", "Information, Success, Warning, Error"], ["Action", "None or one button"], ["Message", "Shown or hidden"]],
      doc: [["Undo instead of confirm", "For reversible actions, offer Undo in the toast rather than a confirm dialog."], ["Stacking", "Show at most three toasts. The newest sits on top."]],
      playground: {
        controls: [
          { key: "status", label: "Status", options: ["Success", "Information", "Warning", "Error"] },
          { key: "action", label: "Action", options: ["Undo", "None"] },
        ],
        render: (s) => {
          const v = {
            Success: { c: " ns-notice--success", g: "✓", t: "Account archived", m: "Acme Corp moved to the archive." },
            Information: { c: "", g: "i", t: "Sync started", m: "Changes will appear shortly." },
            Warning: { c: " ns-notice--warning", g: "!", t: "Sync is slow", m: "Some records are still updating." },
            Error: { c: " ns-notice--error", g: "!", t: "Account not saved", m: "Check the billing email and try again." },
          }[s.status];
          const role = s.status === "Error" ? "alert" : "status";
          const act = s.action === "Undo" ? '<button class="ns-btn ns-btn--ghost ns-btn--sm">Undo</button>' : '<button class="ns-notice__close" aria-label="Dismiss notification">×</button>';
          return `<div class="ns-notice ns-notice--toast${v.c}" role="${role}" style="width:360px"><span class="ns-notice__icon" aria-hidden="true">${v.g}</span><div><p class="ns-notice__title">${v.t}</p><p class="ns-notice__body">${v.m}</p></div>${act}</div>`;
        },
      },
      when: ["Confirming the result of an action the person just took.", "Offering Undo instead of a confirm dialog for reversible changes.", "Keeping titles under 40 characters."],
      whenNot: ["Do not use for errors the person must fix. Show those inline.", "Do not put more than one action in a toast.", "Do not auto-dismiss error toasts."],
      variants: [
        ["Success", "Confirms a finished action, with Undo.", '<div class="ns-notice ns-notice--toast ns-notice--success" role="status" style="width:360px"><span class="ns-notice__icon" aria-hidden="true">✓</span><div><p class="ns-notice__title">Account archived</p><p class="ns-notice__body">Acme Corp moved to the archive.</p></div><button class="ns-btn ns-btn--ghost ns-btn--sm">Undo</button></div>'],
        ["Error", "Uses role=alert and stays until dismissed.", '<div class="ns-notice ns-notice--toast ns-notice--error" role="alert" style="width:360px"><span class="ns-notice__icon" aria-hidden="true">!</span><div><p class="ns-notice__title">Account not saved</p><p class="ns-notice__body">Check the billing email and try again.</p></div><button class="ns-notice__close" aria-label="Dismiss notification">×</button></div>'],
      ],
      dd: ['<div class="ns-notice ns-notice--toast ns-notice--success" role="status" style="width:320px"><span class="ns-notice__icon" aria-hidden="true">✓</span><div><p class="ns-notice__title">Account archived</p></div><button class="ns-btn ns-btn--ghost ns-btn--sm">Undo</button></div>', "Undo for a reversible change, one action only.", '<div class="ns-notice ns-notice--toast ns-notice--error" role="status" style="width:320px"><span class="ns-notice__icon" aria-hidden="true">!</span><div><p class="ns-notice__title">Billing email is missing</p></div><button class="ns-btn ns-btn--ghost ns-btn--sm">Fix</button><button class="ns-btn ns-btn--ghost ns-btn--sm">Retry</button></div>', "The person must fix this. Show it inline next to the field, and do not stack two actions."],
      tokens: [["--ns-background-elevated", "Toast surface"], ["--ns-elevation-03", "Toast shadow"], ["--ns-status-success", "Success icon"], ["--ns-status-error", "Error icon"]],
      props: [["status", "'info' | 'success' | 'warning' | 'error'", "'info'", "Sets color, icon and role"], ["title", "string", "-", "Short result, under 40 characters"], ["message", "string", "-", "Optional detail"], ["action", "{ label, onClick }", "-", "Optional single action"], ["onDismiss", "() => void", "-", "Close control"]],
      keyboard: [["Tab", "Moves to the action or close button"], ["Enter / Space", "Activates the focused button"]],
      aria: ["Information and success use role=status, which announces politely without interrupting.", "Error uses role=alert, so it interrupts the screen reader.", "Give the close button a name, such as Dismiss notification."],
      react: '<Toast status="success" title="Account archived" action={{ label: "Undo", onClick: undo }} />',
    },
    {
      id: "status-dot", name: "Status dot", cat: "Status", status: "New", figma: "4465:39",
      desc: "A colored dot with a label, for dense tables and maps where a badge would take too much space. Keep the label visible, or name the status in a column header or tooltip.",
      axes: [["Status", "Positive, Critical, Negative, Informative, Neutral"], ["Label", "Shown or hidden"]],
      doc: [["Color is not the only signal", "Each status keeps its word. Hiding the label is only safe when a column header or tooltip names the status."]],
      playground: {
        controls: [
          { key: "status", label: "Status", options: ["Positive", "Critical", "Negative", "Informative", "Neutral"] },
          { key: "label", label: "Label", options: ["Shown", "Hidden"] },
        ],
        render: (s) => {
          const m = { Positive: ["positive", "Active"], Critical: ["critical", "At risk"], Negative: ["negative", "Down"], Informative: ["informative", "Provisioning"], Neutral: ["neutral", "Inactive"] }[s.status];
          const text = s.label === "Shown" ? m[1] : `<span class="sr-only">${m[1]}</span>`;
          return `<span class="ns-status-dot ns-status-dot--${m[0]}">${text}</span>`;
        },
      },
      when: ["Dense tables and maps.", "The same status words as Badge.", "Keeping the label visible unless a header names the status."],
      whenNot: ["Do not rely on color alone.", "Do not use for counts. Use Badge.", "Do not hide the label in a table with no header that names the status."],
      variants: [
        ["All statuses", "Five statuses with labels.", '<div style="display:flex;gap:16px;flex-wrap:wrap"><span class="ns-status-dot ns-status-dot--positive">Active</span><span class="ns-status-dot ns-status-dot--critical">At risk</span><span class="ns-status-dot ns-status-dot--negative">Down</span><span class="ns-status-dot ns-status-dot--informative">Provisioning</span><span class="ns-status-dot ns-status-dot--neutral">Inactive</span></div>'],
        ["Label in a header", "The column header names the status, so the visible label can go. The label stays for screen readers.", '<table class="ns-table" style="width:240px"><thead><tr><th>Status</th></tr></thead><tbody><tr><td><span class="ns-status-dot ns-status-dot--positive"><span class="sr-only">Active</span></span></td></tr><tr><td><span class="ns-status-dot ns-status-dot--negative"><span class="sr-only">Down</span></span></td></tr></tbody></table>'],
      ],
      dd: ['<span class="ns-status-dot ns-status-dot--negative">Down</span>', "A dot with its word, the same as Badge.", '<span class="ns-status-dot ns-status-dot--negative"><span class="sr-only">Down</span></span>', "A dot with no visible word. Color alone is not enough without a header that names the status."],
      tokens: [["--ns-status-success", "Positive dot"], ["--ns-status-warning", "Critical dot"], ["--ns-status-error", "Negative dot"], ["--ns-status-info", "Informative dot"]],
      props: [["status", "'positive' | 'critical' | 'negative' | 'informative' | 'neutral'", "'neutral'", "Color and meaning"], ["label", "string", "-", "Visible text"], ["showLabel", "boolean", "true", "When false, the label is kept for screen readers only"]],
      keyboard: [["-", "Not focusable. A static indicator"]],
      aria: ["The label is text, so screen readers read it. A hidden label stays in the DOM as screen-reader-only text.", "Do not use color alone to show status."],
      react: '<StatusDot status="positive" label="Active" />',
    },
    {
      id: "bullet-chart", name: "Bullet chart", cat: "Data viz", status: "New", figma: "4443:314",
      desc: "A bullet chart shows one measure per row against a target: stacked segments on a quiet track and a single tick for the goal. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The rows render from a data array as SVG, so the same numbers drive the Figma set and the docs.",
      axes: [["Size", "Small, Vertical small, Medium, Large, XL"], ["Title", "Text"], ["Value", "Text"], ["Show icon", "Boolean"]],
      doc: [
        ["Segments are rectangles, not vectors", "Each segment is a plain rectangle bound to chart/series-1 to 5, and the track clips the stack to its rounded shape. Changing a value changes a width, not a path, so the component survives data edits in Figma and in code."],
        ["One tick per row", "The target is a 2px tick in chart/target, the strongest text color in every mode. Keep one target per row. A range band belongs to a different chart."],
        ["Chart tokens are aliases", "chart/series-1 to 5, chart/track and chart/target alias viz/*, widget/track and text/primary, so Light, Dark and High Contrast resolve through the existing modes and no new hex value was added."],
      ],
      playground: { controls: [{ key: "size", label: "Size", options: ["Medium", "Small", "Vertical small", "Large", "XL"] }, { key: "icon", label: "Show icon", type: "bool", default: true }], render: (s) => bulletCard(s.size, s.icon) },
      when: ["One measure against a goal, per row: revenue to plan, tickets to SLA, capacity to limit.", "Breaking a measure into parts with stacked segments.", "KPI tiles that need more than a single number."],
      whenNot: ["Time series. Use Line chart.", "Ranking categories with no target. Use Horizontal bar chart.", "A single percentage. Use Progress."],
      variants: [
        ["Sizes", "Five sizes from the same data array. Small and Vertical small drop the axis labels and use a 6px track.", `<div style="display:grid;gap:24px;justify-items:start">${bulletCard("Small", false)}${bulletCard("Vertical small", false)}${bulletCard("Medium")}${bulletCard("Large", false)}</div>`],
        ["XL", "Three KPIs, six rows, up to five segments each.", bulletCard("XL")],
        ["Rows only", "The SVG on its own, for use inside another card.", `<div style="width:327px">${NS.bulletSvg(BULLET_ROWS)}</div>`],
      ],
      dd: [`<div style="width:260px">${NS.bulletSvg(BULLET_ROWS.slice(0, 2), { width: 260 })}</div>`, "An axis label and a target tick on every row.", `<div style="width:260px">${NS.bulletSvg([{ label: "", segments: [40, 10, 10, 14], target: 0 }, { label: "", segments: [38, 10, 12, 20], target: 0 }], { width: 260, labels: false })}</div>`, "No label and no target. It reads as a progress bar."],
      tokens: [["--ns-chart-series-1", "Segment 1 (alias of viz/1)"], ["--ns-chart-series-2", "Segment 2 (alias of viz/4)"], ["--ns-chart-series-3", "Segment 3 (alias of viz/2)"], ["--ns-chart-series-4", "Segment 4 (alias of viz/7)"], ["--ns-chart-series-5", "Segment 5 (alias of widget/muted)"], ["--ns-chart-track", "Track (alias of widget/track)"], ["--ns-chart-target", "Target tick (alias of text/primary)"], ["--ns-widget-bg", "Card surface"], ["--ns-border-subtle", "Card stroke and summary divider"], ["--ns-widget-muted", "Axis labels and description"], ["--ns-status-success", "Trend"], ["--ns-radius-xl", "Card radius"]],
      sizes: [["Small", "100px", "KPI tile, header left and four 6px tracks right"], ["Vertical small", "178px", "Narrow column or sidebar"], ["Medium", "284px", "Default card, five labeled 10px tracks"], ["Large", "341px", "Card with divider and two-KPI summary"], ["XL", "338px", "Wide panel, three KPIs and six rows"]],
      props: [["size", "'small' | 'vertical-small' | 'medium' | 'large' | 'xl'", "'medium'", "Layout and track height"], ["title", "string", "-", "Header title"], ["value", "string", "-", "Headline figure"], ["trend", "string", "-", "Signed change, for example +1.8%"], ["rows", "{ label, segments: number[], target }[]", "[]", "Segments and target as percent of the track"], ["showIcon", "boolean", "false", "Icon in the header"]],
      keyboard: [["-", "Not interactive"]],
      aria: ["The SVG is <code>role=\"list\"</code>; each row is a <code>listitem</code> whose label reads the segments, their sum and the target.", "Segments are told apart by order and label, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<BulletChart size="medium" title="Income" value="$18,420" trend="+1.8%" rows={[{ label: "500", segments: [40, 10, 10, 14], target: 98 }]} />',
    },
    chartEntry("bubble-chart", "bubble", {
      name: "Bubble chart", figma: "4454:37087",
      desc: "A bubble chart plots items on two axes and uses area for a third measure. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set, so the two cannot drift.",
      doc: [
        ["Points are ellipses, not vectors", "Each bubble is a plain ellipse bound to chart/series-1 to 3 at 85% opacity, so overlaps stay readable. Changing a value changes a position and a radius, not a path."],
        ["Area carries the third measure", "Radius grows with the square root of the value so the eye reads area, not width. Keep a minimum radius of 6px in Medium or the smallest point disappears."],
        ["Chart tokens are aliases", "chart/series-1 to 5 alias viz/* and widget/muted, and gridlines use widget/grid, so Light, Dark and High Contrast resolve through the existing modes."],
      ],
      when: ["Comparing a few items on two measures, with a third shown as size.", "Spotting outliers across accounts, regions or projects.", "A KPI tile that needs a shape of the data, not only a number."],
      whenNot: ["Time series. Use Line chart.", "Exact comparison of one measure. Use Bar chart.", "More than about twelve points. Use a scatter or a table."],
      tokens: [["--ns-chart-series-1", "Bubble color 1 (alias of viz/1)"], ["--ns-chart-series-2", "Bubble color 2 (alias of viz/4)"], ["--ns-chart-series-3", "Bubble color 3 (alias of viz/2)"], ["--ns-widget-grid", "Gridlines"]],
      dataType: "{ x: number, y: number, r: number, series: 1 | 2 | 3 }[]", dataNote: "Position as percent of the plot, r as relative size",
      aria: ["The SVG is <code>role=\"img\"</code> with a label that names the three measures. Provide a table of the points nearby.", "Series are told apart by position and label, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<BubbleChart size="medium" title="Accounts" value="1,240" trend="+2.4%" data={[{ x: 10, y: 62, r: 28, series: 1 }]} />',
    }),
    chartEntry("candlestick-chart", "candle", {
      name: "Candlestick chart", figma: "4458:233",
      desc: "A candlestick chart shows open, close, high and low for each period as a body and a wick. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Bodies and wicks are rectangles", "Each candle is two plain rectangles: a 1px wick from low to high and a body from open to close. Changing a value changes a height, not a path."],
        ["Direction uses the status pair", "A period that closes higher uses status/success and one that closes lower uses status/error. No new token was needed, and both resolve in Light, Dark and High Contrast."],
        ["Never color alone", "Body position and the headline trend also state the direction. Pair the chart with a table of open, close, high and low for exact numbers."],
      ],
      when: ["Price-like data where the range inside each period matters.", "Daily or per-release open, close, high and low.", "A KPI tile that needs volatility, not only a last value."],
      whenNot: ["One value per period. Use Line chart.", "Totals by category. Use Bar chart.", "Unordered categories. Use Horizontal bar chart."],
      tokens: [["--ns-status-success", "Rising candle and wick"], ["--ns-status-error", "Falling candle and wick"], ["--ns-widget-grid", "Gridlines"]],
      dataType: "{ open: number, close: number, low: number, high: number }[]", dataNote: "One entry per period, values as percent of the plot",
      aria: ["The SVG is <code>role=\"img\"</code> with a label that states the trend. Provide a table of open, close, high and low nearby.", "Direction is never carried by green and red alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<CandlestickChart size="medium" title="Index" value="4,820" trend="+0.8%" data={[{ open: 40, close: 52, low: 34, high: 58 }]} />',
    }),
    chartEntry("funnel-chart", "funnel", {
      name: "Funnel chart", figma: "4458:37265",
      desc: "A funnel chart shows how a count narrows across ordered stages, one centered bar per stage. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Stages are rectangles", "Each stage is a plain rectangle centered in the plot, with a width proportional to its count. Changing a value changes a width, not a path."],
        ["Order reads without color", "One series color steps down in opacity from the first stage to the last, so the order survives color-vision differences and High Contrast."],
        ["Keep stages few", "Five stages is the ceiling. Merge the tail into one bar, and drop the stage labels below 192px wide, where the headline carries the story."],
      ],
      when: ["Conversion across an ordered process.", "A drop-off story where each stage is a subset of the last.", "A KPI tile that needs the shape of the loss, not only the end count."],
      whenNot: ["Unordered categories. Use Horizontal bar chart.", "Flows between states. Use Sankey chart.", "Parts of a whole. Use Donut chart."],
      tokens: [["--ns-chart-series-1", "Stage bars (opacity steps by stage)"], ["--ns-widget-muted", "Stage labels"]],
      dataType: "{ label: string, value: number }[]", dataNote: "Stages in order, value as percent of the first stage",
      aria: ["The SVG is <code>role=\"img\"</code> with a label naming the stages. Provide a table of counts and conversion rates nearby.", "Order is carried by position and width, never by color.", "Trend text carries its sign, so the color is a second signal."],
      react: '<FunnelChart size="medium" title="Signups" value="8,420" trend="+3.2%" data={[{ label: "Visits", value: 100 }, { label: "Signups", value: 78 }]} />',
    }),
    chartEntry("dumbbell-chart", "dumbbell", {
      name: "Dumbbell chart", figma: "4458:37527",
      desc: "A dumbbell chart joins two values per row to show the gap between them, such as before and after. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Points are ellipses, links are rectangles", "Each row is two ellipses joined by a 2px rectangle. Changing a value moves a point and resizes the link; nothing is a vector."],
        ["Start and end have fixed colors", "The start point uses chart/series-2 and the end point chart/series-1 in every row, so the direction of change reads at a glance."],
        ["Sort when the order is free", "Sorting rows by gap size makes the largest change the first thing seen. Keep the same row order across sizes."],
      ],
      when: ["Change between two states across several categories.", "Plan against actual, or this period against the last.", "A KPI tile that needs the gap per group."],
      whenNot: ["One value per row. Use Horizontal bar chart.", "More than two states. Use Line chart.", "Time series. Use Line chart."],
      tokens: [["--ns-chart-series-1", "End point (alias of viz/1)"], ["--ns-chart-series-2", "Start point (alias of viz/4)"], ["--ns-widget-grid", "Link between the points"]],
      dataType: "{ label: string, from: number, to: number }[]", dataNote: "Values as percent of the plot width",
      aria: ["The SVG is <code>role=\"img\"</code> with a label naming both states. Provide a table of start and end values nearby.", "Start and end are told apart by color and position; add a legend when that is not obvious.", "Trend text carries its sign, so the color is a second signal."],
      react: '<DumbbellChart size="medium" title="Satisfaction" value="4.6" trend="+0.3%" data={[{ label: "North", from: 20, to: 62 }]} />',
    }),
    chartEntry("heatmap-chart", "heatmap", {
      name: "Heatmap chart", figma: "4458:38007",
      desc: "A heatmap shows a measure as the intensity of cells in a grid of two categories. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Cells are rectangles", "Each cell is a plain rectangle in chart/series-1 whose opacity carries the value, from 12% to 100%. Changing a value changes an opacity, not a path."],
        ["One hue, one scale", "A single-hue ramp survives color-vision differences and High Contrast. Keep every cell on one scale, and show exact values in a table or on focus."],
        ["Quiet cells stay quiet", "The lightest cells are intentionally low contrast. They never carry meaning alone, so pair the grid with the numbers."],
      ],
      when: ["Patterns across two categories at once.", "Activity by weekday and hour, or errors by service and day.", "A KPI tile that needs where the load sits."],
      whenNot: ["Exact values. Use Data table.", "One category. Use Bar chart.", "Trends over time. Use Line chart."],
      tokens: [["--ns-chart-series-1", "Cell color (opacity carries the value)"], ["--ns-widget-muted", "Row and column labels"]],
      dataType: "number[][]", dataNote: "Rows of values from 0 to 1",
      aria: ["The SVG is <code>role=\"img\"</code> with a label naming both categories. Provide a table of the values nearby.", "Intensity is a single-hue ramp; show exact values in a table or on focus.", "Trend text carries its sign, so the color is a second signal."],
      react: '<HeatmapChart size="medium" title="Activity" value="3,260" trend="+5.1%" data={[[0.2, 0.8, 0.5]]} />',
    }),
    chartEntry("parallel-coordinates-chart", "parallel", {
      name: "Parallel coordinates chart", figma: "4460:166",
      desc: "A parallel coordinates chart compares several measures across profiles, one line per profile, so you can see which profiles move together. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Axes are rectangles, profiles are paths", "Each measure is a 1px rectangle and each profile is one 2px vector path across the axes. The paths are the only vector layers in the set."],
        ["Normalize every axis", "Plot each measure on a 0 to 1 scale so the lines are comparable, and keep the axis order the same in every size."],
        ["Keep profiles few", "Four to six profiles stay readable. Beyond that, highlight one profile at a time and mute the rest."],
      ],
      when: ["Comparing items across four to six measures at once.", "Seeing which profiles move together.", "A KPI tile that needs the shape of each profile."],
      whenNot: ["Two measures. Use Scatter chart.", "Time series. Use Line chart.", "More than about eight profiles. Use a table."],
      tokens: [["--ns-chart-series-1", "Profile 1 (alias of viz/1)"], ["--ns-chart-series-2", "Profile 2 (alias of viz/4)"], ["--ns-chart-series-3", "Profile 3 (alias of viz/2)"], ["--ns-chart-series-4", "Profile 4 (alias of viz/7)"], ["--ns-widget-grid", "Axes"]],
      dataType: "number[][]", dataNote: "One array per profile, values from 0 to 1 per axis",
      aria: ["The SVG is <code>role=\"img\"</code> with a label naming the measures. Provide a table of the values per profile nearby.", "Lines are told apart by label or by highlighting, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<ParallelCoordinatesChart size="medium" title="Profiles" value="128" trend="+4.0%" data={[[0.2, 0.7, 0.4, 0.8, 0.5]]} />',
    }),
    chartEntry("stepped-line-chart", "stepped", {
      name: "Stepped line chart", figma: "4460:37871",
      desc: "A stepped line chart shows a value that holds steady and then changes at set points in time. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Steps sit on the change", "The line runs flat until a change date and then moves vertically, so the corner marks the date. A smooth line would imply values that never existed."],
        ["Two series at most", "chart/series-1 and chart/series-3 give the two lines their own colors. Add direct labels when a third is needed."],
        ["Gridlines stay quiet", "Gridlines are 1px rectangles in widget/grid, so the steps carry the contrast."],
      ],
      when: ["Limits, prices and plan tiers that change on a date.", "Quotas and rates that hold between changes.", "A KPI tile that needs the history of a setting."],
      whenNot: ["Continuous measures. Use Line chart.", "Totals by category. Use Bar chart.", "A single current value. Use a KPI tile."],
      tokens: [["--ns-chart-series-1", "Series 1 (alias of viz/1)"], ["--ns-chart-series-3", "Series 2 (alias of viz/2)"], ["--ns-widget-grid", "Gridlines"]],
      dataType: "number[][]", dataNote: "One array per series, values from 0 to 1 at each change point",
      aria: ["The SVG is <code>role=\"img\"</code> with a label that states the values and the dates they change.", "Series are told apart by label and position, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<SteppedLineChart size="medium" title="Plan limit" value="2,400" trend="+2.0%" data={[[0.3, 0.3, 0.5, 0.45]]} />',
    }),
    chartEntry("scatter-chart", "scatter", {
      name: "Scatter chart", figma: "4460:38167",
      desc: "A scatter chart plots samples on two measures and shows the relationship between them, with an optional trend line. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Points are ellipses", "Each sample is a plain ellipse in chart/series-1 or chart/series-2 at 85% opacity, so dense regions read as darker."],
        ["One trend line", "The trend is a single 1.5px path in chart/target. It states the relationship; it does not forecast."],
        ["Reduce size before opacity", "When data gets denser, shrink the points first. Lower opacity hides the overlap you are trying to show."],
      ],
      when: ["How two measures relate across many samples.", "Finding outliers against a trend.", "A KPI tile that needs the spread, not only the average."],
      whenNot: ["A third measure. Use Bubble chart.", "Fewer than ten samples. Use Bar chart.", "Time series. Use Line chart."],
      tokens: [["--ns-chart-series-1", "Points (alias of viz/1)"], ["--ns-chart-series-2", "Second group (alias of viz/4)"], ["--ns-chart-target", "Trend line (alias of text/primary)"], ["--ns-widget-grid", "Gridlines"]],
      dataType: "{ x: number, y: number, series: 1 | 2 }[]", dataNote: "Position as percent of the plot",
      aria: ["The SVG is <code>role=\"img\"</code> with a label that states the relationship. Provide a table of the values nearby.", "Groups are told apart by label or shape in a legend, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<ScatterChart size="medium" title="Samples" value="240" trend="+6.2%" data={[{ x: 20, y: 38, series: 1 }]} />',
    }),
    chartEntry("gauge-chart", "gauge", {
      name: "Gauge chart", figma: "4460:38422",
      desc: "A gauge chart shows one value against its limit on a half circle. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Arcs are ellipses", "The track and the value are ellipses with arc data and a 72% inner radius, not vector paths. Changing the value changes an end angle."],
        ["The number is printed", "The value sits inside the arc as text, so the arc length is never the only signal."],
        ["One measure per gauge", "A gauge answers one question. Use a bullet chart when several measures share a goal."],
      ],
      when: ["One measure against its ceiling: capacity, quota, budget.", "A status tile that needs the headroom at a glance.", "Small spaces where a number needs context."],
      whenNot: ["More than one measure. Use Bullet chart.", "Trends. Use Line chart.", "Parts of a whole. Use Donut chart."],
      tokens: [["--ns-chart-series-1", "Value arc (alias of viz/1)"], ["--ns-chart-track", "Track arc (alias of widget/track)"], ["--ns-text-primary", "Value label"]],
      dataType: "{ value: number, max: number }", dataNote: "Value and limit in the same unit",
      aria: ["The SVG is <code>role=\"img\"</code> with the value and the limit in the label, for example 72 percent of the limit used.", "The value is also printed as text inside the arc.", "Trend text carries its sign, so the color is a second signal."],
      react: '<GaugeChart size="medium" title="Capacity" value="72%" trend="+4.0%" data={{ value: 72, max: 100 }} />',
    }),
    chartEntry("radial-bar-chart", "radialbar", {
      name: "Radial bar chart", figma: "4462:148",
      desc: "A radial bar chart shows progress toward a target as concentric rings, one ring per goal. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Rings are ellipses with arc data", "Each ring is an ellipse arc over a 270 degree track. Changing a value changes an end angle, not a path."],
        ["Inner rings travel less", "A short arc on an inner ring is the same value as a longer arc outside. Print the values, or keep a table nearby, when the comparison matters."],
        ["Four rings at most", "Beyond four, the rings get thin and the order stops reading. Use a bar chart for longer lists."],
      ],
      when: ["Progress for three to four goals against one target.", "Compact status tiles with several measures.", "A KPI tile that needs more than one number."],
      whenNot: ["Parts of a whole. Use Donut chart.", "Exact comparison. Use Horizontal bar chart.", "More than five goals. Use a table."],
      tokens: [["--ns-chart-series-1", "Ring 1 (alias of viz/1)"], ["--ns-chart-series-2", "Ring 2 (alias of viz/4)"], ["--ns-chart-series-3", "Ring 3 (alias of viz/2)"], ["--ns-chart-series-4", "Ring 4 (alias of viz/7)"], ["--ns-chart-track", "Ring tracks"]],
      dataType: "number[]", dataNote: "One value per ring from 0 to 1, outer ring first",
      aria: ["The SVG is <code>role=\"img\"</code> with a label naming each goal and its value.", "Rings are told apart by order and label, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<RadialBarChart size="medium" title="Progress" value="78%" trend="+5.0%" data={[0.8, 0.62, 0.45, 0.3]} />',
    }),
    chartEntry("radial-histogram-chart", "radialhist", {
      name: "Radial histogram chart", figma: "4462:38356",
      desc: "A radial histogram shows counts around a circle, one bar per hour, day or direction, where the end of the cycle meets the start. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Bars are arc segments", "Each bar is an ellipse arc segment 14 degrees wide with a 1 degree gap, so changing a value changes an outer radius."],
        ["A hole in the middle", "The inner radius is 28% of the outer radius, which keeps short bars visible and gives the eye a center."],
        ["State the start", "The circle has no left edge. Say where the cycle starts in the title or description."],
      ],
      when: ["Cyclic measures: hours of the day, days of the week, compass direction.", "Finding the busy and quiet part of a cycle.", "A KPI tile that needs the daily rhythm."],
      whenNot: ["A measure with no cycle. Use Bar chart.", "Exact comparison. Use Horizontal bar chart.", "Time series that do not repeat. Use Line chart."],
      tokens: [["--ns-chart-series-1", "Bars (alias of viz/1)"], ["--ns-chart-series-2", "Reference bars (alias of viz/4)"]],
      dataType: "number[]", dataNote: "One value per slot from 0 to 1, clockwise from the top",
      aria: ["The SVG is <code>role=\"img\"</code> with a label that names the cycle. Provide a table of the values per slot nearby.", "The start of the cycle is stated in text.", "Trend text carries its sign, so the color is a second signal."],
      react: '<RadialHistogramChart size="medium" title="Requests" value="1,860" trend="+2.2%" data={[0.3, 0.7, 0.5]} />',
    }),
    chartEntry("radar-chart", "radar", {
      name: "Radar chart", figma: "4462:38673",
      desc: "A radar chart compares several measures for one or two items on radial axes. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Grid is vector, marks are fills", "Rings and axes are 1px vector paths in widget/grid. Each series is one closed path with a 22% fill and a 2px stroke of the same token."],
        ["Two series at most", "chart/series-3 and chart/series-1 keep two shapes apart. A third makes the overlap unreadable, so use a table or small multiples."],
        ["Order carries meaning", "Neighbouring axes read as related, so put related measures next to each other and keep the order in every size."],
      ],
      when: ["One or two items across five to eight measures.", "Comparing an item against a target profile.", "A KPI tile that needs balance, not only a total."],
      whenNot: ["Exact values. Use Data table.", "More than three items. Use Parallel coordinates chart.", "Fewer than five measures. Use Bar chart."],
      tokens: [["--ns-chart-series-1", "Series 2 (alias of viz/1)"], ["--ns-chart-series-3", "Series 1 (alias of viz/2)"], ["--ns-widget-grid", "Rings and axes"]],
      dataType: "number[][]", dataNote: "One array per series, six values from 0 to 1",
      aria: ["The SVG is <code>role=\"img\"</code> with a label naming the measures. Provide a table of the values per series nearby.", "Series are told apart by label and stroke, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<RadarChart size="medium" title="Coverage" value="86%" trend="+3.0%" data={[[0.8, 0.6, 0.7, 0.5, 0.9, 0.6]]} />',
    }),
    chartEntry("radial-convergence-chart", "convergence", {
      name: "Radial convergence chart", figma: "4462:38977",
      desc: "A radial convergence chart joins nodes around a ring with straight links, to show who is connected to whom. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Nodes are ellipses, links are paths", "Each node is an ellipse on a fixed ring position and each link is a 1.5px vector path between two nodes."],
        ["Alternate colors by index", "Links alternate between chart/series-1 and chart/series-2 so neighbours separate. Color does not carry meaning on its own."],
        ["Keep crossings few", "Twelve nodes and under ten links stay readable. Beyond that, filter to one node's links."],
      ],
      when: ["Relationships inside one set of members.", "Teams that work together or services that call each other.", "A KPI tile that needs connectedness, not only a count."],
      whenNot: ["Directed, sized flows. Use Sankey chart.", "Hierarchies. Use Tree chart.", "More than about twenty nodes. Use a table."],
      tokens: [["--ns-chart-series-1", "Links, odd (alias of viz/1)"], ["--ns-chart-series-2", "Links, even (alias of viz/4)"], ["--ns-text-primary", "Nodes"]],
      dataType: "[number, number][]", dataNote: "Pairs of node indexes, 0 to 11",
      aria: ["The SVG is <code>role=\"img\"</code> with a label that states how many links join how many nodes. Provide a table of the pairs nearby.", "Links are told apart by endpoint, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<RadialConvergenceChart size="medium" title="Links" value="12" trend="+2.0%" data={[[0, 5], [1, 7]]} />',
    }),
    chartEntry("sunburst-chart", "sunburst", {
      name: "Sunburst chart", figma: "4463:163",
      desc: "A sunburst chart shows a hierarchy as nested rings, with the angle of each arc carrying its share. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Arcs are ellipses", "Each arc is an ellipse with arc data on one of two rings, with 0.8 degrees trimmed from both ends so neighbours separate. Nothing is a vector."],
        ["Children share the parent hue", "Items on the outer ring use the parent token at 60% opacity, so the hierarchy reads without extra labels."],
        ["Two levels at most", "More rings turn the arcs into slivers. Use a tree chart or a table for deeper hierarchies."],
      ],
      when: ["Part-to-whole at two levels at once.", "Categories and their items, with the angle carrying the share.", "A KPI tile that needs the make-up of a total."],
      whenNot: ["Deeper hierarchies. Use Tree chart.", "One level. Use Donut chart.", "Exact size comparison. Use Bar chart."],
      tokens: [["--ns-chart-series-1", "Group 1 and its items (alias of viz/1)"], ["--ns-chart-series-2", "Group 2 and its items (alias of viz/4)"], ["--ns-chart-series-3", "Group 3 and its items (alias of viz/2)"]],
      dataType: "{ label: string, value: number, children: { label: string, value: number }[] }[]", dataNote: "Values become angles; children share the parent color",
      aria: ["The SVG is <code>role=\"img\"</code> with a label naming the groups and their items. Provide a nested list of the values nearby.", "Groups are told apart by position and label, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<SunburstChart size="medium" title="Categories" value="11" trend="+2.0%" data={[{ label: "Group A", value: 150, children: [] }]} />',
    }),
    chartEntry("tree-chart", "tree", {
      name: "Tree chart", figma: "4463:38870",
      desc: "A tree chart shows a hierarchy as nodes joined by elbow lines, with the root on the left. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Nodes are ellipses, edges are paths", "Each node is an ellipse and each edge is a 1.5px vector path with one elbow. Moving a node means moving its ellipse and redrawing its edge."],
        ["Level reads by hue", "The root uses chart/series-1, branches chart/series-2 and leaves chart/series-3. Position and the level labels carry the same information."],
        ["Three levels in a card", "Deeper trees need room and labels. Link to a full tree view instead of shrinking nodes."],
      ],
      when: ["Org structure, folders and decision paths.", "How one thing divides into parts and sub-parts.", "A KPI tile that needs the shape of a hierarchy."],
      whenNot: ["Part-to-whole. Use Sunburst chart or Treemap chart.", "Flows with sizes. Use Sankey chart.", "More than three levels. Use a table or a tree view."],
      tokens: [["--ns-chart-series-1", "Root (alias of viz/1)"], ["--ns-chart-series-2", "Branches (alias of viz/4)"], ["--ns-chart-series-3", "Leaves (alias of viz/2)"], ["--ns-widget-grid", "Edges"]],
      dataType: "{ label: string, children?: Node[] }", dataNote: "A root node with nested children",
      aria: ["The SVG is <code>role=\"img\"</code> with a label that states the levels. Provide a nested list of the nodes nearby.", "Level is told apart by position and label, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<TreeChart size="medium" title="Teams" value="7" trend="+1.0%" data={{ label: "Root", children: [] }} />',
    }),
    chartEntry("treemap-chart", "treemap", {
      name: "Treemap chart", figma: "4463:39101",
      desc: "A treemap shows shares of a whole as nested rectangles sized by value. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Tiles are rectangles", "Each tile is a plain rectangle in chart/series-1 to 5 at 90% opacity with a 4px radius and a 3px gap. Changing a share changes a width and a height."],
        ["Keep the layout stable", "Slice and dice puts the largest tile top left. Keep the order stable between loads so tiles do not jump."],
        ["Label the large tiles", "Small tiles cannot hold text. Label the largest ones and list the rest."],
      ],
      when: ["Many parts of a whole where area is enough.", "Storage by type or spend by team.", "A KPI tile that needs the make-up of a total."],
      whenNot: ["Exact comparison. Use Horizontal bar chart.", "Time series. Use Line chart.", "Fewer than three parts. Use Donut chart."],
      tokens: [["--ns-chart-series-1", "Tile 1 (alias of viz/1)"], ["--ns-chart-series-2", "Tile 2 (alias of viz/4)"], ["--ns-chart-series-3", "Tile 3 (alias of viz/2)"], ["--ns-chart-series-4", "Tile 4 (alias of viz/7)"], ["--ns-chart-series-5", "Tile 5 (alias of widget/muted)"]],
      dataType: "{ label: string, value: number }[]", dataNote: "Values become areas, largest first",
      aria: ["The SVG is <code>role=\"img\"</code> with a label naming the tiles and their shares. Provide a table nearby.", "Tiles are told apart by position and label, never by color alone.", "Trend text carries its sign, so the color is a second signal."],
      react: '<TreemapChart size="medium" title="Storage" value="640 GB" trend="+3.0%" data={[{ label: "Photos", value: 40 }]} />',
    }),
    chartEntry("calendar-chart", "calendar", {
      name: "Calendar chart", figma: "4463:39465",
      desc: "A calendar chart shows one value per day of a month as the intensity of a cell. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.",
      doc: [
        ["Days are rectangles", "Each day is a plain rectangle in chart/series-1 whose opacity carries the value, from 10% to 100%."],
        ["Today has an outline", "Today is marked with a 2px outline in chart/target as well as its intensity, so it never relies on color alone."],
        ["Month in the title", "Put the month in the title and start the week on the day the rest of the product uses."],
      ],
      when: ["Daily activity or status across one month.", "Streaks, gaps and busy days.", "A KPI tile that needs consistency, not only a total."],
      whenNot: ["Exact values. Use Data table.", "Spans longer than a few months. Use Heatmap chart.", "One number. Use a KPI tile."],
      tokens: [["--ns-chart-series-1", "Day cells (opacity carries the value)"], ["--ns-chart-target", "Today outline (alias of text/primary)"]],
      dataType: "number[]", dataNote: "One value per day from 0 to 1, week by week",
      aria: ["The SVG is <code>role=\"img\"</code> with a label that states the month and the busiest days. Provide a table of the daily values nearby.", "Today is marked by an outline as well as intensity.", "Trend text carries its sign, so the color is a second signal."],
      react: '<CalendarChart size="medium" title="Active days" value="19" trend="+3.0%" data={[0.2, 0.8, 0.5]} />',
    }),
  ];

  NS.COMPONENTS.sort((a, b) => a.name.localeCompare(b.name));
  NS.componentById = (id) => NS.COMPONENTS.find((c) => c.id === id);

  /* ---------- page renderer ---------- */
  NS.renderComponent = function (c, tab) {
    const spec = NS.SPECS && NS.SPECS[c.id];
    const tabs = ["usage", "style", "code", "accessibility", ...(spec ? ["spec"] : [])];
    tab = tabs.includes(tab) ? tab : "usage";
    let body = "";
    if (tab === "usage") {
      body += NS.h2("Live demo") + NS.playground(c.playground);
      body += NS.h2("Overview") + `<p>${c.desc}</p>`;
      if (c.axes) body += NS.h3("Figma variants") + NS.table(["Property", "Values"], c.axes.map(([a, b]) => [`<code>${a}</code>`, b]));
      if (c.figma) body += `<p><a href="${NS.FIGMA}?node-id=${c.figma.replace(":", "-")}" target="_blank" rel="noopener">Open ${c.name} in Figma \u2197</a></p>`;
      if (c.doc && c.doc.length) body += NS.h3("Guidelines") + c.doc.map(([t, d]) => `<h4>${t}</h4><p>${d}</p>`).join("");
      body += NS.h3("When to use") + `<ul>${c.when.map((w) => `<li>${w}</li>`).join("")}</ul>`;
      body += NS.h3("When not to use") + `<ul>${c.whenNot.map((w) => `<li>${w}</li>`).join("")}</ul>`;
      if (c.variants.length) { body += NS.h2("Variants"); c.variants.forEach(([n, d, h]) => (body += `${NS.h3(n)}<p>${d}</p>${NS.VARIANT_GUIDE?.[c.id]?.[n] ? `<p class="variant-guide"><b>Use when:</b> ${NS.VARIANT_GUIDE[c.id][n]}</p>` : ""}${NS.stage(h, { label: n })}`)); }
      body += NS.h2("Best practices") + NS.dd(...c.dd);
      const related = NS.COMPONENTS.filter((o) => o.cat === c.cat && o.id !== c.id).slice(0, 4);
      if (related.length) body += NS.h2("Related") + `<ul>${related.map((o) => `<li><a href="#/components/${o.id}">${o.name}</a></li>`).join("")}</ul>`;
    } else if (tab === "style") {
      body += NS.h2("Tokens") + `<p>Every value below is a CSS custom property. Click a row to copy the token. Open the token editor (${"⚙"} in the header) to change them live.</p>`;
      body += `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>Token</th><th>Role</th><th>Current value</th></tr></thead><tbody>${c.tokens.map(([t, r]) => { const v = t.startsWith("--") && !t.includes(" ") ? NS.tokenValue(t) : ""; return `<tr class="tok-row" data-copy="${t.split(" ")[0]}"><td><code>${t}</code></td><td>${r}</td><td>${v ? `${/^#|rgb/.test(v) ? `<span class="chip" style="background:${v}"></span>` : ""}<code>${x(v)}</code>` : "-"}</td></tr>`; }).join("")}</tbody></table></div>`;
      if (c.sizes) body += NS.h2("Sizes") + NS.table(["Size", "Height", "Use"], c.sizes);
      body += NS.h2("Theming") + `<p>${c.name} reads only semantic roles, so switching the theme (header toggle) swaps its colors without any class changes.</p>`;
    } else if (tab === "code") {
      body += NS.h2("React") + NS.codeBlock(c.react, "js");
      body += NS.h2("HTML + CSS") + `<p>Framework-free markup using <code>components.css</code> classes and <code>tokens.css</code> variables.</p>` + NS.codeBlock(c.playground.render(Object.fromEntries((c.playground.controls || []).map((k) => [k.key, k.default ?? (k.options ? k.options[0] : k.type === "bool" ? false : "")]))), "html");
      body += NS.h2("Props") + NS.table(["Prop", "Type", "Default", "Description"], c.props.map((p) => [`<code>${p[0]}</code>`, `<code>${x(p[1])}</code>`, `<code>${x(p[2])}</code>`, p[3]]));
    } else if (tab === "spec") {
      body += NS.renderSpec(spec);
    } else {
      body += NS.h2("What NorthStar provides") + `<ul>${c.aria.map((a) => `<li>${a}</li>`).join("")}</ul>`;
      body += NS.h2("Keyboard interactions") + NS.table(["Key", "Interaction"], c.keyboard.map(([k, a]) => [k === "-" ? "-" : k.split(" / ").map((s) => `<kbd>${s}</kbd>`).join(" / "), a]));
      body += NS.h2("Design recommendations") + `<ul><li>Keep contrast at WCAG 2.2 AA: 4.5:1 for text, 3:1 for UI boundaries and focus rings.</li><li>Never communicate state with color alone.</li><li>Keep touch targets at least 24 x 24px, 40px preferred.</li></ul>`;
      body += NS.h2("Development considerations") + `<p>Test with VoiceOver and NVDA, keyboard only, and 200% zoom. See the <a href="#/accessibility/checklist">accessibility checklist</a>.</p>`;
    }
    return { tabs, tab, body };
  };

  /* ---------- Figma specification documents (data in specs.js) ---------- */
  const figLink = (id, label) => `<a href="${NS.FIGMA}?node-id=${id.replace(":", "-")}" target="_blank" rel="noopener">${label} ↗</a>`;
  const linkify = (s) => x(s).replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  NS.renderSpecBlock = (b) => {
    if (b.type === "text") return `<p>${linkify(b.text)}</p>`;
    if (b.type === "label") return `<p class="spec-label">${x(b.text)}</p>`;
    if (b.type === "table") return NS.table(b.columns.map(x), b.rows.map((r) => r.map(linkify)));
    if (b.type === "checklist") return `<ul class="spec-check">${b.items.map((i) => `<li>${x(i)}</li>`).join("")}</ul>`;
    if (b.type === "note") return NS.notice("warning", x(b.heading || "Review note"), linkify(b.text));
    if (b.type === "links") return `<ul>${b.items.map((u) => `<li>${linkify(u)}</li>`).join("")}</ul>`;
    if (b.type === "example") return `<p class="spec-specimen"><span>Figma specimen${b.label ? ` · ${x(b.label)}` : ""}</span>${x(b.description)}</p>`;
    return "";
  };
  NS.renderSpec = (d) => {
    const m = d.meta || {};
    let h = `<div class="spec-head"><p class="spec-label">${x(d.category)} · ${x(d.revision)}</p><p>${x(d.summary)}</p>
<div class="spec-status">${Object.entries(m).map(([k, v]) => `<span><b>${x(k)}</b>${x(String(v).replace(/^Owner: /, ""))}</span>`).join("")}</div>
<p>${figLink(d.nodeId, "Open the full specification in Figma")}</p></div>`;
    d.sections.forEach((s) => {
      h += NS.h2(`${s.number} ${s.heading}`);
      s.blocks.forEach((b) => (h += NS.renderSpecBlock(b)));
    });
    if (d.footer && d.footer.length) h += `<p class="spec-foot">${d.footer.map(x).join(" · ")}</p>`;
    return h;
  };
})();
