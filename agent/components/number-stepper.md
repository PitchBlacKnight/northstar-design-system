# Number stepper (New)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

An integer field with decrement and increment buttons, for small counts with a clear minimum and maximum. People can also type the number directly.

Page: https://mikelrosenthal.com/northstar/#/components/number-stepper · Figma node 4466:261

Classes: `ns-field`, `ns-label`, `ns-stepper`

Figma variants: State: Default, Focus, At minimum, At maximum, Disabled

Use:
- Use for small counts with a clear minimum and maximum.
- Let people type the number as well as step it.
- Disable a button when the value is at its limit.

Avoid:
- Do not use for money or large numbers. Use Input.
- Do not hide the minimum and maximum.
- Do not use when the value is better chosen from a list. Use Select.

- Do: State the range in the label. The buttons disable at the limits.
- Do not: Money does not belong in a stepper. Use Input.

```html
<div class="ns-stepper" role="group" aria-label="Sites"><button type="button" aria-label="Decrease"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg></button><input type="number" inputmode="numeric" value="3" min="1" max="50" aria-label="Sites"/><button type="button" aria-label="Increase"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div>
```

## Variants

### Default

A value between the minimum and maximum.

```html
<div class="ns-stepper" role="group" aria-label="Sites"><button type="button" aria-label="Decrease"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg></button><input type="number" value="3" min="1" max="50" aria-label="Sites"/><button type="button" aria-label="Increase"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div>
```

### At minimum

The decrement button is disabled and stays visible.

```html
<div class="ns-stepper" role="group" aria-label="Sites"><button type="button" aria-label="Decrease" disabled><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg></button><input type="number" value="1" min="1" max="50" aria-label="Sites"/><button type="button" aria-label="Increase"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div>
```

Tokens: `--ns-border-default` (Outline), `--ns-background-hover` (Button hover), `--ns-text-disabled` (Disabled buttons), `--ns-density-control` (Height)

Props (for a component wrapper):
- value: number, default -. Current value
- min: number, default -. Lower limit. Decrement disables at it
- max: number, default -. Upper limit. Increment disables at it
- step: number, default 1. Amount per click
- onChange: (n) => void, default -. Called with the new value

Keyboard: Arrow up / down: Steps by 1; Page up / down: Steps by 10; Home / End: Jumps to the minimum or maximum

Accessibility:
- The input is a native number input with aria-label, min and max, so screen readers announce the range.
- Buttons have names such as Decrease and Increase, and use the disabled attribute at the limits.
- The group has a name, such as Sites, so the buttons are announced in context.

