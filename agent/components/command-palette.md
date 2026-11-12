# Command palette (New)

> NorthStar component. Category: Navigation. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

A global launcher for finding records, pages and actions. Open it with Cmd K or Ctrl K. Results group by type, and the active row follows the keyboard.

Page: https://mikelrosenthal.com/northstar/#/components/command-palette · Figma node 4466:359

Classes: `ns-cmdk`, `ns-cmdk__foot`, `ns-cmdk__group`, `ns-cmdk__item`, `ns-cmdk__list`, `ns-cmdk__meta`, `ns-cmdk__query`

Figma variants: Result: Label, meta, icon, shortcut; Group: Up to four groups; State: Empty query, Results, Active row

Use:
- Finding records, pages and actions across the product.
- Showing recent items before the person types.
- Keeping each result to one line.

Avoid:
- Do not make it the only way to reach a feature.
- Do not open it when a page search field gets focus.
- Do not show more than four groups.

- Do: Results grouped by type, with a meta label on each row.
- Do not: Mixed results with no group or type label leave people guessing what each row opens.

```html
<div class="ns-cmdk" role="dialog" aria-label="Command palette"><div class="ns-cmdk__query"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-label="Search" placeholder="Search accounts, pages and actions" value=""/><kbd>Esc</kbd></div><div class="ns-cmdk__list" id="cmdk-list" role="listbox"><div class="ns-cmdk__group" role="presentation">Accounts</div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Acme Corp</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Acme Holdings</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Globex</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Northwind</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__group" role="presentation">Pages</div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Billing history</span><span class="ns-cmdk__meta">Page</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Usage reports</span><span class="ns-cmdk__meta">Page</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Team settings</span><span class="ns-cmdk__meta">Page</span></div><div class="ns-cmdk__group" role="presentation">Actions</div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Create account</span><span class="ns-cmdk__meta">Action</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Invite teammate</span><span class="ns-cmdk__meta">Action</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Export accounts</span><span class="ns-cmdk__meta">Action</span></div></div><div class="ns-cmdk__foot"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>Esc</kbd> Close</span></div></div>
```

## Variants

### Recent

What people see before they type.

```html
<div class="ns-cmdk" role="dialog" aria-label="Command palette"><div class="ns-cmdk__query"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input role="combobox" aria-expanded="true" aria-label="Search" placeholder="Search accounts, pages and actions"/></div><div class="ns-cmdk__list" role="listbox"><div class="ns-cmdk__group">Recent</div><div class="ns-cmdk__item" role="option" aria-selected="true"><span>Acme Corp</span><span class="ns-cmdk__meta">Account</span></div></div></div>
```

### Results

Grouped by type, with the active row highlighted.

```html
<div class="ns-cmdk" role="dialog" aria-label="Command palette"><div class="ns-cmdk__query"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input role="combobox" aria-expanded="true" aria-label="Search" value="acme"/></div><div class="ns-cmdk__list" role="listbox"><div class="ns-cmdk__group">Accounts</div><div class="ns-cmdk__item" role="option" aria-selected="true"><span><mark>Acme</mark> Corp</span><span class="ns-cmdk__meta">Account</span></div></div></div>
```

Tokens: `--ns-background-elevated` (Palette surface), `--ns-elevation-04` (Palette shadow), `--ns-background-selected` (Active row), `--ns-text-accent` (Matched text)

Props (for a component wrapper):
- items: { id, label, group, meta, icon, shortcut }[], default []. Results, grouped
- query: string, default ''. Controlled query
- onSelect: (id) => void, default -. Called with the chosen result
- open: boolean, default false. Shows or hides the palette

Keyboard: Cmd K / Ctrl K: Opens the palette from anywhere; Arrow up / down: Moves the active row; Enter: Opens the active result; Escape: Closes the palette and returns focus to the previous element

Accessibility:
- The palette is a dialog with a name. The input is a combobox that points at the list with aria-controls.
- Results form a listbox, and the active row is set with aria-activedescendant.
- Announce the result count in a polite live region as the query changes.

