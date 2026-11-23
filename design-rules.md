# NorthStar design rules

The main rules file. Read it first. Code is the source of truth; Figma is synced from it. `tools/style-lint.mjs` enforces the mechanical style rules on `css/components.css`, `css/widgets.css` and `css/dashboards.css`. `STYLE-RULES.md` is kept as the original style file; the style rules are included below. The reasons behind decisions are in `DECISIONS.md`.

## Source of truth and sync

- Code is the source: `css/tokens.css`, `css/components.css`, `js/components.js`. Figma file `VZxmDNQiosTN6gqnvEQ65Z` is synced from code in batches.
- Sync to Figma only on the owner's word "sync". Never write to Figma otherwise.
- Edit Figma in place. Never rebuild a variable set or component set from scratch (a rebuild such as `buildSet` deletes pages). Archive or hide instead of deleting.
- Open Sans is the type family everywhere (JetBrains Mono for code).

## Token tiers

- **Figma:** two tiers. Primitives (raw ramps and values) and Semantic (roles, with modes for theme and density).
- **CSS:** primitives first (`--ns-gray-*`, `--ns-blue-500` and so on), then semantic roles that point at them (`--ns-background-surface`, `--ns-text-primary`).
- **Components:** private `--_x` hooks (for example `--_c`, `--_bg`, `--_v`) fed by semantic tokens. There is no component token tier, on purpose: a hook is local to one component and is never a public token.
- Components use semantic tokens only. No palette variables, no hex.

## Naming a new token

- The Figma variable path equals the CSS name: slashes become dashes and the name gets the `ns-` prefix. Figma `color/background/surface` becomes `--ns-color-background-surface`.
- Existing names keep their current mapping. They connect to Figma through each variable's WEB code syntax and, where the two differ, through `tokens/drift-allow.json`. Never rename an existing token.
- A new token is proposed by name and flagged to the owner before it is added.
- Figma variable scopes are never `ALL_SCOPES`; set the narrowest scopes that fit (fill, stroke, text, gap and so on).
- Every Figma variable gets WEB code syntax (`var(--ns-...)`) and a description.

## Which token to use

The task table and the deprecated list are generated into `agent/northstar.md` (sections "Which token to use" and "Deprecated for new work") by `tools/agent-export.mjs`. Use those; do not pick a deprecated duplicate for new work.

## Do-nots

- No raw hex, rgb or px font values where a token exists. No palette tokens in components.
- No glow, blur or colored shadows. No gradients except the two listed under Surfaces.
- No purple for pressed or selected states. No teal for selection.
- No borrowed chart or palette colors to mean success, warning or error.
- Never remove the focus ring.
- No fonts other than Open Sans (and JetBrains Mono for code). Weights 400, 600 and 700; 800 only for display type (see Type).
- No raw `z-index` of 10 or more and no raw durations: use `--ns-z-*` and `--ns-duration-*`.
- No radius outside `--ns-radius-*`, except `50%` for circles.
- Do not edit `agent/*` by hand; run `node tools/agent-export.mjs`.
- Do not rename or remove an existing token.

## Style rules

One set of rules for every component, widget, chart and dashboard tile. `tools/style-lint.mjs` enforces
the mechanical ones on `css/components.css`, `css/widgets.css` and `css/dashboards.css`.

### Color roles
- **Blue is action.** `interactive-primary` (hover, active) fills primary buttons, checked controls,
  sliders, toggles, the current page in pagination, and every selection indicator: tab underline,
  sidenav current bar, selected option bar, segmented selection. Pressed is a darker blue, never purple.
- **Teal is accent.** `text-link`, `text-accent` and `focus-ring` are teal in both modes. Teal is also
  `chart/series-1`. Teal never marks selection.
- **Status is status.** `status-*` for meaning, `status-*-bg` for tinted surfaces. Never borrow a
  chart series or a palette color to mean success, warning or error.
- **Data is chart series.** Charts, legends, category tags and progress-by-category use
  `chart/series-1..5` (or `viz-*`), in order.
- Components use semantic tokens only. No palette variables (`--ns-teal-500`), no hex.

