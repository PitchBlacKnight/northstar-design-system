# NorthStar style rules

One set of rules for every component, widget, chart and dashboard tile. `tools/style-lint.mjs` enforces
the mechanical ones on `css/components.css`, `css/widgets.css` and `css/dashboards.css`.

## Color roles
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

## Surfaces
- Flat fills. No gradients, no glow, no blur, no colored shadows. Elevation is `--ns-elevation-01..04`.
- Alerts, notices and toasts share one treatment: `status-*-bg` surface, status-colored icon,
  `text-primary` title and `text-secondary` body. No solid accent fills.

## Shape
- Radius from `--ns-radius-*` only; `50%` is allowed for circles.
- Controls (buttons, fields, selects, chips) use `radius-sm`; cards and tiles use `radius-lg`
  (widgets `--ns-widget-radius`); pills use `radius-full`.

## Focus
- One focus ring everywhere: `outline: 2px solid var(--ns-focus-ring); outline-offset: 2px`.
  Never removed. Fields may also change border color.

## Type
- Open Sans. Sizes from `--ns-type-*-size`; weights 400, 600, 700 only.
- Keyboard highlight in lists (`.is-active`) is `background-selected`; a match in search results is
  bold `text-primary`, never a colored block.
