# Pagination (Stable)

> NorthStar component. Category: Navigation. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Pagination splits long collections into pages with page size control and position feedback.

Page: https://mikelrosenthal.com/northstar/#/components/pagination · Figma node 4038:31293

Classes: `ns-helper`, `ns-page`, `ns-pagination`, `ns-select`

Use:
- Tables and lists over ~50 items.

Avoid:
- Feeds where infinite scroll fits better.

- Do: Show position and total.
- Do not: Hide how much content exists.

```html
<nav class="ns-pagination" aria-label="Pagination"><span style="margin-right:12px">Rows <select class="ns-select" style="width:72px;min-height:32px;display:inline-block"><option>25</option><option>50</option></select></span><button class="ns-page" disabled aria-label="Previous page">‹</button><button class="ns-page" aria-current="page">1</button><button class="ns-page">2</button><button class="ns-page">3</button><span>…</span><button class="ns-page">12</button><button class="ns-page" aria-label="Next page">›</button><span style="margin-left:12px">1-25 of 288</span></nav>
```

Tokens: `--ns-interactive-primary` (Current page), `--ns-background-hover` (Hover)

Props (for a component wrapper):
- page: number, default 1. Current
- pageSize: number, default 25. Rows per page
- totalItems: number, default -. Total

Keyboard: Tab: Moves across controls; Enter: Go to page

Accessibility:
- Wrap in <nav aria-label="Pagination">; current page uses aria-current="page".

