# Divider (Stable)

> NorthStar component. Category: Containers. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Dividers separate groups of content horizontally, vertically, or with a label.

Page: https://mikelrosenthal.com/northstar/#/components/divider · Figma node 4205:883

Classes: `ns-divider`, `ns-helper`

Use:
- Separating groups when spacing alone is not enough.

Avoid:
- Between every list item: use spacing.

- Do: Try whitespace first.
- Do not: Overuse dividers.

```html
<div style="max-width:480px;margin:0 auto"><p style="margin:0">Section one</p><hr class="ns-divider"/><p style="margin:0">Section two</p></div>
```

Tokens: `--ns-border-subtle` (Line), `--ns-space-5` (Margin)

Props (for a component wrapper):
- orientation: 'horizontal' | 'vertical', default 'horizontal'. Direction

Keyboard: -: Not interactive

Accessibility:
- Use <hr> for semantic breaks; purely visual lines can be CSS borders.

