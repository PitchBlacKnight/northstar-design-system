# Combobox (New)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

A filterable multi-select for long lists. Typing filters the options, Enter toggles the active option, and chosen values stay visible as removable tags. Use it when the list is longer than about ten items.

Page: https://mikelrosenthal.com/northstar/#/components/combobox · Figma node 4466:34

Classes: `is-open`, `ns-combobox`, `ns-combobox__control`, `ns-combobox__count`, `ns-combobox__list`, `ns-helper`, `ns-menu`, `ns-menu--panel`, `ns-tag`, `ns-tag--sm`

Figma variants: State: Default, Focus, Open, Disabled; Selection: Zero, one or many tags

Use:
- Use for lists longer than about ten items.
- Show the match count while the user filters.
- Keep chosen values visible as removable tags.

Avoid:
- Do not use for two to six options. Use Checkbox or Radio.
- Do not clear the query after each pick.
- Do not use for a single choice from a short list. Use Select.

- Do: Filters as you type, keeps picks as tags, and shows the match count.
- Do not: Two options are better as Radio buttons or a Toggle.

```html
<div class="ns-combobox" style="width:340px"><div class="ns-combobox__control"><span class="ns-tag ns-tag--sm">Analytics <button type="button" aria-label="Remove Analytics">×</button></span><input role="combobox" aria-expanded="false" aria-label="Add tag" placeholder="Add tag"/></div><div class="ns-menu ns-menu--panel ns-combobox__list" role="listbox" aria-multiselectable="true" aria-label="Tags"><button type="button" tabindex="-1" role="option" aria-selected="true">Analytics</button><button type="button" tabindex="-1" role="option" aria-selected="false">Billing</button><button type="button" tabindex="-1" role="option" aria-selected="false">Compliance</button><button type="button" tabindex="-1" role="option" aria-selected="false">Customer success</button><button type="button" tabindex="-1" role="option" aria-selected="false">Data export</button><button type="button" tabindex="-1" role="option" aria-selected="false">Finance</button><button type="button" tabindex="-1" role="option" aria-selected="false">Onboarding</button><button type="button" tabindex="-1" role="option" aria-selected="false">Reporting</button><button type="button" tabindex="-1" role="option" aria-selected="false">Security</button><button type="button" tabindex="-1" role="option" aria-selected="false">Support</button><span class="ns-helper ns-combobox__count">10 of 10 match</span></div></div>
```

## Variants

### Empty

Placeholder text with nothing chosen.

```html
<div class="ns-combobox" style="width:340px"><div class="ns-combobox__control"><input role="combobox" aria-expanded="false" aria-label="Add tag" placeholder="Add tag"/></div></div>
```

### With picks

Tags for chosen values, and the filtered list with its count.

```html
<div class="ns-combobox is-open" style="width:340px"><div class="ns-combobox__control"><span class="ns-tag ns-tag--sm">Reporting <button type="button" aria-label="Remove Reporting">×</button></span><input role="combobox" aria-expanded="true" aria-label="Add tag" value="an"/></div><div class="ns-menu ns-menu--panel ns-combobox__list" role="listbox" aria-multiselectable="true" aria-label="Tags"><button type="button" tabindex="-1" role="option" aria-selected="false">Analytics</button><button type="button" tabindex="-1" role="option" aria-selected="false">Billing</button><button type="button" tabindex="-1" role="option" aria-selected="false">Compliance</button><button type="button" tabindex="-1" role="option" aria-selected="false">Customer success</button><button type="button" tabindex="-1" role="option" aria-selected="false">Data export</button><button type="button" tabindex="-1" role="option" aria-selected="false">Finance</button><button type="button" tabindex="-1" role="option" aria-selected="false">Onboarding</button><button type="button" tabindex="-1" role="option" aria-selected="true">Reporting</button><button type="button" tabindex="-1" role="option" aria-selected="false">Security</button><button type="button" tabindex="-1" role="option" aria-selected="false">Support</button><span class="ns-helper ns-combobox__count">3 of 10 match</span></div></div>
```

Tokens: `--ns-border-default` (Control border), `--ns-focus-field` (Focus ring), `--ns-background-elevated` (List surface), `--ns-background-selected` (Selected option)

Props (for a component wrapper):
- options: { value, label }[], default []. Full list, filtered by the query
- value: string[], default []. Picked values, shown as tags
- onChange: (value[]) => void, default -. Called on every pick or removal
- placeholder: string, default -. Shown when nothing is chosen

Keyboard: Arrow up / down: Moves the active option; Enter: Toggles the active option; Backspace: On an empty query, removes the last tag; Escape: Closes the list and keeps the query

Accessibility:
- The input has role=combobox, aria-expanded, and aria-controls pointing at the list.
- The list has role=listbox with aria-multiselectable=true, and each option has aria-selected.
- Announce the match count in a polite live region as the query changes.