### Surfaces
- Flat fills. No glow, no blur, no colored shadows. Elevation is `--ns-elevation-01..04`.
- Two gradients are allowed, and only these (decided 2026-11-09, replacing the flat-only rule of 2026-10-26):
  - **Tile sheen.** `--ns-chart-sheen`, a soft diagonal laid over a dashboard tile's own color.
  - **Chart ramp.** A single series fades low to high along its value axis: `--ns-chart-ramp-from`
    (blue) to the series color on navy tiles, faded ink to full ink on a color block. A line gets a
    fade under it. Categories (stacks, donuts, multi-series lines, per-bar colors) stay flat.
- Alerts, notices and toasts share one treatment: `status-*-bg` surface, status-colored icon,
  `text-primary` title and `text-secondary` body. No solid accent fills.

### Shape
- Chart ends are round, with one radius: bars, tracks, segments, rings and lines (`--ns-chart-bar-radius`
  12px, `--ns-chart-cap`, `NS.viz.round`). A mark up to 24px thick ends in a half-circle; a wider bar
  keeps the same 12px curve. Marks that tile against each other (donut parts, treemap and
  Sankey nodes, heat cells) keep their small radius.
- Radius from `--ns-radius-*` only; `50%` is allowed for circles.
- Controls (buttons, fields, selects, chips, combobox, stepper, segmented) use `radius-sm`; cards and tiles use `radius-lg`
  (widgets `--ns-widget-radius`); pills use `radius-full`. A control that sits inside another control's padding
  (a segmented button) steps down to `radius-xs`.

### Fields
- One recipe for input, select, textarea, combobox and stepper: `field-bg` fill, a transparent 1px border, `radius-sm`.
  Hover shows `border-default`; focus shows the focus ring and `focus-field`.
- High Contrast draws the field edge in `border-strong`, because every surface there is one black.
- Heights come from `--ns-density-control`, `-sm` and `-lg`, so compact density reaches every control.

### Disabled
- Actions (button, dropdown trigger, link, menu item, segmented and stepper buttons) recolor: `text-disabled` text, and a
  filled one sits on `border-default`.
- Fields and selection controls (input, select, textarea, combobox, stepper, checkbox, radio, toggle, pagination) fade as a
  whole with `--ns-opacity-disabled`.
- Both use `cursor: not-allowed` where the element still receives the pointer.

### Motion and stacking
- Durations from `--ns-duration-*`. Loops use `duration-loop-fast` (spinner), `duration-loop` (shimmer, indeterminate, typing)
  and `duration-loop-slow` (status blink). Each looping component turns its own animation off under reduced motion.
- `z-index` from `--ns-z-*` (tooltip, popover, dropdown, launcher, panel, toast, modal). Local stacking inside one component may use 1 to 3.

### Focus
- One focus ring everywhere: `outline: 2px solid var(--ns-focus-ring); outline-offset: 2px`.
  An item that its container clips (a tab, an accordion summary, a menu item, a stepper or segmented button) draws the same ring inset: `outline-offset: -2px`.
  Never removed. Fields may also change border color.

### Type
- Open Sans. Sizes from `--ns-type-*-size`; weights 400, 600 and 700. 800 is the display weight: `h1`, `h2`, KPI values and
  dashboard numerals, at 24px and up.
- Dashboard headline numbers use the numeral scale, `--ns-type-numeral-mega-size` (168px) down to `-md-size` (30px).
- Two type scales. `--ns-type-h1` to `-h6` are the display scale (72 down to 20px) for marketing and docs headings. Product screens use the Figma text styles, each linked in Figma to the token it equals: Heading / H2 is `h5` size with a 32px line, Heading / H3 is `h6`, Heading / H4 and Body / Large are `body1`, Body is `body2`, Caption and Label are `caption`, Overline is `overline`, Chart / Value is `h4`, Chart / Label is `chart`. Heading / H1 (32/40) is `heading1`.
- Keyboard highlight in lists (`.is-active`) is `background-selected`; a match in search results is
  bold `text-primary`, never a colored block.
