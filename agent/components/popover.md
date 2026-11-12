# Popover (Stable)

> NorthStar component. Category: Overlays. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Popovers show richer, interactive content anchored to a trigger, such as menus and quick filters.

Page: https://mikelrosenthal.com/northstar/#/components/popover · Figma node 4210:129

Classes: `ns-btn`, `ns-btn--tertiary`, `ns-helper`, `ns-menu`, `ns-popover`, `ns-popover__panel`

Use:
- Overflow menus, quick filters, small forms.

Avoid:
- Blocking decisions: use a modal.

- Do: Keep menus short and grouped.
- Do not: Hide your whole navigation in a popover.

```html
<div class="ns-popover"><button class="ns-btn ns-btn--tertiary" data-popover aria-haspopup="menu">Actions ▾</button><div class="ns-popover__panel" style="padding:4px"><ul class="ns-menu" role="menu"><li><button role="menuitem">Duplicate</button></li><li><button role="menuitem">Export CSV</button></li><li><button role="menuitem" style="color:var(--ns-status-error)">Archive</button></li></ul></div></div>
```

Tokens: `--ns-background-elevated` (Panel), `--ns-elevation-02` (Shadow), `--ns-radius-lg` (Radius)

Props (for a component wrapper):
- open: boolean, default false. Visibility
- align: string, default 'bottom-start'. Placement

Keyboard: Enter / Space: Open; Arrow keys: Move between items; Esc: Close and return focus

Accessibility:
- Trigger has aria-haspopup and aria-expanded; menus use role="menu".

