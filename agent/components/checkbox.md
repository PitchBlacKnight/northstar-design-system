# Checkbox (Stable)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Checkboxes select one or more options from a list, or toggle a single setting that applies on submit.

Page: https://mikelrosenthal.com/northstar/#/components/checkbox · Figma node 1841:21803

Classes: `ns-check`, `ns-label`

Use:
- Select several options from a list.
- Confirm a single agreement or setting that applies on submit.

Avoid:
- Choose exactly one option: use radio buttons.
- Settings that apply instantly: use a toggle.

- Do: Stack options vertically for easy scanning.
- Do not: Write negative or double-negative labels.

```html
<fieldset style="border:0;padding:0;margin:0;display:grid;gap:10px"><legend class="ns-label" style="margin-bottom:10px">Alert channels</legend><label class="ns-check"><input type="checkbox" checked/> Email</label><label class="ns-check"><input type="checkbox"/> Slack</label><label class="ns-check"><input type="checkbox" checked/> PagerDuty</label></fieldset>
```

## Variants

### Checked / unchecked

Standard.

```html
<label class="ns-check"><input type="checkbox" checked/> Checked</label><label class="ns-check"><input type="checkbox"/> Unchecked</label>
```

### Indeterminate

Parent of a partially selected group.

```html
<label class="ns-check"><input type="checkbox" data-indet/> Partial</label>
```

Tokens: `--ns-interactive-primary` (Checked fill), `--ns-border-strong` (Unchecked border), `--ns-focus-ring` (Focus), `--ns-radius-xs` (Box radius)

Props (for a component wrapper):
- checked: boolean, default false. Selected
- indeterminate: boolean, default false. Partial state
- labelText: string, default -. Label
- disabled: boolean, default false. Disable

Keyboard: Tab: Moves between checkboxes; Space: Toggles the focused checkbox

Accessibility:
- Wrap groups in <fieldset> with a <legend>.
- Indeterminate is set via the DOM property, exposed as aria-checked="mixed".

