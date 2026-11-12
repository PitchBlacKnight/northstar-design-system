# Alert banner (Stable)

> NorthStar component. Category: Feedback. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

In-line alerts display a non-modal message associated with objects in a view.

Page: https://mikelrosenthal.com/northstar/#/components/alert-banner · Figma node 1727:18329

Classes: `ns-alert`, `ns-alert--accent`, `ns-alert--compact`, `ns-alert--default`, `ns-alert--error`, `ns-alert--success`, `ns-alert--warning`, `ns-alert__actions`, `ns-alert__close`, `ns-alert__desc`, `ns-alert__end`, `ns-alert__icon`, `ns-alert__title`, `ns-btn`, `ns-btn--ghost`, `ns-btn--outline`, `ns-helper`

Figma variants: Status: Default, Accent, Error, Success, Warning; Buttons: Yes, No; Description: Yes, No

Use:
- Messages tied to a view or object.
- App-wide notices when placed above the content.

Avoid:
- Transient confirmations: use a toast notification.

- Do: Say what happened and how to proceed.
- Do not: Stack several banners.

```html
<div class="ns-alert ns-alert--default" role="status" style="max-width:1152px"><span class="ns-alert__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 16v-4M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg></span><div><p class="ns-alert__title">The title identifies what happened</p><p class="ns-alert__desc">The body content lets the user know why, and how to remedy or proceed.</p><div class="ns-alert__actions"><button class="ns-btn ns-btn--outline">Button example</button><button class="ns-btn ns-btn--ghost">Button example</button></div></div><div class="ns-alert__end"><button class="ns-alert__close" aria-label="Dismiss">×</button></div></div>
```

## Variants

### All types

Default, Accent, Error, Success, Warning.

```html
<div class="ns-alert ns-alert--default ns-alert--compact" style="width:100%"><span class="ns-alert__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg></span><p class="ns-alert__title">Default: the title identifies what happened</p><div class="ns-alert__end"><button class="ns-alert__close" aria-label="Dismiss">×</button></div></div><div class="ns-alert ns-alert--accent ns-alert--compact" style="width:100%"><span class="ns-alert__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg></span><p class="ns-alert__title">Accent: the title identifies what happened</p><div class="ns-alert__end"><button class="ns-alert__close" aria-label="Dismiss">×</button></div></div><div class="ns-alert ns-alert--error ns-alert--compact" style="width:100%"><span class="ns-alert__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg></span><p class="ns-alert__title">Error: the title identifies what happened</p><div class="ns-alert__end"><button class="ns-alert__close" aria-label="Dismiss">×</button></div></div><div class="ns-alert ns-alert--success ns-alert--compact" style="width:100%"><span class="ns-alert__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg></span><p class="ns-alert__title">Success: the title identifies what happened</p><div class="ns-alert__end"><button class="ns-alert__close" aria-label="Dismiss">×</button></div></div><div class="ns-alert ns-alert--warning ns-alert--compact" style="width:100%"><span class="ns-alert__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg></span><p class="ns-alert__title">Warning: the title identifies what happened</p><div class="ns-alert__end"><button class="ns-alert__close" aria-label="Dismiss">×</button></div></div>
```

Tokens: `--ns-status-info-bg` (Default and accent fill), `--ns-status-info` (Default and accent icon), `--ns-status-error` (Error icon (fill --ns-status-error-bg)), `--ns-status-success` (Success icon (fill --ns-status-success-bg)), `--ns-status-warning` (Warning icon (fill --ns-status-warning-bg)), `--ns-radius-sm` (Radius)

Props (for a component wrapper):
- type: 'default' | 'accent' | 'error' | 'success' | 'warning', default 'default'. Semantic type
- title: string, default -. What happened
- description: string, default -. Why, and how to proceed
- actions: Action[], default []. Up to two buttons
- onClose: () => void, default -. Dismiss

Keyboard: Tab: Focus actions and close; Enter: Activate

Accessibility:
- Errors use role="alert"; others use role="status".

Notes for agents:
- ns-alert--default and ns-alert--accent both give the info treatment (status-info-bg surface, status-info icon).

