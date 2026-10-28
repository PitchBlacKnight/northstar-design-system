# Chart visual consistency audit

October 2026. Scope: every chart and graph the docs site and the dashboard layouts draw.

## What was found

Four renderers drew charts, each with its own idea of color and text.

| Renderer | File | Colors | Axis text | Effects |
|---|---|---|---|---|
| Chart kit (Figma-synced) | `js/charts.js` | `--ns-chart-series-*` | 11px, `--ns-chart-label-text` | none |
| Dashboard kit `NS.dash` | `js/dashboards.js` | chart series, plus raw palette from pages | 11px, chart label; 10px subs | optional glow halo, optional gradient rings |
| Widgets v1.0 (Figma Widgets page) | `js/widgets.js`, top half | gradient pairs from the raw palette (magenta to violet, cyan to sky, yellow to orange) plus two hard-coded hexes | 11px and 12px mixed, `--ns-widget-muted` | drop-shadow glow on lines, radial halos on bubbles, dashed gridlines |
| Widgets v1.5 | `js/widgets.js`, bottom half | `--ns-viz-*` | `--ns-widget-muted` | none |

The bullet chart sat between them: chart series for bars, `--ns-widget-muted` for labels.

Measured on the Widget gallery before the change: 117 gradients, 21 glow filters, axis text in two sizes, 9 distinct series hues.

### Why it read as mismatched

1. **Two categorical palettes.** `--ns-viz-4` and `--ns-viz-7` are the raw blue and persian. `--ns-chart-series-2` and `-4` are the same hues nudged to 3:1 on the widget. Widgets used the first set, the chart kit the second, so the "same" blue differed between pages.
2. **Gradients and glow on half the charts.** The chart kit, the Figma chart components and the bullet chart are flat. The v1.0 widgets carried the older gradient look.
3. **Axis text failed contrast.** `--ns-widget-muted` is 3.4:1 on the dark widget, below 4.5:1 for 11 to 12px text. `--ns-chart-label-text` is 5.6:1. The token table on chart pages also named the wrong token.
4. **Gridlines differed.** Dashed `2 4` in widgets, solid 1px in the chart kit.
5. **A bug.** `widgets.js` declared `function heat` twice, so the Temperature widget called the heatmap renderer with no arguments and drew nothing.

## What changed

One shared style module, `js/viz.js` (`NS.viz`), loaded before every renderer. It decides:

- **Color:** palette names (`teal`, `purple`, `orange`) and raw tokens (`viz-4`, `teal-500`) resolve to the chart series. Order: series 1 to 4, then `viz-3`, `viz-5`, `viz-6`, then series 5 (muted).
- **Text:** 11px regular in `--ns-chart-label-text`.
- **Gridlines:** 1px solid `--ns-widget-grid`.

The renderers now call it instead of carrying their own rules:

- `widgets.js`: token helper routes through `NS.viz`; the gradient presets became flat series fills (same API, so no call site changed); glow off; radial halos removed; dashed grids solid; all axis text 11px chart label; bubbles at 0.85 opacity to match the kit; Temperature bug fixed.
- `dashboards.js`: `T()` routes through `NS.viz`, so the 25 layouts pick up the series colors; glow removed; `grad` on rings is still accepted but draws flat; 10px subs raised to 11px.
- Bullet chart labels and the chart token tables use `--ns-chart-label-text`.
- `widgets.css`: every caption that used `--ns-widget-muted` for text now uses `--ns-chart-label-text`.

After: 0 glow filters, 0 radial halos, one axis text style, series hues only.

## Still open

- Some dashboard layouts pass literal strings such as `"var(--ns-blue-500)"` straight into `NS.dash` calls (20 files). Those skip the alias and keep the raw hue. Swap them for `t("chart-series-2")` file by file when each layout is next touched.
- Ring and KPI numbers scale with ring size (`size * 0.26`) instead of using type tokens. Acceptable for now; a type step per widget size would be cleaner.
- Figma: the Widgets page (427:8676) still shows gradients. Sync in the next batch so code and file agree.

## Measurements and lint (step 2)

- `css/tokens.css` adds `--ns-type-chart-size` (11px, the chart step between caption 12 and overline 10) and `--ns-chart-axis-size`, `--ns-chart-stroke` (2px), `--ns-chart-stroke-thin` (1.5px), `--ns-chart-grid-stroke` (1px), `--ns-chart-bar-radius` (1px). Values match what the renderers already drew, so nothing moved.
- `NS.viz.m` reads them once with `getComputedStyle`. Axis text in the chart kit, widgets, dashboard kit and bullet chart now comes from `NS.viz.m.axis`. Strokes and bar radius are exposed but call sites still pass their own numbers; move them over as each renderer is next touched.
- `tools/token-lint.mjs` counts raw hex, off-token spacing and px font sizes in every CSS file except tokens.css, and fails when a count rises above `tools/token-lint-baseline.json`. `--fix` swapped 92 spacing declarations already on the scale to `var(--ns-space-N)` (same pixels). The pre-commit hook runs it on CSS changes.
- Remaining debt at baseline: 217 (65 hex, 105 off-scale spacing such as 22px, 47 px font sizes). Lower the baseline after each cleanup with `--baseline`.
