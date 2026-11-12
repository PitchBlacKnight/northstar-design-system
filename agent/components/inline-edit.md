# Inline edit (New)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Edit one field in place on a detail page. Enter or the check saves, Escape cancels, and a failed save keeps the typed value and shows a Toast.

Page: https://mikelrosenthal.com/northstar/#/components/inline-edit · Figma node 4466:54

Classes: `is-editing`, `ns-field`, `ns-inline-edit`, `ns-inline-edit__btn`, `ns-inline-edit__input`, `ns-input`, `ns-label`

Figma variants: State: Read, Hover, Editing, Saving

Use:
- Use on detail pages for single fields that change often.
- Save one field at a time.
- Show the value as plain text until it is hovered or focused.

Avoid:
- Do not use for fields with dependencies. Use a form.
- Do not use inline edit in tables with sorting active.
- Do not hide that the field is editable. Show the pencil on hover and focus.

- Do: Edit one field at a time, and show the saved state.
- Do not: Dependent fields such as address parts belong in a form that saves together.

```html
<div style="width:280px"><span class="ns-label">Account manager</span><div class="ns-inline-edit" tabindex="0" role="button" aria-label="Edit account manager">Sara Kim</div></div>
```

## Variants

### Read

Plain text with a pencil on hover and focus.

```html
<div style="width:280px"><span class="ns-label">Account manager</span><div class="ns-inline-edit" tabindex="0" role="button" aria-label="Edit account manager">Sara Kim</div></div>
```

### Editing

A labeled input with Save and Cancel.

```html
<div style="width:280px"><span class="ns-label">Account manager</span><div class="ns-inline-edit is-editing"><input class="ns-inline-edit__input" value="Sara Kim" aria-label="Account manager"/><button class="ns-inline-edit__btn" aria-label="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></button><button class="ns-inline-edit__btn" aria-label="Cancel"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div></div>
```

Tokens: `--ns-background-hover` (Hover surface), `--ns-focus-field` (Editing border), `--ns-text-primary` (Value text), `--ns-text-tertiary` (Pencil icon)

Props (for a component wrapper):
- value: string, default -. Current value
- onSave: (value) => Promise, default -. Resolves on success. Rejects to keep editing
- state: 'read' | 'editing' | 'saving', default 'read'. Controlled state

Keyboard: Enter: Saves the value; Escape: Cancels and restores the value; Tab: Moves to the next editable field

Accessibility:
- The read state is a button with an aria-label that names the field, such as Edit account manager.
- Editing uses a labeled input and two named buttons, Save and Cancel.
- Announce the save result in a polite live region.

