# Modal (Stable)

> NorthStar component. Category: Overlays. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Modals focus attention on a single task or decision and block the rest of the page until dismissed.

Page: https://mikelrosenthal.com/northstar/#/components/modal · Figma node 4211:201

Classes: `ns-btn`, `ns-btn--danger`, `ns-btn--tertiary`, `ns-modal`, `ns-modal--inline`, `ns-modal__body`, `ns-modal__foot`, `ns-modal__head`, `ns-modal__label`, `ns-modal__title` · helper classes in the examples: `icon-btn`

Use:
- Confirming destructive or irreversible actions.
- Short, focused tasks that need an answer now.

Avoid:
- Long forms: use a full page or side panel.
- Non-blocking info: use a notification.

- Do: Label actions with the verb: Revoke, Delete, Publish.
- Do not: Use Yes / No. People skim buttons, not questions.

```html
<div style="display:grid;gap:20px;justify-items:center;width:100%"><div class="ns-modal ns-modal--inline" role="dialog" aria-labelledby="mdl-t"><div class="ns-modal__head"><div><p class="ns-modal__label">Account access</p><h2 class="ns-modal__title" id="mdl-t">Revoke API credentials?</h2></div><button class="icon-btn" aria-label="Close">×</button></div><div class="ns-modal__body">Revoking credentials for Acme Corp stops 14 active integrations immediately.</div><div class="ns-modal__foot"><button class="ns-btn ns-btn--tertiary">Cancel</button><button class="ns-btn ns-btn--danger">Revoke</button></div></div><button class="ns-btn ns-btn--tertiary" data-open-modal>Open live modal</button></div>
```

Tokens: `--ns-background-elevated` (Surface), `--ns-elevation-04` (Shadow), `--ns-radius-xl` (Radius), `--ns-duration-slow + --ns-easing-enter` (Entrance)

Props (for a component wrapper):
- open: boolean, default false. Visibility
- danger: boolean, default false. Destructive styling
- primaryButtonText: string, default -. Action
- onRequestClose: () => void, default -. Close

Keyboard: Tab / Shift+Tab: Cycles within the modal (focus trap); Esc: Closes; Enter: Activates focused button

Accessibility:
- role="dialog", aria-modal="true", aria-labelledby the title.
- Focus moves in on open and returns to the trigger on close. Try the live modal.

Notes for agents:
- Keep the modal in the page, closed: <div class="ns-modal-backdrop" id="confirm-x" hidden><div class="ns-modal ns-modal--sm" role="dialog" aria-modal="true" aria-labelledby="confirm-x-title">...</div></div>. The trigger gets data-open-modal="confirm-x"; Cancel and the close button get data-close. js/ns-behavior.js moves focus in, traps it, closes on Escape or a backdrop click and returns focus to the trigger.
- The close button is <button class="ns-btn ns-btn--ghost ns-btn--icon ns-btn--sm" type="button" aria-label="Close" data-close>×</button>. The docs examples show icon-btn, which is a docs-site class; do not copy it.
- See agent/templates/analytical-list.html for a full confirmation.

