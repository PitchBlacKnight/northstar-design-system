/* Component catalog. Each entry feeds the Usage / Style / Code / Accessibility template. */
(function () {
  const PF = window.PF;
  const x = PF.esc;

  const rows = [
    ["Acme Corp", "Gold", 12400, "active"], ["Beta LLC", "Silver", 5200, "pending"], ["Zeta Inc", "Platinum", 38900, "active"],
    ["Northwind", "Silver", 7300, "error"], ["Globex", "Gold", 19850, "active"],
  ];
  const statusBadge = (s) => `<span class="pf-badge pf-badge--${{ active: "success", pending: "warning", error: "error" }[s]}">${s}</span>`;
  const tableHtml = (o = {}) => `<div class="pf-table-wrap" style="width:100%">${o.batch ? `<div class="pf-table-bar"><b data-batch-label data-default="Partners">Partners</b><div style="display:flex;gap:8px"><button class="pf-btn pf-btn--sm pf-btn--tertiary">Export</button><button class="pf-btn pf-btn--sm">Add partner</button></div></div>` : ""}
<table class="pf-table ${o.size === "Compact" ? "pf-table--compact" : ""} ${o.zebra ? "pf-table--zebra" : ""}">
  <thead><tr>${o.batch ? '<th><label class="pf-check"><input type="checkbox" data-select-all aria-label="Select all rows"/></label></th>' : ""}<th data-sort>Partner <span class="pf-sort">↕</span></th><th data-sort>Tier <span class="pf-sort">↕</span></th><th data-sort class="num">MRR <span class="pf-sort">↕</span></th><th>Status</th></tr></thead>
  <tbody>${rows.map((r) => `<tr>${o.batch ? `<td><label class="pf-check"><input type="checkbox" data-row-select aria-label="Select ${r[0]}"/></label></td>` : ""}<td>${r[0]}</td><td>${r[1]}</td><td class="num">$${r[2].toLocaleString()}</td><td>${statusBadge(r[3])}</td></tr>`).join("")}</tbody>
</table></div>`;

  const cal = () => {
    let d = "";
    ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].forEach((w) => (d += `<span class="pf-cal__dow">${w}</span>`));
    for (let i = 29; i <= 31; i++) d += `<button class="pf-cal__day is-muted" tabindex="-1">${i}</button>`;
    for (let i = 1; i <= 30; i++) d += `<button class="pf-cal__day ${i === 24 ? "is-today" : ""} ${i === 10 || i === 16 ? "is-selected" : ""} ${i > 10 && i < 16 ? "is-range" : ""}">${i}</button>`;
    for (let i = 1; i <= 2; i++) d += `<button class="pf-cal__day is-muted" tabindex="-1">${i}</button>`;
    return `<div class="pf-cal" role="group" aria-label="September 2026"><div class="pf-cal__head"><button class="icon-btn" aria-label="Previous month">‹</button>September 2026<button class="icon-btn" aria-label="Next month">›</button></div><div class="pf-cal__grid">${d}</div></div>`;
  };

  PF.COMPONENTS = [
    {
      id: "button", name: "Button", cat: "Actions", status: "Stable",
      desc: "Buttons trigger an action or event, such as submitting a form, opening a dialog, or confirming a decision.",
      playground: {
        controls: [
          { key: "kind", label: "Kind", options: ["Primary", "Secondary", "Tertiary", "Ghost", "Danger"] },
          { key: "size", label: "Size", options: ["Medium", "Small", "Large"] },
          { key: "label", label: "Label", type: "text", default: "Deploy pipeline" },
          { key: "loading", label: "Loading", type: "bool" },
          { key: "disabled", label: "Disabled", type: "bool" },
        ],
        render: (s) => {
          const k = s.kind === "Primary" ? "" : ` pf-btn--${s.kind.toLowerCase()}`;
          const z = { Small: " pf-btn--sm", Large: " pf-btn--lg", Medium: "" }[s.size];
          return `<button class="pf-btn${k}${z}"${s.disabled ? " disabled" : ""}${s.loading ? ' aria-busy="true"' : ""}>${s.loading ? '<span class="pf-spin" aria-hidden="true"></span>' : ""}${x(s.label)}</button>`;
        },
      },
      when: ["Use a primary button for the single most important action on a view.", "Use secondary for a second emphasized action, tertiary for supporting actions.", "Use ghost for low-emphasis actions inside dense tables and toolbars.", "Use danger only for destructive actions, and confirm them."],
      whenNot: ["Do not use a button for navigation to another page. Use a link.", "Do not place more than one primary button in the same region."],
      variants: [
        ["Primary", "Highest emphasis. One per view or region.", '<button class="pf-btn">Primary</button>'],
        ["Secondary", "Brand purple for a paired, still-important action.", '<button class="pf-btn pf-btn--secondary">Secondary</button>'],
        ["Tertiary", "Outlined, pairs with primary for Cancel or Back.", '<button class="pf-btn pf-btn--tertiary">Tertiary</button>'],
        ["Ghost", "Lowest emphasis, for toolbars and tables.", '<button class="pf-btn pf-btn--ghost">Ghost</button>'],
        ["Danger", "Destructive actions. Always pair with confirmation.", '<button class="pf-btn pf-btn--danger">Delete</button>'],
      ],
      dd: ['<button class="pf-btn pf-btn--tertiary">Cancel</button><button class="pf-btn">Save changes</button>', "Pair one primary action with a tertiary action, primary on the right.",
        '<button class="pf-btn">Cancel</button><button class="pf-btn">Save</button><button class="pf-btn">Export</button>', "Stack several primary buttons. Users cannot tell which action matters."],
      tokens: [["--pf-interactive-primary", "Primary background"], ["--pf-interactive-primary-hover", "Primary hover"], ["--pf-interactive-secondary", "Secondary background"], ["--pf-border-strong", "Tertiary border"], ["--pf-status-error", "Danger background"], ["--pf-focus-ring", "Focus outline"], ["--pf-radius-md", "Corner radius"]],
      sizes: [["Small", "32px", "Dense tables, toolbars"], ["Medium", "40px", "Default, forms and dialogs"], ["Large", "48px", "Hero and marketing CTAs"]],
      props: [["kind", "'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger'", "'primary'", "Visual emphasis"], ["size", "'sm' | 'md' | 'lg'", "'md'", "Height and padding"], ["disabled", "boolean", "false", "Prevents interaction"], ["loading", "boolean", "false", "Shows spinner, sets aria-busy"], ["icon", "ReactNode", "-", "Leading icon"]],
      keyboard: [["Tab", "Moves focus to the button"], ["Enter / Space", "Activates the button"]],
      aria: ["Use a native <code>&lt;button&gt;</code>. Icon-only buttons need <code>aria-label</code>.", "Loading buttons set <code>aria-busy=\"true\"</code> and keep their label.", "Disabled buttons use the <code>disabled</code> attribute so they leave the tab order."],
      react: "import { Button } from '@pathfinder/react';\n\n<Button kind=\"primary\" size=\"md\" onClick={deploy}>\n  Deploy pipeline\n</Button>",
    },
    {
      id: "text-input", name: "Text input", cat: "Inputs", status: "Stable",
      desc: "Text inputs let people enter and edit short text. Validation states communicate errors, warnings, and success.",
      playground: {
        controls: [{ key: "state", label: "State", options: ["Default", "Error", "Warning", "Success", "Disabled"] }, { key: "size", label: "Size", options: ["Medium", "Small", "Large"] }, { key: "label", label: "Label", type: "text", default: "Cluster name" }],
        render: (s) => {
          const helper = { Default: "Lowercase, 3 to 24 characters.", Error: "Name already exists in this region.", Warning: "Names over 20 characters get truncated in tables.", Success: "Name is available.", Disabled: "Locked by policy." }[s.state];
          const z = { Small: " pf-input--sm", Large: " pf-input--lg", Medium: "" }[s.size];
          return `<div class="pf-field${s.state !== "Default" && s.state !== "Disabled" ? " is-" + s.state.toLowerCase() : ""}" style="width:320px"><label class="pf-label" for="ti-1">${x(s.label)}</label><input class="pf-input${z}" id="ti-1" placeholder="e.g. prod-east-01"${s.state === "Disabled" ? " disabled" : ""}${s.state === "Error" ? ' aria-invalid="true"' : ""} aria-describedby="ti-1-h"/><span class="pf-helper" id="ti-1-h">${helper}</span></div>`;
        },
      },
      when: ["Collect short free-form text such as names, IDs, and hostnames.", "Use helper text to set format expectations before an error happens."],
      whenNot: ["Do not use for long text. Use a textarea.", "Do not use for a fixed set of values. Use a select or radio group."],
      variants: [["Default", "Label, input, helper.", '<div class="pf-field" style="width:260px"><label class="pf-label">Hostname</label><input class="pf-input" placeholder="api.pathfinder.dev"/></div>'], ["Password", "Masked input.", '<div class="pf-field" style="width:260px"><label class="pf-label">Secret key</label><input class="pf-input" type="password" value="hunter22"/></div>'], ["Textarea", "Multi-line text.", '<div class="pf-field" style="width:260px"><label class="pf-label">Notes</label><textarea class="pf-textarea">Rotating keys on Friday.</textarea></div>']],
      dd: ['<div class="pf-field" style="width:220px"><label class="pf-label">Email</label><input class="pf-input" placeholder="name@company.com"/></div>', "Keep a visible label above the field at all times.", '<input class="pf-input" style="width:220px" placeholder="Email"/>', "Rely on placeholder text as the only label. It disappears on input."],
      tokens: [["--pf-background-surface", "Field background"], ["--pf-border-default", "Rest border"], ["--pf-focus-ring", "Focus border and ring"], ["--pf-status-error", "Error border and helper"], ["--pf-text-disabled", "Placeholder"], ["--pf-radius-sm", "Corner radius"]],
      sizes: [["Small", "32px", "Filters, table cells"], ["Medium", "40px", "Default forms"], ["Large", "48px", "Sign-in, primary search"]],
      props: [["label", "string", "-", "Visible label (required)"], ["helperText", "string", "-", "Guidance under the field"], ["invalid", "boolean", "false", "Error state"], ["invalidText", "string", "-", "Error message"], ["size", "'sm' | 'md' | 'lg'", "'md'", "Height"]],
      keyboard: [["Tab", "Moves focus into the field"], ["Esc", "Clears the field when a clear button is present"]],
      aria: ["Link helper and error text with <code>aria-describedby</code>.", "Set <code>aria-invalid=\"true\"</code> on error.", "Never remove the visible label. Placeholders are not labels."],
      react: "import { TextInput } from '@pathfinder/react';\n\n<TextInput\n  id=\"cluster\"\n  label=\"Cluster name\"\n  helperText=\"Lowercase, 3 to 24 characters.\"\n  invalid={exists}\n  invalidText=\"Name already exists in this region.\"\n/>",
    },
    {
      id: "select", name: "Select", cat: "Inputs", status: "Stable",
      desc: "Select lets people choose one option from a list of 4 to 15 predefined values.",
      playground: {
        controls: [{ key: "state", label: "State", options: ["Default", "Error", "Disabled"] }],
        render: (s) => `<div class="pf-field${s.state === "Error" ? " is-error" : ""}" style="width:300px"><label class="pf-label" for="sel-1">Region</label><select class="pf-select" id="sel-1"${s.state === "Disabled" ? " disabled" : ""}><option>us-east-1</option><option>us-west-2</option><option>eu-central-1</option><option>ap-south-1</option></select><span class="pf-helper">${s.state === "Error" ? "Region is at capacity." : "Where new workloads are scheduled."}</span></div>`,
      },
      when: ["Choose one option from a medium-length list.", "Space is tight and options do not need comparison."],
      whenNot: ["Two or three options: use radio buttons.", "Over 15 options: use a searchable combo box."],
      variants: [["Default", "Native select with custom chevron.", '<div class="pf-field" style="width:220px"><label class="pf-label">Tier</label><select class="pf-select"><option>Gold</option><option>Silver</option></select></div>'], ["Inline", "Label beside field for toolbars.", '<label class="pf-label" style="display:flex;gap:8px;align-items:center">Show <select class="pf-select pf-input--sm" style="width:90px;min-height:32px"><option>25</option><option>50</option></select></label>']],
      dd: ['<div class="pf-field" style="width:200px"><label class="pf-label">Priority</label><select class="pf-select"><option>High</option><option>Medium</option><option>Low</option></select></div>', "Order options logically: severity, alphabetical, or frequency.", '<div class="pf-field" style="width:200px"><label class="pf-label">Enabled</label><select class="pf-select"><option>Yes</option><option>No</option></select></div>', "Use select for a binary choice. Use a toggle."],
      tokens: [["--pf-background-surface", "Field background"], ["--pf-border-default", "Border"], ["--pf-focus-ring", "Focus"]],
      sizes: [["Small", "32px", "Toolbars"], ["Medium", "40px", "Default"]],
      props: [["label", "string", "-", "Visible label"], ["options", "Option[]", "[]", "Values"], ["value", "string", "-", "Controlled value"], ["onChange", "(v) => void", "-", "Change handler"]],
      keyboard: [["Space / Enter", "Opens the list"], ["Arrow up / down", "Moves through options"], ["Type-ahead", "Jumps to matching option"]],
      aria: ["Native <code>&lt;select&gt;</code> gives full screen reader support for free.", "Associate the label with <code>for</code> / <code>id</code>."],
      react: "<Select id=\"region\" label=\"Region\" value={region} onChange={setRegion}>\n  <SelectItem value=\"us-east-1\" />\n  <SelectItem value=\"eu-central-1\" />\n</Select>",
    },
    {
      id: "checkbox", name: "Checkbox", cat: "Inputs", status: "Stable",
      desc: "Checkboxes select one or more options from a list, or toggle a single setting that applies on submit.",
      playground: {
        controls: [{ key: "state", label: "State", options: ["Group", "Indeterminate", "Disabled"] }],
        render: (s) => s.state === "Indeterminate"
          ? `<fieldset style="border:0;padding:0;margin:0;display:grid;gap:10px"><label class="pf-check"><input type="checkbox" data-indet/> All regions</label><div style="display:grid;gap:10px;padding-left:28px"><label class="pf-check"><input type="checkbox" checked/> us-east-1</label><label class="pf-check"><input type="checkbox"/> eu-central-1</label></div></fieldset>`
          : `<fieldset style="border:0;padding:0;margin:0;display:grid;gap:10px"><legend class="pf-label" style="margin-bottom:10px">Alert channels</legend><label class="pf-check"><input type="checkbox" checked${s.state === "Disabled" ? " disabled" : ""}/> Email</label><label class="pf-check"><input type="checkbox"${s.state === "Disabled" ? " disabled" : ""}/> Slack</label><label class="pf-check"><input type="checkbox" checked${s.state === "Disabled" ? " disabled" : ""}/> PagerDuty</label></fieldset>`,
        init: (root) => root.querySelectorAll("[data-indet]").forEach((c) => (c.indeterminate = true)),
      },
      when: ["Select several options from a list.", "Confirm a single agreement or setting that applies on submit."],
      whenNot: ["Choose exactly one option: use radio buttons.", "Settings that apply instantly: use a toggle."],
      variants: [["Checked / unchecked", "Standard.", '<label class="pf-check"><input type="checkbox" checked/> Checked</label><label class="pf-check"><input type="checkbox"/> Unchecked</label>'], ["Indeterminate", "Parent of a partially selected group.", '<label class="pf-check"><input type="checkbox" data-indet/> Partial</label>']],
      dd: ['<div style="display:grid;gap:8px"><label class="pf-check"><input type="checkbox" checked/> Email</label><label class="pf-check"><input type="checkbox"/> SMS</label></div>', "Stack options vertically for easy scanning.", '<label class="pf-check"><input type="checkbox"/> Do not not disable alerts</label>', "Write negative or double-negative labels."],
      tokens: [["--pf-interactive-primary", "Checked fill"], ["--pf-border-strong", "Unchecked border"], ["--pf-focus-ring", "Focus"], ["--pf-radius-xs", "Box radius"]],
      props: [["checked", "boolean", "false", "Selected"], ["indeterminate", "boolean", "false", "Partial state"], ["labelText", "string", "-", "Label"], ["disabled", "boolean", "false", "Disable"]],
      keyboard: [["Tab", "Moves between checkboxes"], ["Space", "Toggles the focused checkbox"]],
      aria: ["Wrap groups in <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code>.", "Indeterminate is set via the DOM property, exposed as <code>aria-checked=\"mixed\"</code>."],
      react: "<Checkbox id=\"email\" labelText=\"Email\" checked={email} onChange={setEmail} />",
    },
    {
      id: "radio-button", name: "Radio button", cat: "Inputs", status: "Stable",
      desc: "Radio buttons choose exactly one option from a small, mutually exclusive set.",
      playground: {
        controls: [{ key: "dir", label: "Orientation", options: ["Vertical", "Horizontal"] }],
        render: (s) => `<fieldset style="border:0;padding:0;margin:0"><legend class="pf-label" style="margin-bottom:10px">Deployment strategy</legend><div style="display:flex;gap:${s.dir === "Horizontal" ? "24px" : "10px"};flex-direction:${s.dir === "Horizontal" ? "row" : "column"}"><label class="pf-check"><input type="radio" name="rb" checked/> Rolling</label><label class="pf-check"><input type="radio" name="rb"/> Blue / green</label><label class="pf-check"><input type="radio" name="rb"/> Canary</label></div></fieldset>`,
      },
      when: ["Two to five mutually exclusive options that benefit from being visible together."],
      whenNot: ["More than five options: use a select.", "Multiple choices: use checkboxes."],
      variants: [["Vertical", "Default stacking.", '<div style="display:grid;gap:8px"><label class="pf-check"><input type="radio" name="v1" checked/> One</label><label class="pf-check"><input type="radio" name="v1"/> Two</label></div>']],
      dd: ['<div style="display:grid;gap:8px"><label class="pf-check"><input type="radio" name="d1" checked/> Standard (recommended)</label><label class="pf-check"><input type="radio" name="d1"/> Custom</label></div>', "Preselect the safest or most common option.", '<div style="display:grid;gap:8px"><label class="pf-check"><input type="radio" name="d2"/> Yes</label></div>', "Use a single radio button. It cannot be unselected."],
      tokens: [["--pf-interactive-primary", "Selected fill"], ["--pf-border-strong", "Ring"], ["--pf-radius-full", "Shape"]],
      props: [["name", "string", "-", "Group name"], ["value", "string", "-", "Option value"], ["checked", "boolean", "false", "Selected"]],
      keyboard: [["Tab", "Moves into and out of the group"], ["Arrow keys", "Move selection within the group"]],
      aria: ["Group with <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code>.", "All radios in a group share one <code>name</code>."],
      react: "<RadioButtonGroup legendText=\"Deployment strategy\" name=\"strategy\" defaultSelected=\"rolling\">\n  <RadioButton labelText=\"Rolling\" value=\"rolling\" />\n  <RadioButton labelText=\"Canary\" value=\"canary\" />\n</RadioButtonGroup>",
    },
    {
      id: "toggle", name: "Toggle", cat: "Inputs", status: "Stable",
      desc: "Toggles switch a single setting on or off. The change applies immediately.",
      playground: {
        controls: [{ key: "size", label: "Size", options: ["Default", "Small"] }, { key: "on", label: "On", type: "bool", default: true }, { key: "disabled", label: "Disabled", type: "bool" }],
        render: (s) => `<label class="pf-toggle${s.size === "Small" ? " pf-toggle--sm" : ""}"><input type="checkbox" role="switch"${s.on ? " checked" : ""}${s.disabled ? " disabled" : ""}/> Real-time telemetry</label>`,
      },
      when: ["Binary settings that take effect immediately, like enabling a feature."],
      whenNot: ["Settings that need a Save action: use a checkbox."],
      variants: [["Default", "40 x 22.", '<label class="pf-toggle"><input type="checkbox" role="switch" checked/> Dark theme</label>'], ["Small", "32 x 18 for dense rows.", '<label class="pf-toggle pf-toggle--sm"><input type="checkbox" role="switch"/> Notifications</label>']],
      dd: ['<label class="pf-toggle"><input type="checkbox" role="switch" checked/> Auto-scaling</label>', "Label the setting, not the state.", '<label class="pf-toggle"><input type="checkbox" role="switch"/> Off</label>', "Use On / Off as the label. The control already shows state."],
      tokens: [["--pf-interactive-primary", "On track"], ["--pf-gray-6", "Off track"], ["--pf-duration-base", "Knob travel"], ["--pf-easing-standard", "Knob easing"]],
      props: [["checked", "boolean", "false", "On state"], ["size", "'sm' | 'md'", "'md'", "Size"], ["labelText", "string", "-", "Setting name"]],
      keyboard: [["Tab", "Focus"], ["Space", "Toggle"]],
      aria: ["Use <code>role=\"switch\"</code> on a checkbox input so screen readers say on/off."],
      react: "<Toggle id=\"telemetry\" labelText=\"Real-time telemetry\" toggled={on} onToggle={setOn} />",
    },
    {
      id: "slider", name: "Slider", cat: "Inputs", status: "Stable",
      desc: "Sliders pick a value or range from a continuous or stepped scale.",
      playground: {
        controls: [{ key: "step", label: "Step", options: ["1", "10", "25"] }],
        render: (s) => `<div class="pf-field" style="width:360px"><label class="pf-label" for="sl-1">Alert threshold: <output>60</output>%</label><input class="pf-slider" id="sl-1" type="range" min="0" max="100" step="${s.step}" value="60" style="--_pct:60%"/><div class="pf-slider-ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div></div>`,
      },
      when: ["Adjust values where the relative position matters more than exact input: thresholds, opacity, zoom."],
      whenNot: ["Exact values are required: pair with or use a number input."],
      variants: [["With ticks", "Labeled scale.", '<div style="width:260px"><input class="pf-slider" type="range" value="30" style="--_pct:30%"/><div class="pf-slider-ticks"><span>0</span><span>100</span></div></div>']],
      dd: ['<div style="width:220px"><input class="pf-slider" type="range" value="40" style="--_pct:40%" aria-label="Opacity"/><div class="pf-slider-ticks"><span>0%</span><span>100%</span></div></div>', "Show the min, max, and current value.", '<input class="pf-slider" type="range" style="width:220px" aria-label="Value"/>', "Hide the scale when precision matters."],
      tokens: [["--pf-interactive-primary", "Filled track and thumb ring"], ["--pf-border-default", "Empty track"]],
      props: [["min", "number", "0", "Minimum"], ["max", "number", "100", "Maximum"], ["step", "number", "1", "Increment"], ["value", "number", "-", "Current value"]],
      keyboard: [["Arrow keys", "Move by one step"], ["Page up / down", "Move by 10 steps"], ["Home / End", "Jump to min / max"]],
      aria: ["Native range input exposes <code>aria-valuenow</code>, min, and max.", "Add <code>aria-valuetext</code> when units matter, e.g. \"60 percent\"."],
      react: "<Slider labelText=\"Alert threshold\" min={0} max={100} step={1} value={60} />",
    },
    {
      id: "date-picker", name: "Date picker", cat: "Inputs", status: "New",
      desc: "Date pickers select a single date or a range from a calendar overlay, with typed input as an alternative.",
      playground: { controls: [{ key: "mode", label: "Mode", options: ["Range", "Single"] }], render: (s) => `<div style="display:grid;gap:12px"><div class="pf-field" style="width:280px"><label class="pf-label">${s.mode === "Range" ? "Reporting window" : "Start date"}</label><input class="pf-input" value="${s.mode === "Range" ? "09/10/2026 - 09/16/2026" : "09/10/2026"}"/></div>${cal()}</div>` },
      when: ["Choosing dates near today, or ranges where seeing the week helps."],
      whenNot: ["Dates far in the past like birthdays: use a typed input."],
      variants: [["Calendar", "Month grid with range fill.", cal()]],
      dd: ['<div class="pf-field" style="width:200px"><label class="pf-label">Date (MM/DD/YYYY)</label><input class="pf-input" value="09/24/2026"/></div>', "Show the expected format in the label.", '<div class="pf-field" style="width:200px"><label class="pf-label">Date</label><input class="pf-input" value="24.9.26"/></div>', "Leave the format ambiguous."],
      tokens: [["--pf-background-elevated", "Calendar surface"], ["--pf-interactive-primary", "Selected day"], ["--pf-background-selected", "Range fill"], ["--pf-teal-500", "Today ring"]],
      props: [["mode", "'single' | 'range'", "'single'", "Selection mode"], ["minDate / maxDate", "Date", "-", "Bounds"], ["onChange", "(dates) => void", "-", "Handler"]],
      keyboard: [["Arrow keys", "Move between days"], ["Page up / down", "Previous / next month"], ["Enter", "Select day"], ["Esc", "Close calendar"]],
      aria: ["Calendar grid uses <code>role=\"grid\"</code>; days are buttons with full date labels.", "The typed input is always available, so the calendar is never the only path."],
      react: "<DatePicker datePickerType=\"range\" onChange={setRange}>\n  <DatePickerInput id=\"start\" labelText=\"Start\" />\n  <DatePickerInput id=\"end\" labelText=\"End\" />\n</DatePicker>",
    },
    {
      id: "file-uploader", name: "File uploader", cat: "Inputs", status: "New",
      desc: "File uploaders accept files by drag-and-drop or browse, and show progress and validation per file.",
      playground: { controls: [], block: true, render: () => `<div style="display:grid;gap:12px;max-width:460px;margin:0 auto"><label class="pf-drop" id="drop-demo"><span style="font-size:22px">↑</span><span>Drag files here or <b>browse</b></span><span class="pf-helper">CSV, JSON up to 25 MB</span><input type="file" class="sr-only" multiple/></label><div class="pf-file"><span class="pf-file__ext">CSV</span><div><b>partners-q3.csv</b><div class="pf-progress" style="margin-top:6px"><div class="pf-progress__track"><div class="pf-progress__bar" style="--_v:72%"></div></div></div></div><span class="pf-helper">72%</span></div><div class="pf-file"><span class="pf-file__ext" style="color:var(--pf-status-error)">PDF</span><div><b>contract.pdf</b><div class="pf-helper" style="color:var(--pf-status-error)">File type not supported</div></div><button class="pf-notice__close" aria-label="Remove">×</button></div></div>`,
        init: (root) => { const d = root.querySelector(".pf-drop"); if (!d) return; ["dragenter", "dragover"].forEach((e) => d.addEventListener(e, (ev) => { ev.preventDefault(); d.classList.add("is-over"); })); ["dragleave", "drop"].forEach((e) => d.addEventListener(e, (ev) => { ev.preventDefault(); d.classList.remove("is-over"); if (e === "drop") PF.toast("Files received", ev.dataTransfer.files.length + " file(s) dropped", "success"); })); } },
      when: ["Importing data files, attachments, and assets."],
      whenNot: ["Pasting short text: use a textarea."],
      variants: [],
      dd: ['<span class="pf-helper">CSV, JSON up to 25 MB</span>', "State accepted types and size limits before upload.", '<span class="pf-helper">Upload failed</span>', "Show generic errors without telling people how to fix them."],
      tokens: [["--pf-border-strong", "Drop zone border"], ["--pf-teal-500", "Drag-over highlight"], ["--pf-status-error", "Invalid file"]],
      props: [["accept", "string[]", "-", "MIME types"], ["maxSize", "number", "-", "Bytes"], ["multiple", "boolean", "false", "Multi-file"], ["onUpload", "(files) => void", "-", "Handler"]],
      keyboard: [["Tab", "Focus the drop zone"], ["Enter / Space", "Open the file browser"]],
      aria: ["The drop zone wraps a real file input, so keyboard and screen reader users never need drag-and-drop.", "Announce upload completion through a live region."],
      react: "<FileUploaderDropContainer accept={['.csv','.json']} multiple onAddFiles={upload} />",
    },
    {
      id: "search", name: "Search", cat: "Inputs", status: "Stable",
      desc: "Search lets people find content by keyword, inline in a page or globally from the header.",
      playground: { controls: [{ key: "size", label: "Size", options: ["Medium", "Large", "Small"] }], render: (s) => `<div class="pf-search" role="search" style="width:360px">${PF.icon.search}<input class="pf-input${s.size === "Large" ? " pf-input--lg" : s.size === "Small" ? " pf-input--sm" : ""}" type="search" placeholder="Search partners, nodes, tickets" aria-label="Search"/><kbd>/</kbd></div>` },
      when: ["Large collections where browsing is slow.", "Filtering a table or list in place."],
      whenNot: ["Fewer than ~10 items: show them all."],
      variants: [["Global", "Opens a command palette. Try ⌘K on this site.", '<button class="hdr__search" style="min-width:260px" data-open-search>' + PF.icon.search + '<span class="label">Search docs</span><kbd>⌘K</kbd></button>']],
      dd: ['<div class="pf-search" style="width:220px">' + PF.icon.search + '<input class="pf-input" placeholder="Search nodes" aria-label="Search nodes"/></div>', "Say what is searchable in the placeholder.", '<div class="pf-search" style="width:220px">' + PF.icon.search + '<input class="pf-input" placeholder="Search" aria-label="Search"/></div>', "Use a generic placeholder when scope is narrow."],
      tokens: [["--pf-radius-full", "Pill shape"], ["--pf-text-tertiary", "Icon"], ["--pf-focus-ring", "Focus"]],
      props: [["placeholder", "string", "-", "Hint"], ["size", "'sm' | 'md' | 'lg'", "'md'", "Height"], ["onSearch", "(q) => void", "-", "Handler"]],
      keyboard: [["/ or ⌘K", "Open global search"], ["Esc", "Clear or close"], ["Arrow keys + Enter", "Pick a result"]],
      aria: ["Wrap in <code>role=\"search\"</code> and give the input an <code>aria-label</code>.", "Announce result counts in a polite live region."],
      react: "<Search size=\"md\" labelText=\"Search\" placeholder=\"Search partners\" onChange={filter} />",
    },
    {
      id: "tag", name: "Tag", cat: "Status", status: "Stable",
      desc: "Tags label, categorize, and filter objects. Dismissible tags represent active filters.",
      playground: {
        controls: [{ key: "color", label: "Color", options: ["Teal", "Purple", "Blue", "Green", "Yellow", "Red", "Gray"] }, { key: "size", label: "Size", options: ["Medium", "Small"] }, { key: "dismissible", label: "Dismissible", type: "bool" }, { key: "label", label: "Label", type: "text", default: "Production" }],
        render: (s) => `<span class="pf-tag${s.color === "Gray" ? "" : " pf-tag--" + s.color.toLowerCase()}${s.size === "Small" ? " pf-tag--sm" : ""}">${x(s.label)}${s.dismissible ? `<button aria-label="Remove ${x(s.label)}">×</button>` : ""}</span>`,
      },
      when: ["Label metadata like environment, team, or tier.", "Show active filters that can be removed."],
      whenNot: ["System status like Active or Failed: use a badge."],
      variants: [["Colors", "Semantic and categorical.", '<span class="pf-tag pf-tag--teal">Teal</span><span class="pf-tag pf-tag--purple">Purple</span><span class="pf-tag pf-tag--blue">Blue</span><span class="pf-tag pf-tag--green">Green</span><span class="pf-tag pf-tag--yellow">Yellow</span><span class="pf-tag pf-tag--red">Red</span><span class="pf-tag">Gray</span>'], ["Filter", "Dismissible.", '<span class="pf-tag pf-tag--blue">Region: EU<button aria-label="Remove">×</button></span><span class="pf-tag pf-tag--blue">Tier: Gold<button aria-label="Remove">×</button></span>']],
      dd: ['<span class="pf-tag pf-tag--purple">ML team</span><span class="pf-tag pf-tag--teal">Edge</span>', "Keep labels to one or two words.", '<span class="pf-tag pf-tag--red">This node is part of the legacy fleet and needs review</span>', "Put sentences in tags."],
      tokens: [["--pf-radius-full", "Shape"], ["--pf-teal-500 ... --pf-red-400", "Color sets (14% fill, 35% border)"]],
      props: [["type", "'teal' | 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray'", "'gray'", "Color"], ["filter", "boolean", "false", "Dismissible"], ["onClose", "() => void", "-", "Dismiss handler"]],
      keyboard: [["Tab", "Focus the dismiss button"], ["Enter / Space", "Remove the filter"]],
      aria: ["Dismiss buttons need a label that names the tag, e.g. <code>aria-label=\"Remove Region: EU\"</code>.", "Color is never the only signal; the label carries meaning."],
      react: "<Tag type=\"teal\" filter onClose={remove}>Production</Tag>",
    },
    {
      id: "badge", name: "Badge", cat: "Status", status: "Stable",
      desc: "Badges show system status with a colored dot and short uppercase label. Count badges show unread totals.",
      playground: { controls: [{ key: "kind", label: "Status", options: ["Info", "Success", "Warning", "Error", "Neutral"] }], render: (s) => `<span class="pf-badge pf-badge--${s.kind.toLowerCase()}">${{ Info: "Syncing", Success: "Active", Warning: "Degraded", Error: "Offline", Neutral: "Archived" }[s.kind]}</span>` },
      when: ["Object status in tables, cards, and headers.", "Unread counts on navigation items."],
      whenNot: ["Categories: use a tag."],
      variants: [["Status", "Dot + label.", '<span class="pf-badge pf-badge--success">Active</span><span class="pf-badge pf-badge--warning">Pending</span><span class="pf-badge pf-badge--error">Critical</span><span class="pf-badge">Info</span><span class="pf-badge pf-badge--neutral">Neutral</span>'], ["Count", "Numeric.", '<span style="display:inline-flex;gap:8px;align-items:center">Alerts <span class="pf-count">12</span></span>']],
      dd: ['<span class="pf-badge pf-badge--error">Offline</span>', "Pair color with a clear word.", '<span class="pf-badge pf-badge--error"></span>', "Use a dot alone to carry status."],
      tokens: [["--pf-status-success / warning / error / info", "Dot + label color"]],
      props: [["status", "'info' | 'success' | 'warning' | 'error' | 'neutral'", "'info'", "State"], ["label", "string", "-", "Text"]],
      keyboard: [["-", "Not interactive"]],
      aria: ["Badges are text, so screen readers read the label. Do not rely on the dot."],
      react: "<Badge status=\"success\">Active</Badge>",
    },
    {
      id: "card", name: "Card", cat: "Containers", status: "Stable",
      desc: "Cards group related content and actions about a single subject. Clickable cards navigate as a whole.",
      playground: {
        controls: [{ key: "kind", label: "Kind", options: ["Default", "Elevated", "Clickable", "With strip"] }],
        render: (s) => `<div class="pf-card${s.kind === "Elevated" ? " pf-card--elevated" : s.kind === "Clickable" ? " pf-card--clickable" : ""}" style="width:320px">${s.kind === "With strip" ? '<div class="pf-card__strip">Partner</div>' : ""}<h3 class="pf-card__title">Acme Corp</h3><p class="pf-card__body">Gold tier. 14 active integrations across 3 regions. Renewal in 42 days.</p><div style="display:flex;gap:8px"><span class="pf-badge pf-badge--success">Active</span></div>${s.kind === "Clickable" ? "" : '<div><button class="pf-btn pf-btn--sm pf-btn--tertiary">View details</button></div>'}</div>`,
      },
      when: ["Collections of similar objects to scan and compare.", "Dashboard tiles with one job each."],
      whenNot: ["Dense tabular data: use a data table."],
      variants: [["KPI tile", "Metric card for dashboards.", '<div class="pf-kpi" style="width:200px"><span class="pf-kpi__label">Active partners</span><span class="pf-kpi__value">1,284</span><span class="pf-kpi__delta">↑ +6.2%</span></div>']],
      dd: ['<div class="pf-card" style="width:220px"><h3 class="pf-card__title">Acme</h3><p class="pf-card__body">One subject per card.</p></div>', "Keep one subject and one primary action per card.", '<div class="pf-card" style="width:220px"><button class="pf-btn pf-btn--sm">Edit</button><button class="pf-btn pf-btn--sm">Share</button><button class="pf-btn pf-btn--sm">Delete</button></div>', "Pack many primary actions into one card."],
      tokens: [["--pf-background-surface", "Default fill"], ["--pf-background-elevated", "Elevated fill"], ["--pf-elevation-02", "Elevated shadow"], ["--pf-radius-lg", "Radius"], ["--pf-space-7", "Padding"]],
      props: [["kind", "'default' | 'elevated' | 'clickable'", "'default'", "Style"], ["href", "string", "-", "Makes the card a link"]],
      keyboard: [["Tab", "Focus a clickable card"], ["Enter", "Open"]],
      aria: ["A clickable card is one <code>&lt;a&gt;</code>. Do not nest other interactive elements inside it."],
      react: "<Card kind=\"elevated\">\n  <CardTitle>Acme Corp</CardTitle>\n  <CardBody>Gold tier.</CardBody>\n</Card>",
    },
    {
      id: "data-table", name: "Data table", cat: "Data", status: "Stable",
      desc: "Data tables organize large sets of records into rows and columns with sorting, selection, and batch actions.",
      playground: { block: true, controls: [{ key: "size", label: "Row size", options: ["Default", "Compact"] }, { key: "batch", label: "Selectable", type: "bool", default: true }, { key: "zebra", label: "Zebra", type: "bool" }], render: (s) => tableHtml(s) },
      when: ["Comparing many records across the same attributes.", "Bulk actions across selected rows."],
      whenNot: ["A handful of items with rich content: use cards."],
      variants: [["Simple table", "No toolbar or selection.", tableHtml({ size: "Compact" })]],
      dd: ['<span class="pf-helper">MRR column right-aligned, monospace</span>', "Right-align numbers so magnitudes line up.", '<span class="pf-helper">MRR column centered, proportional</span>', "Center numeric columns."],
      tokens: [["--pf-background-secondary", "Header row"], ["--pf-background-hover", "Row hover"], ["--pf-background-selected", "Selected row"], ["--pf-interactive-primary", "Batch action bar"], ["--pf-font-mono", "Numeric cells"]],
      sizes: [["Compact", "32px", "Monitoring, logs"], ["Default", "48px", "General data"]],
      props: [["rows", "Row[]", "[]", "Data"], ["headers", "Header[]", "[]", "Columns"], ["isSortable", "boolean", "true", "Sorting"], ["radio / selectable", "boolean", "false", "Selection"], ["size", "'compact' | 'default'", "'default'", "Row height"]],
      keyboard: [["Tab", "Moves between interactive cells"], ["Enter / Space on header", "Sorts the column"], ["Space on row checkbox", "Selects the row"]],
      aria: ["Sortable headers set <code>aria-sort</code>.", "Select-all checkbox is labeled and reflects mixed state.", "Batch bar announces the selected count."],
      react: "<DataTable rows={rows} headers={headers} isSortable>\n  {({ rows, headers, getTableProps }) => (\n    <Table {...getTableProps()}>...</Table>\n  )}\n</DataTable>",
    },
    {
      id: "avatar", name: "Avatar", cat: "Data", status: "Stable",
      desc: "Avatars represent a person or team with initials or an image, plus an optional presence dot.",
      playground: { controls: [{ key: "size", label: "Size", options: ["Medium", "Small", "Large", "XL"] }, { key: "status", label: "Presence", options: ["None", "online", "away", "busy"] }, { key: "brand", label: "Brand gradient", type: "bool" }], render: (s) => `<span class="pf-avatar${{ Small: " pf-avatar--sm", Large: " pf-avatar--lg", XL: " pf-avatar--xl", Medium: "" }[s.size]}${s.brand ? " pf-avatar--brand" : ""}"${s.status !== "None" ? ` data-status="${s.status}"` : ""} role="img" aria-label="Alex Park${s.status !== "None" ? ", " + s.status : ""}">AP</span>` },
      when: ["Ownership, assignees, and presence."], whenNot: ["Decoration with no meaning."],
      variants: [["Group", "Stacked with overflow count.", '<div class="pf-avatar-group"><span class="pf-avatar">AK</span><span class="pf-avatar pf-avatar--brand">BM</span><span class="pf-avatar">CJ</span><span class="pf-avatar pf-avatar--brand">DL</span><span class="pf-avatar pf-avatar--more">+12</span></div>']],
      dd: ['<span class="pf-avatar" role="img" aria-label="Alex Park">AP</span>', "Use two initials and a full name label.", '<span class="pf-avatar">?</span>', "Show a question mark for unknown people. Use a generic icon."],
      tokens: [["--pf-gradient-bruise", "Default fill"], ["--pf-gradient-brand", "Brand fill"], ["--pf-status-success", "Online dot"]],
      props: [["name", "string", "-", "Used for initials and label"], ["src", "string", "-", "Image"], ["size", "'sm' | 'md' | 'lg' | 'xl'", "'md'", "Size"], ["status", "'online' | 'away' | 'busy'", "-", "Presence"]],
      keyboard: [["-", "Not interactive unless wrapped in a button"]],
      aria: ["Use <code>role=\"img\"</code> with an <code>aria-label</code> that includes presence."],
      react: "<Avatar name=\"Alex Park\" status=\"online\" size=\"md\" />",
    },
    {
      id: "progress", name: "Progress", cat: "Status", status: "Stable",
      desc: "Progress indicators show completion of a task: linear bars, rings for single metrics, and step indicators for flows.",
      playground: { controls: [{ key: "kind", label: "Kind", options: ["Bar", "Ring", "Steps", "Indeterminate"] }, { key: "value", label: "Value", options: ["30", "65", "80", "100"] }], render: (s) => s.kind === "Ring" ? `<div class="pf-ring" style="--_v:${s.value}" role="progressbar" aria-valuenow="${s.value}" aria-valuemin="0" aria-valuemax="100"><span>${s.value}%</span></div>` : s.kind === "Steps" ? `<ol class="pf-steps" style="width:520px"><li class="is-done"><b>Details</b>Complete</li><li class="is-done"><b>Access</b>Complete</li><li class="is-current" aria-current="step"><b>Review</b>In progress</li><li><b>Deploy</b>Not started</li></ol>` : `<div class="pf-progress${s.kind === "Indeterminate" ? " pf-progress--indeterminate" : ""}" style="width:360px"><div class="pf-progress__meta"><span>Migrating records</span><span>${s.kind === "Indeterminate" ? "" : s.value + "%"}</span></div><div class="pf-progress__track" role="progressbar" aria-label="Migrating records"${s.kind === "Indeterminate" ? "" : ` aria-valuenow="${s.value}" aria-valuemin="0" aria-valuemax="100"`}><div class="pf-progress__bar" style="--_v:${s.value}%"></div></div></div>` },
      when: ["Operations that take more than about a second.", "Multi-step flows."], whenNot: ["Instant actions."],
      variants: [["Colors", "Semantic bars.", '<div style="display:grid;gap:12px;width:260px"><div class="pf-progress__track"><div class="pf-progress__bar" style="--_v:70%"></div></div><div class="pf-progress pf-progress--purple"><div class="pf-progress__track"><div class="pf-progress__bar" style="--_v:30%"></div></div></div><div class="pf-progress pf-progress--warning"><div class="pf-progress__track"><div class="pf-progress__bar" style="--_v:85%"></div></div></div></div>']],
      dd: ['<span class="pf-helper">Uploading 3 of 12 files</span>', "Say what is progressing.", '<span class="pf-helper">Please wait...</span>', "Leave people guessing."],
      tokens: [["--pf-gradient-brand", "Bar fill"], ["--pf-border-default", "Track"], ["--pf-duration-slow", "Fill transition"]],
      props: [["value", "number", "-", "0 to 100; omit for indeterminate"], ["label", "string", "-", "Accessible label"], ["kind", "'bar' | 'ring' | 'steps'", "'bar'", "Type"]],
      keyboard: [["-", "Not interactive"]],
      aria: ["Use <code>role=\"progressbar\"</code> with value attributes; omit values when indeterminate.", "Step indicators mark the current step with <code>aria-current=\"step\"</code>."],
      react: "<ProgressBar label=\"Migrating records\" value={65} />",
    },
    {
      id: "loading", name: "Loading", cat: "Status", status: "Stable",
      desc: "Spinners and skeletons show that content is loading and keep layout stable while it arrives.",
      playground: { controls: [{ key: "kind", label: "Kind", options: ["Skeleton", "Spinner"] }], render: (s) => s.kind === "Spinner" ? `<span class="pf-spin" role="status" aria-label="Loading"></span>` : `<div style="width:360px;display:grid;gap:10px" aria-busy="true" aria-label="Loading partners"><div class="pf-skel" style="height:20px;width:60%"></div><div class="pf-skel" style="height:12px"></div><div class="pf-skel" style="height:12px;width:85%"></div><div class="pf-skel" style="height:80px;margin-top:6px"></div></div>` },
      when: ["Skeletons for page and card loads; spinners for small, local waits."], whenNot: ["Waits under 300ms: show nothing."],
      variants: [],
      dd: ['<div style="width:200px;display:grid;gap:8px"><div class="pf-skel" style="height:14px"></div><div class="pf-skel" style="height:14px;width:70%"></div></div>', "Match the skeleton to the real layout.", '<span class="pf-spin"></span><span class="pf-spin"></span><span class="pf-spin"></span>', "Show a spinner in every card at once."],
      tokens: [["--pf-background-elevated", "Skeleton base"], ["--pf-teal-500", "Spinner arc"]],
      props: [["kind", "'skeleton' | 'spinner'", "'skeleton'", "Type"]], keyboard: [["-", "Not interactive"]],
      aria: ["Containers set <code>aria-busy=\"true\"</code> while loading.", "Spinners use <code>role=\"status\"</code> with a label."],
      react: "<SkeletonText lines={3} />\n<Loading small withOverlay={false} />",
    },
    {
      id: "tabs", name: "Tabs", cat: "Navigation", status: "Stable",
      desc: "Tabs switch between related views within the same context without leaving the page.",
      playground: { controls: [{ key: "kind", label: "Kind", options: ["Underline", "Pill"] }], render: (s) => `<div class="pf-tabs${s.kind === "Pill" ? " pf-tabs--pill" : ""}" role="tablist"><button class="pf-tab" role="tab" aria-selected="true">Overview</button><button class="pf-tab" role="tab" aria-selected="false">Nodes <span class="pf-count">4</span></button><button class="pf-tab" role="tab" aria-selected="false">Access</button><button class="pf-tab" role="tab" aria-selected="false">Audit log</button></div>` },
      when: ["Two to seven peer views of the same object."], whenNot: ["Sequential steps: use a progress indicator.", "Top-level navigation: use side navigation."],
      variants: [],
      dd: ['<div class="pf-tabs" role="tablist"><button class="pf-tab" aria-selected="true">Overview</button><button class="pf-tab">Logs</button></div>', "Use short, parallel nouns.", '<div class="pf-tabs"><button class="pf-tab" aria-selected="true">Click here to see overview</button></div>', "Write long or action-style tab labels."],
      tokens: [["--pf-teal-500", "Selected indicator"], ["--pf-border-subtle", "Baseline"], ["--pf-text-secondary", "Unselected label"]],
      props: [["selectedIndex", "number", "0", "Active tab"], ["kind", "'underline' | 'pill'", "'underline'", "Style"], ["onChange", "(i) => void", "-", "Handler"]],
      keyboard: [["Arrow left / right", "Move between tabs"], ["Home / End", "First / last tab"], ["Tab", "Moves into the panel"]],
      aria: ["<code>role=\"tablist\"</code>, <code>role=\"tab\"</code>, <code>aria-selected</code>, and <code>aria-controls</code> pointing at each <code>role=\"tabpanel\"</code>."],
      react: "<Tabs>\n  <TabList aria-label=\"Cluster views\">\n    <Tab>Overview</Tab>\n    <Tab>Nodes</Tab>\n  </TabList>\n  <TabPanels>...</TabPanels>\n</Tabs>",
    },
    {
      id: "breadcrumb", name: "Breadcrumb", cat: "Navigation", status: "Stable",
      desc: "Breadcrumbs show where the current page sits in the hierarchy and let people move up levels.",
      playground: { controls: [{ key: "sep", label: "Separator", options: ["Slash", "Chevron"] }], render: (s) => `<nav aria-label="Breadcrumb"><ol class="pf-breadcrumb${s.sep === "Chevron" ? " pf-breadcrumb--chevron" : ""}"><li><a href="#/">Partners</a></li><li><a href="#/">Acme Corp</a></li><li><a href="#/">Integrations</a></li><li aria-current="page">Salesforce sync</li></ol></nav>` },
      when: ["Hierarchies three or more levels deep."], whenNot: ["Flat sites or single-level apps."],
      variants: [], dd: ['<ol class="pf-breadcrumb"><li><a href="#/">Partners</a></li><li aria-current="page">Acme</li></ol>', "End with the current page, not a link.", '<ol class="pf-breadcrumb"><li><a href="#/">Home</a></li></ol>', "Show a breadcrumb with one item."],
      tokens: [["--pf-text-link", "Links"], ["--pf-text-disabled", "Separator"]],
      props: [["items", "{label, href}[]", "[]", "Trail"], ["noTrailingSlash", "boolean", "true", "Separator after last"]],
      keyboard: [["Tab", "Moves between links"]], aria: ["Wrap in <code>&lt;nav aria-label=\"Breadcrumb\"&gt;</code>; mark the last item <code>aria-current=\"page\"</code>."],
      react: "<Breadcrumb>\n  <BreadcrumbItem href=\"/partners\">Partners</BreadcrumbItem>\n  <BreadcrumbItem isCurrentPage>Acme Corp</BreadcrumbItem>\n</Breadcrumb>",
    },
    {
      id: "pagination", name: "Pagination", cat: "Navigation", status: "Stable",
      desc: "Pagination splits long collections into pages with page size control and position feedback.",
      playground: { controls: [{ key: "kind", label: "Kind", options: ["Numbered", "Prev / next"] }], render: (s) => s.kind === "Numbered" ? `<nav class="pf-pagination" aria-label="Pagination"><span style="margin-right:12px">Rows <select class="pf-select" style="width:72px;min-height:32px;display:inline-block"><option>25</option><option>50</option></select></span><button class="pf-page" disabled aria-label="Previous page">‹</button><button class="pf-page" aria-current="page">1</button><button class="pf-page">2</button><button class="pf-page">3</button><span>…</span><button class="pf-page">12</button><button class="pf-page" aria-label="Next page">›</button><span style="margin-left:12px">1-25 of 288</span></nav>` : `<nav class="pf-pagination" aria-label="Pagination"><button class="pf-btn pf-btn--sm pf-btn--tertiary" disabled>Previous</button><span style="margin:0 12px">Page 1 of 12</span><button class="pf-btn pf-btn--sm pf-btn--tertiary">Next</button></nav>` },
      when: ["Tables and lists over ~50 items."], whenNot: ["Feeds where infinite scroll fits better."],
      variants: [], dd: ['<span class="pf-helper">1-25 of 288</span>', "Show position and total.", '<span class="pf-helper">Page 1</span>', "Hide how much content exists."],
      tokens: [["--pf-interactive-primary", "Current page"], ["--pf-background-hover", "Hover"]],
      props: [["page", "number", "1", "Current"], ["pageSize", "number", "25", "Rows per page"], ["totalItems", "number", "-", "Total"]],
      keyboard: [["Tab", "Moves across controls"], ["Enter", "Go to page"]], aria: ["Wrap in <code>&lt;nav aria-label=\"Pagination\"&gt;</code>; current page uses <code>aria-current=\"page\"</code>."],
      react: "<Pagination page={1} pageSize={25} pageSizes={[25, 50, 100]} totalItems={288} />",
    },
    {
      id: "side-navigation", name: "Side navigation", cat: "Navigation", status: "Stable",
      desc: "Side navigation is the primary way to move through an app, with collapsible groups for large information spaces.",
      playground: { controls: [], render: () => `<nav class="pf-sidenav" aria-label="App"><div class="brand" style="padding:6px 12px 10px"><span class="brand__dot"></span>PATHFINDER</div><div class="pf-sidenav__group">Operate</div><a href="#/" aria-current="page">Dashboard</a><a href="#/">Partners <span class="pf-count">3</span></a><a href="#/">Approvals</a><div class="pf-sidenav__group">Configure</div><a href="#/">Integrations</a><a href="#/">Access</a><a href="#/">Settings</a></nav>` },
      when: ["Apps with five or more top-level destinations."], whenNot: ["Two or three destinations: use tabs or header links."],
      variants: [], dd: ['<span class="pf-helper">Groups: Operate, Configure</span>', "Group items by task.", '<span class="pf-helper">Groups: Misc, Other, More</span>', "Use vague group names."],
      tokens: [["--pf-background-shell", "Rail"], ["--pf-background-selected", "Current item"], ["--pf-text-accent", "Current label"]],
      props: [["items", "NavItem[]", "[]", "Tree"], ["expanded", "boolean", "true", "Rail state"]],
      keyboard: [["Tab", "Moves through links"], ["Enter", "Opens link or toggles group"]],
      aria: ["Use <code>&lt;nav&gt;</code> with a label; current link sets <code>aria-current=\"page\"</code>."],
      react: "<SideNav aria-label=\"App\">\n  <SideNavLink href=\"/\" isActive>Dashboard</SideNavLink>\n</SideNav>",
    },
    {
      id: "modal", name: "Modal", cat: "Overlays", status: "Stable",
      desc: "Modals focus attention on a single task or decision and block the rest of the page until dismissed.",
      playground: { controls: [{ key: "size", label: "Size", options: ["Medium", "Small", "Large"] }], render: (s) => `<div style="display:grid;gap:20px;justify-items:center;width:100%"><div class="pf-modal pf-modal--inline${s.size === "Small" ? " pf-modal--sm" : s.size === "Large" ? " pf-modal--lg" : ""}" role="dialog" aria-labelledby="mdl-t"><div class="pf-modal__head"><div><p class="pf-modal__label">Partner access</p><h2 class="pf-modal__title" id="mdl-t">Revoke API credentials?</h2></div><button class="icon-btn" aria-label="Close">×</button></div><div class="pf-modal__body">Revoking credentials for Acme Corp stops 14 active integrations immediately.</div><div class="pf-modal__foot"><button class="pf-btn pf-btn--tertiary">Cancel</button><button class="pf-btn pf-btn--danger">Revoke</button></div></div><button class="pf-btn pf-btn--tertiary" data-open-modal>Open live modal</button></div>` },
      when: ["Confirming destructive or irreversible actions.", "Short, focused tasks that need an answer now."], whenNot: ["Long forms: use a full page or side panel.", "Non-blocking info: use a notification."],
      variants: [], dd: ['<button class="pf-btn pf-btn--tertiary">Cancel</button><button class="pf-btn pf-btn--danger">Revoke</button>', "Label actions with the verb: Revoke, Delete, Publish.", '<button class="pf-btn pf-btn--tertiary">No</button><button class="pf-btn">Yes</button>', "Use Yes / No. People skim buttons, not questions."],
      tokens: [["--pf-background-elevated", "Surface"], ["--pf-elevation-04", "Shadow"], ["--pf-radius-xl", "Radius"], ["--pf-duration-slow + --pf-easing-enter", "Entrance"]],
      sizes: [["Small", "400px", "Confirmations"], ["Medium", "520px", "Default"], ["Large", "760px", "Short forms"]],
      props: [["open", "boolean", "false", "Visibility"], ["danger", "boolean", "false", "Destructive styling"], ["primaryButtonText", "string", "-", "Action"], ["onRequestClose", "() => void", "-", "Close"]],
      keyboard: [["Tab / Shift+Tab", "Cycles within the modal (focus trap)"], ["Esc", "Closes"], ["Enter", "Activates focused button"]],
      aria: ["<code>role=\"dialog\"</code>, <code>aria-modal=\"true\"</code>, <code>aria-labelledby</code> the title.", "Focus moves in on open and returns to the trigger on close. Try the live modal."],
      react: "<Modal open={open} danger modalHeading=\"Revoke API credentials?\" primaryButtonText=\"Revoke\" secondaryButtonText=\"Cancel\" onRequestClose={close} />",
    },
    {
      id: "tooltip", name: "Tooltip", cat: "Overlays", status: "Stable",
      desc: "Tooltips give brief, supplemental descriptions on hover or focus.",
      playground: { controls: [{ key: "pos", label: "Placement", options: ["Top", "Bottom"] }], render: (s) => `<span class="pf-tip${s.pos === "Bottom" ? " pf-tip--bottom" : ""} is-open"><button class="pf-btn pf-btn--tertiary pf-btn--icon" aria-describedby="tt-1" aria-label="Refresh">↻</button><span class="pf-tip__bubble" role="tooltip" id="tt-1">Refresh telemetry</span></span>` },
      when: ["Labeling icon-only buttons.", "Brief definitions of terms."], whenNot: ["Essential info or anything interactive: use a popover."],
      variants: [], dd: ['<span class="pf-tip is-open"><button class="pf-btn pf-btn--ghost pf-btn--icon" aria-label="Copy">⧉</button><span class="pf-tip__bubble">Copy ID</span></span>', "Keep it to a few words.", '<span class="pf-helper">Tooltip with a link and a button inside</span>', "Put interactive content in a tooltip."],
      tokens: [["--pf-background-inverse", "Bubble"], ["--pf-text-inverse", "Text"], ["--pf-duration-base", "Fade"]],
      props: [["label", "string", "-", "Text"], ["align", "'top' | 'bottom' | 'left' | 'right'", "'top'", "Placement"]],
      keyboard: [["Tab", "Focusing the trigger shows the tooltip"], ["Esc", "Dismisses"]], aria: ["Trigger references the bubble with <code>aria-describedby</code>; bubble has <code>role=\"tooltip\"</code>."],
      react: "<Tooltip label=\"Refresh telemetry\" align=\"top\">\n  <IconButton icon={Renew} />\n</Tooltip>",
    },
    {
      id: "popover", name: "Popover", cat: "Overlays", status: "Stable",
      desc: "Popovers show richer, interactive content anchored to a trigger, such as menus and quick filters.",
      playground: { controls: [], render: () => `<div class="pf-popover"><button class="pf-btn pf-btn--tertiary" data-popover aria-haspopup="menu">Actions ▾</button><div class="pf-popover__panel" style="padding:4px"><ul class="pf-menu" role="menu"><li><button role="menuitem">Duplicate</button></li><li><button role="menuitem">Export CSV</button></li><li><button role="menuitem" style="color:var(--pf-status-error)">Archive</button></li></ul></div></div>` },
      when: ["Overflow menus, quick filters, small forms."], whenNot: ["Blocking decisions: use a modal."],
      variants: [], dd: ['<span class="pf-helper">3 to 7 menu items</span>', "Keep menus short and grouped.", '<span class="pf-helper">20 ungrouped menu items</span>', "Hide your whole navigation in a popover."],
      tokens: [["--pf-background-elevated", "Panel"], ["--pf-elevation-02", "Shadow"], ["--pf-radius-lg", "Radius"]],
      props: [["open", "boolean", "false", "Visibility"], ["align", "string", "'bottom-start'", "Placement"]],
      keyboard: [["Enter / Space", "Open"], ["Arrow keys", "Move between items"], ["Esc", "Close and return focus"]], aria: ["Trigger has <code>aria-haspopup</code> and <code>aria-expanded</code>; menus use <code>role=\"menu\"</code>."],
      react: "<OverflowMenu>\n  <OverflowMenuItem itemText=\"Duplicate\" />\n  <OverflowMenuItem itemText=\"Archive\" isDelete />\n</OverflowMenu>",
    },
    {
      id: "notification", name: "Notification", cat: "Feedback", status: "Stable",
      desc: "Notifications communicate system messages: inline in context, or as toasts that appear and dismiss themselves.",
      playground: { controls: [{ key: "kind", label: "Severity", options: ["Info", "Success", "Warning", "Error"] }], render: (s) => { const k = s.kind.toLowerCase(); const m = { info: ["Portal update available", "v1.4.0 is ready to deploy."], success: ["Sync complete", "2,418 records updated."], warning: ["Quota at 85%", "Upgrade before the next billing cycle."], error: ["Deployment failed", "Health check timed out on node 3."] }[k]; return `<div style="display:grid;gap:16px;justify-items:center;width:100%"><div class="pf-notice pf-notice--${k}" role="${k === "error" ? "alert" : "status"}" style="width:440px"><span class="pf-notice__icon">${{ info: "i", success: "✓", warning: "!", error: "×" }[k]}</span><div><p class="pf-notice__title">${m[0]}</p><p class="pf-notice__body">${m[1]}</p></div><button class="pf-notice__close" aria-label="Dismiss">×</button></div><button class="pf-btn pf-btn--tertiary pf-btn--sm" data-toast="${m[0]}" data-kind="${k}">Fire as toast</button></div>`; } },
      when: ["Inline: messages tied to a section.", "Toast: confirmation of a completed action."], whenNot: ["Critical, blocking issues: use a modal."],
      variants: [], dd: ['<span class="pf-helper">"Sync failed. Check the API key in Settings."</span>', "Say what happened and what to do next.", '<span class="pf-helper">"Error 0x80004005"</span>', "Show raw error codes alone."],
      tokens: [["--pf-status-info / success / warning / error", "Accent, border, tint"], ["--pf-elevation-03", "Toast shadow"]],
      props: [["kind", "'info' | 'success' | 'warning' | 'error'", "'info'", "Severity"], ["title", "string", "-", "Heading"], ["subtitle", "string", "-", "Body"], ["timeout", "number", "0", "Auto-dismiss (toast)"]],
      keyboard: [["Tab", "Focus dismiss or action"], ["Enter", "Dismiss"]], aria: ["Errors use <code>role=\"alert\"</code>; others use <code>role=\"status\"</code> so they are announced politely."],
      react: "<InlineNotification kind=\"warning\" title=\"Quota at 85%\" subtitle=\"Upgrade before the next billing cycle.\" />",
    },
    {
      id: "alert-banner", name: "Alert banner", cat: "Feedback", status: "Stable",
      desc: "Alert banners span the top of the app for system-wide messages such as maintenance windows.",
      playground: { block: true, controls: [{ key: "kind", label: "Kind", options: ["Info", "Warning", "Error", "Brand"] }], render: (s) => `<div class="pf-banner pf-banner--${s.kind.toLowerCase()}" role="${s.kind === "Error" ? "alert" : "status"}"><span style="flex:1">${{ Info: "Scheduled maintenance Saturday 02:00-04:00 UTC.", Warning: "Degraded performance in eu-central-1.", Error: "Authentication service is down. We are on it.", Brand: "Pathfinder v1.4 is here: Sankey charts, date picker, and more." }[s.kind]}</span><a href="#/changelog">Details</a></div>` },
      when: ["App-wide, time-sensitive messages."], whenNot: ["Messages about one section: use an inline notification."],
      variants: [], dd: ['<span class="pf-helper">One banner at a time</span>', "Show one banner and let it be dismissed.", '<span class="pf-helper">Three stacked banners</span>', "Stack banners."],
      tokens: [["--pf-status-info / warning", "Fills"], ["--pf-gradient-brand", "Brand"]],
      props: [["kind", "'info' | 'warning' | 'error' | 'brand'", "'info'", "Kind"], ["dismissible", "boolean", "true", "Close button"]],
      keyboard: [["Tab", "Focus link or dismiss"]], aria: ["Place before main content in the DOM; errors use <code>role=\"alert\"</code>."],
      react: "<AlertBanner kind=\"warning\">Degraded performance in eu-central-1.</AlertBanner>",
    },
    {
      id: "accordion", name: "Accordion", cat: "Containers", status: "Stable",
      desc: "Accordions stack sections of content that expand and collapse to save space.",
      playground: { block: true, controls: [], render: () => `<div class="pf-accordion" style="max-width:640px;margin:0 auto"><details open><summary>What counts as an active partner?</summary><div class="pf-accordion__body">Any partner with at least one integration that synced in the last 30 days.</div></details><details><summary>How are tiers calculated?</summary><div class="pf-accordion__body">Tier is based on trailing twelve-month MRR, recalculated nightly.</div></details><details><summary>Can I export audit logs?</summary><div class="pf-accordion__body">Yes. Admins can export CSV or stream to a SIEM.</div></details></div>` },
      when: ["FAQs, settings groups, long forms split by topic."], whenNot: ["Content everyone needs: show it."],
      variants: [], dd: ['<span class="pf-helper">Headers phrased as questions or topics</span>', "Make headers scannable.", '<span class="pf-helper">An accordion inside an accordion</span>', "Nest accordions."],
      tokens: [["--pf-border-subtle", "Dividers"], ["--pf-text-accent", "Open indicator"], ["--pf-duration-base", "Indicator rotation"]],
      props: [["align", "'start' | 'end'", "'end'", "Indicator side"], ["open", "boolean", "false", "Per item"]],
      keyboard: [["Tab", "Moves between headers"], ["Enter / Space", "Toggle section"]], aria: ["Native <code>&lt;details&gt;/&lt;summary&gt;</code> exposes expanded state automatically."],
      react: "<Accordion>\n  <AccordionItem title=\"How are tiers calculated?\">...</AccordionItem>\n</Accordion>",
    },
    {
      id: "divider", name: "Divider", cat: "Containers", status: "Stable",
      desc: "Dividers separate groups of content horizontally, vertically, or with a label.",
      playground: { block: true, controls: [{ key: "kind", label: "Kind", options: ["Horizontal", "Labeled", "Vertical"] }], render: (s) => s.kind === "Vertical" ? `<div style="display:flex;height:40px;align-items:center;justify-content:center">Nodes<hr class="pf-divider pf-divider--v"/>Pods<hr class="pf-divider pf-divider--v"/>Services</div>` : s.kind === "Labeled" ? `<div class="pf-divider-label" style="max-width:480px;margin:0 auto">Or continue with</div>` : `<div style="max-width:480px;margin:0 auto"><p style="margin:0">Section one</p><hr class="pf-divider"/><p style="margin:0">Section two</p></div>` },
      when: ["Separating groups when spacing alone is not enough."], whenNot: ["Between every list item: use spacing."],
      variants: [], dd: ['<span class="pf-helper">Spacing first, divider second</span>', "Try whitespace first.", '<span class="pf-helper">Dividers between every row</span>', "Overuse dividers."],
      tokens: [["--pf-border-subtle", "Line"], ["--pf-space-5", "Margin"]], props: [["orientation", "'horizontal' | 'vertical'", "'horizontal'", "Direction"]], keyboard: [["-", "Not interactive"]], aria: ["Use <code>&lt;hr&gt;</code> for semantic breaks; purely visual lines can be CSS borders."],
      react: "<Divider />",
    },
  ];

  PF.COMPONENTS.sort((a, b) => a.name.localeCompare(b.name));
  PF.componentById = (id) => PF.COMPONENTS.find((c) => c.id === id);

  /* ---------- page renderer ---------- */
  PF.renderComponent = function (c, tab) {
    const tabs = ["usage", "style", "code", "accessibility"];
    tab = tabs.includes(tab) ? tab : "usage";
    let body = "";
    if (tab === "usage") {
      body += PF.h2("Live demo") + PF.playground(c.playground);
      body += PF.h2("Overview") + `<p>${c.desc}</p>`;
      body += PF.h3("When to use") + `<ul>${c.when.map((w) => `<li>${w}</li>`).join("")}</ul>`;
      body += PF.h3("When not to use") + `<ul>${c.whenNot.map((w) => `<li>${w}</li>`).join("")}</ul>`;
      if (c.variants.length) { body += PF.h2("Variants"); c.variants.forEach(([n, d, h]) => (body += `${PF.h3(n)}<p>${d}</p>${PF.stage(h, { label: n })}`)); }
      body += PF.h2("Best practices") + PF.dd(...c.dd);
    } else if (tab === "style") {
      body += PF.h2("Tokens") + `<p>Every value below is a CSS custom property. Click a row to copy the token. Open the token editor (${"⚙"} in the header) to change them live.</p>`;
      body += `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>Token</th><th>Role</th><th>Current value</th></tr></thead><tbody>${c.tokens.map(([t, r]) => { const v = t.startsWith("--") && !t.includes(" ") ? PF.tokenValue(t) : ""; return `<tr class="tok-row" data-copy="${t.split(" ")[0]}"><td><code>${t}</code></td><td>${r}</td><td>${v ? `${/^#|rgb/.test(v) ? `<span class="chip" style="background:${v}"></span>` : ""}<code>${x(v)}</code>` : "-"}</td></tr>`; }).join("")}</tbody></table></div>`;
      if (c.sizes) body += PF.h2("Sizes") + PF.table(["Size", "Height", "Use"], c.sizes);
      body += PF.h2("Theming") + `<p>${c.name} reads only semantic roles, so switching the theme (header toggle) swaps its colors without any class changes.</p>`;
    } else if (tab === "code") {
      body += PF.h2("React") + PF.codeBlock(c.react, "js");
      body += PF.h2("HTML + CSS") + `<p>Framework-free markup using <code>components.css</code> classes and <code>tokens.css</code> variables.</p>` + PF.codeBlock(c.playground.render(Object.fromEntries((c.playground.controls || []).map((k) => [k.key, k.default ?? (k.options ? k.options[0] : k.type === "bool" ? false : "")]))), "html");
      body += PF.h2("Props") + PF.table(["Prop", "Type", "Default", "Description"], c.props.map((p) => [`<code>${p[0]}</code>`, `<code>${x(p[1])}</code>`, `<code>${x(p[2])}</code>`, p[3]]));
    } else {
      body += PF.h2("What Pathfinder provides") + `<ul>${c.aria.map((a) => `<li>${a}</li>`).join("")}</ul>`;
      body += PF.h2("Keyboard interactions") + PF.table(["Key", "Interaction"], c.keyboard.map(([k, a]) => [k === "-" ? "-" : k.split(" / ").map((s) => `<kbd>${s}</kbd>`).join(" / "), a]));
      body += PF.h2("Design recommendations") + `<ul><li>Keep contrast at WCAG 2.2 AA: 4.5:1 for text, 3:1 for UI boundaries and focus rings.</li><li>Never communicate state with color alone.</li><li>Keep touch targets at least 24 x 24px, 40px preferred.</li></ul>`;
      body += PF.h2("Development considerations") + `<p>Test with VoiceOver and NVDA, keyboard only, and 200% zoom. See the <a href="#/accessibility/checklist">accessibility checklist</a>.</p>`;
    }
    return { tabs, tab, body };
  };
})();
