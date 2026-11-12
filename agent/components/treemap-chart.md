# Treemap chart (New)

> NorthStar component. Category: Data viz. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

A treemap shows shares of a whole as nested rectangles sized by value. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/treemap-chart · Figma node 4463:39101

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Figma variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Many parts of a whole where area is enough.
- Storage by type or spend by team.
- A KPI tile that needs the make-up of a total.

Avoid:
- Exact comparison. Use Horizontal bar chart.
- Time series. Use Line chart.
- Fewer than three parts. Use Donut chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Storage</span><span class="ns-chart__value">640 GB<span class="ns-chart__trend">+3.0%</span></span><span class="ns-chart__desc">Tile size is its share</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Treemap: five tiles, each sized by its share of the whole" data-chart="treemap" data-size="Medium" data-h="200" data-w="327"><rect x="0" y="0" width="178.4" height="118.5" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.9"/><rect x="0" y="121.5" width="178.4" height="78.5" rx="4" style="fill:var(--ns-chart-series-3);fill-opacity:0.9"/><rect x="181.4" y="0" width="145.6" height="77.6" rx="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.9"/><rect x="181.4" y="80.6" width="145.6" height="67.9" rx="4" style="fill:var(--ns-chart-series-4);fill-opacity:0.9"/><rect x="181.4" y="151.5" width="145.6" height="48.5" rx="4" style="fill:var(--ns-chart-series-5);fill-opacity:0.9"/></svg></div>
```

## Variants

### Sizes

Five sizes from the same data. Small and Vertical small drop the axes and labels.

```html
<div style="display:grid;gap:24px;justify-items:start"><div class="ns-chart ns-chart--small" style="width:100%;max-width:330px"><div class="ns-chart__kpi"><span class="ns-chart__title ns-chart__title--sm">Storage</span><span class="ns-chart__value ns-chart__value--sm">640 GB<span class="ns-chart__trend">+3.0%</span></span><span class="ns-chart__desc ns-chart__desc--sm">Tile is share</span></div><svg class="ns-chart__plot" width="120" height="64" viewBox="0 0 120 64" role="img" aria-label="Treemap: five tiles, each sized by its share of the whole" data-chart="treemap" data-size="Small" data-h="64" data-w="120"><rect x="0" y="0" width="65" height="37.4" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.9"/><rect x="0" y="39.4" width="65" height="24.6" rx="4" style="fill:var(--ns-chart-series-3);fill-opacity:0.9"/><rect x="67" y="0" width="53" height="24" rx="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.9"/><rect x="67" y="26" width="53" height="21" rx="4" style="fill:var(--ns-chart-series-4);fill-opacity:0.9"/><rect x="67" y="49" width="53" height="15" rx="4" style="fill:var(--ns-chart-series-5);fill-opacity:0.9"/></svg></div><div class="ns-chart ns-chart--vertical" style="width:100%;max-width:192px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title ns-chart__title--sm">Storage</span><span class="ns-chart__value ns-chart__value--sm">640 GB<span class="ns-chart__trend">+3.0%</span></span><span class="ns-chart__desc ns-chart__desc--sm">Tile is share</span></div></div><svg class="ns-chart__plot" width="160" height="140" viewBox="0 0 160 140" role="img" aria-label="Treemap: five tiles, each sized by its share of the whole" data-chart="treemap" data-size="Vertical small" data-h="140" data-w="160"><rect x="0" y="0" width="87" height="83" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.9"/><rect x="0" y="85" width="87" height="55" rx="4" style="fill:var(--ns-chart-series-3);fill-opacity:0.9"/><rect x="89" y="0" width="71" height="54.4" rx="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.9"/><rect x="89" y="56.4" width="71" height="47.6" rx="4" style="fill:var(--ns-chart-series-4);fill-opacity:0.9"/><rect x="89" y="106" width="71" height="34" rx="4" style="fill:var(--ns-chart-series-5);fill-opacity:0.9"/></svg></div><div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Storage</span><span class="ns-chart__value">640 GB<span class="ns-chart__trend">+3.0%</span></span><span class="ns-chart__desc">Tile size is its share</span></div></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Treemap: five tiles, each sized by its share of the whole" data-chart="treemap" data-size="Medium" data-h="200" data-w="327"><rect x="0" y="0" width="178.4" height="118.5" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.9"/><rect x="0" y="121.5" width="178.4" height="78.5" rx="4" style="fill:var(--ns-chart-series-3);fill-opacity:0.9"/><rect x="181.4" y="0" width="145.6" height="77.6" rx="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.9"/><rect x="181.4" y="80.6" width="145.6" height="67.9" rx="4" style="fill:var(--ns-chart-series-4);fill-opacity:0.9"/><rect x="181.4" y="151.5" width="145.6" height="48.5" rx="4" style="fill:var(--ns-chart-series-5);fill-opacity:0.9"/></svg></div><div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title ns-chart__title--lg">Storage</span></div></div><svg class="ns-chart__plot" width="327" height="260" viewBox="0 0 327 260" role="img" aria-label="Treemap: five tiles, each sized by its share of the whole" data-chart="treemap" data-size="Large" data-h="260" data-w="327"><rect x="0" y="0" width="178.4" height="154.5" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.9"/><rect x="0" y="157.5" width="178.4" height="102.5" rx="4" style="fill:var(--ns-chart-series-3);fill-opacity:0.9"/><rect x="181.4" y="0" width="145.6" height="101.6" rx="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.9"/><rect x="181.4" y="104.6" width="145.6" height="88.9" rx="4" style="fill:var(--ns-chart-series-4);fill-opacity:0.9"/><rect x="181.4" y="196.5" width="145.6" height="63.5" rx="4" style="fill:var(--ns-chart-series-5);fill-opacity:0.9"/></svg><div class="ns-chart__summary"><div class="ns-chart__kpi"><span class="ns-chart__title ns-chart__title--sm"><span class="ns-chart__dot" style="background:var(--ns-chart-series-1)"></span>Storage</span><span class="ns-chart__value ns-chart__value--sm">640 GB<span class="ns-chart__trend">+3.0%</span></span><span class="ns-chart__desc ns-chart__desc--sm">Tile size is its share</span></div><div class="ns-chart__kpi"><span class="ns-chart__title ns-chart__title--sm"><span class="ns-chart__dot" style="background:var(--ns-chart-series-3)"></span>Largest</span><span class="ns-chart__value ns-chart__value--sm">Photos<span class="ns-chart__trend">+1.5%</span></span><span class="ns-chart__desc ns-chart__desc--sm">Biggest tile</span></div></div></div></div>
```

### XL

Three KPIs above the plot.

```html
<div class="ns-chart" style="width:100%;max-width:800px"><div class="ns-chart__head"><div class="ns-chart__kpis"><div class="ns-chart__kpi"><span class="ns-chart__title"><span class="ns-chart__dot" style="background:var(--ns-chart-series-1)"></span>Storage</span><span class="ns-chart__value">640 GB<span class="ns-chart__trend">+3.0%</span></span><span class="ns-chart__desc">Tile size is its share</span></div><div class="ns-chart__kpi"><span class="ns-chart__title"><span class="ns-chart__dot" style="background:var(--ns-chart-series-3)"></span>Largest</span><span class="ns-chart__value">Photos<span class="ns-chart__trend">+1.5%</span></span><span class="ns-chart__desc">Biggest tile</span></div><div class="ns-chart__kpi"><span class="ns-chart__title"><span class="ns-chart__dot" style="background:var(--ns-chart-series-2)"></span>Smallest</span><span class="ns-chart__value">Docs<span class="ns-chart__trend">+0.4%</span></span><span class="ns-chart__desc">Smallest tile</span></div></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="752" height="240" viewBox="0 0 752 240" role="img" aria-label="Treemap: five tiles, each sized by its share of the whole" data-chart="treemap" data-size="XL" data-h="240" data-w="752"><rect x="0" y="0" width="412.1" height="142.5" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.9"/><rect x="0" y="145.5" width="412.1" height="94.5" rx="4" style="fill:var(--ns-chart-series-3);fill-opacity:0.9"/><rect x="415.1" y="0" width="336.9" height="93.6" rx="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.9"/><rect x="415.1" y="96.6" width="336.9" height="81.9" rx="4" style="fill:var(--ns-chart-series-4);fill-opacity:0.9"/><rect x="415.1" y="181.5" width="336.9" height="58.5" rx="4" style="fill:var(--ns-chart-series-5);fill-opacity:0.9"/></svg></div>
```

### Plot only

The SVG on its own, for use inside another card.

```html
<div style="width:327px"><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Treemap: five tiles, each sized by its share of the whole" data-chart="treemap" data-size="Medium" data-h="200" data-w="327"><rect x="0" y="0" width="178.4" height="118.5" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.9"/><rect x="0" y="121.5" width="178.4" height="78.5" rx="4" style="fill:var(--ns-chart-series-3);fill-opacity:0.9"/><rect x="181.4" y="0" width="145.6" height="77.6" rx="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.9"/><rect x="181.4" y="80.6" width="145.6" height="67.9" rx="4" style="fill:var(--ns-chart-series-4);fill-opacity:0.9"/><rect x="181.4" y="151.5" width="145.6" height="48.5" rx="4" style="fill:var(--ns-chart-series-5);fill-opacity:0.9"/></svg></div>
```

Tokens: `--ns-chart-series-1` (Tile 1 (alias of viz/1)), `--ns-chart-series-2` (Tile 2 (alias of viz/4)), `--ns-chart-series-3` (Tile 3 (alias of viz/2)), `--ns-chart-series-4` (Tile 4 (alias of viz/7)), `--ns-chart-series-5` (Tile 5 (alias of widget/muted)), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Props (for a component wrapper):
- size: 'small' | 'vertical-small' | 'medium' | 'large' | 'xl', default 'medium'. Layout and plot size
- title: string, default -. Header title
- value: string, default -. Headline figure
- trend: string, default -. Signed change, for example +2.4%
- data: { label: string, value: number }[], default []. Values become areas, largest first
- showIcon: boolean, default false. Icon in the header

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming the tiles and their shares. Provide a table nearby.
- Tiles are told apart by position and label, never by color alone.
- Trend text carries its sign, so the color is a second signal.

