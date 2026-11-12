# Link (New)

> NorthStar component. Category: Actions. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

A text link for navigation. Links go to a destination, and buttons run an action. External links open in a new tab and say so to screen readers.

Page: https://mikelrosenthal.com/northstar/#/components/link · Figma node 4465:92

Classes: `ns-link`, `ns-link--external`, `ns-link__arrow` · helper classes in the examples: `sr-only`

Figma variants: Type: Default, External; State: Default, Hover, Focus, Disabled

Use:
- Use for navigation, not for actions that change data.
- Write the destination as the label.
- Mark external destinations, and say they open in a new tab.

Avoid:
- Do not use click here or more here as the label.
- Do not style a button as a link for a destructive action.
- Do not rely on color alone. Keep the underline on hover and focus.

- Do: Name the destination in the label.
- Do not: Click here tells a screen reader user nothing about the destination.

```html
<a class="ns-link" href="#">View billing history</a>
```

## Variants

### Default

Inline in body text. The underline always shows.

```html
<p style="margin:0">Review the <a class="ns-link" href="#">billing history</a> before you confirm.</p>
```

### External

Adds an arrow and a hidden note. Opens in a new tab.

```html
<a class="ns-link ns-link--external" href="#" target="_blank" rel="noopener">Product documentation<span class="ns-link__arrow" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
```

Tokens: `--ns-text-link` (Default link color), `--ns-text-accent` (Hover color), `--ns-focus-field` (Focus ring), `--ns-text-disabled` (Disabled link)

Props (for a component wrapper):
- href: string, default -. Destination. A real URL or route
- external: boolean, default false. Opens in a new tab with a hidden note
- disabled: boolean, default false. Sets aria-disabled and removes the link from interaction

Keyboard: Tab: Moves focus to the link; Enter: Follows the link

Accessibility:
- Use a native a element with href. Do not use a div with a click handler.
- External links set target and rel=noopener, and include a hidden note that the link opens in a new tab.
- Disabled links use aria-disabled and lose their href.

