# Switch (Stable)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Switches allow users to turn an individual option on or off. They are usually used to activate or deactivate a specific setting.

Page: https://mikelrosenthal.com/northstar/#/components/toggle · Figma node 1842:24379

Classes: `ns-toggle`, `ns-toggle--sm`, `ns-toggle--xs`

Figma variants: State: Default, Hover, Disabled; Selected: Yes, No; Show label: Boolean, on by default

Use:
- Binary settings that take effect immediately.

Avoid:
- Settings that need a Save action: use a checkbox.

- Do: Label the setting, not the state.
- Do not: Use On / Off as the label.

```html
<label class="ns-toggle ns-toggle--xs"><input type="checkbox" role="switch" checked/> Real-time telemetry</label>
```

## Variants

### Sizes

29x16 (Figma), 40x22, 32x18.

```html
<label class="ns-toggle ns-toggle--xs"><input type="checkbox" role="switch" checked/> 29x16</label><label class="ns-toggle"><input type="checkbox" role="switch" checked/> 40x22</label><label class="ns-toggle ns-toggle--sm"><input type="checkbox" role="switch"/> 32x18</label>
```

Tokens: `--ns-interactive-primary` (On track), `--ns-border-strong` (Off track), `--ns-duration-base` (Knob travel)

Props (for a component wrapper):
- checked: boolean, default false. On state
- size: 'xs' | 'sm' | 'md', default 'xs'. Size
- label: string, default -. Setting name

Keyboard: Tab: Focus; Space: Toggle

Accessibility:
- Use role="switch" so screen readers say on/off.

