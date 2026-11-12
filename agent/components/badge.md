# Badge (Stable)

> NorthStar component. Category: Status. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Badges are designed to display a small amount of information for statuses and labels with color categorization. Includes status dot.

Page: https://mikelrosenthal.com/northstar/#/components/badge · Figma node 1840:21692

Classes: `ns-badge`, `ns-badge--icon`, `ns-badge--lg`, `ns-badge--negative`, `ns-badge--outline`, `ns-badge--positive`, `ns-badge--sm`, `ns-count`, `ns-dot`, `ns-dot--error`, `ns-dot--success`, `ns-dot--warning`, `ns-status-dot`, `ns-status-dot--critical`, `ns-status-dot--informative`, `ns-status-dot--negative`, `ns-status-dot--neutral`, `ns-status-dot--positive`, `ns-table` · helper classes in the examples: `sr-only`

Figma variants: Size: Small (20), Medium (24), Large (28); Icon: Icon only, Icon left, Icon right, None; Type: Informative (violet), Positive (green), Negative (red); State: Solid, Outline with icon, Outline; Status dot / Status: Positive, Critical, Negative, Informative, Neutral; Status dot / Label: Shown or hidden

Use:
- Object status in tables, cards, and headers.
- Short labels with semantic meaning.
- Status dot: Dense tables and maps.
- Status dot: The same status words as Badge.
- Status dot: Keeping the label visible unless a header names the status.

Avoid:
- Categories and filters: use a tag.
- Status dot: Do not rely on color alone.
- Status dot: Do not use for counts. Use Badge.
- Status dot: Do not hide the label in a table with no header that names the status.

- Do: Pair color with a clear word.
- Do not: Use an empty colored badge to carry status.

```html
<span class="ns-badge">Live</span>
<span class="ns-status-dot ns-status-dot--positive">Active</span>
```

## Variants

### Types x state

Solid, outline with icon, outline.

```html
<span class="ns-badge">Label</span><span class="ns-badge ns-badge--outline">● Label</span><span class="ns-badge ns-badge--outline">Label</span><span class="ns-badge ns-badge--positive">Label</span><span class="ns-badge ns-badge--positive ns-badge--outline">● Label</span><span class="ns-badge ns-badge--positive ns-badge--outline">Label</span><span class="ns-badge ns-badge--negative">Label</span><span class="ns-badge ns-badge--negative ns-badge--outline">● Label</span><span class="ns-badge ns-badge--negative ns-badge--outline">Label</span>
```

### Sizes

20, 24, 28.

```html
<span class="ns-badge ns-badge--sm">Small</span><span class="ns-badge">Medium</span><span class="ns-badge ns-badge--lg">Large</span>
```

### Status dot

Table-friendly indicator.

```html
<span class="ns-dot ns-dot--success">Active</span><span class="ns-dot ns-dot--warning">Pending</span><span class="ns-dot ns-dot--error">Critical</span><span class="ns-dot">Info</span>
```

### Count

Numeric.

```html
<span style="display:inline-flex;gap:8px;align-items:center">Alerts <span class="ns-count">12</span></span>
```

### Status dot: All statuses

Five statuses with labels.

```html
<div style="display:flex;gap:16px;flex-wrap:wrap"><span class="ns-status-dot ns-status-dot--positive">Active</span><span class="ns-status-dot ns-status-dot--critical">At risk</span><span class="ns-status-dot ns-status-dot--negative">Down</span><span class="ns-status-dot ns-status-dot--informative">Provisioning</span><span class="ns-status-dot ns-status-dot--neutral">Inactive</span></div>
```

### Status dot: Label in a header

The column header names the status, so the visible label can go. The label stays for screen readers.

```html
<table class="ns-table" style="width:240px"><thead><tr><th>Status</th></tr></thead><tbody><tr><td><span class="ns-status-dot ns-status-dot--positive"><span class="sr-only">Active</span></span></td></tr><tr><td><span class="ns-status-dot ns-status-dot--negative"><span class="sr-only">Down</span></span></td></tr></tbody></table>
```

Tokens: `--ns-status-info` (Informative), `--ns-status-success` (Positive), `--ns-status-error` (Negative), `--ns-radius-sm` (Radius), `--ns-status-warning` (Critical dot)

Props (for a component wrapper):
- type: 'informative' | 'positive' | 'negative', default 'informative'. Semantic color
- variant: 'solid' | 'outline', default 'solid'. Fill
- size: 's' | 'm' | 'l', default 'm'. Height
- icon: ReactNode, default -. Optional icon
- status (Status dot): 'positive' | 'critical' | 'negative' | 'informative' | 'neutral', default 'neutral'. Color and meaning
- label (Status dot): string, default -. Visible text
- showLabel (Status dot): boolean, default true. When false, the label is kept for screen readers only

Keyboard: -: Not interactive

Accessibility:
- Badges are text, so screen readers read the label. Icon-only badges need role="img" and aria-label.
- Status dot: The label is text, so screen readers read it. A hidden label stays in the DOM as screen-reader-only text.
- Status dot: Do not use color alone to show status.

