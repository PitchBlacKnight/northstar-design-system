# Gauge chart (New)

> NorthStar component. Category: Data viz. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

A gauge chart shows one value against its limit on a half circle. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/gauge-chart · Figma node 4460:38422

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Figma variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- One measure against its ceiling: capacity, quota, budget.
- A status tile that needs the headroom at a glance.
- Small spaces where a number needs context.

Avoid:
- More than one measure. Use Bullet chart.
- Trends. Use Line chart.
- Parts of a whole. Use Donut chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Capacity</span><span class="ns-chart__value">72%<span class="ns-chart__trend">+4.0%</span></span><span class="ns-chart__desc">Share of the limit used</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Gauge: 72 percent of the limit is used" data-chart="gauge" data-size="Medium" data-h="200" data-w="327"><path d="M4 182A159.5 159.5 0 0 1 323 182L278.3 182A114.83999999999999 114.83999999999999 0 0 0 48.7 182Z" fill-rule="evenodd" style="fill:var(--ns-chart-track)"/><path d="M4 182A159.5 159.5 0 0 1 265.2 59.1L236.7 93.5A114.83999999999999 114.83999999999999 0 0 0 48.7 182Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><text x="163.5" y="134.2" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="700" style="fill:var(--ns-text-primary)">72%</text><text x="26.3" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">0</text><text x="300.7" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">100</text></svg></div>
```

## Variants

### Sizes

Five sizes from the same data. Small and Vertical small drop the axes and labels.

```html
<div style="display:grid;gap:24px;justify-items:start"><div class="ns-chart ns-chart--small" style="width:100%;max-width:330px"><div class="ns-chart__kpi"><span class="ns-chart__title ns-chart__title--sm">Capacity</span><span class="ns-chart__value ns-chart__value--sm">72%<span class="ns-chart__trend">+4.0%</span></span><span class="ns-chart__desc ns-chart__desc--sm">Of the limit</span></div><svg class="ns-chart__plot" width="120" height="64" viewBox="0 0 120 64" role="img" aria-label="Gauge: 72 percent of the limit is used" data-chart="gauge" data-size="Small" data-h="64" data-w="120"><path d="M8 58A52 52 0 0 1 112 58L97.4 58A37.44 37.44 0 0 0 22.6 58Z" fill-rule="evenodd" style="fill:var(--ns-chart-track)"/><path d="M8 58A52 52 0 0 1 93.1 17.9L83.9 29.2A37.44 37.44 0 0 0 22.6 58Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><text x="60" y="42.4" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="700" style="fill:var(--ns-text-primary)">72%</text></svg></div><div class="ns-chart ns-chart--vertical" style="width:100%;max-width:192px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title ns-chart__title--sm">Capacity</span><span class="ns-chart__value ns-chart__value--sm">72%<span class="ns-chart__trend">+4.0%</span></span><span class="ns-chart__desc ns-chart__desc--sm">Of the limit</span></div></div><svg class="ns-chart__plot" width="160" height="140" viewBox="0 0 160 140" role="img" aria-label="Gauge: 72 percent of the limit is used" data-chart="gauge" data-size="Vertical small" data-h="140" data-w="160"><path d="M4 134A76 76 0 0 1 156 134L134.7 134A54.72 54.72 0 0 0 25.3 134Z" fill-rule="evenodd" style="fill:var(--ns-chart-track)"/><path d="M4 134A76 76 0 0 1 128.4 75.4L114.9 91.8A54.72 54.72 0 0 0 25.3 134Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><text x="80" y="111.2" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="700" style="fill:var(--ns-text-primary)">72%</text></svg></div><div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Capacity</span><span class="ns-chart__value">72%<span class="ns-chart__trend">+4.0%</span></span><span class="ns-chart__desc">Share of the limit used</span></div></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Gauge: 72 percent of the limit is used" data-chart="gauge" data-size="Medium" data-h="200" data-w="327"><path d="M4 182A159.5 159.5 0 0 1 323 182L278.3 182A114.83999999999999 114.83999999999999 0 0 0 48.7 182Z" fill-rule="evenodd" style="fill:var(--ns-chart-track)"/><path d="M4 182A159.5 159.5 0 0 1 265.2 59.1L236.7 93.5A114.83999999999999 114.83999999999999 0 0 0 48.7 182Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><text x="163.5" y="134.2" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="700" style="fill:var(--ns-text-primary)">72%</text><text x="26.3" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">0</text><text x="300.7" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">100</text></svg></div><div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title ns-chart__title--lg">Capacity</span></div></div><svg class="ns-chart__plot" width="327" height="260" viewBox="0 0 327 260" role="img" aria-label="Gauge: 72 percent of the limit is used" data-chart="gauge" data-size="Large" data-h="260" data-w="327"><path d="M4 242A159.5 159.5 0 0 1 323 242L278.3 242A114.83999999999999 114.83999999999999 0 0 0 48.7 242Z" fill-rule="evenodd" style="fill:var(--ns-chart-track)"/><path d="M4 242A159.5 159.5 0 0 1 265.2 119.1L236.7 153.5A114.83999999999999 114.83999999999999 0 0 0 48.7 242Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><text x="163.5" y="194.2" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="700" style="fill:var(--ns-text-primary)">72%</text><text x="26.3" y="252" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">0</text><text x="300.7" y="252" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">100</text></svg><div class="ns-chart__summary"><div class="ns-chart__kpi"><span class="ns-chart__title ns-chart__title--sm"><span class="ns-chart__dot" style="background:var(--ns-chart-series-1)"></span>Capacity</span><span class="ns-chart__value ns-chart__value--sm">72%<span class="ns-chart__trend">+4.0%</span></span><span class="ns-chart__desc ns-chart__desc--sm">Share of the limit used</span></div><div class="ns-chart__kpi"><span class="ns-chart__title ns-chart__title--sm"><span class="ns-chart__dot" style="background:var(--ns-chart-series-3)"></span>Used</span><span class="ns-chart__value ns-chart__value--sm">72<span class="ns-chart__trend">+4.0%</span></span><span class="ns-chart__desc ns-chart__desc--sm">Units in use</span></div></div></div></div>
```

### XL

Three KPIs above the plot.

```html
<div class="ns-chart" style="width:100%;max-width:800px"><div class="ns-chart__head"><div class="ns-chart__kpis"><div class="ns-chart__kpi"><span class="ns-chart__title"><span class="ns-chart__dot" style="background:var(--ns-chart-series-1)"></span>Capacity</span><span class="ns-chart__value">72%<span class="ns-chart__trend">+4.0%</span></span><span class="ns-chart__desc">Share of the limit used</span></div><div class="ns-chart__kpi"><span class="ns-chart__title"><span class="ns-chart__dot" style="background:var(--ns-chart-series-3)"></span>Used</span><span class="ns-chart__value">72<span class="ns-chart__trend">+4.0%</span></span><span class="ns-chart__desc">Units in use</span></div><div class="ns-chart__kpi"><span class="ns-chart__title"><span class="ns-chart__dot" style="background:var(--ns-chart-series-2)"></span>Free</span><span class="ns-chart__value">28<span class="ns-chart__trend">+1.0%</span></span><span class="ns-chart__desc">Units available</span></div></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="752" height="240" viewBox="0 0 752 240" role="img" aria-label="Gauge: 72 percent of the limit is used" data-chart="gauge" data-size="XL" data-h="240" data-w="752"><path d="M160 222A216 216 0 0 1 592 222L531.5 222A155.51999999999998 155.51999999999998 0 0 0 220.5 222Z" fill-rule="evenodd" style="fill:var(--ns-chart-track)"/><path d="M160 222A216 216 0 0 1 513.7 55.6L475.1 102.2A155.51999999999998 155.51999999999998 0 0 0 220.5 222Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><text x="376" y="157.2" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="700" style="fill:var(--ns-text-primary)">72%</text><text x="190.2" y="232" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">0</text><text x="561.8" y="232" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">100</text></svg></div>
```

### Plot only

The SVG on its own, for use inside another card.

```html
<div style="width:327px"><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Gauge: 72 percent of the limit is used" data-chart="gauge" data-size="Medium" data-h="200" data-w="327"><path d="M4 182A159.5 159.5 0 0 1 323 182L278.3 182A114.83999999999999 114.83999999999999 0 0 0 48.7 182Z" fill-rule="evenodd" style="fill:var(--ns-chart-track)"/><path d="M4 182A159.5 159.5 0 0 1 265.2 59.1L236.7 93.5A114.83999999999999 114.83999999999999 0 0 0 48.7 182Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><text x="163.5" y="134.2" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="700" style="fill:var(--ns-text-primary)">72%</text><text x="26.3" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">0</text><text x="300.7" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">100</text></svg></div>
```

Tokens: `--ns-chart-series-1` (Value arc (alias of viz/1)), `--ns-chart-track` (Track arc (alias of widget/track)), `--ns-text-primary` (Value label), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Props (for a component wrapper):
- size: 'small' | 'vertical-small' | 'medium' | 'large' | 'xl', default 'medium'. Layout and plot size
- title: string, default -. Header title
- value: string, default -. Headline figure
- trend: string, default -. Signed change, for example +2.4%
- data: { value: number, max: number }, default []. Value and limit in the same unit
- showIcon: boolean, default false. Icon in the header

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with the value and the limit in the label, for example 72 percent of the limit used.
- The value is also printed as text inside the arc.
- Trend text carries its sign, so the color is a second signal.

