# Tag (Stable)

> NorthStar component. Category: Status. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Tags allow users to categorize content. They can represent keywords or people, and are grouped to describe an item or a search request.

Page: https://mikelrosenthal.com/northstar/#/components/tag · Figma node 1840:22808

Classes: `ns-tag`, `ns-tag--blue`, `ns-tag--ghost`, `ns-tag--green`, `ns-tag--purple`, `ns-tag--red`, `ns-tag--sm`, `ns-tag--square`, `ns-tag--teal`, `ns-tag--yellow`, `ns-tag__ind`

Figma variants: Size: Medium (36), Small (28); Emphasis: Primary, Ghost; Shape: Rounded, Square; State: Informer & icon, Informer, Text, Icon

Use:
- Label metadata like environment, team, or tier.
- Show active filters that can be removed (icon as x-close).

Avoid:
- System status like Active or Failed: use a badge.

- Do: Keep labels to one or two words.
- Do not: Put sentences in tags.

```html
<span class="ns-tag"><span class="ns-tag__ind"></span>Training <b>$650</b><button aria-label="More actions">⋮</button></span>
```

## Variants

### States

Informer & icon, Informer, Text, Icon.

```html
<span class="ns-tag"><span class="ns-tag__ind"></span>Training <b>$650</b><button aria-label="More">⋮</button></span><span class="ns-tag"><span class="ns-tag__ind"></span>Training <b>$650</b></span><span class="ns-tag"><span class="ns-tag__ind"></span>Training</span><span class="ns-tag"><span class="ns-tag__ind"></span>Training<button aria-label="More">⋮</button></span>
```

### Emphasis and shape

Primary or Ghost; Rounded or Square.

```html
<span class="ns-tag"><span class="ns-tag__ind"></span>Primary</span><span class="ns-tag ns-tag--ghost"><span class="ns-tag__ind"></span>Ghost</span><span class="ns-tag ns-tag--square"><span class="ns-tag__ind"></span>Square</span><span class="ns-tag ns-tag--ghost ns-tag--square ns-tag--sm"><span class="ns-tag__ind"></span>Small</span>
```

### Filter

Dismissible.

```html
<span class="ns-tag ns-tag--sm"><span class="ns-tag__ind" style="--_c:var(--ns-status-info)"></span>Region: EU<button aria-label="Remove Region: EU">×</button></span><span class="ns-tag ns-tag--sm"><span class="ns-tag__ind" style="--_c:var(--ns-status-warning)"></span>Tier: Gold<button aria-label="Remove Tier: Gold">×</button></span>
```

### Color chips

Categorical chips for docs and dense tables.

```html
<span class="ns-tag ns-tag--teal">Teal</span><span class="ns-tag ns-tag--purple">Purple</span><span class="ns-tag ns-tag--blue">Blue</span><span class="ns-tag ns-tag--green">Green</span><span class="ns-tag ns-tag--yellow">Yellow</span><span class="ns-tag ns-tag--red">Red</span>
```

Tokens: `--ns-interactive-secondary-bg` (Primary fill), `--ns-border-strong` (Ghost border), `--ns-chart-series-1` (Indicator), `--ns-radius-full` (Rounded), `--ns-radius-sm` (Square)

Props (for a component wrapper):
- emphasis: 'primary' | 'ghost', default 'primary'. Fill or outline
- shape: 'rounded' | 'square', default 'rounded'. Radius
- size: 'm' | 's', default 'm'. Height
- indicator: color, default teal. Leading dot
- value: string, default -. Informer value
- onAction: () => void, default -. Trailing icon action

Keyboard: Tab: Focus the trailing action; Enter / Space: Run the action or remove the filter

Accessibility:
- Trailing buttons need a label that names the tag, e.g. aria-label="Remove Region: EU".
- The indicator color is never the only signal; the label carries meaning.

