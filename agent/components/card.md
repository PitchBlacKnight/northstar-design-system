# Card (Stable)

> NorthStar component. Category: Containers. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Cards group related content and actions about a single subject. Clickable cards navigate as a whole.

Page: https://mikelrosenthal.com/northstar/#/components/card · Figma node 4207:1138

Classes: `ns-btn`, `ns-btn--sm`, `ns-btn--tertiary`, `ns-card`, `ns-card__body`, `ns-card__title`, `ns-dot`, `ns-dot--success`, `ns-kpi`, `ns-kpi__delta`, `ns-kpi__label`, `ns-kpi__value`

Use:
- Collections of similar objects to scan and compare.
- Dashboard tiles with one job each.

Avoid:
- Dense tabular data: use a data table.

- Do: Keep one subject and one primary action per card.
- Do not: Pack many primary actions into one card.

```html
<div class="ns-card" style="width:320px"><h3 class="ns-card__title">Acme Corp</h3><p class="ns-card__body">Gold tier. 14 active integrations across 3 regions. Renewal in 42 days.</p><div style="display:flex;gap:8px"><span class="ns-dot ns-dot--success">Active</span></div><div><button class="ns-btn ns-btn--sm ns-btn--tertiary">View details</button></div></div>
```

## Variants

### KPI tile

Metric card for dashboards.

```html
<div class="ns-kpi" style="width:200px"><span class="ns-kpi__label">Active accounts</span><span class="ns-kpi__value">1,284</span><span class="ns-kpi__delta">↑ +6.2%</span></div>
```

Tokens: `--ns-background-surface` (Default fill), `--ns-background-elevated` (Elevated fill), `--ns-elevation-02` (Elevated shadow), `--ns-radius-lg` (Radius), `--ns-space-7` (Padding)

Props (for a component wrapper):
- kind: 'default' | 'elevated' | 'clickable', default 'default'. Style
- href: string, default -. Makes the card a link

Keyboard: Tab: Focus a clickable card; Enter: Open

Accessibility:
- A clickable card is one <a>. Do not nest other interactive elements inside it.

Notes for agents:
- An eyebrow above the title is a p with ns-card__eyebrow (uppercase overline, text-tertiary), matching the Figma Card Eyebrow property.

