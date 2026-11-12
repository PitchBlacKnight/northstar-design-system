# Select (Stable)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Select lets people choose one option from a list of 4 to 15 predefined values. Includes dropdown.

Page: https://mikelrosenthal.com/northstar/#/components/select · Figma node 4207:955

Classes: `is-hover`, `is-static`, `ns-dd`, `ns-dd__item`, `ns-dd__menu`, `ns-dd__trigger`, `ns-field`, `ns-helper`, `ns-input--sm`, `ns-label`, `ns-select` · helper classes in the examples: `caret`

Figma variants: Dropdown / Trigger / Content: Text (150x42), Icon (36x36), Two icons (176x42); Dropdown / Trigger / State: Default, Hover, Disabled; Dropdown / Menu / Items: 4, 5, 6, 7 (200 wide, +42 per item); Dropdown / List item: Icon: No, Yes · Hovered: No, Yes (200x40)

Use:
- Choose one option from a medium-length list.
- Space is tight and options do not need comparison.
- Dropdown: Sorting, filtering, and choosing one value from 4 to 7 options.
- Dropdown: Toolbars where a visible radio group would take too much room.

Avoid:
- Two or three options: use radio buttons.
- Over 15 options: use a searchable combo box.
- Dropdown: Two or three options: use radio buttons.
- Dropdown: Long lists: use a searchable combo box.

- Do: Order options logically: severity, alphabetical, or frequency.
- Do not: Use select for a binary choice. Use a toggle.

```html
<div class="ns-field" style="width:300px"><label class="ns-label" for="sel-1">Region</label><select class="ns-select" id="sel-1"><option>us-east-1</option><option>us-west-2</option><option>eu-central-1</option><option>ap-south-1</option></select><span class="ns-helper">Where new workloads are scheduled.</span></div>
<div style="display:grid;grid-template-columns:minmax(0,1fr);gap:6px;justify-items:start"><button class="ns-dd__trigger" aria-haspopup="listbox" aria-expanded="true" style="min-width:150px">Sort by<span class="caret"></span></button><ul class="ns-dd__menu is-static" role="listbox" aria-label="Sort by"><li><button class="ns-dd__item" role="option" aria-selected="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>Newest first</button></li><li><button class="ns-dd__item is-hover" role="option" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>Oldest first</button></li><li><button class="ns-dd__item" role="option" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>Highest load</button></li><li><button class="ns-dd__item" role="option" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>Lowest load</button></li></ul></div>
```

## Variants

### Default

Native select with custom chevron.

```html
<div class="ns-field" style="width:220px"><label class="ns-label">Tier</label><select class="ns-select"><option>Gold</option><option>Silver</option></select></div>
```

### Inline

Label beside field for toolbars.

```html
<label class="ns-label" style="display:flex;gap:8px;align-items:center">Show <select class="ns-select ns-input--sm" style="width:90px;min-height:32px"><option>25</option><option>50</option></select></label>
```

### Dropdown: Trigger states

Default, Hover, Disabled.

```html
<button class="ns-dd__trigger">Label<span class="caret"></span></button><button class="ns-dd__trigger is-hover">Label<span class="caret"></span></button><button class="ns-dd__trigger" disabled>Label<span class="caret"></span></button>
```

### Dropdown: Live

Click to open.

```html
<div class="ns-dd" data-dd><button class="ns-dd__trigger" aria-haspopup="listbox" aria-expanded="false">Region<span class="caret"></span></button><ul class="ns-dd__menu" role="listbox"><li><button class="ns-dd__item" role="option" aria-selected="true">us-east-1</button></li><li><button class="ns-dd__item" role="option">eu-central-1</button></li><li><button class="ns-dd__item" role="option">ap-south-1</button></li><li><button class="ns-dd__item" role="option">sa-east-1</button></li></ul></div>
```

Tokens: `--ns-background-surface` (Field background), `--ns-border-default` (Border), `--ns-focus-ring` (Focus), `--ns-interactive-secondary-bg` (Trigger and menu fill (gray/8)), `--ns-interactive-secondary-hover` (Hover (gray/7)), `--ns-interactive-primary` (Selected item indicator), `--ns-radius-sm` (Radius)

Props (for a component wrapper):
- label: string, default -. Visible label
- options: Option[], default []. Values
- value: string, default -. Controlled value
- onChange: (v) => void, default -. Change handler
- label (Dropdown): string, default -. Trigger text
- items (Dropdown): Item[], default []. Options
- icon (Dropdown): ReactNode, default -. Leading icon
- multiple (Dropdown): boolean, default false. Multi-select
- onChange (Dropdown): (v) => void, default -. Handler

Keyboard: Space / Enter: Opens the list; Arrow up / down: Moves through options; Type-ahead: Jumps to matching option; Enter / Space: Dropdown: Open menu; Arrow up / down: Dropdown: Move between items; Enter: Dropdown: Select item; Esc: Dropdown: Close and return focus

Accessibility:
- Native <select> gives full screen reader support for free.
- Associate the label with for / id.
- Dropdown: Trigger has aria-haspopup="listbox" and aria-expanded.
- Dropdown: Menu uses role="listbox", items role="option" with aria-selected.

