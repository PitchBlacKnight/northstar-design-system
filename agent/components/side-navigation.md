# Side navigation (Stable)

> NorthStar component. Category: Navigation. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Side navigation is the primary way to move through an app, with collapsible groups for large information spaces.

Page: https://mikelrosenthal.com/northstar/#/components/side-navigation · Figma node 4212:37

Classes: `ns-count`, `ns-helper`, `ns-sidenav`, `ns-sidenav__group` · helper classes in the examples: `brand`, `brand__dot`

Use:
- Apps with five or more top-level destinations.

Avoid:
- Two or three destinations: use tabs or header links.

- Do: Group items by task.
- Do not: Use vague group names.

```html
<nav class="ns-sidenav" aria-label="App"><div class="brand" style="padding:6px 12px 10px"><span class="brand__dot"></span>NORTHSTAR</div><div class="ns-sidenav__group">Operate</div><a href="#/" aria-current="page">Dashboard</a><a href="#/">Accounts <span class="ns-count">3</span></a><a href="#/">Approvals</a><div class="ns-sidenav__group">Configure</div><a href="#/">Integrations</a><a href="#/">Access</a><a href="#/">Settings</a></nav>
```

Tokens: `--ns-background-shell` (Rail), `--ns-background-selected` (Current item), `--ns-text-accent` (Current label)

Props (for a component wrapper):
- items: NavItem[], default []. Tree
- expanded: boolean, default true. Rail state

Keyboard: Tab: Moves through links; Enter: Opens link or toggles group

Accessibility:
- Use <nav> with a label; current link sets aria-current="page".

