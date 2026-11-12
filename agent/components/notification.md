# Notification (Stable)

> NorthStar component. Category: Feedback. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Notifications communicate system messages: inline in context, or as toasts that appear and dismiss themselves. Includes toast.

Page: https://mikelrosenthal.com/northstar/#/components/notification · Figma node 4209:150

Classes: `ns-btn`, `ns-btn--ghost`, `ns-btn--sm`, `ns-btn--tertiary`, `ns-helper`, `ns-notice`, `ns-notice--error`, `ns-notice--info`, `ns-notice--success`, `ns-notice--toast`, `ns-notice__body`, `ns-notice__close`, `ns-notice__icon`, `ns-notice__title`

Figma variants: Toast / Status: Info, Success, Warning, Error; Toast / Action: None or one button; Toast / Message: Shown or hidden

Use:
- Inline: messages tied to a section.
- Toast: confirmation of a completed action.
- Toast: Confirming the result of an action the person just took.
- Toast: Offering Undo instead of a confirm dialog for reversible changes.
- Toast: Keeping titles under 40 characters.

Avoid:
- Critical, blocking issues: use a modal.
- Toast: Do not use for errors the person must fix. Show those inline.
- Toast: Do not put more than one action in a toast.
- Toast: Do not auto-dismiss error toasts.

- Do: Say what happened and what to do next.
- Do not: Show raw error codes alone.

```html
<div style="display:grid;gap:16px;justify-items:center;width:100%"><div class="ns-notice ns-notice--info" role="status" style="width:440px"><span class="ns-notice__icon">i</span><div><p class="ns-notice__title">Portal update available</p><p class="ns-notice__body">v1.4.0 is ready to deploy.</p></div><button class="ns-notice__close" aria-label="Dismiss">×</button></div><button class="ns-btn ns-btn--tertiary ns-btn--sm" data-toast="Portal update available" data-kind="info">Fire as toast</button></div>
<div class="ns-notice ns-notice--toast ns-notice--success" role="status" style="width:360px"><span class="ns-notice__icon" aria-hidden="true">✓</span><div><p class="ns-notice__title">Account archived</p><p class="ns-notice__body">Acme Corp moved to the archive.</p></div><button class="ns-btn ns-btn--ghost ns-btn--sm">Undo</button></div>
```

## Variants

### Toast: Success

Confirms a finished action, with Undo.

```html
<div class="ns-notice ns-notice--toast ns-notice--success" role="status" style="width:360px"><span class="ns-notice__icon" aria-hidden="true">✓</span><div><p class="ns-notice__title">Account archived</p><p class="ns-notice__body">Acme Corp moved to the archive.</p></div><button class="ns-btn ns-btn--ghost ns-btn--sm">Undo</button></div>
```

### Toast: Error

Uses role=alert and stays until dismissed.

```html
<div class="ns-notice ns-notice--toast ns-notice--error" role="alert" style="width:360px"><span class="ns-notice__icon" aria-hidden="true">!</span><div><p class="ns-notice__title">Account not saved</p><p class="ns-notice__body">Check the billing email and try again.</p></div><button class="ns-notice__close" aria-label="Dismiss notification">×</button></div>
```

Tokens: `--ns-status-info / success / warning / error` (Accent, border, tint), `--ns-elevation-03` (Toast shadow), `--ns-background-elevated` (Toast surface), `--ns-status-success` (Success icon), `--ns-status-error` (Error icon)

Props (for a component wrapper):
- kind: 'info' | 'success' | 'warning' | 'error', default 'info'. Severity
- title: string, default -. Heading
- subtitle: string, default -. Body
- timeout: number, default 0. Auto-dismiss (toast)
- status (Toast): 'info' | 'success' | 'warning' | 'error', default 'info'. Sets color, icon and role
- title (Toast): string, default -. Short result, under 40 characters
- message (Toast): string, default -. Optional detail
- action (Toast): { label, onClick }, default -. Optional single action
- onDismiss (Toast): () => void, default -. Close control

Keyboard: Tab: Focus dismiss or action; Enter: Dismiss; Tab: Toast: Moves to the action or close button; Enter / Space: Toast: Activates the focused button

Accessibility:
- Errors use role="alert"; others use role="status" so they are announced politely.
- Toast: Information and success use role=status, which announces politely without interrupting.
- Toast: Error uses role=alert, so it interrupts the screen reader.
- Toast: Give the close button a name, such as Dismiss notification.

