# Text input (Stable)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Text inputs enable the user to interact with and input content and data. This component can be used for long and short form entries. Includes search.

Page: https://mikelrosenthal.com/northstar/#/components/text-input · Figma node 1846:24421

Classes: `is-error`, `is-focus`, `is-warning`, `ns-field`, `ns-helper`, `ns-input`, `ns-input--lg`, `ns-input--md`, `ns-input--sm`, `ns-label`, `ns-search`, `ns-textarea` · helper classes in the examples: `hdr__search`, `label`

Figma variants: Size: Small (32), Medium (36), Large (48); State: Default, Focus, Error, Warning, Disabled

Use:
- Collect short free-form text such as names, IDs, and hostnames.
- Use helper text to set format expectations before an error happens.
- Search: Large collections where browsing is slow.
- Search: Filtering a table or list in place.

Avoid:
- Long text: use a textarea.
- A fixed set of values: use a dropdown or radio group.
- Search: Fewer than ~10 items: show them all.

- Do: Keep a visible label above the field at all times.
- Do not: Rely on placeholder text as the only label. It disappears on input.

```html
<div class="ns-field" style="width:220px"><label class="ns-label" for="ti-1">Cluster name</label><input class="ns-input ns-input--md" id="ti-1" placeholder="Placeholder" aria-describedby="ti-1-h"/><span class="ns-helper" id="ti-1-h">Lowercase, 3 to 24 characters.</span></div>
<div class="ns-search" role="search" style="width:360px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input class="ns-input" type="search" placeholder="Search accounts, nodes, tickets" aria-label="Search"/><kbd>/</kbd></div>
```

## Variants

### States

Default, Focus, Error, Warning, Disabled.

```html
<div class="ns-field" style="width:180px"><input class="ns-input ns-input--md" aria-label="Default" placeholder="Default"/></div><div class="ns-field" style="width:180px"><input class="ns-input ns-input--md is-focus" aria-label="Focus" placeholder="Focus"/></div><div class="ns-field is-error" style="width:180px"><input class="ns-input ns-input--md" aria-label="Error" placeholder="Error"/></div><div class="ns-field is-warning" style="width:180px"><input class="ns-input ns-input--md" aria-label="Warning" placeholder="Warning"/></div><div class="ns-field" style="width:180px"><input class="ns-input ns-input--md" aria-label="Disabled" placeholder="Disabled" disabled/></div>
```

### Sizes

32, 36, 48.

```html
<input class="ns-input ns-input--sm" style="width:220px" placeholder="Small" aria-label="Small"/><input class="ns-input ns-input--md" style="width:220px" placeholder="Medium" aria-label="Medium"/><input class="ns-input ns-input--lg" style="width:220px" placeholder="Large" aria-label="Large"/>
```

### Textarea

Multi-line text.

```html
<div class="ns-field" style="width:260px"><label class="ns-label">Notes</label><textarea class="ns-textarea">Rotating keys on Friday.</textarea></div>
```

### Search: Global

Opens a command palette. Try ⌘K on this site.

```html
<button class="hdr__search" style="min-width:min(260px, 100%);max-width:100%;box-sizing:border-box" data-open-search><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span class="label">Search docs</span><kbd>⌘K</kbd></button>
```

Tokens: `--ns-field-bg` (Field fill (no border at rest)), `--ns-focus-field` (Focus border + 3px glow (blue/700)), `--ns-status-error` (Error border and placeholder), `--ns-status-warning` (Warning border and placeholder), `--ns-radius-sm` (Corner radius), `--ns-radius-full` (Pill shape), `--ns-text-tertiary` (Icon), `--ns-focus-ring` (Focus)

Props (for a component wrapper):
- label: string, default -. Visible label (required)
- size: 's' | 'm' | 'l', default 'm'. Height
- state: 'default' | 'error' | 'warning', default 'default'. Validation
- helperText: string, default -. Guidance under the field
- disabled: boolean, default false. Disable
- placeholder (Search): string, default -. Hint
- size (Search): 'sm' | 'md' | 'lg', default 'md'. Height
- onSearch (Search): (q) => void, default -. Handler

Keyboard: Tab: Moves focus into the field; Esc: Clears the field when a clear button is present; / or ⌘K: Search: Open global search; Esc: Search: Clear or close; Arrow keys + Enter: Search: Pick a result

Accessibility:
- Link helper and error text with aria-describedby.
- Set aria-invalid="true" on error.
- Never remove the visible label. Placeholders are not labels.
- Search: Wrap in role="search" and give the input an aria-label.
- Search: Announce result counts in a polite live region.

