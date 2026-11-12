# Breadcrumb (Stable)

> NorthStar component. Category: Navigation. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Breadcrumbs show where the current page sits in the hierarchy and let people move up levels.

Page: https://mikelrosenthal.com/northstar/#/components/breadcrumb · Figma node 4208:1020

Classes: `ns-breadcrumb`

Use:
- Hierarchies three or more levels deep.

Avoid:
- Flat sites or single-level apps.

- Do: End with the current page, not a link.
- Do not: Show a breadcrumb with one item.

```html
<nav aria-label="Breadcrumb"><ol class="ns-breadcrumb"><li><a href="#/">Accounts</a></li><li><a href="#/">Acme Corp</a></li><li><a href="#/">Integrations</a></li><li aria-current="page">CRM sync</li></ol></nav>
```

Tokens: `--ns-text-link` (Links), `--ns-text-disabled` (Separator)

Props (for a component wrapper):
- items: {label, href}[], default []. Trail
- noTrailingSlash: boolean, default true. Separator after last

Keyboard: Tab: Moves between links

Accessibility:
- Wrap in <nav aria-label="Breadcrumb">; mark the last item aria-current="page".

