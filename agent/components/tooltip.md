# Tooltip (Stable)

> NorthStar component. Category: Overlays. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Tooltips show contextual help or information about specific components when a user hovers or focuses on them.

Page: https://mikelrosenthal.com/northstar/#/components/tooltip · Figma node 1846:24506

Classes: `ns-btn`, `ns-btn--icon`, `ns-btn--outline`, `ns-helper`, `ns-tip`, `ns-tip__bubble`, `ns-tooltip`

Figma variants: Placement: N, NW, NE, S, E, W; Icon: Yes, No

Use:
- Labeling icon-only buttons.
- Brief definitions of terms.

Avoid:
- Essential info or anything interactive: use a popover.

- Do: Keep it to a few words.
- Do not: Put interactive content in a tooltip.

```html
<span class="ns-tooltip" role="tooltip" data-place="nw"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>This is a tooltip on the North West side</span>
```

## Variants

### Live hover

Hover or focus the button.

```html
<span class="ns-tip"><button class="ns-btn ns-btn--outline ns-btn--icon" aria-describedby="tt-1" aria-label="Refresh">↻</button><span class="ns-tip__bubble" role="tooltip" id="tt-1">Refresh telemetry</span></span>
```

Tokens: `--ns-background-inverse` (Bubble), `--ns-text-inverse` (Text), `--ns-radius-sm` (Radius)

Props (for a component wrapper):
- label: string, default -. Text
- placement: 'n' | 'nw' | 'ne' | 's' | 'e' | 'w', default 'n'. Placement
- icon: boolean, default false. Leading info icon

Keyboard: Tab: Focusing the trigger shows the tooltip; Esc: Dismisses

Accessibility:
- Trigger references the bubble with aria-describedby; bubble has role="tooltip".

