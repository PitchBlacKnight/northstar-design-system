# Radio button (Stable)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Radio buttons allow users to select a single option from a list of mutually exclusive options. All possible options are exposed up front for users to compare.

Page: https://mikelrosenthal.com/northstar/#/components/radio-button · Figma node 1842:24303

Classes: `ns-check`, `ns-check--radio`, `ns-label`

Figma variants: State: Default, Hover, Disabled; Selected: Yes, No; Show label: Boolean, on by default (off: 16x16)

Use:
- Two to five mutually exclusive options that benefit from being visible together.

Avoid:
- More than five options: use a dropdown.
- Multiple choices: use checkboxes.

- Do: Preselect the safest or most common option.
- Do not: Use a radio button without a label.

```html
<fieldset style="border:0;padding:0;margin:0"><legend class="ns-label" style="margin-bottom:10px">Deployment strategy</legend><div style="display:flex;gap:12px;flex-direction:column;flex-wrap:wrap"><label class="ns-check ns-check--radio"><input type="radio" name="rb" checked/> Rolling</label><label class="ns-check ns-check--radio"><input type="radio" name="rb"/> Blue / green</label><label class="ns-check ns-check--radio"><input type="radio" name="rb"/> Canary</label></div></fieldset>
```

## Variants

### States

Selected, unselected, disabled.

```html
<label class="ns-check ns-check--radio"><input type="radio" name="v1" checked/> Selected</label><label class="ns-check ns-check--radio"><input type="radio" name="v1"/> Not selected</label><label class="ns-check ns-check--radio"><input type="radio" disabled checked/> Disabled</label>
```

Tokens: `--ns-interactive-primary` (Selected ring (blue/500)), `--ns-interactive-primary-hover` (Selected + hover ring), `--ns-border-strong` (Unselected ring), `--ns-text-secondary` (Label (white + semibold on hover))

Props (for a component wrapper):
- name: string, default -. Group name
- value: string, default -. Option value
- checked: boolean, default false. Selected
- showLabel: boolean, default true. Label visibility

Keyboard: Tab: Moves into and out of the group; Arrow keys: Move selection within the group

Accessibility:
- Group with <fieldset> and <legend>.
- All radios in a group share one name.

