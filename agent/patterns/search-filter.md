# Search and filter

> NorthStar pattern. https://mikelrosenthal.com/northstar/#/patterns/search-filter

Search narrows by keyword; filters narrow by attribute. Show both states clearly and make them easy to undo.

**Filter chips**

Example (Example):
```html
<div style="display:flex;gap:8px;flex-wrap:wrap"><span class="ns-tag ns-tag--blue">Region: EU<button aria-label="Remove Region: EU">×</button></span><span class="ns-tag ns-tag--blue">Status: Active<button aria-label="Remove Status: Active">×</button></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Clear all</button></div>
```

**Rules**

- Filter results live as people choose; do not require an Apply button for fewer than 5 filters.
- Show a result count after every change, announced in a live region.
- Global search lives in the header and opens with ⌘K or /.
