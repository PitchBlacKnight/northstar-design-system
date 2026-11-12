# Tabs (Stable)

> NorthStar component. Category: Navigation. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Use tabs to allow users to navigate easily between views within the same context.

Page: https://mikelrosenthal.com/northstar/#/components/tabs · Figma node 1842:24465

Classes: `ns-count`, `ns-tab`, `ns-tabs`, `ns-tabs--fill`

Figma variants: Icon: Without, With; Items: 2, 3, 4

Use:
- Two to four peer views of the same object.

Avoid:
- Sequential steps: use a progress indicator.
- Top-level navigation: use side navigation.

- Do: Use short, parallel nouns.
- Do not: Write long or action-style tab labels.

```html
<div class="ns-tabs ns-tabs--fill" role="tablist" style="width:375px"><button class="ns-tab" role="tab" aria-selected="true">Overview</button><button class="ns-tab" role="tab" aria-selected="false">Nodes</button><button class="ns-tab" role="tab" aria-selected="false">Access</button></div>
```

## Variants

### With count

Badges inside tabs.

```html
<div class="ns-tabs" role="tablist"><button class="ns-tab" role="tab" aria-selected="true">Overview</button><button class="ns-tab" role="tab" aria-selected="false">Nodes <span class="ns-count">4</span></button></div>
```

Tokens: `--ns-interactive-primary` (Selection indicator), `--ns-border-subtle` (Divider), `--ns-text-secondary` (Inactive label), `--ns-text-primary` (Selected label)

Props (for a component wrapper):
- items: {label, icon}[], default []. 2 to 4 tabs
- selectedIndex: number, default 0. Active tab
- onChange: (i) => void, default -. Handler

Keyboard: Arrow left / right: Move between tabs; Home / End: First / last tab; Tab: Moves into the panel

Accessibility:
- role="tablist", role="tab", aria-selected, and aria-controls pointing at each role="tabpanel".

Notes for agents:
- Give each tab an id and aria-controls, and each panel role=tabpanel, the matching id, aria-labelledby and hidden when not selected. js/ns-behavior.js switches tabs on click and with arrows, Home and End. See agent/templates/object-detail.html.

