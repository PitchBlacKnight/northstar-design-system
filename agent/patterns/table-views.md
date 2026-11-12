# Table views

> NorthStar pattern. https://mikelrosenthal.com/northstar/#/patterns/table-views

How search, filters, batch actions, and pagination combine around a data table.

**Anatomy**

Example (Toolbar, table, pagination):
```html
<div style="display:grid;gap:12px;width:100%"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><div class="ns-search" style="flex:1;min-width:220px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input class="ns-input" placeholder="Search accounts" aria-label="Search accounts"></div><span class="ns-tag ns-tag--blue">Tier: Gold<button aria-label="Remove Tier: Gold">×</button></span><button class="ns-btn ns-btn--tertiary ns-btn--sm">Filters</button></div><div class="ns-table-wrap" style="width:100%"><div class="ns-table-bar"><b data-batch-label="" data-default="Accounts">Accounts</b><div style="display:flex;gap:8px"><button class="ns-btn ns-btn--sm ns-btn--tertiary">Export</button><button class="ns-btn ns-btn--sm">Add account</button></div></div>
<table class="ns-table  ">
  <thead><tr><th><label class="ns-check"><input type="checkbox" data-select-all="" aria-label="Select all rows"></label></th><th data-sort="">Account <span class="ns-sort">↕</span></th><th data-sort="">Tier <span class="ns-sort">↕</span></th><th data-sort="" class="num">Revenue <span class="ns-sort">↕</span></th><th>Status</th></tr></thead>
  <tbody><tr><td><label class="ns-check"><input type="checkbox" data-row-select="" aria-label="Select Acme Corp"></label></td><td>Acme Corp</td><td>Gold</td><td class="num">$12,400</td><td><span class="ns-dot ns-dot--success">active</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select="" aria-label="Select Beta LLC"></label></td><td>Beta LLC</td><td>Silver</td><td class="num">$5,200</td><td><span class="ns-dot ns-dot--warning">pending</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select="" aria-label="Select Zeta Inc"></label></td><td>Zeta Inc</td><td>Platinum</td><td class="num">$38,900</td><td><span class="ns-dot ns-dot--success">active</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select="" aria-label="Select Northwind"></label></td><td>Northwind</td><td>Silver</td><td class="num">$7,300</td><td><span class="ns-dot ns-dot--error">error</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select="" aria-label="Select Globex"></label></td><td>Globex</td><td>Gold</td><td class="num">$19,850</td><td><span class="ns-dot ns-dot--success">active</span></td></tr></tbody>
</table></div><nav class="ns-pagination" style="justify-content:flex-end"><button class="ns-page" disabled="">‹</button><button class="ns-page" aria-current="page">1</button><button class="ns-page">2</button><button class="ns-page">›</button></nav></div>
```

**Rules**

- Search and filters sit above the table; active filters show as dismissible tags.
- Selecting rows replaces the toolbar with a batch action bar.
- Keep the header row sticky for long tables.
