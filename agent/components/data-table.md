# Data table (Stable)

> NorthStar component. Category: Data. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Data tables organize large sets of records into rows and columns with sorting, selection, and batch actions. Includes bulk action bar.

Page: https://mikelrosenthal.com/northstar/#/components/data-table · Figma node 4213:46

Classes: `ns-btn`, `ns-btn--danger`, `ns-btn--ghost`, `ns-btn--sm`, `ns-btn--tertiary`, `ns-bulkbar`, `ns-bulkbar__count`, `ns-bulkbar__sep`, `ns-check`, `ns-dot`, `ns-dot--error`, `ns-dot--success`, `ns-dot--warning`, `ns-helper`, `ns-sort`, `ns-table`, `ns-table--compact`, `ns-table-bar`, `ns-table-wrap` · helper classes in the examples: `num`

Figma variants: Bulk action bar / Count: Text, such as 3 selected; Bulk action bar / Actions: Up to four buttons. Extras move into a Menu; Bulk action bar / State: Hidden, Visible

Use:
- Comparing many records across the same attributes.
- Bulk actions across selected rows.
- Bulk action bar: Show it when at least one row is selected.
- Bulk action bar: Keep the count visible, and announce it when it changes.
- Bulk action bar: Put destructive actions last, and confirm them.

Avoid:
- A handful of items with rich content: use cards.
- Bulk action bar: Do not show more than four actions. Move extras into a Menu.
- Bulk action bar: Do not hide the selection after an action. Show a Toast with the result.
- Bulk action bar: Do not cover the last table row. Add bottom padding to the table.

- Do: Right-align numbers so magnitudes line up.
- Do not: Center numeric columns.

```html
<div class="ns-table-wrap" style="width:100%"><div class="ns-table-bar"><b data-batch-label data-default="Accounts">Accounts</b><div style="display:flex;gap:8px"><button class="ns-btn ns-btn--sm ns-btn--tertiary">Export</button><button class="ns-btn ns-btn--sm">Add account</button></div></div>
<table class="ns-table  ">
  <thead><tr><th><label class="ns-check"><input type="checkbox" data-select-all aria-label="Select all rows"/></label></th><th data-sort>Account <span class="ns-sort">↕</span></th><th data-sort>Tier <span class="ns-sort">↕</span></th><th data-sort class="num">Revenue <span class="ns-sort">↕</span></th><th>Status</th></tr></thead>
  <tbody><tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Acme Corp"/></label></td><td>Acme Corp</td><td>Gold</td><td class="num">$12,400</td><td><span class="ns-dot ns-dot--success">active</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Beta LLC"/></label></td><td>Beta LLC</td><td>Silver</td><td class="num">$5,200</td><td><span class="ns-dot ns-dot--warning">pending</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Zeta Inc"/></label></td><td>Zeta Inc</td><td>Platinum</td><td class="num">$38,900</td><td><span class="ns-dot ns-dot--success">active</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Northwind"/></label></td><td>Northwind</td><td>Silver</td><td class="num">$7,300</td><td><span class="ns-dot ns-dot--error">error</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Globex"/></label></td><td>Globex</td><td>Gold</td><td class="num">$19,850</td><td><span class="ns-dot ns-dot--success">active</span></td></tr></tbody>
</table></div>
<div class="ns-bulkbar" role="region" aria-label="Bulk actions"><span class="ns-bulkbar__count" aria-live="polite">3 selected</span><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Approve</button><button class="ns-btn ns-btn--ghost ns-btn--sm">Export</button><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Clear</button><button class="ns-btn ns-btn--danger ns-btn--sm">Delete</button></div>
```

## Variants

### Simple table

No toolbar or selection.

```html
<div class="ns-table-wrap" style="width:100%">
<table class="ns-table ns-table--compact ">
  <thead><tr><th data-sort>Account <span class="ns-sort">↕</span></th><th data-sort>Tier <span class="ns-sort">↕</span></th><th data-sort class="num">Revenue <span class="ns-sort">↕</span></th><th>Status</th></tr></thead>
  <tbody><tr><td>Acme Corp</td><td>Gold</td><td class="num">$12,400</td><td><span class="ns-dot ns-dot--success">active</span></td></tr><tr><td>Beta LLC</td><td>Silver</td><td class="num">$5,200</td><td><span class="ns-dot ns-dot--warning">pending</span></td></tr><tr><td>Zeta Inc</td><td>Platinum</td><td class="num">$38,900</td><td><span class="ns-dot ns-dot--success">active</span></td></tr><tr><td>Northwind</td><td>Silver</td><td class="num">$7,300</td><td><span class="ns-dot ns-dot--error">error</span></td></tr><tr><td>Globex</td><td>Gold</td><td class="num">$19,850</td><td><span class="ns-dot ns-dot--success">active</span></td></tr></tbody>
</table></div>
```

### Bulk action bar: Default

Count, three actions and a clear control.

```html
<div class="ns-bulkbar" role="region" aria-label="Bulk actions"><span class="ns-bulkbar__count">3 selected</span><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Approve</button><button class="ns-btn ns-btn--ghost ns-btn--sm">Export</button><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Clear</button></div>
```

### Bulk action bar: Destructive

Adds a danger action after the neutral ones.

```html
<div class="ns-bulkbar" role="region" aria-label="Bulk actions"><span class="ns-bulkbar__count">3 selected</span><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Approve</button><button class="ns-btn ns-btn--danger ns-btn--sm">Delete</button></div>
```

Tokens: `--ns-background-secondary` (Header row), `--ns-background-hover` (Row hover), `--ns-background-selected` (Selected row), `--ns-interactive-primary` (Batch action bar), `--ns-font-mono` (Numeric cells), `--ns-background-elevated` (Bar surface), `--ns-elevation-03` (Bar shadow), `--ns-border-default` (Bar border), `--ns-density-control-sm` (Button height)

Props (for a component wrapper):
- rows: Row[], default []. Data
- headers: Header[], default []. Columns
- isSortable: boolean, default true. Sorting
- radio / selectable: boolean, default false. Selection
- size: 'compact' | 'default', default 'default'. Row height
- count (Bulk action bar): number, default 0. Selected rows. Announced politely
- actions (Bulk action bar): { label, onClick, destructive }[], default []. Up to four actions
- onClear (Bulk action bar): () => void, default -. Clears the selection

Keyboard: Tab: Moves between interactive cells; Enter / Space on header: Sorts the column; Space on row checkbox: Selects the row; Tab: Bulk action bar: Moves through the bar's actions; Escape: Bulk action bar: Clears the selection when focus is in the table

Accessibility:
- Sortable headers set aria-sort.
- Select-all checkbox is labeled and reflects mixed state.
- Batch bar announces the selected count.
- Bulk action bar: The bar is a named region, such as Bulk actions.
- Bulk action bar: The count sits in a polite live region, so changes are announced without interrupting.
- Bulk action bar: Each action is a button with its full label, such as Delete 3 accounts.

Notes for agents:
- Selected rows get is-selected on the tr. While rows are selected, the ns-table-bar gets is-batch (a solid --ns-interactive-primary bar with on-color text) and shows the count and the bulk actions. ns-bulkbar is the separate floating bar for selections that span pages.
- Header cells are uppercase overline text by default. Numeric columns use class num (right aligned, monospace).
- Status cells use ns-dot (--success, --warning, --error, --neutral).

