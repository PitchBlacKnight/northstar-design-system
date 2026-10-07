/* Component catalog. Each entry feeds the Usage / Style / Code / Accessibility template. */
(function () {
  const NS = window.NS;
  const x = NS.esc;

  const rows = [
    ["Acme Corp", "Gold", 12400, "active"], ["Beta LLC", "Silver", 5200, "pending"], ["Zeta Inc", "Platinum", 38900, "active"],
    ["Northwind", "Silver", 7300, "error"], ["Globex", "Gold", 19850, "active"],
  ];
  const statusBadge = (s) => `<span class="ns-dot ns-dot--${{ active: "success", pending: "warning", error: "error" }[s]}">${s}</span>`;
  const tableHtml = (o = {}) => `<div class="ns-table-wrap" style="width:100%">${o.batch ? `<div class="ns-table-bar"><b data-batch-label data-default="Partners">Partners</b><div style="display:flex;gap:8px"><button class="ns-btn ns-btn--sm ns-btn--tertiary">Export</button><button class="ns-btn ns-btn--sm">Add partner</button></div></div>` : ""}
<table class="ns-table ${o.size === "Compact" ? "ns-table--compact" : ""} ${o.zebra ? "ns-table--zebra" : ""}">
  <thead><tr>${o.batch ? '<th><label class="ns-check"><input type="checkbox" data-select-all aria-label="Select all rows"/></label></th>' : ""}<th data-sort>Partner <span class="ns-sort">↕</span></th><th data-sort>Tier <span class="ns-sort">↕</span></th><th data-sort class="num">MRR <span class="ns-sort">↕</span></th><th>Status</th></tr></thead>
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
      variants: [["States", "Default, Focus, Error, Warning, Disabled.", '<div class="ns-field" style="width:180px"><input class="ns-input ns-input--md" placeholder="Default"/></div><div class="ns-field" style="width:180px"><input class="ns-input ns-input--md is-focus" placeholder="Focus"/></div><div class="ns-field is-error" style="width:180px"><input class="ns-input ns-input--md" placeholder="Error"/></div><div class="ns-field is-warning" style="width:180px"><input class="ns-input ns-input--md" placeholder="Warning"/></div><div class="ns-field" style="width:180px"><input class="ns-input ns-input--md" placeholder="Disabled" disabled/></div>'], ["Sizes", "32, 36, 48.", '<input class="ns-input ns-input--sm" style="width:220px" placeholder="Small" aria-label="Small"/><input class="ns-input ns-input--md" style="width:220px" placeholder="Medium" aria-label="Medium"/><input class="ns-input ns-input--lg" style="width:220px" placeholder="Large" aria-label="Large"/>'], ["Textarea", "Multi-line text.", '<div class="ns-field" style="width:260px"><label class="ns-label">Notes</label><textarea class="ns-textarea">Rotating keys on Friday.</textarea></div>']],
      dd: ['<div class="ns-field" style="width:220px"><label class="ns-label">Email</label><input class="ns-input" placeholder="name@company.com"/></div>', "Keep a visible label above the field at all times.", '<input class="ns-input" style="width:220px" placeholder="Email"/>', "Rely on placeholder text as the only label. It disappears on input."],
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
      keyboard: [["Enter / Space", "Open menu"], ["Arrow up / down", "Move between items"], ["Enter", "Select item"], ["Esc", "Close and return focus"]],
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
        render: (s) => `<fieldset style="border:0;padding:0;margin:0"><legend class="ns-label" style="margin-bottom:10px">Deployment strategy</legend><div style="display:flex;gap:${s.dir === "Horizontal" ? "24px" : "12px"};flex-direction:${s.dir === "Horizontal" ? "row" : "column"}">${["Rolling", "Blue / green", "Canary"].map((l, i) => `<label class="ns-check ns-check--radio"><input type="radio" name="rb"${i === 0 ? " checked" : ""}${s.disabled ? " disabled" : ""}/> ${l}</label>`).join("")}</div></fieldset>`,
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
      variants: [["With ticks", "Labeled scale.", '<div style="width:260px"><input class="ns-slider" type="range" value="30" style="--_pct:30%"/><div class="ns-slider-ticks"><span>0</span><span>100</span></div></div>']],
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
      playground: { controls: [{ key: "mode", label: "Mode", options: ["Range", "Single"] }], render: (s) => `<div style="display:grid;gap:12px"><div class="ns-field" style="width:280px"><label class="ns-label">${s.mode === "Range" ? "Reporting window" : "Start date"}</label><input class="ns-input" value="${s.mode === "Range" ? "09/10/2026 - 09/16/2026" : "09/10/2026"}"/></div>${cal()}</div>` },
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
      playground: { controls: [], block: true, render: () => `<div style="display:grid;gap:12px;max-width:460px;margin:0 auto"><label class="ns-drop" id="drop-demo"><span style="font-size:22px">↑</span><span>Drag files here or <b>browse</b></span><span class="ns-helper">CSV, JSON up to 25 MB</span><input type="file" class="sr-only" multiple/></label><div class="ns-file"><span class="ns-file__ext">CSV</span><div><b>partners-q3.csv</b><div class="ns-progress" style="margin-top:6px"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:72%"></div></div></div></div><span class="ns-helper">72%</span></div><div class="ns-file"><span class="ns-file__ext" style="color:var(--ns-status-error)">PDF</span><div><b>contract.pdf</b><div class="ns-helper" style="color:var(--ns-status-error)">File type not supported</div></div><button class="ns-notice__close" aria-label="Remove">×</button></div></div>`,
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
      playground: { controls: [{ key: "size", label: "Size", options: ["Medium", "Large", "Small"] }], render: (s) => `<div class="ns-search" role="search" style="width:360px">${NS.icon.search}<input class="ns-input${s.size === "Large" ? " ns-input--lg" : s.size === "Small" ? " ns-input--sm" : ""}" type="search" placeholder="Search partners, nodes, tickets" aria-label="Search"/><kbd>/</kbd></div>` },
      when: ["Large collections where browsing is slow.", "Filtering a table or list in place."],
      whenNot: ["Fewer than ~10 items: show them all."],
      variants: [["Global", "Opens a command palette. Try ⌘K on this site.", '<button class="hdr__search" style="min-width:260px" data-open-search>' + NS.icon.search + '<span class="label">Search docs</span><kbd>⌘K</kbd></button>']],
      dd: ['<div class="ns-search" style="width:220px">' + NS.icon.search + '<input class="ns-input" placeholder="Search nodes" aria-label="Search nodes"/></div>', "Say what is searchable in the placeholder.", '<div class="ns-search" style="width:220px">' + NS.icon.search + '<input class="ns-input" placeholder="Search" aria-label="Search"/></div>', "Use a generic placeholder when scope is narrow."],
      tokens: [["--ns-radius-full", "Pill shape"], ["--ns-text-tertiary", "Icon"], ["--ns-focus-ring", "Focus"]],
      props: [["placeholder", "string", "-", "Hint"], ["size", "'sm' | 'md' | 'lg'", "'md'", "Height"], ["onSearch", "(q) => void", "-", "Handler"]],
      keyboard: [["/ or ⌘K", "Open global search"], ["Esc", "Clear or close"], ["Arrow keys + Enter", "Pick a result"]],
      aria: ["Wrap in <code>role=\"search\"</code> and give the input an <code>aria-label</code>.", "Announce result counts in a polite live region."],
      react: "<Search size=\"md\" labelText=\"Search\" placeholder=\"Search partners\" onChange={filter} />",
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
        render: (s) => `<div class="ns-card${s.kind === "Elevated" ? " ns-card--elevated" : s.kind === "Clickable" ? " ns-card--clickable" : ""}" style="width:320px">${s.kind === "With strip" ? '<div class="ns-card__strip">Partner</div>' : ""}<h3 class="ns-card__title">Acme Corp</h3><p class="ns-card__body">Gold tier. 14 active integrations across 3 regions. Renewal in 42 days.</p><div style="display:flex;gap:8px"><span class="ns-dot ns-dot--success">Active</span></div>${s.kind === "Clickable" ? "" : '<div><button class="ns-btn ns-btn--sm ns-btn--tertiary">View details</button></div>'}</div>`,
      },
      when: ["Collections of similar objects to scan and compare.", "Dashboard tiles with one job each."],
      whenNot: ["Dense tabular data: use a data table."],
      variants: [["KPI tile", "Metric card for dashboards.", '<div class="ns-kpi" style="width:200px"><span class="ns-kpi__label">Active partners</span><span class="ns-kpi__value">1,284</span><span class="ns-kpi__delta">↑ +6.2%</span></div>']],
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
      dd: ['<span class="ns-helper">MRR column right-aligned, monospace</span>', "Right-align numbers so magnitudes line up.", '<span class="ns-helper">MRR column centered, proportional</span>', "Center numeric columns."],
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
      playground: { controls: [{ key: "kind", label: "Kind", options: ["Skeleton", "Spinner"] }], render: (s) => s.kind === "Spinner" ? `<span class="ns-spin" role="status" aria-label="Loading"></span>` : `<div style="width:360px;display:grid;gap:10px" aria-busy="true" aria-label="Loading partners"><div class="ns-skel" style="height:20px;width:60%"></div><div class="ns-skel" style="height:12px"></div><div class="ns-skel" style="height:12px;width:85%"></div><div class="ns-skel" style="height:80px;margin-top:6px"></div></div>` },
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
      playground: { controls: [{ key: "sep", label: "Separator", options: ["Slash", "Chevron"] }], render: (s) => `<nav aria-label="Breadcrumb"><ol class="ns-breadcrumb${s.sep === "Chevron" ? " ns-breadcrumb--chevron" : ""}"><li><a href="#/">Partners</a></li><li><a href="#/">Acme Corp</a></li><li><a href="#/">Integrations</a></li><li aria-current="page">Salesforce sync</li></ol></nav>` },
      when: ["Hierarchies three or more levels deep."], whenNot: ["Flat sites or single-level apps."],
      variants: [], dd: ['<ol class="ns-breadcrumb"><li><a href="#/">Partners</a></li><li aria-current="page">Acme</li></ol>', "End with the current page, not a link.", '<ol class="ns-breadcrumb"><li><a href="#/">Home</a></li></ol>', "Show a breadcrumb with one item."],
      tokens: [["--ns-text-link", "Links"], ["--ns-text-disabled", "Separator"]],
      props: [["items", "{label, href}[]", "[]", "Trail"], ["noTrailingSlash", "boolean", "true", "Separator after last"]],
      keyboard: [["Tab", "Moves between links"]], aria: ["Wrap in <code>&lt;nav aria-label=\"Breadcrumb\"&gt;</code>; mark the last item <code>aria-current=\"page\"</code>."],
      react: "<Breadcrumb>\n  <BreadcrumbItem href=\"/partners\">Partners</BreadcrumbItem>\n  <BreadcrumbItem isCurrentPage>Acme Corp</BreadcrumbItem>\n</Breadcrumb>",
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
      playground: { controls: [], render: () => `<nav class="ns-sidenav" aria-label="App"><div class="brand" style="padding:6px 12px 10px"><span class="brand__dot"></span>NORTHSTAR</div><div class="ns-sidenav__group">Operate</div><a href="#/" aria-current="page">Dashboard</a><a href="#/">Partners <span class="ns-count">3</span></a><a href="#/">Approvals</a><div class="ns-sidenav__group">Configure</div><a href="#/">Integrations</a><a href="#/">Access</a><a href="#/">Settings</a></nav>` },
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
      playground: { controls: [{ key: "size", label: "Size", options: ["Medium", "Small", "Large"] }], render: (s) => `<div style="display:grid;gap:20px;justify-items:center;width:100%"><div class="ns-modal ns-modal--inline${s.size === "Small" ? " ns-modal--sm" : s.size === "Large" ? " ns-modal--lg" : ""}" role="dialog" aria-labelledby="mdl-t"><div class="ns-modal__head"><div><p class="ns-modal__label">Partner access</p><h2 class="ns-modal__title" id="mdl-t">Revoke API credentials?</h2></div><button class="icon-btn" aria-label="Close">×</button></div><div class="ns-modal__body">Revoking credentials for Acme Corp stops 14 active integrations immediately.</div><div class="ns-modal__foot"><button class="ns-btn ns-btn--tertiary">Cancel</button><button class="ns-btn ns-btn--danger">Revoke</button></div></div><button class="ns-btn ns-btn--tertiary" data-open-modal>Open live modal</button></div>` },
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
      playground: { block: true, controls: [], render: () => `<div class="ns-accordion" style="max-width:640px;margin:0 auto"><details open><summary>What counts as an active partner?</summary><div class="ns-accordion__body">Any partner with at least one integration that synced in the last 30 days.</div></details><details><summary>How are tiers calculated?</summary><div class="ns-accordion__body">Tier is based on trailing twelve-month MRR, recalculated nightly.</div></details><details><summary>Can I export audit logs?</summary><div class="ns-accordion__body">Yes. Admins can export CSV or stream to a SIEM.</div></details></div>` },
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
      if (c.variants.length) { body += NS.h2("Variants"); c.variants.forEach(([n, d, h]) => (body += `${NS.h3(n)}<p>${d}</p>${NS.stage(h, { label: n })}`)); }
      body += NS.h2("Best practices") + NS.dd(...c.dd);
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
