# Button (Stable)

> NorthStar component. Category: Actions. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

The button component gives users the ability to perform an action or navigate to another page. They have multiple styles and states for different needs. Includes icon button.

Page: https://mikelrosenthal.com/northstar/#/components/button · Figma node 4038:31741

Classes: `is-focus`, `is-hover`, `is-pressed`, `ns-btn`, `ns-btn--danger`, `ns-btn--ghost`, `ns-btn--icon`, `ns-btn--lg`, `ns-btn--outline`, `ns-btn--secondary`, `ns-btn--sm`

Figma variants: Hierarchy: Primary, Secondary, Outline, Ghost; State: Default, Hover, Pressed, Focus, Disabled; Size: S (32), M (40), L (48); Icons: Show leading icon, Show trailing icon (booleans with instance swaps); Label: Text property; Icon button / Hierarchy: Primary, Secondary, Ghost, Danger; Icon button / Size: S (32), M (40), L (48); Icon button / Icon: Swap the glyph; Icon button / State: Default, Hover, Pressed, Focus, Disabled

Use:
- Primary: actions that require maximum attention. Use only one per page.
- Secondary: secondary actions, or interfaces with low contrast.
- Outline and Ghost: actions that need the least attention on the page.
- Danger (NorthStar extension): destructive actions, always confirmed.
- Icon button: Use Ghost in table rows and toolbars where space is tight.
- Icon button: Show a tooltip with the action name on hover and focus.
- Icon button: Use the L size on touch surfaces so the target stays at 48px.

Avoid:
- Do not use a button for navigation to another page. Use a link.
- Avoid three or more button sizes on one page.
- Icon button: Do not use for primary page actions. Use a Button with a label.
- Icon button: Do not drop the accessible name. Icon-only buttons need aria-label.

- Do: Pair one primary action with an outline action, primary on the right.
- Do not: Stack several primary buttons. Users cannot tell which action matters.

```html
<button class="ns-btn">Button</button>
<button class="ns-btn ns-btn--icon" aria-label="More action"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/></svg></button>
```

## Variants

### Hierarchy

Primary, Secondary, Outline, Ghost.

```html
<button class="ns-btn">Primary</button><button class="ns-btn ns-btn--secondary">Secondary</button><button class="ns-btn ns-btn--outline">Outline</button><button class="ns-btn ns-btn--ghost">Ghost</button>
```

### States

Default, Hover, Pressed, Focus, Disabled.

```html
<button class="ns-btn">Default</button><button class="ns-btn is-hover">Hover</button><button class="ns-btn is-pressed">Pressed</button><button class="ns-btn is-focus">Focus</button><button class="ns-btn" disabled>Disabled</button>
```

### Sizes

S 32, M 40, L 48.

```html
<button class="ns-btn ns-btn--sm">Small</button><button class="ns-btn">Medium</button><button class="ns-btn ns-btn--lg">Large</button>
```

### Icons

Leading, trailing, or both. Swap the icon instance.

```html
<button class="ns-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Leading</button><button class="ns-btn">Trailing<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button><button class="ns-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Both<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
```

### Icon button: Hierarchy

Primary, Secondary, Ghost and Danger share one square shape.

```html
<div style="display:flex;gap:8px;align-items:center"><button class="ns-btn ns-btn--icon" aria-label="Edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button><button class="ns-btn ns-btn--secondary ns-btn--icon" aria-label="Edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button><button class="ns-btn ns-btn--ghost ns-btn--icon" aria-label="Edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button><button class="ns-btn ns-btn--danger ns-btn--icon" aria-label="Delete"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
```

### Icon button: Sizes

S 32, M 40, L 48. Square at every size.

```html
<div style="display:flex;gap:8px;align-items:center"><button class="ns-btn ns-btn--secondary ns-btn--icon ns-btn--sm" aria-label="More actions"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/></svg></button><button class="ns-btn ns-btn--secondary ns-btn--icon" aria-label="More actions"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/></svg></button><button class="ns-btn ns-btn--secondary ns-btn--icon ns-btn--lg" aria-label="More actions"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/></svg></button></div>
```

Tokens: `--ns-interactive-primary` (Primary default (blue/500)), `--ns-interactive-primary-hover` (Primary hover (blue/700)), `--ns-interactive-primary-active` (Primary pressed (purple/500)), `--ns-interactive-secondary-bg` (Secondary fill (gray/8)), `--ns-interactive-secondary-hover` (Secondary hover (gray/7)), `--ns-border-default` (Disabled fill (text --ns-text-disabled)), `--ns-radius-lg` (Corner radius (8px)), `--ns-focus-ring` (Focus ring, 2px with 2px offset), `--ns-interactive-ghost-hover` (Ghost hover), `--ns-status-error` (Danger background), `--ns-density-control` (Height in compact density)

Props (for a component wrapper):
- hierarchy: 'primary' | 'secondary' | 'outline' | 'ghost', default 'primary'. Visual emphasis
- size: 's' | 'm' | 'l', default 'm'. Height
- iconLeading / iconTrailing: ReactNode, default -. Icons
- disabled: boolean, default false. Prevents interaction
- icon (Icon button): ReactNode, default -. Glyph. Required
- hierarchy (Icon button): 'primary' | 'secondary' | 'ghost' | 'danger', default 'secondary'. Visual emphasis
- size (Icon button): 's' | 'm' | 'l', default 'm'. Square height
- aria-label (Icon button): string, default -. Required. Names the action
- disabled (Icon button): boolean, default false. Removes the button from the tab order

Keyboard: Tab: Moves focus to the button; Enter / Space: Activates the button; Tab: Icon button: Moves focus to the button; Enter / Space: Icon button: Activates the button

Accessibility:
- Use a native <button>. Icon-only buttons need aria-label.
- Disabled buttons use the disabled attribute so they leave the tab order.
- Focus shows a 2px ring with a 2px offset. Never remove it.
- Icon button: Use a native button. Icon-only buttons need an aria-label that names the action, such as Edit contact.
- Icon button: Pair the icon with a tooltip so sighted users hear the same name.
- Icon button: Disabled buttons use the disabled attribute so they leave the tab order.

Notes for agents:
- ns-btn--tertiary and ns-btn--outline look the same: transparent with a border. Use tertiary for Cancel and dialog dismissals so the intent is clear in markup.

